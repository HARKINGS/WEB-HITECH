FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

ENV PORT=80

EXPOSE 80

CMD ["npm", "start"]