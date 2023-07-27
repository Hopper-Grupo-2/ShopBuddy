import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { UserProvider } from "./contexts/UserProvider.tsx";
import { SocketProvider } from "./contexts/SocketProvider.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<UserProvider>
			<SocketProvider>
				<App />
			</SocketProvider>
		</UserProvider>
	</React.StrictMode>
);
