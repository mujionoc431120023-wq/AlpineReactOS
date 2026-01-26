FROM alpine:latest

RUN apk add --no-cache \
    bash \
    git \
    build-base \
    xorriso \
    syslinux \
    grub-efi \
    perl \
    nodejs \
    npm \
    lighttpd

WORKDIR /build

COPY . /build/

RUN chmod +x scripts/*.sh

CMD ["./scripts/build.sh"]
