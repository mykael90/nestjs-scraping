import { Test, TestingModule } from '@nestjs/testing';
import { OlxController } from './olx.controller';
import { OlxService } from './olx.service';

describe('OlxController', () => {
  let controller: OlxController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OlxController],
      providers: [OlxService],
    }).compile();

    controller = module.get<OlxController>(OlxController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
