import { atom, useAtom } from "jotai";
import { useEffect } from "react";
import PublicUser from "../../com/interfaces/public-user.interface";
import useDatabase from "../../com/use-database";
import ChatConv from "./ChatConv";
import { Conv } from "./ChatConv";

export const ConvsAtom = atom([] as Conv[]);

const ChatConvList = () => {
	const db = useDatabase();
  const [convs, setConvs] = useAtom(ConvsAtom);

	useEffect(() => {
		setConvs((() => {
			const convs = db.user.messagesIn
				.filter(msg => msg.receiverType === 'User')
				.map(msg => ({
					user: msg.sender,
					messages: [msg]
				}))
				.reduce((acc, conv) => {
					const found = acc.find(c => c.user.id === conv.user.id);
					if (found)
						found.messages.push(...conv.messages);
					else
						acc.push(conv);
					return acc;
				}, [] as Conv[]);
			db.user.messagesOut
				.forEach(msg => {
					const conv = convs.find(conv => conv.user.id === msg.receiver.id);
					if (conv) {
						conv.messages.push(msg);
					} else {
						convs.push({
							user: msg.receiver as PublicUser,
							messages: [msg]
						});
					}
				});
			return convs.map(conv => ({
				...conv,
				messages: conv.messages.sort((a, b) => a.createDate < b.createDate ? -1 : 1)
			}));
		})());
	}, []);

  return (
    <div className="ChatBodyUsers">
      <h2>Conversations</h2>
      <ul className='ChatUserList'>
        {convs.map((conv, tamere) => <ChatConv key={tamere} conv={conv} />)}
      </ul>
    </div>
  );
}

export default ChatConvList;