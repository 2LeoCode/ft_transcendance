import React, { useState } from "react";
// import axios from 'axios';
import "../styles/User.css";

declare var Blob: {
  prototype: Blob;
  new (): Blob;
  new (request: any, mime: string): Blob;
};

function User() {
  const [image, setImage] = useState(new Blob());
  const [uploaded, setUploaded] = useState(false);
  const matches_won: number = 0;
  const matches_lost: number = 0;

  return (
    <div className="User">
      <h3>Username</h3>
      <div className="avatar">
        {!uploaded && (
          <img src="./default-avatar.webp" alt="Avatar" width="80%" />
        )}
        {uploaded && (
          <img src={URL.createObjectURL(image)} alt="Avatar" width="80%" />
        )}
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
        <p>{matches_won} win</p>
        <p>{matches_lost} lose</p>
      </div>
      <div className="match_history">
        <p>History</p>
      </div>
      <div className="auth">
        <p>Authentification</p>
      </div>
    </div>
  );
}

export default User;
