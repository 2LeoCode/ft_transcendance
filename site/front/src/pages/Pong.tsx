import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import '../styles/Pong.css';
import Game from '../components/Game';
import { Route, Routes } from 'react-router-dom';
import Chat from './Chat';
import User from './User';
import OtherUser from './OtherUser';
import Watch from './Watch';
import { useAtom } from 'jotai';
import Database from '../com/database';

const token: string =
  document.cookie
    .split(';')
    .map((cookie) => cookie.split('='))
    .find((cookie) => cookie[0] === 'token')?.[1] || '';

function activate_script() {
  const script = document.createElement('script');
  script.src = './game.js';
  script.async = true;
  document.body.appendChild(script);
}

function Pong() {
  const [play, setPlay] = useState<boolean | any>(false);
  // const socket = io("http://localhost:2000");
  // socket.on("message", (msg) => {
  //   console.log(msg);
  // });
  // console.log(infos.)

  // example:
  const [nickname, setNickname] = useAtom(Database.user.nick);

  useEffect(() => {
    console.log(`Hello, ${nickname}!`);
  }, []);
  return (
    <React.Fragment>
      <Routes>
        <Route path="/pong" element={<Pong />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/user" element={<User />} />
        <Route path="/other_user/:userName" element={<OtherUser />} />
        <Route path="/watch" element={<Watch />} />
        <Route path="*" element={<Pong />} />
      </Routes>
      <Header />
      <div className="Pong">
        {!play && (
          <button
            type="button"
            className="play_button"
            onClick={() => {
              setPlay(true);
              activate_script();
            }}>
            Play
          </button>
        )}
        {play && <Game />}
      </div>
    </React.Fragment>
  );
}

export default Pong;
