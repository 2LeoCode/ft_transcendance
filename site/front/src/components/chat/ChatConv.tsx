import { useAtom } from "jotai";
import Message from "../../com/interfaces/message.interface";
import PublicUser from "../../com/interfaces/public-user.interface";
import { Atom } from "../../com/types/atom.type";
import useDatabase from "../../com/use-database";
import { ConvTypeAtom } from "./ChatBody";
import { CurrentChannelAtom } from "./ChatChannel";
import { CurrentConvAtom } from "./ChatCurrentConv";

export type Conv = {
  user: PublicUser;
  messages: Message[];
};

const ChatConv = ({ conv }: { conv: Conv }) => {
	const [nickName] = useAtom(conv.user.nickAtom);
	const [currentConv, setCurrentConv] = useAtom(CurrentConvAtom);
	const [, setCurrentChannel] = useAtom(CurrentChannelAtom);
	const [, setConvType] = useAtom(ConvTypeAtom);

	return (
		<li key={conv.user.id} className='ChatUserName'>
			<p
				onClick={() => {
					setCurrentConv(conv);
					setCurrentChannel(null);
					setConvType('User');
				}}
				className="ChatUserName"
				style={
					(currentConv?.user.id || '') == conv.user.id ?
          	{ color: 'white', backgroundColor: 'black' } :
          	{ color: 'black', backgroundColor: 'white' }
				}
			>
				{nickName} (alias {conv.user.user42})
			</p>
		</li>
	)
}

export default ChatConv;