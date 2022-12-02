import React, { createContext, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'ComPipe'
(async () => {
	ComPipe.user = await (ComPipe.user as any as Promise<User>);
	ComPipe.onlineUsers = await (ComPipe.onlineUsers as any as Promise<Atom<PublicUser[]>>);
	ComPipe.visibleChannels = await (ComPipe.visibleChannels as any as Promise<Atom<PublicChannel[]>>);
})();
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);


root.render(
  <React.StrictMode>
      <App />
  </React.StrictMode>
);
