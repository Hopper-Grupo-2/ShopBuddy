import * as React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { UserContext } from "../contexts/UserContext";
import AlertDialog from "./AlertDialog";
import { Avatar, CardMedia, ThemeProvider, createTheme } from "@mui/material";
const defaultTheme = createTheme();
export default function LogIn() {
  const context = React.useContext(UserContext);
  const navigate = useNavigate();

  const [openDialog, setOpenDialog] = React.useState(false);
  const [dialogMessage, setDialogMessage] = React.useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const credentials = {
      email: data.get("email"),
      password: data.get("password"),
    };

    if (!credentials.email) {
      setDialogMessage("Por favor, insira um e-mail");
      setOpenDialog(true);
      return;
    }

    if (!credentials.password) {
      setDialogMessage("Por favor, insira uma senha");
      setOpenDialog(true);
      return;
    }

    const loggedIn = await context?.login(
      credentials.email.toString(),
      credentials.password.toString()
    );

    if (loggedIn) navigate("/");
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
              width: "500px",
              flex: "50%",
              padding: "5rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
            >
            <Typography
              variant="h5"
              sx={{
                marginTop: { xs: "3vh", md: 0 },
                marginBottom: "10vh",
                fontSize: {xs: "6vw", md: "4vw" },
                fontWeight: "bold",
                fontFamily: "'Open Sans'",
                whiteSpace: "nowrap"
              }}
            >
              Seja Bem vindo!
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
              <Avatar
                src="./src/assets/icons/email-icon.svg"
                alt="Ícone"
                sx={{ width: 24, height: 24,marginRight: "0.5vw" }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Nome de Usuário"
                name="email"
                autoComplete="email"
                autoFocus
                sx={{
                  width: "93%",
                  border: "2px solid #000000",
                  marginBottom: "2vh"
                }}
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
              <Avatar
                src="./src/assets/icons/lock-icon.svg"
                alt="Ícone"
                sx={{ width: 24, height: 24, marginRight: "0.5vw"}}
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
                  width: "93%",
                  border: "2px solid #000000",
                  marginBottom: "2vh"
                }}
              />
            </Box>
            <Grid container justifyContent="center">
              <Grid item>
                <Typography variant="body1">
                  Ainda não tem uma conta?{" "}
                  <Link to="/signup" style={{ color: "orange" }}>
                    Cadastre-se
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
                display: "flex",
                alignItems: "center",
                marginTop: "3vh",
                marginBottom: "2vh",
                fontSize: "1.3rem",
                fontWeight: "600",
                width: "350px",
                height: "4rem",
                padding: "1rem"
              }}
            >
              entrar
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
