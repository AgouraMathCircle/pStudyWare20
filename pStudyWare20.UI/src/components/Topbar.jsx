import React from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  IconButton,
  Link,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import "../styles/Topbar.css";
import {
  Facebook as FacebookIcon,
  X as XIcon,
  YouTube as YouTubeIcon,
  LinkedIn as LinkedInIcon,
  Instagram as InstagramIcon,
  Logout as LogoutIcon,
  AttachMoney as DonateIcon,
  Rocket as RocketIcon,
  Edit as EditIcon,
  Group as GroupIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "../services";
import { isPortalRoute } from "../utils/routeUtils";
import { useRoleHeaderDateTime } from "../hooks/useRoleHeaderDateTime";

const Topbar = () => {
  const theme = useTheme();
  const _isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = React.useState(null);
  const dateTime = useRoleHeaderDateTime();

  React.useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, [location.pathname]);

  // Initialize authentication state on component mount
  React.useEffect(() => {
    const initializeAuthState = () => {
      const currentUser = authService.getCurrentUser();
      console.log("Topbar: Initializing auth state");
      console.log("Topbar: Current user:", currentUser);
      setUser(currentUser);
    };

    initializeAuthState();
  }, []);

  // Listen for authentication changes
  React.useEffect(() => {
    const handleStorageChange = () => {
      console.log("Topbar: Storage change detected");
      const currentUser = authService.getCurrentUser();
      console.log("Topbar: Current user after storage change:", currentUser);
      setUser(currentUser);
    };

    const handleLogoutEvent = () => {
      console.log("Topbar: Logout event received");
      setUser(null);
      console.log("Topbar: User state cleared");
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("authLogout", handleLogoutEvent);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authLogout", handleLogoutEvent);
    };
  }, []);

  const handleLogout = () => {
    console.log("Topbar: Logout button clicked");
    authService.logout();
    setUser(null);
  };

  // Manual logout test function
  const testLogout = () => {
    console.log("Topbar: Manual logout test");
    console.log("Topbar: Before logout - user:", user);
    console.log("Topbar: Before logout - localStorage:", {
      token: localStorage.getItem("authToken"),
      user: localStorage.getItem("user"),
    });

    authService.logout();

    console.log("Topbar: After logout - localStorage:", {
      token: localStorage.getItem("authToken"),
      user: localStorage.getItem("user"),
    });
  };

  const topbarLinks = [
    {
      icon: <RocketIcon fontSize="small" />,
      text: "Math Circle",
      href: "/about/math-circle",
    },
    {
      icon: <RocketIcon fontSize="small" />,
      text: "Engineering Circle",
      href: "/about/engineering-circle",
    },
    {
      icon: <EditIcon fontSize="small" />,
      text: "Test Preparation",
      href: "/about/test-preparation",
    },
    {
      icon: <EditIcon fontSize="small" />,
      text: "Triangular Talks",
      href: "http://triangulartalks.org/",
      external: true,
    },
    {
      icon: <GroupIcon fontSize="small" />,
      text: "Satellite Program",
      href: "/about/satellite-program",
    },
  ];

  const socialLinks = [
    {
      icon: <FacebookIcon />,
      href: "https://www.facebook.com/profile.php?id=100010784343153",
      label: "Facebook",
    },
    {
      icon: <XIcon />,
      href: "https://x.com/agouramath/",
      label: "X",
    },
    {
      icon: <YouTubeIcon />,
      href: "https://www.youtube.com/channel/UCWK2w-BVGps-Y9c08B5pRgA/videos",
      label: "YouTube",
    },
    {
      icon: <LinkedInIcon />,
      href: "https://www.linkedin.com/in/agouramathcircle/",
      label: "LinkedIn",
    },
    {
      icon: <InstagramIcon />,
      href: "https://www.instagram.com/agouramathcircle/",
      label: "Instagram",
    },
  ];

  const handleNavigation = (href, external = false) => {
    if (external) {
      window.open(href, "_blank", "noopener,noreferrer");
    } else {
      navigate(href);
    }
  };

  // Hide topbar on portal routes for authenticated students, admins, instructors, and volunteers
  const onPortalRoute = isPortalRoute(location.pathname);
  if (user && onPortalRoute) {
    const isStudent =
      user.role === "Student" || user.memberType?.toUpperCase() === "S";
    const isAdmin =
      user.role === "Admin" ||
      user.role === "SystemAdmin" ||
      user.memberType?.toUpperCase() === "A";
    const isInstructor =
      user.role === "Instructor" || user.memberType?.toUpperCase() === "I";
    const isVolunteer =
      user.role === "Volunteer" || user.memberType?.toUpperCase() === "V";

    if (isStudent || isAdmin || isInstructor || isVolunteer) {
      return null;
    }
  }

  if (_isMobile) {
    return null;
  }

  return (
    <Box
      className="topbar-container"
      sx={{
        backgroundColor: "#102d47",
        color: "#ffffff",
        width: "100%",
        fontSize: "14px",
        py: { xs: 0.75, sm: 0.75, md: 0 },
      }}
    >
      <Container maxWidth={false} sx={{ px: 0 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "stretch", md: "center" },
            width: "100%",
            gap: { xs: 1, sm: 1.25, md: 0 },
            px: { xs: 2, sm: 3, md: 8, lg: "1in", xl: "1in" },
          }}
        >
          {/* Left side - Navigation Links */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1.25, sm: 1.5, md: 2 },
              flexShrink: 0,
              flexWrap: { xs: "nowrap", md: "wrap" },
              overflowX: { xs: "auto", md: "visible" },
              py: { xs: 0.25, md: 0 },
              "&::-webkit-scrollbar": { display: "none" },
              maskImage:
                "linear-gradient(to right, transparent 0, black 12px, black calc(100% - 12px), transparent 100%)",
            }}
          >
            {topbarLinks.map((link, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.75,
                  cursor: "pointer",
                  "&:hover": { color: "#ccc" },
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  fontSize: { xs: "0.85rem", sm: "0.9rem", md: "0.95rem" },
                  px: { xs: 0, md: 0 },
                }}
                onClick={() => handleNavigation(link.href, link.external)}
              >
                <Box sx={{ fontSize: 13, mr: 0.5 }}>{link.icon}</Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: { xs: "0.85rem", md: "0.95rem" },
                    lineHeight: 1.3,
                  }}
                >
                  {link.text}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Right side - Social Media & Actions */}
          <Box
            sx={{
              display: "flex",
              alignItems: { xs: "center", sm: "center", md: "center" },
              justifyContent: { xs: "space-between", sm: "flex-end" },
              flexWrap: { xs: "wrap", sm: "wrap", md: "nowrap" },
              gap: { xs: 1, sm: 1.25, md: 1 },
              ml: { xs: 0, md: 4 },
              flexShrink: 0,
            }}
          >
            {/* User Info - Show when logged in (for non-students and non-admins) */}
            {user &&
              (() => {
                const isStudent =
                  user.role === "Student" ||
                  user.memberType?.toUpperCase() === "S";
                const isAdmin =
                  user.role === "Admin" ||
                  user.role === "SystemAdmin" ||
                  user.memberType?.toUpperCase() === "A";
                return !isStudent && !isAdmin;
              })() && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mr: { xs: 0, md: 2 },
                    order: { xs: 3, sm: 3, md: 1 },
                  }}
                >
                  <Typography variant="body2" sx={{ color: "#ffffff" }}>
                    Welcome {user?.firstName || "User"},
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#ffffff", whiteSpace: "nowrap" }}>
                    {dateTime}
                  </Typography>
                </Box>
              )}

            {/* Social Media Links */}
            {socialLinks.map((social, index) => (
              <IconButton
                key={index}
                size="small"
                sx={{
                  color: "#ffffff",
                  padding: "5px",
                  "&:hover": { color: "#ccc" },
                }}
                onClick={() =>
                  window.open(social.href, "_blank", "noopener,noreferrer")
                }
              >
                <Box sx={{ fontSize: 14 }}>{social.icon}</Box>
              </IconButton>
            ))}

            {/* Logout Button */}
            {user && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  cursor: "pointer",
                  "&:hover": { color: "#ccc" },
                  order: { xs: 1, sm: 1, md: 2 },
                  flexGrow: { xs: 1, sm: 0 },
                  justifyContent: {
                    xs: "flex-start",
                    sm: "center",
                    md: "flex-start",
                  },
                }}
                onClick={handleLogout}
              >
                <LogoutIcon sx={{ fontSize: 13, mr: 1 }} />
                <Typography
                  variant="body2"
                  sx={{ fontSize: "15px", fontWeight: 400 }}
                >
                  LOGOUT
                </Typography>
              </Box>
            )}

            {/* Donate Button */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
                "&:hover": { color: "#ccc" },
                order: { xs: 2, sm: 2, md: 3 },
                flexGrow: { xs: 1, sm: 0 },
                justifyContent: {
                  xs: "flex-start",
                  sm: "center",
                  md: "flex-start",
                },
              }}
              onClick={() => navigate("/donate")}
            >
              <DonateIcon sx={{ fontSize: 13, mr: 1 }} />
              <Typography
                variant="body2"
                sx={{ fontSize: "15px", fontWeight: 400 }}
              >
                DONATE
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Topbar;
