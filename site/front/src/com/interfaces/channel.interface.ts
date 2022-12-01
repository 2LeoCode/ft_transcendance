import PublicChannel from './public-channel.interface';
import User from './interfaces/public-user.interface';
import Message from './message.interface';
import { Atom } from 'jotai';

export default interface Channel extends PublicChannel {
	owner: User;
	mutedIds: Atom<string[]>;
	bannedIds: Atom<string[]>;
	adminsIds: Atom<string[]>;
	invites: Atom<User[]>;
	messages: Atom<Message[]>;
	users: Atom<User[]>;
}