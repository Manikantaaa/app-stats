import { Test, TestingModule } from '@nestjs/testing';
import { UserappsController } from './userapps.controller';
import { UserappsService } from './userapps.service';

describe('UserappsController', () => {
  let controller: UserappsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserappsController],
      providers: [UserappsService],
    }).compile();

    controller = module.get<UserappsController>(UserappsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
