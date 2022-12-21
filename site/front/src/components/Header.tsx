import { useAtom } from "jotai";
import { Link, NavLink } from "react-router-dom";
//import { Database } from "../com/database";
import useDatabase from "../com/use-database";
import "../styles/Header.css";
import Settings, { SettingsAtom } from "./Settings";

function Header() {
  const Database = useDatabase();

  const [settings, setSettings] = useAtom(SettingsAtom);
  //const [chat, setChat] = useAtom(ChatAtom);
  const [nick] = useAtom(Database.user.nickAtom);
  const [avatar] = useAtom(Database.user.avatarAtom);
  //const [logged, setLogged] = useAtom(LoggedAtom);

  function handleLogout() {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
		document.cookie = "token_2fa=; expires=Thu, 01 Jan 1970 00:00:00 UTC;"
	 	window.location.reload();
  }

  return (
      <div className="Header">
        <Link to='/user' className="infos_user">
          <img height="50%" src={avatar ? URL.createObjectURL(new Blob([Buffer.from(avatar.buffer.data)])) : "./default-avatar.webp"} alt="" />
          {nick}
        </Link>
        <p
          className='settings'
          onClick={() => {
            setSettings(true);
          }}>
          Settings
        </p>
        <NavLink to="/pong">
          <h1 className="">FIGHT PONG</h1>
        </NavLink>
        <NavLink to="/chat">
          <h1>Chat</h1>
        </NavLink>
        <p
          className='logout'
          onClick={handleLogout}>
          Logout
        </p>
        {settings && <Settings />}
      </div>
  );
}

export default Header;
