# First image to build the monorepo projects and discard the dev dependencies
FROM node:25
WORKDIR /build
COPY package.json .
COPY package-lock.json .
# RUN apk add gcc make
RUN npm ci --no-audit --no-fund --no-save
COPY --exclude=node_modules --exclude=dist --exclude=.nx . ./
RUN npx nx --tuiAutoExit=true --outputStyle=static run meerkat:build --skipNxCache --skipRemoteCache --skip-nx-cache --verbose

# Non-slim needed to build native add-ons
FROM node:25
WORKDIR /srv/meerkat
COPY --from=0 /build/dist/apps/meerkat/package.json ./
COPY --from=0 /build/dist/apps/meerkat/package-lock.json ./
COPY --from=0 /build/.npmrc ./
RUN npm ci --omit=dev --no-audit --no-fund --no-save
RUN npm install --no-save prisma@7.0.1

FROM node:25-slim
LABEL author="Wildboar Software"
LABEL app="meerkat"
WORKDIR /srv/meerkat
COPY --from=1 /srv/meerkat/node_modules ./node_modules
COPY --from=0 /build/dist/apps/meerkat/assets ./assets
COPY --from=0 /build/dist/apps/meerkat/prisma ./prisma
COPY --from=0 /build/dist/apps/meerkat/prisma/prisma.config.ts ./
COPY --from=0 /build/dist/apps/meerkat/main.js ./
# Make a folder for the database
RUN mkdir db
# Use this as the SQLite database
ENV DATABASE_URL=file:./db/meerkat.db
# Apply database schema to the database
RUN npx -q prisma migrate deploy --schema ./prisma/schema.prisma --config ./prisma.config.ts
# The whole folder must be owned by the node user, because SQLite requires the
# ability to write other files in the folder.
RUN chown -R node:node ./db
# Drop from root to the NodeJS user
USER node
CMD ["/usr/local/bin/node", "/srv/meerkat/main.js", "start"]
