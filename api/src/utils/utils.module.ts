import { Module, HttpModule } from '@nestjs/common';
import { configService } from '../config/config.service';
import { UtilsService } from './utils.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    MailerModule.forRoot(configService.getNodeMailerConfig()),
    MulterModule.register({
      dest: './files/thumbnails',
    }),
  ],
  controllers: [],
  providers: [UtilsService],
  exports: [UtilsService],
})
export class UtilsModule {}
