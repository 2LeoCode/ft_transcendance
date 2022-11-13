import React from "react";
import "../styles/Settings.css";

// Change avatar, name

function Settings(props: any) {
  return <div className="Settings">
    <button type="button">Change UserName</button><br />
    <button type="button">Change Avatar</button><br />
    <button type="button">Change Password</button><br />
    <button type="button">Delete Account</button><br />
    <button type="button">Activate 2FA</button><br />
    <button type="button" onClick={() => props.isOn(false)}>Close</button>
  </div>;
}

export default Settings;
