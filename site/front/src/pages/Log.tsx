import "../styles/Log.css";

const Log = () => (
  <div className="Log">
    <h1>Fight Pong</h1>
    <button type="button" onClick={
      () => window.location.replace("http://localhost:2000/auth/login")
    }>
      Sign In
    </button>
  </div>
);

export default Log;
