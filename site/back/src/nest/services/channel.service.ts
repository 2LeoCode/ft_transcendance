import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateChannelDto, UpdateChannelDto } from '../dtos/channel.dto';
import UserEntity from '../entities/user.entity';
import ReceiverService from './receiver.service';
import ChannelEntity, { ChannelAccessibility, ChannelVisibility } from '../entities/channel.entity';
import * as Bcrypt from 'bcrypt';
import MessageService from './message.service';

@Injectable()
export default class ChannelService {
	constructor(
		@InjectRepository(ChannelEntity) private readonly channelRepository: Repository<ChannelEntity>,
		private readonly receiverService: ReceiverService,
		private readonly messageService: MessageService
	) {}

	async get(opts: {
		id?: string;
		name?: string;
		accessibility?: ChannelAccessibility;
		visibility?: ChannelVisibility;
		ownerId?: string;
	}) {
		return this.channelRepository.find({
			where: {
				id: opts.id,
				name: opts.name,
				accessibility: opts.accessibility,
				visibility: opts.visibility,
				owner: { id: opts.ownerId }
			}
		});
	}

	async getFull(opts: {
		id?: string;
		name?: string;
		accessibility?: ChannelAccessibility;
		visibility?: ChannelVisibility;
		ownerId?: string;
	}): Promise<ChannelEntity[]> {
		return this.channelRepository.find({
			relations: [
				'owner',
				'users',
				'receiver',
				'receiver.messages',
				'receiver.parentChannel',
			],
			where: {
				id: opts.id,
				name: opts.name,
				accessibility: opts.accessibility,
				visibility: opts.visibility,
				owner: { id: opts.ownerId }
			}
		});
	}

	async getByUser(userId: string): Promise<ChannelEntity> {
		const channel = await this.channelRepository.findOne({
			relations: ['users', 'owner'],
			where: { users: { id: userId } }
		});
		if (!channel)
			throw new Error(`User ${userId} is not in any channel`);
		return channel;
	}

	async add(userId: string, dto: CreateChannelDto): Promise<string> {
		const exists: boolean = await this.channelRepository.findOne({
			where: { name: dto.name }
		}).then((channel: ChannelEntity) => !!channel);
	
		if (exists)
			throw new Error(`Channel ${dto.name} already exists`);
		return this.channelRepository.save({
			name: dto.name,
			password: Bcrypt.hashSync(dto.password, 10),
			accessibility: dto.accessibility,
			visibility: dto.visibility,
			owner: { id: userId }
		}).then(async (result: ChannelEntity) => {
			result.receiver = await this.receiverService.add('Channel', result);
			result.users.push({ id: userId } as UserEntity);
			await this.channelRepository.save(result);
			return result.id;
		});
	}

	async remove(userId: string, channelName: string): Promise<void> {
		const channel: ChannelEntity = await this.channelRepository.findOne({
			relations: ['users', 'owner'],
			where: { name: channelName }
		});
		if (!channel)
			throw new Error(`Channel ${channelName} does not exist`);
		if (channel.owner.id !== userId)
			throw new Error(`User ${userId} is not the owner of channel ${channelName}`);
		await this.channelRepository.remove(channel);
	}

	async update(userId: string, channelName: string, dto: UpdateChannelDto): Promise<void> {
		const channel: ChannelEntity = await this.channelRepository.findOne({
			relations: ['users', 'owner'],
			where: { name: channelName }
		});
		if (!channel)
			throw new Error(`Channel ${channelName} does not exist`);
		if (channel.owner.id !== userId && !channel.adminsIds.find((id: string) => id === userId))
			throw new Error(`User ${userId} is not admin of channel ${channelName}`);
		await this.channelRepository.update(channel.id, dto);
	}

	async join(userId: string, name: string, password: string): Promise<void> {
		const channel: ChannelEntity = await this.channelRepository.findOne({
			relations: ['users', 'invites'],
			where: { name: name }
		});
		if (!channel)
			throw new Error(`Channel ${name} does not exist`);
		if (channel.users.find((user: UserEntity) => user.id === userId))
			throw new Error(`User ${userId} already in channel ${name}`);
		if (channel.bannedIds.includes(userId))
			throw new Error(`User ${userId} is banned from channel ${name}`);
		if (channel.accessibility === 'private') {
			if (!channel.invites.find((user: UserEntity) => user.id === userId))
				throw new Error(`User ${userId} is not invited to channel ${name}`);
			channel.invites = channel.invites.filter((user: UserEntity) => user.id !== userId);
		}
		if (!Bcrypt.compareSync(password, channel.password))
			throw new Error(`Incorrect password for channel ${name}`);
		channel.users.push({ id: userId } as UserEntity);
		await this.channelRepository.save(channel);
	}

	async leave(userId: string, name: string): Promise<void> {
		const channel: ChannelEntity = await this.channelRepository.findOne({
			relations: ['users', 'owner'],
			where: { name: name }
		});
		if (!channel)
			throw new Error(`Channel ${name} does not exist`);
		if (channel.owner.id === userId)
			return this.remove(userId, channel.id);
		if (!channel.users.find((user: UserEntity) => user.id === userId))
			throw new Error(`User ${userId} not in channel ${name}`);
		channel.adminsIds = channel.adminsIds.filter((id: string) => id !== userId);
		channel.users = channel.users.filter((user: UserEntity) => user.id !== userId);
		await this.channelRepository.save(channel);
	}

