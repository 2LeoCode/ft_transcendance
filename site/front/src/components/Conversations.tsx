import { atom, useAtom } from "jotai";
import { Fragment, useEffect } from "react";
import PublicChannel from "../com/interfaces/public-channel.interface";
import PublicUser from "../com/interfaces/public-user.interface";
import Message from "../com/interfaces/message.interface";
import { Atom } from "../com/types/atom.type";
import useDatabase from "../com/use-database";
import OnlineUser from "./OnlineUser";
import ChatUser from "./ChatUser";
import { ConversationsAtom } from "../pages/Chat";
import ClientSocket from "../com/client-socket";

const Conversations = () => {
	const db = useDatabase();
	const [messagesIn, setMessagesIn] = useAtom(db.user.messagesInAtom);
	const [messagesOut, setMessagesOut] = useAtom(db.user.messagesOutAtom);
	const [convs, setConvs] = useAtom(ConversationsAtom);

	const getConvs = () => {
		const messagesByUser: { username: string, messages: Message[] }[] = [];
		//console.log(messagesIn, messagesOut)
		messagesIn.forEach(message => {
			const user = messagesByUser.find(user => user.username === message.sender.user42);
			if (user) {
				user.messages.push(message);
			} else {
				messagesByUser.push({
					username: message.sender.user42,
					messages: [message]
				})
			}
		});
	
		messagesOut.forEach(message => {
			console.log(message);
			const user = messagesByUser.find(user => user.username === (message.receiver as PublicUser).user42);
			if (user) {
				user.messages.push(message);
			} else {
				messagesByUser.push({
					username: (message.receiver as PublicUser).user42,
					messages: [message]
				})
			}
		});
		return messagesByUser;
	}
	useEffect(() => {
		console.log('useEffect')
		ClientSocket.on('NewReceivedDm', (message: Message) => {
			console.log('created dm');
			setMessagesIn([...messagesIn, message]);
		});
		ClientSocket.on('NewSentDm', (message: Message) => {
			console.log('created dm');
			setMessagesOut([...messagesOut, message]);
		});

		ClientSocket.on('FailedToCreateDm', (err) => {
			console.log(err);
		})
		const newConvs = getConvs()
			.map(
				({ username, messages }) => ({
					user: username,
					messages: messages.map(
						(msg: Message) => ({
							content: msg.content, isOwn: msg.sender.user42 === db.user.user42
						})
					)
				})
			);
		setConvs([...convs, ...newConvs]);
	}, []);

	return (
		<div className="Conversations">
			<h2>Conversations</h2>
			{
				(() => {
					return (
						<ul className='conversation_users'>
							{
								convs.map((conv, i) => <ChatUser key={i} conv={conv}/>)
							};
						</ul>
					);
				})()
			}
		</div>
	)
}

export default Conversations;