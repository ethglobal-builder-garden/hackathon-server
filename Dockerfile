# build
FROM node:18 AS builder
ARG NODE_ENV_ARG
WORKDIR /app
COPY . .
RUN yarn
RUN yarn build:${NODE_ENV_ARG}

# light
FROM node:18-alpine
ARG NODE_ENV_ARG
WORKDIR /app
ENV NODE_ENV $NODE_ENV_ARG
COPY --from=builder /app ./
CMD ["sh", "-c", "yarn run start:${NODE_ENV}"]