import PublicChannel from "./public-channel.interface";
import PublicUser from "./public-user.interface";

export default interface Message {
	id: string;
	content: string;
	createDate: Date;
	updateDate: Date;
	sender: PublicUser;
	receiver: PublicUser | PublicChannel;
}
