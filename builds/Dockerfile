# build local intercom-frontend for same domain delivery
FROM node:14.5.0-slim as intercom
RUN apt-get update \
 && apt-get install -y git unzip
##
WORKDIR /app
RUN git clone https://github.com/thk-code-arch/intercom-frontend.git .
RUN npm install
RUN npm run build

WORKDIR /ifcopenshell
# Download precompiled IFCConvert from IFCOpenBot https://github.com/IfcOpenBot/IfcOpenShell/commits/v0.6.0
COPY . .
RUN unzip IfcConvert.zip && rm IfcConvert.zip

# keep it small
FROM node:14.5.0-slim as intercom-backend
COPY --from=intercom /app/dist /intercom-frontend
COPY --from=intercom /ifcopenshell/IfcConvert /usr/local/bin/IfcConvert

# Create app directory
WORKDIR /app
RUN npm install -g @nestjs/cli nodemon
EXPOSE 3000
CMD npm install && npm run start:dev
