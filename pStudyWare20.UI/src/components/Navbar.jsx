import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
  useTheme,
  useMediaQuery,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Info as InfoIcon,
  HowToReg as RegisterIcon,
  PhotoLibrary as GalleryIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Upload as UploadIcon,
  Assessment as AssessmentIcon,
  Message as MessageIcon,
  VpnKey as VpnKeyIcon,
  Logout as LogoutIcon,
  ExpandLess,
  ExpandMore,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  VolunteerActivism as VolunteerActivismIcon,
  AdminPanelSettings as AdminIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  School as SchoolIcon2,
  Engineering as EngineeringIcon,
  Quiz as QuizIcon,
  Satellite as SatelliteIcon,
  ContactSupport as FAQIcon,
  AttachMoney as DonateIcon,
  ContactMail as ContactIcon,
  YouTube as YouTubeIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "../services";
import useNavigation from "../hooks/useNavigation";
import "../styles/Navbar.css";
// Import images from src/assets
import logoImg from "../assets/images/logo.png";

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [user, setUser] = useState(null);

  React.useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  // Initialize authentication state on component mount
  React.useEffect(() => {
    const initializeAuthState = () => {
      const currentUser = authService.getCurrentUser();
      console.log("Navbar: Initializing auth state");
      console.log("Navbar: Current user:", currentUser);
      setUser(currentUser);
    };

    initializeAuthState();
  }, []);

  // Listen for authentication changes
  React.useEffect(() => {
    const handleStorageChange = () => {
      console.log("Navbar: Storage change detected");
      const currentUser = authService.getCurrentUser();
      console.log("Navbar: Current user after storage change:", currentUser);
      setUser(currentUser);
    };

    const handleLogoutEvent = () => {
      console.log("Navbar: Logout event received");
      setUser(null);
      console.log("Navbar: User state cleared");
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("authLogout", handleLogoutEvent);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authLogout", handleLogoutEvent);
    };
  }, []);

  // Logo image - updated path to use src/assets/images/
  const logoUrl = logoImg; // Updated path

  // Regular menu items for non-authenticated users
  const regularMenuItems = [
    {
      label: "Home",
      href: "/",
      icon: <HomeIcon fontSize="small" />,
    },
    {
      label: "About",
      href: "/about",
      icon: <InfoIcon fontSize="small" />,
      submenu: [
        { label: "Overview", href: "/about/overview" },
        { label: "Math Circle", href: "/about/math-circle" },
        { label: "Engineering Circle", href: "/about/engineering-circle" },
        { label: "Test Preparation", href: "/about/test-preparation" },
        {
          label: "Triangular Talks",
          href: "http://triangulartalks.org/",
          external: true,
        },
        { label: "Satellite Program", href: "/about/satellite-program" },
      ],
    },
    {
      label: "Registration",
      href: "/registration",
      icon: <RegisterIcon fontSize="small" />,
      submenu: [
        { label: "Student Registration", href: "/registration/student" },
        { label: "Volunteer Registration", href: "/registration/volunteer" },
      ],
    },
    {
      label: "Gallery",
      href: "/gallery",
      icon: <GalleryIcon fontSize="small" />,
    },
    {
      label: "Resources",
      href: "/resources",
      icon: <ResourcesIcon fontSize="small" />,
    },
    {
      label: "FAQ",
      href: "/faq",
      icon: <FAQIcon fontSize="small" />,
    },
    {
      label: "Donate",
      href: "/donate",
      icon: <DonateIcon fontSize="small" />,
    },
    {
      label: "Contact",
      href: "/contact",
      icon: <ContactIcon fontSize="small" />,
    },
  ];

  // Student menu items for authenticated students
  const studentMenuItems = [
    {
      label: "Dashboard",
      href: "/student/dashboard",
      icon: <DashboardIcon fontSize="small" />,
    },
    {
      label: "Class Material",
      href: "/student/class-material",
      icon: <SchoolIcon fontSize="small" />,
    },
    {
      label: "Update Score",
      href: "/student/update-score",
      icon: <AssignmentIcon fontSize="small" />,
    },
    {
      label: "Upload Documents",
      href: "/student/upload-documents",
      icon: <UploadIcon fontSize="small" />,
    },
    {
      label: "Report Card",
      href: "/student/report-card",
      icon: <AssessmentIcon fontSize="small" />,
    },
    {
      label: "Message Center",
      href: "/student/message-center",
      icon: <MessageIcon fontSize="small" />,
    },
    {
      label: "Change Password",
      href: "/student/change-password",
      icon: <LockIcon fontSize="small" />,
    },
  ];

  // Use student menu items if user is authenticated and is a student
  const menuItems =
    user && (user.role === "Student" || user.MemberType === "S")
      ? studentMenuItems
      : regularMenuItems;

  // Debug menu selection
  console.log("Navbar: Current user:", user);
  console.log("Navbar: User role:", user?.role);
  console.log("Navbar: User MemberType:", user?.MemberType);
  console.log(
    "Navbar: Selected menu items:",
    menuItems === studentMenuItems ? "Student Menu" : "Regular Menu"
  );

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuExpand = (label) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const { navigateTo } = useNavigation();

  const handleNavigation = (href, external = false) => {
    navigateTo(href, external);
    setMobileOpen(false);
  };

  const isActiveRoute = (href) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  const renderMenuItem = (item, isMobile = false) => {
    const isActive = isActiveRoute(item.href);
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isExpanded = expandedMenus[item.label];

    if (isMobile) {
      return (
        <Box key={item.label}>
          <ListItemButton
            className="mobile-menu-item"
            onClick={() => {
              if (hasSubmenu) {
                handleMenuExpand(item.label);
              } else {
                handleNavigation(item.href, item.external);
              }
            }}
            sx={{
              backgroundColor: isActive
                ? "rgba(255, 255, 255, 0.1)"
                : "transparent",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.05)",
              },
            }}
          >
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}
            >
              {item.icon}
              <Typography
                variant="body1"
                sx={{
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "#ffffff" : "#ffffff", // White text for all states
                }}
              >
                {item.label}
              </Typography>
            </Box>
            {hasSubmenu && (
              <IconButton
                size="small"
                className={`dropdown-arrow ${isExpanded ? "expanded" : ""}`}
              >
                {isExpanded ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            )}
          </ListItemButton>

          {hasSubmenu && (
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <List component="div" disablePadding className="mobile-submenu">
                {item.submenu.map((subItem) => (
                  <ListItemButton
                    key={subItem.label}
                    className="mobile-menu-item"
                    sx={{ pl: 4 }}
                    onClick={() =>
                      handleNavigation(subItem.href, subItem.external)
                    }
                  >
                    <ListItemText
                      primary={subItem.label}
                      sx={{
                        "& .MuiListItemText-primary": {
                          fontSize: "0.9rem",
                        },
                      }}
                    />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          )}
        </Box>
      );
    }

    return (
      <Box
        key={item.label}
        className={`navbar-item ${isActive ? "menu-item-active" : ""}`}
        sx={{
          position: "relative",
          "&:hover .submenu": {
            display: "block",
          },
        }}
      >
        <Button
          className="navbar-menu-item menu-item-ripple"
          onClick={() => {
            if (!hasSubmenu) {
              handleNavigation(item.href, item.external);
            }
          }}
          sx={{
            color: "#ffffff", // White text for contrast against green background
            fontWeight: isActive ? 600 : 400,
            textTransform: "none",
            fontSize: "1rem",
            px: 2,
            py: 1,
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          {item.label}
        </Button>

        {hasSubmenu && (
          <Box
            className="submenu"
            sx={{
              display: "none",
              position: "absolute",
              top: "100%",
              left: 0,
              backgroundColor: "#53b50a", // Match main menu background
              boxShadow: theme.shadows[4],
              borderRadius: 1,
              minWidth: 200,
              zIndex: 1000,
              py: 1,
            }}
          >
            {item.submenu.map((subItem) => (
              <Button
                key={subItem.label}
                className="submenu-item"
                onClick={() => handleNavigation(subItem.href, subItem.external)}
                sx={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  px: 2,
                  py: 1,
                  color: "#ffffff", // White text for contrast
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                {subItem.label}
              </Button>
            ))}
          </Box>
        )}
      </Box>
    );
  };

  const drawer = (
    <Box sx={{ width: 280 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Menu
        </Typography>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>

      <List sx={{ pt: 1 }} className="mobile-menu-list">
        {menuItems.map((item) => renderMenuItem(item, true))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        className="navbar-sticky"
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: "#53b50a", // Match original menu background color
          color: "#ffffff", // White text for contrast
          borderBottom: 1,
          borderColor: "rgba(255, 255, 255, 0.1)",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ px: { xs: 0 } }}>
            {/* Logo */}
            <Box
              className="navbar-logo"
              sx={{
                display: "flex",
                alignItems: "center",
                flexGrow: 1,
                cursor: "pointer",
              }}
              onClick={() => navigate("/")}
            >
              <Box
                component="img"
                src={logoUrl}
                alt="AMC Logo"
                sx={{
                  height: 50,
                }}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </Box>

            {/* Desktop Menu */}
            {!isMobile && (
              <Box
                className="navbar-menu"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                {menuItems.map((item) => renderMenuItem(item, false))}
              </Box>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                className="menu-button"
                sx={{ ml: "auto" }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", lg: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 280,
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;
