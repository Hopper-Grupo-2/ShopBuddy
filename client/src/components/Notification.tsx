import INotification from "../interfaces/iNotification";
import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";

interface NotificationListProps {
  notifications: INotification[];
}

export default function NotificationList(props: NotificationListProps) {
  return (
    <>
      <div>
        <List>
          {props.notifications.map((notification) => (
            <ListItem
              key={notification._id}
              sx={notification.read ? { backgroundColor: "red" } : null}
              disablePadding
              component={Link}
              to={"/list/" + notification.listId}
            >
              <ListItemButton>
                <ListItemText
                  primary={notification.type + " : " + notification.listId}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </div>
    </>
  );
}
