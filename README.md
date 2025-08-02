# ArahSekolah 🗺️  
**Teman pintar untuk mencari SD terbaik se-Bandung.**

ArahSekolah memadukan peta interaktif, katalog sekolah lengkap, dan ulasan orang tua dalam satu web-app. Tujuannya sederhana: membantu Anda memilih sekolah dasar tanpa pusing—cukup telusuri, bandingkan, dan putuskan.

---

## ✨ Fitur yang ada di ArahSekolah

- **Peta Interaktif** – Lihat letak semua SD di Bandung beserta detail singkat lewat penanda custom (Leaflet.js).  
- **Katalog >400 Sekolah** – Status, alamat, kontak, program, hingga prestasi tersaji rapi.  
- **Ulasan & Peringkat** – Orang tua bisa memberi rating (kenyamanan, fasilitas, pembelajaran, kepemimpinan) dan satu ulasan per sekolah.  
- **Autentikasi Aman** – NextAuth.js dengan opsi Email/Password & Google OAuth.  
- **Role-Based Access** – Superadmin, School Admin, dan User; tiap peran punya haknya sendiri.  

---

## 🌱 Roadmap Singkat

1. **Pendaftaran & Pembayaran Online** – Orang tua dapat mendaftarkan anak dan membayar biaya sekolah langsung di ArahSekolah.  
2. **Perluasan Jenjang** – Menambah SMP, SMA, hingga Perguruan Tinggi untuk jadi panduan pendidikan terlengkap.  
3. **Portal Komunitas Sekolah** – Ruang berbagi artikel, prestasi, dan cerita inspiratif antar sekolah-orang tua.  

---

## 🛠️ Stack yang digunakan

| Kategori        | Teknologi Utama                                                    |
| --------------- | ------------------------------------------------------------------ |
| Framework       | Next.js (App Router)                                               |
| Bahasa          | TypeScript                                                         |
| Database & ORM  | PostgreSQL · Prisma                                                |
| Autentikasi     | NextAuth.js                                                        |
| Styling         | Tailwind CSS · shadcn/ui                                           |
| State & Fetch   | Redux Toolkit · TanStack Query (React Query)                       |
| Peta            | Leaflet.js · React Leaflet                                         |
| Validasi Form   | React Hook Form · Zod                                              |

---

## 🚀 Cara Instal

> **Catatan:** Langkah di bawah sama persis dengan README sebelumnya—kami pertahankan untuk memudahkan.

### 1. Requirement
- Node.js ≥ 18  
- Git  
- PostgreSQL aktif

### 2. Instalasi
```bash
git clone https://github.com/naufalmaa/arahsekolah.git
cd arahsekolah

# pilih manajer paket
npm install   # atau yarn install / pnpm install
````

### 3. Variabel Lingkungan

Buat `.env` di root (salin `.env.example` bila ada) contohnya seperti ini:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/arahsekolah"
GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID"
GOOGLE_CLIENT_SECRET="YOUR_GOOGLE_CLIENT_SECRET"
NEXTAUTH_SECRET="YOUR_NEXTAUTH_SECRET"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 4. Migrasi & Seed

```bash
npx prisma migrate dev --name init
npm run seed
# Superadmin default:
# Email    : superadmin@mail.com
# Password : 123superadmin
```

### 5. Jalankan Dev Server

```bash
npm run dev
```

Buka `http://localhost:3000` di browser—selamat menjelajah! 🚀

---

Penjelasan singkat tentang fungsi-fungsi para pengguna:

📖 Penggunaan & Peran Pengguna
Aplikasi ini memiliki tiga peran pengguna dengan kemampuan yang berbeda:

👤 Pengguna Biasa (USER)

Dapat mendaftar dan masuk menggunakan email/password atau akun Google.

Dapat menelusuri semua sekolah melalui peta atau daftar.

Dapat melihat detail lengkap sekolah.

Dapat menambahkan satu ulasan untuk setiap sekolah.

Dapat mengedit atau menghapus ulasan mereka sendiri.

🏫 Admin Sekolah (SCHOOL_ADMIN)

Semua kemampuan USER.

Tidak dapat menambahkan ulasan.

Dapat mengedit informasi detail sekolah yang ditugaskan kepadanya.

Dapat menghapus ulasan apa pun yang ada di sekolah yang ditugaskan.

Peran ini ditetapkan oleh Superadmin.

👑 Super Admin (SUPERADMIN)

Memiliki semua hak akses.

Dapat mengakses halaman Manajemen Pengguna.

Dapat membuat, mengedit, dan menghapus akun pengguna lain.

Dapat menetapkan peran (USER, SCHOOL_ADMIN).

Dapat menugaskan SCHOOL_ADMIN ke sekolah tertentu.

Dapat mengedit informasi sekolah apa pun.

---