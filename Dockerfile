
FROM node:9.10.0-alpine

WORKDIR /app

COPY ./package.json .
COPY ./packages/game-server/package.json ./packages/game-server/
COPY ./packages/game-server/client/ ./packages/game-server/client/
COPY ./packages/common/package.json ./packages/common/

RUN npm i -g yarn
RUN yarn install --production

COPY ./packages/game-server/dist ./packages/game-server/dist
COPY ./packages/common/dist ./packages/common/dist

WORKDIR /app/packages/game-server

ENV NODE_ENV production

EXPOSE 4500

CMD ["node", "dist/index.js"]