# TAUTAN RASA - E-commerce Website

Website e-commerce untuk TAUTAN RASA yang menjual perhiasan handmade dengan bunga asli yang diawetkan dalam resin berkualitas tinggi.

## 🌸 Tentang TAUTAN RASA

TAUTAN RASA adalah brand perhiasan handmade yang mengabadikan bunga asli. Kami menggunakan bunga asli yang dikombinasikan dengan resin berkualitas tinggi untuk mencegah kekeruhan, serta stainless steel hypoallergenic yang aman untuk kulit.

## 🚀 Fitur Utama

### Frontend (Website Katalog)
- ✅ **Hero Carousel** - Slider gambar utama dengan auto-slide
- ✅ **Navigation** - Menu navigasi dengan login/register button
- ✅ **Company Profile** - Informasi lengkap tentang TAUTAN RASA
- ✅ **Testimonials** - Review dari customer
- ✅ **Product Advantages** - Keunggulan produk
- ✅ **News Gallery** - Galeri berita dan kegiatan
- ✅ **Shop by Categories** - Kategori produk utama
- ✅ **Authentication** - Halaman login dan register
- ✅ **Shopping Cart** - Keranjang belanja dengan calculation
- ✅ **Checkout** - Halaman pemesanan lengkap
- ✅ **Products** - Katalog produk (sementara statis)

### Backend (Admin Dashboard)
- ✅ **Dashboard Overview** - Statistik dan ringkasan
- ✅ **Categories Management** - CRUD kategori produk
- ✅ **Products Management** - CRUD produk dengan upload gambar
- ✅ **Orders Management** - Kelola pesanan customer
- ✅ **Users Management** - Kelola data pengguna
- ✅ **Reviews Management** - Moderasi ulasan produk

## 📁 Struktur Database

Database MySQL dengan tabel-tabel berikut:

```sql
- categories (kategori produk)
- products (data produk) 
- users (pengguna & admin)
- carts & cart_items (keranjang belanja)
- orders & order_items (pesanan)
- provinces & cities (data wilayah untuk ongkir)
- shipping_costs (log ongkir RajaOngkir)
- payments (pembayaran Midtrans)
- refunds (refund)
- reviews (ulasan produk)
```

## 🛠 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes (akan dibuat)
- **Database**: MySQL 
- **Authentication**: NextAuth.js (akan diintegrasikan)
- **Payment**: Midtrans (akan diintegrasikan) 
- **Shipping**: RajaOngkir API (akan diintegrasikan)
- **Image Upload**: Cloudinary atau local storage

## 📦 Installation

1. **Clone repository**
```bash
git clone https://github.com/Hamidzuhdi/tautanrasa.git
cd tautanrasa
```

2. **Install dependencies**
```bash
npm install
```

3. **Run development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🗂 Struktur Folder

```
src/
├── app/                    # App Router (Next.js 13+)
│   ├── admin/             # Dashboard admin
│   │   ├── dashboard/     # Overview admin
│   │   ├── products/      # Kelola produk
│   │   ├── categories/    # Kelola kategori  
│   │   └── layout.tsx     # Layout admin
│   ├── cart/              # Keranjang belanja
│   ├── checkout/          # Halaman checkout
│   ├── login/             # Halaman login
│   ├── register/          # Halaman register
│   ├── products/          # Katalog produk
│   └── page.tsx           # Homepage
├── components/            # Reusable components
│   ├── AuthButton.tsx     # Button login/register
│   ├── CartButton.tsx     # Button keranjang
│   ├── NavigationButtons.tsx
│   ├── MobileMenu.tsx
│   └── SearchInput.tsx
└── public/
    ├── img/               # Gambar statis website
    └── uploads/           # Upload gambar produk
        └── products/      # Gambar produk dari admin
```

## 🎯 Roadmap (Next Steps)

### Phase 1: Database Integration
- [ ] Setup Prisma ORM atau MySQL2
- [ ] Create API routes untuk CRUD operations
- [ ] Integrasi authentication dengan NextAuth.js
- [ ] Connect halaman admin dengan database
- [ ] Dynamic product listing dari database

### Phase 2: E-commerce Features  
- [ ] Shopping cart dengan state management (Zustand/Redux)
- [ ] Checkout flow dengan RajaOngkir API
- [ ] Payment integration dengan Midtrans
- [ ] Order management system
- [ ] Email notifications

## 📱 Pages & Routes

### Public Routes
- `/` - Homepage dengan hero, about, testimonials
- `/products` - Katalog produk dengan filter & search
- `/cart` - Keranjang belanja
- `/checkout` - Halaman checkout
- `/login` - Halaman login
- `/register` - Halaman register

### Admin Routes (Protected)
- `/admin/dashboard` - Overview statistik
- `/admin/products` - Kelola produk
- `/admin/categories` - Kelola kategori

## 🔧 Development Notes

### Saat Ini (Status: Katalog Statis)
- Website sudah berjalan sebagai katalog statis
- Admin dashboard UI sudah ready
- Cart & checkout flow sudah ready
- **Belum ada**: Database connection, API routes, authentication

### ✅ **COMPLETED - Database & Authentication Ready!**

**Database Connection:** ✅ MySQL with Prisma ORM  
**Authentication:** ✅ NextAuth.js dengan role-based access  
**API Routes:** ✅ CRUD endpoints untuk categories, products, auth  
**Admin Dashboard:** ✅ Siap untuk testing CRUD operations  
**Sample Data:** ✅ Admin user dan produk contoh tersedia  

### 🧪 **Testing Guide**

**1. Login Admin:**
- Buka `http://localhost:3000/login`
- Email: `admin@tautanrasa.com`
- Password: `admin123`

**2. Test Admin Dashboard:**
- Setelah login, click dropdown user > "Dashboard Admin"
- Atau langsung ke `http://localhost:3000/admin/dashboard`
- Test CRUD products di `/admin/products`
- Test CRUD categories di `/admin/categories`

**3. Database Setup Required:**
```bash
# Update DATABASE_URL di .env sesuai MySQL Anda:
DATABASE_URL="mysql://username:password@localhost:3306/tautanrasa"

# Jalankan database migration:
npx prisma db push

# Seed data (admin user + sample products):
npx tsx scripts/seed.ts
```

### 🔄 **Next Development Phase:**
1. **File Upload** - Image upload untuk produk di admin
2. **Frontend Integration** - Connect UI dengan API endpoints  
3. **Cart State Management** - Real shopping cart functionality
4. **Payment Integration** - Midtrans untuk pembayaran
5. **Order Management** - Complete order flow

---

**TAUTAN RASA** - Where Every Flowers Tell a Story 🌸
