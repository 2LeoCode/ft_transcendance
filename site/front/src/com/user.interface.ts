import PublicUser from './public-user.interface';
import Message from './message.interface';
import Channel from './channel.interface';
import Score from './score.interface';
import Receiver from './receiver.interface';

// This class represents the current client.
export default interface User extends PublicUser {
	blockedBy: Promise<PublicUser[]>;
	blocked: Promise<PublicUser[]>;
	friends: Promise<PublicUser[]>;
	friendRequests: Promise<PublicUser[]>;
	ownedChannels: Promise<Channel[]>;
	channels: Promise<Channel[]>;
	messages: Promise<Message[]>;
	scores: Promise<Score[]>;
	receiver: Promise<Receiver>;
}
