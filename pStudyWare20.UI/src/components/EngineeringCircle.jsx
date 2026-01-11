import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Check as CheckIcon } from "@mui/icons-material";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import GoogleIcon from "@mui/icons-material/Google";
import { useNavigate } from "react-router-dom";
import "../styles/EngineeringCircle.css";
// Import images from src/assets
import pageHeaderImg from "../assets/images/about/page-header.jpg";
import engineeringCirclePhoto from "../assets/images/Engineering Circle 1 (1).jpg";
import aecLogoImg from "../assets/images/AECLogo.jpg";
import agouraDataScienceImg from "../assets/images/about/agoura-ds-updated.jpg";
import agouraAiImg from "../assets/images/about/agoura-ai.png";
import mobileAppDevImg from "../assets/images/about/MobileAppDevelopmentPoster.png";
import arrow1Img from "../assets/images/arrow-1.png";
import arrow2Img from "../assets/images/arrow-2.png";
import arrow3Img from "../assets/images/arrow-3.png";
// Team member images
import sriyaImg from "../assets/images/team/2.jpg";
import andrewImg from "../assets/images/team/3.jpg";
import hussainImg from "../assets/images/team/person-icon.png";
import balajiImg from "../assets/images/team/volunteers/Balaji.png";
import gopinathImg from "../assets/images/team/person-icon.png";
import kumarImg from "../assets/images/team/person-icon.png";
import srihariImg from "../assets/images/team/volunteers/Srihari.jpg";
import nayanaImg from "../assets/images/team/volunteers/Nayana_Ashok_Photo.jpg";
import haridevImg from "../assets/images/team/volunteers/Haridev.jpg";

