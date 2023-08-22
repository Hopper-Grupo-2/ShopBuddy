import { useContext, useEffect } from "react";
import { UserContext } from "../contexts/UserContext";
import { SocketProvider } from "../contexts/SocketProvider";
import { NotificationsProvider } from "../contexts/NotificationsProvider";
import { useNavigate } from "react-router-dom";

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
  return Redirect("/login");
}

function Redirect(path: string) {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(path);
  }, []);
  return <></>;
}
