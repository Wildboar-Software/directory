FROM gentoo/stage3:latest

# ---- Base system ----
ENV ACCEPT_KEYWORDS="~amd64"

# Faster Portage
RUN mkdir -p /etc/portage && \
    echo 'FEATURES="buildpkg binpkg-request-signature"' >> /etc/portage/make.conf && \
    echo 'BINPKG_FORMAT="gpkg"' >> /etc/portage/make.conf

# ---- Sync tree ----
RUN emerge-webrsync && emerge --sync

RUN eselect profile list

# ---- Core build deps ----
RUN emerge --ask=n \
    dev-vcs/git \
    python

# ---- Local overlay ----
RUN eselect repository create meerkat || true

# Copy overlay into repo
COPY overlay /var/db/repos/meerkat

# Ensure repo is known
RUN echo "[meerkat]" > /etc/portage/repos.conf/meerkat.conf && \
    echo "location = /var/db/repos/meerkat" >> /etc/portage/repos.conf/meerkat.conf && \
    echo "masters = gentoo" >> /etc/portage/repos.conf/meerkat.conf && \
    echo "auto-sync = no" >> /etc/portage/repos.conf/meerkat.conf

# ---- Generate manifests ----
RUN ebuild /var/db/repos/meerkat/net-nds/meerkat-dsa/meerkat-dsa-0.1.0.ebuild manifest

# ---- Build binary package ----
RUN emerge --ask=n net-nds/meerkat-dsa

# ---- Export artifacts ----
RUN mkdir -p /out && cp -r /var/cache/binpkgs /out/binpkgs

CMD ["bash"]
