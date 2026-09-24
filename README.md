# WPI Admin Hub - Sistem Administrasi Terpadu
**Checklist Job Desk Harian • Monitoring Purchasing • Monitoring Tagihan & Invoice**

Aplikasi web terpadu 100% GRATIS tanpa biaya langganan server untuk staf administrasi PT WPI.

---

## 🚀 Fitur Utama

### 1. Checklist Job Desk Harian
- **Kategori Tugas**: Administrasi & Arsip, Operasional Kantor, Keuangan & Kasir, Laporan & Rekap.
- **Frekuensi**: Harian Pagi, Harian Sore, Mingguan, Bulanan, Insidental.
- **Progress Tracker**: Bar persentase penyelesaian tugas harian secara otomatis.
- **Reset Hari Baru**: 1 tombol untuk mereset seluruh checklist menjadi *Belum Selesai* di awal hari kerja.
- **Export & Cetak**: Cetak daftar tugas harian atau unduh file CSV.

### 2. Monitoring Purchasing (Pengadaan Barang)
- **Form Pengajuan Lengkap**: No. PO/Pengajuan, Tanggal Request, Nama Barang/Jasa, Divisi, Qty, Estimasi Biaya, Vendor, dan Estimasi Tiba.
- **Alur Status Transparan**:
  - `Diajukan` ➔ `Disetujui` ➔ `Proses Beli/Order` ➔ `Dalam Pengiriman` ➔ `Barang Diterima (Selesai)` / `Ditolak`.
- **Lacak Resi & Catatan**: Kolom nomor resi pengiriman dan catatan penerimaan barang.
- **Export CSV**: Rekap seluruh data pembelian barang ke spreadsheet Excel.

### 3. Monitoring Tagihan & Invoice
- **Pencatatan Invoice**: No. Invoice, Nama Vendor/Supplier, Kategori, Nominal (Rp), Tanggal Faktur, dan Tanggal Jatuh Tempo.
- **Sistem Peringatan Otomatis (Alert)**:
  - 🔴 **Overdue / Terlambat**: Tagihan yang sudah lewat tanggal jatuh tempo.
  - 🟡 **Jatuh Tempo Segera**: Tagihan jatuh tempo $\le$ 3 hari lagi (prioritas bayar).
  - 🔵 **Pending / Aman**: Tagihan belum jatuh tempo.
  - 🟢 **Lunas (Paid)**: Tagihan yang sudah diselesaikan beserta tanggal pelunasan.
- **Tombol Pelunasan Cepat**: 1 klik tombol centang hijau untuk menandai invoice lunas.
- **Rekap Keuangan**: Total hutang tagihan berjalan, total nominal jatuh tempo segera, dan pencarian cepat.

### 4. Cadangan & Sinkronisasi Fleksibel
- **Penyimpanan Lokal (Offline-Ready)**: Data tersimpan otomatis di browser menggunakan LocalStorage (tidak hilang saat web ditutup/refresh).
- **Backup & Restore JSON**: Amankan database ke file lokal komputer kapan saja.
- **Sinkronisasi Google Spreadsheet Gratis**: Hubungkan ke Google Sheet perusahaan via Google Apps Script.

---

## 💻 Cara Menggunakan Aplikasi (Di Komputer Anda)

1. Buka folder: `d:\ANTIGRAVITY\JOB DESK STAF ADMINISTRASI WPI`
2. Klik 2x file **`index.html`** untuk membukanya di browser (Google Chrome, Microsoft Edge, Firefox, dll).
3. Aplikasi langsung aktif dan siap digunakan seketika!

---

## ☁️ Cara Menghubungkan ke Google Spreadsheet (Database Gratis)

Jika ingin data tersimpan otomatis di Google Drive dan bisa dibuka dalam format Excel/Spreadsheet bersama tim:

1. Buka [Google Spreadsheet](https://sheets.new) di browser Anda.
2. Klik menu **Ekstensi (Extensions)** ➔ **Apps Script**.
3. Buka file [google_apps_script.js](google_apps_script.js) di folder ini, salin (**Ctrl+A, Ctrl+C**) seluruh kodenya.
4. Tempelkan (**Ctrl+V**) ke dalam editor `Code.gs` di Google Apps Script.
5. Klik ikon **Simpan (Ctrl+S)**.
6. Klik tombol biru **Deploy (Terapkan)** di kanan atas ➔ pilih **New deployment (Deployment baru)**.
7. Pilih tipe gear ⚙️ ➔ **Web app**.
8. Konfigurasi:
   - **Execute as**: `Me` (Saya)
   - **Who has access**: `Anyone` (Siapa saja)  *(Wajib agar web bisa mengirim data)*
9. Klik **Deploy**, klik **Authorize Access**, lalu salin URL Web App yang berakhiran `/exec`.
10. Di aplikasi web WPI Admin Hub:
    - Masuk ke tab **Pengaturan & Data**.
    - Tempelkan URL tersebut ke kolom **Google Apps Script Web App URL**.
    - Klik **Simpan URL** dan **Tes Koneksi**.

---

## 🌐 Cara Hosting Online Gratis (Bisa Diakses dari HP & Internet Luar)

Jika Anda ingin aplikasi ini memiliki alamat web publik (misal: `https://admin-wpi.vercel.app`):

### Opsi A: Menggunakan Vercel (Rekomendasi - Paling Mudah)
1. Buat akun gratis di [GitHub.com](https://github.com) dan buat repository baru (misal: `wpi-admin-hub`).
2. Upload file `index.html` ke repository tersebut.
3. Buka [Vercel.com](https://vercel.com) ➔ Login dengan akun GitHub.
4. Klik **Add New Project** ➔ Pilih repository `wpi-admin-hub` ➔ Klik **Deploy**.
5. Selesai! Web Anda langsung aktif di internet dan memiliki domain HTTPS gratis.

### Opsi B: Menggunakan GitHub Pages
1. Di repository GitHub Anda, buka menu **Settings** ➔ **Pages**.
2. Pada bagian *Branch*, pilih **main** / **master** ➔ klik **Save**.
3. Dalam 1 menit, web Anda aktif di alamat `https://username.github.io/wpi-admin-hub`.
