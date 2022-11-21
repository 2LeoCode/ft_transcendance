import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import UserEntity from './user.entity';
import MessageEntity from '../message/message.entity';
import ScoreEntity from '../score/score.entity';
import ChannelEntity from '../channel/channel.entity';
import ReceiverService from '../receiver/receiver.service';
import MessageService from '../message/message.service';
import ScoreService from '../score/score.service';
import ChannelService from '../channel/channel.service';
import { CreateUserDto } from './user.dto';

@Injectable()
export default class UserService {
	constructor(
		@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
		private readonly receiverService: ReceiverService,
		private readonly messageService: MessageService,
		private readonly scoreService: ScoreService,
		private readonly channelService: ChannelService,
	) {}

	async get(opts: {
		id?: string;
		nick?: string;
		online?: boolean;
	}): Promise<UserEntity[]> {
		return this.userRepository.find({
			where: {
				id: opts.id,
				nick: opts.nick,
				online: opts.online,
			}
		});
	}

	async getDebug(): Promise<UserEntity[]> {
		return this.userRepository.find({
			relations: ['receiver', 'messages', 'scores', 'friendRequests', 'friends', 'ownedChannels', 'channels']
		});
	}

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
			(user: UserEntity) =>
				this.receiverService.getMessages(user.receiver.id)
		);
	}

	async getMessagesOut(id: string): Promise<MessageEntity[]> {
		return this.userRepository.findOne({
			relations: ['messages'],
			where: { id: id }
		}).then((user: UserEntity) => user.messages);
	}

	async add(dto: CreateUserDto): Promise<UserEntity> {
		return this.userRepository.save({
			nick: dto.nick,
			receiver: await this.receiverService.add('User'),
		});
	}

	async sendFriendRequest(id: string, dstId: string): Promise<void> {
		const user = await this.userRepository.findOne({
			relations: ['friendRequests'],
			where: { id: id }
		});
		const dstUser = await this.userRepository.findOne({
			relations: ['friendRequests'],
			where: { id: dstId }
		});
		dstUser.friendRequests.push(user);
		await this.userRepository.save(dstUser);
	}

	async acceptFriendRequest(id: string, srcId: string): Promise<void> {
		const user = await this.userRepository.findOne({
			relations: ['friendRequests', 'friends'],
			where: { id: id }
		});
		const srcUser = await this.userRepository.findOne({
			relations: ['friendRequests', 'friends'],
			where: { id: srcId }
		});
		const index = user.friendRequests.indexOf(srcUser);
		if (index === -1)
			return ;
		user.friendRequests.splice(index, 1);
		user.friends.push(srcUser);
		//srcUser.friends.push(user);
		await this.userRepository.save(user);
		//await this.userRepository.save(srcUser);
	}

	async rejectFriendRequest(id: string, srcId: string): Promise<void> {
		const user = await this.userRepository.findOne({
			relations: ['friendRequests'],
			where: { id: id }
		});
		const srcUser = await this.userRepository.findOne({
			relations: ['friendRequests'],
			where: { id: srcId }
		});
		const index = user.friendRequests.indexOf(srcUser);
		if (index === -1)
			return ;
		user.friendRequests.splice(index, 1);
		await this.userRepository.save(user);
	}

	async removeFriend(id: string, dstId: string): Promise<void> {
		const user = await this.userRepository.findOne({
			relations: ['friends'],
			where: { id: id }
		});
		const dstUser = await this.userRepository.findOne({
			relations: ['friends'],
			where: { id: dstId }
		});
		const index = user.friends.indexOf(dstUser);
		if (index === -1)
			return ;
		user.friends.splice(index, 1);
		//dstUser.friends.splice(dstUser.friends.indexOf(user), 1);
		await this.userRepository.save(user);
		//await this.userRepository.save(dstUser);
	}

	async remove(id: string): Promise<void> {
		await this.userRepository.delete(id);
	}
}
