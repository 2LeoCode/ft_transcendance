import { Controller, UseGuards } from '@nestjs/common';
import JwtGuard from '../guards/jwt.guard';
import MessageService from '../services/message.service';

@Controller('message')
@UseGuards(JwtGuard)
export default class MessageController {
	constructor(
		private readonly messageService: MessageService
	) {}
}
