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

test-coverage:
	curl -L $(CC_TEST_REPORTER_LINK) > ./cc-test-reporter
	chmod +x ./cc-test-reporter
	./cc-test-reporter format-coverage -t lcov -o coverage/codeclimate.json coverage/lcov.info
	./cc-test-reporter -r $(CC_TEST_REPORTER_ID) upload-coverage

build:
	npm run build

docker-build:
	docker-compose up tm-builder

docker-build-run:
	docker-compose up tm-app tm-db

cloud-build:
	export NODE_ENV=development && make install && make build && rm -rf node_modules && export NODE_ENV=production && make setup

publish:
	npm publish --dry-run

.PHONY: build
