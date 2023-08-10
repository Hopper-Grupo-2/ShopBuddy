import { useContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import { SocketContext } from "./SocketContext";
import { UserContext } from "./UserContext";

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
    }

    setSocket(newSocket);

    return () => {
      if (newSocket) {
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
