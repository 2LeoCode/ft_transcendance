import { Test, TestingModule } from '@nestjs/testing';
import { PrivateMessageController } from './private-message.controller';

describe('PrivateMessageController', () => {
  let controller: PrivateMessageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrivateMessageController],
    }).compile();

    controller = module.get<PrivateMessageController>(PrivateMessageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
