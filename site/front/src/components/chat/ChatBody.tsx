import ChatConvList from "./ChatConvList";
import ChatCurrentConv, { CurrentConvAtom } from "./ChatCurrentConv";
import ChatUserList from "./ChatUserList";
import ChatChannelList, { CreateChannelAtom } from "./ChatChannelList";
import { ReceiverType } from "../../com/interfaces/message.interface";
import { atom, useAtom } from "jotai";
import ChatCurrentChannel from "./ChatCurrentChannel";
import ChatCreateChannel from "./ChatCreateChannel";

export const ConvTypeAtom = atom<ReceiverType>('User');

const ChatBody = () => {
	const [convType] = useAtom(ConvTypeAtom);
	const [createChannel] = useAtom(CreateChannelAtom);

	return (
		<div className='ChatBody'>
  	  <ChatUserList />
			{
				convType === 'Channel' ?
					<ChatCurrentChannel /> :
					<ChatCurrentConv />
			}
			<ChatConvList />
  	  <ChatChannelList />
			{createChannel && <ChatCreateChannel />}
  	</div>
	);
}

export default ChatBody;
