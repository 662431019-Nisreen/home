# บ้านเรา — สมุดรายจ่ายสร้างบ้าน

เว็บพร้อมใช้งาน: https://baan-rao-expenses.nasmeekaree.workers.dev

ใช้ Google Login ผ่าน Auth.js และบันทึกออนไลน์ใน Cloudflare D1 แพ็กเกจ Free ตั้งค่า OAuth และเผยแพร่แล้ว

## เปิดใน VS Code

Repository สาธารณะไม่รวมรูปครอบครัว `public/family-home.png` รหัสลับใน `.dev.vars` หรือข้อมูลฐานข้อมูล ก่อนเผยแพร่จาก checkout ใหม่ ให้วางรูปที่ต้องการใช้ในตำแหน่งดังกล่าว และตั้งค่า secrets ของโฮสต์แยกต่างหาก

เปิดโฟลเดอร์นี้ผ่าน File → Open Folder ไฟล์หน้าจอหลักคือ `app/expense-app.tsx` และ `app/globals.css` API อยู่ที่ `app/api/expenses/route.ts`

## พัฒนาในเครื่อง
ต้องใช้ Node.js ตาม package.json

```
npm ci
npm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_charming_hedge_knight.sql
npm run dev
```
เปิด URL ที่ terminal แสดง แล้วตั้งค่า Google Login ตาม GOOGLE-LOGIN.md ข้อมูลพัฒนาแยกจากข้อมูลจริง

## ฐานข้อมูล
schema อยู่ที่ `db/schema.ts` migrations อยู่ที่ `drizzle/` และ `.openai/hosting.json` ประกาศ D1 binding `DB` ต้อง apply migrations ในเครื่องหลัง build ตามคำสั่ง Wrangler ในคู่มือ Sites การเผยแพร่ผ่าน Sites จะ apply migrations สำหรับฐานข้อมูลออนไลน์

## ใช้บนโทรศัพท์
เปิด URL เว็บจริงและเข้าสู่ระบบด้วยบัญชี Google ที่ได้รับอนุญาต (nasmeekaree@gmail.com) จากนั้นเพิ่มลงหน้าจอหลักผ่านเมนู Share ของ Safari หรือเมนูของ Chrome ต้องมีอินเทอร์เน็ตเพื่อโหลดและบันทึกข้อมูล รายการสำรอง JSON เก็บ `amount` เป็นสตางค์

เงินที่ฝากให้คนอื่นไปซื้อของควรจดเป็นรายจ่ายเมื่อทราบยอดซื้อจริง เพื่อไม่ให้ยอดซ้ำกับเงินฝาก
