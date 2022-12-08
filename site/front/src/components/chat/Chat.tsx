import { atom, useAtom } from 'jotai';
import { Fragment, useEffect, useState } from 'react';
import useDatabase from '../../com/use-database';
import '../../styles/Chat.css';

export const ChatAtom = atom(false);
export const UpdateChatAtom = atom(false);

// return a grid using Chat.css styles
const Chat = () => {
  const db = useDatabase();

  const [, setChat] = useAtom(ChatAtom);
  const [onlineUsers] = useAtom(db.onlineUsersAtom);
  const [visibleChannels] = useAtom(db.visibleChannelsAtom);
  const [mouseOnResizer, setMouseOnResizer] = useState(false);
  const [chatPos, setChatPos] = useState(-1);

  const resizeStart = async (e: React.MouseEvent<HTMLDivElement>) => {
    setMouseOnResizer(true);
  }

  const resizeUpdate = async (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mouseOnResizer) return;
    if (mouseOnResizer) {
      const chat = document.getElementById('Chat')!;
      const newLeft = e.clientX - 5;
      if (newLeft < 0 || newLeft > window.innerWidth - 300) return;
      chat.style.left = `${e.clientX - 5}px`;
      setChatPos(e.clientX - 5);
    }
  }

  useEffect(() => {
    //console.log
  }, [])

  return (
    <Fragment>
      <div className='ChatHeader'>
        Online users: {onlineUsers.length}
        <br />
        Visible channels: {visibleChannels.length}
	      <button
	      	  onClick={() => setChat(false)}
            className='ChatExitButton'
        >
		      Back
	      </button>
      </div>
	    <div
        id='Chat'
        className='Chat'
      >
        <div
          id='ChatResizer'
          className="ChatResizer"
          draggable='false'
          // onDragStartCapture={initial}
          // onDragCapture={resize}
          onMouseDown={resizeStart}
          onMouseMove={resizeUpdate}
          onMouseLeave={resizeUpdate}
          onMouseUp={() => setMouseOnResizer(false)}
        />
        <div className='ChatBodyHeader'>
          <div className='ChatBodyHeaderContent'>
            Content
          </div>
          <div className='ChatBodyHeaderUsers'>
            Users
          </div>
        </div>
        <div className='ChatBody'>
          <div className='ChatBodyContent'>
            Content...
          </div>
          <div className='ChatBodyUsers'>
            Users...
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default Chat;