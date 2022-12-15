import { useAtom } from "jotai";
import { useEffect } from "react";
import ClientSocket from "../../com/client-socket";
import useDatabase from "../../com/use-database";

const ChatSocket = () => {
	const db = useDatabase();

	const [, setMessagesIn] = useAtom(db.user.messagesInAtom);
	const [, setMessagesOut] = useAtom(db.user.messagesOutAtom);

	useEffect(() => {
		ClientSocket
			.on('recvPrivMsg', (msg) => {
				setMessagesIn(prev => [...prev, msg]);
			})
			.on('sendPrivMsg', (msg) => {
				setMessagesOut(prev => [...prev, msg]);
			})
			.on('privMsgError', (err) => {
				console.log(err);
			});
	}, []);
	return null;
}

export default ChatSocket;