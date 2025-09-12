# Etapa 1: build
FROM node:18-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

RUN npm install typescript @types/typescript express @types/express ts-node 

RUN npm install uuid @types/uuid
RUN npm install ts-node-dev
RUN npm install knex @types/knex
RUN npm install mysql
COPY . .

# Compila TypeScript (gera dist/server.js)
RUN npx tsc 

# Etapa 2: produção
FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --production

COPY --from=build /usr/src/app/dist ./dist

EXPOSE 4000

CMD ["node", "dist/server.js"]

