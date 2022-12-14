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
import SocketInit from './components/SocketInit';

export const StatusAtom = atom<'connected' | 'disconnected' | 'connecting'>('connecting');
export const LoggedAtom = atom(false);

function App() {
  const [sync] = useAtom(SyncAtom);
  const [status, setStatus] = useAtom(StatusAtom);
  const [logged, setLogged] = useAtom(LoggedAtom);

  useEffect(() => {
    ClientSocket
      .connect()
      .on('connect', () => setStatus('connected'))
      .on('disconnect', () => setStatus('disconnected'))
      .on('pong', () => setLogged(true))
      .emit('ping');
  }, []);

  return (
    <BrowserRouter>
      {
        sync ? (
          <Fragment>
            <SocketInit />
            <Routes>
              {/*<Route path="/pong" element={<Pong />} />*/}
              <Route path="/chat" element={<Chat />} />
              <Route path="/user" element={<User />} />
              <Route path="/other_user/:userName" element={<OtherUser />} />
              <Route path="*" element={<Pong />} />
            </Routes>
          </Fragment>
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
