# 🚨 PENTING! CARA DAFTAR MIDTRANS UNTUK DAPAT CREDENTIALS YANG BENAR

## ❌ MASALAH:

Error 401 Unauthorized terjadi karena credentials yang digunakan adalah **CONTOH dari dokumentasi**, bukan credentials ASLI Anda!

```
MIDTRANS_SERVER_KEY=SB-Mid-server-GwUP8WGEmYPggWVM0IqihgtY ❌ INI CONTOH!
MIDTRANS_CLIENT_KEY=SB-Mid-client-61XuGAwQ8Bj8LxSS ❌ INI CONTOH!
```

---

## ✅ SOLUSI: DAFTAR MIDTRANS SANDBOX (100% GRATIS)

### Step 1: Registrasi Akun

1. Buka browser, ke: **https://dashboard.sandbox.midtrans.com/register**

2. Isi form:
   ```
   Business Name:  Tautan Rasa
   Email:          (email Anda yang aktif)
   Password:       (buat password kuat)
   Phone:          085606163077
   ```

3. Centang "I agree to terms and conditions"

4. Klik **"Sign Up"**

5. Cek email Anda → Klik link verifikasi dari Midtrans

### Step 2: Login ke Dashboard

1. Buka: **https://dashboard.sandbox.midtrans.com/login**

2. Login dengan email & password yang tadi didaftarkan

### Step 3: Dapatkan API Keys ANDA

1. Di dashboard, klik menu **"Settings"** (pojok kiri bawah, icon ⚙️)

2. Pilih **"Access Keys"**

3. Anda akan melihat:
   ```
   Environment:    Sandbox
   Merchant ID:    G123456789
   
   Server Key:     SB-Mid-server-[UNIQUE_KEY_ANDA]
   Client Key:     SB-Mid-client-[UNIQUE_KEY_ANDA]
   ```

4. **COPY kedua key tersebut!**

---

## Step 4: Update .env dan .env.local

**File: `.env`**
```env
MIDTRANS_SERVER_KEY=SB-Mid-server-[PASTE_KEY_ANDA_DISINI]
MIDTRANS_CLIENT_KEY=SB-Mid-client-[PASTE_KEY_ANDA_DISINI]
MIDTRANS_IS_PRODUCTION=false

NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=SB-Mid-client-[PASTE_KEY_ANDA_DISINI]
NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION=false
```

**File: `.env.local`**
```env
MIDTRANS_SERVER_KEY=SB-Mid-server-[PASTE_KEY_ANDA_DISINI]
MIDTRANS_CLIENT_KEY=SB-Mid-client-[PASTE_KEY_ANDA_DISINI]
MIDTRANS_IS_PRODUCTION=false
```

---

## Step 5: Restart Server

```powershell
# Stop server (Ctrl+C di terminal)
# Lalu jalankan:
npm run dev
```

---

## Step 6: TEST QRIS

1. Refresh browser (Ctrl+F5)
2. Login ke aplikasi
3. Checkout produk
4. Klik "Bayar Sekarang dengan QRIS"

**✅ QRIS POPUP AKAN MUNCUL!**

---

## 🧪 Cara Test Pembayaran:

### Opsi 1: Midtrans Simulator
1. Buka: **https://simulator.sandbox.midtrans.com/**
2. Masukkan Order ID: `INV/20251122/XXX`
3. Klik **"Pay"**
4. Status berubah SUCCESS

### Opsi 2: Scan dengan App
Download **Midtrans Simulator App** (Android/iOS) untuk scan QRIS sandbox

---

## 📱 Screenshot Lokasi Access Keys:

```
Dashboard Midtrans Sandbox
├── Home
├── Transactions
├── Settings ⚙️ ← KLIK INI
    ├── Access Keys ← PILIH INI
    ├── Payment Settings
    └── Business Info
```

---

## ⏱️ Estimasi Waktu:

- Registrasi: **2 menit**
- Verifikasi email: **1 menit**
- Dapatkan keys: **30 detik**
- Update .env: **1 menit**
- **TOTAL: 5 MENIT**

---

## 🎉 Setelah Berhasil:

Anda akan melihat di terminal:
```
🔍 Midtrans Config: {
  serverKey: 'SB-Mid-server-...',
  isProduction: false,
  baseUrl: 'https://app.sandbox.midtrans.com/snap/v1',
  hasValidKey: true ✅
}
```

Dan QRIS popup akan muncul dengan QR code yang bisa di-scan!

---

**SEKARANG DAFTAR DI LINK INI:** https://dashboard.sandbox.midtrans.com/register
