import React from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import "../styles/User.css";

declare const Blob: {
  prototype: Blob;
  new (): Blob;
  new (request: any, mime: string): Blob;
};

function OtherUser() {
  const matches_won = 0;
  const matches_lost = 0;
  const params = useParams();
  const username = params.userName;
  
  return (
    <div>
      <Header />
      <div className="User">
        <h3>{username}</h3>
        <div className="avatar">
            <img src="./default-avatar.webp" alt="Avatar" width="80%" />
          <br />
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

export default OtherUser;
