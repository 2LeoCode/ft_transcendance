import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { UserCom } from "../com/user.com";
import "../styles/Header.css";
import { user_infos } from "../components/SignUp";
import Settings from "./Settings";

function Header() {
  const [settings, setSettings] = useState(false);
  let id: string = "";
  const navigate = useNavigate();
  async function handleLogout() {
    await UserCom.get({ nick: user_infos.nick }).then((res) => {
      id = res[0].id;
      console.log(res);
    });
    await UserCom.update(id, { online: false }).then((res) => {
      console.log(res);
    });
    localStorage.clear();
    navigate("/");
  }

  return (
    <div className="Header">
      <NavLink to="/user" className="infos_user">
        <img height="50%" src="./default-avatar.webp" alt="avatar" />
        <p>{user_infos.nick}</p>
      </NavLink>
      <NavLink to="/watch">
        <p className="watch">Watch</p>
      </NavLink>
      <NavLink to="/pong">
        <h1>FIGHT PONG</h1>
      </NavLink>
      <NavLink to="/chat">
        <p className="chat">Chat</p>
      </NavLink>
      <div className="dropdown">
        <button className="dropbtn">Menu</button>
        <div className="dropdown-content">
          <button
            type="button"
            onClick={() => {
              setSettings(true);
            }}
          >
            Settings
          </button>
          <button>Link 2</button>
          <button
            type="button"
            onClick={() => {
              handleLogout();
            }}
          >
            Logout
          </button>
        </div>
      </div>
      {settings && <Settings isOn={setSettings}/>}
    </div>
  );
}

export default Header;
