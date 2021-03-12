# intercom-backend

API built with NestJS,Postgres, TypeORM

## Installation

add docker-compose.yml

```docker
version: '3'
services:
  icweb-db:
    container_name: dev-icweb-db
    image: postgres:12
    volumes:
      - ./db:/var/lib/postgresql/data
    restart: always
    environment:
       - MYSQL_ROOT_PASSWORD=TOPSECRET
       - MYSQL_DATABASE=icweb
       - TZ=Europe/Berlin
  icweb-api:
    container_name: icweb-api
    restart: always
    build: ./builds/icweb-api/.
    environment:
      - TZ=Europe/Berlin
      - IC_Database=icweb
      - IC_DBPassword=TOPSECRET
      - IC_Secret=SUPER-SECRET
    volumes:
      - ./api:/usr/src/app
      - ./files:/files

```

## Run DB migrations

```bash
# create typeorm config
npm run pretypeorm

# generate migration
npm run typeorm:migration:generate -- init

# update/init DB
npm run typeorm:migration:run
```

## Add some dummy DATA

```bash
# seed some Data
npm run seed:run
```

## Reinit DB

```bash
npm run schema:drop && npm run typeorm:migration:run && npm run seed:run
```
