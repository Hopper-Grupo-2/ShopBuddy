import React from "react";
import INotification from "../interfaces/iNotification";

interface NotificationsContextProps {
  notifications: INotification[] | null;
  readListNotifications: (listId: string) => Promise<void>;
  //setSocket: React.Dispatch<React.SetStateAction<Socket | null>>;
}

export const NotificationsContext =
  React.createContext<NotificationsContextProps | null>(null);
