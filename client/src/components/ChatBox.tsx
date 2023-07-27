import React, { useState, useEffect, useRef, useContext } from "react";
import { TextField, IconButton, Typography, Paper } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import styled from "@emotion/styled";
import { UserContext } from "../contexts/UserContext";
import IMessage from "../interfaces/iMessage";

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
	word-wrap: break-word;
`;

const MessageForm = styled.form`
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

interface ChatProps {
	listId: string;
}

export default function ChatBox(props: ChatProps) {
	const context = useContext(UserContext);
	const [messages, setMessages] = useState<IMessage[]>([]);
	const [currentMessage, setCurrentMessage] = useState("");
	const chatRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const fetchMessages = async () => {
			const response = await fetch(`/api/messages/${props.listId}`, {
				method: "GET",
				credentials: "include", // Ensure credentials are sent
			});

			if (response.ok) {
				const messages = await response.json();
				//console.log(listData);
				setMessages(messages.data);
			}
		};

		fetchMessages();
	}, []);

	useEffect(() => {
		if (chatRef.current) {
			chatRef.current.scrollTop = chatRef.current.scrollHeight;
		}
	}, [messages]);

	const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCurrentMessage(e.target.value);
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (currentMessage.trim() === "") return;

		/* const newMessage: Message = {
			//id: messages.length + 1,
			text: currentMessage,
			sender: "user", // just for demonstration, replace 'user' with actual user id or name
		}; */

		try {
			const response = await fetch(`/api/messages/${props.listId}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					textContent: currentMessage,
				}),
			});

			const responseObj = await response.json();
			if (response.ok) {
				const newMessage = responseObj.data;
				setMessages((prev) => [...prev, newMessage]);
			} else {
				throw responseObj.error;
			}
		} catch (error: any) {
			console.error(error.name, error.message);
			alert("Failed to send message: " + error.message);
		}
		//setMessages((prev) => [...prev, newMessage]);
		setCurrentMessage("");
	};

	return (
		<ChatContainer>
			<ChatSection ref={chatRef}>
				{messages.map((message) => (
					<MessageBox
						key={message._id}
						sender={
							message.userId === context?.user?._id
								? "user"
								: message.userId //change to username later
						}
						elevation={3}
					>
						<Typography variant="caption">
							{message.userId}
						</Typography>
						<Typography variant="body1">
							{message.textContent}
						</Typography>
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
}