FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY catalog-service/ ./catalog-service/
COPY utils/ ./utils/

EXPOSE 3002

CMD ["node", "catalog-service/index.js"]
