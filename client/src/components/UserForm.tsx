import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { UserContext } from "../contexts/UserContext";
import AlertDialog from "./AlertDialog"
import LoadingButton from "./LoadingButton"

export default function UserForm() {
	const context = useContext(UserContext);
	const navigate = useNavigate();

	const [openDialog, setOpenDialog] = useState(false);
	const [dialogMessage, setDialogMessage] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setLoading(true)

		const data = new FormData(event.currentTarget);
		const credentials = {
			email: data.get("email"),
			username: data.get("username"),
			oldPassword: data.get("oldPassword"),
			newPassword: data.get("newPassword"),
			firstName: data.get("firstName"),
			lastName: data.get("lastName"),
		};

		const validation = validateCredentials(credentials);
		if (validation !== null){
			setDialogMessage(validation);
    		setOpenDialog(true);
			setLoading(false)
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

	const validateCredentials = (credentials: any) => {
		if (credentials.email === null) {
			return "Por favor, insira um e-mail";
		}
		if (credentials.oldPassword === null) {
			return "Por favor, insira uma senha";
		}
		if (credentials.newPassword === null) {
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
				name="oldPassword"
				label="Senha atual"
				type="password"
				id="oldPassword"
				autoComplete="current-password"
			/>
			<TextField
				margin="normal"
				required
				fullWidth
				name="newPassword"
				label="Nova senha (caso não deseje alterar a senha, repita a senha anterior)"
				type="password"
				id="newPassword"
				autoComplete="new-password"
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
			<LoadingButton
				type="submit"
				fullWidth
				variant="contained"
				sx={{ mt: 3, mb: 2 }}
				loading={loading}
			>
				salvar alterações
			</LoadingButton>

			<AlertDialog
				open={openDialog}
				onClose={handleCloseDialog}
				contentText={dialogMessage}
				buttonText="Fechar"
			/>
		</Box>
	);
}
