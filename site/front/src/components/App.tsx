import React from 'react';
import Header from './Header';
import Pong from './Pong';
import Chat from './Chat';
import User from './User';
import '../styles/App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Header />
      </header>
      <Pong />
      <Chat />
      <User />
    </div>
  );
}

export default App;
