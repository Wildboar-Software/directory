#!/bin/sh
mkdir -p rpmbuild/SOURCES rpmbuild/SPECS

git archive \
  --prefix=meerkat-dsa-4.0.0/ \
  -o rpmbuild/SOURCES/meerkat-dsa-4.0.0.tar.gz \
  HEAD

cp pkg/meerkat.spec rpmbuild/SPECS/

rpmbuild \
  --define "_topdir $PWD/rpmbuild" \
  -ba rpmbuild/SPECS/meerkat.spec
