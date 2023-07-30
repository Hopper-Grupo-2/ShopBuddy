import * as React from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import ExternalLink from "@mui/material/Link";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { UserContext } from "../contexts/UserContext";
import { useState } from "react";
import AlertDialog from "./AlertDialog"

function Copyright(props: any) {
	return (
		<Typography
			variant="body2"
			color="text.secondary"
			align="center"
			{...props}
		>
			{"Copyright © "}
			<ExternalLink
				color="inherit"
				href="https://github.com/Hopper-Grupo-2"
			>
				Hopper Grupo 2
			</ExternalLink>{" "}
			{new Date().getFullYear()}
			{"."}
		</Typography>
	);
}

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
		if (validation !== null){
			setDialogMessage(validation);
			setOpenDialog(true);
			return
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
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<Box
					sx={{
						marginTop: 8,
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					<Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						Cadastre-se no ShopBuddy!
					</Typography>
					<Box
						component="form"
						onSubmit={handleSubmit}
						noValidate
						sx={{ mt: 1 }}
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
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							name="username"
							label="Nome de usuário"
							type="text"
							id="username"
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							name="firstName"
							label="Primeiro nome"
							type="text"
							id="firstName"
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							name="lastName"
							label="Sobrenome"
							type="text"
							id="lastName"
						/>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2 }}
						>
							cadastrar
						</Button>
						<Grid container justifyContent="center">
							<Grid item>
								<Link to="/login">
									{"Já tem uma conta? Entre"}
								</Link>
							</Grid>
						</Grid>
					</Box>
				</Box>
				<Copyright sx={{ mt: 8, mb: 4 }} />

				<AlertDialog
					open={openDialog}
					onClose={handleCloseDialog}
					contentText={dialogMessage}
					buttonText="Fechar"
				/>
			</Container>
		</ThemeProvider>
	);
}
