#!/bin/sh

if [ -z "$1" ]
then
	echo "Usage: $0 <dev|prod>"
	exit 1
fi

apk add sudo

npm i
cp -rf webpackDevServer.config.js node_modules/react-scripts/config/webpackDevServer.config.js

sudo npm run start:$1
