import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { UserCom } from "../com/user.com";
import Header from "../components/Header";
import "../styles/User.css";

declare var Blob: {
  prototype: Blob;
  new (): Blob;
  new (request: any, mime: string): Blob;
};

function OtherUser() {
  const matches_won: number = 0;
  const matches_lost: number = 0;
  const params = useParams();
  const username = params.userName;
  //recup infos when db ok
  UserCom.get({nick: username}).then((res) => (console.log(res)));
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
