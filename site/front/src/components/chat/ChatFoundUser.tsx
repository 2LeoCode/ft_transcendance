import { Fragment, useState } from "react";
import PublicUser from "../../com/interfaces/public-user.interface";
import { useAtom } from "jotai";
import useDatabase from "../../com/use-database";
import { CurrentChannelAtom } from "./ChatChannel";
import { Link } from "react-router-dom";
import ClientSocket from "../../com/client-socket";

const ChatFoundUser = ({ usr, startConv }: { usr: PublicUser, startConv: Function }) => {
	const db = useDatabase();
	const [selectedFoundUser, setSelectedFoundUser] = useState(null as PublicUser | null);
	const [nick] = useAtom(usr.nickAtom);
	const [currentChannel] = useAtom(CurrentChannelAtom);
	const [avatar] = useAtom(usr.avatarAtom);

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
				src={URL.createObjectURL(new Blob([Buffer.from(avatar.buffer.data)])) || "./default-avatar.webp"}
				alt="avatar"
			/>
			<p
				onClick={() => setSelectedFoundUser(usr)}
				className='ChatUserName'
				style={
					selectedFoundUser?.id == usr.id ?
						{ color: 'white', backgroundColor: 'black' } :
						{ color: 'black', backgroundColor: 'white' }
				}>
				{nick} (aka {usr.user42})
			</p>
			{selectedFoundUser?.id == usr.id && (
				<Fragment>
					<button
						onClick={() => startConv(usr)}>Start conversation</button>
					<Link to={`/other_user/${usr.user42}`}>
            <button>
              See Profile
            </button>
          </Link>
					{currentChannel && (
						<button
							onClick={() => {
								ClientSocket.emit('inviteToChannel', currentChannel.id, usr.id);
							}}>Invite to channel</button>
					)}
				</Fragment>
			)}
		</Fragment>
	);
}

export default ChatFoundUser;