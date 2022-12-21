import { atom, useAtom } from "jotai";
import { Fragment, useEffect, useState } from "react";
import ClientSocket from "../../com/client-socket";
import Channel from "../../com/interfaces/channel.interface";
import Message from "../../com/interfaces/message.interface";
import PublicUser from "../../com/interfaces/public-user.interface";
import { Atom } from "../../com/types/atom.type";
import useDatabase from "../../com/use-database";
import { Conv } from "./ChatConv";
import { ConvsAtom } from "./ChatConvList";

export const CurrentConvAtom = atom<Conv | null>(null);
export const NullAtom = atom<null>(null);

const ChatCurrentConv = () => {
  const db = useDatabase();
  const [currentConv] = useAtom(CurrentConvAtom);
  const [nick] = useAtom(currentConv?.user.nickAtom || NullAtom);
  const [input, setInput] = useState('');
  const [blockedUsers] = useAtom(db.user.blockedAtom);
  const [_] = useAtom(ConvsAtom);

  return (
    <div className="ChatBodyCurrentConv">
      {currentConv ? (
        <Fragment>
          <h2 style={{textAlign: 'center'}}>{nick}</h2>
          <ul className="ChatMessages">
            {currentConv.messages
              .filter((msg) => !blockedUsers.find((user) => user.id === msg.sender.id))
              .map((msg) => (
              <li
                key={msg.id}
                style={
                  msg.sender.id == db.user.id ?
                  { textAlign: 'left' } :
                  { textAlign: 'right' }
                }
              >
								<p>{msg.content}</p>
              </li>
            )).reverse()}
          </ul>
          <form onSubmit={(e) => {
            e.preventDefault();
						if (!input.length) return;
            ClientSocket.emit('privMsg', currentConv.user.id, input);
            setInput('');
          }}>
            <input
              type="text"
              value={input}
              onChange={(e) => {
                e.preventDefault();
                setInput(e.target.value);
              }} />
            <input type="submit" value="Send" />
          </form>
        </Fragment>
      ) : <h2 style={{textAlign: 'center'}}>No active conversation</h2>}
    </div>
  );

}

export default ChatCurrentConv;