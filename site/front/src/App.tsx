import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/App.css";
import Log from "./pages/Log";
import Pong from "./pages/Pong";
import Chat from "./pages/Chat";
import User from "./pages/User";
import Watch from "./pages/Watch";

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Log />} />
          <Route path="/pong" element={<Pong />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/user" element={<User />} />
          <Route path="/watch" element={<Watch />} />
          <Route path="*" element={<Pong />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;