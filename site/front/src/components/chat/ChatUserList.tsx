import { useAtom } from "jotai";
import { Fragment, useEffect } from "react";
import useDatabase from "../../com/use-database"
import ChatUser, { SelectedUserAtom } from "./ChatUser";

const ChatUserList = () => {
  const db = useDatabase();
  const [onlineUsers] = useAtom(db.onlineUsersAtom);
  const [selectedUser] = useAtom(SelectedUserAtom);

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
			  	  <button>Invite Pong</button>
		        <button>Ask Friend</button>
		        <button>Talk</button>
          </Fragment>
        )}
      </div>
    </Fragment>
  );
}

export default ChatUserList;