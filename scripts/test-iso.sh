#!/bin/bash

# Test ISO script

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BUILD_DIR="$PROJECT_ROOT/build"
OUTPUT_DIR="$BUILD_DIR/output"
ISO_FILE="$OUTPUT_DIR/AlpineReactOS.iso"

echo "Testing Alpine ReactOS ISO..."
echo "=============================="

# Check if ISO exists
if [ ! -f "$ISO_FILE" ]; then
    echo "ERROR: ISO file not found at $ISO_FILE"
    echo "Please run ./scripts/build.sh first"
    exit 1
fi

echo "ISO Information:"
ls -lh "$ISO_FILE"
echo ""

# Check ISO integrity if sha256 available
if [ -f "$OUTPUT_DIR/AlpineReactOS.iso.sha256" ]; then
    echo "Verifying ISO checksum..."
    cd "$OUTPUT_DIR"
    sha256sum -c AlpineReactOS.iso.sha256
    echo ""
fi

# Try to mount ISO and list contents
echo "ISO Contents (if mountable):"
if command -v mount &> /dev/null; then
    MOUNT_POINT=$(mktemp -d)
    if mount -o loop,ro "$ISO_FILE" "$MOUNT_POINT" 2>/dev/null; then
        echo "Mounted at: $MOUNT_POINT"
        du -sh "$MOUNT_POINT"/*
        umount "$MOUNT_POINT"
        rmdir "$MOUNT_POINT"
    else
        echo "Could not mount ISO (expected in some environments)"
    fi
fi

echo ""
echo "Testing with QEMU (if available)..."

if command -v qemu-system-x86_64 &> /dev/null; then
    echo "QEMU found. To test the ISO, run:"
    echo "  qemu-system-x86_64 -m 512 -cdrom $ISO_FILE -boot d"
else
    echo "QEMU not installed. To test the ISO manually, use:"
    echo "  VirtualBox: New VM > Boot from $ISO_FILE"
    echo "  VMware: Create VM and set boot device to $ISO_FILE"
    echo "  QEMU: qemu-system-x86_64 -m 512 -cdrom $ISO_FILE -boot d"
fi

echo ""
echo "ISO ready for testing!"