	async addMessage(userId: string, channelName: string, content: string): Promise<void> {
		const channel: ChannelEntity = await this.channelRepository.findOne({
			relations: ['messages', 'receiver'],
			where: { name: channelName }
		});
		if (!channel)
			throw new Error(`Channel ${channelName} does not exist`);
		if (!channel.users.find((user: UserEntity) => user.id === userId))
			throw new Error(`User ${userId} not in channel ${channelName}`);
		if (channel.mutedIds.includes(userId))
			throw new Error(`User ${userId} is muted in channel ${channelName}`);
		
		await this.messageService.add(userId, {
			receiverId: channel.receiver.id,
			content: content
		});
	}

	async removeMessage(userId: string, channelName: string, messageId: string) {
		const channel: ChannelEntity = await this.channelRepository.findOne({
			relations: ['messages', 'receiver', 'owner'],
			where: { name: channelName }
		});
		const senderId: string = await this.messageService.getSenderId(messageId);

		if (!channel)
			throw new Error(`Channel ${channelName} does not exist`);
		if (!channel.users.find((user: UserEntity) => user.id === userId))
			throw new Error(`User ${userId} not in channel ${channelName}`);
		if (userId != senderId && channel.owner.id !== userId && !channel.adminsIds.includes(userId))
			throw new Error(`User ${userId} is not admin in channel ${channelName}`);
		await this.messageService.remove(messageId);
	}

	async mute(
		userId: string,
		channelName: string,
		otherId: string,
		time: number
	): Promise<void> {
		const channel: ChannelEntity = await this.channelRepository.findOne({
			relations: ['users', 'owner'],
			where: { name: channelName }
		});
		if (!channel)
			throw new Error(`Channel ${channelName} does not exist`);
		if (!channel.users.find((user: UserEntity) => user.id === userId))
			throw new Error(`User ${userId} not in channel ${channelName}`);
		if (!channel.users.find((user: UserEntity) => user.id === otherId))
			throw new Error(`User ${otherId} not in channel ${channelName}`);
		if (channel.owner.id !== userId && !channel.adminsIds.includes(userId))
			throw new Error(`User ${userId} is not admin in channel ${channelName}`);
		if (channel.mutedIds.includes(otherId))
			throw new Error(`User ${otherId} is already muted in channel ${channelName}`);
		if (channel.adminsIds.includes(otherId))
			throw new Error(`User ${otherId} is admin in channel ${channelName}`);
		channel.mutedIds.push(otherId);
		// Automatically unmute after time (in seconds)
		setTimeout(() => this.unmute(userId, channelName, otherId), time * 1000);
		await this.channelRepository.save(channel);
	}

	async unmute(userId: string, channelName: string, otherId: string): Promise<void> {
		const channel: ChannelEntity = await this.channelRepository.findOne({
			relations: ['users', 'owner'],
			where: { name: channelName }
		});
		if (!channel)
			throw new Error(`Channel ${channelName} does not exist`);
		if (!channel.users.find((user: UserEntity) => user.id === userId))
			throw new Error(`User ${userId} not in channel ${channelName}`);
		if (!channel.users.find((user: UserEntity) => user.id === otherId))
			throw new Error(`User ${otherId} not in channel ${channelName}`);
		if (channel.owner.id !== userId && !channel.adminsIds.includes(userId))
			throw new Error(`User ${userId} is not admin in channel ${channelName}`);
		if (!channel.mutedIds.includes(otherId))
			throw new Error(`User ${otherId} is not muted in channel ${channelName}`);
		if (channel.adminsIds.includes(otherId))
			throw new Error(`User ${otherId} is admin in channel ${channelName}`);
		channel.mutedIds = channel.mutedIds.filter((id: string) => id !== otherId);
		await this.channelRepository.save(channel);
	}

	async promote(
		userId: string,
		channelName: string,
		otherId: string
	) {
		const channel: ChannelEntity = await this.channelRepository.findOne({
			relations: ['users', 'owner'],
			where: { name: channelName }
		});
		if (!channel)
			throw new Error(`Channel ${channelName} does not exist`);
		if (!channel.users.find((user: UserEntity) => user.id === userId))
			throw new Error(`User ${userId} not in channel ${channelName}`);
		if (!channel.users.find((user: UserEntity) => user.id === otherId))
			throw new Error(`User ${otherId} not in channel ${channelName}`);
		if (channel.owner.id !== userId && !channel.adminsIds.includes(userId))
			throw new Error(`User ${userId} is not admin in channel ${channelName}`);
		if (channel.adminsIds.includes(otherId))
			throw new Error(`User ${otherId} is already admin in channel ${channelName}`);
		if (channel.owner.id === otherId)
			throw new Error(`User ${otherId} is owner in channel ${channelName}`);
		channel.adminsIds.push(otherId);
		await this.channelRepository.save(channel);
	}

