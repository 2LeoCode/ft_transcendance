import Channel from './interfaces/channel.interface';
import Message, { ReceiverType } from './interfaces/message.interface';
import PublicChannel, { ChannelAccessibility, ChannelVisibility } from './interfaces/public-channel.interface';
import PublicUser from './interfaces/public-user.interface';
import Score from './interfaces/score.interface';
import User from './interfaces/user.interface';
import { atom } from 'jotai';

const EntityParser = {
	publicUser: (entity: any): PublicUser => {
		const publicUserNoAtom = {
			id: entity.id,
			nick: entity.nick,
			user42: entity.user42,
			avatarPath: entity.avatarPath,
			online: entity.online
		};

		return {
			...publicUserNoAtom,
			nickAtom: atom(publicUserNoAtom.nick),
			avatarPathAtom: atom(publicUserNoAtom.avatarPath),
			onlineAtom: atom(publicUserNoAtom.online)
		};
	},

	publicChannel: (entity: any): PublicChannel => {
		const publicChannelNoAtom = {
			id: entity.id,
			name: entity.name,
			password: entity.password,
			accessibility: entity.accessibility,
			visibility: entity.visibility,
		};

		return {
			...publicChannelNoAtom,
			nameAtom: atom(publicChannelNoAtom.name),
			passwordAtom: atom(publicChannelNoAtom.password),
			accessibilityAtom: atom(publicChannelNoAtom.accessibility),
			visibilityAtom: atom(publicChannelNoAtom.visibility)
		};
	},

	score: (entity: any): Score => ({
		id: entity.id,
		playerScore: entity.playerScore,
		enemyScore: entity.enemyScore,
		date: entity.date,
		user: EntityParser.publicUser(entity.user)
	}),

	user: (entity: any): User => {
		//console.log('Got', entity);
		const userNoAtom = {
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
				(message: any) => EntityParser.message(message)
			),
			messagesOut: entity.messages.map(
				(message: any) => EntityParser.message(message)
			),
			scores: entity.scores.map(
				(score: any) => EntityParser.score(score)
			),
		};

		return {
			...userNoAtom,
			blockedByAtom: atom(userNoAtom.blockedBy),
			blockedAtom: atom(userNoAtom.blocked),
			friendsAtom: atom(userNoAtom.friends),
			friendRequestsAtom: atom(userNoAtom.friendRequests),
			ownedChannelsAtom: atom(userNoAtom.ownedChannels),
			channelsAtom: atom(userNoAtom.channels as Channel[]),
			messagesInAtom: atom(userNoAtom.messagesIn as Message[]),
			messagesOutAtom: atom(userNoAtom.messagesOut as Message[]),
			scoresAtom: atom(userNoAtom.scores)
		};
	},

	
	channel: (entity: any): Channel => {
		//console.log('Channel', entity)
		const channelNoAtom = {
			...EntityParser.publicChannel(entity),
			owner: EntityParser.publicUser(entity.owner),
			mutedIds: entity.mutedIds,
			bannedIds: entity.bannedIds,
			adminsIds: entity.adminsIds,
			invites: entity.invites.map(
				(invite: any) => EntityParser.publicUser(invite)
			),
			messages: entity.receiver.messages.map(
				(message: any) => EntityParser.message(message)
			),
			users: entity.users.map(
				(user: any) => EntityParser.publicUser(user)
			)
		};

		return {
			...channelNoAtom,
			mutedIdsAtom: atom(channelNoAtom.mutedIds),
			bannedIdsAtom: atom(channelNoAtom.bannedIds),
			adminsIdsAtom: atom(channelNoAtom.adminsIds),
			invitesAtom: atom(channelNoAtom.invites),
			messagesAtom: atom(channelNoAtom.messages),
			usersAtom: atom(channelNoAtom.users)
		}
	},

	message: (entity: any): Message => {
		//console.log('Got message', entity);
		const messageNoAtom = {
			id: entity.id,
			content: entity.content as string,
			createDate: entity.createDate as Date,
			updateDate: entity.updateDate as Date,
			sender: EntityParser.publicUser(entity.sender),
			receiver:
				entity.receiver.type === 'Channel' ?
					EntityParser.publicChannel(entity.receiver.parentChannel) :
					EntityParser.publicUser(entity.receiver.parentUser),
			receiverType: entity.receiver.type as ReceiverType
		};

		return {
			...messageNoAtom,
			contentAtom: atom(messageNoAtom.content),
			updateDateAtom: atom(messageNoAtom.updateDate)
		};
	}
}

export default EntityParser;