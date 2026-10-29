import { NextResponse } from 'next/server';
import { and, eq, desc } from 'drizzle-orm';
import { getDb } from '../../../db';
import { expenses } from '../../../db/schema';
import { getGoogleUser } from '../../../lib/google-auth';
export const dynamic = 'force-dynamic';
const json = (data: unknown, status = 200) => NextResponse.json(data, {status, headers: {'Cache-Control':'no-store'}});
type ExpenseInput = {date:string;title:string;amount:number;category:string;recipient:string;note:string;id?:string};
function valid(v: Record<string, unknown>): v is Record<string, unknown> & ExpenseInput {
 if (!v || typeof v.title !== 'string' || !v.title.trim() || v.title.length > 200) return false;
 if (typeof v.amount !== 'number' || !Number.isSafeInteger(v.amount) || v.amount <= 0 || v.amount > 100000000000) return false;
 if (typeof v.category !== 'string' || !['material','labor','other'].includes(v.category)) return false;
 if (typeof v.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(v.date)) return false;
 const d = new Date(v.date + 'T00:00:00Z');
 if (!Number.isFinite(d.getTime()) || d.toISOString().slice(0,10) !== v.date || v.date < '1900-01-01' || v.date > '2200-12-31') return false;
 return typeof v.recipient === 'string' && v.recipient.length <= 200 && typeof v.note === 'string' && v.note.length <= 1000;
}
async function mutate(request: Request, mode: 'add' | 'edit' | 'delete') {
 const user = await getGoogleUser();
 if (!user) return json({error:'กรุณาเข้าสู่ระบบก่อน'},401);
 const origin = request.headers.get('origin');
 if (origin && origin !== new URL(request.url).origin) return json({error:'คำขอไม่ถูกต้อง'},403);
 try {
  const raw = await request.json();
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return json({error:'ข้อมูลไม่ถูกต้อง'},400);
  const body = raw as Record<string, unknown>; const db = getDb();
  if (mode === 'delete') {
   if (typeof body.id !== 'string') return json({error:'รายการไม่ถูกต้อง'},400);
   const rows = await db.delete(expenses).where(and(eq(expenses.id,body.id),eq(expenses.userId,user.userId))).returning();
   return rows.length ? json({ok:true}) : json({error:'ไม่พบรายการนี้'},404);
  }
  if (!valid(body)) return json({error:'กรุณาตรวจสอบข้อมูลและจำนวนเงิน'},400);
  const fields = {date:body.date,title:body.title.trim(),amount:body.amount,category:body.category,recipient:body.recipient.trim(),note:body.note.trim()};
  if (mode === 'edit') {
   if (typeof body.id !== 'string') return json({error:'รายการไม่ถูกต้อง'},400);
   const rows = await db.update(expenses).set(fields).where(and(eq(expenses.id,body.id),eq(expenses.userId,user.userId))).returning();
   return rows.length ? json(rows[0]) : json({error:'ไม่พบรายการนี้'},404);
  }
  const rows = await db.insert(expenses).values({...fields,id:crypto.randomUUID(),userId:user.userId,createdAt:new Date().toISOString()}).returning();
  return json(rows[0],201);
 } catch { return json({error:'บันทึกไม่สำเร็จ กรุณาลองอีกครั้ง'},500); }
}
export async function GET() {
 const user = await getGoogleUser(); if (!user) return json({error:'กรุณาเข้าสู่ระบบก่อน'},401);
 try { return json(await getDb().select().from(expenses).where(eq(expenses.userId,user.userId)).orderBy(desc(expenses.date),desc(expenses.createdAt))); }
 catch { return json({error:'โหลดข้อมูลไม่สำเร็จ กรุณาลองอีกครั้ง'},500); }
}
export const POST = (r:Request) => mutate(r,'add');
export const PATCH = (r:Request) => mutate(r,'edit');
export const DELETE = (r:Request) => mutate(r,'delete');
