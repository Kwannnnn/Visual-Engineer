FROM node:alpine as build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


FROM node:alpine as run

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/package*.json ./

COPY --from=build /usr/src/app/dist/ ./dist/

RUN npm ci --omit=dev

ENV NODE_ENV=production
ENV DEBUG=http

CMD ["npm", "run", "prod"]

EXPOSE 3000