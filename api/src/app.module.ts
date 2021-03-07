import { Module } from '@nestjs/common';
import { DbModule } from './database/db.module';
import { UtilsModule } from './utils/utils.module';
import { AuthModule } from './auth/auth.module';
import { ApiModule } from './api/api.module';
import { ioModule } from './io/io.module';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    // path will serve VUEJS Frontend, when intercom-backend is built from
    // Dockerfile. In production no need for several subdomain. eg
    // app.bim-cloud.org is enough.
    ServeStaticModule.forRoot({
      rootPath: '/intercom-frontend/',
    }),
    DbModule,
    UtilsModule,
    AuthModule,
    ApiModule,
    ioModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
