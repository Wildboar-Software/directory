#!/bin/sh

git archive \
  --prefix=meerkat-dsa-4.0.0/ \
  -o meerkat-dsa-4.0.0.tar.gz \
  HEAD

# Build the container image first:
# podman build -t apkbuilder -f pkg/apkbuilder.dockerfile .
# which seems to be absent by default on some RPM distros.
CTRCLI=$(which docker || which podman || echo "docker")
$CTRCLI run --rm -it -v "$PWD/meerkat-dsa-4.0.0.tar.gz:/meerkat-dsa-4.0.0.tar.gz:ro" apkbuilder /bin/sh

# Run:
# abuild checksum
# abuild
# apk add --allow-untrusted packages/home/x86_64/meerkat-dsa-4.0.0-r0.apk

# apk add --allow-untrusted /src/meerkat-dsa-4.0.0-r0.apk
# rc-service meerkat start
# podman cp 6962ff904a75:/home/builder/packages/home/x86_64/meerkat-dsa-4.0.0-r0.apk .
# podman run --rm -it -v "$PWD:/src" alpine /bin/sh
