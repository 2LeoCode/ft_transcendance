import { atom, useAtom } from "jotai";
import { useEffect, useState } from "react";
import ClientSocket from "../../com/client-socket";
import Channel from "../../com/interfaces/channel.interface";
import Message from "../../com/interfaces/message.interface";
import PublicUser from "../../com/interfaces/public-user.interface";
import { Atom } from "../../com/types/atom.type";
import useDatabase from "../../com/use-database";
import { CurrentChannelAtom } from "./ChatChannel";
import ChatChannelMessage from "./ChatChannelMessage";
import ChatChannelUser from "./ChatChannelUser";
import { textAlign } from "@mui/system";

export const ChannelSettingsAtom = atom(null as Channel | null);

const ChatCurrentChannel = () => {
	const db = useDatabase();
	const [currentChannel] = useAtom(CurrentChannelAtom as Atom<Channel>);
	const [name] = useAtom(currentChannel.nameAtom);
	const [users] = useAtom(currentChannel.usersAtom);
	const [input, setInput] = useState('');
	const [messages, setMessages] = useAtom(currentChannel.messagesAtom);
	const [, setChannelSettings] = useAtom(ChannelSettingsAtom);
	const [blockedUsers] = useAtom(db.user.blockedAtom);

	useEffect(() => {
		setMessages((prev) => prev.sort((a, b) => a.createDate < b.createDate ? -1 : 1))
	}, []);

	return (
		<div className='ChatCurrentChannel'>
			<h2 style={{textAlign: 'center'}}>Channel</h2>
			<div className='ChatChannelHeader'>
				<div>
					<h3>{name}</h3>
					<button
						onClick={() => {
							ClientSocket.emit('leaveChannel', currentChannel.id);
						}}>Leave</button>
					{currentChannel.owner.id === db.user.id && (
						<button
							onClick={() => setChannelSettings(currentChannel)}
						>
							Settings
						</button>
					)}
				</div>
				<div>
					<h2>User List</h2>
					<ul className='ChatUserList'>
						{users.map(user => <ChatChannelUser key={user.id} user={user} />)}
					</ul>
				</div>
			</div>
			<ul className="ChatMessages">
				{messages
					.filter((msg) => !blockedUsers.find((user) => user.id === msg.sender.id))
					.map((msg) => (
						<ChatChannelMessage key={msg.id} msg={msg} />
					))
					.reverse()}
			</ul>
			<div className='ChatFooter'>
				<form onSubmit={(e) => {
					e.preventDefault();
					ClientSocket.emit('channelMsg', currentChannel.id, input);
					setInput('');
				}}>
					<input
						type='text'
						value={input}
						onChange={(e) => {
							e.preventDefault();
							setInput(e.target.value);
						}} />
					<input type='submit' value='Send' />
				</form>
			</div>
		</div>
	);
}

export default ChatCurrentChannel;
