FROM node:lts-alpine AS server

ENV CYPRESS_INSTALL_BINARY=0

WORKDIR /build
COPY . /build

RUN npm install \
    && npm run build:prod api

FROM node:lts-alpine AS client

ENV CYPRESS_INSTALL_BINARY=0

WORKDIR /build
COPY . /build

RUN apk add git \
    && npm install \
    && npm run build:prod \
    && npm run generate:hash


FROM node:lts-alpine

LABEL maintainer=support@secanis.ch \
    ch.secanis.tool=stjorna \
    ch.secanis.version=$VERSION

WORKDIR /app
ENV NODE_ENV production

COPY healthcheck.js /app/healthcheck.js
COPY package.prod.json /app/package.json
COPY --from=server /build/dist/apps/api ./
COPY --from=client /build/dist/apps/mqtt-dashboard ./public

RUN npm install --production \
    && adduser -D myuser \
    && chown myuser:myuser -R ./
USER myuser

HEALTHCHECK --interval=15s --timeout=15s --start-period=5s --retries=3 CMD node /app/healthcheck.js

EXPOSE 3333

CMD ["node", "main.js"]
