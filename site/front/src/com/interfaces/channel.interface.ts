import PublicChannel from './public-channel.interface';
import Message from './message.interface';
import { Atom } from 'jotai';
import PublicUser from './public-user.interface';

export default interface Channel extends PublicChannel {
	owner: PublicUser;
	mutedIds: Atom<string[]>;
	bannedIds: Atom<string[]>;
	adminsIds: Atom<string[]>;
	invites: Atom<PublicUser[]>;
	messages: Atom<Message[]>;
	users: Atom<PublicUser[]>;
}