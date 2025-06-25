import { Test, TestingModule } from '@nestjs/testing';
import { AppStatsService } from './app-stats.service';

describe('AppStatsService', () => {
  let service: AppStatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppStatsService],
    }).compile();

    service = module.get<AppStatsService>(AppStatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
