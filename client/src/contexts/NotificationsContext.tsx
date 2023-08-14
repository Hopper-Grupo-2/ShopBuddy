import { createContext } from "react";
import INotification from "../interfaces/iNotification";

interface NotificationsContextProps {
  notifications: INotification[] | null;
  readListNotifications: (listId: string) => Promise<void>;
  fetchNotifications: () => Promise<void>;
}

export const NotificationsContext =
  createContext<NotificationsContextProps | null>(null);
