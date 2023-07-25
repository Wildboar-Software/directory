# Versioning

Meerkat DSA roughly uses [Semantic Versioning](https://semver.org/), but it is
not entirely clear what constitutes a "breaking change" for something other than
a pure API. What about changes to environment variable names, or log messages?
In the face of this ambiguity, Meerkat DSA takes a somewhat liberal approach to
versioning, in part to avoid scaring off new users with repeated major version
increments.

## What is the current version?

There are multiple files throughout this repository that indicate version
numbers. These all need to be updated with a version change, but may not happen
at the same time. As such,
**the git tag shall be considered authoritative for identifying a version**.
Just because the `package.json` in `apps/meerkat` says `2.5.0` does not mean
that you are looking at version `2.5.0`. It could be a few commits after the
real version `2.5.0`. The exact commit identified by a `v#.#.#` tag shall be
_the_ version, and all other commits on the `master` branch shall be considered
"non-version," "inter-version," or "non-release" commits, however you might
choose to phrase that.

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
