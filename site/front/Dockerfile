FROM node:lts
#lts = Long Term Supported (safe)

WORKDIR /app

RUN apt-get update -y
#update packages... just in case.  -y to validate all

COPY *.json .

RUN npm install -g npm@8.19.2
#npm@8.19.2 is the latest npm version according to npmjs doc

COPY . .

CMD ["npm", "start"]




