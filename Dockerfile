# Dockerfile for development branch delivery
# Build on push to master branch intercom-backend & frontend

# build local intercom-frontend for same domain delivery
FROM node:14.5.0-slim as intercom
RUN apt-get update \
 && apt-get install -y git unzip

WORKDIR /backend
RUN git clone https://github.com/thk-code-arch/intercom-backend.git .
RUN npm install -g @nestjs/cli
RUN cd api && npm install && npm run build
RUN echo "### INTERCOM BACKEND"  >> /backend/api/CHANGELOG.md &&\
	echo "```" >> /backend/api/CHANGELOG.md &&\
	git show --quiet HEAD  >> /backend/api/CHANGELOG.md &&\
	echo "```" >> /backend/api/CHANGELOG.md

WORKDIR /frontend
RUN git clone https://github.com/thk-code-arch/intercom-frontend.git .
RUN npm install && npm run build
RUN echo "### INTERCOM FRONTEND"  >> /backend/api/CHANGELOG.md &&\
	echo "```" >> /backend/api/CHANGELOG.md &&\
	git show --quiet HEAD  >> /backend/api/CHANGELOG.md &&\
	echo "```" >> /backend/api/CHANGELOG.md

WORKDIR /ifcopenshell
# Extract precompiled IFCConvert from IFCOpenBot https://github.com/IfcOpenBot/IfcOpenShell/commits/v0.6.0
RUN unzip /backend/builds/IfcConvert.zip

# keep it small
FROM node:14.5.0-slim
COPY --from=intercom /ifcopenshell/IfcConvert /usr/local/bin/IfcConvert

USER node

COPY --chown=node:node --from=intercom /frontend/dist /intercom-frontend
COPY --chown=node:node --from=intercom /backend/api /app
COPY --chown=node:node --from=intercom /backend/files /files

VOLUME ["/files"]
# Create app directory
WORKDIR /app
EXPOSE 3000
CMD npm run pretypeorm && npm run typeorm:migration:run && npm run start:prod
