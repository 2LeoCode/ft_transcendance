import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { CreateMessageDto, UpdateMessageDto } from './message.dto';
import MessageEntity from './message.entity';
import MessageService from './message.service';

@Controller('message')
export default class MessageController {
	constructor(
		private readonly messageService: MessageService
	) {}

	@Get()
	@ApiQuery({
		type: String,
		name: 'id',
		required: false
	})
	@ApiQuery({
		type: String,
		name: 'senderId',
		required: false
	})
	@ApiQuery({
		type: String,
		name: 'receiverId',
		required: false
	})
	async get(
		@Query('id') id?: string,
		@Query('senderId') senderId?: string,
		@Query('receiverId') receiverId?: string,
	): Promise<MessageEntity[]> {
		return this.messageService.get({
			id: id,
			senderId: senderId,
			receiverId: receiverId
		});
	}

	@Get('senderId')
	@ApiQuery({
		type: String,
		name: 'id',
		required: true
	})
	async getSenderId(
		@Query('id') id: string
	): Promise<string> {
		return this.messageService.getSenderId(id);
	}

	@Get('receiverId')
	async getReceiverId(
		@Query('id') id: string
	): Promise<string> {
		return this.messageService.getReceiverId(id);
	}

	@Post()
	async post(
		@Body() dto: CreateMessageDto
	): Promise<void> {
		return this.messageService.add(dto);
	}

	@Delete()
	@ApiQuery({
		type: String,
		name: 'id',
		required: true
	})
	async delete(
		@Query('id') id: string
	): Promise<void> {
		return this.messageService.remove(id);
	}

	@Post('update')
	@ApiQuery({
		type: String,
		name: 'id',
		required: true
	})
	async update(
		@Query('id') id: string,
		@Body() dto: UpdateMessageDto
	) {
		return this.messageService.update(id, dto);
	}
}
