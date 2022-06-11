// Copyright (c) 2021 Steffen Stein <mail@steffenstein.com> For LICENSE see docs/LICENSE

import { Module } from '@nestjs/common';
import { ViewService } from './view.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ViewController } from './view.controller';
import { View } from '../../database/entities/models';
import { ViewportGateway } from '../../io/viewport.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([View])],
  providers: [ViewService, ViewportGateway],
  controllers: [ViewController],
  exports: [ViewService],
})
export class ViewModule {}
