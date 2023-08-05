import { useContext, useState } from "react";
import PageStructure from "../../components/PageStructure";
import {
  Button,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { NotificationsContext } from "../../contexts/NotificationsContext";
import AlertDialog from "../../components/AlertDialog";
import DeleteIcon from "@mui/icons-material/Delete";
import PendingIcon from "@mui/icons-material/Pending";

export default function Notifications() {
  const notificationsContext = useContext(NotificationsContext);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleClearNotifications = async () => {
    try {
      const response = await fetch("/api/notifications/user", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseObj = await response.json();
      if (response.ok) {
        notificationsContext?.fetchNotifications();
      } else {
        throw responseObj.error;
      }
    } catch (error: any) {
      console.error(error.name, error.message);
      setDialogMessage("Erro ao apagar as notificações, tente novamente!");
      setOpenDialog(true);
      return false;
    }
  };

  const handleClearNotification = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseObj = await response.json();
      if (response.ok) {
        await notificationsContext?.fetchNotifications();
        console.log("===================");
        console.log("notification=", notificationsContext);
        console.log("===================");

        setIsDeleting(false);
      } else {
        throw responseObj.error;
      }
    } catch (error: any) {
      console.error(error.name, error.message);
      setDialogMessage("Erro ao apagar a notificação, tente novamente!");
      setOpenDialog(true);
      return false;
    }
  };

  return (
    <>
      <PageStructure>
        <div>
          <h1>Notificações</h1>
          <Button
            sx={{ marginBottom: "30px" }}
            variant="contained"
            onClick={handleClearNotifications}
          >
            Limpar notificações
          </Button>
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
                  //component={Link}
                  //to={"/list/" + notification.listId}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={async () => {
                        setIsDeleting(true);
                        await handleClearNotification(notification._id);
                      }}
                    >
                      {isDeleting ? <PendingIcon /> : <DeleteIcon />}
                    </IconButton>
                  }
                >
                  <ListItemButton
                    onClick={() => {
                      navigate("/list/" + notification.listId);
                    }}
                  >
                    <ListItemText
                      primary={notification.type + " : " + notification.listId}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
          </List>
        </div>
      </PageStructure>
      <AlertDialog
        open={openDialog}
        onClose={handleCloseDialog}
        contentText={dialogMessage}
        buttonText="Fechar"
      />
    </>
  );
}