const EngineeringCircle = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const [isButtonVisible, setIsButtonVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const registerSection = document.getElementById("data-science-section");
      if (registerSection) {
        const rect = registerSection.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.75) {
          setIsButtonVisible(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleExternalLink = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div>
      {/* Breadcrumbs Section */}
      <Box
        className="sc-breadcrumbs breadcrumbs-overlay"
        sx={{ mb: 0, minHeight: { xs: 160, md: 240 } }}
      >
        <Box
          className="breadcrumbs-img"
          sx={{
            overflow: "hidden",
            height: "100%",
            "& img": {
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            },
          }}
        >
          <img src={pageHeaderImg} alt="Breadcrumbs Image" />
        </Box>
        <Box className="breadcrumbs-text white-color">
          <Typography
            variant="h1"
            className="page-title"
            sx={{
              fontSize: { xs: "2.5rem", md: "3.5rem" },
              fontWeight: 700,
              mb: 1,
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
          pt: { xs: 3, md: 6 },
          pb: { xs: 2, md: 4 },
          position: "relative",
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            px: { xs: 2, md: 3 },
          }}
        >
          <Grid
            container
            spacing={1} // tighter spacing
            className="eng-row"
            sx={{
              alignItems: "flex-start",
              flexWrap: { xs: "wrap", md: "nowrap" },
            }}
          >
            {/* Content (left side) */}
            <Grid
              item
              xs={12}
              md={9}
              sx={{
                order: { xs: 1, md: 1 },
                pr: { md: 4 },
                pl: { xs: 0, md: 2.5 },
                flexBasis: { md: "75%" },
                maxWidth: { md: "75%" },
              }}
            >
              <Box className="sec-title">
                <Typography
                  variant="h3"
                  className="title mb-20"
                  sx={{
                    fontWeight: 700,
                    mb: 2.5,
                    fontSize: { xs: "1.8rem", md: "2.2rem" },
                    mt: { xs: 2, md: 3 },
                  }}
                >
                  AGOURA ENGINEERING CIRCLE
                </Typography>
                <Box className="des about-cont">
                  <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 3 }}>
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
                <Box sx={{ textAlign: { xs: "center", md: "left" }, mt: 2 }}>
                  <Button
                    variant="contained"
                    className="readon"
                    onClick={() => handleNavigation("/about/projects")}
                    sx={{
                      backgroundColor: "#00b800",
                      color: "white",
                      px: 4,
                      py: 1.5,
                      borderRadius: "5px",
                      fontWeight: 600,
                      "&:hover": {
                        backgroundColor: "#009600",
                      },
                    }}
                  >
                    PROJECTS
                  </Button>
                </Box>
              </Box>
            </Grid>

            {/* Image (right side) */}
            <Grid
              item
              xs={12}
              md={3}
              sx={{
                order: { xs: 2, md: 2 },
                display: { xs: "block", md: "block" },
                alignItems: "flex-start",
                justifyContent: { xs: "center", md: "flex-end" },
                flexBasis: { md: "25%" },
                maxWidth: { md: "25%" },
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mt: { xs: 4, md: 5 },
                }}
              >
                <Box
                  component="img"
                  src={aecLogoImg}
                  alt="AEC Logo"
                  sx={{ width: "100%", height: "auto", display: "block" }}
                />
              </Box>
            </Grid>
          </Grid>

          {/* Data Science Section */}
          <Grid
            container
            spacing={1}
            className="eng-row1"
            sx={{
              // remove extra gap above this subsection
              mt: 0,
              alignItems: "flex-start",
              flexWrap: { xs: "wrap", md: "nowrap" },
            }}
          >
            <Grid item xs={12} md={8}>
              <Box className="sec-title mb-20">
                <Typography
                  variant="h3"
                  className="title mb-20"
                  sx={{
                    fontWeight: 700,
                    // tighter spacing for heading
                    mb: { xs: 1.25, md: 2 },
                    pt: 0,
                    mt: 0,
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
            <Grid
              item
              xs={12}
              md={4}
              sx={{
                display: { xs: "block", md: "flex" },
                justifyContent: { xs: "center", md: "flex-end" },
              }}
            >
              <Box
                className="img-part position-relative"
                sx={{ width: "100%", display: "block" }}
              >
                <Box
                  component="img"
                  src={engineeringCirclePhoto}
                  alt="Engineering Circle Photo"
                  sx={{
                    width: "100%",
                    height: "auto",
                    objectFit: "contain",
                    display: "block",
                    borderRadius: "8px",
                  }}
                />
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
          <Box component="img" src={arrow1Img} alt="" />
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
          <Box component="img" src={arrow2Img} alt="" />
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
          <Box component="img" src={arrow3Img} alt="" />
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
          <Box component="img" src={arrow3Img} alt="" />
        </Box>
      </Box>

      {/* Data Science Registration Section */}
      <Box
        id="data-science-section"
        sx={{
          backgroundColor: "#ffffff",
          mt: 0,
          // minimal vertical padding to tighten section
          py: { xs: 0.5, md: 1 },
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Container maxWidth="lg" sx={{ px: { xs: 2, md: 4 } }}>
          <Grid
            container
            spacing={1}
            sx={{
              flexWrap: "nowrap",
              overflowX: { xs: "auto", md: "visible" },
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Left image */}
            <Grid
              item
              xs={6}
              md={6}
              sx={{
                display: "flex",
                justifyContent: { xs: "flex-start", md: "center" },
                flexShrink: 0,
                minWidth: { xs: "300px", md: "auto" },
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  maxWidth: 520,
                  boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
                  borderRadius: 0,
                  overflow: "hidden",
                  background: "#fff",
                }}
              >
                <Box
                  component="img"
                  src={agouraDataScienceImg}
                  alt="Data Science Course"
                  sx={{
                    width: "100%",
                    height: "auto",
                    objectFit: "cover",
                    maxHeight: { xs: 280, md: 500 },
                    display: "block",
                  }}
                />
              </Box>
            </Grid>

            {/* Right content */}
            <Grid
              item
              xs={6}
              md={6}
              sx={{
                minWidth: { xs: "300px", md: "auto" },
                display: "flex",
                alignItems: "center",
              }}
            >
              <Box sx={{ width: "100%", pl: { md: 4, xs: 2 } }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    mb: 0.75,
                    fontSize: { xs: "2rem", md: "2.4rem" },
                    color: "#333",
                    textAlign: { xs: "center", md: "left" },
                  }}
                >
                  INTRODUCTION TO DATA SCIENCE
                </Typography>

                <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
                  <Typography
                    variant="body2"
                    sx={{ mb: 1, fontSize: "1.1rem", color: "#555" }}
                  >
                    <strong>CURRICULUM URL:</strong>{" "}
                    <span style={{ color: "#00b800", cursor: "pointer" }}>
                      INTRODUCTION TO DATA SCIENCE
                    </span>{" "}
                    - Download 📄
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ mb: 1.25, fontSize: "1.1rem", color: "#555" }}
                  >
                    <strong>STARTING DATE:</strong>{" "}
                    <span style={{ color: "#00b800" }}>AUG 24, 2025</span>
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ mb: 1.25, fontSize: "1.1rem", color: "#555" }}
                  >
                    <strong>LOCATION:</strong>{" "}
                    <span style={{ color: "#00b800" }}>VIRTUAL</span>
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ mb: 1.25, fontSize: "1.1rem", color: "#555" }}
                  >
                    <strong>SCHEDULE:</strong>{" "}
                    <span style={{ color: "#00b800" }}>
                      ALTERNATE SUNDAYS 10:00AM - 12:00P [PST].
                    </span>
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ mb: 2, fontSize: "1.1rem", color: "#555" }}
                  >
                    <strong>CONTACT US:</strong>{" "}
                    <span style={{ color: "#00b800" }}>
                      SUPPORT@AGOURAMATHCIRCLE.ORG
                    </span>
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      mb: 3,
                      fontSize: "1.05rem",
                      color: "#666",
                      lineHeight: 1.6,
                    }}
                  >
                    <strong>Pre-requisites:</strong> Good understanding of basic
                    mathematical concepts (no higher than 8th grade level or
                    taught in Senior Intermediate level at Agoura Math Circle).
                    Also, students have to get their own desktops or laptops to
                    program.
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: { xs: "center", md: "flex-start" },
                    }}
                  >
                    <Button
                      variant="contained"
                      onClick={() => handleNavigation("/studentregistration")}
                      sx={{
                        backgroundColor: "#00b800",
                        color: "white",
                        px: 4,
                        py: 1.5,
                        borderRadius: 1,
                        fontWeight: 600,
                        fontSize: "1rem",
                        opacity: isButtonVisible ? 1 : 0,
                        transform: isButtonVisible
                          ? "translateY(0)"
                          : "translateY(40px)",
                        transition: "all 0.7s ease-out",
                        "&:hover": { backgroundColor: "#009600" },
                      }}
                    >
                      Register Now
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Agoura AI section: content left, image right */}
      <Box
        id="agoura-ai-section"
        sx={{
          backgroundColor: "#ffffff",
          py: { xs: 1, md: 2 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Container maxWidth="lg" sx={{ px: { xs: 2, md: 4 } }}>
          <Grid
            container
            spacing={2}
            alignItems="center"
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {/* Left: registration/content */}
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  pl: { md: 2, xs: 0 },
                  textAlign: { xs: "center", md: "left" },
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: "1.85rem", md: "2.3rem" },
                    color: "#333",
                    mb: 1,
                  }}
                >
                  INTRODUCTION TO AI
                </Typography>

                <Box>
                  <Typography
                    variant="body2"
                    sx={{ mb: 1, fontSize: "1.1rem", color: "#555" }}
                  >
                    <strong>CURRICULUM URL :</strong>{" "}
                    <span style={{ color: "#00b800", cursor: "pointer" }}>
                      INTRODUCTION TO AI
                    </span>{" "}
                    - <strong>Download</strong>
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ mb: 1, fontSize: "1.1rem", color: "#555" }}
                  >
                    <strong>STARTING DATE:</strong>{" "}
                    <span style={{ color: "#00b800" }}>AUG 23, 2025</span>
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ mb: 1, fontSize: "1.1rem", color: "#555" }}
                  >
                    <strong>LOCATION:</strong>{" "}
                    <span style={{ color: "#00b800" }}>VIRTUAL</span>
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ mb: 1, fontSize: "1.1rem", color: "#555" }}
                  >
                    <strong>SCHEDULE:</strong>{" "}
                    <span style={{ color: "#00b800" }}>
                      ALTERNATE SATURDAYS 7:00AM - 9:00AM [PST]
                    </span>
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ mb: 1, fontSize: "1.1rem", color: "#555" }}
                  >
                    <strong>SEMESTER:</strong>{" "}
                    <span style={{ color: "#00b800" }}>FALL AND SPRING</span>
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ mb: 2, fontSize: "1.1rem", color: "#555" }}
                  >
                    <strong>CONTACT US:</strong>{" "}
                    <span style={{ color: "#00b800" }}>
                      SUPPORT@AGOURAMATHCIRCLE.ORG
                    </span>
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: { xs: "center", md: "flex-start" },
                    }}
                  >
                    <Button
                      variant="contained"
                      onClick={() => handleNavigation("/studentregistration")}
                      sx={{
                        backgroundColor: "#00b800",
                        color: "#fff",
                        px: 4,
                        py: 1.5,
                        borderRadius: 1,
                        fontWeight: 600,
                        fontSize: "1rem",
                        "&:hover": { backgroundColor: "#009600" },
                      }}
                    >
                      Register Now
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Grid>

            {/* Right: Agoura AI image */}
            <Grid
              item
              xs={12}
              md={5}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Box sx={{ width: "100%", maxWidth: 520, ml: { md: 12, xs: 0 } }}>
                <Box
                  component="img"
                  src={agouraAiImg}
                  alt="Agoura AI"
                  sx={{
                    width: "100%",
                    height: "auto",
                    maxHeight: { xs: 280, md: 500 },
                    objectFit: "cover",
                    display: "block",
                    borderRadius: 2,
                    boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Mobile App Development Section */}
      <Box
        id="mobile-app-section"
        sx={{
          backgroundColor: "#ffffff",
          py: { xs: 1, md: 2 },
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Container maxWidth="lg" sx={{ px: { xs: 2, md: 4 } }}>
          <Grid
            container
            spacing={1}
            sx={{
              flexWrap: "nowrap",
              overflowX: { xs: "auto", md: "visible" },
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Left image */}
            <Grid
              item
              xs={6}
              md={6}
              sx={{
                display: "flex",
                justifyContent: { xs: "flex-start", md: "center" },
                flexShrink: 0,
                minWidth: { xs: "300px", md: "auto" },
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  maxWidth: 520,
                  boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
                  borderRadius: 0,
                  overflow: "hidden",
                  background: "#fff",
                }}
              >
                <Box
                  component="img"
                  src={mobileAppDevImg}
                  alt="Mobile App Development Course"
                  sx={{
                    width: "100%",
                    height: "auto",
                    objectFit: "cover",
                    maxHeight: { xs: 280, md: 500 },
                    display: "block",
                  }}
                />
              </Box>
            </Grid>

            {/* Right content */}
            <Grid
              item
              xs={6}
              md={6}
              sx={{
                minWidth: { xs: "300px", md: "auto" },
                display: "flex",
                alignItems: "center",
              }}
            >
              <Box sx={{ width: "100%", pl: { md: 4, xs: 2 } }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    mb: 0.75,
                    fontSize: { xs: "2rem", md: "2.4rem" },
                    color: "#333",
                    textAlign: { xs: "center", md: "left" },
                  }}
                >
                  INTRODUCTION TO MOBILE APP DEVELOPMENT
                </Typography>

                <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
                  <Typography
                    variant="body2"
                    sx={{ mb: 1, fontSize: "1.1rem", color: "#555" }}
                  >
                    <strong>CURRICULUM URL:</strong>{" "}
                    <span style={{ color: "#00b800", cursor: "pointer" }}>
                      INTRODUCTION TO MOBILE APP DEVELOPMENT
                    </span>{" "}
                    - Download 📄
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ mb: 1.25, fontSize: "1.1rem", color: "#555" }}
                  >
                    <strong>STARTING DATE:</strong>{" "}
                    <span style={{ color: "#00b800" }}>AUG 23, 2025</span>
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ mb: 1.25, fontSize: "1.1rem", color: "#555" }}
                  >
                    <strong>LOCATION:</strong>{" "}
                    <span style={{ color: "#00b800" }}>VIRTUAL</span>
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ mb: 1.25, fontSize: "1.1rem", color: "#555" }}
                  >
                    <strong>SCHEDULE:</strong>{" "}
                    <span style={{ color: "#00b800" }}>
                      ALTERNATE SATURDAYS 9:00AM - 11:00PM [PST].
                    </span>
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ mb: 2, fontSize: "1.1rem", color: "#555" }}
                  >
                    <strong>CONTACT US:</strong>{" "}
                    <span style={{ color: "#00b800" }}>
                      SUPPORT@AGOURAMATHCIRCLE.ORG
                    </span>
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      mb: 3,
                      fontSize: "1.05rem",
                      color: "#666",
                      lineHeight: 1.6,
                    }}
                  >
                    <strong>Pre-requisites:</strong> Understanding and knowledge
                    of any basic programming language (optional). Good
                    understanding of basic mathematical concepts (no higher than
                    8th grade level or taught in Senior Intermediate level at
                    Agoura Math Circle). Students must have their own
                    desktop/laptop to code.
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: { xs: "center", md: "flex-start" },
                    }}
                  >
                    <Button
                      variant="contained"
                      onClick={() => handleNavigation("/studentregistration")}
                      sx={{
                        backgroundColor: "#00b800",
                        color: "white",
                        px: 4,
                        py: 1.5,
                        borderRadius: 1,
                        fontWeight: 600,
                        fontSize: "1rem",
                        "&:hover": { backgroundColor: "#009600" },
                      }}
                    >
                      Register Now
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* AEC Team Section */}
      <Box
        id="aec-team-section"
        sx={{
          backgroundColor: "#ffff",
          py: { xs: 2, md: 4 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Container maxWidth="lg" sx={{ px: { xs: 1, md: 2 } }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1.9rem", md: "2.6rem" },
              color: "#002855",
              textAlign: "center",
              mb: 4,
            }}
          >
            AEC TEAM
          </Typography>

          <Grid
            container
            spacing={3}
            sx={{
              alignItems: "stretch",
              justifyContent: "center",
            }}
          >
            {[
              { img: sriyaImg, name: "SRIYA KALYAN(AHS)", role: "Founder" },
              { img: andrewImg, name: "ANDREW XU (MIT)", role: "Director" },
              { img: hussainImg, name: "HUSSAIN PATEL", role: "Coordinator" },
              { img: balajiImg, name: "BALAJI", role: "Coordinator" },
              { img: gopinathImg, name: "GOPINATH", role: "Coordinator" },
              { img: kumarImg, name: "KUMAR", role: "Instructor" },
              { img: srihariImg, name: "SRIHARI K", role: "Instructor" },
              { img: nayanaImg, name: "NAYANA", role: "Instructor" },
              { img: haridevImg, name: "HARIDEV", role: "Instructor" },
            ].map((member) => (
              <Grid
                key={member.name}
                item
                xs={12}
                sm={3}
                md={3} // 4 columns at sm and up
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  px: 0.5,
                  boxSizing: "border-box",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    textAlign: "center",
                    backgroundColor: "#fff",
                    p: 1.5,
                    borderRadius: 1,
                    boxShadow: "0 8px 24px rgba(2,28,50,0.06)",
                    transition: "transform 0.25s ease, boxShadow 0.25s ease",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0 14px 32px rgba(2,28,50,0.09)",
                    },
                  }}
                >
                  {/* image container */}
                  <Box
                    sx={{
                      width: "100%",
                      height: 220,
                      borderRadius: 1,
                      mb: 1.5,
                      overflow: "hidden",
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#f2f2f2",
                      // trigger .social-row reveal on hover of parent Box
                      "&:hover .social-row": {
                        opacity: 1,
                        transform: "translate(-50%, 0)",
                      },
                    }}
                  >
                    <Box
                      component="img"
                      src={member.img}
                      alt={member.name}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                        borderRadius: 1,
                      }}
                    />

                    {/* social icons row (hidden by default, slides up on hover) */}
                    <Box
                      className="social-row"
                      sx={{
                        position: "absolute",
                        left: "50%",
                        bottom: 12,
                        transform: "translate(-50%, 10px)",
                        display: "flex",
                        gap: 1,
                        opacity: 0,
                        transition: "all 220ms cubic-bezier(.2,.9,.2,1)",
                        zIndex: 10,
                        justifyContent: "center",
                      }}
                    >
                      {[
                        <FacebookIcon
                          key="f"
                          sx={{ fontSize: 18, color: "white" }}
                        />,
                        <GoogleIcon
                          key="g"
                          sx={{ fontSize: 18, color: "white" }}
                        />,
                        <TwitterIcon
                          key="t"
                          sx={{ fontSize: 18, color: "white" }}
                        />,
                        <LinkedInIcon
                          key="l"
                          sx={{ fontSize: 18, color: "white" }}
                        />,
                      ].map((icon, i) => (
                        <Box
                          key={i}
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            backgroundColor: "#00b800",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
                            cursor: "pointer",
                            flexShrink: 0,
                            transition:
                              "transform 150ms ease, background-color 150ms",
                            "&:hover": {
                              transform: "translateY(-4px)",
                              backgroundColor: "#009600",
                            },
                          }}
                        >
                          {icon}
                        </Box>
                      ))}
                    </Box>
                  </Box>

                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: "1.05rem",
                      color: "#002855",
                      mb: 0.5,
                    }}
                  >
                    {member.name}
                  </Typography>

                  <Typography
                    sx={{ fontSize: "0.95rem", color: "#666", mt: "auto" }}
                  >
                    {member.role}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </div>
  );
};

export default EngineeringCircle;
