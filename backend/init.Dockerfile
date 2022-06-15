FROM node:alpine as test

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN chmod +x ./wait-for.sh

RUN chmod +x ./init.sh

CMD  ./wait-for.sh postgres:5432 -- ./init.sh