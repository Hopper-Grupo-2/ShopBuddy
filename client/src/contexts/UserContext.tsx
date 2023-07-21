import React from "react";
import IUser from "../interfaces/iUser";

interface UserContextProps {
	user: IUser | null;
	setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
	login: (email: string, password: string) => Promise<void>; // Add this line
}

export const UserContext = React.createContext<UserContextProps | null>(null);
