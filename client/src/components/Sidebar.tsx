import {
	Drawer,
	Toolbar,
	Divider,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
} from "@mui/material";

import ViewListIcon from "@mui/icons-material/ViewList";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountBoxIcon from "@mui/icons-material/AccountBox";

import { Link } from "react-router-dom";

interface SidebarProps {
	isOpen: boolean;
}

export default function Sidebar(props: SidebarProps) {
	//get this info from the cookie:
	const user = {
		username: "Username",
	};

	const links = [
		{
			text: "Listas",
			route: "/",
			icon: <ViewListIcon />,
		},
		{
			text: "Sair",
			route: "/login",
			icon: <LogoutIcon />,
		},
	];

	const drawer = (
		<div>
			<Toolbar />
			<ListItemButton>
				<ListItemIcon>
					<AccountBoxIcon />
					<ListItemText primary={user.username} />
				</ListItemIcon>
			</ListItemButton>
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
							<ListItemIcon>{page.icon}</ListItemIcon>
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
				width: props.isOpen ? 200 : 0,
				flexShrink: 0,
				"& .MuiDrawer-paper": {
					width: props.isOpen ? 200 : 0,
					boxSizing: "border-box",
				},
			}}
			variant="persistent"
			ModalProps={{ keepMounted: true }}
			anchor="left"
			open={props.isOpen}
		>
			{drawer}
		</Drawer>
	);
}
