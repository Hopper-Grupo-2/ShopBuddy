import React from "react";
import IUser from "../interfaces/iUser";

interface UserContextProps {
	user: IUser | null;
	setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
	login: (email: string, password: string) => Promise<boolean>;
	signup: (
		email: string,
		password: string,
		username: string,
		firstName: string,
		lastName: string
	) => Promise<boolean>;
	editUser: (
		userId: string,
		email: string,
		username: string,
		oldPassword: string,
		newPassword: string,
		firstName: string,
		lastName: string
	) => Promise<boolean>;
}

export const UserContext = React.createContext<UserContextProps | null>(null);
