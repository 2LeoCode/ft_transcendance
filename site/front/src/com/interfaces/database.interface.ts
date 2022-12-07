import { Atom } from '../types/atom.type';
import PublicChannel from "./public-channel.interface";
import PublicUser from "./public-user.interface";
import User from "./user.interface";

export default interface Database {
	user: User,
	visibleChannels: PublicChannel[],
	onlineUsers: PublicUser[],

	visibleChannelsAtom: Atom<PublicChannel[]>,
	onlineUsersAtom: Atom<PublicUser[]>,
}
