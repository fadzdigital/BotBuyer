```markdown
# Bot Buyer Telegram

Bot ini dirancang untuk memudahkan dalam mengelola data buyer VPN, termasuk penambahan, penghapusan, pengecekan, dan pengiriman file JSON yang berisi daftar buyer. Bot ini dibangun menggunakan Node.js dan `node-telegram-bot-api`.

## Prasyarat

Sebelum menjalankan bot ini, pastikan Anda telah menginstal hal-hal berikut di server/VPS Anda:

- **Node.js** (versi terbaru disarankan)
- **npm** (Node Package Manager)

Jika Anda belum menginstal Node.js dan npm, Anda bisa mengikutinya di [situs resmi Node.js](https://nodejs.org/).

## Langkah-langkah Installasi

1. **Clone repository ini ke VPS Anda**:

   Jalankan perintah berikut untuk menyalin repository ini ke direktori lokal Anda:

   ```bash
   git clone https://github.com/fadzdigital/BotBuyer.git
   cd BotBuyer
   ```

2. **Install dependensi yang diperlukan**:

   Jalankan perintah berikut untuk menginstal modul yang dibutuhkan oleh bot:

   ```bash
   npm install node-telegram-bot-api dotenv
   ```

   Perintah di atas akan menginstal dua paket utama:
   - `node-telegram-bot-api`: untuk menghubungkan bot dengan Telegram API.
   - `dotenv`: untuk menangani variabel lingkungan yang sensitif, seperti token bot Telegram.

3. **Konfigurasi bot dengan file `.env`**:

   Anda perlu membuat file `.env` di root direktori proyek Anda untuk menyimpan token Telegram bot secara aman.

   - Buat file `.env` di dalam folder proyek Anda:
     
     ```bash
     touch .env
     ```

   - Buka file `.env` dan masukkan token bot Telegram Anda:

     ```plaintext
     TELEGRAM_TOKEN=masukkan_token_botmu
     ```

   Gantilah `masukkan_token_botmu` dengan token yang Anda dapatkan dari BotFather di Telegram.

## Menjalankan Bot

1. **Jalankan bot di terminal**:

   Setelah Anda menginstal dependensi dan mengkonfigurasi file `.env`, Anda dapat menjalankan bot dengan perintah berikut:

   ```bash
   node bot.js
   ```

2. **Menjaga bot tetap berjalan di background**:

   Untuk memastikan bot tetap berjalan meskipun Anda keluar dari terminal, gunakan alat seperti `screen` atau `tmux`:

   - Install `screen`:
     ```bash
     sudo apt install screen
     ```

   - Mulai sesi `screen`:
     ```bash
     screen -S bot-session
     ```

   - Jalankan bot:
     ```bash
     node bot.js
     ```

   - Untuk keluar dari sesi `screen` dan membiarkan bot berjalan di background, tekan:
     ```
     Ctrl + A, lalu D
     ```

3. **Mengakses kembali sesi bot**:

   Jika Anda ingin kembali ke sesi bot yang sedang berjalan, gunakan perintah:
   ```bash
   screen -r bot-session
   ```

## Fitur

- **Tambah Buyer**: Menambah data buyer VPN (username, no. WA, tanggal mulai, tanggal berakhir, server yang digunakan, dan detail VPN).
- **Cek Buyer**: Menampilkan daftar buyer yang tercatat.
- **Cek Detail VPN**: Menampilkan detail akun VPN berdasarkan username.
- **Hapus Buyer**: Menghapus data buyer berdasarkan username.
- **Kirim File `buyers.json`**: Mengirim file yang berisi daftar buyer.
- **Kirim File `bot.js`**: Mengirim file skrip bot untuk pemeliharaan atau backup.

## Pembaruan dan Pemeliharaan

Jika Anda ingin memperbarui bot atau menambahkan fitur baru, pastikan untuk mengedit dan menguji bot di lokal terlebih dahulu. Setelah itu, lakukan commit dan push perubahan ke GitHub.

---

Dengan mengikuti langkah-langkah di atas, bot Telegram Anda akan siap untuk digunakan dan berjalan di VPS Anda tanpa masalah. Nikmati pengalaman mengelola data buyer VPN yang lebih mudah dan efisien!
```

### Penjelasan tambahan:
- **Bagian "Install dependensi"** sudah disesuaikan dengan penjelasan yang lebih rinci tentang modul yang dibutuhkan (`node-telegram-bot-api` dan `dotenv`).
- **Petunjuk pembuatan file `.env`** ditambahkan untuk membantu mengonfigurasi bot dengan benar menggunakan token Telegram.
- **Cara menjalankan bot dengan `screen`** diberikan agar bot bisa berjalan di latar belakang dan tetap aktif meskipun terminal ditutup.
