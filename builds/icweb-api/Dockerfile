FROM node:14.5.0-slim
# Create app directory
RUN mkdir files
WORKDIR /usr/src/app
RUN apt-get update \
  && apt-get install -y mysql-client 

EXPOSE 3000
CMD npm install && node server
