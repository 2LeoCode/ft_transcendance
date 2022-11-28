#!/bin/sh

if [ -z "$1" ]
then
	echo "Usage: $0 <dev|prod>"
	exit 1
fi

npm i

npm run start:$1
