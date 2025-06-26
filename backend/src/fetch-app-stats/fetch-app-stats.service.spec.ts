import { Test, TestingModule } from '@nestjs/testing';
import { FetchAppStatsService } from './fetch-app-stats.service';

describe('FetchAppStatsService', () => {
  let service: FetchAppStatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FetchAppStatsService],
    }).compile();

    service = module.get<FetchAppStatsService>(FetchAppStatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
