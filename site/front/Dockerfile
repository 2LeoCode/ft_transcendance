from	node:16.14.2-alpine

#lts = Long Term Supported (safe) (before)

workdir	/app

#update packages... just in case.  -y to validate all (before)

#npm@8.19.3 is the latest npm version according to npmjs doc
run		npm i -g npm@8.19.3

add		. .
run		npm i

#fix setupMiddlewares warning
run		mv -f webpackDevServer.config.js node_modules/react-scripts/config/webpackDevServer.config.js

cmd		["npm", "run", "start"]
