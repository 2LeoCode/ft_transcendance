import PublicChannel from './public-channel.interface';
import Message from './message.interface';
import { Atom } from '../types/atom.type';
import PublicUser from './public-user.interface';

export default interface Channel extends PublicChannel {
	owner: PublicUser;
	mutedIds: string[];
	bannedIds: string[];
	adminsIds: string[];
	invites: PublicUser[];
	messages: Message[];
	users: PublicUser[];

	mutedIdsAtom: Atom<string[]>;
	adminsIdsAtom: Atom<string[]>;
	bannedIdsAtom: Atom<string[]>;
	invitesAtom: Atom<PublicUser[]>;
	messagesAtom: Atom<Message[]>;
	usersAtom: Atom<PublicUser[]>;
}