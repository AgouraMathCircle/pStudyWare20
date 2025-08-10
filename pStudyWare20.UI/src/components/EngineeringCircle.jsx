import React from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  ArrowForward as ArrowForwardIcon,
  Check as CheckIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import "../styles/EngineeringCircle.css";

// Import images
// Images moved to public/assets/images/
const pageHeaderImg = "/assets/images/about/page-header.jpg";
const engineeringLogoImg = "/assets/images/about/engineering-logo.jpg";
const arrow1 = "/assets/images/arrow-1.png";
const arrow2 = "/assets/images/arrow-2.png";
const arrow3 = "/assets/images/arrow-3.png";
const arrow4 = "/assets/images/arrow-4.png";
const arrow5 = "/assets/images/arrow-5.png";

const EngineeringCircle = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleExternalLink = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Box className="engineering-circle-container">
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
            ENGINEERING CIRCLE
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
                About Us &gt;
              </Typography>
            </Box>
            <Box component="li" sx={{ display: "inline-block" }}>
              <Typography component="span" sx={{ color: "white" }}>
                Engineering Circle
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* About Section */}
      <Box
        id="sc-about"
        className="sc-about pt-80 pb-70 md-pt-40 position-relative arrow-animation-1"
        sx={{
          pt: { xs: 4, md: 8 },
          pb: { xs: 4, md: 6 },
          position: "relative",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} className="eng-row">
            <Grid item xs={12} md={9}>
              <Box className="sec-title">
                <Typography
                  variant="h3"
                  className="title mb-20"
                  sx={{
                    fontWeight: 700,
                    mb: 2.5,
                    fontSize: { xs: "1.8rem", md: "2.2rem" },
                  }}
                >
                  AGOURA ENGINEERING CIRCLE
                </Typography>
                <Box className="des about-cont">
                  <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 2 }}>
                    Welcome to the Agoura Engineering Circle. Usually
                    Mathematics and Computer programming, the two most universal
                    languages, are taught independent of each other or they're
                    taught one after the other. As part of Agoura Engineering
                    Circle, we are trying to combine these two universal
                    languages and solve some interesting problems. We will start
                    out our journey by introducing basic programming concepts
                    like branching, iteration, modular coding and data
                    structures while solving mathematics problems that most
                    students can understand but not necessarily solve by hand
                    easily. This type of interdisciplinary learning helps in
                    learning two things at the same time along with reinforcing
                    any prior knowledge. Once everyone has achieved some
                    proficiency in programming, we will move on to solving
                    artificial intelligence and machine learning challenges. The
                    goal of this program is to help students:
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box className="img-part position-relative">
                <Box
                  component="img"
                  src={engineeringLogoImg}
                  alt="Engineering Logo"
                  sx={{
                    width: "100%",
                    height: "auto",
                    maxHeight: "300px",
                    objectFit: "contain",
                    borderRadius: "10px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    padding: "10px",
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ textAlign: "center" }}>
                <Button
                  variant="contained"
                  className="readon"
                  onClick={() => handleNavigation("/about/projects")}
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: "white",
                    px: 4,
                    py: 1.5,
                    borderRadius: "5px",
                    fontWeight: 600,
                    "&:hover": {
                      backgroundColor: theme.palette.primary.dark,
                    },
                  }}
                >
                  PROJECTS
                </Button>
              </Box>
            </Grid>
          </Grid>

          {/* Data Science Section */}
          <Grid container spacing={4} className="eng-row1" sx={{ mt: 4 }}>
            <Grid item xs={12} md={8}>
              <Box className="sec-title mb-20">
                <Typography
                  variant="h3"
                  className="title mb-20 pt-20 mt-30"
                  sx={{
                    fontWeight: 700,
                    mb: 2.5,
                    pt: 2.5,
                    mt: 3,
                    fontSize: { xs: "1.6rem", md: "2rem" },
                  }}
                >
                  INTRODUCTION TO DATA SCIENCE and ARTIFICIAL INTELLIGENCE USING
                  PYTHON
                </Typography>
                <Box className="des about-cont">
                  <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 3 }}>
                    Imagine building a self-driving car and having to program
                    exactly how to turn right at every right turn in the world.
                    Sometimes, there may be people around the corner, it may be
                    raining or another car might be close behind. Programming
                    all these situations explicitly is almost impossible.
                    Instead these programs learn based on previously known
                    "good" states and adapt to the new situations. In this
                    course, we will learn to program an intelligent application,
                    specifically, predicting the success of a movie. We'll do
                    this as a four-part, 90-hour course consisting of 36
                    sessions:
                  </Typography>
                  <Box
                    component="ul"
                    className="check-square two-line mb-20 about-cont"
                    sx={{ listStyle: "none", p: 0 }}
                  >
                    <Box
                      component="li"
                      sx={{ display: "flex", alignItems: "center", mb: 1 }}
                    >
                      <CheckIcon
                        sx={{ color: theme.palette.primary.main, mr: 1 }}
                      />
                      Python programming
                    </Box>
                    <Box
                      component="li"
                      sx={{ display: "flex", alignItems: "center", mb: 1 }}
                    >
                      <CheckIcon
                        sx={{ color: theme.palette.primary.main, mr: 1 }}
                      />
                      Mathematical Foundations for AI using NumPy
                    </Box>
                    <Box
                      component="li"
                      sx={{ display: "flex", alignItems: "center", mb: 1 }}
                    >
                      <CheckIcon
                        sx={{ color: theme.palette.primary.main, mr: 1 }}
                      />
                      Data Handling and manipulation using Pandas
                    </Box>
                    <Box
                      component="li"
                      sx={{ display: "flex", alignItems: "center", mb: 1 }}
                    >
                      <CheckIcon
                        sx={{ color: theme.palette.primary.main, mr: 1 }}
                      />
                      Introduction to Artificial Intelligence methods
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box
                className="img-part align-items-center"
                sx={{ display: "flex", alignItems: "center", height: "100%" }}
              >
                {/* Additional content or image can be added here */}
              </Box>
            </Grid>
          </Grid>
        </Container>

        {/* Animated Arrows */}
        <Box
          className="animated-arrow-1 animated-arrow left-right-new"
          sx={{
            position: "absolute",
            top: "20%",
            left: "10%",
            animation: "leftRight 3s ease-in-out infinite",
          }}
        >
          <Box component="img" src={arrow1} alt="" />
        </Box>
        <Box
          className="animated-arrow-2 animated-arrow up-down-new"
          sx={{
            position: "absolute",
            top: "40%",
            right: "15%",
            animation: "upDown 4s ease-in-out infinite",
          }}
        >
          <Box component="img" src={arrow2} alt="" />
        </Box>
        <Box
          className="animated-arrow-3 animated-arrow up-down-new"
          sx={{
            position: "absolute",
            bottom: "30%",
            left: "20%",
            animation: "upDown 3.5s ease-in-out infinite",
          }}
        >
          <Box component="img" src={arrow3} alt="" />
        </Box>
        <Box
          className="animated-arrow-4 animated-arrow left-right-new"
          sx={{
            position: "absolute",
            bottom: "20%",
            right: "10%",
            animation: "leftRight 4.5s ease-in-out infinite",
          }}
        >
          <Box component="img" src={arrow3} alt="" />
        </Box>
      </Box>

      {/* Counter Section */}
      <Box
        className="sc-counter style2-about pt-120 pb-115 md-pt-80 md-pb-50 counter-bg1 position-relative arrow-animation-1"
        sx={{
          pt: { xs: 6, md: 10 },
          pb: { xs: 4, md: 8 },
          backgroundColor: "#f8f9fa",
          position: "relative",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: "center" }}>
                <Box className="icon-part" sx={{ mb: 2 }}>
                  <Box
                    component="i"
                    className="flaticon flaticon-laptop"
                    sx={{
                      fontSize: "3rem",
                      color: theme.palette.primary.main,
                    }}
                  />
                </Box>
                <Typography
                  variant="h2"
                  className="counter-title"
                  sx={{ fontWeight: 700, mb: 1 }}
                >
                  36
                </Typography>
                <Typography variant="h5" className="title mb-0">
                  Sessions
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: "center" }}>
                <Box className="icon-part ping-color" sx={{ mb: 2 }}>
                  <Box
                    component="i"
                    className="flaticon flaticon-study"
                    sx={{
                      fontSize: "3rem",
                      color: "#ff6b6b",
                    }}
                  />
                </Box>
                <Typography
                  variant="h2"
                  className="counter-title"
                  sx={{ fontWeight: 700, mb: 1 }}
                >
                  90
                </Typography>
                <Typography variant="h5" className="title mb-0">
                  Hours
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: "center" }}>
                <Box className="icon-part green-color" sx={{ mb: 2 }}>
                  <Box
                    component="i"
                    className="flaticon flaticon-teacher"
                    sx={{
                      fontSize: "3rem",
                      color: "#51cf66",
                    }}
                  />
                </Box>
                <Typography
                  variant="h2"
                  className="counter-title"
                  sx={{ fontWeight: 700, mb: 1 }}
                >
                  4
                </Typography>
                <Typography variant="h5" className="title mb-0">
                  Parts
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: "center" }}>
                <Box className="icon-part yellow-color" sx={{ mb: 2 }}>
                  <Box
                    component="i"
                    className="flaticon flaticon-monitor"
                    sx={{
                      fontSize: "3rem",
                      color: "#ffd43b",
                    }}
                  />
                </Box>
                <Typography
                  variant="h2"
                  className="counter-title"
                  sx={{ fontWeight: 700, mb: 1 }}
                >
                  AI
                </Typography>
                <Typography variant="h5" className="title mb-0">
                  Focus
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>

        {/* Animated Arrows for Counter Section */}
        <Box
          className="animated-arrow-1 animated-arrow left-right-new"
          sx={{
            position: "absolute",
            top: "20%",
            left: "10%",
            animation: "leftRight 3s ease-in-out infinite",
          }}
        >
          <Box component="img" src={arrow5} alt="" />
        </Box>
        <Box
          className="animated-arrow-2 animated-arrow up-down-new"
          sx={{
            position: "absolute",
            top: "40%",
            right: "15%",
            animation: "upDown 4s ease-in-out infinite",
          }}
        >
          <Box component="img" src={arrow2} alt="" />
        </Box>
        <Box
          className="animated-arrow-3 animated-arrow up-down-new"
          sx={{
            position: "absolute",
            bottom: "30%",
            left: "20%",
            animation: "upDown 3.5s ease-in-out infinite",
          }}
        >
          <Box component="img" src={arrow4} alt="" />
        </Box>
        <Box
          className="animated-arrow-4 animated-arrow left-right-new"
          sx={{
            position: "absolute",
            bottom: "20%",
            right: "10%",
            animation: "leftRight 4.5s ease-in-out infinite",
          }}
        >
          <Box component="img" src={arrow3} alt="" />
        </Box>
      </Box>

      {/* Registration Section */}
      <Box
        sx={{
          pt: { xs: 4, md: 6 },
          pb: { xs: 4, md: 6 },
          backgroundColor: theme.palette.primary.main,
          color: "white",
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 3,
                fontSize: { xs: "2rem", md: "2.5rem" },
              }}
            >
              Ready to Start Your Engineering Journey?
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, fontSize: "1.1rem" }}>
              Join our Engineering Circle program and learn the fundamentals of
              programming, data science, and artificial intelligence.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => handleNavigation("/registration/student")}
              sx={{
                backgroundColor: "white",
                color: theme.palette.primary.main,
                px: 4,
                py: 2,
                borderRadius: "5px",
                fontWeight: 600,
                fontSize: "1.1rem",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              }}
            >
              Register Now <ArrowForwardIcon sx={{ ml: 1 }} />
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default EngineeringCircle;
