import { Test, TestingModule } from '@nestjs/testing';
import { UserAppsService } from './userapps.service';

describe('UserappsService', () => {
  let service: UserAppsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserAppsService],
    }).compile();

    service = module.get<UserAppsService>(UserAppsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
