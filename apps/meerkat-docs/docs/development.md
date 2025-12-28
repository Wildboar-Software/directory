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
