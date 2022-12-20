import ChatConvList, { ConvsAtom } from "./ChatConvList";
import ChatCurrentConv, { CurrentConvAtom } from "./ChatCurrentConv";
import ChatUserList, { FoundUsersAtom } from "./ChatUserList";
import ChatChannelList, { CreateChannelAtom } from "./ChatChannelList";
import { ReceiverType } from "../../com/interfaces/message.interface";
import { atom, useAtom } from "jotai";
import ChatCurrentChannel, { ChannelSettingsAtom } from "./ChatCurrentChannel";
import ChatCreateChannel from "./ChatCreateChannel";
import ChatFoundUser from "./ChatFoundUser";
import PublicUser from "../../com/interfaces/public-user.interface";
import { CurrentChannelAtom } from "./ChatChannel";
import ChatChannelSettings from "./ChatChannelSettings";

export const ConvTypeAtom = atom<ReceiverType>('User');



const ChatBody = () => {
	const [convType] = useAtom(ConvTypeAtom);
	const [convs, setConvs] = useAtom(ConvsAtom);
	const [, setCurrentConv] = useAtom(CurrentConvAtom);
	const [, setCurrentChannel] = useAtom(CurrentChannelAtom);
	const [, setConvType] = useAtom(ConvTypeAtom);
	const [foundUsers, setFoundUsers] = useAtom(FoundUsersAtom);
	const [createChannel] = useAtom(CreateChannelAtom);
	const [channelSettings] = useAtom(ChannelSettingsAtom);

	const startConv = (user: PublicUser) => {
		let conv = convs.find((conv) => conv.user.id == user.id);
		if (!conv) {
			conv = {
				user: user,
				messages: [],
			}
			setConvs([...convs, conv]);
		}
		setCurrentConv(conv);
		setCurrentChannel(null);
		setConvType('User');
	}

	return (
		<div className='ChatBody'>
  	  <ChatUserList startConv={startConv} />
			{
				convType === 'Channel' ?
					<ChatCurrentChannel /> :
					<ChatCurrentConv />
			}
			<ChatConvList />
  	  <ChatChannelList />
			{createChannel && <ChatCreateChannel />}
			{!!foundUsers.length && (
					<div className='ChatFoundUsers'>
						<h3>Found users</h3>
						<ul className='ChatFoundUserList'>
							{foundUsers.map((usr) => (
								<ChatFoundUser
									key={usr.id}
									usr={usr}
									startConv={startConv} />
							))}
						</ul>
						<button
							onClick={() => setFoundUsers([])}
						>
							Back
						</button>
					</div>
				)}
			{channelSettings && <ChatChannelSettings />}
  	</div>
	);
}

export default ChatBody;