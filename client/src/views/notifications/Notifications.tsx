import { useContext } from "react";
import PageStructure from "../../components/PageStructure";
import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";
import { NotificationsContext } from "../../contexts/NotificationsContext";

export default function Notifications() {
  const notificationsContext = useContext(NotificationsContext);

  return (
    <>
      <PageStructure>
        <div>
          <h1>Notificações</h1>
          {/* Everything below here will be a dedicated component */}
          <List>
            {notificationsContext?.notifications
              ?.slice()
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
