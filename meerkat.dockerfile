FROM node:lts-alpine
LABEL author="Wildboar Software"
LABEL app="meerkat"
# RUN /usr/local/bin/node -v
# RUN /usr/local/bin/npm -v
# RUN /usr/local/bin/npx -v
WORKDIR /srv/meerkat
COPY ./dist/apps/meerkat ./

# These used to be needed for installing applicationinsights-native-metrics
# but this package was removed since it failed to build too much anyway.
# RUN apk add --no-cache python3
# RUN apk add --no-cache make
# RUN apk add --no-cache g++

# This can be "postgresql", "mysql", "cockroachdb", "sqlserver"
# ARG dbms_provider="mysql"

RUN npm install --only=production --no-audit --no-fund --no-save
# We save the Prisma CLI at build time so we can perform migrations in this
# container without worrying about NPM outages.
RUN npm install --no-save prisma
RUN npx -q prisma generate
USER node
ENTRYPOINT ["/usr/local/bin/node", "/srv/meerkat/main.js"]
