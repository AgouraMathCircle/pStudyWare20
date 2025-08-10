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
  Twitter as TwitterIcon,
  YouTube as YouTubeIcon,
  LinkedIn as LinkedInIcon,
  Instagram as InstagramIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  AttachMoney as DonateIcon,
  Rocket as RocketIcon,
  Edit as EditIcon,
  Group as GroupIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { authService } from "../services";

const Topbar = () => {
  const theme = useTheme();
  const _isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

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
      icon: <TwitterIcon />,
      href: "https://twitter.com/Agouramathcirle",
      label: "Twitter",
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

  // Hide topbar only for authenticated students, not on login page
  if (user && (user.role === "Student" || user.MemberType === "S")) {
    return null;
  }

  return (
    <Box
      className="topbar-container"
      sx={{
        backgroundColor: "#102d47",
        color: "#ffffff",
        height: "50px",
        lineHeight: "50px",
        fontSize: "14px",
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "100%",
          }}
        >
          {/* Left side - Navigation Links */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              flexShrink: 0,
            }}
          >
            {topbarLinks.map((link, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  cursor: "pointer",
                  "&:hover": { color: "#ccc" },
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
                onClick={() => handleNavigation(link.href, link.external)}
              >
                <Box sx={{ fontSize: 13, mr: 0.5 }}>{link.icon}</Box>
                <Typography variant="body2" sx={{ fontSize: "15px" }}>
                  {link.text}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Right side - Social Media & Actions */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              ml: 4, // Add more gap between left and right items
              flexShrink: 0,
            }}
          >
            {/* User Info - Show when logged in (for non-students) */}
            {user && !(user.role === "Student" || user.MemberType === "S") && (
              <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
                <Typography variant="body2" sx={{ color: "#ffffff", mr: 1 }}>
                  Welcome {user?.firstName || "User"},
                </Typography>
                <Typography variant="body2" sx={{ color: "#ffffff", mr: 2 }}>
                  {new Date().toLocaleDateString()}
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

            {/* Login/Logout Button */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                ml: 2,
                cursor: "pointer",
                "&:hover": { color: "#ccc" },
              }}
              onClick={user ? handleLogout : () => navigate("/login")}
            >
              {user ? (
                <>
                  <LogoutIcon sx={{ fontSize: 13, mr: 1 }} />
                  <Typography
                    variant="body2"
                    sx={{ fontSize: "15px", fontWeight: 400 }}
                  >
                    LOGOUT
                  </Typography>
                </>
              ) : (
                <>
                  <LoginIcon sx={{ fontSize: 13, mr: 1 }} />
                  <Typography
                    variant="body2"
                    sx={{ fontSize: "15px", fontWeight: 400 }}
                  >
                    LOGIN
                  </Typography>
                </>
              )}
            </Box>

            {/* Donate Button */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                ml: 2,
                cursor: "pointer",
                "&:hover": { color: "#ccc" },
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
