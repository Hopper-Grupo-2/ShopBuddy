import React from "react";
import { Socket } from "socket.io-client";

interface SocketContextProps {
	socket: Socket | null;
	//setSocket: React.Dispatch<React.SetStateAction<Socket | null>>;
}

export const SocketContext = React.createContext<SocketContextProps | null>(
	null
);
