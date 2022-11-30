import PublicChannel from './public-channel.interface';
import User from './public-user.interface';
import Message from './message.interface';

export default interface Channel extends PublicChannel {
	owner: User;
	mutedIds: string[];
	bannedIds: string[];
	adminsIds: string[];
	invites: User[];
	messages: Message[];
	users: User[];
}