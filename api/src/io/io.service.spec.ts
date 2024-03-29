// Copyright (c) 2021 Steffen Stein <mail@steffenstein.com> For LICENSE see docs/LICENSE

import { Test, TestingModule } from '@nestjs/testing';
import { IoService } from './io.service';

describe('IoService', () => {
  let service: IoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IoService],
    }).compile();

    service = module.get<IoService>(IoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
