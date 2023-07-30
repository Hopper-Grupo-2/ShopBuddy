import React from "react";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	List,
	ListItem,
	ListItemText,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import IUser from "../interfaces/iUser";

interface MembersModalProps {
	title: string;
	members: IUser[];
	open: boolean;
	handleClose: () => void;
	handleMember: (user: string) => Promise<void>;
}

const MembersModal: React.FC<MembersModalProps> = (
	props: MembersModalProps
) => {
	return (
		<Dialog open={props.open} onClose={props.handleClose}>
			<DialogTitle>{props.title}</DialogTitle>
			<div>
				<DialogContent>
					<List>
						{props.members.map((user) => (
							<ListItem key={user._id.toString()}>
								<ListItemText primary={user.username} />
								<DeleteIcon onClick = {async () => await props.handleMember(user._id.toString())}/>
							</ListItem>
						))}
					</List>
				</DialogContent>
				<DialogActions>
					<Button onClick={props.handleClose}>Fechar modal</Button>
				</DialogActions>
			</div>
		</Dialog>
	);
};

export { MembersModal };
