import React, { useState } from "react";
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
import IUser from "../interfaces/iUser";

interface MembersModalProps {
    title: string;
    members: IUser[];
    open: boolean;
    handleClose: () => void;
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
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handleClose}>Fechar modal</Button>
                </DialogActions>
            </div>
        </Dialog>
    );
};

export { MembersModal };
