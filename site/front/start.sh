#!/bin/sh

if [ -z "$1" ]
then
	echo "Usage: $0 <dev|prod>"
	exit 1
fi

npm i
cp -rf webpackDevServer.config.js node_modules/react-scripts/config/webpackDevServer.config.js

npm run start:$1
