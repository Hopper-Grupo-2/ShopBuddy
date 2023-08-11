import * as React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";
import MailIcon from '@mui/icons-material/Mail';
import HttpsIcon from '@mui/icons-material/Https';
import PersonIcon from '@mui/icons-material/Person';
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
          overflow: "hidden",
        }}
      >
        <CardMedia
          component="img"
          alt="Imagem de fundo"
          image="./VERSAO01_SHOP.png"
          sx={{
            height: "100%",
          }}
        />
      </Box>
      <Box
          sx={{
            height: "100%",
            width: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          >
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              width: "75%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              component="h1"
              variant="h5"
              sx={{
                marginTop: { xs: "3vh", md: 0 },
                fontSize: {xs: "6vw", md: "4vw" },
                fontWeight: "bold",
                fontFamily: "'Open Sans'",
                whiteSpace: "nowrap",
                marginBottom: "10%"
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
              <MailIcon
                sx={{ width: 40, height: 40, marginRight: "0.5vw" }}
              />
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
              <HttpsIcon
                sx={{ width: 40, height: 40, marginRight: "0.5vw" }}
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
                  marginBottom: "2vh",
                  borderRadius: "8px",
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
              <PersonIcon
                sx={{ width: 40, height: 40, marginRight: "0.5vw" }}
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
                  width: "93%",
                  marginBottom: "2vh",
                  borderRadius: "8px",
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
                background: "orange",
                display: "flex",
                alignItems: "center",
                marginTop: "3vh",
                marginBottom: "2vh",
                fontSize: "1.3rem",
                fontWeight: "600",
                width: "350px",
                height: "4rem",
                padding: "1rem",
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
