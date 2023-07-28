import React, { useContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import { SocketContext } from "./SocketContext";
import { UserContext } from "./UserContext";
import INotification from "../interfaces/iNotification";

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const userContext = useContext(UserContext);
	const [socket, setSocket] = useState<Socket | null>(null);

	useEffect(() => {
		if (socket) return;
		const newSocket = io();

		if (userContext?.user) {
			newSocket.emit("login", userContext?.user?._id);
			newSocket.on("listNotification", (notification: INotification) => {
				alert(`${notification.type}: ${notification.textContent}`);
			});
		}

		setSocket(newSocket);

		return () => {
			if (newSocket) {
				newSocket.off("listNotification");
				newSocket.close();
			}
		};
	}, []);

	return (
		<SocketContext.Provider value={{ socket }}>
			{children}
		</SocketContext.Provider>
	);
};
