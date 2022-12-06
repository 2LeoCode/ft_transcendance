import React, { useState } from "react";
import "../styles/Settings.css";
import { Switch } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import useDatabase from "../com/use-database";
//import { Database } from "../com/database";


function Settings(props: any) {
  const Database = useDatabase();
  const [, setNick] = useAtom(Database.user.nickAtom);
  const [newName, setNewName] = useState("");
  // const [name, setName] = useAtom<string | undefined>(Database.user.nick);
  //const navigate = useNavigate();
  const changeUsername = async(e: any) => {
    e.preventDefault();
    setNick(newName);
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
