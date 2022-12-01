import Channel from '../interfaces/channel.interface';
import ComPipe from './com.pipe';
import EntityParser from '../entity-parser';
import Message from '../interfaces/message.interface';
import PublicUser from '../interfaces/public-user.interface';
import Score from '../interfaces/score.interface';
import User from '../interfaces/user.interface';
import PublicUserPipe from './public-user-pipe';

export default class UserPipe extends PublicUserPipe {
	constructor(
		private readonly user: User,
	) { super(user); }

	get blockedBy(): PublicUser[] {
		return this.user.blockedBy[0];
	}
	private set blockedBy(newBlockedBy: PublicUser[]) {
		this.user.blockedBy[1](newBlockedBy);
	}

	get blocked(): PublicUser[] {
		return this.user.blocked[0];
	}
	private set blocked(newBlocked: PublicUser[]) {
		this.user.blocked[1](newBlocked);
	}

	get friends(): PublicUser[] {
		return this.user.friends[0];
	}
	private set friends(newFriends: PublicUser[]) {
		this.user.friends[1](newFriends);
	}

	get friendRequests(): PublicUser[] {
		return this.user.friendRequests[0];
	}
	private set friendRequests(newFriendRequests: PublicUser[]) {
		this.user.friendRequests[1](newFriendRequests);
	}

	get ownedChannels(): Channel[] {
		return this.user.ownedChannels[0];
	}
	private set ownedChannels(newOwnedChannels: Channel[]) {
		this.user.ownedChannels[1](newOwnedChannels);
	}

	get channels(): Channel[] {
		return this.user.channels[0];
	}
	private set channels(newChannels: Channel[]) {
		this.user.channels[1](newChannels);
	}

	get messagesIn(): Message[] {
		return this.user.messagesIn[0];
	}
	private set messagesIn(newMessagesIn: Message[]) {
		this.user.messagesIn[1](newMessagesIn);
	}

	get messagesOut(): Message[] {
		return this.user.messagesOut[0];
	}
	private set messagesOut(newMessagesOut: Message[]) {
		this.user.messagesOut[1](newMessagesOut);
	}

	get scores(): Score[] {
		return this.user.scores[0];
	}
	private set scores(newScores: Score[]) {
		this.user.scores[1](newScores);
	}

	get nick(): string {
		return this.user.nick[0];
	}
	set nick(newNick: string) {
		(async () => {
			await fetch(`${ComPipe.serverHost}/update`, {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${ComPipe.jwtToken}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ nick: newNick }),
			}).then(res => {
				if (!res.ok)
					throw new Error('Error while updating nick');
			});
			this.user.nick[1](newNick);
		})();
	}

	set online(status: boolean) {
		(async () => {
			await fetch(`${ComPipe.serverHost}/update`, {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${ComPipe.jwtToken}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ online: status }),
			}).then(res => {
				if (!res.ok)
					throw new Error('Error while updating online status');
			});
			this.user.online[1](status);
		})();
	}

	updateAvatar(avatar: File): void {
		// ...
	}

	sendPrivMsg(otherId: string, content: string): void {
		(async () => {
			const tmp = [...this.messagesOut];
			tmp.push(
				await fetch(`${ComPipe.serverHost}/message`, {
					method: 'PUT',
					headers: {
						'Authorization': `Bearer ${ComPipe.jwtToken}`,
						'Content-Type': 'application/json'
					},
					body: JSON.stringify([otherId, content])
				}).then(async res => {
      		if (!res.ok)
      		  throw new Error('Error while sending a private message');
					return EntityParser.message(await res.json(), 'user');
    		})
			);
			this.messagesOut = tmp;
		})();
	}

	deletePrivMsg(msgId: string): void {
		(async () => {
			await fetch(`${ComPipe.serverHost}/message`, {
				method: 'DELETE',
				headers: {
					'Authorization': `Bearer ${ComPipe.jwtToken}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify([msgId])
			}).then(res => {
				if (!res.ok)
					throw new Error('Error while deleting a private message');
			});
			this.messagesOut = this.messagesOut.filter(msg => msg.id !== msgId);
		})();
	}

	sendFriendRequest(otherId: string): void {
		// ...
	}

	acceptFriendRequest(otherId: string): void {
		// ...
	}

	deleteFriendRequest(otherId: string): void {
		// ...
	}

	deleteFriend(otherId: string): void {
		// ...
	}

	block(otherId: string): void {
		// ...
	}

	unblock(otherId: string): void {
		// ...
	}

}