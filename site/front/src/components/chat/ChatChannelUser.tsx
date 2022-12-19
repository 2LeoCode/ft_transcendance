import { atom, useAtom } from "jotai";
import Channel from "../../com/interfaces/channel.interface";
import PublicUser from "../../com/interfaces/public-user.interface";
import { CurrentChannelAtom } from "./ChatChannel";
import { Fragment } from "react";
import useDatabase from "../../com/use-database";
import ClientSocket from "../../com/client-socket";
import { Atom } from "../../com/types/atom.type";

const SelectedChannelUserAtom = atom(null as PublicUser | null);

const ChatChannelUser = ({ user }: { user: PublicUser }) => {
	const db = useDatabase();
	const [nickName] = useAtom(user.nickAtom);
	const [channel] = useAtom(CurrentChannelAtom as Atom<Channel>);
	const [admins] = useAtom(channel?.adminsIdsAtom || atom([]));
	const [selectedChannelUser, setSelectedChannelUser] = useAtom(SelectedChannelUserAtom);

	return (
		<li key={user.id}>
			<p
				onClick={() => {
					setSelectedChannelUser(user);
				}}
				className="ChatUserName">{
				admins.find(
					(adminId) => adminId == user.id
				) && '[Admin]'
			}{nickName} (alias {user.user42})</p>
			{selectedChannelUser?.id == user.id && (
				<Fragment>
					{
						admins.find(id => id == db.user.id) &&
						!admins.find(id => id == user.id) && (
							<Fragment>
								<button
									onClick={() => {
										let seconds = -1;
										while (seconds < 0) {
											const tmp = prompt('How many seconds?', '0');
											if (!isNaN(Number(tmp)))
												seconds = Number(tmp);
										}
										ClientSocket.emit('mute', channel.id, user.id, seconds);
									}}
								>Mute</button>
								<button
									onClick={() => {
										let seconds = -1;
										while (seconds < 0) {
											const tmp = prompt('How many seconds?', '0');
											if (!isNaN(Number(tmp)))
												seconds = Number(tmp);
										}
										ClientSocket.emit('ban', channel.id, user.id, seconds);
									}}
								>Ban</button>
							</Fragment>
						)
					}
					{
						channel.owner.id === db.user.id && db.user.id !== user.id &&
						(admins.find(id => id == user.id) ? (
							<Fragment>
								<button
									onClick={() => {
										ClientSocket.emit('demote', channel.id, user.id);
									}}
								>Demote</button>
							</Fragment>
						) : (
							<Fragment>
								<button
									onClick={() => {
										ClientSocket.emit('promote', channel.id, user.id);
									}}
								>Promote</button>
							</Fragment>
						))
					}
				</Fragment>
			)}
		</li>
	)
}

export default ChatChannelUser;
