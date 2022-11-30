import { Body, Controller, Delete, Get, Headers, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import JwtGuard from 'src/auth/guards/jwt.guard';
import ChannelEntity from 'src/channel/channel.entity';
import MessageEntity from 'src/message/message.entity';
import ScoreEntity from 'src/score/score.entity';
import { UserId } from './decorators/user-id.decorator';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import UserEntity from './user.entity';
import UserService from './user.service';

@Controller('user')
@UseGuards(JwtGuard)
export default class UserController {
	constructor(
		private readonly userService: UserService
	) {}

	@Get('online')
	async getOnline() {
		return this.userService.get({online: true});
	}

	@Get()
	async getCurrentUser(
		@UserId() userId: string
	) {
		return this.userService.getFull(userId);
	}

	@Post('update')
	async update(
		@UserId() userId: string,
		@Body() dto: UpdateUserDto
	) {
		return this.userService.update(userId, dto);
	}

	@Put('message')
	async sendPrivMsg(
		@UserId() userId: string,
		@Body() [otherId, content]: [string, string]
	) {
		return this.userService.sendPrivMsg(userId, otherId, content);
	}

	@Delete('message')
	async deletePrivMsg(
		@UserId() userId: string,
		@Body() [messageId]: [string]
	) {
		return this.userService.deletePrivMsg(userId, messageId);
	}

	@Post('avatar')
	async updateAvatar(
		@UserId() userId: string,
		@Body() avatar: any
	) {
		//
	}

	@Put('friendRequest')
	async sendFriendRequest(
		@UserId() userId: string,
		@Body() [otherId]: [string]
	) {
		return this.userService.sendFriendRequest(userId, otherId);
	}

	@Post('acceptFriendRequest')
	async acceptFriendRequest(
		@UserId() userId: string,
		@Body() [otherId]: [string]
	) {
		return this.userService.acceptFriendRequest(userId, otherId);
	}

	@Delete('friendRequest')
	async deleteFriendRequest(
		@UserId() userId: string,
		@Body() [otherId]: [string]
	) {
		return this.userService.rejectFriendRequest(userId, otherId);
	}

	@Delete('friend')
	async deleteFriend(
		@UserId() userId: string,
		@Body() [otherId]: [string]
	) {
		return this.userService.removeFriend(userId, otherId);
	}

	@Put('block')
	async block(
		@UserId() userId: string,
		@Body() [otherId]: [string]
	) {
		return this.userService.block(userId, otherId);
	}

	@Delete('block')
	async unblock(
		@UserId() userId: string,
		@Body() [otherId]: [string]
	) {
		return this.userService.unblock(userId, otherId);
	}

}
