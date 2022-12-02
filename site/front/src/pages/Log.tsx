import React, { useEffect, useState } from "react";
import Database from "../com/database";
import Loader from "../components/Loader";
import "../styles/Log.css";

const Log = () => {
  const [logged, setLogged] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    (async () => {
      Database.socket.emit('ping');
      Database.socket.on('pong', () => {
        setLogged(true);
        setLoaded(true);
      });
      Database.socket.on('error', () => {
        setLoaded(true);
      });
    })();
  }, []);

  return (
    clicked ? <Loader /> : loaded ? (
      <div className="Log">
        <h1>Fight Pong</h1>
        <button type="button" onClick={() => {
          if (!logged)
            window.location.replace('http://localhost:2000/auth/login');
          setClicked(true);
        }}>
          Sign In
        </button>
      </div>
    ) : (
      <React.Fragment>Loading...</React.Fragment>
    )
  );
}

export default Log;
