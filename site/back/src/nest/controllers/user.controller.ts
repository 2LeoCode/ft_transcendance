import { Body, Controller, Delete, Get, Logger, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import JwtGuard from '../guards/jwt.guard';
import { UserId } from '../decorators/user-id.decorator';
import { UpdateUserDto } from '../dtos/user.dto';
import UserService from '../services/user.service';

@Controller('user')
@UseGuards(JwtGuard)
export default class UserController {
	constructor(
		private readonly userService: UserService
	) {}
	
	@Get('online')
	async getOnline() {
		return this.userService.getPublic({ online: true });
	}

	@Get()
	@ApiQuery({
		type: String,
		name: 'nick',
		description: 'User nickname',
		required: false
	})
	@ApiQuery({
		type: String,
		name: 'user42',
		description: '42 login',
		required: false
	})
	async getPublic(
		@Query('nick') nick?: string,
		@Query('user42') user42?: string
	) {
		return this.userService.getPublic({ nick, user42 });
	}

	@Get('one')
	@ApiQuery({
		type: String,
		name: 'id',
		required: false,
		description: 'User id'
	})
	@ApiQuery({
		type: String,
		name: 'user42',
		required: false,
	})
	async getOnePublic(
		@Query('id') id?: string,
		@Query('user42') user42?: string
	) {
		return this.userService.getOnePublic({ id, user42 });
	}


	@Get('me')
	async getCurrentUser(
		@UserId() userId: string
	) {
		return this.userService.getOne(userId);
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
