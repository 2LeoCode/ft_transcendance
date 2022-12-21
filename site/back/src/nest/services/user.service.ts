import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import UserEntity from '../entities/user.entity';
import MessageEntity from '../entities/message.entity';
import ScoreEntity from '../entities/score.entity';
import ChannelEntity from '../entities/channel.entity';
import ReceiverService from './receiver.service';
import MessageService from './message.service';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import { authenticator } from 'otplib';
import ImageEntity from '../entities/image.entity';
import { ImageDto } from '../dtos/image.dto';

@Injectable()
export default class UserService {
	constructor(
		@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
		@InjectRepository(ImageEntity) private readonly imageRepository: Repository<ImageEntity>,
		private readonly receiverService: ReceiverService,
		private readonly messageService: MessageService
	) {}

	async getPublic(filter: {
		nick?: string,
		user42?: string,
		online?: boolean,
	}): Promise<UserEntity[]> {
		if (Object.values(filter).every((value) => value === undefined))
			throw new Error('No filter provided');
		return this.userRepository.find({
			where: {
				nick: filter.nick,
				user42: filter.user42,
				online: filter.online
			}
		});
	}

	async getOnePublic(filter: {
		id?: string,
		user42?: string,
	}) {
		if (Object.values(filter).every((value) => value === undefined))
			throw new Error('No filter provided');
		return this.userRepository.findOne({
			where: {
				id: filter.id,
				user42: filter.user42
			}
		});
	}

	async getOne(id: string): Promise<UserEntity> {
		const r = await this.userRepository.findOne({
			relations: [
				'messages',
				'messages.sender',
				'messages.receiver',
				'messages.receiver.parentUser',
				'messages.receiver.parentChannel',
				'scores',
				'scores.user',
				'channels',
				'ownedChannels',
				'ownedChannels.owner',
				'ownedChannels.users',
				'ownedChannels.invites',
				'ownedChannels.receiver',
				'ownedChannels.receiver.messages',
				'ownedChannels.receiver.messages.sender',
				'ownedChannels.receiver.messages.receiver',
				'ownedChannels.receiver.messages.receiver.parentUser',
				'ownedChannels.receiver.messages.receiver.parentChannel',
				'channels.owner',
				'channels.users',
				'channels.invites',
				'channels.receiver',
				'channels.receiver.messages',
				'channels.receiver.messages.sender',
				'channels.receiver.messages.receiver',
				'channels.receiver.messages.receiver.parentUser',
				'channels.receiver.messages.receiver.parentChannel',
				'friends',
				'friendRequests',
				'blocked',
				'blockedBy',
				'receiver',
				'receiver.messages',
				'receiver.messages.sender',
				'receiver.messages.receiver',
				'receiver.messages.receiver.parentUser',
				'receiver.messages.receiver.parentChannel',
				'receiver.parentUser',
				'receiver.parentChannel',
				'channelInvites'
			],
			where: { id: id }
		});
		return r;
	}

	async updateByName(user42: string, dto: UpdateUserDto): Promise<void> {
		await this.userRepository.update({ user42: user42 }, dto);
	}

	async update(id: string, dto: UpdateUserDto): Promise<void> {
		if (dto.nick) {
			const sameNick = await this.userRepository.findOne({
				where: { nick: dto.nick }
			});
			if (sameNick && sameNick.id !== id)
				throw new Error(`Nickname ${dto.nick} already taken`);
		}
		await this.userRepository.update(id, dto);
	}

	async sendPrivMsg(
		userId: string,
		otherId: string,
		content: string
	) {
		const other = await this.userRepository.findOne({
			relations: ['receiver', 'blocked'],
			where: { id: otherId }
		});
		if (other.blocked.find((user: UserEntity) => user.id === userId))
			throw new Error(`${other.user42} blocked you`);
		return await this.messageService.add(userId, {
			receiverId: other.receiver.id,
			content: content
		});
	}

	async deletePrivMsg(
		userId: string,
		msgId: string
	) {
		const user = await this.userRepository.findOne({
			relations: ['receiver'],
			where: { id: userId }
		});
		const senderId = await this.messageService.getSenderId(msgId);
		const receiverId = await this.messageService.getReceiverId(msgId);
		if (senderId !== userId || receiverId !== user.receiver.id)
			throw new Error(`You are not the sender/receiver of this message`);
		await this.messageService.remove(msgId);
	}
	// For testing purpose
	//async getDebug(): Promise<UserEntity[]> {
	//	return this.userRepository.find({
	//		relations: ['messages', 'scores', 'channels', 'receiver', 'ownedChannels', 'friends', 'friendRequests'],
	//		where: {}
	//	});
	//}
	async getScores(id: string): Promise<ScoreEntity[]> {
		return this.userRepository.findOne({
			relations: ['scores'],
			where: { id: id }
		}).then((user: UserEntity) => user.scores);
	}

	async getFriendRequests(id: string): Promise<UserEntity[]> {
		return this.userRepository.findOne({
			relations: ['friendRequests'],
			where: { id: id }
		}).then((user: UserEntity) => user.friendRequests);
	}

	async getFriends(id: string): Promise<UserEntity[]> {
		return this.userRepository.findOne({
			relations: ['friends'],
			where: { id: id }
		}).then((user: UserEntity) => user.friends);
	}

