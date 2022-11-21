# syntax:docker/dockerfile:1

#base
from	node:16.14.2-alpine as base

env		NODE_ENV=production
workdir	/app

run		npm i -g npm@8.19.3
add		. .


#dev
from	base as dev

run		npm i

cmd		["npm", "run", "start:dev"]


#prod
from	base as prod

run		npm i --production

cmd		["npm", "run", "start:prod"]
