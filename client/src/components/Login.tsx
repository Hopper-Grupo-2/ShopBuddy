import * as React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MailIcon from "@mui/icons-material/Mail";
import HttpsIcon from "@mui/icons-material/Https";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { UserContext } from "../contexts/UserContext";
import AlertDialog from "./AlertDialog";
import { CardMedia } from "@mui/material";
export default function LogIn() {
  const context = React.useContext(UserContext);
  const navigate = useNavigate();
  const dialogMessage = "";

  const [openDialog, setOpenDialog] = React.useState(false);
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>(
    {}
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const credentials = {
      email: data.get("email"),
      password: data.get("password"),
    };

    const errors = validateCredentials(credentials);
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    const loggedIn = await context?.login(
      credentials.email!.toString(),
      credentials.password!.toString()
    );

    if (loggedIn) navigate("/");
  };

  const validateCredentials = (credentials: any): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!credentials.email || !/^[^@]+@[^@]+\.[^@]+$/.test(credentials.email)) {
      errors.email = "Por favor, insira um e-mail válido";
    }

    if (!credentials.password) {
      errors.password = "Por favor, insira uma senha";
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
        width: "100vw",
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
            Seja Bem-vindo(a)!
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
              sx={{
                width: 40,
                height: 40,
                marginRight: "0.5vw",
                marginBottom: "4%",
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="E-mail cadastrado"
              name="email"
              autoComplete="email"
              autoFocus
              sx={{
                width: "93%",
                height: "100%",
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
                fontSize: "28px",
                borderRadius: "8px",
              }}
              error={Boolean(formErrors.password)}
              helperText={formErrors.password}
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
            Entrar
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
