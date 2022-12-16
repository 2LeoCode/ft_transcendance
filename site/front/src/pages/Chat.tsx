import { atom, useAtom } from 'jotai';
import { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientSocket from '../com/client-socket';
import useDatabase from '../com/use-database';
//import { MouseOnResizerAtom } from '../../pages/Pong';
import '../styles/ChatTmp.css';
import ChatBody from '../components/chat/ChatBody';
import ChatHeader from '../components/chat/ChatHeader';
import ChatOnlineUsers from '../components/chat/ChatUserList';
import ChatUsers from '../components/chat/ChatUserList';

// export const UpdateChatAtom = atom(false);

// export const ChatWidthAtom = atom(20);

const Chat = () => {
  const db = useDatabase();
  const [onlineUsers] = useAtom(db.onlineUsersAtom);

  return (
    <div className='Chat'>
      <ChatHeader />
      <ChatBody />
    </div>
  );
}

export default Chat;