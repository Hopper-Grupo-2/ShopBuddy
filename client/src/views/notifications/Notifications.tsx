import { Fragment, useContext, useState } from "react";
import PageStructure from "../../components/PageStructure";
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { NotificationsContext } from "../../contexts/NotificationsContext";
import AlertDialog from "../../components/AlertDialog";
import DeleteIcon from "@mui/icons-material/Delete";
import PendingIcon from "@mui/icons-material/Pending";
import { NotificationTypes } from "../../interfaces/iNotification";

import ClearAllIcon from "@mui/icons-material/ClearAll";

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
        <Box
          sx={{
            mt: "50px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.2)",
              borderRadius: "10px 10px 10px 10px",
            }}
          >
            <Box
              alignItems="center"
              justifyContent="center"
              //spacing={1}
              //p={2}
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                backgroundColor: "#FF9900",
                borderRadius: "10px 10px 0px 0px",
                color: "white",
                height: "3.5rem",
                padding: "10px 20px",
              }}
            >
              <Typography variant="h5" color="#FFF" fontWeight="bold">
                Notificações
              </Typography>

              <IconButton onClick={handleClearNotifications}>
                <Typography
                  variant="subtitle2"
                  fontSize="0.7rem"
                  sx={{ fontWeight: "bold" }}
                >
                  Limpar notificações
                </Typography>
                <ClearAllIcon />
              </IconButton>
            </Box>

            {/* Everything below here will be a dedicated component */}
            <List
              sx={{
                //maxHeight: "400px",
                //overflowY: "auto",
                padding: "10px 20px",
              }}
            >
              {notificationsContext?.notifications?.length === 0 ? (
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Você não possui nenhuma notificação nova.
                </Typography>
              ) : (
                notificationsContext?.notifications
                  ?.slice()
                  .reverse()
                  .map((notification) => (
                    <ListItem
                      key={notification._id}
                      sx={
                        notification.read
                          ? {
                              backgroundColor: "#FFF",
                              mb: "10px",
                              boxShadow: "2px 4px 4px rgba(0, 0, 0, 0.1)",
                            }
                          : {
                              backgroundColor: "#FFCC80",
                              mb: "10px",
                              boxShadow: "2px 4px 4px rgba(0, 0, 0, 0.1)",
                            }
                      }
                      disablePadding
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
                          primary={
                            <Fragment>
                              De:
                              <Typography
                                component="span"
                                variant="body2"
                                sx={{ fontWeight: "bold" }}
                              >
                                {" "}
                                {notification.listName}
                              </Typography>
                            </Fragment>
                          }
                          secondary={
                            <Fragment>
                              <Typography
                                component="span"
                                variant="body2"
                                sx={{ fontWeight: "bold" }}
                              >
                                {notification.senderName}
                              </Typography>{" "}
                              {getNotificationMessage(notification.type)}
                              {notification.type ===
                                NotificationTypes.TOGGLE_PRODUCT && (
                                <Typography
                                  component="span"
                                  variant="body2"
                                  sx={{ fontWeight: "bold" }}
                                >
                                  {" "}
                                  {notification.textContent}
                                </Typography>
                              )}
                            </Fragment>
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                  ))
              )}
            </List>
          </Box>
        </Box>
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

function getNotificationMessage(typeOfNotification: NotificationTypes): string {
  switch (typeOfNotification) {
    case NotificationTypes.ADDED_TO_LIST:
      return "foi adicionado à lista";
    case NotificationTypes.REMOVED_FROM_LIST:
      return "removeu você da lista";
    case NotificationTypes.MESSAGE_FROM_LIST:
      return "enviou uma mensagem";
    case NotificationTypes.ADD_PRODUCT:
      return "adicionou um produto";
    case NotificationTypes.TOGGLE_PRODUCT:
      return "modificou o status do produto";
    case NotificationTypes.REMOVE_PRODUCT:
      return "removeu um produto";
    default:
      return "fez uma ação desconhecida";
  }
}
