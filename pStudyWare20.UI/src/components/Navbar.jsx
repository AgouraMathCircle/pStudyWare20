import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
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
  ListItemButton,
  Collapse,
  useTheme,
  useMediaQuery,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Container,
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
  MenuBook as ResourcesIcon,
  Lock as LockIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "../services";
import { useAuth } from "../contexts/AuthContext";
import useNavigation from "../hooks/useNavigation";
import { getPortalDashboardPath, isPortalRoute } from "../utils/routeUtils";
import {
  clearPortalNavbarBottom,
  publishPortalNavbarBottom,
} from "./pstudyware/Common/roleHeaderLayout";
import "../styles/Navbar.css";
// Import images from src/assets
import logoImg from "../assets/images/logo.png";
import portalLogoImg from "../assets/images/Logo.jpeg";

const Navbar = ({ usePortalLogo = false }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [suppressDesktopHover, setSuppressDesktopHover] = useState(false);

  const logoUrl = usePortalLogo ? portalLogoImg : logoImg;
  const appBarRef = useRef(null);

  useLayoutEffect(() => {
    if (!usePortalLogo) {
      clearPortalNavbarBottom();
      return undefined;
    }

    const publish = () => publishPortalNavbarBottom(appBarRef.current);
    publish();

    const appBar = appBarRef.current;
    if (!appBar) return undefined;

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(publish)
        : null;
    resizeObserver?.observe(appBar);

    const logoImgEl = appBar.querySelector(".navbar-logo img");
    logoImgEl?.addEventListener("load", publish);

    window.addEventListener("resize", publish);
    const t1 = window.setTimeout(publish, 0);
    const t2 = window.setTimeout(publish, 200);

    return () => {
      resizeObserver?.disconnect();
      logoImgEl?.removeEventListener("load", publish);
      window.removeEventListener("resize", publish);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      clearPortalNavbarBottom();
    };
  }, [usePortalLogo, logoUrl]);

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
        { label: "Student Registration", href: "/studentregistration" },
        { label: "Volunteer Registration", href: "/volunteerregistration" },
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
      label: "Login",
      href: "/login",
      icon: <LockIcon fontSize="small" />,
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
      href: "/pstudyware/student/dashboard",
      icon: <DashboardIcon fontSize="small" />,
    },
    {
      label: "Class Material",
      href: "/pstudyware/student/class-material",
      icon: <SchoolIcon fontSize="small" />,
    },
    {
      label: "Update Score",
      href: "/pstudyware/student/update-score",
      icon: <AssignmentIcon fontSize="small" />,
    },
    {
      label: "Upload Documents",
      href: "/pstudyware/student/upload-documents",
      icon: <UploadIcon fontSize="small" />,
    },
    {
      label: "Report Card",
      href: "/pstudyware/student/report-card",
      icon: <AssessmentIcon fontSize="small" />,
    },
    {
      label: "Message Center",
      href: "/pstudyware/student/message-center",
      icon: <MessageIcon fontSize="small" />,
    },
    {
      label: "Change Password",
      href: "/pstudyware/student/update-password",
      icon: <LockIcon fontSize="small" />,
    },
    {
      label: "Logout",
      href: "#",
      icon: <LogoutIcon fontSize="small" />,
      action: "logout",
    },
  ];

  // Admin menu items for authenticated admins
  const adminMenuItems = [
    {
      label: "Dashboard",
      href: "/pstudyware/admin/dashboard",
      icon: <AdminIcon fontSize="small" />,
    },
    {
      label: "Instructor",
      href: "/pstudyware/admin/instructor",
      icon: <SchoolIcon fontSize="small" />,
    },

    {
      label: "Student List",
      href: "/pstudyware/admin/registeredstudentlist",
      icon: <PeopleIcon fontSize="small" />,
    },
    {
      label: "Class Material",
      href: "/pstudyware/admin/class-material",
      icon: <AssessmentIcon fontSize="small" />,
    },
    {
      label: "Student Docs",
      href: "/pstudyware/admin/student-docs",
      icon: <SettingsIcon fontSize="small" />,
    },
    {
      label: "Report Card",
      href: "/pstudyware/admin/report-card",
      icon: <AssessmentIcon fontSize="small" />,
    },
    {
      label: "Docs Repository",
      href: "/pstudyware/admin/docs-repository",
      icon: <AssessmentIcon fontSize="small" />,
    },
    {
      label: "Message Center",
      href: "/pstudyware/admin/message-center",
      icon: <MessageIcon fontSize="small" />,
    },
    {
      label: "Password",
      href: "/pstudyware/admin/update-password",
      icon: <LockIcon fontSize="small" />,
    },
    {
      label: "Logout",
      href: "#",
      icon: <LogoutIcon fontSize="small" />,
      action: "logout",
    },
  ];

  // Instructor menu — aligned with pStudyware_Menu.ascx (divInstructor)
  const instructorMenuItems = [
    {
      label: "Dashboard",
      href: "/pstudyware/instructor/dashboard",
      icon: <DashboardIcon fontSize="small" />,
    },
    {
      label: "Time Sheet",
      href: "/pstudyware/instructor/time-sheet",
      icon: <AssignmentIcon fontSize="small" />,
    },
    {
      label: "Class Material",
      href: "/pstudyware/instructor/class-material",
      icon: <AssignmentIcon fontSize="small" />,
    },
    {
      label: "Student Documents",
      href: "/pstudyware/instructor/student-documents",
      icon: <UploadIcon fontSize="small" />,
    },
    {
      label: "Student Report Card",
      href: "/pstudyware/instructor/report-card",
      icon: <AssessmentIcon fontSize="small" />,
    },
    {
      label: "Message Center",
      href: "/pstudyware/instructor/message-center",
      icon: <MessageIcon fontSize="small" />,
    },
    {
      label: "Change Password",
      href: "/pstudyware/instructor/update-password",
      icon: <LockIcon fontSize="small" />,
    },
    {
      label: "Logout",
      href: "#",
      icon: <LogoutIcon fontSize="small" />,
      action: "logout",
    },
  ];

  // Volunteer menu items for authenticated volunteers
  const volunteerMenuItems = [
    {
      label: "Dashboard",
      href: "/pstudyware/volunteer/dashboard",
      icon: <DashboardIcon fontSize="small" />,
    },
    {
      label: "Time Sheet",
      href: "/pstudyware/volunteer/time-sheet",
      icon: <AssignmentIcon fontSize="small" />,
    },
    {
      label: "Message Center",
      href: "/pstudyware/volunteer/message-center",
      icon: <MessageIcon fontSize="small" />,
    },
    {
      label: "Change Password",
      href: "/pstudyware/volunteer/update-password",
      icon: <LockIcon fontSize="small" />,
    },
    {
      label: "Logout",
      href: "#",
      icon: <LogoutIcon fontSize="small" />,
      action: "logout",
    },
  ];

  // Determine user type and appropriate menu
  const isStudent =
    isAuthenticated &&
    user &&
    (user.memberType?.toUpperCase() === "S" || user.role === "Student");

  const isAdmin =
    isAuthenticated &&
    user &&
    (user.memberType?.toUpperCase() === "A" ||
      user.role === "Admin" ||
      user.role === "SystemAdmin");

  const isInstructor =
    isAuthenticated &&
    user &&
    (user.memberType?.toUpperCase() === "I" ||
      user.memberType?.toUpperCase() === "C" ||
      user.role === "Instructor");

  const isVolunteer =
    isAuthenticated &&
    user &&
    (user.memberType?.toUpperCase() === "V" || user.role === "Volunteer");

  const onPortalRoute = isPortalRoute(location.pathname);
  const showPortalMenu =
    onPortalRoute && (isAdmin || isInstructor || isVolunteer || isStudent);

  const getPublicMenuItems = () => {
    if (!isAuthenticated || !user) {
      return regularMenuItems;
    }

    const dashboardPath = getPortalDashboardPath(user);
    return regularMenuItems.map((item) =>
      item.label === "Login"
        ? {
            label: "Dashboard",
            href: dashboardPath,
            icon: <DashboardIcon fontSize="small" />,
          }
        : item,
    );
  };

  // Public pages always use the external menu; portal pages use role menus
  let menuItems = getPublicMenuItems();
  if (showPortalMenu) {
    if (isAdmin) {
      menuItems = adminMenuItems;
    } else if (isInstructor) {
      menuItems = instructorMenuItems;
    } else if (isVolunteer) {
      menuItems = volunteerMenuItems;
    } else if (isStudent) {
      menuItems = studentMenuItems;
    }
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const closeMobileMenu = () => {
    setMobileOpen(false);
    setExpandedMenus({});
  };

  const handleMenuExpand = (label) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const { navigateTo } = useNavigation();

  const handleLogout = () => {
    logout();
    navigate("/");
    closeMobileMenu();
  };

  const handleLogoClick = () => {
    if (showPortalMenu) {
      navigate(getPortalDashboardPath(user));
      return;
    }

    navigate("/");
  };

  const handleNavigation = (href, external = false, action = null) => {
    if (action === "logout") {
      handleLogout();
      return;
    }
    // Force-close desktop hover dropdown right after click.
    setSuppressDesktopHover(true);
    closeMobileMenu();
    navigateTo(href, external);
  };

  useEffect(() => {
    closeMobileMenu();
  }, [location.pathname]);

  useEffect(() => {
    if (!suppressDesktopHover) return;
    const timer = window.setTimeout(() => setSuppressDesktopHover(false), 250);
    return () => window.clearTimeout(timer);
  }, [suppressDesktopHover]);

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
                handleNavigation(item.href, item.external, item.action);
              }
            }}
            sx={{
              backgroundColor: isActive ? "#53b50a" : "#53b50a",
              "&:hover": {
                backgroundColor: "#45a108",
              },
            }}
          >
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1.5, flex: 1 }}
            >
              <Box
                sx={{
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {item.icon}
              </Box>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: isActive ? 600 : 400,
                  color: "#ffffff",
                  fontSize: "16px",
                  lineHeight: 1.5,
                  flex: 1,
                }}
              >
                {item.label}
              </Typography>
            </Box>
            {hasSubmenu && (
              <IconButton
                size="small"
                className={`dropdown-arrow ${isExpanded ? "expanded" : ""}`}
                sx={{ color: "#ffffff", minWidth: 44, minHeight: 44 }}
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
                    sx={{
                      pl: 4,
                      color: "#ffffff",
                      minHeight: 44,
                      "&:hover": {
                        backgroundColor: "#45a108",
                      },
                    }}
                    onClick={() =>
                      handleNavigation(
                        subItem.href,
                        subItem.external,
                        subItem.action,
                      )
                    }
                  >
                    <ListItemText
                      primary={subItem.label}
                      sx={{
                        "& .MuiListItemText-primary": {
                          fontSize: "0.9rem",
                          color: "#ffffff",
                          fontWeight: 400,
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
          ...(suppressDesktopHover && {
            "&:hover .submenu": {
              display: "none",
            },
          }),
        }}
      >
        <Button
          className="navbar-menu-item menu-item-ripple"
          onClick={() => {
            if (!hasSubmenu) {
              handleNavigation(item.href, item.external, item.action);
            }
          }}
          sx={{
            color: "#ffffff", // White text for contrast against green background
            fontWeight: isActive ? 600 : 400,
            textTransform: "none",
            fontSize: showPortalMenu ? "0.75rem" : "1rem",
            px: showPortalMenu ? 0.6 : 2,
            py: showPortalMenu ? 0.5 : 1,
            minWidth: "auto",
            minHeight: showPortalMenu ? 24 : "auto",
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
                onClick={() =>
                  handleNavigation(
                    subItem.href,
                    subItem.external,
                    subItem.action,
                  )
                }
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
        {/* Logo in mobile drawer */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            cursor: "pointer",
          }}
          onClick={() => {
            handleLogoClick();
            handleDrawerToggle();
          }}
        >
          <Box
            component="img"
            src={logoUrl}
            alt="AMC Logo"
            sx={{
              height: usePortalLogo ? 28 : 40,
              width: "auto",
              objectFit: "contain",
            }}
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </Box>
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
        ref={appBarRef}
        className={`navbar-sticky${usePortalLogo ? " navbar-sticky--portal" : ""}`}
        position="sticky"
        elevation={0}
        sx={{
          width: "100%",
          borderRadius: 0,
          backgroundColor: "#53b50a", // Match original menu background color
          color: "#ffffff", // White text for contrast
          borderBottom: 1,
          borderColor: "rgba(255, 255, 255, 0.1)",
          ...(usePortalLogo && {
            borderBottom: "none",
          }),
        }}
      >
        <Container maxWidth={false} sx={{ width: "100%", px: 0 }}>
          <Toolbar
            sx={{
              width: "100%",
              px: { xs: 0 },
              justifyContent: "space-between",
              ...(usePortalLogo && {
                minHeight: 32,
                height: 32,
                py: 0,
                my: 0,
              }),
            }}
          >
            {/* Logo — portal logo replaces public logo after login */}
            <Box
              className={`navbar-logo${usePortalLogo ? " navbar-logo--portal" : ""}`}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: usePortalLogo ? 0.5 : 1,
                mr: usePortalLogo ? 1.2 : 2,
                cursor: "pointer",
              }}
              onClick={handleLogoClick}
            >
              <Box
                component="img"
                src={logoUrl}
                alt="AMC Logo"
                sx={{
                  height: usePortalLogo
                    ? { xs: 32, md: 32 }
                    : { xs: 50, md: 90 },
                  width: "auto",
                  objectFit: "contain",
                }}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </Box>

            {/* Desktop Menu - Centered for Admin/Student */}
            {!isMobile && (
              <Box
                className="navbar-menu"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: showPortalMenu ? "center" : "flex-end",
                  gap: showPortalMenu ? 0.1 : 1,
                  flex: 1,
                  ml: showPortalMenu ? 1.5 : 0,
                  mr: showPortalMenu ? 4.5 : 2.5,
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
        onClose={closeMobileMenu}
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