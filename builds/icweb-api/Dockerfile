# build local intercom-frontend for same domain delivery
FROM node:14.5.0-slim as intercom-frontend
RUN apt-get update \
 && apt-get install -y git
##
WORKDIR /app
RUN git clone https://github.com/thk-code-arch/intercom-frontend.git . && git checkout vue-njs
RUN npm install
RUN npm run build

# production stage
FROM node:14.5.0-slim as intercom-backend
COPY --from=intercom-frontend /app/dist /intercom-frontend
# Create app directory
WORKDIR /app
RUN npm install -g @nestjs/cli nodemon
EXPOSE 3000
CMD npm install && npm run start:dev
