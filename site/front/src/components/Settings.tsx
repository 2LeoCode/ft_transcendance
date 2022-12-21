import React, { useState } from "react";
import "../styles/Settings.css";
import { Switch } from "@mui/material";
import { atom, useAtom } from "jotai";
import useDatabase from "../com/use-database";
import ClientSocket from "../com/client-socket";
import Swal from "sweetalert2";
//import { Database } from "../com/database";

export const SettingsAtom = atom(false);

function Settings(props: any) {
  const Database = useDatabase();

  const [newName, setNewName] = useState("");
  const [, setSettings] = useAtom(SettingsAtom);
	const [twoFactor] = useAtom(Database.user.twoFactorEnabledAtom);
  const fileInput = React.createRef<HTMLInputElement>();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
  
    if (fileInput.current?.files) {
      const file = fileInput.current.files[0];
      if (!file) {
        Swal.fire({
          icon: 'error',
          text: "No file selected",
        });
        return;
      }
      if (file.size > 1000000) {
        Swal.fire({
          icon: 'error',
          text: "File too large",
        });
        return;
      }
      if (file.type !== "image/png" && file.type !== "image/jpeg") {
        Swal.fire({
          icon: 'error',
          text: "File must be a png or jpeg",
        });
        return;
      }
      ClientSocket.emit("uploadAvatar", {
        name: file.name,
        type: file.type,
        buffer: Buffer.from(await new Blob([file], {type: file.type}).arrayBuffer())
      });
    } else {
      Swal.fire({
        icon: 'error',
        text: "No file selected",
      });
    }
  }
  // const [name, setName] = useAtom<string | undefined>(Database.user.nick);
  //const navigate = useNavigate();
  
  const changeNickname = async (e: any) => {
    e.preventDefault();
    ClientSocket.emit("changeNickname", newName);
    // setName(e.target.value);
  };

  return (
    <div className="Settings">
      <form onSubmit={changeNickname}>
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
      <span>Change Avatar</span>
      <form onSubmit={handleSubmit}>
        <input type="file" ref={fileInput} />
        <button type="submit">Upload</button>
      </form>
      <br />
      <p>Activate 2FA</p>
			<Switch
				color="error"
				checked={twoFactor}
				onChange={(e) => {
					ClientSocket.emit(
						e.target.checked ? '2fa-on' : '2fa-off'
					)
				}} />
      <br />
      <button type="button" onClick={() => setSettings(false)}>
        Close
      </button>
    </div>
  );
}

export default Settings;
