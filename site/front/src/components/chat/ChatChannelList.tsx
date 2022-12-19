import { atom, useAtom } from "jotai";
import { useState } from "react";
import ClientSocket from "../../com/client-socket";
import useDatabase from "../../com/use-database";
import ChatChannel from "./ChatChannel";
import { NullAtom } from "./ChatCurrentConv";
import ChatPublicChannel, { SelectedChannelAtom } from "./ChatPublicChannel";
import ChatChannelInvite from "./ChatChannelInvite";

export const CreateChannelAtom = atom<boolean>(false);

const ChatChannelList = () => {
	const db = useDatabase();
	const [visibleChannels] = useAtom(db.visibleChannelsAtom);
	const [, setCreateChannel] = useAtom(CreateChannelAtom);
	const [myChannels] = useAtom(db.user.ownedChannelsAtom);
	const [joinedChannels] = useAtom(db.user.channelsAtom);
	const [selectedChannel] = useAtom(SelectedChannelAtom);
	const [channelInvites] = useAtom(db.user.channelInvitesAtom);

	return (
		<div className='ChatBodyUsers'>
			<h2>My Channels</h2>
			<ul className="ChatChannelList">
				{
					myChannels.map((channel) =>
						<ChatChannel
							key={channel.id}
							channel={channel} />)
				}
			</ul>
			<h2>Joined Channels</h2>
			<ul className="ChatChannelList">
				{
					joinedChannels.map((channel) =>
						<ChatChannel
							key={channel.id}
							channel={channel} />)
				}
			</ul>
			<h2>Channel Invites</h2>
			<ul className="ChatChannelList">
				{
					channelInvites.map((channel) =>
						<ChatChannelInvite
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