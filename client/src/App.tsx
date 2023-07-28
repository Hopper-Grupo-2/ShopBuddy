import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { RequireAuth } from "./components/RequireAuth";
import Dashboard from "./views/dashboard/Dashboard";
import ListPage from "./views/list/ListPage";
import LoginPage from "./views/login/Login";
import Settings from "./views/settings/SettingsPage";
import SignupPage from "./views/signup/Signup";

export default function App() {
	const router = createBrowserRouter([
		{
			path: "/",
			element: (
				<RequireAuth>
					<Dashboard />
				</RequireAuth>
			),
		},
		{
			path: "/list/:listId",
			element: (
				<RequireAuth>
					<ListPage />
				</RequireAuth>
			),
		},
		{
			path: "/settings",
			element: (
				<RequireAuth>
					<Settings />
				</RequireAuth>
			),
		},
		{
			path: "/login",
			element: <LoginPage />,
		},
		{
			path: "/signup",
			element: <SignupPage />,
		},
	]);

	return <RouterProvider router={router} />;
}
