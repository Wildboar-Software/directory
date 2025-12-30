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
