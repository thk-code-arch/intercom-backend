## Description


## Installation

```bash
npm install
```

## Running the app

```bash
# development
npm run start

# nodemon dev mode
npm run start:dev

# production mode
npm run start:prod
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
