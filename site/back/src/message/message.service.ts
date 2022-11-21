import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import MessageEntity from './message.entity';
import { Repository } from 'typeorm';
import { CreateMessageDto, UpdateMessageDto } from './message.dto';

@Injectable()
export default class MessageService {
	constructor(
		@InjectRepository(MessageEntity) private readonly messageRepository: Repository<MessageEntity>,
	) {}

	async get(opts: {
		id?: string;
		senderId?: string;
		receiverId?: string;
	}): Promise<MessageEntity[]> {
		return this.messageRepository.find({
			where: {
				id: opts.id,
				sender: { id: opts.senderId },
				receiver: { id: opts.receiverId }
			}
		});
	}

	async getSenderId(id: string): Promise<string> {
		return (await this.messageRepository.findOne({
			relations: ['sender'],
			where: { id: id },
		})).sender.id;
	}

	async getReceiverId(id: string): Promise<string> {
		return (await this.messageRepository.findOne({
			relations: ['receiver'],
			where: { id: id },
		})).receiver.id;
	}

	async add(dto: CreateMessageDto): Promise<void> {
		await this.messageRepository.save({
			sender: { id: dto.senderId },
			receiver: { id: dto.receiverId },
			content: dto.content,
		});
	}

	async remove(id: string): Promise<void> {
		await this.messageRepository.remove(await this.get({ id: id }));
	}

	async update(id: string, dto: UpdateMessageDto): Promise<void> {
		await this.messageRepository.update(id, dto);
	}
}
