import { Module } from '@nestjs/common';
import { DbModule } from './database/db.module';
import { AuthModule } from './auth/auth.module';
import { ApiModule } from './api/api.module';
import { ioModule } from './io/io.module';

@Module({
  imports: [DbModule, AuthModule, ApiModule, ioModule],
  controllers: [],
  providers: [],
  exports: []
})
export class AppModule {}
