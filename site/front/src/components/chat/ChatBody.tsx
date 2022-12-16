import ChatConvList from "./ChatConvList";
import ChatCurrentConv from "./ChatCurrentConv";
import ChatUserList from "./ChatUserList";
import ChatChannelList from "./ChatChannelList";

const ChatBody = () => (
	<div className='ChatBody'>
    <ChatUserList />
		<ChatCurrentConv />
		<ChatConvList />
    <ChatChannelList />
    {/* <ChatJoinChannel />
    <ChatBody /> */}
  </div>
);

export default ChatBody;
