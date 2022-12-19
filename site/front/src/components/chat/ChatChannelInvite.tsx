import { atom, useAtom } from "jotai";
import PublicChannel from "../../com/interfaces/public-channel.interface";
import { Fragment } from "react";
import ClientSocket from "../../com/client-socket";
import useDatabase from "../../com/use-database";

const SelectedInviteAtom = atom(null as PublicChannel | null);

const ChatChannelInvite = ({ channel }: { channel: PublicChannel }) => {
	const db = useDatabase();
	const [name] = useAtom(channel.nameAtom);
	const [selectedInvite, setSelectedInvite] = useAtom(SelectedInviteAtom)
	const [, setChannelInvites] = useAtom(db.user.channelInvitesAtom);

	return (
		<li
			onClick={() => setSelectedInvite(channel)}>
			<p>{name}</p>
			{selectedInvite?.id == channel.id && (
				<Fragment>
					<button
						onClick={() => {
							ClientSocket.emit('acceptChannelInvite', channel.id);
							setSelectedInvite(null);
							setChannelInvites(prev => [...prev.filter(ch => ch.id !== channel.id)]);
						}}>Accept</button>
					<button
						onClick={() => {
							ClientSocket.emit('declineChannelInvite', channel.id);
							setSelectedInvite(null);
							setChannelInvites(prev => [...prev.filter(ch => ch.id !== channel.id)]);
						}}>Decline</button>
				</Fragment>
			)}
		</li>
	);
}

export default ChatChannelInvite;