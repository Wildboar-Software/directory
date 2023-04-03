# Versioning

Meerkat DSA roughly uses [Semantic Versioning](https://semver.org/), but it is
not entirely clear what constitutes a "breaking change" for something other than
a pure API. What about changes to environment variable names, or log messages?
In the face of this ambiguity, Meerkat DSA takes a somewhat liberal approach to
versioning, in part to avoid scaring off new users with repeated major version
increments.

## Incrementing the Version

Unfortunately, there is no sure fire way to bump the version currently. I just
search for all files containing the current version and increment those.
Currently, the files I change are:

- `./.github/workflows/meerkat.yml`
- `./apps/meerkat-docs/docs/changelog-meerkat.md`
- `./apps/meerkat-docs/docs/conformance.md`
- `./k8s/charts/meerkat-dsa/Chart.yaml`
- `./pkg/control`
- `./pkg/docker-compose.yaml`
- `./pkg/meerkat-dsa.rb`
- `./snap/snapcraft.yaml`
