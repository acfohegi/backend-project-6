setup: prepare install db-migrate 

prepare:
	cp -n .env.example .env || true

install:
	npm ci

db-migrate:
	npx knex migrate:latest

docker-build:
	docker-compose up webpack-builder

docker-build-run:
	docker-compose up app

build:
	npm run build

build-setup:
	export NODE_ENV=development && npm ci && make build && rm -rf node_modules && export NODE_ENV=production && make setup

start:
	npm start -- --watch --verbose-watch --ignore-watch='node_modules .git .sqlite'

lint:
	npx eslint .

test:
	npm test -s

.PHONY: build
