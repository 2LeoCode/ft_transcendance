import { useAtom } from 'jotai';
import { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import ClientSocket from '../com/client-socket';
import useDatabase from '../com/use-database';
import { DmContentAtom, IsChannelAtom, IsDmAtom } from '../pages/Chat';
import { SocketUser } from '../pages/Chat';

const OnlineUser: React.FC<{ name: string }> = (props) => {
  const db = useDatabase();
  //const [name, setName] = useAtom(DmNameAtom);
  const [, setIsDm] = useAtom(IsDmAtom);
  const [, setIsChannel] = useAtom(IsChannelAtom);
  const [pongInvite, setPongInvite] = useState(false);

  function printInfos(name: string) {
    let css = document.getElementById(name)?.style;
    if (css?.length === 0) css.display = 'block';
    else if (css?.display === 'block') css.display = 'none';
    else if (css?.display === 'none') css.display = 'block';
  }

  // send a pong invite to e.currentTarget.value (username)
  function invitePong(e: React.MouseEvent<HTMLButtonElement>) {
    console.log('play button: ' + e.currentTarget.value + ' actual socketId: ' + ClientSocket.id);
    ClientSocket.emit('invitePong', e.currentTarget.value);
  }

  // accept pong invite -> create room.
  function acceptInvitePong(e: React.MouseEvent<HTMLButtonElement>) {
    console.log('accept pong invite: ' + e.currentTarget.value);
    ClientSocket.emit('AcceptPongInvite', e.currentTarget.value);
  }

  useEffect((): any => {
    const socket = ClientSocket;

    // invite pong notification
    socket.on('receiverInvitePong', (senderUsername: string) => {
      console.log('receiverInvite : ' + senderUsername);
      if (senderUsername === props.name) setPongInvite(true);
    });
  }, []);
  //function goDm(e: React.MouseEvent<HTMLButtonElement>) {
  //  //ClientSocket.emit('DmRoom');
  //	// load dm room with e.currentTarget.value and socketprops.user.socketId
  //  console.log('goDm to ' + props.name);
  //  //setName(name);
  //}

  return (
    <li>
      <div onClick={() => printInfos(props.name)}>
        <img src="./default-avatar.webp" alt="Avatar" width="20px" />
        {db.user.user42 === props.name ? <Fragment>You :</Fragment> : <Fragment />} {props.name}
      </div>
      <div className="infos" id={props.name}>
        {db.user.user42 === props.name ? (
          <Fragment></Fragment>
        ) : (
          <Fragment>
            <button
              value={ClientSocket.id}
              onClick={(e) => {
                setIsDm(true);
                setIsChannel(false);
              }}>
              Chat
            </button>
            <br />
            {!pongInvite && (
              <Link to={`/pong`}>
                <button
                  value={props.name}
                  onClick={(e) => {
                    invitePong(e);
                  }}>
                  Send pong invite
                </button>
              </Link>
            )}
            <br />
            {pongInvite && (
              <Link to={`/pong`}>
                <button
                  value={props.name}
                  onClick={(e) => {
                    acceptInvitePong(e);
                  }}>
                  accept pong invite
                </button>
              </Link>
            )}
            <br />
            <Link to={`/other_user/${props.name}`}>
              <button>View profile</button>
            </Link>
            <br />
          </Fragment>
        )}
      </div>
    </li>
  );
};

export default OnlineUser;
