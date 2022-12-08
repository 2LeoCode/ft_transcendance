import React, { Fragment, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './styles/App.css';
import Log from './pages/Log';
import { useAtom, atom } from 'jotai';
import Chat from './components/chat/Chat';
import User from './pages/User';
import OtherUser from './pages/OtherUser';
import Pong from './pages/Pong';
import Loader, { SyncAtom } from './components/Loader';
import ClientSocket from './com/client-socket';
import Constants from './com/constants';

export const StatusAtom = atom<'connected' | 'disconnected' | 'connecting'>('connecting');
export const LoggedAtom = atom(false);

function App() {
  const [sync] = useAtom(SyncAtom);
  const [status, setStatus] = useAtom(StatusAtom);
  const [logged, setLogged] = useAtom(LoggedAtom);
  //const [logged] = useAtom(LoggedAtom);
  //const [isLog, setIsLog] = useState(false);
  //useEffect(() => {
  //  if (token) {
  //    fetch('http://localhost:2000/ping', {
  //      method: 'GET',
  //      headers: {
  //        Authorization: `Bearer ${token}`
  //      }
  //    }).then((res) => {
  //      if (res.ok) setIsLog(true);
  //      else setIsLog(false);
  //    });
  //  } else setIsLog(false);
  //}, []);
  useEffect(() => {
    ClientSocket.connect();
    ClientSocket.on('connect', () => setStatus('connected'));
    ClientSocket.on('disconnect', () => setStatus('disconnected'));
    ClientSocket.on('pong', () => setLogged(true));
    ClientSocket.emit('ping');
    //ClientSocket.on('reconnect', () => setStatus('connected'));
    //ClientSocket.on('reconnecting', () => setStatus('connecting'));
  }, [])
  return (
    <BrowserRouter>
      {
        sync ? (
          <Routes>
            {/*<Route path="/pong" element={<Pong />} />*/}
            {/*<Route path="/chat" element={<Chat />} /> */}
            <Route path="/user" element={<User />} />
            <Route path="/other_user/:userName" element={<OtherUser />} />
            <Route path="*" element={<Pong />} />
          </Routes>
        ) : {
          'connected': logged ? <Loader /> : <Log />,
          'disconnected': <Log />,
          'connecting': <Fragment>Loading...</Fragment>
        }[status]
      }
    </BrowserRouter>
  );
}

export default App;
