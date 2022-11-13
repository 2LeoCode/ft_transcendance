import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { UserCom } from "../com/user.com";
import "../styles/Header.css";
import { user_infos } from "../components/SignUp";

function Header() {
  const [id, setId] = useState("");
  useEffect(() => {
    UserCom.get({ nick: user_infos.nick }).then((res) => {
      setId(res[0].id);
      console.log(res);
    });
  }, []);
  const navigate = useNavigate();
  function handleLogout() {
    localStorage.clear();
    UserCom.update(id, { active: false }).then((res) => {
      console.log(res);
    });
    UserCom.remove(id).then((res) => {
      console.log(res);
    });
    navigate("/");
  }

  return (
    <div className="Header">
      <NavLink to="/user" className="infos_user">
        <img height="50%" src="./default-avatar.webp" alt="avatar" />
        <p>name</p>
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
          <button>Settings</button>
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
    </div>
  );
}

export default Header;