	async getOwnedChannels(id: string): Promise<ChannelEntity[]> {
		return this.userRepository.findOne({
			relations: ['ownedChannels'],
			where: { id: id }
		}).then((user: UserEntity) => user.ownedChannels);
	}

	async getChannels(id: string): Promise<ChannelEntity[]> {
		return this.userRepository.findOne({
			relations: ['channels'],
			where: { id: id }
		}).then((user: UserEntity) => user.channels);
	}

	async getMessagesIn(id: string): Promise<MessageEntity[]> {
		return this.userRepository.findOne({
			relations: ['receiver'],
			where: { id: id }
		}).then(
			(user: UserEntity) => this.receiverService.getMessages(user.receiver.id)
		);
	}

	async getMessagesOut(id: string): Promise<MessageEntity[]> {
		return this.userRepository.findOne({
			relations: ['messages'],
			where: { id: id }
		}).then((user: UserEntity) => user.messages);
	}

	async add(dto: CreateUserDto): Promise<UserEntity> {
		const user = await this.userRepository.findOne({
			where: { user42: dto.user42 }
		});
		if (user)
			return user;
		const newUser = await this.userRepository.save({
			user42: dto.user42,
			nick: dto.user42,
		});
		newUser.receiver = await this.receiverService.add('User', newUser);
		return this.userRepository.save(newUser);
	}

	async sendFriendRequest(id: string, dstId: string): Promise<void> {
		const dstUser = await this.userRepository.findOne({
			relations: ['friendRequests', 'blocked'],
			where: { id: dstId }
		});
		if (dstUser.blocked.find((user: UserEntity) => user.id === id))
			throw new Error(`${dstUser.user42} blocked you`);
		dstUser.friendRequests.push({id: id} as UserEntity);
		await this.userRepository.save(dstUser);
	}

	async acceptFriendRequest(id: string, srcId: string): Promise<void> {
		const user = await this.userRepository.findOne({
			relations: ['friendRequests', 'friends'],
			where: { id: id }
		});
		const index = user.friendRequests.findIndex((user: UserEntity) => user.id === srcId);
		if (index === -1)
			throw new Error(`You have no friend request from this user`);
		const srcUser = await this.userRepository.findOne({
			relations: ['friends'],
			where: { id: srcId }
		});
		user.friendRequests.splice(index, 1);
		user.friends.push({id: srcId} as UserEntity);
		srcUser.friends.push(user);
		await this.userRepository.save(user);
		await this.userRepository.save(srcUser);
	}

	async rejectFriendRequest(id: string, srcId: string): Promise<void> {
		const user = await this.userRepository.findOne({
			relations: ['friendRequests'],
			where: { id: id }
		});
		const index = user.friendRequests.findIndex((user: UserEntity) => user.id === srcId);
		if (index === -1)
			throw new Error(`You has no friend request from ${srcId}`);
		user.friendRequests.splice(index, 1);
		await this.userRepository.save(user);
	}

	async removeFriend(id: string, dstId: string): Promise<void> {
		const user = await this.userRepository.findOne({
			relations: ['friends'],
			where: { id: id }
		});
		const index = user.friends.findIndex((user: UserEntity) => user.id === dstId);
		const dstUser = await this.userRepository.findOne({
			relations: ['friends'],
			where: { id: dstId }
		});
		if (index === -1)
			throw new Error(`${dstUser.user42} is not your friend`);
		user.friends.splice(index, 1);
		dstUser.friends.splice(dstUser.friends.indexOf(user), 1);
		await this.userRepository.save(user);
		await this.userRepository.save(dstUser);
	}

	async remove(id: string): Promise<void> {
		await this.userRepository.delete(id);
	}

	async block(id: string, dstId: string): Promise<void> {
		const user = await this.userRepository.findOne({
			relations: ['blocked'],
			where: { id: id }
		});
		const dstUser = await this.userRepository.findOne({
			relations: ['blocked'],
			where: { id: dstId }
		});

		if (user.blocked.find((user: UserEntity) => user.id === dstId))
			throw new Error(`${dstUser.user42} is already blocked`);
		user.blocked.push(dstUser);
		await this.userRepository.save(user);
	}

	async unblock(id: string, dstId: string): Promise<void> {
		const user = await this.userRepository.findOne({
			relations: ['blocked'],
			where: { id: id }
		});
		
		const index = user.blocked.findIndex((user: UserEntity) => user.id === dstId);
		if (index === -1) {
			const dstUser = await this.userRepository.findOne({
				relations: ['blocked'],
				where: { id: id }
			});
			throw new Error(`${dstUser.user42} is not blocked`);
		}
		user.blocked.splice(index, 1);
		await this.userRepository.save(user);
	}

	async enable2fa(id: string) {
		const user = await this.userRepository.findOne({
			where: { id: id }
		});
		user.twoFactorSecret = authenticator.generateSecret();
		await this.userRepository.save(user);
	}

	async disable2fa(id: string): Promise<void> {
		const user = await this.userRepository.findOne({
			where: { id: id }
		});
		user.twoFactorSecret = null;
		await this.userRepository.save(user);
	}

	async changeAvatar(id: string, avatar: ImageDto) {
		const user = await this.userRepository.findOne({
			where: { id: id }
		});
		if (user.avatar)
			this.imageRepository.delete(user.avatar.id);
		user.avatar = await this.imageRepository.save(avatar);
		return await this.userRepository.save(user);
	}
}
