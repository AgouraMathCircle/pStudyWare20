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

  const topbarLinkIconSx = { fontSize: 12, display: "flex" };
  const topbarTextSx = {
    fontSize: "0.831875rem",
    lineHeight: 1,
    m: 0,
  };
  const topbarActionTextSx = {
    fontSize: "0.831875rem",
    fontWeight: 500,
    lineHeight: 1,
    m: 0,
  };
  const topbarActionIconSx = { fontSize: 12 };

  const topbarLinks = [
    {
      icon: <RocketIcon sx={topbarLinkIconSx} />,
      text: "Math Circle",
      href: "/about/math-circle",
    },
    {
      icon: <RocketIcon sx={topbarLinkIconSx} />,
      text: "Engineering Circle",
      href: "/about/engineering-circle",
    },
    {
      icon: <EditIcon sx={topbarLinkIconSx} />,
      text: "Test Preparation",
      href: "/about/test-preparation",
    },
    {
      icon: <EditIcon sx={topbarLinkIconSx} />,
      text: "Triangular Talks",
      href: "http://triangulartalks.org/",
      external: true,
    },
    {
      icon: <GroupIcon sx={topbarLinkIconSx} />,
      text: "Satellite Program",
      href: "/about/satellite-program",
    },
  ];

  const socialLinks = [
    {
      icon: <FacebookIcon sx={topbarActionIconSx} />,
      href: "https://www.facebook.com/profile.php?id=100010784343153",
      label: "Facebook",
    },
    {
      icon: <XIcon sx={topbarActionIconSx} />,
      href: "https://x.com/agouramath/",
      label: "X",
    },
    {
      icon: <YouTubeIcon sx={topbarActionIconSx} />,
      href: "https://www.youtube.com/channel/UCWK2w-BVGps-Y9c08B5pRgA/videos",
      label: "YouTube",
    },
    {
      icon: <LinkedInIcon sx={topbarActionIconSx} />,
      href: "https://www.linkedin.com/in/agouramathcircle/",
      label: "LinkedIn",
    },
    {
      icon: <InstagramIcon sx={topbarActionIconSx} />,
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
      user.role === "Instructor" ||
      user.memberType?.toUpperCase() === "I" ||
      user.memberType?.toUpperCase() === "C";
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
        fontSize: "13px",
        py: 0.17,
        minHeight: 26,
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
            gap: { xs: 0.75, sm: 1, md: 0 },
            pl: { xs: 1.5, sm: 2, md: 4, lg: "0.6in", xl: "0.6in" },
            pr: { xs: 2, sm: 3, md: 8, lg: "1in", xl: "1in" },
            minHeight: 26,
            py: 0,
          }}
        >
          {/* Left side - Navigation Links */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1, sm: 1.25, md: 1.65 },
              flexShrink: 0,
              flexWrap: { xs: "nowrap", md: "wrap" },
              overflowX: { xs: "auto", md: "visible" },
              py: 0,
              ml: { md: -0.5, lg: -1 },
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
                  gap: 0.35,
                  cursor: "pointer",
                  "&:hover": { color: "#ccc" },
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  px: { xs: 0, md: 0 },
                }}
                onClick={() => handleNavigation(link.href, link.external)}
              >
                <Box sx={{ display: "flex", mr: 0.25 }}>{link.icon}</Box>
                <Typography variant="body2" sx={topbarTextSx}>
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
              gap: { xs: 0.5, sm: 0.75, md: 0.5 },
              ml: { xs: 0, md: 2 },
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
                    gap: 0.5,
                    mr: { xs: 0, md: 1 },
                    order: { xs: 3, sm: 3, md: 1 },
                  }}
                >
                  <Typography variant="body2" sx={{ color: "#ffffff", ...topbarTextSx }}>
                    Welcome {user?.firstName || "User"},
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#ffffff", whiteSpace: "nowrap", ...topbarTextSx }}>
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
                  p: 0,
                  width: 22,
                  height: 22,
                  minWidth: 22,
                  minHeight: 22,
                  "&:hover": { color: "#ccc" },
                }}
                onClick={() =>
                  window.open(social.href, "_blank", "noopener,noreferrer")
                }
              >
                {social.icon}
              </IconButton>
            ))}

            {/* Logout Button */}
            {user && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.35,
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
                <LogoutIcon sx={topbarActionIconSx} />
                <Typography variant="body2" sx={topbarActionTextSx}>
                  LOGOUT
                </Typography>
              </Box>
            )}

            {/* Donate Button */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0,
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
              <DonateIcon sx={topbarActionIconSx} />
              <Typography variant="body2" sx={topbarActionTextSx}>
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
