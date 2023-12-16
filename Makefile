setup: prepare install db-migrate 

install:
	npm install

db-migrate:
	npx knex migrate:latest

docker-build:
	docker-compose up webpack-builder

docker-build-run:
	docker-compose up app

build:
	npm run build

prepare:
	cp -n .env.example .env || true

start:
	npm start -- --watch --verbose-watch --ignore-watch='node_modules .git .sqlite'

lint:
	npx eslint .

test:
	npm test -s
