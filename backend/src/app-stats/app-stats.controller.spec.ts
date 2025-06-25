import { Test, TestingModule } from '@nestjs/testing';
import { AppStatsController } from './app-stats.controller';

describe('AppStatsController', () => {
  let controller: AppStatsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppStatsController],
    }).compile();

    controller = module.get<AppStatsController>(AppStatsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
