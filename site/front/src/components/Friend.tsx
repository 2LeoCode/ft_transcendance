import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Chat.css';
import '../styles/Friend.css';

function Friend(props: any) {
  function printInfos(name: string) {
    let css = document.getElementById(name)?.style;
    if (css?.length === 0) css.display = 'block';
    else if (css?.display === 'block') css.display = 'none';
    else if (css?.display === 'none') css.display = 'block';
  }

  return (
    <li>
      <div onClick={() => printInfos(props.name)}>
        <img src="./default-avatar.webp" alt="Avatar" width="20px" />
        {props.name}
      </div>
      <div className="infos" id={props.name}>
        <button>Chat</button>
        <br />
        <button>Play</button>
        <br />
        <Link to={`/other_user/${props.name}`}>
          <button>View profile</button>
        </Link>
        <br />
      </div>
    </li>
  );
}

export default Friend;
