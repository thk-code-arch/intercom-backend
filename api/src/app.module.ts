// Copyright (c) 2021 Steffen Stein <mail@steffenstein.com> For LICENSE see docs/LICENSE

import { Module } from '@nestjs/common';
import { DbModule } from './database/db.module';
import { UtilsModule } from './utils/utils.module';
import { AuthModule } from './auth/auth.module';
import { ApiModule } from './api/api.module';
import { IoModule } from './io/io.module';
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
    IoModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
