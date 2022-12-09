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
  const [chatPos, setChatPos] = useState(1000);

  const resizeStart = async (e: React.MouseEvent<HTMLDivElement>) => {
    setMouseOnResizer(true);
  }

  const resizeUpdate = async (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mouseOnResizer)
      return;
    if (mouseOnResizer) {
      const newLeft = e.clientX - 5;
      if (newLeft < 0 || newLeft > window.innerWidth - 300)
        return;
      const chat = document.getElementById('Chat')!;
      chat.style.left = newLeft + 'px';
      setChatPos(newLeft);
    }
  }

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

        <button
          onClick={() => setChatPos(0)}
          className='ChatExpandButton'
        >
          Expand
        </button>
      </div>
	    <div
        id='Chat'
        className='Chat'
        style={{ left: chatPos }}
      >
        <div
          id='ChatResizer'
          className="ChatResizer"
          draggable='false'
          // onDragStartCapture={initial}
          // onDragCapture={resize}
          onMouseDownCapture={resizeStart}
          onMouseMoveCapture={resizeUpdate}
          onMouseLeave={resizeUpdate}
          onMouseUpCapture={() => setMouseOnResizer(false)}
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