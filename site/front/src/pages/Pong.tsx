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
import { Database } from '../com/database';

function activate_script() {
  const script = document.createElement('script');
  script.src = './game.js';
  script.async = true;
  document.body.appendChild(script);
}

function Pong() {
  //const Database = require('../com/database').Database;

  const [play, setPlay] = useState<boolean | any>(false);
  // const socket = io("http://localhost:2000");
  // socket.on("message", (msg) => {
  //   console.log(msg);
  // });
  // console.log(infos.)

  //console.log('Hello dude');
  // example:
  const [nickname] = useAtom(Database.user.nick);

  useEffect(() => {
	console.log(`Hello ${nickname}!`);
  }, []);
  return (
    <React.Fragment>
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
