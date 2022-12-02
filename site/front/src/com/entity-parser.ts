import Channel from './interfaces/channel.interface';
import ComPipe from './pipes/com.pipe';
import Message from './interfaces/message.interface';
import PublicChannel, { ChannelAccessibility, ChannelVisibility } from './interfaces/public-channel.interface';
import PublicUser from './interfaces/public-user.interface';
import Score from './interfaces/score.interface';
import User from './interfaces/user.interface';
import { atom } from 'jotai';

const EntityParser =  {
	publicUser: (entity: any): PublicUser => ({
		id: entity.id,
		nick: atom(entity.nick as string),
		user42: entity.user42,
		avatarPath: atom(entity.avatarPath as string),
		online: atom(entity.online as boolean),
	}),

	publicChannel: (entity: any): PublicChannel => ({
		id: entity.id,
		name: atom(entity.name as string),
		password: atom(entity.password as string),
		accessibility: atom(entity.accessibility as ChannelAccessibility),
		visibility: atom(entity.visibility as ChannelVisibility)
	}),

	score: (entity: any): Score => ({
		id: entity.id,
		playerScore: entity.playerScore,
		enemyScore: entity.enemyScore,
		date: entity.date,
		user: EntityParser.publicUser(entity.user)
	}),

	publicUserFromId: async (id: string): Promise<PublicUser> => {
		return ComPipe.fetchPublicUser(id);
	},
	publicChannelFromId: async (id: string): Promise<PublicChannel> => {
		return ComPipe.fetchPublicChannel(id);
	},

	user: async (entity: any): Promise<User> => {
		return {
			...EntityParser.publicUser(entity),
			blockedBy: atom(
				entity.blockedBy.map(
					(user: any) => EntityParser.publicUser(user)
				) as PublicUser[],
			),
			blocked: atom(
				entity.blocked.map(
					(user: any) => EntityParser.publicUser(user)
				) as PublicUser[],
			),
			friends: atom(
				entity.friends.map(
					(friend: any) => EntityParser.publicUser(friend)
				) as PublicUser[],
			),
			friendRequests: atom(
				entity.friendRequests.map(
					(friendRequest: any) => EntityParser.publicUser(friendRequest)
				) as PublicUser[],
			),
			ownedChannels: atom(
				await Promise.all(
					entity.ownedChannels.map(
						async (channel: any) => EntityParser.channel(channel)
					)
				) as Channel[],
			),
			channels: atom(
				await Promise.all(
					entity.channels.map(
						async (channel: any) => EntityParser.channel(channel)
					)
				) as Channel[],
			),
			messagesIn: atom(
				await Promise.all(
					entity.receiver.messages.map(
						(message: any) => EntityParser.message(message, 'user')
					)
				) as Message[],
			),
			messagesOut: atom(
				await Promise.all(
					entity.messages.map(
						async (message: any) => EntityParser.message(message, 'user')
					)
				) as Message[],
			),
			scores: atom(
				entity.scores.map(
					(score: any) => EntityParser.score(score)
				) as Score[],
			),
		}
	},

	
	channel: async (entity: any): Promise<Channel> => {
		return {
			...EntityParser.publicChannel(entity),
			owner: atom(EntityParser.publicUser(entity.owner)),
			mutedIds: atom(entity.mutedIds as string[]),
			bannedIds: atom(entity.bannedIds as string[]),
			adminsIds: atom(entity.adminsIds as string[]),
			invites: atom(
				entity.invites.map(
					(invite: any) => EntityParser.publicUser(invite)
				) as PublicUser[],
			),
			messages: atom(
				await Promise.all(
					entity.receiver.messages.map(
						async (message: any) => EntityParser.message(message, 'channel')
					),
				) as Message[],
			),
			users: atom(
				entity.users.map(
					async (user: any) => EntityParser.publicUser(user)
				) as PublicUser[],
			),
		};
	},

	message: async (entity: any, type: 'user' | 'channel'): Promise<Message> => {
		return {
			id: entity.id,
			content: atom(entity.content as string),
			createDate: atom(entity.createDate as Date),
			updateDate: atom(entity.updateDate as Date),
			sender: atom(EntityParser.publicUser(entity.sender)),
			receiver:
				atom(
					type == 'channel' ?
					await EntityParser.publicChannelFromId(entity.receiver.parentId) : 
					await EntityParser.publicUserFromId(entity.receiver.parentId)
				)
		};
	}
}

export default EntityParser;