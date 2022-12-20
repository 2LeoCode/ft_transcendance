import React, { Fragment, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './styles/App.css';
import Log from './pages/Log';
import { useAtom, atom } from 'jotai';
import Chat from './pages/Chat';
import User from './pages/User';
import OtherUser from './pages/OtherUser';
import Pong from './pages/Pong';
import Loader, { SyncAtom } from './components/Loader';
import ClientSocket from './com/client-socket';
import Constants from './com/constants';
import SocketInit from './components/SocketInit';
import swal from 'sweetalert';
import Swal from 'sweetalert2';

export const StatusAtom = atom<'connected' | 'disconnected' | 'connecting'>('connecting');
export const LoggedAtom = atom(false);

function App() {
  const [sync] = useAtom(SyncAtom);
  const [status, setStatus] = useAtom(StatusAtom);
  const [logged, setLogged] = useAtom(LoggedAtom);

  useEffect(() => {
    ClientSocket
      .connect()
      .on('connect', () => setStatus('connected'))
      .on('disconnect', () => setStatus('disconnected'))
      .on('connected', () => setLogged(true))

			.on('twoFactorRequired', (qrcode: string) => {
				console.log('twoFactorRequired');
				console.log(qrcode);
				// ClientSocket.disconnect();

				// make a swal alert with the qrcode and a input field
				// when the user enters the code, send it to the server
				// and if the code is correct, connect again
				// if not, show an error message

				const show2faAlert = (color: string, text: string) => {
					Swal.fire({
						title: text,
						input: 'text',
						color: color,
						inputAttributes: {
							autocapitalize: 'off'
						},
						imageUrl: qrcode,
						showCancelButton: false,
						confirmButtonText: 'Submit',
						allowOutsideClick: false,
						allowEscapeKey: false,
						showLoaderOnConfirm: true,
						preConfirm: async (code) => {
						 	const res = await fetch(`http://localhost:2000/auth/2fa/login?code=${code}`, {
								method: 'GET',
								headers: {
									'Authorization': `Bearer ${Constants.jwtToken}`
								}
							});
							if (res.ok) {
								console.log('res is ok');
								document.cookie = `token_2fa=${await res.json().then(res => res.token_2fa)}`;
								window.location.reload();
							} else {
								console.log('res is not ok');
								show2faAlert('red', 'Invalid code, try again');
							}
						}
					});
				}
				show2faAlert('blue', 'Enter the code');
			})

			.on('authError', (error: any) => {
				swal(error);
			});
  }, []);

  return (
    <BrowserRouter>
      {
        sync ? (
          <Fragment>
            <SocketInit />
            <Routes>
              {/*<Route path="/pong" element={<Pong />} />*/}
              <Route path="/chat" element={<Chat />} />
              <Route path="/user" element={<User />} />
              <Route path="/other_user/:userName" element={<OtherUser />} />
              <Route path="*" element={<Pong />} />
            </Routes>
          </Fragment>
        ) : {
          'connected': logged ? <Loader /> : <Log />,
          'disconnected': <Log />,
          'connecting': <Fragment>Loading...</Fragment>
        }[status]
      }
    </BrowserRouter>
  );
}

export default App;
