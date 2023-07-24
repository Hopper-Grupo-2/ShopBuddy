import React, { useState, useEffect, useRef } from "react";
import { TextField, IconButton, Typography, Paper } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import styled from "@emotion/styled";

interface Message {
	id: number;
	text: string;
	sender: string;
}

const ChatContainer = styled.div`
	display: flex;
	flex-direction: column;
	width: 450px;
	padding: 20px;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
	background-color: white;
	margin-left: 20px;

	@media (max-width: 768px) {
		width: 100%;
		margin-left: 0;
	}
`;

const ChatSection = styled.div`
	height: calc(70vh - 120px);
	overflow-y: scroll;
	display: flex;
	flex-direction: column;

	@media (max-width: 768px) {
		height: calc(70vh - 60px);
	}
`;

const MessageBox = styled(Paper)<{ sender: string }>`
	max-width: 90%;
	margin: 10px;
	padding: 20px;
	align-self: ${(props) =>
		props.sender === "user" ? "flex-end" : "flex-start"};
	background-color: ${(props) =>
		props.sender === "user" ? "#4caf50" : "#f1f1f1"};
	color: ${(props) => (props.sender === "user" ? "white" : "black")};
`;

const MessageForm = styled.form`
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const Chat: React.FC = () => {
	const [messages, setMessages] = useState<Message[]>([]);
	const [currentMessage, setCurrentMessage] = useState("");
	const chatRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (chatRef.current) {
			chatRef.current.scrollTop = chatRef.current.scrollHeight;
		}
	}, [messages]);

	const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCurrentMessage(e.target.value);
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (currentMessage.trim() === "") return;

		const newMessage: Message = {
			id: messages.length + 1,
			text: currentMessage,
			sender: "user", // just for demonstration, replace 'user' with actual user id or name
		};

		setMessages((prev) => [...prev, newMessage]);
		setCurrentMessage("");
	};

	return (
		<ChatContainer>
			<ChatSection ref={chatRef}>
				{messages.map((message) => (
					<MessageBox
						key={message.id}
						sender={message.sender}
						elevation={3}
					>
						<Typography variant="caption">
							{message.sender}
						</Typography>
						<Typography variant="body1">{message.text}</Typography>
					</MessageBox>
				))}
			</ChatSection>

			<MessageForm onSubmit={handleSubmit}>
				<TextField
					value={currentMessage}
					onChange={handleMessageChange}
					placeholder="Type your message..."
					fullWidth
				/>

				<IconButton type="submit" color="primary">
					<SendIcon />
				</IconButton>
			</MessageForm>
		</ChatContainer>
	);
};

export default Chat;
