#!/bin/sh

git archive \
  --prefix=meerkat-dsa-4.0.0/ \
  -o meerkat-dsa-4.0.0.tar.gz \
  HEAD

# Build the container image first:
# podman build -t apkbuilder -f pkg/apkbuilder.dockerfile .
# which seems to be absent by default on some RPM distros.
CTRCLI=$(which docker || which podman || echo "docker")
$CTRCLI run --rm -it -v "$PWD/meerkat-dsa-4.0.0.tar.gz:/meerkat-dsa-4.0.0.tar.gz:ro" archbuilder /bin/sh

# Run:
# makepkg -g >> PKGBUILD
# makepkg -si
# sudo pacman -S ./meerkat-dsa-4.0.0-0-x86_64.pkg.tar.zst
# sudo pacman -S ./meerkat-dsa-docs-4.0.0-0-x86_64.pkg.tar.zst

# apk add --allow-untrusted /src/meerkat-dsa-4.0.0-r0.apk
# rc-service meerkat start
# podman cp 8fc263119b67:/home/builder/meerkat-dsa-4.0.0-0-x86_64.pkg.tar.zst .
# podman cp 8fc263119b67:/home/builder/meerkat-dsa-docs-4.0.0-0-x86_64.pkg.tar.zst .
# podman run --rm -it -v "$PWD:/src" alpine /bin/sh
