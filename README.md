# Resume / Portfolio Website

เว็บ resume แบบ static: HTML + CSS + JS ล้วน ไม่มี framework ไม่มี build step
ทั้งเว็บหนักราว 20 KB จึงโหลดเร็วมาก

## โครงสร้างไฟล์
```
index.html   ← เนื้อหาทั้งหมด (แก้ข้อความตรงนี้)
style.css    ← หน้าตาเว็บ, dark mode, responsive, print
script.js    ← สลับธีม, animation ตอน scroll, ไฮไลต์เมนู
assets/      ← ใส่ resume.pdf และรูป project
```

## สิ่งที่ต้องแก้ก่อนขึ้นเว็บ
- ค้นหาคำว่า `[` ใน index.html แล้วเติมข้อมูลจริง (นามสกุล ปี บริษัท มหาวิทยาลัย ตัวเลขสถิติ)
- `your.email@example.com` และ `USERNAME` (GitHub / LinkedIn)
- วางไฟล์ `assets/resume.pdf`
- รูป project: แทน `<span>🏥</span>` ด้วย `<img src="assets/xxx.webp" alt="..." loading="lazy">`
  (แนะนำให้ใช้ไฟล์ .webp กว้างประมาณ 800px)

## ขึ้น GitHub Pages
1. สร้าง repo ชื่อ **`USERNAME.github.io`** (USERNAME = ชื่อบัญชี GitHub ของคุณ)
   เว็บจะอยู่ที่ `https://USERNAME.github.io`
   (ถ้าใช้ชื่อ repo อื่น เช่น `resume` เว็บจะอยู่ที่ `https://USERNAME.github.io/resume`)
2. Push โค้ดขึ้นไป
   ```bash
   git init
   git add .
   git commit -m "Initial resume site"
   git branch -M main
   git remote add origin https://github.com/USERNAME/USERNAME.github.io.git
   git push -u origin main
   ```
3. ไปที่ repo → **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main` / `/ (root)` → Save
4. รอ 1–2 นาที เว็บก็จะออนไลน์

## ผูกโดเมนของตัวเอง (ทำทีหลังได้)
1. Settings → Pages → Custom domain ใส่ `yourname.com` แล้วกด Save
2. ที่ DNS ของโดเมน:
   - A record `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - CNAME `www` → `USERNAME.github.io`
3. ติ๊ก **Enforce HTTPS** (SSL ฟรี)
