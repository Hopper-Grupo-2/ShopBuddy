import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./views/dashboard/Dashboard";
import List from "./views/list/List";
import Login from "./views/login/Login";

import "./App.css";

export default function App() {
	const router = createBrowserRouter([
		{
			path: "/",
			element: <Dashboard />,
		},
		{
			path: "/list",
			element: <List />,
		},
		{
			path: "/login",
			element: <Login />,
		},
	]);

	return <RouterProvider router={router} />;
}
