
# intercom-backend

API built with Sequelize NodeJs Express MariaDB

## Installation

add docker-compose.yml
```docker
version: '3'
services:
  icweb-db:
    container_name: icweb-db
    image: mariadb:latest
    volumes:
    - ./db:/var/lib/mysql
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
