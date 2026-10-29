import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {title:'บ้านเรา • สมุดรายจ่ายสร้างบ้าน',description:'จดง่าย เห็นทุกบาทที่ใช้สร้างบ้าน เก็บข้อมูลออนไลน์ส่วนตัว',icons:{icon:'/favicon.svg'},appleWebApp:{capable:true,title:'บ้านเรา',statusBarStyle:'default'}};
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="th"><body>{children}</body></html>; }
