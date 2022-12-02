import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import './styles/App.css';
import Log from './pages/Log';

export const token: string =
  document.cookie
    .split(';')
    .map((cookie) => cookie.split('='))
    .find((cookie) => cookie[0] === 'token')?.[1] || '';

function App() {
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
      <Log />
    </BrowserRouter>
  );
}

export default App;
