#!/bin/sh

if [ -z "$1" ]
then
	echo "Usage: $0 <dev|prod>"
	exit 1
fi

npm i
cp -rf webpackDevServer.config.js node_modules/react-scripts/config/webpackDevServer.config.js

if [ "$1" = "development" ]
then
	npm run start:dev
else
	npm run start:prod
	npm add -g serve
fi

npm run start:$1
