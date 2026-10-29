# เข้าสู่ระบบด้วย Google
ตั้งค่า Google Login และทดสอบบนเว็บจริงสำเร็จแล้ว: https://baan-rao-expenses.nasmeekaree.workers.dev

ขั้นตอนด้านล่างสำหรับการตั้งค่าใหม่หรือดูแลระบบภายหลัง

1. เปิด Google Cloud Console https://console.cloud.google.com/ เลือกหรือสร้างโครงการ
2. ตั้งค่า Google Auth Platform: Branding, Audience (External) และเพิ่ม Gmail ของคุณใน Test users ถ้าเป็น Testing
3. สร้าง OAuth client ชนิด Web application
4. เพิ่ม Authorized redirect URI สำหรับทดลอง: `http://127.0.0.1:5173/api/auth/callback/google`
5. คัดลอก `.dev.vars.example` เป็น `.dev.vars` ในโฟลเดอร์โครงการ และใส่ `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `AUTH_ALLOWED_EMAILS` (Gmail ของคุณ)
6. สร้าง `AUTH_SECRET` ด้วยคำสั่ง `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"` แล้วนำผลไปใส่ไฟล์เอง
7. รัน `npm run dev` ใหม่ เปิด http://127.0.0.1:5173 แล้วกดเข้าสู่ระบบด้วย Google

ไม่ต้องส่งรหัสผ่าน Gmail หรือ Client Secret ในแชต เก็บ `.dev.vars` ไว้เฉพาะในเครื่อง

บัญชีที่ไม่อยู่ใน AUTH_ALLOWED_EMAILS หรืออีเมลที่ Google ยังไม่ยืนยันจะเข้าไม่ได้
ข้อมูลผูกกับ Google account ID ไม่ใช่อีเมล รายการเก่าที่ผูกกับบัญชีทดลอง/ChatGPT ยังอยู่ในฐานข้อมูล แต่ไม่ถูกย้ายให้อัตโนมัติ ต้องสำรองและวางแผนย้ายข้อมูลก่อนใช้งานจริง

## ออนไลน์
เวอร์ชันนี้เตรียมสำหรับ Cloudflare Workers โฮสต์แยกที่ใช้ Google Login โดยตรง ต้องมี D1 binding DB และ apply migrations เดิม ใช้ HTTPS domain จริงใน AUTH_URL และเพิ่ม redirect URI `https://โดเมนจริง/api/auth/callback/google` ใน Google Cloud ตั้งค่า secret ที่โฮสต์จริง เว็บส่วนตัวของ Sites ยังมีการเข้าสู่ระบบ ChatGPT หน้าโฮสต์ จึงไม่ควรเผยแพร่ผ่านช่องทางนั้นหากต้องการใช้ Google อย่างเดียว เผยแพร่ผ่าน Cloudflare Workers แยกสำเร็จแล้ว และทดสอบการเข้าสู่ระบบด้วย Google บนลิงก์จริงแล้ว
