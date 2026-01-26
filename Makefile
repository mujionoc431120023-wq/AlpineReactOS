.PHONY: help build test clean install docker-build docker-shell rebuild dev check

PROJECT_NAME := AlpineReactOS
ISO_FILE := build/output/AlpineReactOS.iso
APP_DIR := app
SCRIPT_DIR := scripts
BUILD_DIR := build

help:
	@echo "=== $(PROJECT_NAME) Build System ==="
	@echo ""
	@echo "Available targets:"
	@echo "  make build          Build ISO image"
	@echo "  make test           Test ISO (requires qemu)"
	@echo "  make rebuild        Clean and rebuild ISO"
	@echo "  make clean          Remove build artifacts"
	@echo "  make install        Install build dependencies"
	@echo "  make dev            Start development server"
	@echo "  make check          Check TypeScript syntax"
	@echo "  make docker-build   Build in Docker container"
	@echo "  make docker-shell   Open Docker shell"
	@echo ""

build: .check-deps
	@echo "Building $(PROJECT_NAME)..."
	@bash $(SCRIPT_DIR)/build.sh

test: $(ISO_FILE) .check-qemu
	@echo "Testing ISO image..."
	@bash $(SCRIPT_DIR)/test-iso.sh

rebuild: clean build

clean:
	@echo "Cleaning build artifacts..."
	@rm -rf $(BUILD_DIR)/iso $(ISO_FILE) $(BUILD_DIR)/*.tar.gz
	@rm -f $(ISO_FILE).sha256
	@cd $(APP_DIR) && npm run build 2>/dev/null || true
	@echo "Clean complete!"

install:
	@echo "Installing build dependencies..."
	@which npm > /dev/null || echo "ERROR: npm not found! Please install Node.js 18+"
	@which mkisofs > /dev/null 2>&1 || apt-get install -y xorriso
	@which docker > /dev/null 2>&1 || echo "Docker not found (optional)"
	@echo "Dependencies installed!"

dev:
	@echo "Starting development server..."
	@cd $(APP_DIR) && npm run dev

check:
	@echo "Checking TypeScript..."
	@cd $(APP_DIR) && npm run check

.check-deps:
	@which npm > /dev/null || (echo "ERROR: npm required" && exit 1)
	@which bash > /dev/null || (echo "ERROR: bash required" && exit 1)

.check-qemu:
	@which qemu-system-x86_64 > /dev/null || (echo "WARNING: qemu-system-x86_64 not found"; exit 0)

docker-build:
	@echo "Building in Docker..."
	@docker build -t $(PROJECT_NAME):latest .
	@docker run --rm -v $(PWD):/workspace -w /workspace $(PROJECT_NAME):latest make build

docker-shell:
	@echo "Opening Docker shell..."
	@docker run --rm -it -v $(PWD):/workspace -w /workspace $(PROJECT_NAME):latest bash

.DEFAULT_GOAL := help
