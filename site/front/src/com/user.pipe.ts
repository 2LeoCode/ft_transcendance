import Channel from './channel.interface';
import ComPipe from './com.pipe';
import Message from './message.interface';
import PublicUser from './public-user.interface';
import Receiver from './receiver.interface';
import Score from './score.interface';
import User from './user.interface';

export default class UserPipe {
	constructor(
		private readonly comPipe: ComPipe,
		private readonly user: User
	) {}

	get id(): string { return this.user.id; }
	get user42(): string { return this.user.user42; }
	get avatarPath(): Promise<string> {
		return (async () => this.user.avatarPath)();
	}
	get blockedBy(): Promise<PublicUser[]> {
		return (async () => this.user.blockedBy)();
	}
	get blocked(): Promise<PublicUser[]> {
		return (async () => this.user.blocked)();
	}
	get friends(): Promise<PublicUser[]> {
		return (async () => this.user.friends)();
	}
	get friendRequests(): Promise<PublicUser[]> {
		return (async () => this.user.friendRequests)();
	}
	get ownedChannels(): Promise<Channel[]> {
		return (async () => this.user.ownedChannels)();
	}
	get channels(): Promise<Channel[]> {
		return (async () => this.user.channels)();
	}
	get messages(): Promise<Message[]> {
		return (async () => this.user.messages)();
	}
	get scores(): Promise<Score[]> {
		return (async () => this.user.scores)();
	}
	get receiver(): Promise<Receiver> {
		return (async () => this.user.receiver)();
	}
	get nick(): Promise<string> {
		return (async () => this.user.nick)();
	}
	get online(): Promise<boolean> {
		return (async () => this.user.online)();
	}

	set nick(newNick: Promise<string> | string) {
		this.user.nick = (async () => {
			await fetch(`${this.comPipe.backendHost}/update`, {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${this.comPipe.jwtToken}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ nick: newNick }),
			}).then(res => {
				if (!res.ok)
					throw new Error('Error while updating nick');
			});
			return newNick;
		})();
	}
	set online(status: Promise<boolean> | boolean) {
		this.user.online = (async () => {
			await fetch(`${this.comPipe.backendHost}/update`, {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${this.comPipe.jwtToken}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ online: status }),
			}).then(res => {
				if (!res.ok)
					throw new Error('Error while updating online status');
			});
			return status;
		})();
	}

	async updateAvatar(avatar: File): Promise<void> {
		// Generated with copilot
		const formData = new FormData();
		formData.append('avatar', avatar);
		await fetch(`${this.comPipe.backendHost}/update`, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${this.comPipe.jwtToken}`,
			},
			body: formData,
		}).then(res => {
			if (!res.ok)
				throw new Error('Error while updating avatar');
		});
	}

	async sendPrivMsg(otherId: string, content: string): Promise<void> {
		// ...
	}

	async deletePrivMsg(msgId: string): Promise<void> {
		// ...
	}

	async sendFriendRequest(otherId: string): Promise<void> {
		// ...
	}

	async acceptFriendRequest(otherId: string): Promise<void> {
		// ...
	}

	async deleteFriendRequest(otherId: string): Promise<void> {
		// ...
	}

	async deleteFriend(otherId: string): Promise<void> {
		// ...
	}

	async block(otherId: string): Promise<void> {
		// ...
	}

	async unblock(otherId: string): Promise<void> {
		// ...
	}

}