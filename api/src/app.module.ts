import { Module } from '@nestjs/common';
import { DbModule } from './database/db.module';
import { AuthModule } from './auth/auth.module';
import { ApiModule } from './api/api.module';
import { configService } from './config/config.service';

@Module({
  imports: [DbModule, AuthModule, ApiModule],
  controllers: [],
  providers: [],
  exports: []
})
export class AppModule {}
