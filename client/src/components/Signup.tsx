import * as React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";
import MailIcon from "@mui/icons-material/Mail";
import HttpsIcon from "@mui/icons-material/Https";
import PersonIcon from "@mui/icons-material/Person";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { UserContext } from "../contexts/UserContext";
import { useState } from "react";
import AlertDialog from "./AlertDialog";
import { CardMedia } from "@mui/material";

export default function SignUp() {
  const context = React.useContext(UserContext);
  const navigate = useNavigate();
  const dialogMessage = "";

  const [openDialog, setOpenDialog] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const credentials = {
      email: data.get("email"),
      password: data.get("password"),
      username: data.get("username"),
      firstName: data.get("firstName"),
      lastName: data.get("lastName"),
    };

    const errors = validateCredentials(credentials);
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    const signedUp = await context?.signup(
      credentials.email!.toString(),
      credentials.password!.toString(),
      credentials.username!.toString(),
      credentials.firstName!.toString(),
      credentials.lastName!.toString()
    );

    if (signedUp) navigate("/login");
  };

  const validateCredentials = (credentials: any): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!credentials.email || !/^[^@]+@[^@]+\.[^@]+$/.test(credentials.email)) {
      errors.email = "Por favor, insira um e-mail válido";
    }

    if (
      !credentials.password ||
      credentials.password < 3 ||
      credentials.password.length > 16
    ) {
      errors.password = "A senha deve ter entre 3 e 16 caracteres";
    } else if (!/(?=.*[A-Za-z])(?=.*[0-9])/.test(credentials.password)) {
      errors.password =
        "A nova senha deve conter pelo menos uma letra e um número";
    }

    if (
      !credentials.username ||
      credentials.username.length < 3 ||
      credentials.username.length > 15
    ) {
      errors.username = "Nome de usuário deve ter entre 3 e 15 caracteres";
    } else if (!/^[a-zA-Z0-9]*$/.test(credentials.username)) {
      errors.username = "Nome de usuário deve conter apenas letras e números.";
    }

    if (
      !credentials.firstName ||
      !/^[A-Za-z]+$/i.test(credentials.firstName) ||
      credentials.firstName < 3 ||
      credentials.firstName.length > 15
    ) {
      errors.firstName =
        "O primeiro nome deve conter apenas letras e ter entre 3 e 15 caracteres";
    }

    if (
      !credentials.lastName ||
      !/^[A-Za-z]+$/i.test(credentials.lastName) ||
      credentials.lastName < 3 ||
      credentials.lastName.length > 15
    ) {
      errors.lastName =
        "O último nome deve conter apenas letras e ter entre 3 e 15 caracteres";
    }

    return errors;
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column-reverse", md: "row" },
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <Box
        sx={{
          height: "100%",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <CardMedia
          component="img"
          alt="Imagem de fundo"
          image="./VERSAO01_SHOP.png"
          sx={{
            height: "100%",
            objectFit: "cover",
            objectPosition: "top",
          }}
        />
      </Box>
      <Box
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{
            width: "80%",
            minWidth: "350px",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            component="h1"
            variant="h1"
            sx={{
              marginTop: { xs: "3vh", md: 0 },
              fontSize: { xs: "2.5rem", md: "3rem" },
              fontWeight: "bold",
              fontFamily: "'Open Sans'",
              whiteSpace: "nowrap",
              marginBottom: "10%",
            }}
          >
            Cadastre-se!
          </Typography>
          <Box
            component="div"
            sx={{
              width: "90%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MailIcon sx={{ width: 40, height: 40, marginRight: "0.5vw" }} />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Endereço de e-mail"
              name="email"
              autoComplete="email"
              autoFocus
              sx={{
                width: "93%",
                marginBottom: "2vh",
                borderRadius: "8px",
              }}
              error={Boolean(formErrors.email)}
              helperText={formErrors.email}
            />
          </Box>
          <Box
            component="div"
            sx={{
              width: "90%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <HttpsIcon sx={{ width: 40, height: 40, marginRight: "0.5vw" }} />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type="password"
              id="password"
              autoComplete="current-password"
              sx={{
                width: "93%",
                marginBottom: "2vh",
                borderRadius: "8px",
              }}
              error={Boolean(formErrors.password)}
              helperText={formErrors.password}
            />
          </Box>
          <Box
            component="div"
            sx={{
              width: "90%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PersonIcon sx={{ width: 40, height: 40, marginRight: "0.5vw" }} />
            <TextField
              margin="normal"
              required
              fullWidth
              name="username"
              label="Nome de usuário"
              type="text"
              id="username"
              sx={{
                width: "93%",
                marginBottom: "2vh",
                borderRadius: "8px",
              }}
              error={Boolean(formErrors.username)}
              helperText={formErrors.username}
            />
          </Box>
          <Box
            component="div"
            sx={{
              width: "90%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box sx={{ width: 40, height: 40, marginRight: "0.5vw" }}></Box>
            <TextField
              margin="normal"
              required
              fullWidth
              name="firstName"
              label="Primeiro nome"
              type="text"
              id="firstName"
              sx={{
                width: "93%",
                marginBottom: "2vh",
                borderRadius: "8px",
              }}
              error={Boolean(formErrors.firstName)}
              helperText={formErrors.firstName}
            />
          </Box>
          <Box
            component="div"
            sx={{
              width: "90%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box sx={{ width: 40, height: 40, marginRight: "0.5vw" }}></Box>
            <TextField
              margin="normal"
              required
              fullWidth
              name="lastName"
              label="Sobrenome"
              type="text"
              id="lastName"
              sx={{
                width: "93%",
                marginBottom: "2vh",
                borderRadius: "8px",
              }}
              error={Boolean(formErrors.lastName)}
              helperText={formErrors.lastName}
            />
          </Box>

          <Grid container justifyContent="center">
            <Grid item>
              <Typography>
                Já tem uma conta?{" "}
                <Link to="/login" style={{ color: "orange" }}>
                  Entre
                </Link>
              </Typography>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: "#FF9900",
              textTransform: "capitalize",
              fontWeight: "bold",
              fontSize: "1.25rem",
              whiteSpace: "nowrap",
              color: "#FFF",
              mt: "10px",
              mb: "20px",
              width: "80%",
            }}
          >
            Cadastrar
          </Button>
        </Box>
      </Box>

      <AlertDialog
        open={openDialog}
        onClose={handleCloseDialog}
        contentText={dialogMessage}
        buttonText="Fechar"
      />
    </Box>
  );
}
