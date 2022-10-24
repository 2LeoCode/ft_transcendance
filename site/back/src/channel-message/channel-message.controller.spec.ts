import { Test, TestingModule } from '@nestjs/testing';
import { ChannelMessageController } from './channel-message.controller';

describe('ChannelMessageController', () => {
  let controller: ChannelMessageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChannelMessageController],
    }).compile();

    controller = module.get<ChannelMessageController>(ChannelMessageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
