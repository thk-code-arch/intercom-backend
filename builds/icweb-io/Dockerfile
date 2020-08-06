FROM node:14.5.0-slim
WORKDIR /usr/src/app

RUN apt-get update \
  && apt-get install -y mysql-client
RUN npm install -g nodemon eslint
EXPOSE 3000
CMD npm install && nodemon index
