FROM fedora:latest

# Avoid interactive installs
ENV TERM=xterm-256color
ENV LANG=C.UTF-8

# Install RPM + NodeJS build dependencies
RUN dnf -y update \
    && dnf -y install \
        rpm-build \
        rpmdevtools \
        systemd-rpm-macros \
        nodejs \
        npm \
        git \
        tar \
        gzip \
        findutils \
        which \
        shadow-utils \
        nodejs-devel \
    && dnf clean all

# Default rpmbuild tree
RUN rpmdev-setuptree
