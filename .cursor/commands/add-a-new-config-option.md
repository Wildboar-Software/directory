# Add a New Meerkat DSA 

## Overview

Add a new configuration option to Meerkat DSA for end users.

## Steps

1. Within the `Configuration` interface defined in
   `apps/meerkat/src/app/types/types.ts`, add a new field with the
   specified data type or an appropriate data type if none is specified. This
   new field should might not belong in the root of this data structure: for
   example, if it is related to logging, this new field would belong in the
   `log` field (which is `object`-typed) within the `Configuration` interface.
   Add documentation comments to the field as is done with the other fields.
   The documentation comments added should focus on the details that are
   relevant for the developers of Meerkat DSA rather than the end user,
   because the end user will have separate documentation.
2. Within `apps/meerkat/src/app/ctx.ts`, populate this new field with the value
   of an environment variable that starts with `MEERKAT_`, possibly after some
   parsing or transformation of some kind. For instance, if the configuration
   value essentially describes an integer, parse it using `Number.parseInt`. If
   it is a file path, read the whole file in synchronously, and decode it or
   parse its contents in some way, if needed, so that the value stored in
   memory is maximally useful with little--if any--further processing.
3. Document this new environment variable in `apps/meerkat-docs/docs/env.md`,
   as is done with the other environment variables. This is user-facing
   documentation, so avoid code details and be clear about nuances like
   default values and edge-case behaviors like negative values, zeroes,
   large numbers, empty strings, etc. These options are alphabetized, so put
   in the correct location.
4. Add the same documentation you just added to `apps/meerkat-docs/docs/env.md`
   in `doc/man/man5/meerkat.env.5`, but converting the formatting for a `man`
   page, of course. Just remove backticks for inline code entirely; keep the
   formatting real simple. Remove tables unless you can make a table in `man`
   page formatting. Feel free to change the wording or the focus of this
   documentation a little bit, bearing in mind that the `man` page
   documentation is basically for system administrators as a reference in a
   pince. It should be to-the-point. Again, these options are alphabetized;
   please keep it that way.
5. Add the new configuration option to `pkg/meerkat_in_snap.sh`. As with the
   other configuration options in this file, obtain the configuration value
   from `snapctl`; the configuration item's name should be the name of the
   environment variable after removing the leading `MEERKAT_` and replacing
   the underscores with hyphens. Configuration options are alphabetized
   here too.
   
   If this configuration option is for a file, the procedure is different:
   check for a suitable hard-coded file's existence in `$SNAP_COMMON` and if it
   is present, then set the environment variable to that file's path, using
   the `$SNAP_COMMON` environment variable in it's path.
6. Add the new configuration option to `k8s/charts/meerkat-dsa/values.yaml`,
   which is for the Meerkat DSA Helm chart. It should be named after
   the environment variable after removing the leading `MEERKAT_` and
   lower-casing. Again, files are treated differently, and if the new option
   is a file, whether it is a secret or just a config will require specific
   handling. You can use other commented out examples in the file for
   reference.
7. Use the new configuration option in
   `k8s/charts/meerkat-dsa/templates/config.yaml`. The options in this file
   are alphabetized. If the configuration option points to a file in a
   secret or config map, it does not get used here. It just gets directly
   mounted in `k8s/charts/meerkat-dsa/templates/statefulset.yaml`.
8. In `k8s/charts/meerkat-dsa/templates/statefulset.yaml`, mount these new
   options from the config map as is done with the other options, unless it
   is a file in a separate configmap or secret: in this case, just mount
   these things and ensure the file is mounted at the correct location.
9. Add the default value of this configuration setting to the test context
   created in `apps/meerkat/src/app/testing.spec.ts`, unless you think a
   different value would be better in a test environment.
