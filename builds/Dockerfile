# build local intercom-frontend for same domain delivery
FROM node:18-slim as intercom
RUN apt-get update \
 && apt-get install -y git unzip
##
COPY . .
# Download precompiled IFCConvert from IFCOpenBot https://github.com/IfcOpenBot/IfcOpenShell/commits/v0.6.0
RUN unzip IfcConvert.zip && rm IfcConvert.zip

# keep it small
FROM node:18-slim as intercom-backend
COPY --from=intercom /IfcConvert /usr/local/bin/IfcConvert

# Create app directory
WORKDIR /app
RUN npm install -g @nestjs/cli nodemon
EXPOSE 3000
CMD uname -m && npm install && npm run start:dev
