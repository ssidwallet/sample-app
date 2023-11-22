# Flex Sample App

This repo contains a sample implementation of a Frontend+Backend app on getting started with Self-Sovereign Identity using Flex Hub Organizational API.

## Getting started

Prerequisites:

- NodeJS
- Docker and Docker-Compose
- Yarn

1. Start MongoDB

```sh
docker-compose up -d
```

2. Update env vars in `.env`

3. Start backend

```sh
cd backend
yarn build
yarn start
```

3. Start frontend

```sh
cd ../frontend
yarn start
```
