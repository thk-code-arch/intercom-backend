import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.IC_DBHost,
      port: 3306,
      username: 'root',
      password: process.env.IC_DBPassword,
      database: process.env.IC_Database,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
    }),
  ],
})
export class DbModule {}
