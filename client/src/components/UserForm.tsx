import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { UserContext } from "../contexts/UserContext";
import AlertDialog from "./AlertDialog";

export default function UserForm() {
  const context = useContext(UserContext);
  const navigate = useNavigate();
  const dialogMessage = "";

  const [openDialog, setOpenDialog] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const credentials = {
      email: data.get("email"),
      username: data.get("username"),
      oldPassword: data.get("oldPassword"),
      newPassword: data.get("newPassword"),
      firstName: data.get("firstName"),
      lastName: data.get("lastName"),
    };

    const errors = validateCredentials(credentials);
    setFormErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      return;
    }

    const edited = await context?.editUser(
      context.user?._id!,
      credentials.email!.toString(),
      credentials.username!.toString(),
      credentials.oldPassword!.toString(),
      credentials.newPassword!.toString(),
      credentials.firstName!.toString(),
      credentials.lastName!.toString()
    );

    if (edited) navigate("/");
  };

  const validateCredentials = (credentials: any): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!credentials.email || !/^[^@]+@[^@]+\.[^@]+$/.test(credentials.email)) {
      errors.email = "Por favor, insira um e-mail válido";
    }

    if (!credentials.username || credentials.username.length < 3 || credentials.username.length > 15) {
      errors.username = "Nome de usuário deve ter entre 3 e 15 caracteres";
    }

    if (!credentials.oldPassword || credentials.oldPassword < 3 || credentials.oldPassword.length > 16) {
      errors.oldPassword = "A senha deve ter entre 3 e 16 caracteres";
    }

    if (!credentials.newPassword || credentials.newPassword < 3 || credentials.newPassword.length > 16) {
      errors.newPassword = "A nova senha deve ter entre 3 e 16 caracteres";
    }

    if (!credentials.firstName || !/^[A-Za-z]+$/i.test(credentials.firstName) || credentials.firstName < 3 || credentials.firstName.length > 15) {
      errors.firstName = "O primeiro nome deve conter apenas letras e ter entre 3 e 15 caracteres";
    }

    if (!credentials.lastName  || !/^[A-Za-z]+$/i.test(credentials.lastName) || credentials.lastName < 3 || credentials.lastName.length > 15) {
      errors.lastName = "O último nome deve conter apenas letras e ter entre 3 e 15 caracteres";
    }

    return errors;
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{ mt: 1, maxWidth: 450 }}
    >
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Endereço de e-mail"
        name="email"
        autoComplete="email"
        autoFocus
        defaultValue={context?.user?.email}
        error={Boolean(formErrors.email)}
        helperText={formErrors.email}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="username"
        label="Nome de usuário"
        type="text"
        id="username"
        defaultValue={context?.user?.username}
        error={Boolean(formErrors.username)}
        helperText={formErrors.username}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="oldPassword"
        label="Senha atual"
        type="password"
        id="oldPassword"
        autoComplete="current-password"
        error={Boolean(formErrors.oldPassword)}
        helperText={formErrors.oldPassword}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="newPassword"
        label="Nova senha"
        type="password"
        id="newPassword"
        autoComplete="new-password"
        error={Boolean(formErrors.newPassword)}
        helperText={formErrors.newPassword}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="firstName"
        label="Primeiro nome"
        type="text"
        id="firstName"
        defaultValue={context?.user?.firstName}
        error={Boolean(formErrors.firstName)}
        helperText={formErrors.firstName}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="lastName"
        label="Sobrenome"
        type="text"
        id="lastName"
        defaultValue={context?.user?.lastName}
        error={Boolean(formErrors.lastName)}
        helperText={formErrors.lastName}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{
          backgroundColor: "#FF9900",
          mt: 3,
          mb: 2,
          textTransform: "capitalize",
          fontWeight: "bold",
          color: "#FFF",
        }}
      >
        Confirmar
      </Button>

      <AlertDialog
        open={openDialog}
        onClose={handleCloseDialog}
        contentText={dialogMessage}
        buttonText="Fechar"
      />
    </Box>
  );
}
