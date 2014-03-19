dev:
		nodemon server/app/app.js

prod:
		forever server/app/app.js

install:
		add-apt-repository ppa:chris-lea/node.js  
		apt-get update  
		apt-get install nodejs
		npm install ./server