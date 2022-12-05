import { useAtom } from "jotai";
import React, { useState, useEffect } from "react";
//import { UserCom } from "../com/user.com";
import { Database } from '../com/database';
import Header from "../components/Header";
import "../styles/User.css";

declare let Blob: {
  prototype: Blob;
  new (): Blob;
  new (request: any, mime: string): Blob;
};

function User() {
  const [image, setImage] = useState(new Blob());
  const [uploaded, setUploaded] = useState(false);
  const [username] = useAtom(Database.user.nick);
  const matches_won: number = 0;
  const matches_lost: number = 0;

  return (
    <div>
      <Header />
      <div className="User">
        <h3>{username}</h3>
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
          <p>No match history yet</p>
        </div>
      </div>
    </div>
  );
}

export default User;
