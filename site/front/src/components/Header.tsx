import { atom, useAtom } from "jotai";
import React, { Fragment, useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
//import { Database } from "../com/database";
import useDatabase from "../com/use-database";
import "../styles/Header.css";
import Chat from "../pages/Chat";
import Settings, { SettingsAtom } from "./Settings";

function Header() {
  const Database = useDatabase();

  const [settings, setSettings] = useAtom(SettingsAtom);
  //const [chat, setChat] = useAtom(ChatAtom);
  //console.log(Database.user.nickAtom);
  const [nick] = useAtom(Database.user.nickAtom);
  //const [logged, setLogged] = useAtom(LoggedAtom);

  const navigate = useNavigate();
  function handleLogout() {
//    //await UserCom.get({ nick: user_infos.nick }).then((res) => {
//    //  id = res[0].id;
//    //  console.log(res);
//    //});
//    //await UserCom.update(id, { online: false }).then((res) => {
//    //  console.log(res);
//    //});
//    //localStorage.clear();//
//    //navigate("/auth/login");

    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
		document.cookie = "token_2fa=; expires=Thu, 01 Jan 1970 00:00:00 UTC;"
	 	window.location.reload();
  }
  return (
      <div className="Header">
        <Link to='/user' className="infos_user">
          <img height="50%" src="./default-avatar.webp" alt="" />
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
          <h1>FIGHT PONG</h1>
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
