import React, { useState , useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Autocomplete,
} from "@mui/material";
import { IUserAll } from "../interfaces/iUser";


interface FormField {
  id: string;
  label: string;
  type: string;
  autocomplete?: {
    members: any[];
    getOptionLabel: (option: any) => string;
  };
}

interface FormDialogProps {
  title: string;
  fields: FormField[];
  open: boolean;
  handleClose: () => void;
  handleSubmit: (formData: Record<string, string>) => Promise<boolean>;
}

const SearchUserDialog: React.FC<FormDialogProps> = (props: FormDialogProps) => {
  const initialFormData: Record<string, string> = props.fields.reduce(
    (acc, field) => ({ ...acc, [field.id]: "" }),
    {}
  );
  const [formData, setFormData] = useState<Record<string, string>>(initialFormData);
  const [allUsers, setallUsers] = useState<Array<IUserAll>>([]);

  const usersList = async () => {
    const response = await fetch(`/api/users`, {
      method: "GET",
      credentials: "include",
    });

    if (response.ok) {
      const userList = await response.json();
      setallUsers(userList.data)
      return 
      
    } else {
      throw "Error";
    }
  };

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

  useEffect(() => {
    usersList()
  }, []);

  return (
    <Dialog open={props.open} onClose={props.handleClose}>
      <DialogTitle>{props.title}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {props.fields.map((field) =>
            field.autocomplete ? (
              <Autocomplete
                id={field.id}
                options={allUsers.filter(
                  user => !field.autocomplete!.members.some(member => member.username === user.username)
                )}
                getOptionLabel={(option: IUserAll) => option.username}
                renderInput={(params) => (
                  <TextField {...params} label={field.label} variant="standard" fullWidth />
                )}
                onChange={(_, newValue: IUserAll | null) => {
                  if (newValue) {
                    setFormData((prevFormData) => ({
                      ...prevFormData,
                      [field.id]: newValue.username,
                    }));
                  }
                }}
              />
            ) : (
              <TextField
                id={field.id}
                label={field.label}
                type={field.type}
                fullWidth
                value={formData[field.id] || ""}
                onChange={handleChange}
              />
            )
          )}

        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClose}>Cancelar</Button>
          <Button type="submit">Confirmar</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export { SearchUserDialog };
