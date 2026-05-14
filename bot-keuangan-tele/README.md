
```markdown
# 💰 Catat Duit Gue - Bot Telegram Keuangan

[![Node.js Version](https://img.shields.io/badge/node-v22.14.0-green.svg)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/database-Supabase-blue.svg)](https://supabase.com/)

**Catat Duit Gue** adalah asisten keuangan pribadi berbasis Telegram yang dirancang untuk mencatat pengeluaran harian secara instan. Tidak perlu buka aplikasi berat, cukup chat seperti biasa dengan gaya bahasa santai!

---

## ✨ Fitur Unggulan

*   **Pencatatan Natural**: Bot bisa baca input seperti `Kopi 15k`, `Nasi Padang 25rb`, atau `Bensin 50.000`.
*   **Laporan Real-time**:
    *   `/laporan` - Ringkasan pengeluaran hari ini.
    *   `/laporan_semua` - Seluruh riwayat transaksi kamu.
*   **Visualisasi Grafik**: Perintah `/grafik` untuk melihat tren pengeluaran dalam bentuk bar chart (via QuickChart).
*   **Manajemen Budget**: Atur batas pengeluaran bulanan dengan `/budget [nominal]` dan pantau sisanya.
*   **Fitur Undo**: Salah catat? Gunakan `/undo` untuk menghapus transaksi terakhir secara instan.
*   **Panduan Interaktif**: Ketik `/help` untuk melihat daftar perintah lengkap.

## 🛠️ Tech Stack

*   **Runtime**: [Node.js](https://nodejs.org/)
*   **Library Bot**: [Telegraf.js](https://telegraf.js.org/)
*   **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
*   **Chart Engine**: [QuickChart.io](https://quickchart.io/)

## 📦 Panduan Instalasi Lokal

Jika kamu ingin menjalankan bot ini di komputer sendiri, ikuti langkah berikut:

1. **Clone Repository**
   ```cmd
   git clone [https://github.com/MuhammadAlfarezelArsano/catat-duit-gue.git](https://github.com/MuhammadAlfarezelArsano/catat-duit-gue.git)
   cd catat-duit-gue

```

2. **Install Dependencies**
```cmd
npm install

```


3. **Pengaturan Environment (.env)**
Buat file bernama `.env` di dalam folder proyek (sejajar dengan index.js) dan masukkan:
```env
BOT_TOKEN=isi_token_bot_telegram_kamu
SUPABASE_URL=isi_url_project_supabase
SUPABASE_KEY=isi_anon_key_supabase

```


4. **Menjalankan Bot**
Karena struktur folder menggunakan sub-folder, jalankan dengan:
```cmd
node bot-keuangan-tele/index.js

```



---

## 👨‍💻 Author

**Muhammad Alfarezel Arsano**

* GitHub: [@MuhammadAlfarezelArsano](https://www.google.com/search?q=https://github.com/MuhammadAlfarezelArsano)

---

*Proyek ini dibuat untuk mempermudah manajemen keuangan pribadi agar lebih disiplin dan terukur.*

```

---

### Cara Update ke GitHub:
1.  **Save** file `README.md` yang sudah diisi teks di atas.
2.  Buka terminal, jalankan:
    ```cmd
    git add README.md
    git commit -m "Final update README: Pro version"
    git push origin main
    ```

Cek sekarang di browser, tampilan GitHub kamu pasti langsung "naik kelas"! Sukses ya! Ada lagi yang mau dibereskan?

```