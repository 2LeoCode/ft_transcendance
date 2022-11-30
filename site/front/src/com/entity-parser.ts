import Channel from "./channel.interface";
import ComPipe from "./com.pipe";
import Message from "./message.interface";
import PublicChannel from "./public-channel.interface";
import PublicUser from "./public-user.interface";
import Score from "./score.interface";
import User from "./user.interface";

export class EntityParser {
	constructor(
		private readonly comPipe: ComPipe,
	) {}

	readonly publicUser = (entity: any): PublicUser => ({
		id: entity.id,
		nick: entity.nick,
		user42: entity.user42,
		avatarPath: entity.avatarPath,
		online: entity.online,
	})

	readonly publicChannel = (entity: any): PublicChannel => ({
		id: entity.id,
		name: entity.name,
		password: entity.password,
		accessibility: entity.accessibility,
		visibility: entity.visibility
	})

	readonly score = (entity: any): Score => ({
		id: entity.id,
		playerScore: entity.playerScore,
		enemyScore: entity.enemyScore,
		date: entity.date,
		user: this.publicUser(entity.user)
	})

	async publicUserFromId(id: string): Promise<PublicUser> {
		return (await (await this.comPipe).publicUsers).find((user: any) => user.id == id ) as PublicUser;
	}
	async publicChannelFromId(id: string): Promise<PublicChannel> {
		return (await (await this.comPipe).publicChannels).find((channel: any) => channel.id == id) as PublicChannel;
	}

	async user(entity: any): Promise<User> {
		return {
			...this.publicUser(entity),
			blockedBy: entity.blockedBy,
			blocked: entity.blocked,
			friends: entity.friends.map((friend: any) => this.publicUser(friend)),
			friendRequests: entity.friendRequests.map((friendRequest: any) => this.publicUser(friendRequest)),
			ownedChannels: entity.ownedChannels.map((channel: any) => this.channel(channel)),
			channels: entity.channels.map((channel: any) => this.channel(channel)),
			messagesIn: entity.receiver.messages.map((message: any) => this.message(message, 'user')),
			messagesOut: entity.messages.map((message: any) => this.message(message, 'user')),
			scores: entity.scores.map((score: any) => this.score(score))
		}
	};

	
	async channel(entity: any): Promise<Channel> {
		return {
			...this.publicChannel(entity),
			owner: this.publicUser(entity.owner),
			mutedIds: entity.mutedIds,
			bannedIds: entity.bannedIds,
			adminsIds: entity.adminsIds,
			invites: entity.invites.map((invite: any) => this.publicUser(invite)),
			messages: entity.receiver.messages.map((message: any) => this.message(message, 'channel')),
			users: entity.users.map((user: any) => this.publicUser(user))
		};
	};

	async message(entity: any, type: 'user' | 'channel'): Promise<Message> {
		return {
			id: entity.id,
			content: entity.content,
			createDate: entity.createDate,
			updateDate: entity.updateDate,
			sender: this.publicUser(entity.sender),
			receiver:
				type == 'channel' ?
				await this.publicChannelFromId(entity.receiver.parentId) : 
				await this.publicUserFromId(entity.receiver.parentId)
		};
	};
}
