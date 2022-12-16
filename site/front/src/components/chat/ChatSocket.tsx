import { useAtom } from "jotai";
import { useEffect } from "react";
import ClientSocket from "../../com/client-socket";
import EntityParser from "../../com/entity-parser";
import PublicUser from "../../com/interfaces/public-user.interface";
import useDatabase from "../../com/use-database";
import { ConvsAtom } from "./ChatConvList";

const ChatSocket = () => {
	const db = useDatabase();

	const [, setMessagesIn] = useAtom(db.user.messagesInAtom);
	const [, setMessagesOut] = useAtom(db.user.messagesOutAtom);
	const [, setConvs] = useAtom(ConvsAtom);

	useEffect(() => {
		ClientSocket
			.on('recvPrivMsg', (msg) => {
				console.log('recvPrivMsg');
				const res = EntityParser.message(msg);

				setMessagesIn(prev => [...prev, res]);
				setConvs(prev => {
					const conv = prev.find(conv => conv.user.id === res.sender.id);

					if (conv) {
						conv.messages.push(EntityParser.message(msg));
						return prev;
					}
					return [...prev, {
						user: res.sender,
						messages: [res]
					}];
				});
			})
			.on('sendPrivMsg', (msg) => {
				console.log('sendPrivMsg');
				const res = EntityParser.message(msg);

				setMessagesOut(prev => [...prev, EntityParser.message(msg)]);
				setConvs(prev => {
					const conv = prev.find(conv => conv.user.id === res.id);
	
					if (conv) {
						conv.messages.push(EntityParser.message(msg));
						return prev;
					}
					return [...prev, {
						user: res.receiver as PublicUser,
						messages: [EntityParser.message(msg)]
					}];
				});
			})
			.on('privMsgError', (err) => {
				alert(err);
			});
	}, []);
	return null;
}

export default ChatSocket;