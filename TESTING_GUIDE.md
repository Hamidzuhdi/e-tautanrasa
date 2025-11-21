# TESTING GUIDE - TAUTAN RASA E-COMMERCE

## Prerequisites Setup

### 1. Environment Variables
Copy `.env.example` ke `.env` dan isi dengan kredensial yang valid:

```bash
# Database
DATABASE_URL="mysql://user:password@localhost:3306/tautanrasa"

# JWT Secret
JWT_SECRET="superrahasia1234567890"

# Midtrans Configuration (Sandbox untuk testing)
MIDTRANS_SERVER_KEY="SB-Mid-server-xxx"  # Dari dashboard Midtrans
MIDTRANS_CLIENT_KEY="SB-Mid-client-xxx"  # Dari dashboard Midtrans
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY="SB-Mid-client-xxx"
MIDTRANS_IS_PRODUCTION="false"
NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION="false"

# RajaOngkir Configuration
RAJAONGKIR_API_KEY="your-rajaongkir-api-key"  # Dari rajaongkir.com
ORIGIN_CITY_ID="444"  # 444 = Kota Surabaya

# Application URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 2. Database Migration
Pastikan database sudah di-migrate:
```bash
npx prisma migrate dev
npx prisma generate
```

### 3. Install Dependencies
```bash
npm install
```

## Testing Flow

### A. REGISTRASI & LOGIN
1. **Registrasi User Baru**
   - Buka: http://localhost:3000/register
   - Isi form dengan data valid
   - Submit → User akan terdaftar dan auto-login

2. **Login (jika sudah punya akun)**
   - Buka: http://localhost:3000/login
   - Masukkan email & password
   - Submit → Redirect ke homepage

### B. ADD TO CART
1. **Dari Homepage**
   - Scroll ke section "New Launching - Drawstring Collection" atau "Charm Series"
   - Klik produk → Modal detail produk muncul
   - Pilih quantity
   - Klik "Tambah ke Keranjang"
   - Alert sukses muncul

2. **Verifikasi Cart**
   - Klik icon cart di navbar
   - Atau buka: http://localhost:3000/customers/cart (jika ada)
   - Produk yang ditambahkan harus muncul

### C. CHECKOUT FLOW
1. **Buka Halaman Checkout**
   - Klik tombol "Checkout" dari cart
   - Atau langsung buka: http://localhost:3000/checkout
   - **PENTING:** Harus sudah login, jika belum akan redirect ke /login?returnUrl=/checkout

2. **Isi Form Alamat Pengiriman**
   - Nama Penerima: (isi nama lengkap)
   - Nomor Telepon: (08xxxxxxxxxx)
   - Provinsi: Pilih dari dropdown (contoh: Jawa Timur)
   - Kota/Kabupaten: Pilih setelah provinsi dipilih (contoh: Surabaya)
   - Kode Pos: Auto-fill atau manual
   - Alamat Lengkap: Isi detail jalan, RT/RW, dll

3. **Hitung Ongkir**
   - Klik tombol "Hitung Ongkir"
   - Tunggu loading (memanggil API RajaOngkir)
   - Pilihan kurir muncul (JNE, JNT, POS)

4. **Pilih Kurir**
   - Pilih salah satu opsi kurir dengan klik radio button
   - Perhatikan biaya ongkir dan estimasi pengiriman

5. **Review Ringkasan Pesanan**
   - Cek list produk di kolom kanan
   - Cek subtotal, ongkir, dan total
   - Pastikan semua data benar

6. **Bayar dengan QRIS**
   - Klik tombol "Bayar Sekarang dengan QRIS"
   - Loading "Memproses..." muncul
   - **Popup Midtrans Snap** akan muncul

### D. PAYMENT TESTING (Midtrans Sandbox)

#### Skenario 1: PEMBAYARAN SUKSES
1. Di popup Midtrans, pilih **QRIS**
2. Midtrans sandbox akan generate QR Code
3. **UNTUK TESTING:** Klik tombol "Pay" atau "Success" di halaman testing Midtrans
4. Popup tertutup → Redirect ke halaman sukses
5. **Yang Terjadi di Backend:**
   - Webhook Midtrans dipanggil → `/api/midtrans/webhook`
   - Order status diupdate jadi `PAID`
   - Stok produk dikurangi
   - Payment record dibuat

#### Skenario 2: PEMBAYARAN PENDING
1. Di popup Midtrans, tunggu tanpa melakukan pembayaran
2. Atau klik "Pending" di testing page
3. Order tetap dengan status `PENDING`
4. Stok **TIDAK** dikurangi

#### Skenario 3: PEMBAYARAN EXPIRED/CANCELED
1. Tunggu sampai timeout (15 menit)
2. Atau klik "Cancel" di popup
3. Order status jadi `CANCELED`
4. Stok **TIDAK** dikurangi

### E. VERIFIKASI DATABASE

#### Cek Order yang Dibuat
```sql
SELECT * FROM orders ORDER BY created_at DESC LIMIT 5;
```

**Expected Result:**
- `invoice`: Format `INV/20251121/001`, `INV/20251121/002`, dst
- `invoiceCounter`: 1, 2, 3, dst (counter per hari)
- `status`: PENDING → Berubah jadi PAID setelah webhook
- `userId`: ID user yang login
- `totalHarga`: Subtotal produk
- `ongkir`: Biaya pengiriman
- `alamatKirim`: Alamat yang diinput
- `recipientName`, `recipientPhone`: Data penerima
- `kurir`, `service`: JNE, JNT, atau POS + service

#### Cek Order Items
```sql
SELECT oi.*, p.nama 
FROM order_items oi 
JOIN products p ON p.id = oi.productId 
WHERE orderId = <order_id>;
```

#### Cek Payment Record
```sql
SELECT * FROM payments WHERE orderId = <order_id>;
```

**Expected Result:**
- `transactionStatus`: 'settlement' atau 'pending'
- `paymentType`: 'qris'
- `transactionId`: ID dari Midtrans
- `rawJson`: Full response dari Midtrans

#### Cek Stok Produk (Setelah PAID)
```sql
SELECT id, nama, stok FROM products WHERE id IN (<product_ids>);
```

**Expected:** Stok berkurang sesuai qty yang dibeli

### F. WEBHOOK TESTING (Manual)

Jika ingin test webhook secara manual tanpa Midtrans:

```bash
curl -X POST http://localhost:3000/api/midtrans/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": "INV/20251121/001",
    "transaction_status": "settlement",
    "fraud_status": "accept",
    "status_code": "200",
    "gross_amount": "150000.00",
    "signature_key": "calculated_signature_here",
    "payment_type": "qris",
    "transaction_id": "test-transaction-123"
  }'
