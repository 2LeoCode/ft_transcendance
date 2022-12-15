import { atom, useAtom } from "jotai";
import { useEffect } from "react";
import PublicUser from "../../com/interfaces/public-user.interface";
import useDatabase from "../../com/use-database";
import ChatConv from "./ChatConv";
import { Conv } from "./ChatCurrentConv";

const ConvsAtom = atom([] as Conv[]);

const ChatConvList = () => {
	const db = useDatabase();
  const [convs, setConvs] = useAtom(ConvsAtom);
	const [messagesIn] = useAtom(db.user.messagesInAtom);
	const [messagesOut] = useAtom(db.user.messagesOutAtom);

	useEffect(() => {
		const tmp = [] as Conv[];
	
		messagesIn.forEach((msg) => {
			const cur = tmp.find((conv) => conv.user.id == msg.sender.id);
			if (cur)
				cur.messages.push(msg);
			else {
				tmp.push({
					user: msg.sender,
					messages: [msg],
				});
			}
		});

		messagesOut.forEach((msg) => {
			const cur = tmp.find((conv) => conv.user.id == msg.receiver.id);
			if (cur)
				cur.messages.push(msg);
			else {
				tmp.push({
					user: msg.receiver as PublicUser,
					messages: [msg],
				});
			}
		});

	}, [messagesIn, messagesOut]);

  return (
    <div className="ChatBodyUsers">
      <h2>Conversations</h2>
      <ul className='ChatUserList'>
        {convs.map((conv) => <ChatConv conv={conv} />)}
      </ul>
    </div>
  );
}

export default ChatConvList;