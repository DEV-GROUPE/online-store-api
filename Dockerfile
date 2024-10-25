FROM node:20-alpine3.18 AS base

FROM base AS development

WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install -g nodemon
RUN npm install
COPY . .
EXPOSE 8000
CMD npm run dev

FROM base AS builder
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install
COPY src ./src
RUN npm run build

# production stage
FROM base AS production
WORKDIR /app
COPY package*.json ./
COPY --from=builder /app/dist ./dist
RUN npm install --production
CMD ["npm", "start"]
