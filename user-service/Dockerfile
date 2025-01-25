FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY user-service/ .
COPY utils/ .

CMD ["node", "index.js"]
