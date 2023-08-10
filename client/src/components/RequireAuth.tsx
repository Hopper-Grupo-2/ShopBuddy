import { useContext } from "react";
import LoginPage from "../views/login/Login";
import { UserContext } from "../contexts/UserContext";
import { SocketProvider } from "../contexts/SocketProvider";
import { NotificationsProvider } from "../contexts/NotificationsProvider";

interface Props {
  children: React.ReactNode;
}

export function RequireAuth(props: Props) {
  const context = useContext(UserContext);
  if (context?.user !== null) {
    return (
      <SocketProvider>
        <NotificationsProvider>{props.children}</NotificationsProvider>
      </SocketProvider>
    );
  }
  return <LoginPage />;
}
