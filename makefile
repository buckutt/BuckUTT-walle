dev:
		nodemon server/app/app.js

prod:
		forever server/app/app.js

install:
	apt-get install nodejs
	npm install ./server