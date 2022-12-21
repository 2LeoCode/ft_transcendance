import { atom, useAtom } from "jotai";
import { Fragment, useEffect, useState } from "react";
import useDatabase from "../../com/use-database"
import { ConvTypeAtom } from "./ChatBody";
import { CurrentChannelAtom } from "./ChatChannel";
import { ConvsAtom } from "./ChatConvList";
import { CurrentConvAtom, NullAtom } from "./ChatCurrentConv";
import ChatUser, { SelectedUserAtom } from "./ChatUser";
import ClientSocket from "../../com/client-socket";
import { IRoom } from "../../gameObjects/GameObject";
import { Link } from "react-router-dom";
import PublicUser from "../../com/interfaces/public-user.interface";
import ChatFoundUser from "./ChatFoundUser";
import swal from "sweetalert";

export const PongInviteAtom = atom(null as PublicUser | null);
export const FoundUsersAtom = atom([] as PublicUser[]);

const ChatUserList = ({ startConv }: { startConv: Function }) => {
  const db = useDatabase();
  const [onlineUsers] = useAtom(db.onlineUsersAtom);
  const [selectedUser] = useAtom(SelectedUserAtom);
  const [convs, setConvs] = useAtom(ConvsAtom);
  const [, setCurrentConv] = useAtom(CurrentConvAtom);
	const [currentChannel, setCurrentChannel] = useAtom(CurrentChannelAtom);
	const [, setConvType] = useAtom(ConvTypeAtom);
  const [pongInvite] = useAtom(PongInviteAtom);
	const [nickFilterInput, setNickFilterInput] = useState('');
	const [user42FilterInput, setUser42FilterInput] = useState('');
	const [foundUsers, setFoundUsers] = useAtom(FoundUsersAtom);

  // send a pong invite to e.currentTarget.value (username)
  function invitePong() {
    ClientSocket.emit('invitePong', selectedUser?.user42);
  }

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
            
            {selectedUser.id != db.user.id && (
              <Fragment>
                <button
                  onClick={() => startConv(selectedUser)}
                >Start Conversation</button>
                <Link to={`/other_user/${selectedUser.user42}`}>
                <button>
                  See Profile
                </button>
                </Link>
              </Fragment>
            )}
          </Fragment>
        )}
				<h2>Find user</h2>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						if (!nickFilterInput.length && !user42FilterInput.length) {
							swal('You must enter at least one filter');
							return ;
						}
						ClientSocket.emit('findUsers', {
							nick: nickFilterInput.length ? nickFilterInput : null,
							user42: user42FilterInput.length ? user42FilterInput : null,
						});
						setNickFilterInput('');
						setUser42FilterInput('');
					}}>
					<input
						type='text'
						value={nickFilterInput}
						onChange={(e) => setNickFilterInput(e.target.value)}
						placeholder="nickname" />
					<input
						type='text'
						value={user42FilterInput}
						onChange={(e) => setUser42FilterInput(e.target.value)}
						placeholder="user42" />
					<input
						type='submit'
						value='Search' />
				</form>
      </div>
    </Fragment>
  );
}

export default ChatUserList;