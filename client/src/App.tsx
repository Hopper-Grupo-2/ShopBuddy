import "./App.css";
import {
  RouterProvider,
  createBrowserRouter,
  useNavigate,
} from "react-router-dom";
import { RequireAuth } from "./components/RequireAuth";
import Dashboard from "./views/dashboard/Dashboard";
import ListPage from "./views/list/ListPage";
import LoginPage from "./views/login/Login";
import Settings from "./views/settings/SettingsPage";
import SignupPage from "./views/signup/Signup";
import Notifications from "./views/notifications/Notifications";
import InvitePage from "./views/invites/Invites";
import { useEffect } from "react";

export default function App() {
  //const navigate = useNavigate();

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
      path: "/notifications",
      element: (
        <RequireAuth>
          <Notifications />
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
      path: "/invites/:inviteId",
      element: (
        <RequireAuth>
          <InvitePage />
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
    {
      path: "/*", // Catch-all route
      element: <NotFound />,
    },
  ]);

  return <RouterProvider router={router} />;
}

function NotFound() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/");
  }, []);
  return <></>;
}
