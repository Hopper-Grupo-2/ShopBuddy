import { useState, useEffect, useRef, useContext } from "react";
import { TextField, IconButton, Typography, Paper, Box } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import styled from "@emotion/styled";
import { UserContext } from "../contexts/UserContext";
import IMessage from "../interfaces/iMessage";
import { SocketContext } from "../contexts/SocketContext";
import PendingIcon from "@mui/icons-material/Pending";
import CheckIcon from "@mui/icons-material/Check";
import LoadingIndicator from "./LoadingIndicator";

const MessageBox = styled(Paper)<{ sender: string }>`
  max-width: 90%;
  margin: 10px;
  padding: 10px;
  align-self: ${(props) =>
    props.sender === "user" ? "flex-end" : "flex-start"};
  background-color: ${(props) =>
    props.sender === "user" ? "#FF9900" : "#FFF1DB"};
  color: ${(props) => (props.sender === "user" ? "white" : "black")};
  word-wrap: break-word;
`;

const MessageForm = styled.form`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 5px;
`;

interface ChatProps {
  listId: string;
}

export default function ChatBox(props: ChatProps) {
  const userContext = useContext(UserContext);
  const socketContext = useContext(SocketContext);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const chatRef = useRef<HTMLDivElement | null>(null);
  const currentMessageRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await fetch(`/api/messages/${props.listId}`, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const messages = await response.json();
        setMessages(messages.data);
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!socketContext?.socket) return;

    socketContext.socket.on("chatMessage", (message: IMessage) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socketContext.socket?.off("chatMessage");
    };
  }, []);

  const [currentMessageId, setCurrentMessageId] = useState(0);
  const createPendingMessage = (textContent: string) => {
    const message: IMessage = {
      _id: currentMessageId.toString(),
      userId: userContext?.user?._id ?? "",
      username: userContext?.user?.username ?? "",
      listId: props.listId,
      textContent: textContent,
      createdAt: new Date().toISOString(),
      pending: true,
    };
    setCurrentMessageId(currentMessageId + 1);
    return message;
  };

  const confirmMessage = (pendingId: string, newMessage: IMessage) => {
    setMessages((prev) => {
      const pendingMessageIndex = prev.findIndex(
        (message) => message._id === pendingId
      );
      prev[pendingMessageIndex] = newMessage;
      return [...prev];
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const currentMessageText = currentMessageRef.current?.value;
    if (!currentMessageText || currentMessageText.trim() === "") return;

    const pendingMessage = createPendingMessage(currentMessageText);
    setMessages((prev) => [...prev, pendingMessage]);

    if (currentMessageRef.current) currentMessageRef.current.value = "";

    try {
      const response = await fetch(`/api/messages/${props.listId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          textContent: currentMessageText,
        }),
      });

      const responseObj = await response.json();
      if (response.ok) {
        const newMessage = responseObj.data;
        confirmMessage(pendingMessage._id, newMessage);
      } else {
        throw responseObj.error;
      }
    } catch (error: any) {
      console.error(error.name, error.message);
    }
  };

  const toLocalTimeString = (isoString: string) => {
    const date = new Date(isoString);
    let hours: string | number = date.getHours();
    let minutes: string | number = date.getMinutes();

    // Ensure double digits
    if (hours < 10) hours = "0" + hours;
    if (minutes < 10) minutes = "0" + minutes;

    return `${hours}:${minutes}`;
  };

  return (
    <Box
      sx={{
        height: "calc(70vh + 14px)",
        maxHeight: {
          xs: "500px", // or you can omit 'xs' if you want the default to be 'auto'
          md: "10000px",
        },
      }}
    >
      {isLoading ? (
        <LoadingIndicator></LoadingIndicator>
      ) : (
        <>
          <Box
            ref={chatRef}
            sx={{
              display: "flex",
              flexDirection: "column",
              overflowY: "scroll",
              height: "calc(100% - 60px)",
            }}
          >
            {messages.map((message) => (
              <MessageBox
                key={message._id}
                sender={
                  message.userId === userContext?.user?._id
                    ? "user"
                    : message.userId
                }
                elevation={3}
              >
                <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                  {message.username}
                </Typography>
                <Box display="flex" alignItems="flex-end">
                  <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
                    {message.textContent}
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <Typography
                      variant="caption"
                      sx={{ ml: "5px", fontSize: "0.7rem" }}
                    >
                      {toLocalTimeString(message.createdAt)}
                    </Typography>
                    {message.userId === userContext?.user?._id &&
                      (message.pending ? (
                        <PendingIcon sx={{ ml: "1px", fontSize: "0.9rem" }} />
                      ) : (
                        <CheckIcon sx={{ ml: "1px", fontSize: "0.9rem" }} />
                      ))}
                  </Box>
                </Box>
              </MessageBox>
            ))}
          </Box>

          <MessageForm onSubmit={handleSubmit}>
            <TextField
              inputRef={currentMessageRef}
              placeholder="Nova mensagem..."
              inputProps={{ maxLength: 240 }}
              autoComplete="off"
              fullWidth
            />

            <IconButton type="submit" color="primary">
              <SendIcon />
            </IconButton>
          </MessageForm>
        </>
      )}
    </Box>
  );
}
