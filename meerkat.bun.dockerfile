# ubuntu:latest points to LTS.
FROM ubuntu:latest
LABEL author="Wildboar Software"
LABEL app="meerkat"
RUN apt update && apt install -y curl unzip
ENV BUN_INSTALL /usr/local
RUN curl -fsSL https://bun.sh/install | bash
WORKDIR /srv/meerkat
COPY ./dist/apps/meerkat ./
RUN /usr/local/bin/bun install --only=production --no-audit --no-fund --no-save
# We save the Prisma CLI at build time so we can perform migrations in this
# container without worrying about NPM outages.
RUN /usr/local/bin/bun install --no-save prisma
RUN /usr/local/bin/bun run prisma generate
ENTRYPOINT ["/usr/local/bin/bun", "/srv/meerkat/main.js"]
