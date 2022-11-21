import { Body, Delete, Get, Post, Put, Query } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import ChannelEntity from 'src/channel/channel.entity';
import MessageEntity from 'src/message/message.entity';
import ScoreEntity from 'src/score/score.entity';
import { CreateUserDto } from './user.dto';
import UserEntity from './user.entity';
import UserService from './user.service';

export default class UserController {
	constructor(
		private readonly userService: UserService
	) {}

	@Get()
	@ApiQuery({
		type: String,
		name: 'id',
		required: false
	})
	@ApiQuery({
		type: String,
		name: 'nick',
		required: false
	})
	@ApiQuery({
		type: Boolean,
		name: 'online',
		required: false
	})
	async get(
		@Query('id') id?: string,
		@Query('nick') nick?: string,
		@Query('online') online?: boolean,
	): Promise<UserEntity[]> {
		return this.userService.get({
			id: id,
			nick: nick,
			online: online
		});
	}

	@Get('debug')
	async getDebug(): Promise<UserEntity[]> {
		return this.userService.getDebug();
	}

	@Get('scores')
	@ApiQuery({
		type: String,
		name: 'id',
		required: true
	})
	async getScores(
		@Query('id') id: string
	): Promise<ScoreEntity[]> {
		return this.userService.getScores(id);
	}

	@Get('friendRequests')
	@ApiQuery({
		type: String,
		name: 'id',
		required: true
	})
	async getFriendRequests(
		@Query('id') id: string
	): Promise<UserEntity[]> {
		return this.userService.getFriendRequests(id);
	}

	@Get('friends')
	@ApiQuery({
		type: String,
		name: 'id',
		required: true
	})
	async getFriends(
		@Query('id') id: string
	): Promise<UserEntity[]> {
		return this.userService.getFriends(id);
	}

	@Get('ownedChannels')
	@ApiQuery({
		type: String,
		name: 'id',
		required: true
	})
	async getOwnedChannels(
		@Query('id') id: string
	): Promise<ChannelEntity[]> {
		return this.userService.getOwnedChannels(id);
	}

	@Get('channels')
	@ApiQuery({
		type: String,
		name: 'id',
		required: true
	})
	async getChannels(
		@Query('id') id: string
	): Promise<ChannelEntity[]> {
		return this.userService.getChannels(id);
	}

	@Get('messagesIn')
	@ApiQuery({
		type: String,
		name: 'id',
		required: true
	})
	async getMessagesIn(
		@Query('id') id: string
	): Promise<MessageEntity[]> {
		return this.userService.getMessagesIn(id);
	}

	@Get('messagesOut')
	@ApiQuery({
		type: String,
		name: 'id',
		required: true
	})
	async getMessagesOut(
		@Query('id') id: string
	): Promise<MessageEntity[]> {
		return this.userService.getMessagesOut(id);
	}

	@Post()
	async add(
		@Body() dto: CreateUserDto
	): Promise<UserEntity> {
		return this.userService.add(dto);
	}

	@Put('sendFriendRequest')
	@ApiQuery({
		type: String,
		name: 'id',
		required: true
	})
	async sendFriendRequest(
		@Query('id') id: string,
		@Body() dstId: string
	): Promise<void> {
		await this.userService.sendFriendRequest(id, dstId);
	}

	@Put('acceptFriendRequest')
	@ApiQuery({
		type: String,
		name: 'id',
		required: true
	})
	async acceptFriendRequest(
		@Query('id') id: string,
		@Body() srcId: string
	): Promise<void> {
		await this.userService.acceptFriendRequest(id, srcId);
	}

	@Put('rejectFriendRequest')
	@ApiQuery({
		type: String,
		name: 'id',
		required: true
	})
	async rejectFriendRequest(
		@Query('id') id: string,
		@Body() srcId: string
	): Promise<void> {
		await this.userService.rejectFriendRequest(id, srcId);
	}

	@Delete()
	@ApiQuery({
		type: String,
		name: 'id',
		required: true
	})
	async remove(
		@Query('id') id: string
	): Promise<void> {
		await this.userService.remove(id);
	}

	@Delete('removeFriend')
	@ApiQuery({
		type: String,
		name: 'id',
		required: true
	})
	async removeFriend(
		@Query('id') id: string,
		@Body() dstId: string
	): Promise<void> {
		await this.userService.removeFriend(id, dstId);
	}
}