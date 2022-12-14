import ChatConvList from "./ChatConvList";
import ChatCurrentConv from "./ChatCurrentConv";
import ChatUserList from "./ChatUserList";

const ChatBody = () => (
	<div className='ChatBody'>
    <ChatUserList />
		<ChatCurrentConv />
		<ChatConvList />
    {/* <ChatVisibleChannels />
    <ChatFindUser />
    <ChatJoinChannel />
    <ChatBody /> */}
  </div>
);

export default ChatBody;
