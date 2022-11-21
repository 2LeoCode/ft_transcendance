import { Controller, Get } from '@nestjs/common';
import ChannelEntity from './channel.entity';
import ChannelService from './channel.service';

@Controller('channel')
export default class ChannelController {
	constructor(
		private readonly channelService: ChannelService
	) {}
	
	@Get()
	async get(opts: {
		id?: string;
		name?: string;
		isPrivate?: boolean;
		ownerId?: string;
	}): Promise<ChannelEntity[]> {
		return this.channelService.get(opts);
	}
}
