FROM node:25-alpine
LABEL author="Wildboar Software"
LABEL app="meerkat"
WORKDIR /srv/meerkat
COPY ./dist/apps/meerkat/package.json ./
COPY ./dist/apps/meerkat/package-lock.json ./
COPY .npmrc ./
RUN npm ci --only=production --no-audit --no-fund --no-save
RUN npm install --no-package-lock --no-save prisma
COPY ./dist/apps/meerkat/package.json ./
COPY ./dist/apps/meerkat/assets ./assets
COPY ./dist/apps/meerkat/prisma ./prisma
COPY ./dist/apps/meerkat/prisma/prisma.config.ts ./
COPY ./dist/apps/meerkat/main.js ./
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
