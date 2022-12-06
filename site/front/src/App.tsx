import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './styles/App.css';
import Log, { ConnectedAtom } from './pages/Log';
import { useAtom } from 'jotai';
import Chat from './pages/Chat';
import User from './pages/User';
import OtherUser from './pages/OtherUser';
import Pong from './pages/Pong';
import Loader, { SyncAtom } from './components/Loader';

function App() {
  const [sync] = useAtom(SyncAtom);
  const [connected] = useAtom(ConnectedAtom);
  //const [isLog, setIsLog] = useState(false);
  //useEffect(() => {
  //  if (token) {
  //    fetch('http://localhost:2000/ping', {
  //      method: 'GET',
  //      headers: {
  //        Authorization: `Bearer ${token}`
  //      }
  //    }).then((res) => {
  //      if (res.ok) setIsLog(true);
  //      else setIsLog(false);
  //    });
  //  } else setIsLog(false);
  //}, []);
  return (
    <BrowserRouter>
      {sync ? (
        <Routes>
          {/*<Route path="/pong" element={<Pong />} />*/}
          <Route path="/chat" element={<Chat />} />
          <Route path="/user" element={<User />} />
          <Route path="/other_user/:userName" element={<OtherUser />} />
          <Route path="*" element={<Pong />} />
        </Routes>
      ) : connected ? <Loader /> : <Log />}
    </BrowserRouter>
  );
}

export default App;
