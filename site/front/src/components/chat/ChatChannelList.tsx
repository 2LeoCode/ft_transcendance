import { atom, useAtom } from "jotai";
import { useState } from "react";
import ClientSocket from "../../com/client-socket";
import useDatabase from "../../com/use-database";
import ChatChannel from "./ChatChannel";
import { NullAtom } from "./ChatCurrentConv";
import ChatPublicChannel, { SelectedChannelAtom } from "./ChatPublicChannel";

export const CreateChannelAtom = atom<boolean>(false);

const ChatChannelList = () => {
	const db = useDatabase();
	const [visibleChannels] = useAtom(db.visibleChannelsAtom);
	const [, setCreateChannel] = useAtom(CreateChannelAtom);
	const [myChannels] = useAtom(db.user.ownedChannelsAtom);
	const [joinedChannels] = useAtom(db.user.channelsAtom);
	const [selectedChannel] = useAtom(SelectedChannelAtom);
	const [inputChannelPassword, setInputChannelPassword] = useState<string>('');
	const [channelName] = useAtom(selectedChannel?.nameAtom || NullAtom);

	return (
		<div className='ChatBodyChannels'>
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
			<h2>My Channels</h2>
			<ul>
				{
					myChannels.map((channel) =>
						<ChatChannel
							key={channel.id}
							channel={channel} />)
				}
			</ul>
			<h2>Joined Channels</h2>
			<ul>
				{
					joinedChannels.map((channel) =>
						<ChatChannel
							key={channel.id}
							channel={channel} />)
				}
			</ul>
			<button
				onClick={() => setCreateChannel(true)}
			>
				Create Channel
			</button>
		</div>
	);
};

export default ChatChannelList;