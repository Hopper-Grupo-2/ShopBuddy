import React, { useContext } from "react";
import LoginPage from "../views/login/Login";
import { UserContext } from "../contexts/UserContext";
import { SocketProvider } from "../contexts/SocketProvider";

interface Props {
	children: React.ReactNode;
}

export function RequireAuth(props: Props) {
	const context = useContext(UserContext); //here i want the user provided by the context
	if (context?.user !== null) {
		return <SocketProvider>{props.children}</SocketProvider>;
	}
	return <LoginPage />;
}
