import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
var corsOptions = {
    origin: ["https://"+process.env.IC_CORS]
};
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );
  app.useStaticAssets('/files', {prefix: '/files'});
  app.useStaticAssets('/files/static', {prefix: '/static'});
  app.setGlobalPrefix('api');
  app.enableCors(corsOptions);
  await app.listen(3000);
}
bootstrap();
