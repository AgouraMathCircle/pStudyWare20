import React, { useState } from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  TextField,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  LocationOn as LocationIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import "../styles/Contact.css";

// Import images
// Images moved to public/assets/images/
const pageHeaderImg = "/assets/images/about/page-header.jpg";

const Contact = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
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

  return (
    <Box className="contact-container">
      {/* Breadcrumbs Section */}
      <Box className="sc-breadcrumbs breadcrumbs-overlay">
        <Box className="breadcrumbs-img">
          <img src={pageHeaderImg} alt="Breadcrumbs Image" />
        </Box>
        <Box className="breadcrumbs-text white-color">
          <Typography
            variant="h1"
            className="page-title"
            sx={{
              fontSize: { xs: "2.5rem", md: "3.5rem" },
              fontWeight: 700,
              mb: 2,
            }}
          >
            Contact Us
          </Typography>
          <Box
            component="ul"
            sx={{
              listStyle: "none",
              p: 0,
              m: 0,
              display: "flex",
              alignItems: "center",
              gap: 1,
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
                  fontSize: "inherit",
                  textTransform: "none",
                }}
              >
                Home &gt;
              </Button>
            </Box>
            <Box component="li" sx={{ display: "inline-block" }}>
              <Typography component="span" sx={{ color: "white" }}>
                Contact Us
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Contact Section */}
      <Box
        sx={{
          pt: { xs: 4, md: 8 },
          pb: { xs: 4, md: 6 },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            {/* Contact Information */}
            <Grid item xs={12} md={5}>
              <Box>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    mb: 4,
                    fontSize: { xs: "2rem", md: "2.5rem" },
                  }}
                >
                  Get In Touch
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 4 }}>
                  Have questions about our programs? Want to learn more about
                  how to get involved? We'd love to hear from you! Reach out to
                  us through any of the channels below.
                </Typography>

                {/* Contact Info Cards */}
                <Box sx={{ mb: 4 }}>
                  <Card sx={{ mb: 2, boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
                    <CardContent
                      sx={{ display: "flex", alignItems: "center", p: 3 }}
                    >
                      <LocationIcon
                        sx={{
                          color: theme.palette.primary.main,
                          mr: 2,
                          fontSize: "2rem",
                        }}
                      />
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 600, mb: 1 }}
                        >
                          Location
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary" }}
                        >
                          Agoura Chapter
                          <br />
                          El Camino Real High School
                          <br />
                          5440 Valley Cir Blvd, Woodland Hills
                          <br />
                          CA 91367
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>

                  <Card sx={{ mb: 2, boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
                    <CardContent
                      sx={{ display: "flex", alignItems: "center", p: 3 }}
                    >
                      <EmailIcon
                        sx={{
                          color: theme.palette.primary.main,
                          mr: 2,
                          fontSize: "2rem",
                        }}
                      />
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 600, mb: 1 }}
                        >
                          Email
                        </Typography>
                        <Button
                          onClick={() =>
                            handleExternalLink(
                              "mailto:info@agouramathcircle.org"
                            )
                          }
                          sx={{
                            color: theme.palette.primary.main,
                            textTransform: "none",
                            p: 0,
                            "&:hover": {
                              backgroundColor: "transparent",
                              textDecoration: "underline",
                            },
                          }}
                        >
                          info@agouramathcircle.org
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>

                  <Card sx={{ boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
                    <CardContent
                      sx={{ display: "flex", alignItems: "center", p: 3 }}
                    >
                      <PhoneIcon
                        sx={{
                          color: theme.palette.primary.main,
                          mr: 2,
                          fontSize: "2rem",
                        }}
                      />
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 600, mb: 1 }}
                        >
                          Support
                        </Typography>
                        <Button
                          onClick={() =>
                            handleExternalLink(
                              "mailto:support@agouramathcircle.org"
                            )
                          }
                          sx={{
                            color: theme.palette.primary.main,
                            textTransform: "none",
                            p: 0,
                            "&:hover": {
                              backgroundColor: "transparent",
                              textDecoration: "underline",
                            },
                          }}
                        >
                          support@agouramathcircle.org
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>

                {/* Social Media Links */}
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Follow Us
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                      variant="outlined"
                      onClick={() =>
                        handleExternalLink(
                          "https://www.facebook.com/profile.php?id=100010784343153"
                        )
                      }
                      sx={{
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main,
                        "&:hover": {
                          backgroundColor: theme.palette.primary.main,
                          color: "white",
                        },
                      }}
                    >
                      Facebook
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() =>
                        handleExternalLink(
                          "https://twitter.com/Agouramathcirle"
                        )
                      }
                      sx={{
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main,
                        "&:hover": {
                          backgroundColor: theme.palette.primary.main,
                          color: "white",
                        },
                      }}
                    >
                      Twitter
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() =>
                        handleExternalLink(
                          "https://www.youtube.com/channel/UCWK2w-BVGps-Y9c08B5pRgA/videos"
                        )
                      }
                      sx={{
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main,
                        "&:hover": {
                          backgroundColor: theme.palette.primary.main,
                          color: "white",
                        },
                      }}
                    >
                      YouTube
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Grid>

            {/* Contact Form */}
            <Grid item xs={12} md={7}>
              <Card sx={{ boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      mb: 3,
                      fontSize: { xs: "1.8rem", md: "2.2rem" },
                    }}
                  >
                    Send Us a Message
                  </Typography>

                  <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Your Name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Email Address"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12}>
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
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          type="submit"
                          variant="contained"
                          size="large"
                          startIcon={<SendIcon />}
                          sx={{
                            backgroundColor: theme.palette.primary.main,
                            color: "white",
                            px: 4,
                            py: 1.5,
                            borderRadius: "5px",
                            fontWeight: 600,
                            fontSize: "1.1rem",
                            "&:hover": {
                              backgroundColor: theme.palette.primary.dark,
                            },
                          }}
                        >
                          Send Message
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Map Section */}
      <Box
        sx={{
          pt: { xs: 4, md: 6 },
          pb: { xs: 4, md: 6 },
          backgroundColor: "#f8f9fa",
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: "2rem", md: "2.5rem" },
              }}
            >
              Find Us
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              Visit us at our location or join our virtual sessions
            </Typography>
          </Box>

          <Card sx={{ boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
            <CardContent sx={{ p: 0 }}>
              <Box
                sx={{
                  height: "400px",
                  backgroundColor: "#e0e0e0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "8px",
                }}
              >
                <Typography variant="h6" sx={{ color: "text.secondary" }}>
                  Interactive Map Coming Soon
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </Box>
  );
};

export default Contact;
