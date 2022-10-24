# syntax:docker/dockerfile:1

#base
FROM node:16.14.2-alpine AS base

ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]

#dev
FROM base AS dev
RUN npm install --frozen-lockfile
COPY . .
CMD ["npm", "run", "start:dev"]

#prod
FROM base AS prod

RUN npm install --frozen-lockfile --production

COPY . .

RUN npm add global @nestjs/cli
RUN npm run build 

CMD ["npm", "run", "start:dev"]