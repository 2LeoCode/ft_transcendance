import { useAtom } from "jotai";
import { useEffect } from "react";
import ClientSocket from "../../com/client-socket";
import EntityParser from "../../com/entity-parser";
import PublicUser from "../../com/interfaces/public-user.interface";
import useDatabase from "../../com/use-database";
import { ConvTypeAtom } from "./ChatBody";
import { CurrentChannelAtom } from "./ChatChannel";
import { ConvsAtom } from "./ChatConvList";
import { CurrentConvAtom, NullAtom } from "./ChatCurrentConv";
import { SelectedChannelAtom } from "./ChatPublicChannel";
import { CreateChannelAtom } from "./ChatChannelList";

const ChatSocket = () => {
	const db = useDatabase();

	const [, setMessagesIn] = useAtom(db.user.messagesInAtom);
	const [, setMessagesOut] = useAtom(db.user.messagesOutAtom);
	const [, setConvs] = useAtom(ConvsAtom);
	const [, setVisibleChannels] = useAtom(db.visibleChannelsAtom);
	const [, setMyChannels] = useAtom(db.user.ownedChannelsAtom);
	const [, setJoinedChannels] = useAtom(db.user.channelsAtom);
	const [, setCurrentChannel] = useAtom(CurrentChannelAtom);
	const [, setCurrentConv] = useAtom(CurrentConvAtom);
	const [, setConvType] = useAtom(ConvTypeAtom);
	const [, setSelectedChannel] = useAtom(SelectedChannelAtom);
	const [, setCreateChannel] = useAtom(CreateChannelAtom);

	const updateChannels = (channel: any) => {
		const res = EntityParser.channel(channel);

		setJoinedChannels(prev => [...prev.filter(chan => chan.id !== res.id), res]);
		if (res.owner.id === db.user.id)
			setMyChannels(prev => [...prev.filter(chan => chan.id !== res.id), res]);
		setCurrentChannel((prev) => (prev?.id === res.id) ? res : prev);
	};

	useEffect(() => {
		ClientSocket
			.on('recvPrivMsg', (msg) => {
				console.log('recvPrivMsg');
				const res = EntityParser.message(msg);

				setMessagesIn(prev => [...prev, res]);
				setConvs(prev => {
					const conv = prev.find(conv => conv.user.id === res.sender.id);

					if (conv) {
						conv.messages = [...conv.messages, EntityParser.message(msg)];
						return [...prev];
					}
					return [...prev, {
						user: res.sender,
						messages: [res]
					}];
				});
			})
			.on('sendPrivMsg', (msg) => {
				console.log('sendPrivMsg');
				const res = EntityParser.message(msg);

				setMessagesOut(prev => [...prev, res]);
				setConvs(prev => {
					const conv = prev.find(conv => conv.user.id === res.receiver.id);

					if (conv) {
						conv.messages = [...conv.messages, EntityParser.message(msg)];
						return [...prev];
					}
					return [...prev, {
						user: res.receiver as PublicUser,
						messages: [EntityParser.message(msg)]
					}];
				});
			})
			.on('privMsgError', (err) => {
				alert(err);
			})
			.on('createdChannel', (channel) => {
				console.log('createdChannel');
				const res = EntityParser.channel(channel);
			
				if (res.visibility == 'visible')
					setVisibleChannels(prev => [...prev, res]);
				setMyChannels(prev => [...prev, res]);
				setJoinedChannels(prev => [...prev, res]);
				setCurrentChannel(res);
				setConvType('Channel');
				setCurrentConv(null);
				setCreateChannel(false);
			})
			.on('newPublicChannel', (channel) => {
				console.log('newVisibleChannel');
				const res = EntityParser.publicChannel(channel);

				setVisibleChannels(prev => [...prev, res]);
			})
			.on('joinedChannel', (channel) => {
				console.log('joinedChannel');
				const res = EntityParser.channel(channel);
				setSelectedChannel(null);
				setJoinedChannels(prev => [...prev, res]);
				setCurrentChannel(res);
				setCurrentConv(null);
				setConvType('Channel');
			})
			.on('newUserOnChannel', (channel) => {
				console.log('newUserOnChannel');
				updateChannels(channel);
			})
			.on('sentChannelMsg', (channel) => {
				console.log('sentChannelMsg');
				updateChannels(channel)
			})
			.on('recvChannelMsg', (channel) => {
				console.log('recvChannelMsg');
				updateChannels(channel);
			})
			.on('chatError', (err) => {
				alert(err);
			})
			.on('leftChannel', (chan) => {
				console.log('leftChannel');
				//if (chan.owner.id === db.user.id) {
				//	setMyChannels(prev => [...prev.filter(ch => ch.id !== chan.id)]);
				//	setVisibleChannels(prev => [...prev.filter(ch => ch.id !== chan.id)]);
				//}
				setJoinedChannels(prev => [...prev.filter(ch => ch.id !== chan.id)]);
				setCurrentChannel(null);
				setCurrentConv(null);
				setConvType('User');
			})
			.on('userLeftChannel', (chan) => {
				console.log('userLeftChannel');
				const res = EntityParser.channel(chan);
	
				setJoinedChannels(prev => [...prev.filter(ch => ch.id !== res.id), res]);
				if (res.owner.id === db.user.id)
					setMyChannels(prev => [...prev.filter(ch => ch.id !== res.id), res]);
				setCurrentChannel((prev) => (prev?.id === res.id) ? res : prev);
			})
			.on('deletedChannel', (chanId: string) => {
				console.log('deletedChannel');
				setJoinedChannels(prev => [...prev.filter(ch => ch.id !== chanId)]);
				setMyChannels(prev => [...prev.filter(ch => ch.id !== chanId)]);
				setCurrentChannel(prev => {
					if (prev?.id === chanId) {
						setConvType('User');
						return null;
					}
					return prev;
				});
				setVisibleChannels(prev => [...prev.filter(ch => ch.id !== chanId)]);
				setSelectedChannel(null);
			})
			.on('muted', (channel) => {
				console.log('muted');
				updateChannels(channel);
			})
			.on('banned', (channel) => {
				console.log('banned');
				updateChannels(channel);
			})
			.on('gotMuted', (channel) => {
				alert(`You have been muted in channel ${channel.name}`);
			})
			.on('gotBanned', (channel) => {
				setJoinedChannels(prev => [...prev.filter(ch => ch.id !== channel.id)]);
				setCurrentChannel(prev => {
					if (prev?.id === channel.id) {
						setConvType('User');
						return null;
					}
					return prev;
				});
				alert(`You have been banned from channel ${channel.name}`);
			})
			.on('unmuted', (channel) => {
				updateChannels(channel);
			})
			.on('unbanned', (channel) => {
				updateChannels(channel);
			})
			.on('promoted', (channel) => {
				updateChannels(channel);
			})
			.on('demoted', (channel) => {
				updateChannels(channel);
			})
	}, []);
	return null;
}

export default ChatSocket;