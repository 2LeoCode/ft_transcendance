import { atom, useAtom } from "jotai";
import { Fragment } from "react";
import Message from "../../com/interfaces/message.interface";
import PublicUser from "../../com/interfaces/public-user.interface";
import useDatabase from "../../com/use-database";

export type Conv = {
  user: PublicUser;
  messages: Message[];
};

export const CurrentConvAtom = atom<Conv | null>(null);

const ChatCurrentConv = () => {
  const db = useDatabase();
  const [currentConv] = useAtom(CurrentConvAtom);
  const [nick] = useAtom(currentConv?.user.nickAtom || atom(''));

  return (
    <div className="ChatBodyCurrentConv">
      {currentConv ? (
        <Fragment>
          <h2 style={{textAlign: 'center'}}>{nick}</h2>
          <ul>
            {currentConv.messages.map((msg) => (
              <li
                key={msg.id}
                style={
                  msg.sender.id == db.user.id ?
                  { color: 'white', backgroundColor: 'black' } :
                  { color: 'black', backgroundColor: 'white' }
                }
              >
                {msg.content}
              </li>
            ))}
          </ul>
        </Fragment>
      ) : <h2 style={{textAlign: 'center'}}>No active conversation</h2>}
    </div>
  );

}

export default ChatCurrentConv;