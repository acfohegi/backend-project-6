setup: prepare install db-migrate

prepare:
	cp -n .env.example .env || true

install:
	npm ci

db-migrate:
	npx knex migrate:latest

start:
	npm start -- --watch --verbose-watch --ignore-watch='node_modules .git .sqlite'

lint:
	npx eslint .

test:
	npm test -s

upload-test-coverage:
	echo 'TODO'

docker-build:
	docker-compose up tm-builder

docker-build-run:
	docker-compose up tm-app tm-db

build:
	npm run build

build-setup:
	export NODE_ENV=development && make install && make build && rm -rf node_modules && export NODE_ENV=production && make setup

.PHONY: build
