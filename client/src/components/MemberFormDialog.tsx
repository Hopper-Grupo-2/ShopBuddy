import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Autocomplete,
  Box,
} from "@mui/material";
import { useParams } from "react-router-dom";
import IUser from "../interfaces/iUser";
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

//style DialogTitle
const dialogTitleStyle = {
  backgroundColor: "#FF9900",
  color: "#FFF",
  fontWeight: "bold",
  padding: "5px 10px",
};

const MemberFormDialog: React.FC<FormDialogProps> = (
  props: FormDialogProps
) => {
  const [inviteLink, setInviteLink] = useState("");
  const params = useParams();

  const initialFormData: Record<string, string> = props.fields.reduce(
    (acc, field) => ({ ...acc, [field.id]: "" }),
    {}
  );
  const [formData, setFormData] =
    useState<Record<string, string>>(initialFormData);

  const [users, setUsers] = useState<IUser[]>([]);

  const autocompleteProps = {
    options: users,
  };

  const handleAutocompleteOptions = async (_: any, newInputValue: string) => {
    console.log(newInputValue);
    setFormData((prevFormData) => ({
      ...prevFormData,
      username: newInputValue,
    }));
    const normalizedInputValue = newInputValue.replace(/\s+/g, "");
    if (normalizedInputValue.length < 1) return;
    try {
      const response = await fetch(`/api/users/search/${normalizedInputValue}`);
      const responseObj = await response.json();
      if (response.ok) {
        const matchingUsers: IUser[] = responseObj.data;
        const newAutocompleteOptions = matchingUsers;
        console.log(newAutocompleteOptions);
        setUsers(matchingUsers);
      } else {
        throw responseObj.error;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectUser = (_: any, selectedUser: IUser | string | null) => {
    const user = users.find((user) => user === selectedUser);

    if (!user) return;

    console.log(formData);
    setFormData((prevFormData) => {
      let newFormData = { ...prevFormData };
      Object.keys(prevFormData).forEach((key) => {
        console.log(key, user[key as keyof IUser]);
        //if (key in user)
        if (key !== "quantity")
          newFormData[key] = String(user[key as keyof IUser] ?? "");
      });
      return newFormData;
    });
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
        setInviteLink(host + inviteUrl);
      } else {
        throw inviteData.error;
      }
    } catch (error: any) {
      console.error(error.name, error.message);
    }
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      sx={{ borderRadius: "3px" }}
    >
      <DialogTitle
        sx={{
          ...dialogTitleStyle,
        }}
      >
        {props.title}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {props.fields.map((field) => (
            <Autocomplete
              {...autocompleteProps}
              key={field.id + "autocomplete"}
              id="autocomplete"
              freeSolo
              disableClearable
              value={formData[field.id] || ""}
              getOptionLabel={(option) =>
                typeof option === "string" ? option : option.username
              }
              filterOptions={(options, { inputValue }) => {
                const normalizedInput = inputValue.replace(/\s+/g, "");
                return options.filter((option) => {
                  const concatenatedValue =
                    option.username + option.firstName + option.lastName;
                  const normalizedConcatenatedValue = concatenatedValue.replace(
                    /\s+/g,
                    ""
                  );
                  return normalizedConcatenatedValue.includes(normalizedInput);
                });
              }}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              renderOption={(props, option) => {
                return (
                  <li {...props} key={option._id}>
                    <Box display="flex" justifyContent="flex-start">
                      <Typography variant="body1" sx={{ mr: "16px" }}>
                        {option.username}
                      </Typography>
                      <Typography
                        variant="body1"
                        color="textSecondary"
                        sx={{ mr: "16px" }}
                      >
                        {option.firstName} {option.lastName}
                      </Typography>
                    </Box>
                  </li>
                );
              }}
              onInputChange={handleAutocompleteOptions}
              onChange={handleSelectUser}
              renderInput={(params) => (
                <TextField
                  {...params}
                  autoFocus
                  margin="dense"
                  key={field.id}
                  id={field.id}
                  label={field.label}
                  type={field.type}
                  fullWidth
                  variant="standard"
                />
              )}
            />
          ))}
          <DialogActions sx={{ paddingRight: "0px" }}>
            <Button
              variant="outlined"
              onClick={props.handleClose}
              sx={{
                fontWeight: "bold",
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              type="submit"
              sx={{
                backgroundColor: "#FF9900",
                color: "#FFF",
                fontWeight: "bold",
              }}
            >
              Confirmar
            </Button>
          </DialogActions>
        </DialogContent>
      </form>
      <DialogTitle>Convide através do link</DialogTitle>
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
          sx={{
            mt: 3,
            mb: 2,
            color: "#FFF",
            fontWeight: "bold",
          }}
          onClick={generateInviteLink}
        >
          Gerar link de convite
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export { MemberFormDialog };
