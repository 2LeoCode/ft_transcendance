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

const ChatCurrentChannel = () => {
	const [currentChannel] = useAtom(CurrentChannelAtom as Atom<Channel>);
	const [name] = useAtom(currentChannel.nameAtom);
	const [users] = useAtom(currentChannel.usersAtom);
	const [input, setInput] = useState('');
	const [messages, setMessages] = useAtom(currentChannel.messagesAtom);

	useEffect(() => {
		setMessages((prev) => prev.sort((a, b) => a.createDate < b.createDate ? -1 : 1))
	}, []);

	return (
		<div className='ChatCurrentChannel'>
			<div>
				<h2>{name}</h2>
				<button
					onClick={() => {
						ClientSocket.emit('leaveChannel', currentChannel.id);
					}}>Leave</button>
			</div>
			<div className='ChatChannelRight'>
				<h4>User List</h4>
				<ul className='ChatChannelUserList'>
					{users.map(user => <ChatChannelUser key={user.id} user={user} />)}
				</ul>
			</div>
			<ul>
				{messages.map((msg) => (
					<ChatChannelMessage key={msg.id} msg={msg} />
				))}
			</ul>
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
	);
}

export default ChatCurrentChannel;
