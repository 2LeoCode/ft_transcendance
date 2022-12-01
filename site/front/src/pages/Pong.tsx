import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import '../styles/Pong.css';
import { io } from 'socket.io-client';
import Game from '../components/Game';
import ComPipe from '../com/pipes/com.pipe';
import UserPipe from '../com/user.pipe';

const token: string =
  document.cookie
    .split(';')
    .map((cookie) => cookie.split('='))
    .find((cookie) => cookie[0] === 'token')?.[1] || '';

export const infos = (async () => new ComPipe('http://localhost:2000', token))();
export const userPipe = (async () => (await infos).user)()

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
  useEffect(() => {
    (async () => {
      const user: UserPipe = await userPipe;
      console.log(user.id);
      user.nick = 'Joe';
      console.log(await user.nick);
    })();
  }, []);
  return (
    <div>
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
    </div>
  );
}

export default Pong;
