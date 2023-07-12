FROM node:18.14-bullseye-slim as builder

WORKDIR /build

RUN apt-get update && apt-get install -y --no-install-recommends dumb-init

COPY package.json .
COPY yarn.lock .
COPY .yarnrc.yml .
COPY .yarn .yarn
COPY node_modules node_modules
COPY tsconfig.json .
COPY tsconfig.build.json .
COPY src src

ENV IGNORE_HUSKY 1

RUN yarn
RUN yarn build
RUN yarn workspaces focus fastify-init --production

FROM node:18.14-bullseye-slim

WORKDIR /app

COPY --from=builder /usr/bin/dumb-init /usr/bin/dumb-init
COPY --chown=node:node --from=builder /build/node_modules /app/node_modules
COPY --chown=node:node --from=builder /build/dist /app/dist

ENV NODE_ENV production
ENV NODE_PATH dist

USER node

CMD ["dumb-init", "node", "dist/src"]
