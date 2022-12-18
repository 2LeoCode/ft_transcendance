import { useAtom } from "jotai";
import { Fragment, useEffect } from "react";
import useDatabase from "../../com/use-database"
import { ConvTypeAtom } from "./ChatBody";
import { CurrentChannelAtom } from "./ChatChannel";
import { ConvsAtom } from "./ChatConvList";
import { CurrentConvAtom } from "./ChatCurrentConv";
import ChatUser, { SelectedUserAtom } from "./ChatUser";

const ChatUserList = () => {
  const db = useDatabase();
  const [onlineUsers] = useAtom(db.onlineUsersAtom);
  const [selectedUser] = useAtom(SelectedUserAtom);
	const [convs, setConvs] = useAtom(ConvsAtom); 
	const [, setCurrentConv] = useAtom(CurrentConvAtom);
	const [, setCurrentChannel] = useAtom(CurrentChannelAtom);
	const [, setConvType] = useAtom(ConvTypeAtom);

  return (
    <Fragment>
      <div className="ChatBodyUsers">
        <h2>Online users</h2>
          <ul className='ChatUserList'>
            {onlineUsers.map((usr) => (
              <li key={usr.id}>
                <ChatUser usr={usr} />
              </li>
            ))}
          </ul>
		    {selectedUser && (
			    <Fragment>
			  	  {selectedUser.id != db.user.id && <button style={{fontWeight: 'bold'}}>Invite Pong</button>}
		        <button>See Profile</button>
		        {selectedUser.id != db.user.id && <button
							onClick={() => {
								let conv = convs.find((conv) => conv.user.id == selectedUser.id);
								if (!conv) {
									conv = {
										user: selectedUser,
										messages: [],
									}
									setConvs([...convs, conv]);
								}
								setCurrentConv(conv);
								setCurrentChannel(null);
								setConvType('User');
							}}
							>Start Conversation</button>}
          </Fragment>
        )}
      </div>
    </Fragment>
  );
}

export default ChatUserList;