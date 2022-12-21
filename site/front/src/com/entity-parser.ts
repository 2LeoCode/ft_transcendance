import Channel from './interfaces/channel.interface';
import Message, { ReceiverType } from './interfaces/message.interface';
import PublicChannel, { ChannelAccessibility, ChannelVisibility } from './interfaces/public-channel.interface';
import PublicUser from './interfaces/public-user.interface';
import Score from './interfaces/score.interface';
import User from './interfaces/user.interface';
import { atom } from 'jotai';
import Image from './interfaces/image.interface';

const EntityParser = {
	publicUser: (entity: any): PublicUser => {
		const publicUserNoAtom = {
			id: entity.id,
			nick: entity.nick,
			user42: entity.user42,
			online: entity.online,
			avatar: entity.avatar,
			inGame: false
		};
	

		return {
			...publicUserNoAtom,
			nickAtom: atom(publicUserNoAtom.nick as string),
			avatarAtom: atom(publicUserNoAtom.avatar as Image),
			onlineAtom: atom(publicUserNoAtom.online as boolean),
			inGameAtom: atom(publicUserNoAtom.inGame as boolean)
		};
	},

	publicChannel: (entity: any): PublicChannel => {
		const publicChannelNoAtom = {
			id: entity.id,
			name: entity.name,
			accessibility: entity.accessibility,
			visibility: entity.visibility,
		};

		return {
			...publicChannelNoAtom,
			nameAtom: atom(publicChannelNoAtom.name as string),
			accessibilityAtom: atom(publicChannelNoAtom.accessibility as ChannelAccessibility),
			visibilityAtom: atom(publicChannelNoAtom.visibility as ChannelVisibility)
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
			channelInvites: entity.channelInvites.map(
				(channel: any) => EntityParser.publicChannel(channel)
			),
			twoFactorEnabled: !!entity.twoFactorSecret,
		};

		return {
			...userNoAtom,
			blockedByAtom: atom(userNoAtom.blockedBy as PublicUser[]),
			blockedAtom: atom(userNoAtom.blocked as PublicUser[]),
			friendsAtom: atom(userNoAtom.friends as PublicUser[]),
			friendRequestsAtom: atom(userNoAtom.friendRequests as PublicUser[]),
			ownedChannelsAtom: atom(userNoAtom.ownedChannels as Channel[]),
			channelsAtom: atom(userNoAtom.channels as Channel[]),
			messagesInAtom: atom(userNoAtom.messagesIn as Message[]),
			messagesOutAtom: atom(userNoAtom.messagesOut as Message[]),
			scoresAtom: atom(userNoAtom.scores as Score[]),
			channelInvitesAtom: atom(userNoAtom.channelInvites as PublicChannel[]),
			twoFactorEnabledAtom: atom(userNoAtom.twoFactorEnabled as boolean)
		};
	},

	
	channel: (entity: any): Channel => {
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
			mutedIdsAtom: atom(channelNoAtom.mutedIds as string[]),
			bannedIdsAtom: atom(channelNoAtom.bannedIds as string[]),
			adminsIdsAtom: atom(channelNoAtom.adminsIds as string[]),
			invitesAtom: atom(channelNoAtom.invites as PublicUser[]),
			messagesAtom: atom(channelNoAtom.messages as Message[]),
			usersAtom: atom(channelNoAtom.users as PublicUser[])
		}
	},

	message: (entity: any): Message => {
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
			contentAtom: atom(messageNoAtom.content as string),
			updateDateAtom: atom(messageNoAtom.updateDate as Date)
		};
	}
}

export default EntityParser;