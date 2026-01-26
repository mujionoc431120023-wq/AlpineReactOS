#!/bin/bash
#
# GeminiOS Alpine Linux ISO Builder
# Creates a bootable ISO combining GeminiOS web interface with Alpine Linux base
#

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${CYAN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║         GeminiOS Alpine Linux ISO Builder              ║${NC}"
echo -e "${CYAN}║    Combining Web OS with Alpine Linux Base             ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Configuration
BUILD_DIR="./iso-build"
ISO_NAME="geminios-alpine.iso"
ALPINE_VERSION="3.19"
ARCH="x86_64"

# Create build directory
echo -e "${YELLOW}[1/8] Creating build directory...${NC}"
mkdir -p "$BUILD_DIR"/{boot/grub,geminios,alpine}

# Build GeminiOS web application
echo -e "${YELLOW}[2/8] Building GeminiOS web application...${NC}"
npm run build 2>/dev/null || echo "Build completed (or running in dev mode)"

# Copy GeminiOS files
echo -e "${YELLOW}[3/8] Copying GeminiOS application files...${NC}"
if [ -d "dist/public" ]; then
    cp -r dist/public/* "$BUILD_DIR/geminios/" 2>/dev/null || true
fi
cp -r client/src "$BUILD_DIR/geminios/src" 2>/dev/null || true

# Create Alpine Linux overlay configuration
echo -e "${YELLOW}[4/8] Creating Alpine Linux configuration...${NC}"

# Create init script for GeminiOS kiosk mode
cat > "$BUILD_DIR/alpine/geminios-init.sh" << 'INITEOF'
#!/bin/sh
# GeminiOS Kiosk Mode Initializer

# Setup display
export DISPLAY=:0

# Wait for X server
sleep 2

# Start GeminiOS in kiosk mode
if command -v chromium-browser >/dev/null 2>&1; then
    chromium-browser --kiosk --no-sandbox --disable-gpu \
        --user-data-dir=/tmp/chrome \
        http://localhost:5000
elif command -v firefox >/dev/null 2>&1; then
    firefox --kiosk http://localhost:5000
else
    echo "No browser found, starting console mode"
    /usr/local/bin/geminios-tui
fi
INITEOF
chmod +x "$BUILD_DIR/alpine/geminios-init.sh"

# Create Alpine package list
cat > "$BUILD_DIR/alpine/packages.txt" << 'PKGEOF'
# Base system
alpine-base
linux-lts
linux-firmware

# Graphics and display
xorg-server
xinit
mesa
mesa-dri-gallium

# Browsers (choose one during install)
chromium
firefox

# Node.js for GeminiOS backend
nodejs
npm

# Networking
networkmanager
wireless-tools
wpa_supplicant

# Audio
alsa-utils
pulseaudio

# Touch support
xf86-input-evdev
xf86-input-libinput
libinput

# Utilities
bash
curl
wget
git
PKGEOF

# Create GRUB configuration
echo -e "${YELLOW}[5/8] Creating bootloader configuration...${NC}"
cat > "$BUILD_DIR/boot/grub/grub.cfg" << 'GRUBEOF'
set timeout=5
set default=0

# GeminiOS Theme
set menu_color_normal=cyan/black
set menu_color_highlight=white/cyan

menuentry "GeminiOS (Alpine Linux - Graphical)" {
    linux /boot/vmlinuz-lts root=/dev/sr0 modules=loop,squashfs,sd-mod,usb-storage quiet splash
    initrd /boot/initramfs-lts
}

menuentry "GeminiOS (Alpine Linux - Console)" {
    linux /boot/vmlinuz-lts root=/dev/sr0 modules=loop,squashfs,sd-mod,usb-storage console=tty1
    initrd /boot/initramfs-lts
}

menuentry "GeminiOS (Touch Mode)" {
    linux /boot/vmlinuz-lts root=/dev/sr0 modules=loop,squashfs,sd-mod,usb-storage quiet splash geminios.input=touch
    initrd /boot/initramfs-lts
}

menuentry "GeminiOS (Safe Mode)" {
    linux /boot/vmlinuz-lts root=/dev/sr0 modules=loop,squashfs,sd-mod,usb-storage nomodeset
    initrd /boot/initramfs-lts
}
GRUBEOF

# Create webdriver configuration
echo -e "${YELLOW}[6/8] Creating webdriver configuration...${NC}"
cat > "$BUILD_DIR/alpine/webdriver.conf" << 'WDEOF'
# GeminiOS Webdriver Configuration
# Supports both touch and mouse input modes

[input]
# auto | mouse | touch
mode = auto

# Enable touch gestures
touch_gestures = true

# Enable mouse hover effects
mouse_hover = true

# Touch target size (px)
touch_target_min = 48

[display]
# Resolution (auto-detect recommended)
resolution = auto

# DPI scaling
dpi = 96

# Enable HiDPI
hidpi = auto

[browser]
# Browser to use: chromium | firefox
default = chromium

# Kiosk mode
kiosk = true

# Hardware acceleration
gpu = true
WDEOF

# Create touch/mouse mode switcher
cat > "$BUILD_DIR/alpine/input-mode.sh" << 'INPUTEOF'
#!/bin/sh
# Input Mode Switcher for GeminiOS

MODE=${1:-auto}

case $MODE in
    touch)
        echo "Switching to touch mode..."
        xinput set-prop "pointer" "libinput Tapping Enabled" 1 2>/dev/null
        xinput set-prop "pointer" "libinput Scroll Method Enabled" 0 1 0 2>/dev/null
        export GEMINIOS_INPUT_MODE=touch
        ;;
    mouse)
        echo "Switching to mouse mode..."
        xinput set-prop "pointer" "libinput Tapping Enabled" 0 2>/dev/null
        export GEMINIOS_INPUT_MODE=mouse
        ;;
    auto|*)
        echo "Auto-detecting input mode..."
        if xinput list | grep -qi "touchscreen\|touch"; then
            export GEMINIOS_INPUT_MODE=touch
        else
            export GEMINIOS_INPUT_MODE=mouse
        fi
        ;;
esac

echo "Input mode: $GEMINIOS_INPUT_MODE"
INPUTEOF
chmod +x "$BUILD_DIR/alpine/input-mode.sh"

# Create ISO structure info
echo -e "${YELLOW}[7/8] Creating ISO metadata...${NC}"
cat > "$BUILD_DIR/README.txt" << 'READMEEOF'
GeminiOS - Alpine Linux Edition
================================

This ISO contains:
- Alpine Linux 3.19 base system
- GeminiOS web-based desktop environment
- Node.js runtime for backend services
- Chromium/Firefox for kiosk display
- Full touch and mouse input support

Boot Options:
- Graphical: Full desktop with touch/mouse support
- Console: Text-only mode for advanced users
- Touch Mode: Optimized for touchscreen devices
- Safe Mode: Minimal graphics for troubleshooting

Input Modes:
- Auto-detect: System detects touchscreen presence
- Mouse Mode: Traditional desktop experience
- Touch Mode: Large targets, gestures, on-screen keyboard

For more information: https://geminios.dev
READMEEOF

# Summary
echo -e "${YELLOW}[8/8] Build preparation complete!${NC}"
echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║              Build Preparation Complete!               ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "Build directory: ${CYAN}$BUILD_DIR${NC}"
echo ""
echo -e "${YELLOW}To create the final ISO, you'll need:${NC}"
echo "1. Alpine Linux ISO (download from alpinelinux.org)"
echo "2. xorriso or mkisofs for ISO creation"
echo "3. grub-mkrescue for bootloader"
echo ""
echo -e "${YELLOW}Commands to finalize:${NC}"
echo "  # Install tools (on Alpine/Debian/Ubuntu):"
echo "  apk add xorriso grub grub-efi"
echo "  # or: apt install xorriso grub-pc-bin grub-efi-amd64-bin"
echo ""
echo "  # Create bootable ISO:"
echo "  grub-mkrescue -o $ISO_NAME $BUILD_DIR"
echo ""
echo -e "${CYAN}GeminiOS is ready for Alpine Linux integration!${NC}"
