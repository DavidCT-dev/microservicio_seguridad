ARG NODE_VERSION=18.12.1
FROM node:${NODE_VERSION}-slim as base

WORKDIR /app

COPY --link package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production=false

COPY --link . .

RUN yarn run build

EXPOSE 3110

CMD [ "yarn", "run", "start:prod" ]
