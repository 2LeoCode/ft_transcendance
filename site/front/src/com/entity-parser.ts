import Channel from './interfaces/channel.interface';
import Message from './interfaces/message.interface';
import PublicChannel, { ChannelAccessibility, ChannelVisibility } from './interfaces/public-channel.interface';
import PublicUser from './interfaces/public-user.interface';
import Score from './interfaces/score.interface';
import User from './interfaces/user.interface';
import { atom } from 'jotai';

const EntityParser = {
	publicUser: (entity: any): PublicUser => {
		const pubUser = {
			id: entity.id,
			nick: entity.nick,
			user42: entity.user42,
			avatarPath: entity.avatarPath,
			online: entity.online,
			nickAtom: atom(entity.nick),
			avatarPathAtom: atom(entity.avatarPath),
			onlineAtom: atom(entity.online)
		} as PublicUser;
		return pubUser;
	},

	publicChannel: (entity: any): PublicChannel => {
		const pubChannel = {
			id: entity.id,
			name: entity.name,
			password: entity.password,
			accessibility: entity.accessibility,
			visibility: entity.visibility,
			nameAtom: atom(entity.name),
			passwordAtom: atom(entity.password),
			accessibilityAtom: atom(entity.accessibility),
			visibilityAtom: atom(entity.visibility)
		} as PublicChannel;
		return pubChannel;
	},

	score: (entity: any): Score => ({
		id: entity.id,
		playerScore: entity.playerScore,
		enemyScore: entity.enemyScore,
		date: entity.date,
		user: EntityParser.publicUser(entity.user)
	}),

	user: (entity: any): User => {
		const usr = {
			...EntityParser.publicUser(entity),
			blockedBy: entity.blockedBy.map(
				(user: any) => EntityParser.publicUser(user)
			),
			blocked: entity.blocked.map(
				(user: any) => EntityParser.publicUser(user)
			),
			friends: entity.friends.map(
				(friend: any) => EntityParser.publicUser(friend)
			),
			friendRequests: entity.friendRequests.map(
				(friendRequest: any) => EntityParser.publicUser(friendRequest)
			),
			ownedChannels: entity.ownedChannels.map(
				(channel: any) => EntityParser.channel(channel)
			),
			channels: entity.channels.map(
				(channel: any) => EntityParser.channel(channel)
			),
			messagesIn: entity.receiver.messages.map(
				(message: any) => EntityParser.message(message, 'user')
			),
			messagesOut: entity.messages.map(
				(message: any) => EntityParser.message(message, 'user')
			),
			scores: entity.scores.map(
				(score: any) => EntityParser.score(score)
			),
		} as User;

		Object.defineProperties(usr, {
			blockedByAtom: {
				value: atom(usr.blockedBy)
			},
			blockedAtom: {
				value: atom(usr.blocked)
			},
			friendsAtom: {
				value: atom(usr.friends)
			},
			friendRequestsAtom: {
				value: atom(usr.friendRequests)
			},
			ownedChannelsAtom: {
				value: atom(usr.ownedChannels)
			},
			channelsAtom: {
				value: atom(usr.channels)
			},
			messagesInAtom: {
				value: atom(usr.messagesIn)
			},
			messagesOutAtom: {
				value: atom(usr.messagesOut)
			},
			scoresAtom: {
				value: atom(usr.scores)
			},
		});
		return usr;
	},

	
	channel: (entity: any): Channel => {
		const cha = {
			...EntityParser.publicChannel(entity),
			owner: EntityParser.publicUser(entity.owner),
			mutedIds: entity.mutedIds,
			bannedIds: entity.bannedIds,
			adminsIds: entity.adminsIds,
			invites: entity.invites.map(
				(invite: any) => EntityParser.publicUser(invite)
			),
			messages: entity.receiver.messages.map(
				(message: any) => EntityParser.message(message, 'channel')
			),
			users: entity.users.map(
				(user: any) => EntityParser.publicUser(user)
			),
			mutedIdsAtom: atom(entity.mutedIds),
			bannedIdsAtom: atom(entity.bannedIds),
			adminsIdsAtom: atom(entity.adminsIds),
			invitesAtom: entity.invites.map(
				(invite: any) => EntityParser.publicUser(invite)
			),
			messagesAtom: entity.receiver.messages.map(
				(message: any) => EntityParser.message(message, 'channel')
			),
			usersAtom: entity.users.map(
				(user: any) => EntityParser.publicUser(user)
			),
		} as Channel;
		return cha;
	},

	message: (entity: any, type: 'user' | 'channel'): Message => {
		const msg = {
			id: entity.id,
			content: entity.content as string,
			createDate: entity.createDate as Date,
			updateDate: entity.updateDate as Date,
			sender: EntityParser.publicUser(entity.sender),
			receiver:
				type === 'channel' ?
				EntityParser.publicChannel(entity.receiver.parentChannel) :
				EntityParser.publicUser(entity.receiver.parentUser)
		} as Message;

		Object.defineProperties(msg, {
			contentAtom: {
				value: atom(msg.content)
			},
			updateDateAtom: {
				value: atom(msg.updateDate)
			},
		});
		return msg;
	}
}

export default EntityParser;