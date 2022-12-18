import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import MessageEntity from '../entities/message.entity';
import { Repository } from 'typeorm';
import { CreateMessageDto, UpdateMessageDto } from '../dtos/message.dto';

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

	async add(senderId: string, dto: CreateMessageDto) {
		const tmp = await this.messageRepository.save({
			sender: { id: senderId },
			receiver: { id: dto.receiverId },
			content: dto.content,
		});
		return this.messageRepository.findOne({
			relations: [
				'sender',
				'receiver',
				'receiver.parentUser',
				'receiver.parentChannel'
			],
			where: { id: tmp.id }
		});
	}

	async remove(id: string): Promise<void> {
		await this.messageRepository.remove(await this.get({ id: id }));
	}

	async update(id: string, dto: UpdateMessageDto): Promise<void> {
		await this.messageRepository.update(id, dto);
	}
}
