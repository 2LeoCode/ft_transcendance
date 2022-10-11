import React from 'react';
import Header from './Header';
import Pong from './Pong';
import Chat from './Chat';
import '../styles/App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Header />
      </header>
      <Pong />
      <Chat />
    </div>
  );
}

export default App;
