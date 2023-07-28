import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { UserContext } from "../contexts/UserContext";

export default function UserForm() {
	const context = useContext(UserContext);
	const navigate = useNavigate();

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

		const validation = validateCredentials(credentials);
		if (validation !== null) return alert(validation);

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
			<Button
				type="submit"
				fullWidth
				variant="contained"
				sx={{ mt: 3, mb: 2 }}
			>
				salvar alterações
			</Button>
		</Box>
	);
}
