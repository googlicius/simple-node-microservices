FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY api-gateway/ .

EXPOSE 3000

CMD ["node", "index.js"]
