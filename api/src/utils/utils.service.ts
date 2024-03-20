// Copyright (c) 2021 Steffen Stein <mail@steffenstein.com> For LICENSE see docs/LICENSE

import { Injectable, Logger } from '@nestjs/common';

import { HttpService } from '@nestjs/axios';
import { MailerService } from '@nestjs-modules/mailer';
import { FetchVideo } from './utils.dto';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as child from 'child_process';

@Injectable()
export class UtilsService {
  constructor(
    private readonly mailerService: MailerService,
    private http: HttpService,
  ) {}
  private readonly logger = new Logger(UtilsService.name);

  async signup(
    email: string,
    username: string,
    password: string,
  ): Promise<void> {
    this.mailerService
      .sendMail({
        to: email, // List of receivers email address
        subject: `Welcome to InterCom! ${process.env.IC_CORS}`,
        template: 'signup', // The `.pug` or `.hbs` extension is appended automatically.
        context: {
          code: password,
          username: username,
          domain: process.env.IC_CORS,
        },
      })
      .then((success) => {
        this.logger.log(success);
      })
      .catch((err) => {
        this.logger.log(err);
      });
  }

  async resetPassword(
    email: string,
    username: string,
    password: string,
  ): Promise<void> {
    this.mailerService
      .sendMail({
        to: email, // List of receivers email address
        subject: `Password reset @ InterCom! ${process.env.IC_CORS}`,
        template: 'password-reset', // The `.pug` or `.hbs` extension is appended automatically.
        context: {
          code: password,
          username: username,
          domain: process.env.IC_CORS,
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

  async fetchVideo(scrapeUrl: string): Promise<FetchVideo | undefined> {
    const response = await this.http.get(scrapeUrl).toPromise();
    const theresult = new FetchVideo();
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

  async convertIfc(incomingFile: string) {
    return new Promise((resolve, reject) => {
      child.exec(
        `IfcConvert -v "/files/input/${incomingFile}.ifc" "/files/output/${incomingFile}.glb"`,
        (error: child.ExecException, stdout: string, stderr: string) => {
          if (error) {
            console.log('errror');
            this.logger.log(error);
            reject(` ${error}, ${stdout}, ${stderr} `);
          } else if (stderr) {
            reject(` ${error}, ${stdout}, ${stderr} `);
            this.logger.log(stderr);
          } else {
            this.logger.log(stdout);
            resolve(stdout);
          }
        },
      );
    });
  }

  async createIssue(issue): Promise<void> {
    const headersOpt = {
      headers: {
        Cookie: 'logged_in=no',
        Authorization: 'token ' + process.env.GITHUBBOT,
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1521.3 Safari/537.36',
      },
    };

    const url =
      'https://api.github.com/repos/thk-code-arch/intercom-frontend/issues?state=all';

    const response = await this.http
      .post(
        url,
        { title: issue.title, body: issue.context, labels: [issue.label] },
        headersOpt,
      )
      .toPromise();
    return response.data;
  }
}
