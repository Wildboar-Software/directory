FROM alpine:latest
RUN apk add --no-cache alpine-sdk nano nodejs npm
RUN adduser -G abuild -D builder
USER builder
WORKDIR /home/builder
# Required for abuild signing (even if unsigned)
RUN abuild-keygen -a -n
# COPY apps libs pkg package.json package-lock.json .nvmrc .npmrc \
#     tsconfig.base.json vitest.workspace.ts LICENSE.txt ./
COPY --chown=builder:abuild . .
RUN cp -r pkg/apk/* .
