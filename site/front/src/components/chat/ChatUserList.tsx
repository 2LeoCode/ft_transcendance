import { useAtom } from "jotai";
import { Fragment, useEffect, useState } from "react";
import useDatabase from "../../com/use-database"
import { ConvsAtom } from "./ChatConvList";
import { CurrentConvAtom } from "./ChatCurrentConv";
import ChatUser, { SelectedUserAtom } from "./ChatUser";
import ClientSocket from "../../com/client-socket";
import { IRoom } from "../../gameObjects/GameObject";
import { Link } from "react-router-dom";

const ChatUserList = () => {
  const db = useDatabase();
  const [onlineUsers] = useAtom(db.onlineUsersAtom);
  const [selectedUser] = useAtom(SelectedUserAtom);
  const [convs, setConvs] = useAtom(ConvsAtom);
  const [, setCurrentConv] = useAtom(CurrentConvAtom);
  const [pongInvite, setPongInvite] = useState(false);

  // send a pong invite to e.currentTarget.value (username)
  function invitePong() {
    ClientSocket.emit('invitePong', selectedUser?.user42);
  }

  // accept pong invite -> create room.
  function acceptInvitePong() {
    ClientSocket.emit('AcceptPongInvite', selectedUser?.user42);
  }

  useEffect((): any => {

    // invite pong notification
    ClientSocket.on('receiverInvitePong', (senderUsername: string) => {
      if (senderUsername === selectedUser?.user42)
        setPongInvite(true);
    });

    ClientSocket.on("newRoom", (newRoomData: IRoom) => {
      ClientSocket.emit("joinRoom", newRoomData.roomId);
    });

  }, [selectedUser]);

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
            {selectedUser.id != db.user.id && !pongInvite &&
              <Link to={`/pong`}>
                <button
                  onClick={invitePong}
                  style={{ fontWeight: 'bold' }}>
                  Invite Pong
                </button>
              </Link>
            }
            {selectedUser.id != db.user.id && pongInvite &&
              <Link to={`/pong`}>
                <button
                  onClick={acceptInvitePong}
                  style={{ fontWeight: 'bold' }}>
                  Accept Pong Invite
                </button>
              </Link>
            }
            <Link to={`/other_user/${selectedUser.user42}`}>
              <button>
                See Profile
              </button>
            </Link>
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
              }}
            >Start Conversation</button>}
          </Fragment>
        )}
      </div>
    </Fragment>
  );
}

export default ChatUserList;