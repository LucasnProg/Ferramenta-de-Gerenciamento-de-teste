# Etapa 1: build
FROM node:18-alpine AS build

WORKDIR /usr/src/app

# Copia apenas package.json e package-lock.json
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o restante do código
COPY . .

# Compila TypeScript
RUN npm run build

# Etapa 2: produção
FROM node:18-alpine

WORKDIR /usr/src/app

# Copia apenas package.json
COPY package*.json ./

# Instala dependências de produção
RUN npm install --omit=dev

# Copia arquivos compilados
COPY --from=build /usr/src/app/dist ./dist

# Expõe a porta
EXPOSE 4000

# Comando correto para iniciar o servidor
CMD ["node", "dist/index.js"]
