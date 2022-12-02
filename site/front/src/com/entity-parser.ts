import Channel from './interfaces/channel.interface';
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

	user: (entity: any): User => {
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
				entity.ownedChannels.map(
						(channel: any) => EntityParser.channel(channel)
				) as Channel[],
			),
			channels: atom(
				entity.channels.map(
					(channel: any) => EntityParser.channel(channel)
				) as Channel[],
			),
			messagesIn: atom(
				entity.receiver.messages.map(
					(message: any) => EntityParser.message(message, 'user')
				) as Message[],
			),
			messagesOut: atom(
				entity.messages.map(
					async (message: any) => EntityParser.message(message, 'user')
				) as Message[],
			),
			scores: atom(
				entity.scores.map(
					(score: any) => EntityParser.score(score)
				) as Score[],
			),
		}
	},

	
	channel: (entity: any): Channel => {
		return {
			...EntityParser.publicChannel(entity),
			owner: EntityParser.publicUser(entity.owner),
			mutedIds: atom(entity.mutedIds as string[]),
			bannedIds: atom(entity.bannedIds as string[]),
			adminsIds: atom(entity.adminsIds as string[]),
			invites: atom(
				entity.invites.map(
					(invite: any) => EntityParser.publicUser(invite)
				) as PublicUser[],
			),
			messages: atom(
				entity.receiver.messages.map(
					async (message: any) => EntityParser.message(message, 'channel')
				) as Message[],
			),
			users: atom(
				entity.users.map(
					async (user: any) => EntityParser.publicUser(user)
				) as PublicUser[],
			),
		};
	},

	message: (entity: any, type: 'user' | 'channel'): Message => {
		return {
			id: entity.id,
			content: atom(entity.content as string),
			createDate: entity.createDate as Date,
			updateDate: atom(entity.updateDate as Date),
			sender: EntityParser.publicUser(entity.sender),
			receiver:
				type == 'channel' ?
				EntityParser.publicChannel(entity.receiver.parent) :
				EntityParser.publicUser(entity.receiver.parent)
		};
	}
}

export default EntityParser;