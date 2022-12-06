import React, { useState } from "react";
import "../styles/Settings.css";
import { Switch } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { atom, useAtom } from "jotai";
import { Database } from "../com/database";


function Settings(props: any) {
  const [newName, setNewName] = useState("");
  // const nameAtom = atom(Database.user.nick);
  // const [name, setName] = useAtom(nameAtom);
  const navigate = useNavigate();
  const changeUsername = async(e: any) => {
    e.preventDefault();
    // setName(e.target.value);
    // console.log(name);
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
