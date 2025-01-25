FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY order-service/ ./order-service/
COPY utils/ ./utils/

CMD ["node", "order-service/index.js"]
