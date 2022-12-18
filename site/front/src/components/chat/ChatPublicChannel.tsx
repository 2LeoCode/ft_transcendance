import { atom, useAtom } from "jotai";
import PublicChannel from "../../com/interfaces/public-channel.interface";
import useDatabase from "../../com/use-database";
import { ConvTypeAtom } from "./ChatBody";
import { CurrentConvAtom } from "./ChatCurrentConv";

export const SelectedChannelAtom = atom<PublicChannel | null>(null);

const ChatPublicChannel = ({ channel }: { channel: PublicChannel }) => {
	const db = useDatabase();
	const [currentChannel, setCurrentChannel] = useAtom(SelectedChannelAtom);
	const [, setCurrentConv] = useAtom(CurrentConvAtom);
	const [, setConvType] = useAtom(ConvTypeAtom);
	const [selectedChannel, setSelectedChannel] = useAtom(SelectedChannelAtom);

	const [name] = useAtom(channel.nameAtom);
	return (
		<li className='ChatChannel'>
			<p
				onClick={() => setSelectedChannel(channel)
					//{
					//setCurrentChannel(channel);
					//setCurrentConv(null);
					//setConvType('Channel');
					//}
				}
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

export default ChatPublicChannel;