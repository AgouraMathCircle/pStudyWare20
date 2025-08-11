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
  Download as DownloadIcon,
  Email as EmailIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import "../styles/TestPreparation.css";
// Import images from src/assets
import pageHeaderImg from "../assets/images/about/page-header.jpg";
import logoImg from "../assets/images/about/logo.jpg";
import actImg from "../assets/images/about/agoura-act.png";
import psatImg from "../assets/images/about/agoura-PSAT.png";
import arrow1Img from "../assets/images/arrow-1.png";
import arrow2Img from "../assets/images/arrow-2.png";
import arrow3Img from "../assets/images/arrow-3.png";

const TestPreparation = () => {
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
    <Box className="test-preparation-container">
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
            TEST PREPARATION
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
                Test Preparation
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
                  AGOURA TEST PREPARATION
                </Typography>
                <Box className="des about-cont">
                  <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 2 }}>
                    Welcome to the Agoura Test Preparation (SAT/PSAT/ACT) Skype
                    Training! Our mission is to empower everyone with the
                    necessary knowledge to score exceptionally on SAT/PSAT, and
                    ACT. The VIRTUAL sessions will cover a combination of tips,
                    working examples, and related homework assignments to master
                    all covered tips. The pace of these sessions will enable
                    students to retain the learnings through carefully selected
                    homework assignments.
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box className="img-part position-relative">
                <Box
                  component="img"
                  src={logoImg}
                  alt="Test Prep Logo"
                  sx={{
                    width: "100%",
                    height: "auto",
                    maxHeight: "250px",
                    objectFit: "contain",
                    borderRadius: "10px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    padding: "15px",
                  }}
                />
              </Box>
            </Grid>
          </Grid>

          {/* ACT Section */}
          <Box sx={{ mt: 6 }}>
            <Typography
              variant="h3"
              className="title mb-20"
              sx={{
                fontWeight: 700,
                mb: 2.5,
                fontSize: { xs: "1.8rem", md: "2.2rem" },
              }}
            >
              ACT TEST PREPARATION
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 3 }}>
              ACT is one of the accepted required standardized tests in most
              colleges across the nation. In this course, we'll discuss various
              sections of ACT test in detail with various tips in addressing
              those efficiently. We'll do this as a four-part, 20-hour course
              consisting of 10 sessions:
            </Typography>
            <Box
              component="ul"
              className="check-square two-line mb-20 about-cont"
              sx={{ listStyle: "none", p: 0, mb: 3 }}
            >
              <Box
                component="li"
                sx={{ display: "flex", alignItems: "center", mb: 1 }}
              >
                <CheckIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                ACT English
              </Box>
              <Box
                component="li"
                sx={{ display: "flex", alignItems: "center", mb: 1 }}
              >
                <CheckIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                ACT Reading
              </Box>
              <Box
                component="li"
                sx={{ display: "flex", alignItems: "center", mb: 1 }}
              >
                <CheckIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                ACT Math
              </Box>
              <Box
                component="li"
                sx={{ display: "flex", alignItems: "center", mb: 1 }}
              >
                <CheckIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                ACT Science
              </Box>
            </Box>
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 4 }}>
              Final Exam: Actual ACT exam from QAS tests
            </Typography>
          </Box>

          {/* ACT Details */}
          <Grid container spacing={4} className="eng-row1" sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <Box className="img-part position-relative">
                <Box
                  component="img"
                  src={actImg}
                  alt="ACT Training"
                  sx={{
                    width: "100%",
                    height: "auto",
                    maxHeight: "350px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    marginBottom: "20px",
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box className="sec-title mb-20">
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    mb: 3,
                    fontSize: { xs: "1.5rem", md: "1.8rem" },
                  }}
                >
                  ACT TRAINING
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    CURRICULUM URL:
                  </Typography>
                  <Button
                    startIcon={<DownloadIcon />}
                    onClick={() =>
                      handleExternalLink("/Documents/AMC_ACT_Curriculum.pdf")
                    }
                    sx={{
                      color: theme.palette.primary.main,
                      textTransform: "none",
                      fontWeight: 600,
                      p: 0,
                      "&:hover": {
                        backgroundColor: "transparent",
                        textDecoration: "underline",
                      },
                    }}
                  >
                    ACT TRAINING - Download
                  </Button>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    STARTING DATE:
                  </Typography>
                  <Typography variant="body1">TBD</Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    LOCATION:
                  </Typography>
                  <Typography variant="body1">VIRTUAL</Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    SCHEDULE:
                  </Typography>
                  <Typography variant="body1">ALTERNATE SUNDAY</Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    TIME:
                  </Typography>
                  <Typography variant="body1">
                    1:00 PM PST - 3:00 PM PST
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    SEMESTER:
                  </Typography>
                  <Typography variant="body1">FALL AND SPRING</Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Pre-requisites:
                  </Typography>
                  <Typography variant="body1">Grade: 9-11 only</Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    CONTACT US:
                  </Typography>
                  <Button
                    startIcon={<EmailIcon />}
                    onClick={() =>
                      handleExternalLink("mailto:SUPPORT@AGOURAMATHCIRCLE.ORG")
                    }
                    sx={{
                      color: theme.palette.primary.main,
                      textTransform: "none",
                      fontWeight: 600,
                      p: 0,
                      "&:hover": {
                        backgroundColor: "transparent",
                        textDecoration: "underline",
                      },
                    }}
                  >
                    SUPPORT@AGOURAMATHCIRCLE.ORG
                  </Button>
                </Box>

                <Button
                  variant="contained"
                  className="readon eng-btn"
                  onClick={() => handleNavigation("/registration/student")}
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
                  Register Now
                </Button>
              </Box>
            </Grid>
          </Grid>

          {/* SAT/PSAT Section */}
          <Box sx={{ mt: 8 }}>
            <Typography
              variant="h3"
              className="title sat mb-20"
              sx={{
                fontWeight: 700,
                mb: 2.5,
                fontSize: { xs: "1.8rem", md: "2.2rem" },
              }}
            >
              SAT/PSAT Training
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 3 }}>
              The SAT/PSAT/NMSQT is a standardized test used for college
              admissions and scholarships in the United States. It is currently
              administered by the College Board, an American nonprofit
              organization. The SAT/PSAT covers three skill areas: reading,
              writing and language, and math. The SAT/PSAT is also good practice
              for the SAT, the main test used in college admissions. Based on
              scores in the SAT/PSAT, one can obtain a National Merit
              Scholarship. The SAT/PSAT exam can be taken any year, but it only
              counts for scholarships typically in 11th grade.
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 3 }}>
              In this course, we will discuss various sections of the SAT/PSAT
              test with specific test-taking tricks and tips. We will do this as
              a three-part, 20-hour course consisting of 10 sessions:
            </Typography>
            <Box
              component="ul"
              className="check-square two-line mb-20 about-cont"
              sx={{ listStyle: "none", p: 0, mb: 3 }}
            >
              <Box
                component="li"
                sx={{ display: "flex", alignItems: "center", mb: 1 }}
              >
                <CheckIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                SAT/PSAT Reading
              </Box>
              <Box
                component="li"
                sx={{ display: "flex", alignItems: "center", mb: 1 }}
              >
                <CheckIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                SAT/PSAT Writing and Language
              </Box>
              <Box
                component="li"
                sx={{ display: "flex", alignItems: "center", mb: 1 }}
              >
                <CheckIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                SAT/PSAT Math
              </Box>
            </Box>
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 4 }}>
              Final Exam: Actual SAT/PSAT exam from QAS tests
            </Typography>
          </Box>

          {/* SAT/PSAT Details */}
          <Grid container spacing={4} className="eng-row1" sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <Box className="img-part position-relative">
                <Box
                  component="img"
                  src={psatImg}
                  alt="SAT/PSAT Training"
                  sx={{
                    width: "100%",
                    height: "auto",
                    maxHeight: "350px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    marginBottom: "20px",
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box className="sec-title mb-20">
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    mb: 3,
                    fontSize: { xs: "1.5rem", md: "1.8rem" },
                  }}
                >
                  SAT/PSAT
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    CURRICULUM URL:
                  </Typography>
                  <Button
                    startIcon={<DownloadIcon />}
                    onClick={() =>
                      handleExternalLink("/Documents/AMC_SAT_Curriculum.pdf")
                    }
                    sx={{
                      color: theme.palette.primary.main,
                      textTransform: "none",
                      fontWeight: 600,
                      p: 0,
                      "&:hover": {
                        backgroundColor: "transparent",
                        textDecoration: "underline",
                      },
                    }}
                  >
                    SAT/PSAT TRAINING - Download
                  </Button>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    STARTING DATE:
                  </Typography>
                  <Typography variant="body1">TBD</Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    LOCATION:
                  </Typography>
                  <Typography variant="body1">VIRTUAL</Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    SCHEDULE:
                  </Typography>
                  <Typography variant="body1">ALTERNATE SUNDAY</Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    TIME:
                  </Typography>
                  <Typography variant="body1">
                    1:00 PM PST - 3:00 PM PST
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    SEMESTER:
                  </Typography>
                  <Typography variant="body1">FALL AND SPRING</Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Pre-requisites:
                  </Typography>
                  <Typography variant="body1">Grade: 8-11 only</Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    CONTACT US:
                  </Typography>
                  <Button
                    startIcon={<EmailIcon />}
                    onClick={() =>
                      handleExternalLink("mailto:SUPPORT@AGOURAMATHCIRCLE.ORG")
                    }
                    sx={{
                      color: theme.palette.primary.main,
                      textTransform: "none",
                      fontWeight: 600,
                      p: 0,
                      "&:hover": {
                        backgroundColor: "transparent",
                        textDecoration: "underline",
                      },
                    }}
                  >
                    SUPPORT@AGOURAMATHCIRCLE.ORG
                  </Button>
                </Box>

                <Button
                  variant="contained"
                  className="readon eng-btn"
                  onClick={() => handleNavigation("/registration/student")}
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
                  Register Now
                </Button>
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
              Ready to Ace Your Tests?
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, fontSize: "1.1rem" }}>
              Join our test preparation programs and get the scores you need for
              college admissions and scholarships.
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

export default TestPreparation;
