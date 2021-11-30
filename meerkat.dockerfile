FROM node:17-alpine
LABEL author="Wildboar Software"
LABEL version="1.0.0-beta.2"
LABEL app="meerkat"
# RUN /usr/local/bin/node -v
# RUN /usr/local/bin/npm -v
# RUN /usr/local/bin/npx -v
WORKDIR /srv/meerkat
COPY ./dist/apps/meerkat ./
RUN npm install --only=production --no-audit --no-fund --no-save
RUN npx -q prisma generate
USER node
ENTRYPOINT ["/usr/local/bin/node", "/srv/meerkat/main.js"]
