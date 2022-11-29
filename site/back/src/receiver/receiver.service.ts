import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import MessageEntity from '../message/message.entity';
import { Repository } from 'typeorm';
import ReceiverEntity, { ReceiverType } from './receiver.entity';

@Injectable()
export default class ReceiverService {
	constructor(
		@InjectRepository(ReceiverEntity) private readonly receiverRepository: Repository<ReceiverEntity>,
	) {}

	async get(opts: {
		id?: string;
		type?: ReceiverType;
	}): Promise<ReceiverEntity[]> {
		return this.receiverRepository.find({
			where: {
				id: opts.id,
				type: opts.type
			}
		});
	}

	async add(type: ReceiverType): Promise<ReceiverEntity> {
		const receiver = this.receiverRepository.create({
			type: type
		});
		return this.receiverRepository.save(receiver);
	}

	async getMessages(id: string): Promise<MessageEntity[]> {
		return this.receiverRepository.findOne({
			relations: ['messages'],
			where: { id: id },
		}).then((receiver: ReceiverEntity) => receiver.messages);
	}
}