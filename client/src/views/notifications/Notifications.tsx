import { useContext, useEffect, useState } from "react";
import INotification from "../../interfaces/iNotification";
import { SocketContext } from "../../contexts/SocketContext";
import PageStructure from "../../components/PageStructure";
import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";

export default function Notifications() {
  const [notifications, setNotifications] = useState<INotification[]>([]);

  const socketContext = useContext(SocketContext);

  const fetchNotifications = async () => {
    const response = await fetch(`/api/notifications`, {
      method: "GET",
      credentials: "include", // Ensure credentials are sent
    });

    if (response.ok) {
      const notificationsData = await response.json();
      setNotifications(notificationsData.data);
      console.log(notificationsData);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (!socketContext?.socket) return;

    socketContext.socket.on("listNotification", () => {
      fetchNotifications();
    });

    return () => {
      socketContext.socket?.off("listNotification");
    };
  }, [notifications]);

  return (
    <>
      <PageStructure>
        <div>
          <h1>Notificações</h1>
          <List>
            {notifications
              .slice()
              .reverse()
              .map((notification) => (
                <ListItem
                  key={notification._id}
                  sx={notification.read ? { backgroundColor: "red" } : null}
                  disablePadding
                  component={Link}
                  to={"/list/" + notification.listId}
                >
                  <ListItemButton onClick={() => {}}>
                    <ListItemText
                      primary={notification.type + " : " + notification.listId}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
          </List>
        </div>
      </PageStructure>
    </>
  );
}
