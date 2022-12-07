import { useAtom } from "jotai";
import { Fragment } from "react";
import { Link } from "react-router-dom";
import { Socket } from "socket.io-client";
import ClientSocket from "../com/client-socket";
import useDatabase from "../com/use-database";
import { DmNameAtom, IsChannelAtom, IsDmAtom } from "../pages/Chat";
import { SocketUser } from "../pages/Chat";

const OnlineUser: React.FC<{ name: string; }> = (props) => {
	const db = useDatabase();
	//const [name, setName] = useAtom(DmNameAtom);
	const [users] = useAtom(db.onlineUsersAtom);
	const [, setIsDm] = useAtom(IsDmAtom);
	const [, setIsChannel] = useAtom(IsChannelAtom);

	function printInfos(name: string) {
    let css = document.getElementById(name)?.style;
    if (css?.length === 0) css.display = 'block';
    else if (css?.display === 'block') css.display = 'none';
    else if (css?.display === 'none') css.display = 'block';
  }

	function goDm(e: React.MouseEvent<HTMLButtonElement>) {
    ClientSocket.emit('DmRoom');
		// load dm room with e.currentTarget.value and socketprops.user.socketId
    console.log('goDm to ' + props.name);
    //setName(name);
  }

	return (
      <li>
        <div onClick={() => printInfos(props.name)}>
          <img src="./default-avatar.webp" alt="Avatar" width="20px" />
          {db.user.user42 === props.name ? <Fragment>You :</Fragment> : <Fragment />} {props.name}
        </div>
        <div className="infos" id={props.name}>
          {db.user.user42 === props.name ?
						<Fragment></Fragment> : (
							<Fragment>
								<button
            			value={ClientSocket.id}
            			onClick={(e) => {
            			  goDm(e);
            			  setIsDm(true);
            			  setIsChannel(false);
            			}}>
            		Chat
          			</button>
          			<br />
          			<button>Play</button>
          			<br />
								<Link to={`/other_user/${props.name}`}>
            			<button>View profile</button>
          			</Link>
          			<br />
							</Fragment>
						)
					}
          
        </div>
      </li>
    );
}

export default OnlineUser;