import { useAtom } from "jotai";
import { Conv, CurrentConvAtom } from "./ChatCurrentConv";

const ChatConv = ({ conv }: { conv: Conv }) => {
	const [nickName] = useAtom(conv.user.nickAtom);
	const [currentConv, setCurrentConv] = useAtom(CurrentConvAtom);

	return (
		<li className='ChatUserName'>
			<p
				onClick={() => setCurrentConv(conv)}
				className="ChatUserName"
				style={
					currentConv?.user.id == conv.user.id ?
          	{ color: 'white', backgroundColor: 'black' } :
          	{ color: 'black', backgroundColor: 'white' }
				}
			>
			</p>
		</li>
	)
}

export default ChatConv;