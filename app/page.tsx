import ExpenseApp from './expense-app';
import {authReady,getGoogleUser} from '../lib/google-auth';
export const dynamic='force-dynamic';
export default async function Home(){
 const user=await getGoogleUser();
 if(user)return <ExpenseApp name={user.displayName} signOut="/api/auth/signout"/>;
 return <main className="login-page"><section className="login-card"><div className="login-symbol"><img src="/favicon.svg" alt="บ้านเรา" width={64} height={64}/></div><div><h1>บ้านเรา</h1><p>สมุดรายจ่ายสร้างบ้านของครอบครัว</p>{authReady()?<a className="primary" href="/api/auth/signin">เข้าสู่ระบบด้วย Google</a>:<><button className="primary" disabled>เข้าสู่ระบบด้วย Google</button><p className="login-setup">กำลังเตรียมระบบเข้าสู่ระบบ กรุณาตั้งค่า Google Login ก่อนใช้งาน</p></>}<small>ใช้บัญชี Google ที่เจ้าของเว็บอนุญาต</small></div></section></main>;
}
