import { Atom } from '../types/atom.type';
import PublicChannel from "./public-channel.interface";
import PublicUser from "./public-user.interface";

export type ReceiverType = 'User' | 'Channel';

export default interface Message {
	id: string;
	content: string;
	createDate: Date;
	updateDate: Date;
	senderId: string;
	receiverId: string;
	receiverType: ReceiverType;
	contentAtom: Atom<string>;
	updateDateAtom: Atom<Date>;
}
