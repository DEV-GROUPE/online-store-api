FROM node:20-alpine3.18 AS base

FROM base AS development

RUN npm install -g nodemon
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8000
CMD npm run dev

FROM base AS test
RUN npm i -g jest
RUN npm i -g supertest
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 9000
CMD npm run test

FROM base AS production

WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY . .
EXPOSE 8000
CMD npm run start
