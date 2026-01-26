# GeminiOS - Panduan Pengoperasian

Selamat datang di **GeminiOS**, simulasi sistem operasi berbasis web dengan tema cyberpunk. Berikut adalah langkah-langkah untuk menjalankan dan menggunakan sistem ini.

## Cara Menjalankan (Development)
1. Pastikan Anda memiliki Node.js terinstal.
2. Jalankan perintah berikut di terminal:
   ```bash
   npm install
   npm run dev
   ```
3. Buka browser dan akses `http://localhost:5000`.

## Fitur Utama
- **Desktop Environment**: Antarmuka berbasis jendela yang dapat digeser dan difokuskan.
- **Terminal**: Emulator terminal dengan dukungan perintah dasar (ls, cat, help, uname).
- **File Manager**: Kelola file virtual dalam sistem.
- **Multi-Architecture Support**: Simulasi kernel untuk x86_64, ARM64, dan RISC-V.
- **Multitasking**: Klik pada jendela atau ikon di taskbar untuk memfokuskan aplikasi ke depan.

## Panduan Pengoperasian
1. **Membuka Aplikasi**: Klik dua kali pada ikon di desktop atau gunakan menu Start di pojok kiri bawah.
2. **Berpindah Jendela**: Klik pada jendela mana saja untuk membawanya ke depan (paling depan). Anda juga bisa mengklik ikon aplikasi yang terbuka di taskbar.
3. **Meminimalkan/Menutup**: Gunakan tombol di pojok kanan atas setiap jendela.
4. **Membangun Sistem (ISO)**: Buka Terminal dan ketik perintah `make` untuk mensimulasikan proses pembuatan file ISO bootable.
5. **Konfigurasi**: Buka aplikasi Settings untuk mengubah simulasi arsitektur prosesor.

## Struktur Proyek
- `/client`: Source code frontend React.
- `/server`: Backend Express dan database logic.
- `/shared`: Skema data dan rute API bersama.
- `/attached_assets`: Dokumen desain asli dan aset.
