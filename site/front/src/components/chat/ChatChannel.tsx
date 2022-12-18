import { atom, useAtom } from "jotai";
import Channel from "../../com/interfaces/channel.interface";
import PublicChannel from "../../com/interfaces/public-channel.interface";
import useDatabase from "../../com/use-database";
import { ConvTypeAtom } from "./ChatBody";
import { CurrentConvAtom } from "./ChatCurrentConv";

export const CurrentChannelAtom = atom<Channel | null>(null);

const ChatChannel = ({ channel }: { channel: Channel }) => {
	const db = useDatabase();
	const [currentChannel, setCurrentChannel] = useAtom(CurrentChannelAtom);
	const [, setCurrentConv] = useAtom(CurrentConvAtom);
	const [, setConvType] = useAtom(ConvTypeAtom);

	const [name] = useAtom(channel.nameAtom);
	return (
		<li className='ChatChannel'>
			<p
				onClick={() => {
					setCurrentChannel(channel);
					setCurrentConv(null);
					setConvType('Channel');
				}}
				className='ChatChannelName'
				style={
					(currentChannel?.id || '') == channel.id ?
						{ color: 'white', backgroundColor: 'black' } :
						{ color: 'black', backgroundColor: 'white' }
				}
			>
				{name}
			</p>
		</li>
	);
}

export default ChatChannel;