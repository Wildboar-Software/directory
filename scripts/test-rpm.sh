#!/bin/sh

# Note that the fedora image has a file /etc/dnf/dnf.conf that, by default
# excludes the installation of documentation from RPMs. You will need to modify
# the tsflags option to remove nodocs if you want to see your man pages
# show up. This took me _days_ to figure out.
CTRCLI=$(which docker || which podman)
$CTRCLI run --rm -it -v "$PWD/rpmbuild/RPMS/x86_64/meerkat-dsa-4.0.0-1.fc43.x86_64.rpm:/meerkat-dsa.rpm" fedora:latest /bin/bash