```

**NOTE:** Signature harus valid! Gunakan fungsi `verifyMidtransSignature` untuk generate signature yang benar.

## Common Issues & Solutions

### Issue 1: "window.snap is not defined"
**Solution:** 
- Pastikan Midtrans script sudah load di `layout.tsx`
- Tunggu beberapa detik setelah page load
- Check di browser console apakah script loaded

### Issue 2: RajaOngkir return error
**Solution:**
- Cek API key valid
- Pastikan origin city ID benar (444 = Surabaya)
- Cek quota API (starter plan = 1000 requests/month)

### Issue 3: Webhook tidak dipanggil
**Solution:**
- Di production, Midtrans perlu akses public URL
- Untuk testing lokal, gunakan **ngrok** atau **localtunnel**:
  ```bash
  ngrok http 3000
  ```
- Set webhook URL di dashboard Midtrans: `https://your-ngrok-url.ngrok.io/api/midtrans/webhook`

### Issue 4: Signature verification failed
**Solution:**
- Pastikan MIDTRANS_SERVER_KEY di `.env` sama dengan yang di dashboard
- Check format signature: `SHA512(order_id + status_code + gross_amount + server_key)`

### Issue 5: Stock tidak berkurang
**Solution:**
- Cek webhook dipanggil dan berhasil
- Cek transaction_status = 'settlement' atau 'capture' dengan fraud_status = 'accept'
- Cek logs di console server

## Production Checklist

Sebelum deploy ke production:

- [ ] Ganti Midtrans ke mode PRODUCTION:
  - `MIDTRANS_IS_PRODUCTION="true"`
  - `NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION="true"`
  - Ganti server key & client key dengan production keys

- [ ] Set webhook URL di Midtrans Dashboard:
  - Payment Notification URL: `https://yourdomain.com/api/midtrans/webhook`

- [ ] Pastikan database production sudah migrate

- [ ] Test dengan real payment (pakai akun sendiri dulu)

- [ ] Monitor logs untuk error

- [ ] Setup email notification untuk order (opsional)

## API Endpoints Summary

| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/api/auth/login` | POST | Login user |
| `/api/auth/register` | POST | Register user baru |
| `/api/auth/me` | GET | Get current user |
| `/api/cart` | GET | Get cart items |
| `/api/cart` | POST | Add to cart |
| `/api/shipping/provinces` | GET | Get all provinces |
| `/api/shipping/cities?province={id}` | GET | Get cities by province |
| `/api/shipping/cost` | POST | Calculate shipping cost |
| `/api/orders/create` | POST | Create order + Midtrans token |
| `/api/midtrans/webhook` | POST | Webhook dari Midtrans |

## Tech Stack Used

- **Next.js 15** (App Router)
- **TypeScript**
- **Prisma ORM** (MySQL)
- **Midtrans Snap** (QRIS Payment)
- **RajaOngkir API** (Shipping calculation)
- **JWT** (Authentication)
- **TailwindCSS** (Styling)

## Support

Jika ada error atau pertanyaan:
1. Check browser console
2. Check server logs (`npm run dev` output)
3. Check database dengan query SQL
4. Review code di file yang terkait

---

**Happy Testing! 🚀**
