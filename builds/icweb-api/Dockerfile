FROM node:14.5.0-slim
# Create app directory
WORKDIR /app
RUN npm install -g @nestjs/cli
EXPOSE 3000
CMD npm install && npm run start:dev
