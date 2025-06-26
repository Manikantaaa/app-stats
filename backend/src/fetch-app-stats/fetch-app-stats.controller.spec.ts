import { Test, TestingModule } from '@nestjs/testing';
import { FetchAppStatsController } from './fetch-app-stats.controller';

describe('FetchAppStatsController', () => {
  let controller: FetchAppStatsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FetchAppStatsController],
    }).compile();

    controller = module.get<FetchAppStatsController>(FetchAppStatsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
