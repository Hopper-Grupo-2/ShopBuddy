import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ViewListIcon from "@mui/icons-material/ViewList";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import SettingsIcon from "@mui/icons-material/Settings";
import Badge from "@mui/material/Badge";
import { Link } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { NotificationsContext } from "../contexts/NotificationsContext";
import { alignProperty } from "@mui/material/styles/cssUtils";

const drawerWidth = 240;

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
  children: React.ReactNode;
}

export default function ResponsiveDrawer(props: Props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const userContext = React.useContext(UserContext);
  const notificationsContext = React.useContext(NotificationsContext);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    await fetch("/api/users/logout", {
      method: "DELETE",
    });
  };

  const user = {
    username: userContext?.user?.username || "",
  };

  const links = [
    {
      text: "Listas",
      route: "/",
      icon: <ViewListIcon />,
    },
    {
      text: "Notificações",
      route: "/notifications",
      icon: <NotificationsIcon />,
    },
    {
      text: "Configurações",
      route: "/settings",
      icon: <SettingsIcon />,
    },
    {
      text: "Sair",
      route: "/login",
      icon: <LogoutIcon />,
    },
  ];

  const drawer = (
    <div>
      <ListItemButton sx={{ paddingTop: 2, paddingBottom: 2 }}>
        <ListItemIcon>
          <AccountBoxIcon />
        </ListItemIcon>
        <ListItemText primary={user.username} />
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
            <ListItemButton
              onClick={() => (page.text === "Sair" ? handleLogout() : null)}
            >
              <ListItemIcon>
                {page.text === "Notificações" ? (
                  <Badge
                    badgeContent={
                      notificationsContext?.notifications?.filter(
                        (notification) => notification.read === false
                      ).length
                    }
                    color="secondary"
                  >
                    {page.icon}
                  </Badge>
                ) : (
                  page.icon
                )}
              </ListItemIcon>
              <ListItemText primary={page.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h2"
            noWrap
            component="div"
            sx={{
              margin: "0px auto",
              padding: "20px 0px",
              fontFamily: "'Just Me Again Down Here', cursive",
              color: "white",
            }}
          >
            ShopBuddy
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {props.children}
      </Box>
    </Box>
  );
}
