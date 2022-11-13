#!/bin/sh

if [ -z "$1" ]
then
	echo "Usage: $0 <dev|prod>"
	exit 1
fi

npm init -y
npm i -g typescript
npm i -g ts-node
npm i -g nodemon

tsc --init
sleep 10

npm run start:$1
