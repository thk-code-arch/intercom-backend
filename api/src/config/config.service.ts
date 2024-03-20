// Copyright (c) 2021 Steffen Stein <mail@steffenstein.com> For LICENSE see docs/LICENSE

import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  public getPort() {
    return this.getValue('PORT', true);
  }

  public isProduction() {
    const mode = this.getValue('MODE', false);
    return mode != 'DEV';
  }

  public getNodeMailerConfig() {
    return {
      transport: {
        host: this.getValue('EMAIL_HOST'),
        port: parseInt(this.getValue('EMAIL_PORT')),
        secure: false, // true for 465, false for other ports
        //    auth: {
        //      user: this.getValue('EMAIL_USER'),
        //      pass: this.getValue('EMAIL_PASS'),
        //    },
      },
      defaults: {
        from: this.getValue('EMAIL_FROM'), // outgoing email ID
      },
      template: {
        dir: process.cwd() + '/template/',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    };
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',

      host: this.getValue('IC_DBHost'),
      port: parseInt(this.getValue('POSTGRES_PORT')),
      username: this.getValue('POSTGRES_USER'),
      password: this.getValue('POSTGRES_PASSWORD'),
      database: this.getValue('POSTGRES_DB'),

      entities: [join(__dirname, '/../database/entities/models.{ts,js}')],

      migrationsTableName: 'migrations',

      migrations: [join(__dirname, '/../database/migrations/*.{ts,js}')],

      //      cli: {
      //       migrationsDir: 'src/database/migrations',
      //    },
      //   logging: true,
      ssl: false,
    };
  }
}

const configService = new ConfigService(process.env).ensureValues([
  'IC_DBHost',
  'POSTGRES_PORT',
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
  'POSTGRES_DB',
  'EMAIL_PASS',
  'EMAIL_FROM',
  'EMAIL_USER',
  'EMAIL_PORT',
  'EMAIL_HOST',
]);

export { configService };
