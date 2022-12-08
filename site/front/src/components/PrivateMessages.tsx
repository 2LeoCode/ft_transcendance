import { atom, useAtom } from "jotai";
import { Fragment, useEffect, useState } from "react";
import ClientSocket from "../com/client-socket";
import Message from "../com/interfaces/message.interface";
import PublicUser from "../com/interfaces/public-user.interface";
import useDatabase from "../com/use-database";
//import { ConversationsAtom } from "../pages/Chat";
import PrivateMessage from "./PrivateMessage";

export type Conversation = {
  user: string,
  messages: {
    content: string,
    isOwn: boolean
  }[]
}

export const ConversationsAtom = atom<Conversation[]>([]);

const PrivateMessages = ({ DmContent, DmReceipt }: { DmContent: string, DmReceipt: string }) => {
	const db = useDatabase();

	const [conversations] = useAtom(ConversationsAtom);

	useEffect(() => {
		console.log(`conversations: ${conversations}`);
	}, [conversations]);

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