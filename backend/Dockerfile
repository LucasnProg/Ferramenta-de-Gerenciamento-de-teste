FROM node:18-alpine

WORKDIR /usr/src/app

# Copia package.json e package-lock.json (se for usar)
COPY package*.json ./

# Instala dependências (cache layer)
RUN npm install --production

# Copia todo o código
COPY . .

# Compila TypeScript
RUN npm run build

EXPOSE 4000

CMD ["npm", "run", "start"]
