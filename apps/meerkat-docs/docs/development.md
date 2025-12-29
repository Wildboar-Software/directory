# Development

## Documentation

Note that for all changes you make to `meerkat-docs`, there may be equivalent
documentation in `docs`.

## Building

### Debian Package

Run `./scripts/build-debian.sh`, then run `dpkg-buildpackage -us -uc`, both in
the root directory of the project. Note that this will clean the source tree, so
you will lose some files and folders like `node_modules` and `dist`.

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
