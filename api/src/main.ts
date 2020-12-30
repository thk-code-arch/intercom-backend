import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AllExceptionsFilter } from './utils/error.filter';
const corsOptions = {
  origin: ['https://' + process.env.IC_CORS],
};
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const options = new DocumentBuilder()
    .setTitle('intercom-backend')
    .setDescription('The intercom web API description')
    .setVersion('1.0')
    .addServer('/api')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT',
    )
    .build();
  const document = SwaggerModule.createDocument(app, options);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.setGlobalPrefix('api');

  SwaggerModule.setup('docs', app, document);

  app.useStaticAssets('/files', { prefix: '/files' });
  app.useStaticAssets('/files/static', { prefix: '/static' });

  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableCors(corsOptions);
  await app.listen(3000);
}
bootstrap();
