import React, { useEffect, useRef } from "react";
import { Socket, io } from "socket.io-client";
import { SocketContext } from "./SocketContext";

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	//const [socket, setSocket] = useState<Socket | null>(null);
	const socket = useRef<Socket | null>(null);

	useEffect(() => {
		if (socket.current) return;
		socket.current = io();
		return () => {
			if (socket.current) socket.current?.close();
		};
	}, []);

	return (
		<SocketContext.Provider value={{ socket: socket.current }}>
			{children}
		</SocketContext.Provider>
	);
};
