FROM node:20-alpine
LABEL test-tm latest
RUN apk update && apk upgrade && apk add build-base python3
COPY . ./app
WORKDIR /app
RUN npm ci
CMD make build

