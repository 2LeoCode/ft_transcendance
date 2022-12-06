import { Fragment, useEffect } from "react";
import Loader from "../components/Loader";
import ClientSocket from "../com/client-socket";
import "../styles/Log.css";
import { atom, useAtom } from "jotai";

export const ConnectedAtom = atom(false);
export const ClickedAtom = atom(false);

const Log = () => {
  const [connected, setConnected] = useAtom(ConnectedAtom);
  const [clicked, setClicked] = useAtom(ClickedAtom);

  useEffect(() => {
    (async () => {
      ClientSocket.on('disconnect', () => {
        console.log('error');
        window.location.replace('http://localhost:2000/auth/login');
      });
      ClientSocket.on('connect', () => {
        setConnected(true);
      });
	    //ClientSocket.on('pong', () => {
		  //console.log('received pong');
	    //  setLogged(true);
	    //});
      //ClientSocket.emit('ping');
    })();
  }, []);

  return clicked ? (
    connected ? (
      <Loader />
    ) : <Fragment>Connecting...</Fragment>
  ) : (
    <div className="Log">
      <h1>Fight Pong</h1>
      <button type="button" onClick={() => setClicked(true)}>
        Sign In
      </button>
    </div>
  );
}

export default Log;
