import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import "../styles/User.css";
import { atom, useAtom } from "jotai";
import { Database } from "../com/database";
import useDatabase from "../com/use-database";
import ClientSocket from "../com/client-socket";
import { Socket } from "socket.io-client";
import Score from "../com/interfaces/score.interface";

let socket: Socket;

declare const Blob: {
  prototype: Blob;
  new(): Blob;
  new(request: any, mime: string): Blob;
};

function OtherUser() {

  const Database = useDatabase();
  const params = useParams();
  const username = params.userName;

  let matches_won: number;
  let matches_lost: number;
  let matches_tie: number;
  const [win, setWin] = useState(0);
  const [tie, setTie] = useState(0);
  const [lose, setLose] = useState(0);
  const [scores, setScores] = useState<Score[]>([]);
  const [uploaded, setUploaded] = useState(false);

  function inviteFriend(e: React.MouseEvent<HTMLButtonElement>) {
    const friendName = e.currentTarget.value;
    console.log(friendName);
    socket.emit("friendRequest", friendName);
  }

  const updateScores = (score: Score[]) => {
    const scores: Score[] = [];

    for (const sco of score) {
      scores.push({
        id: sco.id,
        playerScore: sco.playerScore,
        enemyScore: sco.enemyScore,
        date: sco.date,
        user: sco.user,
      });
    }
    setScores(scores);
  };

  useEffect(() => {

    socket = ClientSocket;

    socket.emit("getOtherUserScores", username);

    socket.on("otherUserScores", (scores: Score[]) => {
      updateScores(scores);

      matches_lost = 0;
      matches_won = 0;
      matches_tie = 0;
  
      scores.map((score) => {
        if (score.playerScore > score.enemyScore)
          matches_won++;
        else if (score.playerScore < score.enemyScore)
          matches_lost++;
        else
          matches_tie++;
      })
  
      setWin(matches_won);
      setLose(matches_lost);
      setTie(matches_tie);
    });

  }, []);

  return (
    <div>
      <Header />
      <div className="User">
        <h3>{username}</h3>
        <div className="avatar">
          <img src="../default-avatar.webp" alt="Avatar" width="80%" />
        </div>
        <div className="stats">
          <p key={"Winnnn"} className="win">{win} Win</p>
          <p key={"Tieeee"} className="tie">{tie} Tie</p>
          <p key={"Lose"} className="lose">{lose} Lose</p>
        </div>
        <div className="match_history">
          <h4>History</h4>
          {scores.map((score, i) => {
            return (
              <ul key={i}>{score.playerScore} - {score.enemyScore}</ul>
            )
          })}
        </div>
        <div className="friends">
          <button
            value={username}
            onClick={inviteFriend}
          >
            Send friend request
          </button>
          {/* <p>No match history yet</p> */}
        </div>
      </div>
    </div>
  );
}

export default OtherUser;
