import { useAtom } from "jotai";
import { Fragment, useEffect, useState } from "react";
import ClientSocket from "../com/client-socket";
import Message from "../com/interfaces/message.interface";
import PublicUser from "../com/interfaces/public-user.interface";
import useDatabase from "../com/use-database";
import { ConversationsAtom } from "../pages/Chat";
import PrivateMessage from "./PrivateMessage";

const PrivateMessages = ({ DmContent, DmReceipt }: { DmContent: string, DmReceipt: string }) => {
	const db = useDatabase();

	const [conversations] = useAtom(ConversationsAtom);

	useEffect(() => {
		console.log(`conversations: ${conversations}`);
	}, [conversations]);
	//const getMessagesByUser = (messagesIn: Message[], messagesOut: Message[]) => {
	//	const messagesByUser: { username: string, messages: Message[] }[] = [];
	//	messagesIn.forEach(message => {
	//		const user = messagesByUser.find(user => user.username === message.sender.user42);
	//		if (user) {
	//			user.messages.push(message);
	//		} else {
	//			messagesByUser.push({
	//				username: message.sender.user42,
	//				messages: [message]
	//			})
	//		}
	//	});
	//
	//	messagesOut.forEach(message => {
	//		console.log(message);
	//		const user = messagesByUser.find(user => user.username === (message.receiver as PublicUser).user42);
	//		if (user) {
	//			user.messages.push(message);
	//		} else {
	//			messagesByUser.push({
	//				username: (message.receiver as PublicUser).user42,
	//				messages: [message]
	//			})
	//		}
	//	});
	//	return messagesByUser;
	//}

	return (
		<Fragment>
			<ul className='private_messages'>
				<div>
					<div className='header'>
						<h2>{DmReceipt}</h2>
					</div>
					{
						(() => {
							const conv = conversations.find((conv, i) => conv.user == DmReceipt);
							
							if (conv && conv.user == DmReceipt)
								return (
									<div key={conv.user} className='conversation'>
										{
											conv.messages.map((msg, i) => (
												<PrivateMessage key={i} message={msg} />
											))
										}
									</div>
								);
							return <Fragment />
						})()
						
					}
				</div>
			</ul>
		</Fragment>
	)
}

export default PrivateMessages;