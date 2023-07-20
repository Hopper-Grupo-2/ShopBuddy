import React, { useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import IUser from "../interfaces/iUser";
import { Box, CircularProgress } from "@mui/material";

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<IUser | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchCurrentUser = async () => {
			const response = await fetch("/api/users/me", {
				method: "GET",
				credentials: "include", // Ensure credentials are sent
			});

			if (response.ok) {
				const userData = await response.json();
				setUser(userData);
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
			} else {
				throw new Error(responseObj.error);
			}
		} catch (error) {
			console.error("Error logging in", error);
			alert("Failed to log in, please try again.");
		}
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
		<UserContext.Provider value={{ user, setUser, login }}>
			{children}
		</UserContext.Provider>
	);
};
