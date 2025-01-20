FROM node:18

WORKDIR /app

COPY ../package*.json ./

RUN npm ci

COPY user-service/ .

CMD ["node", "index.js"]
