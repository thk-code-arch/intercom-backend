import { Injectable, HttpService, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { fetchVideo } from './utils.dto';
import * as cheerio from 'cheerio';
import * as fs from 'fs';

@Injectable()
export class UtilsService {
  constructor(
    private readonly mailerService: MailerService,
    private http: HttpService,
  ) {}
  private readonly logger = new Logger(UtilsService.name);

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
        this.logger.log(success);
      })
      .catch((err) => {
        this.logger.log(err);
      });
  }

  async downloadImage(url, filename) {
    const writer = fs.createWriteStream(filename);

    const response = await this.http.axiosRef({
      url: url,
      method: 'GET',
      responseType: 'stream',
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  }

  async fetchVideo(scrapeUrl: string): Promise<fetchVideo | undefined> {
    const response = await this.http.get(scrapeUrl).toPromise();
    const theresult = new fetchVideo();
    const html = response.data;
    const $ = cheerio.load(html);
    theresult.title = $("meta[property='og:title']").attr('content');
    theresult.description = $("meta[property='og:description']").attr(
      'content',
    );
    theresult.image = $("meta[property='og:image']").attr('content');
    theresult.thumbnail =
      '/files/thumbnails/' +
      Math.round(new Date().getTime() / 1000).toString() +
      '.jpg';

    await this.downloadImage(theresult.image, theresult.thumbnail);
    return theresult;
  }
}
