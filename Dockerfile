FROM node:20-alpine AS build
RUN apk update && apk upgrade && apk add build-base python3
COPY . ./app
WORKDIR /app
RUN npm ci
RUN make build
RUN rm -rf node_modules

FROM node:20-alpine AS runtime
RUN apk update && apk upgrade && apk add build-base python3
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app /app
RUN make setup
LABEL org.opencontainers.image.source https://github.com/acfohegi/task-manager
EXPOSE 10000
CMD make start

