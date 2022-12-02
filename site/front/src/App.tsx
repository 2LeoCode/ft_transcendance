import React, { createContext, useContext, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/App.css';
import Log from './pages/Log';
import Pong from './pages/Pong';
import Chat from './pages/Chat';
import User from './pages/User';
import Watch from './pages/Watch';
import OtherUser from './pages/OtherUser';

export const token: string =
  document.cookie
    .split(';')
    .map((cookie) => cookie.split('='))
    .find((cookie) => cookie[0] === 'token')?.[1] || '';

function App() {
  const [isLog, setIsLog] = useState(false);
  useEffect(() => {
    if (token) {
      fetch('http://localhost:2000/ping', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then((res) => {
        if (res.ok) setIsLog(true);
        else setIsLog(false);
      });
    } else setIsLog(false);
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Log />} />
        <Route path="/log" element={<Log />} />
        {isLog && (
          <React.Fragment>
            <Route path="/pong" element={<Pong />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/user" element={<User />} />
            <Route path="/other_user/:userName" element={<OtherUser />} />
            <Route path="/watch" element={<Watch />} />
            <Route path="*" element={<Pong />} />
          </React.Fragment>
        )}
        {!isLog && <Route path="*" element={<Log />} />}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
