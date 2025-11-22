# 🔧 Cara Aktifkan QRIS di Midtrans Sandbox

## ❌ Error: "No payment channels available"

**Penyebab:** Payment methods (QRIS, GoPay, dll) belum diaktifkan di dashboard Midtrans.

---

## ✅ SOLUSI: Aktifkan Payment Channels

### Step 1: Login ke Dashboard Midtrans

Buka: **https://dashboard.sandbox.midtrans.com/login**

Login dengan akun yang sudah dibuat (Merchant ID: G886312220)

---

### Step 2: Buka Settings → Payment Channels

1. Klik menu **"Settings"** (icon ⚙️ di sidebar kiri)
2. Pilih **"Payment Channels"** atau **"Configuration"**

---

### Step 3: Aktifkan QRIS

Di halaman Payment Channels:

1. Cari section **"E-Money / E-Wallet"** atau **"QRIS"**

2. **Toggle ON** untuk payment methods berikut:
   - ✅ **QRIS** (ini yang paling penting!)
   - ✅ **GoPay** (opsional)
   - ✅ **ShopeePay** (opsional)
   - ✅ **OVO** (opsional)
   - ✅ **DANA** (opsional)

3. Jika ada tombol **"Save"** atau **"Update"**, klik untuk save changes

---

### Step 4: Aktifkan Payment Methods Lainnya (Opsional)

Jika ingin menambah opsi pembayaran:

**Credit Card:**
- ✅ Visa
- ✅ Mastercard
- ✅ JCB

**Bank Transfer:**
- ✅ BCA Virtual Account
- ✅ BNI Virtual Account
- ✅ BRI Virtual Account
- ✅ Mandiri Bill Payment
- ✅ Permata Virtual Account

**Convenience Store:**
- ✅ Indomaret
- ✅ Alfamart

---

### Step 5: Test Lagi

1. Kembali ke aplikasi: http://localhost:3000/checkout
2. **Hard refresh**: Ctrl + F5
3. Checkout produk
4. Klik **"Bayar Sekarang dengan QRIS"**

**✅ Popup Midtrans akan muncul dengan QRIS code dan payment options!**

---

## 🎯 Catatan Penting:

### Untuk Sandbox (Testing):
- **Semua payment channels GRATIS**
- Tidak perlu verifikasi dokumen
- Langsung bisa diaktifkan dengan 1 klik

### Untuk Production (Live):
- Perlu verifikasi dokumen bisnis
- Ada fee per transaksi
- Harus approval dari Midtrans

---

## 📱 Screenshot Lokasi Menu:

```
Midtrans Dashboard
├── Home
├── Transactions
├── Settings ⚙️
    ├── Access Keys
    ├── Payment Channels ← BUKA INI!
    │   ├── E-Wallet
    │   │   ├── QRIS ← AKTIFKAN!
    │   │   ├── GoPay
    │   │   ├── ShopeePay
    │   │   └── OVO
    │   ├── Bank Transfer
    │   └── Credit Card
    └── Business Info
```

---

## 🔍 Alternatif: Cek Default Payment Settings

Jika tidak ada menu "Payment Channels", coba:

1. Settings → **"Snap Preferences"**
2. Di bagian **"Enabled Payments"**
3. Pastikan **QRIS** atau **All Payment Methods** di-enable

---

## ⚡ Quick Fix:

Jika masih error, coba ubah code di `src/lib/midtrans.ts`:

**HAPUS** bagian `enabled_payments`:

```typescript
// SEBELUM (dengan filter):
const parameter = {
  transaction_details: { ... },
  customer_details: { ... },
  item_details: [ ... ],
  enabled_payments: ['qris']  // ← HAPUS BARIS INI
};
```

**SESUDAH (tanpa filter - tampilkan semua):**

```typescript
const parameter = {
  transaction_details: { ... },
  customer_details: { ... },
  item_details: [ ... ]
  // enabled_payments dihapus - semua payment ditampilkan
};
```

---

**SEKARANG BUKA DASHBOARD DAN AKTIFKAN QRIS!** 🚀

Link: https://dashboard.sandbox.midtrans.com/settings/payment_channels
