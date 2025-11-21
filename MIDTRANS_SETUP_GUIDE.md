# 🔐 Panduan Setup Midtrans QRIS untuk E-Tautanrasa

## ✅ Step 1: Daftar Akun Midtrans Sandbox (GRATIS)

1. Buka: **https://dashboard.sandbox.midtrans.com/register**
2. Isi form registrasi:
   - Business Name: `Tautan Rasa`
   - Email: Email Anda
   - Password: Buat password kuat
3. Verifikasi email yang dikirim Midtrans
4. Login ke dashboard sandbox

---

## ✅ Step 2: Dapatkan API Credentials

1. Setelah login, masuk ke menu **Settings** → **Access Keys**
2. Anda akan melihat:
   ```
   Server Key: SB-Mid-server-XXXXXXXXXXXXXXXX
   Client Key: SB-Mid-client-XXXXXXXXXXXXXXXX
   ```
3. **Copy kedua key tersebut**

---

## ✅ Step 3: Update .env.local

Edit file `.env.local` dan ganti dengan credentials yang baru:

```env
# Midtrans Configuration (Sandbox for testing)
MIDTRANS_SERVER_KEY=SB-Mid-server-PASTE_YOUR_SERVER_KEY_HERE
MIDTRANS_CLIENT_KEY=SB-Mid-client-PASTE_YOUR_CLIENT_KEY_HERE
MIDTRANS_IS_PRODUCTION=false

# Public environment variables for frontend
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=SB-Mid-client-PASTE_YOUR_CLIENT_KEY_HERE
NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION=false
```

**PENTING:** Pastikan Server Key dan Client Key dimulai dengan `SB-Mid-` untuk sandbox.

---

## ✅ Step 4: Restart Server

Setelah update `.env.local`:

1. Stop server (Ctrl+C)
2. Jalankan: `npm run dev`
3. Buka: `http://localhost:3000/checkout`

---

## ✅ Step 5: Test QRIS Payment

1. Login ke akun customer
2. Tambahkan produk ke cart
3. Checkout dan isi form alamat
4. Pilih courier
5. Klik **"Bayar Sekarang dengan QRIS"**

**Expected Result:**
- ✅ Popup Midtrans muncul
- ✅ QRIS Code ditampilkan
- ✅ Bisa scan dengan e-wallet (Gopay, OVO, Dana, dll)

---

## 🧪 Testing Payment di Sandbox

Untuk test pembayaran di sandbox Midtrans:

### Simulasi Success Payment:
Scan QRIS code menggunakan **Midtrans Simulator App** atau gunakan test credentials di dashboard.

### Alternative Testing:
Buka **https://simulator.sandbox.midtrans.com/** untuk simulate payment status.

---

## ❓ Troubleshooting

### Error 401 Unauthorized:
- Server Key salah atau expired
- Pastikan menggunakan **Sandbox Server Key** (dimulai dengan `SB-Mid-server-`)

### QRIS tidak muncul:
- Client Key tidak di-set di `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY`
- Midtrans Snap.js script belum loaded
- Periksa console browser untuk error

### Order tercreate tapi tidak ada popup:
- Periksa apakah `window.snap` sudah tersedia
- Buka DevTools Console dan cek error JavaScript

---

## 🚀 Production Deployment

Ketika sudah siap production:

1. Daftar akun production di: **https://dashboard.midtrans.com/register**
2. Lengkapi verifikasi bisnis
3. Dapatkan Production credentials
4. Update `.env.local`:
   ```env
   MIDTRANS_SERVER_KEY=Mid-server-PRODUCTION_KEY
   MIDTRANS_CLIENT_KEY=Mid-client-PRODUCTION_KEY
   MIDTRANS_IS_PRODUCTION=true
   ```

---

## 📞 Support

Jika ada masalah:
- Midtrans Support: https://support.midtrans.com
- Dokumentasi: https://docs.midtrans.com
- Slack Community: https://midtrans.com/slack
