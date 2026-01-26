#!/bin/bash

# Alpine ReactOS - Main Build Script

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BUILD_DIR="$PROJECT_ROOT/build"
ROOTFS_DIR="$PROJECT_ROOT/rootfs"
APP_DIR="$PROJECT_ROOT/app"
OUTPUT_DIR="$BUILD_DIR/output"

echo "==================================="
echo "Alpine ReactOS Build System"
echo "==================================="
echo "Project Root: $PROJECT_ROOT"
echo "Build Dir: $BUILD_DIR"
echo ""

# Create build directories
mkdir -p "$OUTPUT_DIR"
mkdir -p "$BUILD_DIR/iso"
mkdir -p "$ROOTFS_DIR/var/www/html"
mkdir -p "$ROOTFS_DIR/usr/local/bin"

echo "[1/5] Building GeminiOS React Application..."
cd "$APP_DIR"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install --legacy-peer-deps
fi

echo "Building production bundle..."
npm run build

# Copy built files to rootfs
echo "Copying built files to rootfs..."
mkdir -p "$ROOTFS_DIR/var/www/html/gemini"
cp -r "$APP_DIR/dist"/* "$ROOTFS_DIR/var/www/html/gemini/" 2>/dev/null || true

echo "[2/5] Setting up Alpine Linux rootfs..."
bash "$SCRIPT_DIR/setup-alpine-rootfs.sh"

echo "[3/5] Creating ISO filesystem..."
bash "$SCRIPT_DIR/create-iso-structure.sh"

echo "[4/5] Generating ISO image..."
bash "$SCRIPT_DIR/generate-iso.sh"

echo "[5/5] Creating checksum..."
cd "$OUTPUT_DIR"
sha256sum AlpineReactOS.iso > AlpineReactOS.iso.sha256
ls -lh AlpineReactOS.iso*

echo ""
echo "==================================="
echo "Build Complete!"
echo "==================================="
echo "Output: $OUTPUT_DIR/AlpineReactOS.iso"
echo "SHA256: $(cat AlpineReactOS.iso.sha256)"
