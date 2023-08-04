import * as React from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
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
import LoadingButton from "./LoadingButton"

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

export default function LogIn() {
	const context = React.useContext(UserContext);
	const navigate = useNavigate();

	const [openDialog, setOpenDialog] = useState(false);
  	const [dialogMessage, setDialogMessage] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setLoading(true)
		const data = new FormData(event.currentTarget);
		/* console.log({
			email: data.get("email"),
			password: data.get("password"),
		}); */
		const credentials = {
			email: data.get("email"),
			password: data.get("password"),
		};

		if (credentials.email === null || credentials.email === "") {
			setDialogMessage("Por favor, insira um e-mail");
			setOpenDialog(true);
			setLoading(false)
			return;
		}

		if (credentials.password === null || credentials.password === "") {
			setDialogMessage("Por favor, insira uma senha");
			setOpenDialog(true);
			setLoading(false)
			return;
		}

		// i want to call login here
		const loggedIn = await context?.login(
			credentials.email.toString(),
			credentials.password.toString()
		);

		if (loggedIn) navigate("/");
		setLoading(false)
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
						Bem vindo ao ShopBuddy!
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
						<LoadingButton
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2 }}
							loading={loading}
						>
							entrar
						</LoadingButton>
						<Grid container justifyContent="center">
							<Grid item>
								<Link to="/signup">
									{"Ainda não tem uma conta? Cadastre-se"}
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
