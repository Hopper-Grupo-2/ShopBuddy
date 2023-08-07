import * as React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { UserContext } from "../contexts/UserContext";
import { useState } from "react";
import AlertDialog from "./AlertDialog";
import { CardMedia } from "@mui/material";

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function SignUp() {
  const context = React.useContext(UserContext);
  const navigate = useNavigate();

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
    const credentials = {
      email: data.get("email"),
      password: data.get("password"),
      username: data.get("username"),
      firstName: data.get("firstName"),
      lastName: data.get("lastName"),
    };

    const validation = validateCredentials(credentials);
    if (validation !== null) {
      setDialogMessage(validation);
      setOpenDialog(true);
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

  const validateCredentials = (credentials: any) => {
    if (credentials.email === null) {
      return "Por favor, insira um e-mail";
    }
    if (credentials.password === null) {
      return "Por favor, insira uma senha";
    }
    if (credentials.username === null) {
      return "Por favor, insira um nome de usuário";
    }
    if (credentials.firstName === null) {
      return "Por favor, insira seu nome";
    }
    if (credentials.lastName === null) {
      return "Por favor, insira seu sobrenome";
    }
    return null;
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Box
        component="main"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          padding: 0,
          minHeight: "100vh",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column-reverse", md: "row" },
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <CardMedia
            component="img"
            alt="Imagem de fundo"
            height="auto"
            image="../src/assets/VERSAO01_SHOP.png"
            sx={{
              width: "61rem",
              maxWidth: "100%",
            }}
          />

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              flex: "50%",
              padding: "5rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              component="h1"
              variant="h5"
              sx={{
                marginTop: "3vh",
                height: "160px",
                fontSize: "64px",
                fontWeight: "bold",
                fontFamily: "'Open Sans'",
              }}
            >
              Cadastre-se!
            </Typography>
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
                width: "400px",
				border: "1px solid black",
              }}
            />
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
                width: "400px",
				border: "1px solid black",
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="username"
              label="Nome de usuário"
              type="text"
              id="username"
			  sx={{
                width: "400px",
				border: "1px solid black",
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="firstName"
              label="Primeiro nome"
              type="text"
              id="firstName"
			  sx={{
                width: "400px",
				border: "1px solid black",
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="lastName"
              label="Sobrenome"
              type="text"
              id="lastName"
			  sx={{
                width: "400px",
				border: "1px solid black",
              }}
            />
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
				background: "orange",
				marginTop: "3vh",
				marginBottom: "2vh",
				width: "350px",
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
    </ThemeProvider>
  );
}
