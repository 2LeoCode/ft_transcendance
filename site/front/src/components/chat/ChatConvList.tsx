import { atom, useAtom } from "jotai";
import ChatConv from "./ChatConv";
import { Conv } from "./ChatCurrentConv";

const ConvsAtom = atom([] as Conv[]);

const ChatConvList = () => {
  const [convs] = useAtom(ConvsAtom);

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