import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import IUser from "../interfaces/iUser";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";

interface MembersModalProps {
  title: string;
  members: IUser[];
  open: boolean;
  handleClose: () => void;
  handleMember: (user: string) => Promise<false | undefined>;
  isOwner: boolean;
}

//style DialogTitle
const dialogTitleStyle = {
  backgroundColor: "#FF9900",
  color: "#FFF",
  fontWeight: "bold",
  padding: "5px 10px",
};

const MembersModal: React.FC<MembersModalProps> = (
  props: MembersModalProps
) => {
  return (
    <Dialog open={props.open} onClose={props.handleClose}>
      <DialogTitle sx={{ ...dialogTitleStyle }}>{props.title}</DialogTitle>
      <div>
        <DialogContent sx={{ minWidth: "300px" }}>
          <List>
            {props.members.map((user) => (
              <ListItem key={user._id.toString()}>
                <ListItemText
                  primary={
                    <Typography
                      sx={
                        user.username === props.members[0].username
                          ? {
                              fontWeight: "bolder",
                            }
                          : { fontWeight: "bold", color: "#757575" }
                      }
                    >
                      {user.username}
                    </Typography>
                  }
                />
                {props.isOwner && user !== props.members[0] ? (
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => props.handleMember(user._id.toString())}
                  >
                    <HighlightOffRoundedIcon />
                  </IconButton>
                ) : (
                  user.username === props.members[0].username && (
                    <ManageAccountsIcon />
                  )
                )}
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={props.handleClose}
            sx={{
              backgroundColor: "#FF9900",
              color: "#FFF",
              fontWeight: "bold",
            }}
            variant="contained"
          >
            Fechar
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  );
};

export { MembersModal };
