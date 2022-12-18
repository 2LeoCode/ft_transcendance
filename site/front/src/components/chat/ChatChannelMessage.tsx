import { useAtom } from "jotai";
import Message from "../../com/interfaces/message.interface";

const ChatChannelMessage = ({ msg }: { msg: Message }) => {
	const [senderNick] = useAtom(msg.sender.nickAtom);
 
	return (
		<li key={msg.id} className='ChatMessage'>
			<p className="ChatMessage">
				{senderNick} ({msg.sender.user42}): {msg.content}
			</p>
		</li>
	);
}

export default ChatChannelMessage;