import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UtilsService {
  constructor(private readonly mailerService: MailerService) {}

  public signup(email: string, username: string, password: string): void {
    this.mailerService
      .sendMail({
        to: email, // List of receivers email address
        subject: 'Welcome to InterCom!',
        template: 'signup', // The `.pug` or `.hbs` extension is appended automatically.
        context: {
          code: password,
          username: username,
        },
      })
      .then((success) => {
        console.log(success);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
