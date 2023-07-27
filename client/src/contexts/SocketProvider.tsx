import React, { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import { SocketContext } from "./SocketContext";

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [socket, setSocket] = useState<Socket | null>(null);
	//const socket = useRef<Socket | null>(null);

	useEffect(() => {
		if (socket) return;
		const newSocket = io();
		setSocket(newSocket);
		//socket.current = io();
		//console.log(socket.current);
		return () => {
			if (newSocket) newSocket.close();
		};
	}, []);

	return (
		<SocketContext.Provider value={{ socket }}>
			{children}
		</SocketContext.Provider>
	);
};
