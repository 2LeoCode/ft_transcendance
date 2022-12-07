import PublicUser from './public-user.interface';
import Message from './message.interface';
import Channel from './channel.interface';
import Score from './score.interface';
import { Atom } from '../types/atom.type';

// This class represents the current client.
export default interface User extends PublicUser {
	blockedBy: PublicUser[];
	blocked: PublicUser[];
	friends: PublicUser[];
	friendRequests: PublicUser[];
	ownedChannels: Channel[];
	channels: Channel[];
	messagesIn: Message[];
	messagesOut: Message[];
	scores: Score[];

	blockedByAtom: Atom<PublicUser[]>;
	blockedAtom: Atom<PublicUser[]>;
	friendsAtom: Atom<PublicUser[]>;
	friendRequestsAtom: Atom<PublicUser[]>;
	ownedChannelsAtom: Atom<Channel[]>;
	channelsAtom: Atom<Channel[]>;
	messagesInAtom: Atom<Message[]>;
	messagesOutAtom: Atom<Message[]>;
	scoresAtom: Atom<Score[]>;
}
