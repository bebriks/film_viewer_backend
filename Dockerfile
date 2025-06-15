FROM alpine:3.20

RUN apk add --no-cache nodejs npm

WORKDIR /usr/src/app

ARG ENV_FILE
COPY ${ENV_FILE:-.env.example} .env

COPY . .

EXPOSE 3003

RUN npm ci

RUN npm run build

CMD ["npm", "start"]