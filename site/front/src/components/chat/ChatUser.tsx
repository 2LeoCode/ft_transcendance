import { atom, useAtom } from "jotai";
import { Fragment, useEffect } from "react";
import PublicUser from "../../com/interfaces/public-user.interface";
import useDatabase from "../../com/use-database";

export const SelectedUserAtom = atom(null as PublicUser | null);

const ChatUser = ({ usr }: { usr: PublicUser }) => {
  const db = useDatabase();

  const [nick] = useAtom(usr.nickAtom);
  const [avatar] = useAtom(usr.avatarAtom);
  const [selectedUser, setSelectedUser] = useAtom(SelectedUserAtom);

  useEffect(() => {
    if (selectedUser?.id == usr.id) {
      setSelectedUser(null);
    }
  }, [avatar]);

  return (
    <Fragment>
      <img
        style={{
          width: '30px',
          height: '30px',
          marginRight: '10px',
          // border: '1px solid black',
          float: 'left'
        }}
        src={avatar ? URL.createObjectURL(new Blob([Buffer.from(avatar.buffer.data)])) : "./default-avatar.webp"}
        alt="avatar"
      />
      <p
        onClick={() => setSelectedUser(usr)}
        className='ChatUserName'
        style={
          selectedUser?.id == usr.id ?
          	{ color: 'white', backgroundColor: 'black' } :
          	{ color: 'black', backgroundColor: 'white' }
      }>
        {nick}{usr.id == db.user.id && (' (you)')}
		  </p>
    </Fragment>
  );
}

export default ChatUser;