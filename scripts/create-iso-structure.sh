#!/bin/bash

# Create ISO directory structure

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BUILD_DIR="$PROJECT_ROOT/build"
ROOTFS_DIR="$PROJECT_ROOT/rootfs"
ISO_BUILD="$BUILD_DIR/iso"

echo "Creating ISO directory structure..."

# Create boot structure
mkdir -p "$ISO_BUILD/boot/grub"
mkdir -p "$ISO_BUILD/boot/syslinux"

# Copy rootfs to ISO
cp -r "$ROOTFS_DIR"/* "$ISO_BUILD/" 2>/dev/null || true

# Create GRUB configuration
cat > "$ISO_BUILD/boot/grub/grub.cfg" << 'EOF'
# GRUB boot configuration

set default=0
set timeout=10

menuentry "Alpine ReactOS - Live" {
    linux /boot/vmlinuz-alpine root=/dev/sr0 ro quiet splash
    initrd /boot/initramfs-alpine
}

menuentry "Alpine ReactOS - Maintenance" {
    linux /boot/vmlinuz-alpine root=/dev/sr0 ro quiet single
    initrd /boot/initramfs-alpine
}
EOF

# Create syslinux configuration for BIOS boot
cat > "$ISO_BUILD/boot/syslinux/syslinux.cfg" << 'EOF'
DEFAULT menu.c32
PROMPT 0
TIMEOUT 50

MENU TITLE Alpine ReactOS v1.0
MENU BACKGROUND /boot/syslinux/splash.png

LABEL alpinereactos
    MENU LABEL Alpine ReactOS Live
    KERNEL /boot/vmlinuz-alpine
    APPEND root=/dev/sr0 ro quiet splash
    INITRD /boot/initramfs-alpine

LABEL maintenance
    MENU LABEL Maintenance Mode
    KERNEL /boot/vmlinuz-alpine
    APPEND root=/dev/sr0 ro quiet single
    INITRD /boot/initramfs-alpine
EOF

# Create README file
cat > "$ISO_BUILD/README.txt" << 'EOF'
Alpine ReactOS v1.0
==================

This is an ISO image combining Alpine Linux with the GeminiOS React application.

To boot this image:
1. Write ISO to USB: dd if=AlpineReactOS.iso of=/dev/sdX bs=4M
2. Or use in virtual machine (QEMU, VirtualBox, VMware, etc.)

Default credentials:
- Username: root
- Password: (empty)

Access GeminiOS:
- Open browser and navigate to: http://localhost/gemini
- Or access from network: http://<your-ip>/gemini

For more information, visit the project repository.
EOF

echo "ISO structure created successfully at $ISO_BUILD"
ls -la "$ISO_BUILD/" | head -15
