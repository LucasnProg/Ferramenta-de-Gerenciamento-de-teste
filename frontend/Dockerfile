# etapa 1: build com Node
FROM node:20-alpine AS build

WORKDIR /usr/src/app

# Copia package.json e package-lock.json primeiro para cache
COPY package*.json ./

# Instala todas as dependências (prod + dev)
RUN npm install

RUN npm install react react-dom

RUN npm install -D @types/react @types/react-dom typescript

RUN npm install --save-dev typescript @types/react @types/react-dom


# Copia todo o código fonte
COPY . .

# Build do frontend com Vite (gera /usr/src/app/dist)
RUN npm run build

# etapa 2: nginx para servir arquivos estáticos
FROM nginx:alpine

# Remove configuração padrão do Nginx
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia build do frontend gerado na etapa anterior
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80

# Inicializa Nginx
CMD ["nginx", "-g", "daemon off;"]
