import { atom, useAtom } from "jotai";
import React, { useState } from "react";
import { useLocation, Location } from "react-router-dom";
import useDatabase from "../com/use-database";
//import { Database } from '../com/database';
import Header from "../components/Header";
import "../styles/User.css";
import { io, Socket } from 'socket.io-client';
import ClientSocket from "../com/client-socket";

let socket: Socket;

declare let Blob: {
  prototype: Blob;
  new (): Blob;
  new (request: any, mime: string): Blob;
};

function User() {

  socket = ClientSocket;

  socket.emit("getScores");

  const Database = useDatabase();
  const location = useLocation();

  const [image, setImage] = useState(new Blob());
  const [uploaded, setUploaded] = useState(false);
  const [nick] = useAtom(Database.user.nickAtom);
  const [scores] = useAtom(Database.user.scoresAtom);
  const matches_won: number = 0;
  const matches_lost: number = 0;
  //console.log(Database.user.nick);

  return (
    <div>
      <Header />
      <div className="User">
        <h3>{nick}</h3>
        <div className="avatar">
          {!uploaded && (
            <img src="./default-avatar.webp" alt="Avatar" width="80%" />
          )}
          {uploaded && (
            <img src={URL.createObjectURL(image)} alt="Avatar" width="80%" />
          )}
          <br />
          <label htmlFor="avatar" className="avatar_label">
            Change avatar
          </label>
          <input
            id="avatar"
            className="avatar_button"
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files) setImage(e.target.files[0]);
              setUploaded(true);
            }}
          />
        </div>
        <div className="stats">
          <p className="win">{matches_won} win</p>
          <p className="lose">{matches_lost} lose</p>
        </div>
        <div className="match_history">
          <h4>History</h4>
          {scores.map((score) => {
            return (
              <p>{score.playerScore} - {score.enemyScore}</p>
            )
          })}
          {/* <p>No match history yet</p> */}
        </div>
      </div>
    </div>
  );
}

export default User;
