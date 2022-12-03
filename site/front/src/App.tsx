import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/App.css";
import Log from "./pages/Log";
import Pong from "./pages/Pong";
import Chat from "./pages/Chat";
import User from "./pages/User";
import Watch from "./pages/Watch";
import OtherUser from "./pages/OtherUser";



function App() {
  // get cookies from browser
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Log />} />
          <Route path="/log" element={<Log />} />
          <Route path="/pong" element={<Pong />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/user" element={<User />} />
          <Route path="/other_user/:userName" element={<OtherUser />} />
          <Route path="*" element={<Pong />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