	async demote(
		userId: string,
		channelName: string,
		otherId: string
	) {
		const channel: ChannelEntity = await this.channelRepository.findOne({
			relations: ['users', 'owner'],
			where: { name: channelName }
		});
		if (!channel)
			throw new Error(`Channel ${channelName} does not exist`);
		if (!channel.users.find((user: UserEntity) => user.id === userId))
			throw new Error(`User ${userId} not in channel ${channelName}`);
		if (!channel.users.find((user: UserEntity) => user.id === otherId))
			throw new Error(`User ${otherId} not in channel ${channelName}`);
		if (channel.owner.id !== userId && !channel.adminsIds.includes(userId))
			throw new Error(`User ${userId} is not admin in channel ${channelName}`);
		if (!channel.adminsIds.includes(otherId))
			throw new Error(`User ${otherId} is not admin in channel ${channelName}`);
		if (channel.owner.id === otherId)
			throw new Error(`User ${otherId} is owner in channel ${channelName}`);
		channel.adminsIds = channel.adminsIds.filter((id: string) => id !== otherId);
		await this.channelRepository.save(channel);
	}

	async kick(
		userId: string,
		channelName: string,
		otherId: string
	) {
		const channel: ChannelEntity = await this.channelRepository.findOne({
			relations: ['users', 'owner'],
			where: { name: channelName }
		});
		if (!channel)
			throw new Error(`Channel ${channelName} does not exist`);
		if (!channel.users.find((user: UserEntity) => user.id === userId))
			throw new Error(`User ${userId} not in channel ${channelName}`);
		if (!channel.users.find((user: UserEntity) => user.id === otherId))
			throw new Error(`User ${otherId} not in channel ${channelName}`);
		if (channel.owner.id !== userId && !channel.adminsIds.includes(userId))
			throw new Error(`User ${userId} is not admin in channel ${channelName}`);
		if (channel.owner.id === otherId || channel.adminsIds.includes(otherId))
			throw new Error(`User ${otherId} is admin in channel ${channelName}`);
		channel.users = channel.users.filter((user: UserEntity) => user.id !== otherId);
		await this.channelRepository.save(channel);
	}

	async invite(
		userId: string,
		channelName: string,
		otherId: string
	) {
		const channel: ChannelEntity = await this.channelRepository.findOne({
			relations: ['users', 'owner'],
			where: { name: channelName }
		});
		if (!channel)
			throw new Error(`Channel ${channelName} does not exist`);
		if (!channel.users.find((user: UserEntity) => user.id === userId))
			throw new Error(`User ${userId} not in channel ${channelName}`);
		if (channel.users.find((user: UserEntity) => user.id === otherId))
			throw new Error(`User ${otherId} already in channel ${channelName}`);
		if (channel.bannedIds.includes(otherId))
			throw new Error(`User ${otherId} is banned in channel ${channelName}`);
		channel.invites.push({ id: otherId } as UserEntity);
		await this.channelRepository.save(channel);
	}

	async ban(
		userId: string,
		channelName: string,
		otherId: string,
		time: number,
	) {
		const channel: ChannelEntity = await this.channelRepository.findOne({
			relations: ['users', 'owner'],
			where: { name: channelName }
		});
		if (!channel)
			throw new Error(`Channel ${channelName} does not exist`);
		if (!channel.users.find((user: UserEntity) => user.id === userId))
			throw new Error(`User ${userId} not in channel ${channelName}`);
		if (!channel.users.find((user: UserEntity) => user.id === otherId))
			throw new Error(`User ${otherId} not in channel ${channelName}`);
		if (channel.owner.id !== userId && !channel.adminsIds.includes(userId))
			throw new Error(`User ${userId} is not admin in channel ${channelName}`);
		if (channel.owner.id === otherId || channel.adminsIds.includes(otherId))
			throw new Error(`User ${otherId} is admin in channel ${channelName}`);
		if (channel.bannedIds.includes(otherId))
			throw new Error(`User ${otherId} is already banned in channel ${channelName}`);
		channel.bannedIds.push(otherId);
		setTimeout(() => {
			this.unban(userId, channelName, otherId);
		}, time);
		await this.channelRepository.save(channel);
	}

	async unban(
		userId: string,
		channelName: string,
		otherId: string
	) {
		const channel: ChannelEntity = await this.channelRepository.findOne({
			relations: ['users', 'owner'],
			where: { name: channelName }
		});
		if (!channel)
			throw new Error(`Channel ${channelName} does not exist`);
		if (!channel.users.find((user: UserEntity) => user.id === userId))
			throw new Error(`User ${userId} not in channel ${channelName}`);
		if (!channel.bannedIds.includes(otherId))
			throw new Error(`User ${otherId} is not banned in channel ${channelName}`);
		if (channel.owner.id !== userId && !channel.adminsIds.includes(userId))
			throw new Error(`User ${userId} is not admin in channel ${channelName}`);
		channel.bannedIds = channel.bannedIds.filter((id: string) => id !== otherId);
		await this.channelRepository.save(channel);
	}
}
