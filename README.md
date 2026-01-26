# Alpine ReactOS - ISO Build System

Sistem build Alpine Linux **minimal dan cepat** dengan GeminiOS React Application terintegrasi.

> **Status**: ✅ Fully functional | 🚀 Production ready | 📦 715 KB ISO

---

## Quick Start

```bash
# Setup environment
bash setup.sh

# Build ISO
./quick-build.sh build

# Boot in QEMU
./quick-build.sh boot
```

**Output**: `build/output/AlpineReactOS.iso` (715 KB)

---

## Commands

| Command | Purpose |
|---------|---------|
| `./quick-build.sh build` | Build ISO image |
| `./quick-build.sh rebuild` | Clean and rebuild |
| `./quick-build.sh test` | Test ISO integrity |
| `./quick-build.sh boot` | Boot in QEMU |
| `./quick-build.sh status` | Show build status |
| `make build` | Build using Makefile |
| `make clean` | Remove artifacts |
| `make help` | List all targets |

---

## What's Included

- **Alpine Linux**: Minimal base system (~40 MB)
- **GeminiOS**: React web application
- **Lighttpd**: Lightweight web server
- **GRUB + Syslinux**: Boot loaders
- **Automated Build System**: Scripts + Makefile

---

## Project Structure

```
AlpineReactOS/
├── app/                      # React application (GeminiOS)
├── scripts/                  # Build automation
│   ├── build.sh             # Main orchestrator
│   ├── setup-alpine-rootfs.sh
│   ├── create-iso-structure.sh
│   └── generate-iso.sh
├── build/                    # Build artifacts
│   └── output/AlpineReactOS.iso
├── rootfs/                   # Alpine Linux root filesystem
├── Makefile                 # Build automation
├── quick-build.sh          # Quick commands
├── setup.sh                # Environment setup
├── Dockerfile              # Docker support
└── BUILD_GUIDE.md          # Detailed documentation
```

---

## Requirements

### Minimum
- Node.js 18+
- npm or yarn
- bash 4+
- 2GB disk space

### Optional
- Docker (for isolated builds)
- QEMU (for ISO testing)

### Install
```bash
# Debian/Ubuntu
sudo apt-get install -y nodejs npm xorriso qemu-system-x86

# Or automatic
bash setup.sh
```

---

## Build Methods

### Method 1: Quick Build (Recommended)
```bash
./quick-build.sh build
```

### Method 2: Makefile
```bash
make build
make test
make clean
```

### Method 3: Docker
```bash
docker build -t alpinereactos .
docker run -v $(pwd):/workspace alpinereactos make build
```

### Method 4: Manual Scripts
```bash
./scripts/build.sh
```

---

## Documentation

- **BUILD_GUIDE.md**: Comprehensive guide with troubleshooting
- **BUILD_SUMMARY.md**: Build overview
- **app/README.md**: GeminiOS documentation

---

## Testing & Deployment

### Test ISO
```bash
./quick-build.sh test
```

### Boot in QEMU
```bash
./quick-build.sh boot
```

### Create USB
```bash
dd if=build/output/AlpineReactOS.iso of=/dev/sdX bs=4M && sync
```

### Virtual Machine
- VirtualBox: File > New VM > Select ISO
- VMware: Create VM > Boot from ISO
- KVM: Use virt-manager

---

## Accessing GeminiOS

After booting:
```
Local:  http://localhost/gemini
Remote: http://<your-ip>/gemini
```

**Default Credentials:**
- User: `root`
- Password: (empty)

---

## CI/CD

Automated builds on push:
- GitHub Actions workflow included
- Auto-test on PR
- Artifact generation

See: `.github/workflows/build.yml`

---

## Build System Performance

| Metric | Value |
|--------|-------|
| ISO Size | 715 KB |
| Build Time | 2-5 minutes |
| Memory Usage | 512 MB minimum |
| Disk Space | 2 GB |
| Boot Time | ~10 seconds |

---

## Troubleshooting

### Build fails
```bash
make clean
make rebuild
```

### ISO not bootable
```bash
./quick-build.sh test
```

### QEMU not found
```bash
sudo apt-get install qemu-system-x86
```

See **BUILD_GUIDE.md** for detailed troubleshooting.

---

## Configuration

Edit `build.config` to customize:
```bash
PROJECT_VERSION=1.0.0
ALPINE_VERSION=latest-stable
MIN_RAM_MB=512
COMPRESS_ISO=true
```

---

## Useful Links

- Alpine Linux: https://alpinelinux.org/
- Lighttpd: https://www.lighttpd.net/
- GRUB Bootloader: https://www.gnu.org/software/grub/
- React: https://react.dev/

---

## License

See LICENSE file.

---

**Last Updated**: January 2026 | **Status**: Production Ready
