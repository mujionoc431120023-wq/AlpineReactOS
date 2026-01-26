#!/bin/bash

# Setup Alpine Linux rootfs

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
ROOTFS_DIR="$PROJECT_ROOT/rootfs"

echo "Setting up Alpine Linux rootfs..."

# Create essential directories
mkdir -p "$ROOTFS_DIR"/{bin,sbin,etc,lib,usr,var,proc,sys,dev,home,root,tmp,boot,media,mnt}
mkdir -p "$ROOTFS_DIR"/var/{cache,log,run}
mkdir -p "$ROOTFS_DIR"/usr/{bin,sbin,lib,local,share}

# Create basic configuration files
cat > "$ROOTFS_DIR/etc/hostname" << 'EOF'
alpinereactos
EOF

cat > "$ROOTFS_DIR/etc/fstab" << 'EOF'
proc    /proc       proc    defaults    0 0
sysfs   /sys        sysfs   defaults    0 0
devtmpfs /dev       devtmpfs defaults    0 0
EOF

cat > "$ROOTFS_DIR/etc/inittab" << 'EOF'
::sysinit:/sbin/openrc sysinit
::wait:/sbin/openrc
::respawn:/sbin/agetty 0 tty1
::ctrlaltdel:/sbin/openrc reboot
::shutdown:/sbin/openrc shutdown
EOF

cat > "$ROOTFS_DIR/etc/motd" << 'EOF'
  ___    _      _            ____                 _    ___  ____
 / _ \  | |    (_)          |  _ \ ___  __ _  ___| |_ / _ \/ ___|
| |_| | | |    | | ___      | |_) / _ \/ _` |/ __| __| | | \___ \
|  _  | | |___ | |/ _ \  _  |  _ <  __/ (_| | (__| |_| |_| |___) |
|_| |_| |_____|_|\___/ (_) |_| \_\___|\__,_|\___|\__|\___/|____/

Welcome to Alpine ReactOS
EOF

cat > "$ROOTFS_DIR/etc/issue" << 'EOF'
Alpine ReactOS v1.0
Kernel \r on \m
EOF

# Create startup scripts
mkdir -p "$ROOTFS_DIR/etc/init.d"

cat > "$ROOTFS_DIR/etc/init.d/web-server" << 'EOF'
#!/sbin/openrc-run

description="GeminiOS Web Server"
command="/usr/sbin/lighttpd"
command_args="-D -f /etc/lighttpd/lighttpd.conf"
pidfile="/var/run/lighttpd.pid"

depend() {
    need net
}
EOF

chmod +x "$ROOTFS_DIR/etc/init.d/web-server"

# Create lighttpd config
mkdir -p "$ROOTFS_DIR/etc/lighttpd"
cat > "$ROOTFS_DIR/etc/lighttpd/lighttpd.conf" << 'EOF'
server.port = 80
server.document-root = "/var/www/html"
server.pid-file = "/var/run/lighttpd.pid"
server.username = "www-data"
server.groupname = "www-data"

# Enable mod_rewrite untuk React routing
server.modules = (
    "mod_rewrite",
)

# Rewrite rules untuk SPA
url.rewrite = (
    "^/gemini/api/(.*)$" => "/gemini/api/$1",
    "^/gemini/(.*)$" => "/gemini/index.html",
)

accesslog.filename = "/var/log/lighttpd/access.log"
EOF

echo "Alpine rootfs setup completed"
