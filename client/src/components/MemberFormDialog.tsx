import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
interface FormField {
  id: string;
  label: string;
  type: string;
}

interface FormDialogProps {
  title: string;
  fields: FormField[];
  open: boolean;
  handleClose: () => void;
  handleSubmit: (formData: Record<string, string>) => Promise<boolean>;
}

const MemberFormDialog: React.FC<FormDialogProps> = (
  props: FormDialogProps
) => {
  const [inviteLink, setInviteLink] = React.useState("");
  //const [inviteButtonColor, setInviteButtonColor] = React.useState("");
  const params = useParams();

  const initialFormData: Record<string, string> = props.fields.reduce(
    (acc, field) => ({ ...acc, [field.id]: "" }),
    {}
  );
  const [formData, setFormData] =
    useState<Record<string, string>>(initialFormData);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [event.target.id]: event.target.value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const success = await props.handleSubmit(formData);
    if (success) {
      setFormData(initialFormData);
      props.handleClose();
    }
  };

  const generateInviteLink = async () => {
    try {
      const response = await fetch(`/api/invites/${params.listId}`, {
        method: "POST",
        credentials: "include",
      });

      const inviteData = await response.json();
      if (response.ok) {
        const inviteUrl: string = inviteData.data.url;
        const host = window.location.host;
        await navigator.clipboard.writeText(host + inviteUrl);
        setInviteLink(host + inviteUrl);
      } else {
        throw inviteData.error;
      }
    } catch (error: any) {
      console.error(error.name, error.message);
    }
  };

  return (
    <Dialog open={props.open} onClose={props.handleClose}>
      <DialogTitle>{props.title}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {props.fields.map((field) => (
            <TextField
              autoFocus
              margin="dense"
              key={field.id}
              id={field.id}
              label={field.label}
              type={field.type}
              fullWidth
              variant="standard"
              value={formData[field.id] || ""}
              onChange={handleChange}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClose}>Cancelar</Button>
          <Button type="submit">Confirmar</Button>
        </DialogActions>
      </form>
      <DialogTitle>...ou gerar link de convite</DialogTitle>
      <DialogContent>
        <Typography
          variant="body1"
          sx={{ textAlign: "center", wordWrap: "break-word" }}
        >
          {inviteLink}
        </Typography>
        <Button
          type="button"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={generateInviteLink}
        >
          Gerar link de convite
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export { MemberFormDialog };
