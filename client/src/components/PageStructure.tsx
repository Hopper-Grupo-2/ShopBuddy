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
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import Badge from "@mui/material/Badge";
import { Link } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { NotificationsContext } from "../contexts/NotificationsContext";
import { useContext, useState } from "react";

const drawerWidth = 320;

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
  const [mobileOpen, setMobileOpen] = useState(false);
  const userContext = useContext(UserContext);
  const notificationsContext = useContext(NotificationsContext);

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
    firstName: userContext?.user?.firstName || "",
    lastName: userContext?.user?.lastName || "",
  };

  const iconSx = {
    fontSize: "2em",
    ml: "10px",
    mr: "30px",
    color: "#444444",
  };

  const links = [
    {
      text: "Listas",
      route: "/",
      icon: <ViewListIcon sx={iconSx} />,
    },
    {
      text: "Notificações",
      route: "/notifications",
      icon: <NotificationsIcon sx={iconSx} />,
    },
    {
      text: "Configurações",
      route: "/settings",
      icon: <SettingsIcon sx={iconSx} />,
    },
    {
      text: "Sair",
      route: "/login",
      icon: <LogoutIcon sx={iconSx} />,
    },
  ];

  const drawer = (
    <Box sx={{ backgroundColor: "#FF9900" }}>
      <ListItem sx={{ paddingTop: 2, paddingBottom: 2, height: "5.5rem" }}>
        <ListItemIcon>
          <AccountCircleIcon
            sx={{ fontSize: "4.5rem", mr: "10px", color: "#444444" }}
          />
        </ListItemIcon>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            {user.username}
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{
              color: "#333333",
              letterSpacing: "0.5px",
            }}
          >
            {user.firstName + " " + user.lastName}
          </Typography>
        </Box>
      </ListItem>
      <Divider />
      <List>
        {links.map((page) => (
          <ListItem
            key={page.text}
            disablePadding
            component={Link}
            to={page.route}
            sx={{
              color: "#444444",
            }}
          >
            <ListItemButton
              onClick={() => (page.text === "Sair" ? handleLogout() : null)}
              sx={{
                height: "4.5rem",
              }}
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
              <ListItemText
                primaryTypographyProps={{
                  sx: { fontSize: "1.2rem", fontWeight: "bold" },
                }}
                primary={page.text}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
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
          backgroundColor: "#F9B344",
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
            <MenuIcon
              sx={{
                fontSize: "2em",
                color: "#ffffff",
              }}
            />
          </IconButton>
          <Typography
            variant="h2"
            noWrap
            component="div"
            sx={{
              margin: "0px auto",
              padding: "0px 0px 15px 0px",
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
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
        }}
        aria-label="mailbox folders"
      >
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
              backgroundColor: "#FF9900",
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
              backgroundColor: "#FF9900",
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
