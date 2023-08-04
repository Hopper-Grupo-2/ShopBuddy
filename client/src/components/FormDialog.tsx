import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
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

const FormDialog: React.FC<FormDialogProps> = (props: FormDialogProps) => {
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
    </Dialog>
  );
};

export { FormDialog };
