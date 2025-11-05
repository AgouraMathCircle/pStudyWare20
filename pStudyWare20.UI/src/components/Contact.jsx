import React, { useState } from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  TextField,
  useTheme,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Instagram as InstagramIcon,
  YouTube as YouTubeIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import "../styles/Contact.css";
// Import images from src/assets
import pageHeaderImg from "../assets/images/about/page-header.jpg";

const Contact = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Contact form submitted:", formData);
    // Reset form
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  const handleExternalLink = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Primary green color
  const primaryGreen = "#53b50a";
  const darkGray = "#373737";

  return (
    <Box
      className="contact-container"
      sx={{ backgroundColor: "#ffffff", minHeight: "100vh" }}
    >
      {/* Breadcrumbs Section with Mathematical Background */}
      <Box className="sc-breadcrumbs breadcrumbs-overlay contact-breadcrumbs">
        <Box className="breadcrumbs-img">
          <img src={pageHeaderImg} alt="Breadcrumbs Image" />
        </Box>
        <Box className="breadcrumbs-text white-color">
          <Typography
            variant="h1"
            className="page-title"
            sx={{
              fontSize: { xs: "1.75rem", sm: "2rem", md: "3.5rem" },
              fontWeight: 700,
              mb: { xs: 1, md: 2 },
              px: { xs: 2, md: 0 },
            }}
          >
            CONTACT US
          </Typography>
          <Box
            component="ul"
            sx={{
              listStyle: "none",
              p: 0,
              m: 0,
              display: "flex",
              alignItems: "center",
              gap: { xs: 0.5, md: 1 },
              justifyContent: "center",
              flexWrap: "wrap",
              px: { xs: 2, md: 0 },
              fontSize: { xs: "0.875rem", md: "1rem" },
            }}
          >
            <Box component="li" sx={{ display: "inline-block" }}>
              <Button
                onClick={() => handleNavigation("/")}
                sx={{
                  color: "white",
                  textDecoration: "underline",
                  p: 0,
                  minWidth: "auto",
                  fontSize: { xs: "0.875rem", md: "inherit" },
                  textTransform: "none",
                  minHeight: { xs: "44px", md: "auto" },
                }}
              >
                Home &gt;
              </Button>
            </Box>
            <Box component="li" sx={{ display: "inline-block" }}>
              <Typography
                component="span"
                sx={{
                  color: "white",
                  fontSize: { xs: "0.875rem", md: "1rem" },
                }}
              >
                Contact Us
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Main Content Section */}
      <Box>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Box sx={{ mb: { xs: 3, md: 4 }, mt: { xs: 2, md: 0 } }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                mb: { xs: 1.5, md: 2 },
                mt: { xs: 1, md: 2 },
                fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2.5rem" },
                color: "#1a2b51",
                textTransform: "uppercase",
                textAlign: { xs: "center", md: "center" },
                fontFamily: "sans-serif",
                letterSpacing: "0.5px",
                px: { xs: 1, md: 0 },
              }}
            >
              HAPPY TO HELP!
            </Typography>
            {/* CONTACT US Title */}
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "0.875rem", sm: "1rem", md: "1.25rem" },
                color: darkGray,
                textTransform: "uppercase",
                textAlign: "left",
                px: { xs: 1, md: 0 },
              }}
            >
              CONTACT US
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
            {/* Column 1: Agoura Chapter, ACT/SAT/PSAT, WE'RE SOCIAL */}
            <Grid item xs={12} sm={6} md={3}>
              <Box>
                {/* Agoura Chapter El Camino Real High School */}
                <Box sx={{ mb: { xs: 3, md: 4 } }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      mb: { xs: 0.75, md: 1 },
                      color: primaryGreen,
                      fontSize: { xs: "0.875rem", sm: "0.95rem", md: "1.1rem" },
                      lineHeight: { xs: 1.4, md: 1.5 },
                    }}
                  >
                    Agoura Chapter El Camino Real High School
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: darkGray,
                      mb: 0.5,
                      fontSize: { xs: "0.813rem", sm: "0.875rem", md: "1rem" },
                      lineHeight: { xs: 1.5, md: 1.6 },
                    }}
                  >
                    5440 Valley Cir Blvd, Woodland Hill CA 91367
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: darkGray,
                      fontSize: { xs: "0.813rem", sm: "0.875rem", md: "1rem" },
                      wordBreak: "break-word",
                    }}
                  >
                    Email:{" "}
                    <Box
                      component="a"
                      href="mailto:support@agouramathcircle.org"
                      sx={{
                        color: primaryGreen,
                        textDecoration: "none",
                        fontSize: {
                          xs: "0.813rem",
                          sm: "0.875rem",
                          md: "1rem",
                        },
                        "&:hover": {
                          textDecoration: "underline",
                        },
                        touchAction: "manipulation",
                      }}
                    >
                      support@agouramathcircle.org
                    </Box>
                  </Typography>
                </Box>

                {/* ACT/SAT/PSAT */}
                <Box sx={{ mb: { xs: 3, md: 4 } }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      mb: { xs: 0.75, md: 1 },
                      color: primaryGreen,
                      fontSize: { xs: "0.875rem", sm: "0.95rem", md: "1.1rem" },
                    }}
                  >
                    ACT/SAT/PSAT
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: darkGray,
                      fontSize: { xs: "0.813rem", sm: "0.875rem", md: "1rem" },
                      wordBreak: "break-word",
                    }}
                  >
                    Email:{" "}
                    <Box
                      component="a"
                      href="mailto:support@agouramathcircle.org"
                      sx={{
                        color: primaryGreen,
                        textDecoration: "none",
                        fontSize: {
                          xs: "0.813rem",
                          sm: "0.875rem",
                          md: "1rem",
                        },
                        "&:hover": {
                          textDecoration: "underline",
                        },
                        touchAction: "manipulation",
                      }}
                    >
                      support@agouramathcircle.org
                    </Box>
                  </Typography>
                </Box>

                {/* WE'RE SOCIAL Section */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: { xs: 1.5, md: 2 },
                    flexWrap: "wrap",
                    mb: { xs: 2, md: 0 },
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: "0.688rem", sm: "0.75rem", md: "1rem" },
                      color: darkGray,
                      textTransform: "uppercase",
                    }}
                  >
                    WE'RE SOCIAL
                  </Typography>
                  {/* Social Media Icons */}
                  <Box
                    sx={{
                      display: "flex",
                      gap: { xs: 0.75, sm: 1, md: 1.5 },
                      alignItems: "center",
                    }}
                  >
                    <IconButton
                      onClick={() =>
                        handleExternalLink(
                          "https://www.facebook.com/profile.php?id=100010784343153"
                        )
                      }
                      sx={{
                        color: primaryGreen,
                        border: `1px solid ${primaryGreen}`,
                        "&:hover": {
                          backgroundColor: primaryGreen,
                          color: "#ffffff",
                        },
                        "&:active": {
                          backgroundColor: primaryGreen,
                          color: "#ffffff",
                        },
                        width: { xs: 36, sm: 40, md: 24 },
                        height: { xs: 36, sm: 40, md: 24 },
                        minWidth: { xs: "44px", md: "auto" },
                        minHeight: { xs: "44px", md: "auto" },
                        touchAction: "manipulation",
                        "& .MuiSvgIcon-root": {
                          fontSize: { xs: "1rem", sm: "1.125rem", md: "1rem" },
                        },
                      }}
                    >
                      <FacebookIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={() =>
                        handleExternalLink(
                          "https://twitter.com/Agouramathcirle"
                        )
                      }
                      sx={{
                        color: primaryGreen,
                        border: `1px solid ${primaryGreen}`,
                        "&:hover": {
                          backgroundColor: primaryGreen,
                          color: "#ffffff",
                        },
                        "&:active": {
                          backgroundColor: primaryGreen,
                          color: "#ffffff",
                        },
                        width: { xs: 36, sm: 40, md: 24 },
                        height: { xs: 36, sm: 40, md: 24 },
                        minWidth: { xs: "44px", md: "auto" },
                        minHeight: { xs: "44px", md: "auto" },
                        touchAction: "manipulation",
                        "& .MuiSvgIcon-root": {
                          fontSize: { xs: "1rem", sm: "1.125rem", md: "1rem" },
                        },
                      }}
                    >
                      <TwitterIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={() =>
                        handleExternalLink(
                          "https://www.linkedin.com/company/agouramathcircle"
                        )
                      }
                      sx={{
                        color: primaryGreen,
                        border: `1px solid ${primaryGreen}`,
                        "&:hover": {
                          backgroundColor: primaryGreen,
                          color: "#ffffff",
                        },
                        "&:active": {
                          backgroundColor: primaryGreen,
                          color: "#ffffff",
                        },
                        width: { xs: 36, sm: 40, md: 24 },
                        height: { xs: 36, sm: 40, md: 24 },
                        minWidth: { xs: "44px", md: "auto" },
                        minHeight: { xs: "44px", md: "auto" },
                        touchAction: "manipulation",
                        "& .MuiSvgIcon-root": {
                          fontSize: { xs: "1rem", sm: "1.125rem", md: "1rem" },
                        },
                      }}
                    >
                      <LinkedInIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={() =>
                        handleExternalLink(
                          "https://www.instagram.com/agouramathcircle"
                        )
                      }
                      sx={{
                        color: primaryGreen,
                        border: `1px solid ${primaryGreen}`,
                        "&:hover": {
                          backgroundColor: primaryGreen,
                          color: "#ffffff",
                        },
                        "&:active": {
                          backgroundColor: primaryGreen,
                          color: "#ffffff",
                        },
                        width: { xs: 36, sm: 40, md: 24 },
                        height: { xs: 36, sm: 40, md: 24 },
                        minWidth: { xs: "44px", md: "auto" },
                        minHeight: { xs: "44px", md: "auto" },
                        touchAction: "manipulation",
                        "& .MuiSvgIcon-root": {
                          fontSize: { xs: "1rem", sm: "1.125rem", md: "1rem" },
                        },
                      }}
                    >
                      <InstagramIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={() =>
                        handleExternalLink(
                          "https://www.youtube.com/channel/UCWK2w-BVGps-Y9c08B5pRgA/videos"
                        )
                      }
                      sx={{
                        color: primaryGreen,
                        border: `1px solid ${primaryGreen}`,
                        "&:hover": {
                          backgroundColor: primaryGreen,
                          color: "#ffffff",
                        },
                        "&:active": {
                          backgroundColor: primaryGreen,
                          color: "#ffffff",
                        },
                        width: { xs: 36, sm: 40, md: 24 },
                        height: { xs: 36, sm: 40, md: 24 },
                        minWidth: { xs: "44px", md: "auto" },
                        minHeight: { xs: "44px", md: "auto" },
                        touchAction: "manipulation",
                        "& .MuiSvgIcon-root": {
                          fontSize: { xs: "1rem", sm: "1.125rem", md: "1rem" },
                        },
                      }}
                    >
                      <YouTubeIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            </Grid>

            {/* Column 2: Agoura Engineering Circle, Online Chapter */}
            <Grid item xs={12} md={4}>
              <Box>
                {/* Agoura Engineering Circle */}
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      color: primaryGreen,
                      fontSize: { xs: "1rem", md: "1.1rem" },
                    }}
                  >
                    Agoura Engineering Circle
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: darkGray,
                      fontSize: { xs: "0.9rem", md: "1rem" },
                    }}
                  >
                    Email:{" "}
                    <Box
                      component="a"
                      href="mailto:support@agouramathcircle.org"
                      sx={{
                        color: primaryGreen,
                        textDecoration: "none",
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}
                    >
                      support@agouramathcircle.org
                    </Box>
                  </Typography>
                </Box>

                {/* Online Chapter */}
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      color: primaryGreen,
                      fontSize: { xs: "1rem", md: "1.1rem" },
                    }}
                  >
                    Online Chapter
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: darkGray,
                      fontSize: { xs: "0.9rem", md: "1rem" },
                    }}
                  >
                    Email:{" "}
                    <Box
                      component="a"
                      href="mailto:support@agouramathcircle.org"
                      sx={{
                        color: primaryGreen,
                        textDecoration: "none",
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}
                    >
                      support@agouramathcircle.org
                    </Box>
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Column 3: Contact Form - Vertical Layout */}
            <Grid item xs={12} md={5}>
              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                <TextField
                  fullWidth
                  label="Your Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#ffffff",
                      fontSize: { xs: "1rem", md: "1.1rem" },
                      "& input": {
                        fontSize: { xs: "1rem", md: "1.1rem" },
                      },
                      "& fieldset": {
                        borderColor: "#d3d3d3",
                      },
                      "&:hover fieldset": {
                        borderColor: primaryGreen,
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: primaryGreen,
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: darkGray,
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: primaryGreen,
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Email ID"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#ffffff",
                      "& input": {
                        fontSize: { xs: "1rem", md: "1.1rem" },
                      },
                      "& fieldset": {
                        borderColor: "#d3d3d3",
                      },
                      "&:hover fieldset": {
                        borderColor: primaryGreen,
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: primaryGreen,
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: darkGray,
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: primaryGreen,
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#ffffff",
                      "& input": {},
                      "& fieldset": {
                        borderColor: "#d3d3d3",
                      },
                      "&:hover fieldset": {
                        borderColor: primaryGreen,
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: primaryGreen,
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: darkGray,
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: primaryGreen,
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  multiline
                  rows={6}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#ffffff",
                      "& textarea": {},
                      "& fieldset": {
                        borderColor: "#d3d3d3",
                      },
                      "&:hover fieldset": {
                        borderColor: primaryGreen,
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: primaryGreen,
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: darkGray,
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: primaryGreen,
                    },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: primaryGreen,
                    color: "#ffffff",
                    px: 4,
                    py: 1.5,
                    borderRadius: "5px",
                    fontWeight: 600,
                    fontSize: { xs: "0.95rem", md: "1.1rem" },
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "#449804",
                    },
                    minWidth: { xs: "150px", md: "180px" },
                    alignSelf: "flex-start",
                  }}
                >
                  Send Message
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Contact;
