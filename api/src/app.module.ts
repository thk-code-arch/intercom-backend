import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { EndpointsModule } from './endpoints/endpoints.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [DbModule, EndpointsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
