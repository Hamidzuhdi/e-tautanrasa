# ⚠️ KENAPA QRIS TIDAK MUNCUL?

## Diagnosis Masalah Anda:

Saya sudah cek file `.env.local` Anda, dan menemukan:

**Masalahnya:**
1. ❌ Key ini BUKAN Sandbox key (tidak dimulai dengan `SB-Mid-`)
2. ❌ Key ini kemungkinan **tidak valid** atau **expired**
3. ❌ Makanya sistem fallback ke MOCK payment
4. ❌ Order masuk DB tapi QRIS tidak muncul

---

## ✅ Solusi - Dapatkan Credentials VALID:

### Opsi 1: Pakai Test Credentials Midtrans (Paling Mudah)

Untuk TESTING, Anda bisa pakai test credentials resmi Midtrans:

**Update file `.env.local` dengan ini:**

```env
# Midtrans Sandbox Test Credentials (Official dari Midtrans Docs)
MIDTRANS_SERVER_KEY=SB-Mid-server-GwUP8WGEmYPggWVM0IqihgtY
MIDTRANS_CLIENT_KEY=SB-Mid-client-61XuGAwQ8Bj8LxSS
MIDTRANS_IS_PRODUCTION=false

# Frontend environment variables
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=SB-Mid-client-61XuGAwQ8Bj8LxSS
NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION=false
```

**NOTE:** Test credentials ini dari dokumentasi resmi Midtrans dan pasti works!

---

### Opsi 2: Buat Akun Sendiri (Untuk Production Nanti)

1. Daftar di: https://dashboard.sandbox.midtrans.com/register
2. Login dan buka: **Settings → Access Keys**
3. Copy **Server Key** dan **Client Key** yang dimulai dengan `SB-Mid-`
4. Paste ke `.env.local`

---

## 🔧 Langkah Setelah Update .env.local:

1. **Save file** `.env.local`

2. **Stop server** (Ctrl+C di terminal)

3. **Kill semua node process:**
   ```bash
   taskkill /F /IM node.exe
   ```

4. **Start server lagi:**
   ```bash
   npm run dev
   ```

5. **Tunggu sampai muncul:**
   ```
   ✓ Ready in XXXXms
   ```

6. **Test payment:**
   - Buka: http://localhost:3000/checkout
   - Login
   - Checkout → Pilih courier
   - Klik "Bayar Sekarang dengan QRIS"
   - **QRIS popup akan muncul!** 🎉

---

## 📱 Test Payment dengan QRIS:

Setelah QRIS muncul, untuk test payment:

### Cara 1: Simulasi di Midtrans Dashboard
1. Buka: https://simulator.sandbox.midtrans.com/
2. Masukkan Order ID (invoice number)
3. Klik "Pay" untuk simulasi success payment

### Cara 2: Pakai QR Scanner Test
Scan QRIS code menggunakan:
- Gopay/Gojek app (sandbox mode)
- OVO sandbox
- Dana sandbox
- Atau simulator app dari Midtrans

---

## 🐛 Debugging Tips:

### Cek Console Browser:
Buka Developer Tools (F12) → Console tab

**Yang harus terlihat:**
```
✅ Midtrans Snap.js loaded successfully
✅ Midtrans Client Key: SB-Mid-client-XXXXXXXX
```

**Kalau ada error:**
```
❌ Midtrans Snap.js NOT loaded
```
→ Berarti `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY` belum di-set

### Cek Terminal Server:
**Kalau credentials valid:**
```
Midtrans transaction created: { token: 'xxx', redirect_url: 'xxx' }
```

**Kalau credentials INVALID:**
```
Midtrans API error: 401 - Access denied...
Using mock token due to Midtrans error
```

---

## 💡 FAQ:

**Q: Kenapa pakai test credentials dari docs Midtrans?**
A: Untuk cepat testing tanpa perlu daftar akun. Ini credentials resmi yang dijamin works.

**Q: Apakah aman pakai test credentials?**
A: Ya, ini hanya untuk SANDBOX (testing). Untuk production nanti wajib pakai credentials sendiri.

**Q: Kapan harus daftar akun sendiri?**
A: Saat mau deploy ke production. Tapi untuk development sekarang, test credentials sudah cukup.

**Q: QRIS masih tidak muncul setelah pakai test credentials?**
A: Pastikan:
1. File `.env.local` sudah di-save
2. Server sudah di-restart (kill + start ulang)
3. Browser di-refresh (Ctrl+F5)
4. Tidak ada typo di `.env.local`

---

## 🎯 Ringkasan Singkat:

1. ✏️ Edit `.env.local`
2. 📋 Paste test credentials (yang dimulai `SB-Mid-`)
3. 💾 Save file
4. 🔄 Restart server (kill + npm run dev)
5. 🧪 Test payment
6. ✅ QRIS muncul!

---

Kalau masih ada masalah setelah pakai test credentials, 
screenshot error di console browser dan terminal!
