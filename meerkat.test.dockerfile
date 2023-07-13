FROM node:lts-alpine
LABEL author="Wildboar Software"
LABEL app="meerkat"
WORKDIR /srv/meerkat
COPY ./dist/apps/meerkat/package.json ./
COPY ./dist/apps/meerkat/package-lock.json ./
RUN npm install --only=production --no-audit --no-fund --no-save
RUN npm install --no-save prisma
COPY ./dist/apps/meerkat/prisma ./prisma
RUN npx -q prisma generate
COPY ./dist/apps/meerkat/assets ./assets
COPY ./dist/apps/meerkat/main.js ./
COPY ./dist/apps/meerkat/main.js.map ./
COPY ./dist/apps/meerkat/package_json.js ./
USER node
CMD ["/usr/local/bin/node", "--inspect=0.0.0.0", "--enable-source-maps", "/srv/meerkat/main.js"]
# CMD ["/usr/local/bin/node", "/srv/meerkat/main.js"]
