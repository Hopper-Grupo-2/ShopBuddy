import React, { useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import IUser from "../interfaces/iUser";
import { Box, CircularProgress } from "@mui/material";
import AlertDialog from "../components/AlertDialog"

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<IUser | null>(null);
	const [loading, setLoading] = useState(true);

	const [openDialog, setOpenDialog] = useState(false);
	const [dialogMessage, setDialogMessage] = useState("");

	useEffect(() => {
		const fetchCurrentUser = async () => {
			const response = await fetch("/api/users/me", {
				method: "GET",
				credentials: "include", // Ensure credentials are sent
			});

			if (response.ok) {
				const userData = await response.json();
				setUser(userData.data);
			}
			setLoading(false);
		};

		fetchCurrentUser();
	}, []);

	const login = async (email: string, password: string) => {
		try {
			const response = await fetch("/api/users/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			});

			const responseObj = await response.json();
			if (response.ok) {
				setUser(responseObj.data);
				return true;
			} else {
				throw responseObj.error;
			}
		} catch (error: any) {
			console.error(error.name, error.message);
			setDialogMessage("Failed to log in: " + error.message);
    		setOpenDialog(true);
			return false;
		}
	};

	const signup = async (
		email: string,
		password: string,
		username: string,
		firstName: string,
		lastName: string
	) => {
		try {
			const response = await fetch("/api/users/signup", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email,
					password,
					username,
					firstName,
					lastName,
				}),
			});

			const responseObj = await response.json();
			if (response.ok) {
				setDialogMessage("Usuário cadastrado com sucesso!");
    			setOpenDialog(true);
				return true;
			} else {
				throw responseObj.error;
			}
		} catch (error: any) {
			console.error(error.name, error.message);
			setDialogMessage("Failed to create user: " + error.message);;
    		setOpenDialog(true);
			return false;
		}
	};

	const editUser = async (
		userId: string,
		email: string,
		username: string,
		oldPassword: string,
		newPassword: string,
		firstName: string,
		lastName: string
	) => {
		try {
			console.log({
				email,
				username,
				oldPassword,
				newPassword,
				firstName,
				lastName,
			});
			const response = await fetch(`/api/users/${userId}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email,
					username,
					oldPassword,
					newPassword,
					firstName,
					lastName,
				}),
			});

			const responseObj = await response.json();
			if (response.ok) {
				setDialogMessage("Usuário atualizado com sucesso!");
    			setOpenDialog(true);
				return true;
			} else {
				throw responseObj.error;
			}
		} catch (error: any) {
			console.error(error.name, error.message);
			setDialogMessage("Failed to edit user: " + error.message);
    		setOpenDialog(true);
			return false;
		}
	};

	const handleCloseDialog = () => {
		setOpenDialog(false);
	};

	if (loading) {
		return (
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					width: "100vw",
					height: "100vh",
				}}
			>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<UserContext.Provider
			value={{ user, setUser, login, signup, editUser }}
		>
			{children}
			<AlertDialog
				open={openDialog}
				onClose={handleCloseDialog}
				contentText={dialogMessage}
				buttonText="Fechar"
			/>
		</UserContext.Provider>
	);
};
