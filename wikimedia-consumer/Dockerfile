FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY wikimedia-consumer/ .

CMD ["node", "index.js"]
