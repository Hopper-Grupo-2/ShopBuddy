import {
	Drawer,
	Toolbar,
	Divider,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
} from "@mui/material";
import { Link } from "react-router-dom";

export default function Sidebar() {
	const links = [
		{
			text: "Listas",
			route: "/",
		},
		{
			text: "Lista",
			route: "/list",
		},
		{
			text: "Login",
			route: "/login",
		},
	];

	const drawer = (
		<div>
			<Toolbar />
			<Divider />
			<List>
				{links.map((page) => (
					<ListItem
						key={page.text}
						disablePadding
						component={Link}
						to={page.route}
					>
						<ListItemButton>
							<ListItemText primary={page.text} />
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</div>
	);

	return (
		<Drawer
			sx={{
				width: 200,
				flexShrink: 0,
				"& .MuiDrawer-paper": {
					width: 200,
					boxSizing: "border-box",
				},
			}}
			variant="persistent"
			ModalProps={{ keepMounted: true }}
			anchor="left"
			open={true}
		>
			{drawer}
		</Drawer>
	);
}
