FROM node:17-alpine
LABEL author="Wildboar Software"
LABEL version="1.0.0-beta.1"
LABEL app="meerkat"
WORKDIR /srv/meerkat
COPY package*.json ./
COPY prisma ./
RUN npm ci --only=production
RUN npx prisma generate
COPY ./dist/apps/meerkat /srv/meerkat
USER node
ENTRYPOINT ["/usr/local/bin/node", "/srv/meerkat/main.js"]
