import { Body, Controller, Delete, Get, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBody, ApiHeader, ApiQuery } from '@nestjs/swagger';
import JwtGuard from '../guards/jwt.guard';
import { UserId } from '../decorators/user-id.decorator';
import { CreateChannelDto, UpdateChannelDto } from '../dtos/channel.dto';
import ChannelEntity from '../entities/channel.entity';
import ChannelService from '../services/channel.service';

@Controller('channel')
@UseGuards(JwtGuard)
@ApiHeader({
	name: 'Authorization',
	description: 'Authentification token'
})
export default class ChannelController {
	constructor(
		private readonly channelService: ChannelService
	) {}

	@Get()
	async getVisible(): Promise<ChannelEntity[]> {
		return this.channelService.get({
			visibility: 'visible'
		});
	}

	@Post()
	async add(
		@UserId() userId: string,
		@Body() body: CreateChannelDto
	) {
		return this.channelService.add(userId, body);
	}

	@Post('update')
	@ApiQuery({
		type: String,
		name: 'name',
		description: 'Channel name'
	})
	async update(
		@UserId() userId: string,
		@Query('name') name: string,
		@Body() dto: UpdateChannelDto
	) {
		return this.channelService.update(userId, name, dto);
	}


	@Put('join')
	@ApiBody({
		schema: {
			type: 'array',
			items: {
				type: 'string'
			},
			minItems: 2,
			maxItems: 2,
			description: '[channelName, channelPassword]'
		}
	})
	async join(
		@UserId() userId: string,
		@Body() [channelName, channelPassword]: [string, string]
	) {
		return this.channelService.join(userId, channelName, channelPassword);
	}

	@Put('leave')
	@ApiBody({
		schema: {
			type: 'array',
			items: {
				type: 'string'
			},
			minItems: 1,
			maxItems: 1,
			description: '[channelName]'
		}
	})
	async leave(
		@UserId() userId: string,
		@Body() [channelName]: [string]
	) {
		return this.channelService.leave(userId, channelName);
	}

	@Put('message')
	@ApiBody({
		schema: {
			type: 'array',
			items: {
				type: 'string'
			},
			minItems: 2,
			maxItems: 2,
			description: '[channelName, content]'
		}
	})
	async addMessage(
		@UserId() userId: string,
		@Body() [channelName, content]: [string, string]
	) {
		return this.channelService.addMessage(userId, channelName, content);
	}

	@Delete('message')
	@ApiBody({
		schema: {
			type: 'array',
			items: {
				type: 'string'
			},
			minItems: 2,
			maxItems: 2,
			description: '[channelName, messageId]'
		}
	})
	async deleteMessage(
		@UserId() userId: string,
		@Body() [channelName, messageId]: [string, string]
	) {
		return this.channelService.removeMessage(userId, channelName, messageId);
	}

	@Put('mute')
	@ApiBody({
		schema: {
			type: 'array',
			items: {
				type: 'string'
			},
			minItems: 3,
			maxItems: 3,
			description: '[channelName, otherId, time]'
		}
	})
	async mute(
		@UserId() userId: string,
		@Body() [channelName, otherId, time]: [string, string, number]
	) {
		return this.channelService.mute(userId, channelName, otherId);
	}

	@Put('kick')
	@ApiBody({
		schema: {
			type: 'array',
			items: {
				type: 'string'
			},
			minItems: 2,
			maxItems: 2,
			description: '[channelName, otherId]'
		}
	})
	async kick(
		@UserId() userId: string,
		@Body() [channelName, otherId]: [string, string]
	) {
		return this.channelService.kick(userId, channelName, otherId);
	}

	@Put('unmute')
	@ApiBody({
		schema: {
			type: 'array',
			items: {
				type: 'string'
			},
			minItems: 2,
			maxItems: 2,
			description: '[channelName, otherId]'
		}
	})
	async unmute(
		@UserId() userId: string,
		@Body() [channelName, otherId]: [string, string]
	) {
		return this.channelService.unmute(userId, channelName, otherId);
	}

	@Put('ban')
	@ApiBody({
		schema: {
			type: 'array',
			items: {
				type: 'string'
			},
			minItems: 3,
			maxItems: 3,
			description: '[channelName, otherId, time]'
		}
	})
	async ban(
		@UserId() userId: string,
		@Body() [channelName, otherId, time]: [string, string, number]
	) {
		return this.channelService.ban(userId, channelName, otherId);
	}

	@Put('unban')
	@ApiBody({
		schema: {
			type: 'array',
			items: {
				type: 'string'
			},
			minItems: 2,
			maxItems: 2,
			description: '[channelName, otherId]'
		}
	})
	async unban(
		@UserId() userId: string,
		@Body() [channelName, otherId]: [string, string]
	) {
		return this.channelService.unban(userId, channelName, otherId);
	}

	@Put('promote')
	@ApiBody({
		schema: {
			type: 'array',
			items: {
				type: 'string'
			},
			minItems: 2,
			maxItems: 2,
			description: '[channelName, otherId]'
		}
	})
	async promote(
		@UserId() userId: string,
		@Body() [channelName, otherId]: [string, string]
	) {
		return this.channelService.promote(userId, channelName, otherId);
	}

	@Put('demote')
	@ApiBody({
		schema: {
			type: 'array',
			items: {
				type: 'string'
			},
			minItems: 2,
			maxItems: 2,
			description: '[channelName, otherId]'
		}
	})
	async demote(
		@UserId() userId: string,
		@Body() [channelName, otherId]: [string, string]
	) {
		return this.channelService.demote(userId, channelName, otherId);
	}

	@Put('invite')
	@ApiBody({
		schema: {
			type: 'array',
			items: {
				type: 'string'
			},
			minItems: 2,
			maxItems: 2,
			description: '[channelName, otherId]'
		}
	})
	async invite(
		@UserId() userId: string,
		@Body() [channelName, otherId]: [string, string]
	) {
		return this.channelService.invite(userId, channelName, otherId);
	}
}
