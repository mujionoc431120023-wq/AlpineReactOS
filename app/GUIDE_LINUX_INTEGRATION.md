# Panduan Integrasi GeminiOS dengan Kernel Linux & GRUB

Panduan ini menjelaskan langkah-langkah untuk mengintegrasikan simulasi sistem GeminiOS Anda ke dalam lingkungan Kernel Linux yang sebenarnya dan cara membuat file ISO bootable menggunakan GRUB.

## 1. Persiapan Struktur Folder
Pastikan struktur folder kernel Anda mengikuti standar multiboot:
```text
/isodir
  /boot
    /grub
      grub.cfg
    kernel.elf  (Binary kernel hasil kompilasi)
```

## 2. Konfigurasi GRUB (grub.cfg)
Buat file `/boot/grub/grub.cfg` untuk mendukung pemuatan kernel Linux atau kernel custom Anda:
```text
set timeout=5
set default=0

menuentry "GeminiOS (Linux Kernel Base)" {
    multiboot /boot/kernel.elf
    module /boot/initrd.img
    boot
}
```

## 3. Kompilasi Kernel untuk Multiboot
Pastikan kernel Anda memiliki `Multiboot Header` di 8KB pertama agar GRUB dapat mengenalinya. Jika menggunakan C/Rust, tambahkan section khusus di linker script:
```ld
ENTRY(_start)
SECTIONS {
    . = 1M;
    .text : {
        *(.multiboot)
        *(.text)
    }
}
```

## 4. Membangun File ISO
Gunakan tool `grub-mkrescue` (bagian dari paket GRUB) untuk membuat file ISO:
```bash
# Instalasi tool di sistem Linux (Debian/Ubuntu)
sudo apt-get install xorriso mtools grub-pc-bin

# Perintah pembuatan ISO
grub-mkrescue -o release/geminios.iso isodir/
```

## 5. Menjalankan di Virtual Machine
Anda dapat menguji file ISO tersebut menggunakan QEMU:
```bash
qemu-system-x86_64 -cdrom release/geminios.iso
```

---
*Catatan: Dalam simulasi web ini, Anda dapat menjalankan perintah `make` di Terminal untuk melihat simulasi proses build di atas.*
