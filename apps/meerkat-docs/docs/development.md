# Development

## Documentation

Note that for all changes you make to `meerkat-docs`, there may be equivalent
documentation in `docs`.

## Building

Very soon, Meerkat DSA will build these packages in CI/CD. A lot of these
approaches are messy just because I had to build in one of each different
distro's container images and install in said images so I can smoke-test
installation into a real system. Eventually this will be cleaned up.

### Debian Package

Run `./scripts/build-debian.sh`, then run `dpkg-buildpackage -us -uc`, both in
the root directory of the project. Note that this will clean the source tree, so
you will lose some files and folders like `node_modules` and `dist`.

If you build this directly on the host system, you will have to make sure that
the version of NodeJS you compile against is the exact same one that it actually
runs on. The Debian package is hard-coded to run `/usr/bin/node`, but a lot of
NodeJS installations nowadays use NVM to version NodeJS. Run `which node` to
see if you're using it. You might need to run `nvm use 20.19.1` (or something
like that) _before_ you even build the package. Then run it.

### Snapcraft Snap

Build with `snapcraft pack -v`.

Install with `snap install ./meerkat-dsa_4.0.0_amd64.snap --dangerous`.

It seems like it automatically starts running on installation. Run
`journalctl -xe` to see logs for it.

Run a shell with `snap run --shell meerkat-dsa.meerkat-dsa-app` and you can
peek around in the VM to identify build issues.

### RPM Package

Run

```bash
./scripts/build-rpm.sh
podman build -t meerkat-rpm-builder -f pkg/rpmbuilder.dockerfile .
podman run --rm -it -v "$PWD:/src" -v "$PWD/rpmbuild:/root/rpmbuild" meerkat-rpm-builder rpmbuild -ba /src/pkg/meerkat.spec
```

If using Docker, replace `podman` with `docker`. It should be a drop-in
replacement.

You might see a ton of warnings pertaining to the executable bit being set on
Javascript files. This is a bug with JSR, which I reported
[here](https://github.com/jsr-io/jsr/issues/1246).

Note that the `fedora` container image has a file `/etc/dnf/dnf.conf` that, by
default excludes the installation of documentation from RPMs. You will need to
modify the `tsflags` option to remove `nodocs` if you want to see your man pages
show up. This took me _days_ to figure out.

### Alpine APK Package

You have to run the script twice. Exit out when it brings you into the
container shell for the first time.

```bash
./scripts/build-apk.sh
podman build -t apkbuilder -f pkg/apkbuilder.dockerfile .
./scripts/build-apk.sh
abuild checksum # automatically applies the checksum to APKBUILD
abuild # actually build it all
# Your packages end up here
apk add --allow-untrusted packages/home/x86_64/meerkat-dsa-4.0.0-r0.apk
```

### Arch Package

As with so many other containerized distros, it seems that the `archlinux` image
also refuses to install `man` pages by default. Check `/etc/pacman.conf` and
you'll see a `NoExtract` line with the `man` pages directory in it. You will
want to remove this if you plan to install the docs and verify that they work.

You have to run the script twice. Exit out when it brings you into the
container shell for the first time.

```bash
./scripts/build-arch.sh
podman build -t archbuilder -f pkg/archbuilder.dockerfile .
./scripts/build-arch.sh
```

In the shell of that container, run `makepkg -g >> PKGBUILD` to generate a
signature over the source and append it to `PKGBUILD`. Then run `makepkg -si`
to build the packages. From memory, I think this step might be interactive.

Install `devtools` and run `makerepropkg meerkat-dsa-4.0.0-0-x86_64.pkg.tar.zst`
to check if the package is reproducible. I got a 503 and
`failed to retrieve meerkat-dsa-docs-4.0.0-0-x86_64`, so I think I won't be able
to check this until its actually published. Not sure. I eventually want to make
this reproducible.

### Brew Formula

To build and install the Brew formula, you'll have to be either on a Mac OS
desktop device or on a systemd-using Linux distro, such as Ubuntu or Linux Mint.

For all the following commands, replace `<anyname>` with your choice of value:

1. Run `brew tap-new <anyname>/meerkat` to create a new local tap
2. Run `cp pkg/meerkat_dsa.rb /home/linuxbrew/.linuxbrew/Homebrew/Library/Taps/<anyname>/homebrew-meerkat/Formula`
   to manually copy the formula into it.
3. Run `brew install -vd <anyname>/meerkat/meerkat_dsa`

To make sure it's still acceptable, run
`brew audit --new <anyname>/meerkat/meerkat_dsa` and fix any errors you see
(except the one about `std_npm_args`; I don't really think that is a valid
requirement in my case).

Run `brew services start <anyname>/meerkat/meerkat_dsa` to start the DSA
locally. Run `journalctl --user -e` and make sure the DSA starts up correctly.

Run `brew uninstall meerkat_dsa` to uninstall it from your system.

Run `brew test -d meerkat_dsa` to run tests after it is installed.

## CI

[Here](https://github.com/actions/runner-images) are the different runners
GitHub supports. Unfortunately, it looks like you get Windows, MacOS, and
Ubuntu. So my ability to test the creation of software packages in CI will be a
bit limited, unless I tap into containers. GitHub natively supports running
workflows in containers instead. It will be virtually impossible to test this on
the BSDs except manually.

Note that there are no Docker images that even emulate MacOS, as described
[here](https://apple.stackexchange.com/questions/465642/base-macos-docker-images).
