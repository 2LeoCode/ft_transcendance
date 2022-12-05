import PublicUser from './public-user.interface';
import Message from './message.interface';
import Channel from './channel.interface';
import Score from './score.interface';
import { Atom } from 'jotai';

// This class represents the current client.
export default interface User extends PublicUser {
	blockedBy: Atom<PublicUser[]>;
	blocked: Atom<PublicUser[]>;
	friends: Atom<PublicUser[]>;
	friendRequests: Atom<PublicUser[]>;
	ownedChannels: Atom<Channel[]>;
	channels: Atom<Channel[]>;
	messagesIn: Atom<Message[]>;
	messagesOut: Atom<Message[]>;
	scores: Atom<Score[]>;
}
