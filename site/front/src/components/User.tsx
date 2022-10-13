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

  return (
    <div className="User">
      <h3>Username</h3>
      <div className="avatar">
		{!uploaded && <img src="./default-avatar.webp" alt="Avatar" width="200px" />}
        {uploaded && <img src={URL.createObjectURL(image)} alt="Avatar" width="200px" />}
        <textarea defaultValue="test" />
        <input
          type="file"
          onChange={(e) => {
            if (e.target.files) setImage(e.target.files[0]);
			setUploaded(true);
          }}
        />
      </div>
      <div className="stats">
        <p>0 win</p>
        <p>0 lose</p>
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
