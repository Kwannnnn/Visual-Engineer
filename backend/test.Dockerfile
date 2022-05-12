FROM node:alpine as test

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

CMD npm test