FROM node:11.1.0-alpine

WORKDIR /usr/src/app

COPY package.json ./package.json
COPY yarn.lock ./yarn.lock

COPY . .

RUN yarn install

CMD ["yarn", "start:prod"]