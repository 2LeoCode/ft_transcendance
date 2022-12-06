import "../styles/Log.css";

const Log = () => {

  //useEffect(() => {
  //  (async () => {
  //    ClientSocket.on('disconnect', () => {
	//	console.log('dead');
  //      window.location.replace('http://localhost:2000/auth/login');
  //    });
  //    ClientSocket.on('connect', () => {
  //      setConnected(true);
	//	console.log('connected');
  //    });
	//    //ClientSocket.on('pong', () => {
	//	  //console.log('received pong');
	//    //  setLogged(true);
	//    //});
  //    //ClientSocket.emit('ping');
  //  })();
  //}, []);

  return (
    <div className="Log">
      <h1>Fight Pong</h1>
      <button type="button" onClick={
        () => window.location.replace("http://localhost:2000/auth/login")
      }>
        Sign In
      </button>
    </div>
  );
}

export default Log;
