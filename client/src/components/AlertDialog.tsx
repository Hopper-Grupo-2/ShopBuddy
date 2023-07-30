import React from "react";
import {
    Dialog,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
} from "@mui/material";

interface AlertDialogProps {
    open: boolean;
    onClose: () => void;
    contentText: string;
    buttonText: string;
}

const AlertDialog: React.FC<AlertDialogProps> = ({
    open,
    onClose,
    contentText,
    buttonText,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
        <DialogContent>
            <DialogContentText>{contentText}</DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>{buttonText}</Button>
        </DialogActions>
    </Dialog>
  );
};

export default AlertDialog;