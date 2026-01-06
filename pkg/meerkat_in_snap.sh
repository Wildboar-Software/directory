#!/bin/sh
cd $SNAP

# If the migration fails, still carry on: we do not want a failed migration
# (which is infrequently needed to begin with) to make us unable to start
# Meerkat DSA
#
# NOTE: Prisma seems to search for migrations relative to the config file, not
# the current directory.
$SNAP/bin/npx prisma migrate deploy \
    --schema prisma/schema.prisma \
    --config prisma.config.ts || true

exec $SNAP/bin/node main.mjs start "$@"
