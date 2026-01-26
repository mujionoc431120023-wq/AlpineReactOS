#!/bin/bash

# Alpine ReactOS - Environment Setup Helper

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SETUP_LOG="$PROJECT_ROOT/.setup.log"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$SETUP_LOG"
}

success() {
    echo -e "${GREEN}✓${NC} $1" | tee -a "$SETUP_LOG"
}

error() {
    echo -e "${RED}✗${NC} $1" | tee -a "$SETUP_LOG"
    exit 1
}

warning() {
    echo -e "${YELLOW}⚠${NC} $1" | tee -a "$SETUP_LOG"
}

check_command() {
    if ! command -v "$1" &> /dev/null; then
        return 1
    fi
    return 0
}

echo "Setup starting at $(date)" > "$SETUP_LOG"

# 1. Check Node.js
log "Checking Node.js..."
if check_command node; then
    NODE_VERSION=$(node --version)
    success "Node.js found: $NODE_VERSION"
    
    if ! check_command npm; then
        error "npm not found with Node.js"
    fi
    NPM_VERSION=$(npm --version)
    success "npm found: $NPM_VERSION"
else
    error "Node.js not found. Please install from https://nodejs.org/"
fi

# 2. Check git
log "Checking git..."
if check_command git; then
    success "git found: $(git --version)"
else
    error "git not found"
fi

# 3. Check build tools
log "Checking build tools..."
if check_command bash; then
    success "bash found"
else
    error "bash not found"
fi

# 4. Check optional tools
log "Checking optional tools..."

if check_command docker; then
    success "Docker found: $(docker --version)"
else
    warning "Docker not found (optional)"
fi

if check_command qemu-system-x86_64; then
    success "QEMU found"
else
    warning "QEMU not found (needed for ISO testing)"
fi

if check_command xorriso; then
    success "xorriso found"
elif check_command mkisofs; then
    success "mkisofs found"
else
    warning "xorriso/mkisofs not found (will auto-install)"
fi

# 5. Check project structure
log "Checking project structure..."
REQUIRED_DIRS=("app" "scripts" "rootfs" "build")
for dir in "${REQUIRED_DIRS[@]}"; do
    if [ -d "$PROJECT_ROOT/$dir" ]; then
        success "Found: $dir/"
    else
        warning "Missing: $dir/"
    fi
done

# 6. Install npm dependencies
log "Installing npm dependencies..."
if [ ! -d "$PROJECT_ROOT/app/node_modules" ]; then
    log "node_modules not found, installing..."
    cd "$PROJECT_ROOT/app"
    npm install --legacy-peer-deps 2>&1 | tee -a "$SETUP_LOG"
    cd "$PROJECT_ROOT"
    success "npm dependencies installed"
else
    success "npm dependencies already installed"
fi

# 7. Setup completed
echo ""
log "Setup completed successfully!"
success "Ready to build"
echo ""
echo "Next steps:"
echo "  1. Run: ./quick-build.sh build"
echo "  2. Or use: make build"
echo "  3. Test with: ./quick-build.sh boot"
echo ""
echo "Documentation: See BUILD_GUIDE.md for detailed instructions"
echo "Log file: $SETUP_LOG"
