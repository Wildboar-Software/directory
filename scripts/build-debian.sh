#!/bin/sh

VERSION=$(dpkg-parsechangelog -SVersion | sed 's/-.*//')

git archive \
  --format=tar \
  --prefix=meerkat-dsa-${VERSION}/ \
  HEAD \
| xz -c > ../meerkat-dsa_${VERSION}.orig.tar.xz
