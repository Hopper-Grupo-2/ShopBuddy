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
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import IUser from "../interfaces/iUser";

interface MembersModalProps {
  title: string;
  members: IUser[];
  open: boolean;
  handleClose: () => void;
  handleMember: (user: string) => Promise<false | undefined>;
  isOwner: boolean;
}

const MembersModal: React.FC<MembersModalProps> = (
  props: MembersModalProps
) => {
  return (
    <Dialog open={props.open} onClose={props.handleClose}>
      <DialogTitle>{props.title}</DialogTitle>
      <div>
        <DialogContent>
          <List>
            {props.members.map((user) => (
              <ListItem key={user._id.toString()}>
                <ListItemText primary={user.username} />
                {props.isOwner && user !== props.members[0] && (
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => props.handleMember(user._id.toString())}
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClose}>Fechar</Button>
        </DialogActions>
      </div>
    </Dialog>
  );
};

export { MembersModal };
