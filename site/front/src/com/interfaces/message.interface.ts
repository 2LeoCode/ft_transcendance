import { Atom } from "jotai";
import PublicChannel from "./public-channel.interface";
import PublicUser from "./public-user.interface";

export default interface Message {
	id: string;
	content: Atom<string>;
	createDate: Date;
	updateDate: Atom<Date>;
	sender: PublicUser;
	receiver: PublicUser | PublicChannel;
}