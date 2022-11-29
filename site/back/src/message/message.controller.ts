import { Body, Controller, Delete, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import JwtGuard from 'src/auth/guards/jwt.guard';
import { UserId } from 'src/user/decorators/user-id.decorator';
import { CreateMessageDto, UpdateMessageDto } from './message.dto';
import MessageEntity from './message.entity';
import MessageService from './message.service';

@Controller('message')
@UseGuards(JwtGuard)
export default class MessageController {
	constructor(
		private readonly messageService: MessageService
	) {}
}
