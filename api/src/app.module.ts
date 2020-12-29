import { Module } from '@nestjs/common';
import { DbModule } from './database/db.module';
import { AuthModule } from './auth/auth.module';
import { ApiModule } from './api/api.module';
import { ioModule } from './io/io.module';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: '/intercom-frontend/',
    }),
    DbModule,
    AuthModule,
    ApiModule,
    ioModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
