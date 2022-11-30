import React, { useState } from "react";
import "../styles/Settings.css";
import { Switch } from "@mui/material";
//import { UserCom } from "../com/user.com";
import { user_infos } from "../components/SignUp";
import { useNavigate } from "react-router-dom";

function Settings(props: any) {
  const [newName, setNewName] = useState("");
  const navigate = useNavigate();
  let id: string = "";
  const changeUsername = async(e: any) => {
    //e.preventDefault();
    //await UserCom.get({ nick: user_infos.nick }).then((res) => {
    //  id = res[0].id;
    //});
    //await UserCom.update(id, { nick: newName }).then((res) => {
    //  console.log(res);
    //});
    //localStorage.setItem("username", newName);
    //user_infos.nick = JSON.stringify(localStorage.getItem("username")).replace(/^"(.*)"$/, '$1');
  };
  const deleteAccount = async (e: any) => {
    //e.preventDefault();
    //await UserCom.get({ nick: user_infos.nick }).then((res) => {
    //  id = res[0].id;
    //});
    //await UserCom.remove(id).then(() => {});
    //localStorage.clear();
    navigate("/");
  };
  return (
    <div className="Settings">
      <form onSubmit={changeUsername}>
        <label htmlFor="newName">Change Username</label>
        <input
          type="text"
          name="newName"
          value={newName}
          onChange={(e) => {
            setNewName(e.target.value);
          }}
        />
        <input type="submit" value="Send" id="submit" />
      </form>
      <br />
      <button type="button">Change Avatar</button>
      <br />
      <button type="button" onClick={deleteAccount}>
        Delete Account
      </button>
      <br />
      <p>Activate 2FA</p>
      <Switch color="error" />
      <br />
      <button type="button" onClick={() => props.isOn(false)}>
        Close
      </button>
    </div>
  );
}

export default Settings;
