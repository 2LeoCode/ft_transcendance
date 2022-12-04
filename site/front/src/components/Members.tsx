import React, { useRef, useState, useEffect } from "react";
import { Socket } from "socket.io-client"
import { IRoom } from "../gameObjects/GameObject";



// maybe try to make a components to print active members..
const Members: React.FC<{socketProps: Socket, roomProps: any}> = ({socketProps, roomProps}) => {

  const canvasRef = useRef<HTMLCanvasElement>(null);
    
  const socket: Socket = socketProps;
  let room: IRoom = roomProps;
	const roomId: string | undefined = room?.roomId;

  // console.log("canva is working...");

  

  socket.emit('client connected');
  
  let cId: Array<string> = new Array();

  useEffect(() => {


    socket.on('getUserId', (clientId: string)=> {
        cId[0] = clientId;
        console.log(cId);
    })
    
    return cId;

    })

  return    <li>
                <div className="status online"></div>
                <img src="./default-avatar.webp" alt="Avatar" width="20px" />
                {cId.map((socketId) => (
                    <div
                        key={socketId}
                        // onClick={() => {
                        // 	handleSelect(friend)
                    >
                {socketId}
                </div>
                        ))}
            </li>;
}

export default Members;
