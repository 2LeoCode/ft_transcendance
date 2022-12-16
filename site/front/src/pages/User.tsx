import { atom, useAtom } from "jotai";
import React, { useState, useEffect } from "react";
import { useLocation, Location } from "react-router-dom";
import useDatabase from "../com/use-database";
import Header from "../components/Header";
import "../styles/User.css";

declare let Blob: {
  prototype: Blob;
  new(): Blob;
  new(request: any, mime: string): Blob;
};

function User() {

  const Database = useDatabase();
  const location = useLocation();

  const [image, setImage] = useState(new Blob());
  const [uploaded, setUploaded] = useState(false);
  const [nick] = useAtom(Database.user.nickAtom);
  const [scores] = useAtom(Database.user.scoresAtom);
  const [win, setWin] = useState(0);
  const [tie, setTie] = useState(0);
  const [lose, setLose] = useState(0);
  let matches_won: number;
  let matches_lost: number;
  let matches_tie: number;

  useEffect(() => {

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

  }, [])

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
          <p key="Win" className="win">{win} Win</p>
          <p key="Tie" className="tie">{tie} Tie</p>
          <p key="Lose" className="lose">{lose} Lose</p>
        </div>
        <div className="match_history">
          <h4>History</h4>
          {scores.map((score, i) => {
            if (score.playerScore > score.enemyScore)
              matches_won++;
            else
              matches_lost++;
            return (
              <p key={i}>{score.playerScore} - {score.enemyScore}</p>
            )
          })}
          {/* <p>No match history yet</p> */}
        </div>
      </div>
    </div>
  );
}

export default User;
