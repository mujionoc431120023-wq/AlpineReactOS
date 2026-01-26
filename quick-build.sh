#!/bin/bash

# Alpine ReactOS - Quick Build Script
# Provides simple commands for common build tasks

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BUILD_DIR="$PROJECT_ROOT/build"
OUTPUT_DIR="$BUILD_DIR/output"
ISO_FILE="$OUTPUT_DIR/AlpineReactOS.iso"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_header() {
    echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║${NC} $1"
    echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Show help
show_help() {
    print_header "Alpine ReactOS - Build Helper"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  build       Build ISO image"
    echo "  rebuild     Clean and rebuild"
    echo "  test        Test ISO (requires QEMU)"
    echo "  clean       Remove build artifacts"
    echo "  status      Show build status"
    echo "  mount       Mount and inspect ISO"
    echo "  boot        Boot ISO in QEMU"
    echo "  help        Show this help message"
    echo ""
}

# Build ISO
build_iso() {
    print_header "Building Alpine ReactOS ISO"
    
    if [ ! -f "$PROJECT_ROOT/scripts/build.sh" ]; then
        print_error "build.sh not found!"
        return 1
    fi
    
    bash "$PROJECT_ROOT/scripts/build.sh"
    
    if [ -f "$ISO_FILE" ]; then
        print_success "ISO build complete: $ISO_FILE"
        ls -lh "$ISO_FILE"
    else
        print_error "ISO file not created!"
        return 1
    fi
}

# Rebuild (clean + build)
rebuild_iso() {
    print_header "Rebuilding Alpine ReactOS ISO"
    
    echo "Cleaning previous build..."
    rm -rf "$BUILD_DIR/iso"
    rm -f "$ISO_FILE" "$ISO_FILE.sha256"
    
    print_success "Cleaned old artifacts"
    build_iso
}

# Test ISO
test_iso() {
    print_header "Testing Alpine ReactOS ISO"
    
    if [ ! -f "$ISO_FILE" ]; then
        print_error "ISO file not found: $ISO_FILE"
        print_warning "Run 'build' first"
        return 1
    fi
    
    bash "$PROJECT_ROOT/scripts/test-iso.sh"
}

# Show build status
show_status() {
    print_header "Build Status"
    
    echo "Project: AlpineReactOS"
    echo "Location: $PROJECT_ROOT"
    echo ""
    
    if [ -f "$ISO_FILE" ]; then
        print_success "ISO file exists"
        echo "  File: $ISO_FILE"
        echo "  Size: $(du -h "$ISO_FILE" | cut -f1)"
        
        if [ -f "$ISO_FILE.sha256" ]; then
            echo "  SHA256: $(cat "$ISO_FILE.sha256")"
        fi
    else
        print_warning "ISO file not found"
        echo "  Path: $ISO_FILE"
    fi
    
    if [ -f "$PROJECT_ROOT/app/package.json" ]; then
        APP_VERSION=$(grep '"version"' "$PROJECT_ROOT/app/package.json" | head -1 | cut -d'"' -f4)
        print_success "App version: $APP_VERSION"
    fi
    
    echo ""
    echo "Build dirs:"
    [ -d "$BUILD_DIR" ] && echo "  $BUILD_DIR" || echo "  $BUILD_DIR (not found)"
    [ -d "$PROJECT_ROOT/rootfs" ] && echo "  $PROJECT_ROOT/rootfs" || echo "  $PROJECT_ROOT/rootfs (not found)"
}

# Clean build
clean_build() {
    print_header "Cleaning Build"
    
    echo "Removing: $BUILD_DIR/iso"
    rm -rf "$BUILD_DIR/iso"
    
    echo "Removing: $ISO_FILE"
    rm -f "$ISO_FILE"
    
    echo "Removing: $ISO_FILE.sha256"
    rm -f "$ISO_FILE.sha256"
    
    print_success "Clean complete!"
}

# Boot in QEMU
boot_qemu() {
    if ! command -v qemu-system-x86_64 &> /dev/null; then
        print_error "QEMU not installed"
        echo "Install with: apt-get install qemu-system-x86"
        return 1
    fi
    
    if [ ! -f "$ISO_FILE" ]; then
        print_error "ISO file not found: $ISO_FILE"
        return 1
    fi
    
    print_header "Booting in QEMU"
    echo "ISO: $ISO_FILE"
    echo "Memory: 512 MB"
    echo ""
    echo "Press Ctrl+C to stop QEMU"
    echo ""
    
    qemu-system-x86_64 -m 512 -cdrom "$ISO_FILE" -boot d
}

# Mount ISO
mount_iso() {
    if [ ! -f "$ISO_FILE" ]; then
        print_error "ISO file not found: $ISO_FILE"
        return 1
    fi
    
    MOUNT_POINT=$(mktemp -d)
    
    print_header "Mounting ISO"
    echo "Mount point: $MOUNT_POINT"
    
    if mount -o loop,ro "$ISO_FILE" "$MOUNT_POINT" 2>/dev/null; then
        print_success "Mounted successfully"
        echo ""
        echo "Contents:"
        ls -la "$MOUNT_POINT"
        echo ""
        echo "To unmount: sudo umount $MOUNT_POINT && rmdir $MOUNT_POINT"
    else
        print_error "Failed to mount (requires root)"
        rmdir "$MOUNT_POINT"
        return 1
    fi
}

# Main
case "${1:-help}" in
    build)
        build_iso
        ;;
    rebuild)
        rebuild_iso
        ;;
    test)
        test_iso
        ;;
    clean)
        clean_build
        ;;
    status)
        show_status
        ;;
    mount)
        mount_iso
        ;;
    boot)
        boot_qemu
        ;;
    help|"")
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac
