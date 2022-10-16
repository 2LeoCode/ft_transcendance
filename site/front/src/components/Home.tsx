import React, { useState } from "react";
import Header from "./Header";
import Pong from "./Pong";
import Chat from "./Chat";
import User from "./User";
import Log from "./Log";
import "../styles/Home.css";

function Home() {
  const [isLog, setIsLog] = useState(true); //debug
  const [isChat, setIsChat] = useState(true);
  const [isStat, setIsStat] = useState(false);
  return (
    <div className="Home">
      {!isLog && <Log log={setIsLog} />}
      {isLog && (
        <div>
          <header className="Header">
            <Header log={setIsLog} chat={setIsChat} stat={setIsStat} />
          </header>
          {!isChat && !isStat && <Pong />}
          {isChat && <Chat />}
          {isStat && <User />}
        </div>
      )}
    </div>
  );
}

export default Home;
