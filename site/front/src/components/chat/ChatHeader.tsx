import { useAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import useDatabase from "../../com/use-database";

const ChatHeader = () => {
  const db = useDatabase();
  const navigate = useNavigate();

  const [onlineUsers] = useAtom(db.onlineUsersAtom);
  const [visibleChannels] = useAtom(db.visibleChannelsAtom);

	return (
		<div className='ChatHeader'>
      {/* <ChatHeader /> */}
      <p>
        Online users: {onlineUsers.length}
        <br />
        Visible channels: {visibleChannels.length}
      </p>
	    <button
        style={{ float: 'right' }}
	    	onClick={() => navigate('/')}
      >
		    Back
	    </button>
    </div>
	)
}

export default ChatHeader;