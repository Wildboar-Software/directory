#!/bin/sh

VERSION=$(dpkg-parsechangelog -SVersion | sed 's/-.*//')

git archive \
  --format=tar \
  --prefix=meerkat-dsa-${VERSION}/ \
  HEAD \
| xz -c > ../meerkat-dsa_${VERSION}.orig.tar.xz

# tar --exclude=debian \
#     --exclude=node_modules \
#     --exclude=dist \
#     --exclude=.nx \
#     --exclude=.vscode \
#     --exclude=demo \
#     --exclude=tmp \
#     --exclude=
#     -cJf ../meerkat-dsa_${VERSION}.orig.tar.xz \
#     .
