import React, { useContext, useEffect, useState } from "react";
import { SocketContext } from "./SocketContext";
import { UserContext } from "./UserContext";
import INotification from "../interfaces/iNotification";
import { NotificationsContext } from "./NotificationsContext";

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const userContext = useContext(UserContext);
  const socketContext = useContext(SocketContext);
  const [notifications, setNotifications] = useState<INotification[]>([]);

  const fetchNotifications = async () => {
    const response = await fetch(`/api/notifications`, {
      method: "GET",
      credentials: "include", // Ensure credentials are sent
    });

    if (response.ok) {
      const notificationsData = await response.json();
      setNotifications(notificationsData.data);
      //console.log(notificationsData);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (!socketContext?.socket) return;

    if (userContext)
      socketContext.socket.on("listNotification", () => {
        console.log("list notification from backend");
        fetchNotifications();
      });

    return () => {
      socketContext.socket?.off("listNotification");
    };
  }, [notifications]);

  const readListNotifications = async (listId: string) => {
    const response = await fetch(`/api/notifications/list/${listId}`, {
      method: "PUT",
      credentials: "include",
    });

    if (response.ok) {
      fetchNotifications();
    }
  };

  return (
    <NotificationsContext.Provider
      value={{ notifications, readListNotifications }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};