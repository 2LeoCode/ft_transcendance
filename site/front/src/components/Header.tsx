import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/Header.css";
import Settings from "./Settings";

function Header() {
  const [settings, setSettings] = useState(false);
  const id = '';
  const navigate = useNavigate();
  async function handleLogout() {
    //await UserCom.get({ nick: user_infos.nick }).then((res) => {
    //  id = res[0].id;
    //  console.log(res);
    //});
    //await UserCom.update(id, { online: false }).then((res) => {
    //  console.log(res);
    //});
    localStorage.clear();
    navigate('/');
  }

  return (
    <div className="Header">
      <NavLink to="/user" className="infos_user">
        <img height="50%" src="./default-avatar.webp" alt="avatar" />
        {/* <p>{user_infos.nick}</p> */}
      </NavLink>
      <p
        className='settings'
        onClick={() => {
          setSettings(true);
        }}>
        Settings
      </p>
      <NavLink to="/pong">
        <h1>FIGHT PONG</h1>
      </NavLink>
      <NavLink to="/chat">
        <p className="chat">Chat</p>
      </NavLink>
      <p
        className='logout'
        onClick={() => {
          handleLogout();
        }}>
        Logout
      </p>
      {settings && <Settings isOn={setSettings} />}
    </div>
  );
}

export default Header;
