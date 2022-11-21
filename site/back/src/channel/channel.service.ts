import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
import { CreateChannelDto, UpdateChannelDto } from './channel.dto';
import UserEntity from '../user/user.entity';
import ReceiverService from '../receiver/receiver.service';
import MessageEntity from '../message/message.entity';
import ChannelEntity from './channel.entity';

@Injectable()
export default class ChannelService {
	constructor(
		@InjectRepository(ChannelEntity) private readonly channelRepository: Repository<ChannelEntity>,
		private readonly receiverService: ReceiverService,
	) {}

	async get(opts: {
		id?: string;
		name?: string;
		isPrivate?: boolean;
		ownerId?: string;
	}): Promise<ChannelEntity[]> {
		return this.channelRepository.find({
			where: {
				id: opts.id,
				name: opts.name,
				isPrivate: opts.isPrivate,
				owner: { id: opts.ownerId }
			}
		});
	}

	async getOwner(id: string): Promise<UserEntity> {
		return this.channelRepository.findOne({
			relations: ['owner'],
			where: { id: id }
		}).then((channel: ChannelEntity) => channel.owner);
	}

	async getUsers(id: string): Promise<UserEntity[]> {
		return this.channelRepository.findOne({
			relations: ['users'],
			where: { id: id }
		}).then((channel: ChannelEntity) => channel.users);
	}

	async getMessages(id: string): Promise<MessageEntity[]> {
		return this.channelRepository.findOne({
			relations: ['receiver'],
			where: { id: id }
		}).then(
			(channel: ChannelEntity) =>
				this.receiverService.getMessages(channel.receiver.id)
		);
	}

	async add(dto: CreateChannelDto): Promise<string> {
		return this.channelRepository.save({
			name: dto.name,
			password: dto.password,
			isPrivate: dto.isPrivate,
			owner: { id: dto.ownerId },
			receiver: await this.receiverService.add('Channel')
		}).then(async (result: ChannelEntity) => {
			result.users.push({ id: dto.ownerId } as UserEntity);
			await this.channelRepository.save(result);
			return result.id;
		});
	}

	async remove(id: string): Promise<void> {
		await this.channelRepository.remove(await this.get({ id: id }));
	}

	async update(
		id: string,
		dto: UpdateChannelDto
	): Promise<void> {
		await this.channelRepository.update({ id: id }, dto);
	}

	async addUsers(id: string, userIds: string[]): Promise<void> {
		const channel: ChannelEntity = await this.channelRepository.findOne({
			relations: ['users'],
			where: { id: id }
		});
		channel.users = channel.users.concat(
			userIds.map((userId: string) => ({ id: userId } as UserEntity))
		);
		await this.channelRepository.save(channel);
	}

	async removeUsers(id: string, userIds: string[]): Promise<void> {
		const channel: ChannelEntity = await this.channelRepository.findOne({
			relations: ['users'],
			where: { id: id }
		});
		channel.users = channel.users.filter(
			(user: UserEntity) => !userIds.includes(user.id)
		);
		await this.channelRepository.save(channel);
	}
}
