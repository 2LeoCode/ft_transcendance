import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import MessageEntity from '../entities/message.entity';
import { Repository } from 'typeorm';
import ReceiverEntity, { ReceiverType } from '../entities/receiver.entity';
import ChannelEntity from '../entities/channel.entity';
import UserEntity from '../entities/user.entity';

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

	async add(type: ReceiverType, parent: UserEntity | ChannelEntity): Promise<ReceiverEntity> {
		const receiver = this.receiverRepository.create({
			type: type,
		});
		if (type === 'User')
			receiver.parentUser = parent as UserEntity;
		else
			receiver.parentChannel = parent as ChannelEntity;
		return (
			this.receiverRepository.save(receiver)
				.then((res) => this.receiverRepository.findOne({
					relations: [
						'parentUser',
						'parentChannel',
						'messages',
						'messages.sender',
						'messages.receiver',
						'messages.receiver.parentUser',
						'messages.receiver.parentChannel'
					],
					where: { id: res.id },
				}))
		);
	}

	async getMessages(id: string): Promise<MessageEntity[]> {
		return this.receiverRepository.findOne({
			relations: ['messages'],
			where: { id: id },
		}).then((receiver: ReceiverEntity) => receiver.messages);
	}

	async remove(id: string) {
		return this.receiverRepository.delete(id);
	}

}