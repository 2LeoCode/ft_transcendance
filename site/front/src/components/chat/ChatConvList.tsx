import { atom, useAtom } from "jotai";
import { useEffect, useState } from "react";
import PublicUser from "../../com/interfaces/public-user.interface";
import useDatabase from "../../com/use-database";
import ChatConv from "./ChatConv";
import { Conv } from "./ChatConv";
import ClientSocket from "../../com/client-socket";
import ChatPublicChannel, { SelectedChannelAtom } from "./ChatPublicChannel";
import { NullAtom } from "./ChatCurrentConv";
import swal from "sweetalert";
import Swal from "sweetalert2";

export const ConvsAtom = atom([] as Conv[]);

const ChatConvList = () => {
	const db = useDatabase();
  const [convs, setConvs] = useAtom(ConvsAtom);
	const [visibleChannels, setVisibleChannels] = useAtom(db.visibleChannelsAtom);
	const [selectedChannel, setSelectedChannel] = useAtom(SelectedChannelAtom);
	const [inputChannelName, setInputChannelName] = useState('');
	const [inputChannelPassword, setInputChannelPassword] = useState('');
	const [channelName] = useAtom(selectedChannel?.nameAtom || NullAtom);

	useEffect(() => {
		setConvs((() => {
			const convs = db.user.messagesIn
				.filter(msg => msg.receiverType === 'User')
				.map(msg => ({
					user: msg.sender,
					messages: [msg]
				}))
				.reduce((acc, conv) => {
					const found = acc.find(c => c.user.id === conv.user.id);
					if (found)
						found.messages.push(...conv.messages);
					else
						acc.push(conv);
					return acc;
				}, [] as Conv[]);
			db.user.messagesOut
				.filter(msg => msg.receiverType === 'User')
				.forEach(msg => {
					const conv = convs.find(conv => conv.user.id === msg.receiver.id);
					if (conv) {
						conv.messages.push(msg);
					} else {
						convs.push({
							user: msg.receiver as PublicUser,
							messages: [msg]
						});
					}
				});
			return convs.map(conv => ({
				...conv,
				messages: conv.messages.sort((a, b) => a.createDate < b.createDate ? -1 : 1)
			}));
		})());
	}, []);

  return (
    <div className="ChatBodyUsers">
      <h2>Conversations</h2>
      <ul className='ChatUserList'>
        {convs.map((conv, tamere) => <ChatConv key={tamere} conv={conv} />)}
      </ul>

			<h2>Visible Channels</h2>
			<ul className='ChatChannelList'>
				{
					visibleChannels.map((channel) =>
						<ChatPublicChannel
							key={channel.id}
							channel={channel} />)
				}
			</ul>
			{selectedChannel && (
				<div>
					<form
						onSubmit={
							(e) => {
								e.preventDefault();
								ClientSocket.emit('joinChannel', channelName, inputChannelPassword);
								setInputChannelPassword('');
							}
						}>
						<input
							type='password'
							value={inputChannelPassword}
							onChange={
								(e) => {
									e.preventDefault();
									setInputChannelPassword(e.target.value);
								}
							} />
						<input type='submit' value='Join' />
					</form>
				</div>
			)}
			<h2>Join Channel</h2>
			<form onSubmit={(e) => {
				e.preventDefault();
				if (inputChannelName === '') {
					Swal.fire({
          	icon: 'error',
          	text: "Channel name cannot be empty",
        	});
					return ;
				}
				ClientSocket.emit('joinChannel', inputChannelName, inputChannelPassword);
				setInputChannelName('');
				setInputChannelPassword('');
			}}>
				<input
					type="text"
					placeholder="name"
					value={inputChannelName}
					onChange={e => setInputChannelName(e.target.value)} />
				<input
					type='password'
					placeholder="password"
					value={inputChannelPassword}
					onChange={e => setInputChannelPassword(e.target.value)} />
				<input type="submit" value="Join" />
			</form>
    </div>
  );
}

export default ChatConvList;