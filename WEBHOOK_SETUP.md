# 🔔 Cara Setup Webhook Midtrans

## ❓ Apa itu Webhook?

Webhook adalah notifikasi otomatis dari Midtrans ke aplikasi Anda ketika status pembayaran berubah (success, pending, failed, dll).

**Tanpa webhook:** Status order tidak akan update otomatis setelah customer bayar.

---

## ✅ Cara Setting Webhook di Dashboard Midtrans

### Step 1: Login ke Dashboard

Buka: **https://dashboard.sandbox.midtrans.com/login**

### Step 2: Buka Settings → Configuration

1. Klik **"Settings"** ⚙️ (sidebar kiri)
2. Pilih **"Configuration"** atau **"Snap Preferences"**
3. Scroll ke bagian **"Notification URL"**

### Step 3: Masukkan Webhook URL

**Untuk Development (Localhost):**

Gunakan **ngrok** atau **localtunnel** untuk expose localhost:

#### Cara 1: Menggunakan Ngrok (Recommended)

```powershell
# Install ngrok: https://ngrok.com/download

# Jalankan ngrok
ngrok http 3000

# Copy URL yang muncul, contoh:
# https://abc123.ngrok.io
```

Webhook URL: `https://abc123.ngrok.io/api/midtrans/webhook`

#### Cara 2: Menggunakan Localtunnel

```powershell
# Install localtunnel
npm install -g localtunnel

# Jalankan
lt --port 3000

# Copy URL yang muncul
```

**Untuk Production:**

Webhook URL: `https://yourdomain.com/api/midtrans/webhook`

### Step 4: Konfigurasi di Dashboard

Isi field-field berikut di Midtrans Dashboard:

```
Payment Notification URL:     https://abc123.ngrok.io/api/midtrans/webhook
Finish Redirect URL:          http://localhost:3000/customers/orders?success=true
Unfinish Redirect URL:        http://localhost:3000/checkout
Error Redirect URL:           http://localhost:3000/checkout?error=true
```

### Step 5: Enable Notification

- ✅ Centang **"Enable HTTP notification"**
- ✅ Centang **"Enable email notification"** (opsional)

### Step 6: Save Configuration

Klik **"Save"** atau **"Update"**

---

## 🧪 Testing Webhook

### Test Flow:

1. **Checkout produk** di aplikasi
2. **Pilih payment method** (QRIS/VA BNI/dll)
3. **Buka simulator**: https://simulator.sandbox.midtrans.com/
4. **Input Order ID**: Contoh `INV/20251122/004`
5. **Klik "Pay"**

### Hasil yang Diharapkan:

✅ **Order status** berubah dari `PENDING` → `PAID`
✅ **Stock produk** berkurang otomatis
✅ **Payment record** tersimpan di table `payments`
✅ **Redirect** ke halaman orders dengan status success

---

## 📊 Monitoring Webhook

### Cek Log di Terminal

Setelah payment success, di terminal akan muncul:

```
Midtrans Webhook received: {
  order_id: 'INV/20251122/004',
  transaction_status: 'settlement',
  fraud_status: 'accept',
  status_code: '200',
  payment_type: 'bank_transfer'
}
Stock reduced for order: INV/20251122/004
Order updated successfully: INV/20251122/004 New status: PAID
```

### Cek di Dashboard Midtrans

1. Login dashboard
2. Menu **"Transactions"**
3. Cari Order ID
4. Status harus **"settlement"** atau **"success"**

---

## 🔐 Security: Signature Verification

Webhook sudah include signature verification untuk keamanan.

File: `src/lib/verify-midtrans.ts`

```typescript
export function verifyMidtransSignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  serverKey: string,
  signatureKey: string
): boolean {
  const hash = crypto
    .createHash('sha512')
    .update(`${orderId}${statusCode}${grossAmount}${serverKey}`)
    .digest('hex');
  
  return hash === signatureKey;
}
```

Jika signature tidak valid, webhook akan ditolak dengan status **403 Forbidden**.

---

## 🐛 Troubleshooting

### ❌ Status tidak update setelah bayar

**Penyebab:**
- Webhook URL salah
- Ngrok/localtunnel tidak running
- Server tidak running

**Solusi:**
1. Pastikan server running: `npm run dev`
2. Pastikan ngrok running: `ngrok http 3000`
3. Update webhook URL di dashboard dengan URL ngrok yang baru
4. Test lagi pembayaran

### ❌ Error 403 Invalid Signature

**Penyebab:** Server Key di `.env` tidak match dengan dashboard

**Solusi:**
1. Cek `.env` → `MIDTRANS_SERVER_KEY`
2. Cek dashboard → Settings → Access Keys
3. Pastikan sama persis
4. Restart server

### ❌ Stock tidak berkurang

**Penyebab:** Webhook tidak mencapai endpoint

**Solusi:**
1. Cek log terminal untuk webhook notification
2. Pastikan transaction_status = `settlement`
3. Manual cek database: `SELECT * FROM payments WHERE midtrans_order_id = 'INV/...'`

---

## 📝 Testing Checklist

- [ ] Ngrok/localtunnel running
- [ ] Webhook URL configured di dashboard
- [ ] Server running (`npm run dev`)
- [ ] Checkout → Pilih payment
- [ ] Simulate payment
- [ ] Cek terminal log
- [ ] Cek order status berubah PAID
- [ ] Cek stock berkurang
- [ ] Cek table payments terisi

---

## 🚀 Production Deployment

Untuk production (hosting di Vercel/Railway/dll):

1. **Ganti credentials** sandbox → production
2. **Update webhook URL** dengan domain production
3. **Enable HTTPS** (wajib)
4. **Monitor logs** di dashboard hosting

---

**SEKARANG SETUP WEBHOOK UNTUK AUTO-UPDATE ORDER STATUS!** 🎉

Dokumentasi lengkap: https://docs.midtrans.com/docs/http-notification-webhook
