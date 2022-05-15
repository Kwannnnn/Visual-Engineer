FROM node:alpine as test

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN chmod +x ./wait-for.sh

CMD ./wait-for.sh postgres:5432 -- npm run db:update && npm run ci:test