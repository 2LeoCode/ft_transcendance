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

	async getOneFull(id: string): Promise<ChannelEntity> {
		const channel = await this.channelRepository.findOne({
			relations: [
				'owner',
				'users',
				'invites',
				'receiver',
				'receiver.messages',
				'receiver.messages.sender',
				'receiver.messages.receiver',
				'receiver.messages.receiver.parentChannel',
				'receiver.parentChannel',
			],
			where: { id }
		});
		if (!channel)
			throw new Error(`Channel ${id} does not exist`);
		return channel;
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
				'receiver.messages.sender',
				'receiver.messages.receiver',
				'receiver.messages.receiver.parentChannel',
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
			throw new Error(`You are not in any channel`);
		return channel;
	}

	async add(userId: string, dto: CreateChannelDto): Promise<ChannelEntity> {
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
			adminsIds: [userId],
			users: [{ id: userId } as UserEntity],
			owner: { id: userId }
		}).then(async (result: ChannelEntity) => {
			const channel = await this.getOneFull(result.id);
			channel.receiver = await this.receiverService.add('Channel', result);
			this.channelRepository.save(channel);
			return channel;
		});
	}

	async remove(userId: string, channelId: string) {
		const channel: ChannelEntity = await this.channelRepository.findOne({
			relations: [
				'owner',
				'users',
				'invites',
				'receiver',
				'receiver.messages',
				'receiver.messages.sender',
				'receiver.messages.receiver',
				'receiver.messages.receiver.parentChannel',
				'receiver.parentChannel',
			],
			where: { id: channelId }
		});
		if (!channel)
			throw new Error(`Channel ${channelId} does not exist`);
		if (channel.owner.id !== userId)
			throw new Error(`You are not the owner of channel ${channel.name}`);
		const res = {...channel};
		await this.channelRepository.remove(channel);
		await this.receiverService.remove(channel.receiver.id);
		return res;
	}

	async update(userId: string, channelId: string, dto: UpdateChannelDto) {
		const channel: ChannelEntity = await this.channelRepository.findOne({
			relations: [
				'owner',
				'users',
				'invites',
				'receiver',
				'receiver.messages',
				'receiver.messages.sender',
				'receiver.messages.receiver',
				'receiver.messages.receiver.parentChannel',
				'receiver.parentChannel',
			],
			where: { id: channelId }
		});
		if (dto.password)
			dto.password = Bcrypt.hashSync(dto.password, 10);
		if (!channel)
			throw new Error(`Channel ${channelId} does not exist`);
		if (channel.owner.id !== userId)
			throw new Error(`You are not owner of channel ${channel.name}`);
		await this.channelRepository.update(channel.id, dto);
		return this.channelRepository.findOne({
			relations: [
				'owner',
				'users',
				'invites',
				'receiver',
				'receiver.messages',
				'receiver.messages.sender',
				'receiver.messages.receiver',
				'receiver.messages.receiver.parentChannel',
				'receiver.parentChannel',
			],
			where: { id: channelId }
		})
	}

	async join(userId: string, name: string, password: string) {
		const channel: ChannelEntity = await this.channelRepository.findOne({
			relations: [
				'owner',
				'users',
				'invites',
				'receiver',
				'receiver.messages',
				'receiver.messages.sender',
				'receiver.messages.receiver',
				'receiver.messages.receiver.parentChannel',
				'receiver.parentChannel',
			],
			where: { name: name }
		});
		if (!channel)
			throw new Error(`Channel ${name} does not exist`);
		if (channel.users.find((user: UserEntity) => user.id === userId))
			throw new Error(`You are already in channel ${name}`);
		if (channel.bannedIds.includes(userId))
			throw new Error(`You are banned from channel ${name}`);
		if (channel.accessibility === 'private') {
			if (!channel.invites.find((user: UserEntity) => user.id === userId))
				throw new Error(`You are not invited to channel ${name}`);
			channel.invites = channel.invites.filter((user: UserEntity) => user.id !== userId);
		}
		if (!Bcrypt.compareSync(password, channel.password))
			throw new Error(`Incorrect password for channel ${name}`);
		channel.users.push({ id: userId } as UserEntity);
		await this.channelRepository.save(channel);
		return this.channelRepository.findOne({
			relations: [
				'owner',
				'users',
				'invites',
				'receiver',
				'receiver.messages',
				'receiver.messages.sender',
				'receiver.messages.receiver',
				'receiver.messages.receiver.parentChannel',
				'receiver.parentChannel',
			],
			where: { name: name }
		}) as any as ChannelEntity;
	}

	async leave(userId: string, id: string) {
		const channel: ChannelEntity = await this.channelRepository.findOne({
			relations: [
				'owner',
				'users',
				'invites',
				'receiver',
				'receiver.messages',
				'receiver.messages.sender',
				'receiver.messages.receiver',
				'receiver.messages.receiver.parentChannel',
				'receiver.parentChannel',
			],
			where: { id }
		});
		if (!channel)
			throw new Error(`Channel ${channel.name} does not exist`);
		if (channel.owner.id === userId)
			return this.remove(userId, channel.id);
		if (!channel.users.find((user: UserEntity) => user.id === userId))
			throw new Error(`You are not in channel ${channel.name}`);
		channel.adminsIds = channel.adminsIds.filter((id: string) => id !== userId);
		channel.users = channel.users.filter((user: UserEntity) => user.id !== userId);
		await this.channelRepository.save(channel);
		return channel;
	}

	async addMessage(userId: string, channelId: string, content: string) {
		const channel: ChannelEntity = await this.channelRepository.findOne({
			relations: [
				'owner',
				'users',
				'invites',
				'receiver',
				'receiver.messages',
				'receiver.messages.sender',
				'receiver.messages.receiver',
				'receiver.messages.receiver.parentChannel',
				'receiver.parentChannel',
			],
			where: { id: channelId }
		});
		if (!channel)
			throw new Error(`Channel ${channel.name} does not exist`);
		if (!channel.users.find((user: UserEntity) => user.id === userId))
			throw new Error(`You are not in channel ${channel.name}`);
		if (channel.mutedIds.includes(userId))
			throw new Error(`You are muted in channel ${channel.name}`);
		
		await this.messageService.add(userId, {
			receiverId: channel.receiver.id,
			content: content
		});
		return this.channelRepository.findOne({
			relations: [
				'owner',
				'users',
				'invites',
				'receiver',
				'receiver.messages',
				'receiver.messages.sender',
				'receiver.messages.receiver',
				'receiver.messages.receiver.parentChannel',
				'receiver.parentChannel',
			],
			where: { id: channelId }
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
			throw new Error(`You are not in channel ${channelName}`);
		if (userId != senderId && channel.owner.id !== userId && !channel.adminsIds.includes(userId))
			throw new Error(`You are not admin in channel ${channelName}`);
		await this.messageService.remove(messageId);
	}

	async mute(
		userId: string,
		channelId: string,
		otherId: string
	) {
		const channel: ChannelEntity = await this.channelRepository.findOne({
			relations: [
				'owner',
				'users',
				'invites',
				'receiver',
				'receiver.messages',
				'receiver.messages.sender',
				'receiver.messages.receiver',
				'receiver.messages.receiver.parentChannel',
				'receiver.parentChannel',
			],
			where: { id: channelId }
		});
		if (!channel)
			throw new Error(`Channel ${channel.name} does not exist`);
		if (!channel.users.find((user: UserEntity) => user.id === userId))
			throw new Error(`You are not in channel ${channel.name}`);
		if (!channel.users.find((user: UserEntity) => user.id === otherId))
			throw new Error(`This user is not in channel ${channel.name}`);
		if (channel.owner.id !== userId && !channel.adminsIds.includes(userId))
			throw new Error(`You are not admin in channel ${channel.name}`);
		if (channel.mutedIds.includes(otherId))
			throw new Error(`This user is already muted in channel ${channel.name}`);
		if (channel.adminsIds.includes(otherId))
			throw new Error(`This user is admin in channel ${channel.name}`);
		channel.mutedIds.push(otherId);
		// Automatically unmute after time (in seconds)
		await this.channelRepository.save(channel);
		return channel;
	}

	async unmute(userId: string, channelId: string, otherId: string) {
		const channel: ChannelEntity = await this.channelRepository.findOne({
			relations: [
				'owner',
				'users',
				'invites',
				'receiver',
				'receiver.messages',
				'receiver.messages.sender',
				'receiver.messages.receiver',
				'receiver.messages.receiver.parentChannel',
				'receiver.parentChannel',
			],
			where: { id: channelId }
		});
		if (!channel)
			throw new Error(`Channel ${channelId} does not exist`);
		if (!channel.users.find((user: UserEntity) => user.id === userId))
			throw new Error(`You are not in channel ${channel.name}`);
		if (!channel.users.find((user: UserEntity) => user.id === otherId))
			throw new Error(`This user is not in channel ${channel.name}`);
		if (channel.owner.id !== userId && !channel.adminsIds.includes(userId))
			throw new Error(`You are not admin in channel ${channel.name}`);
		if (!channel.mutedIds.includes(otherId))
			throw new Error(`This user is not muted in channel ${channel.name}`);
		if (channel.adminsIds.includes(otherId))
			throw new Error(`This user is admin in channel ${channel.name}`);
		channel.mutedIds = channel.mutedIds.filter((id: string) => id !== otherId);
		await this.channelRepository.save(channel);
		return channel;
	}

	async promote(
		userId: string,
		channelId: string,
		otherId: string
	) {
		const channel: ChannelEntity = await this.channelRepository.findOne({
			relations: [
				'owner',
				'users',
				'invites',
				'receiver',
				'receiver.messages',
				'receiver.messages.sender',
				'receiver.messages.receiver',
				'receiver.messages.receiver.parentChannel',
				'receiver.parentChannel',
			],
			where: { id: channelId }
		});
		if (!channel)
			throw new Error(`Channel ${channelId} does not exist`);
		if (channel.owner.id !== userId)
			throw new Error(`You are not owner of channel ${channel.name}`);
		if (!channel.users.find((user: UserEntity) => user.id === userId))
			throw new Error(`You are not in channel ${channel.name}`);
		if (!channel.users.find((user: UserEntity) => user.id === otherId))
			throw new Error(`This user is not in channel ${channel.name}`);
		if (channel.adminsIds.includes(otherId))
			throw new Error(`This user is already admin in channel ${channel.name}`);
		if (channel.owner.id === otherId)
			throw new Error(`This user is owner in channel ${channel.name}`);
		channel.adminsIds.push(otherId);
		await this.channelRepository.save(channel);
		return channel;
	}

	async demote(
		userId: string,
		channelId: string,
		otherId: string
	) {
		const channel: ChannelEntity = await this.channelRepository.findOne({
			relations: [
				'owner',
				'users',
				'invites',
				'receiver',
				'receiver.messages',
				'receiver.messages.sender',
				'receiver.messages.receiver',
				'receiver.messages.receiver.parentChannel',
				'receiver.parentChannel',
			],
			where: { id: channelId }
		});
		if (!channel)
			throw new Error(`Channel ${channelId} does not exist`);
		if (channel.owner.id !== userId)
			throw new Error(`You are not owner of channel ${channel.name}`);
		if (!channel.users.find((user: UserEntity) => user.id === userId))
			throw new Error(`You are not in channel ${channel.name}`);
		if (!channel.users.find((user: UserEntity) => user.id === otherId))
			throw new Error(`This user is not in channel ${channel.name}`);
		if (!channel.adminsIds.includes(otherId))
			throw new Error(`This user is not admin in channel ${channel.name}`);
		if (channel.owner.id === otherId)
			throw new Error(`This user is owner in channel ${channel.name}`);
		channel.adminsIds = channel.adminsIds.filter((id: string) => id !== otherId);
		await this.channelRepository.save(channel);
		return channel;
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
			throw new Error(`You are not in channel ${channelName}`);
		if (!channel.users.find((user: UserEntity) => user.id === otherId))
			throw new Error(`This user is not in channel ${channelName}`);
		if (channel.owner.id !== userId && !channel.adminsIds.includes(userId))
			throw new Error(`You are not admin in channel ${channelName}`);
		if (channel.owner.id === otherId || channel.adminsIds.includes(otherId))
			throw new Error(`This user is admin in channel ${channelName}`);
		channel.users = channel.users.filter((user: UserEntity) => user.id !== otherId);
		await this.channelRepository.save(channel);
	}

	async invite(
		userId: string,
		channelId: string,
		otherId: string
	) {
		const channel: ChannelEntity = await this.channelRepository.findOne({
			relations: [
				'owner',
				'users',
				'invites',
				'receiver',
				'receiver.messages',
				'receiver.messages.sender',
				'receiver.messages.receiver',
				'receiver.messages.receiver.parentChannel',
				'receiver.parentChannel',
			],
			where: { id: channelId }
		});
		if (!channel)
			throw new Error(`Channel ${channelId} does not exist`);
		if (!channel.users.find((user: UserEntity) => user.id === userId))
			throw new Error(`You are not in channel ${channel.name}`);
		if (channel.users.find((user: UserEntity) => user.id === otherId))
			throw new Error(`This user is already in channel ${channel.name}`);
		if (channel.bannedIds.includes(otherId))
			throw new Error(`This user is banned in channel ${channel.name}`);
		channel.invites.push({ id: otherId } as UserEntity);
		return await this.channelRepository.save(channel);
	}

	async ban(
		userId: string,
		channelId: string,
		otherId: string,
	) {
		const channel: ChannelEntity = await this.channelRepository.findOne({
			relations: [
				'owner',
				'users',
				'invites',
				'receiver',
				'receiver.messages',
				'receiver.messages.sender',
				'receiver.messages.receiver',
				'receiver.messages.receiver.parentChannel',
				'receiver.parentChannel',
			],
			where: { id: channelId }
		});
		if (!channel)
			throw new Error(`Channel ${channelId} does not exist`);
		if (!channel.users.find((user: UserEntity) => user.id === userId))
			throw new Error(`You are not in channel ${channel.name}`);
		if (!channel.users.find((user: UserEntity) => user.id === otherId))
			throw new Error(`This user is not in channel ${channel.name}`);
		if (channel.owner.id !== userId && !channel.adminsIds.includes(userId))
			throw new Error(`You are not admin in channel ${channel.name}`);
		if (channel.owner.id === otherId || channel.adminsIds.includes(otherId))
			throw new Error(`This user is admin in channel ${channel.name}`);
		if (channel.bannedIds.includes(otherId))
			throw new Error(`This user is already banned in channel ${channel.name}`);
		channel.bannedIds.push(otherId);
		channel.users = channel.users.filter((user: UserEntity) => user.id !== otherId);
		await this.channelRepository.save(channel);
		return channel;
	}

	async unban(
		userId: string,
		channelId: string,
		otherId: string
	) {
		const channel: ChannelEntity = await this.channelRepository.findOne({
			relations: [
				'owner',
				'users',
				'invites',
				'receiver',
				'receiver.messages',
				'receiver.messages.sender',
				'receiver.messages.receiver',
				'receiver.messages.receiver.parentChannel',
				'receiver.parentChannel',
			],
			where: { id: channelId }
		});
		if (!channel)
			throw new Error(`Channel ${channelId} does not exist`);
		if (!channel.users.find((user: UserEntity) => user.id === userId))
			throw new Error(`You are not in channel ${channel.name}`);
		if (!channel.bannedIds.includes(otherId))
			throw new Error(`This user is not banned in channel ${channel.name}`);
		if (channel.owner.id !== userId && !channel.adminsIds.includes(userId))
			throw new Error(`You are not admin in channel ${channel.name}`);
		channel.bannedIds = channel.bannedIds.filter((id: string) => id !== otherId);
		await this.channelRepository.save(channel);
		return channel;
	}

	async acceptInvite(
		userId: string,
		channelId: string
	) {
		const channel: ChannelEntity = await this.channelRepository.findOne({
			relations: [
				'owner',
				'users',
				'invites',
				'receiver',
				'receiver.messages',
				'receiver.messages.sender',
				'receiver.messages.receiver',
				'receiver.messages.receiver.parentChannel',
				'receiver.parentChannel',
			],
			where: { id: channelId }
		});
		if (!channel)
			throw new Error(`Channel ${channelId} does not exist`);
		if (!channel.invites.find((user: UserEntity) => user.id === userId))
			throw new Error(`You are not invited to channel ${channel.name}`);
		channel.users.push({ id: userId } as UserEntity);
		channel.invites = channel.invites.filter((user: UserEntity) => user.id !== userId);
		await this.channelRepository.save(channel);
		return this.channelRepository.findOne({
			relations: [
				'owner',
				'users',
				'invites',
				'receiver',
				'receiver.messages',
				'receiver.messages.sender',
				'receiver.messages.receiver',
				'receiver.messages.receiver.parentChannel',
				'receiver.parentChannel',
			],
			where: { id: channelId }
		});
	}

	async declineInvite(
		userId: string,
		channelId: string
	) {
		const channel: ChannelEntity = await this.channelRepository.findOne({
			relations: [
				'owner',
				'users',
				'invites',
				'receiver',
				'receiver.messages',
				'receiver.messages.sender',
				'receiver.messages.receiver',
				'receiver.messages.receiver.parentChannel',
				'receiver.parentChannel',
			],
			where: { id: channelId }
		});
		if (!channel)
			throw new Error(`Channel ${channelId} does not exist`);
		if (!channel.invites.find((user: UserEntity) => user.id === userId))
			throw new Error(`You are not invited to channel ${channel.name}`);
		channel.invites = channel.invites.filter((user: UserEntity) => user.id !== userId);
		return await this.channelRepository.save(channel);
	}
}
