import { Module } from '@nestjs/common';
import { configService } from '../config/config.service';
import { UtilsService } from './utils.service';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [MailerModule.forRoot(configService.getNodeMailerConfig())],
  controllers: [],
  providers: [UtilsService],
  exports: [UtilsService],
})
export class UtilsModule {}
