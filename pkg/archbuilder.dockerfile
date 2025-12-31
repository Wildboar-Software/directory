FROM archlinux:latest

# Basic packaging + runtime tools
RUN pacman -Sy --noconfirm \
    base-devel \
    nodejs \
    npm \
    git \
    sudo
RUN useradd -m builder && echo "builder ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers
USER builder
WORKDIR /home/builder
# COPY PKGBUILD ./
# COPY *.service ./
COPY --chown=builder:builder . .
RUN cp pkg/PKGBUILD .
# TODO: Remove later. I just don't want to break the apk build.
RUN cp -r pkg/apk/* .
CMD ["/bin/bash"]
