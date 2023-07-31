import React, { useContext, useEffect, useState } from "react";
import { SocketContext } from "./SocketContext";
import { UserContext } from "./UserContext";
import INotification from "../interfaces/iNotification";
import { NotificationsContext } from "./NotificationsContext";
import { useParams } from "react-router-dom";

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const userContext = useContext(UserContext);
  const socketContext = useContext(SocketContext);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const params = useParams();

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
      socketContext.socket.on(
        "listNotification",
        async (notification: INotification) => {
          console.log("list notification from backend");
          if (params.listId === notification.listId) {
            readListNotifications(params.listId);
          } else {
            fetchNotifications();
          }
        }
      );

    return () => {
      socketContext.socket?.off("listNotification");
    };
  }, [notifications, params]);

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
      value={{ notifications, readListNotifications, fetchNotifications }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
