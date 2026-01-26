# Alpine ReactOS Build System - Dokumentasi Lengkap

## 📋 Daftar Isi
- [Perkenalan](#perkenalan)
- [Persyaratan](#persyaratan)
- [Quick Start](#quick-start)
- [Build Commands](#build-commands)
- [Struktur Proyek](#struktur-proyek)
- [Troubleshooting](#troubleshooting)
- [Deployment](#deployment)

---

## Perkenalan

**Alpine ReactOS** adalah sistem operasi Linux minimal berbasis Alpine Linux yang terintegrasi dengan aplikasi web React (**GeminiOS**). Sistem ini menghasilkan ISO bootable (~715 KB) yang dapat dijalankan di berbagai platform.

### Fitur Utama
- ✅ Alpine Linux (minimal, cepat)
- ✅ GeminiOS React Application
- ✅ Lighttpd Web Server
- ✅ GRUB + Syslinux Boot
- ✅ Automated build system
- ✅ Docker support

---

## Persyaratan

### Minimum Requirements
```bash
- Node.js 18+
- npm/yarn
- bash 4+
- git
- 2GB disk space
- 512MB RAM
```

### Optional
```bash
- Docker (untuk isolated builds)
- QEMU (untuk testing ISO)
- xorriso atau mkisofs (built-in pada build.sh)
```

### Install Dependencies
```bash
# Debian/Ubuntu
sudo apt-get update
sudo apt-get install -y nodejs npm xorriso qemu-system-x86

# Atau menggunakan Makefile
make install
```

---

## Quick Start

### 1. Build ISO Tercepat

```bash
# Menggunakan quick-build.sh (recommended)
./quick-build.sh build

# Output akan tersimpan di:
# build/output/AlpineReactOS.iso (715 KB)
```

### 2. Build dengan Makefile

```bash
# Lihat semua commands
make help

# Build ISO
make build

# Rebuild (clean + build)
make rebuild

# Test ISO
make test

# Clean artifacts
make clean
```

### 3. Build Manual

```bash
# Script individual
./scripts/build.sh              # Main build orchestrator
./scripts/setup-alpine-rootfs.sh # Setup rootfs
./scripts/create-iso-structure.sh # Create ISO structure
./scripts/generate-iso.sh       # Generate ISO image
./scripts/test-iso.sh           # Test ISO
```

---

## Build Commands

### Status Checking
```bash
./quick-build.sh status
```

Menampilkan:
- Lokasi ISO
- Ukuran file
- SHA256 checksum
- Versi aplikasi

### Testing
```bash
# Test ISO (mount dan verify)
./quick-build.sh test

# Boot di QEMU (interactive)
./quick-build.sh boot
```

### Cleanup
```bash
# Hapus build artifacts
./quick-build.sh clean

# Atau menggunakan Makefile
make clean
```

### Development
```bash
# Start dev server
make dev

# Check TypeScript
make check
```

---

## Struktur Proyek

```
AlpineReactOS/
├── app/                           # GeminiOS React Application
│   ├── client/                    # React frontend
│   ├── server/                    # Express backend
│   ├── shared/                    # Shared types & schemas
│   ├── package.json              # Dependencies
│   └── vite.config.ts            # Vite configuration
│
├── scripts/                       # Build automation scripts
│   ├── build.sh                  # Main orchestrator
│   ├── setup-alpine-rootfs.sh    # Rootfs configuration
│   ├── create-iso-structure.sh   # ISO filesystem setup
│   ├── generate-iso.sh           # ISO generation
│   └── test-iso.sh               # ISO testing
│
├── build/                         # Build output directory
│   ├── iso/                       # ISO filesystem (temporary)
│   ├── output/                    # Final output
│   │   ├── AlpineReactOS.iso    # Bootable ISO
│   │   └── AlpineReactOS.iso.sha256
│   └── create_iso.py            # Python ISO builder
│
├── rootfs/                        # Alpine Linux root filesystem template
│   ├── bin/, sbin/               # Binaries
│   ├── etc/                       # Configuration files
│   ├── var/www/html/gemini       # GeminiOS app location
│   ├── usr/                       # User programs
│   └── lib/                       # Libraries
│
├── Makefile                       # Build automation
├── quick-build.sh                # Quick build helper
├── build.config                  # Build configuration
├── Dockerfile                    # Docker build environment
├── BUILD_SUMMARY.md              # Build summary
└── README.md                     # Project documentation
```

---

## Build Process Detail

### 1. Environment Setup (build.sh)
```bash
✓ Verifikasi direktori build
✓ Install npm dependencies
✓ Copy build configuration
```

### 2. App Build
```bash
✓ npm run build (GeminiOS)
✓ Generate production bundle
✓ Copy to rootfs/var/www/html/gemini/
```

### 3. Rootfs Configuration (setup-alpine-rootfs.sh)
```bash
✓ Create directory structure
✓ Configure /etc/hostname, /etc/fstab
✓ Setup init scripts
✓ Configure Lighttpd web server
✓ Setup networking
```

### 4. ISO Creation (create-iso-structure.sh)
```bash
✓ Copy rootfs to build/iso/
✓ Setup GRUB bootloader
✓ Setup Syslinux bootloader
✓ Add kernel & initramfs
```

### 5. ISO Generation (generate-iso.sh)
```bash
✓ Create bootable ISO dengan xorriso/mkisofs
✓ Set BIOS boot configuration
✓ Verify ISO integrity
✓ Generate SHA256 checksum
```

---

## Troubleshooting

### Problem: "npm not found"
```bash
Solution:
1. Install Node.js 18+: https://nodejs.org/
2. Or use NVM: curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
3. Verify: node --version
```

### Problem: "mkisofs not found"
```bash
Solution:
# Automatic (in build.sh)
./scripts/build.sh  # Auto-installs xorriso

# Manual
sudo apt-get install xorriso
# or
sudo apt-get install cdrtools
```

### Problem: ISO build fails
```bash
Solution:
1. Check disk space: df -h
2. Verify permissions: ls -la build/
3. Clear cache: make clean
4. Rebuild: make rebuild
5. Check logs: tail -20 build/build.log
```

### Problem: QEMU not available
```bash
Solution:
# Install QEMU
sudo apt-get install qemu-system-x86

# Test
qemu-system-x86_64 --version
```

### Problem: App not building
```bash
Troubleshoot:
1. cd app/
2. npm install --legacy-peer-deps
3. npm run build
4. Check dist/ exists
5. Check build output
```

---

## Deployment

### Option 1: USB Stick
```bash
# Prepare USB (WARNING: destructive!)
lsblk  # Find device (e.g., /dev/sdX)

sudo dd if=build/output/AlpineReactOS.iso of=/dev/sdX bs=4M
sudo sync

# Boot from USB and wait ~30 seconds
```

### Option 2: Virtual Machine
```bash
# VirtualBox
1. New VM → Name: AlpineReactOS
2. Type: Linux → Version: Linux 2.6 / 3.x
3. Memory: 512 MB
4. Storage: Create virtual hard disk (1GB)
5. Settings → Storage → Choose ISO
6. Boot

# QEMU (command line)
./quick-build.sh boot

# Or manual
qemu-system-x86_64 -m 512 -cdrom build/output/AlpineReactOS.iso -boot d
```

### Option 3: Cloud/Server
```bash
# Upload ISO
scp build/output/AlpineReactOS.iso user@server:/tmp/

# On server - test
qemu-system-x86_64 -m 512 -cdrom /tmp/AlpineReactOS.iso -nographic

# Or use cloud provider image converter
```

### Accessing GeminiOS
```
Local: http://localhost/gemini
Remote: http://<your-ip>/gemini

Default Credentials:
- User: root
- Password: (empty)
```

---

## Docker Support

### Build dalam Docker
```bash
# Build image
docker build -t alpinereactos:latest .

# Run build
docker run --rm -v $(pwd):/workspace -w /workspace \
  alpinereactos:latest make build

# Or interactive shell
docker run --rm -it -v $(pwd):/workspace -w /workspace \
  alpinereactos:latest bash
```

### Using Makefile
```bash
make docker-build
make docker-shell
```

---

## Configuration

### Modifying build.config
```bash
# Edit build parameters
nano build.config

# Key options:
PROJECT_VERSION=1.0.0
ALPINE_VERSION=latest-stable
MIN_RAM_MB=512
ROOTFS_SIZE_MB=500
COMPRESS_ISO=true
```

---

## Performance Tips

### Faster Builds
```bash
# Use SSD for build directory
export BUILD_DIR=/mnt/ssd/build

# Parallel build (if supported)
export PARALLEL_JOBS=4
```

### Smaller ISO
```bash
# Enable compression in build.config
COMPRESS_ISO=true

# Minimize included apps in rootfs/
rm -rf rootfs/usr/share/doc
```

---

## Development Tips

### Watch Mode
```bash
cd app/
npm run dev
```

### Rebuild App Only
```bash
cd app/
npm run build
cp -r dist/* ../rootfs/var/www/html/gemini/
```

### Debug Boot
```bash
# Serial console
qemu-system-x86_64 -m 512 -cdrom AlpineReactOS.iso -serial stdio

# With debug info
./quick-build.sh boot
# Press 'a' for Alpine console
```

---

## References

- Alpine Linux: https://alpinelinux.org/
- Lighttpd: https://www.lighttpd.net/
- GRUB Bootloader: https://www.gnu.org/software/grub/
- Syslinux: https://wiki.syslinux.org/

---

## Support & Issues

📧 Report issues to: [GitHub Issues](https://github.com/mujionoc431120023-wq/AlpineReactOS/issues)

---

**Last Updated**: January 2026
