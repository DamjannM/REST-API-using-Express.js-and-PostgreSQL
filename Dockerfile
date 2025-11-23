FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm install && npx prisma generate

COPY . .

EXPOSE 5000

CMD ["node", "./src/server.js"]
