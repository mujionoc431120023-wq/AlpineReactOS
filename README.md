# Alpine ReactOS - ISO Build System

Sistem build Alpine Linux dengan GeminiOS React Application terintegrasi.

## Struktur Proyek

```
.
├── app/                    # GeminiOS React Application
├── build/                  # Direktori build output
├── rootfs/                 # Root filesystem untuk Alpine Linux
├── scripts/                # Build scripts
├── Dockerfile              # Docker build environment
├── mkisofs.conf            # Konfigurasi ISO
└── README.md
```

## Requirements

- Docker atau Alpine Linux build tools
- Node.js 18+ (untuk GeminiOS)
- mkisofs/xorriso (untuk membuat ISO)
- git

## Cara Build

```bash
# Build ISO
./scripts/build.sh

# Test ISO (jika qemu terinstall)
./scripts/test-iso.sh
```

## Output

ISO yang sudah jadi akan berada di `build/output/AlpineReactOS.iso`
