import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./views/dashboard/Dashboard";
import ListPage from "./views/list/ListPage";
import LoginPage from "./views/login/Login";

import "./App.css";
import Settings from "./views/settings/SettingsPage";

export default function App() {
	const router = createBrowserRouter([
		{
			path: "/",
			element: <Dashboard />,
		},
		{
			path: "/list/:listId",
			element: <ListPage />,
		},
		{
			path: "/settings",
			element: <Settings />,
		},
		{
			path: "/login",
			element: <LoginPage />,
		},
	]);

	return <RouterProvider router={router} />;
}
