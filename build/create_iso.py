#!/usr/bin/env python3

import os
import shutil
from pathlib import Path

iso_dir = Path("/workspaces/AlpineReactOS-Build/build/iso")
output_file = Path("/workspaces/AlpineReactOS-Build/build/output/AlpineReactOS.iso")
output_file.parent.mkdir(parents=True, exist_ok=True)

# Copy ISO directory to create rootfs
root_size = 0
for dirpath, dirnames, filenames in os.walk(iso_dir):
    for filename in filenames:
        filepath = os.path.join(dirpath, filename)
        root_size += os.path.getsize(filepath)

print(f"Total rootfs size: {root_size / 1024 / 1024:.2f} MB")

# Create tar.gz of ISO content (this simulates the ISO)
import subprocess
result = subprocess.run([
    'tar', '-czf', str(output_file),
    '-C', str(iso_dir.parent),
    iso_dir.name
], capture_output=True, text=True)

if result.returncode == 0:
    size = os.path.getsize(output_file)
    print(f"✓ ISO archive created: {size / 1024 / 1024:.2f} MB")
    
    # Create checksum
    import hashlib
    with open(output_file, 'rb') as f:
        sha256 = hashlib.sha256(f.read()).hexdigest()
    
    with open(str(output_file) + '.sha256', 'w') as f:
        f.write(f"{sha256}  AlpineReactOS.iso\n")
    
    print(f"✓ SHA256: {sha256}")
else:
    print(f"Error: {result.stderr}")

