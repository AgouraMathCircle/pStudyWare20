import React from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
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
import pageHeaderImg from "../assets/images/about/page-header.jpg";
import logoImg from "../assets/images/about/logo.jpg";
import actImg from "../assets/images/about/agoura-act.png";
import psatImg from "../assets/images/about/agoura-PSAT.png";
import arrow1Img from "../assets/images/arrow-1.png";
import arrow2Img from "../assets/images/arrow-2.png";
import arrow3Img from "../assets/images/arrow-3.png";
import AnandImg from "../assets/images/team/volunteers/Anand.png";
import MugilImg from "../assets/images/team/volunteers/mugil.jpg";
import SriyaImg from "../assets/images/team/volunteers/sriyakalyan.png";
import CharlieImg from "../assets/images/team/volunteers/charlie.png";
import RuhanImg from "../assets/images/team/volunteers/ruhan.png";
import BhavyaImg from "../assets/images/team/volunteers/BHAVYASHANMUGAM.jpg";
import ReshmaImg from "../assets/images/team/volunteers/Reshma_Chellamma_Photo.jpg";
import ShrinidhiImg from "../assets/images/team/volunteers/Shrinidhi_Prabhaharan_Photo.jpg";
import NamrathaImg from "../assets/images/team/volunteers/Namratha_Yadalla_Photo.jpg";
import AnushaImg from "../assets/images/team/volunteers/Anusha_Grewal_Photo.jpg";
import NayanaImg from "../assets/images/team/volunteers/Nayana_Ashok_Photo.jpg";

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

  // Icon style
  const iconStyle = {
    width: "38px",
    height: "38px",
    backgroundColor: "#6cc24a",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "0.3s",
    cursor: "pointer",
    "&:hover": { 
      transform: "scale(1.1)",
      backgroundColor: "#4fa832"
    }
  };

  // Social media icons SVG data
  const socialIcons = [
    {
      name: "facebook",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="white" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>`
    },
    {
      name: "google-plus",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="white" viewBox="0 0 24 24">
        <path d="M7.635 10.909v2.619h4.335c-.173 1.125-1.31 3.295-4.331 3.295-2.604 0-4.731-2.16-4.731-4.823 0-2.662 2.122-4.823 4.728-4.823 1.485 0 2.48.639 3.049 1.188l2.073-1.997c-1.33-1.245-3.056-1.995-5.122-1.995C3.412 4.365 0 7.785 0 12s3.412 7.635 7.635 7.635c4.41 0 7.332-3.098 7.332-7.461 0-.501-.054-.885-.12-1.265H7.635zm16.365 0h-2.183V8.726h-2.183v2.183h-2.182v2.181h2.184v2.184h2.189v-2.184H24v-2.181z"/>
      </svg>`
    },
    {
      name: "twitter",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="white" viewBox="0 0 24 24">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.213c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
      </svg>`
    },
    {
      name: "linkedin",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="white" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>`
    }
  ];

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
                  "&:hover": {
                    color: "#6cc24a",
                    backgroundColor: "transparent",
                  },
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
          <Box sx={{ position: 'relative', width: '100%' }}>
            <Grid container spacing={4} alignItems="flex-start">
              {/* Text Content */}
              <Grid item xs={12} md={9}>
                <Box className="sec-title">
                  <Typography
                    variant="h3"
                    sx={{ 
                      fontWeight: 700, 
                      mb: 2.5, 
                      fontSize: { xs: "1.8rem", md: "2.2rem" },
                      pr: { md: 30 }
                    }}
                  >
                    AGOURA TEST PREPARATION
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      lineHeight: 1.8,
                      mb: 2,
                      pr: { md: 35 },
                      textAlign: "justify",
                      textJustify: "inter-word",
                      fontSize: { xs: "1.2 rem", md: "1.2 rem" }
                    }}
                  >
                    Welcome to the Agoura Test Preparation (SAT/PSAT/ACT) Skype Training! Our mission is 
                    to empower everyone with the necessary knowledge to score exceptionally on SAT/PSAT, 
                    and ACT. The VIRTUAL sessions will cover a combination of tips, working examples, and
                    related homework assignments to master all covered tips. The pace of these sessions 
                    will enable students to retain the learnings through carefully selected homework 
                    assignments.
                  </Typography>
                </Box>
              </Grid>

              {/* Logo */}
              <Box
                sx={{
                  position: { xs: 'static', md: 'absolute' },
                  right: { md: 0 },
                  top: { md: 0 },
                  width: { xs: '100%', md: 'auto' },
                  textAlign: { xs: 'center', md: 'right' },
                  px: { xs: 2, md: 0 }
                }}
              >
                <Box
                  component="img"
                  src={logoImg}
                  alt="Test Prep Logo"
                  sx={{
                    width: { xs: 180, md: 240 },
                    maxWidth: '100%',
                    height: 'auto',
                    objectFit: 'contain',
                    borderRadius: '10px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    backgroundColor: 'transparent'
                  }}
                />
              </Box>
            </Grid>
          </Box>

          {/* ACT Section */}
          <Box sx={{ mt: 6 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 2.5,
                fontSize: { xs: "1.8rem", md: "2.2rem" },
                color: "black",
                borderBottom: "none",
                "&::after": { display: "none" },
              }}
            >
              ACT TEST PREPARATION
            </Typography>

            <Typography
              variant="body1"
              sx={{
                lineHeight: 1.8,
                mb: 3,
                textAlign: "justify",
                textJustify: "inter-word",
                fontSize: { xs: "1.2 rem", md: "1.2 rem" }
              }}
            >
              ACT is one of the accepted required standardized tests in most
              colleges across the nation. In this course, we'll discuss various
              sections of ACT test in detail with various tips in addressing
              those efficiently. We'll do this as a four-part, 20-hour course
              consisting of 10 sessions:
            </Typography>

            <Box
              component="ul"
              sx={{
                listStyle: "none",
                p: 0,
                m: 0,
                display: "flex",
                flexWrap: "wrap",
                gap: 3,
                alignItems: "center",
                mb: 0,
              }}
            >
              <Box component="li" sx={{ display: "flex", alignItems: "center" }}>
                <CheckIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                ACT English
              </Box>
              <Box component="li" sx={{ display: "flex", alignItems: "center" }}>
                <CheckIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                ACT Reading
              </Box>
              <Box component="li" sx={{ display: "flex", alignItems: "center" }}>
                <CheckIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                ACT Math
              </Box>
              <Box component="li" sx={{ display: "flex", alignItems: "center" }}>
                <CheckIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                ACT Science
              </Box>
            </Box>
            <Typography 
              variant="body1" 
              sx={{ 
                fontWeight: 600, 
                mt: 2,
                fontSize: { xs: "1.2rem", md: "1.5rem" }
              }}
            >
              Final Exam: Actual ACT exam from QAS tests
            </Typography>

          </Box>

          {/* ACT Details */}
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src={actImg}
                alt="ACT Training"
                sx={{
                  display: "block",
                  width: "100%",
                  height: "auto",
                  maxHeight: "750px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                }}
              />
            </Grid>        
            <Grid item xs={12} md={6}>
              <Box sx={{ mt: 2 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: "#1a365d",
                    mb: 1.5,
                    fontSize: "1.8rem",
                  }}
                >
                  ACT TRAINING
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#1a365d",
                      mr: 0.5,
                      fontWeight: 600,
                      fontSize: "1.2rem",
                    }}
                  >
                    CURRICULUM URL:
                  </Typography>
                  <Button
                    startIcon={<DownloadIcon />}
                    onClick={() =>
                      handleExternalLink("/Documents/AMC_ACT_Curriculum.pdf")
                    }
                    sx={{
                      color: "#00b800",
                      textTransform: "none",
                      fontWeight: 600,
                      p: 0,
                      fontSize: "1.2rem",
                      "&:hover": {
                        backgroundColor: "transparent",
                        textDecoration: "underline",
                        color: "#6cc24a",
                      },
                    }}
                  >
                    ACT TRAINING - Download
                  </Button>
                </Box>

                {[  
                  { label: "STARTING DATE:", value: "TBD" },
                  { label: "LOCATION:", value: "VIRTUAL" },
                  { label: "SCHEDULE:", value: "ALTERNATE SUNDAY" },
                  { label: "TIME:", value: "1:00 PM PST - 3:00 PM PST" },
                  { label: "SEMESTER:", value: "FALL AND SPRING" },
                  { label: "Pre-requisites:", value: "Grade: 9-11 only" },
                  { label: "CONTACT US:", value: "SUPPORT@AGOURAMATHCIRCLE.ORG" },
                ].map((item, index) => (
                  <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#1a365d",
                        mr: 0.5,
                        fontWeight: 600,
                        fontSize: "1.2rem",
                      }}
                    >
                      {item.label}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#00b800",
                        fontWeight: 600,
                        fontSize: "1.2rem",
                      }}
                    >
                      {item.value}
                    </Typography>
                  </Box>
                ))}
                
                {/* ACT Register Now Button - FIXED */}
                <Box sx={{ mt: 3 }}>
                  <Button
                    variant="contained"
                    onClick={() => handleNavigation("/registration/student")}
                    sx={{
                      backgroundColor: "#00b800",
                      color: "white",
                      px: 4,
                      py: 1.2,
                      borderRadius: "5px",
                      fontWeight: 600,
                      fontSize: "1.1rem",
                      textTransform: "uppercase",
                      transition: "all 0.3s ease",
                      animation: "slideUp 0.6s ease-out forwards",
                      opacity: 0,
                      transform: "translateY(30px)",
                      "&:hover": {
                        backgroundColor: "#009600",
                        transform: "translateY(-3px)",
                        boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
                      },
                      "&:active": {
                        transform: "translateY(-1px)",
                        boxShadow: "0 5px 10px rgba(0, 0, 0, 0.2)",
                      },
                    }}
                  >
                    Register Now
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* SAT/PSAT Section */}
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 2.5,
              fontSize: { xs: "1.8rem", md: "2.2rem" },
              color: "black",
              borderBottom: "none",
              "&::after": { display: "none" },
            }}
          >
            SAT/PSAT Training
          </Typography>

          <Typography
            variant="body1"
            sx={{
              lineHeight: 1.8,
              mb: 3,
              textAlign: "justify",
              textJustify: "inter-word",
              fontSize: { xs: "1.2 rem", md: "1.2 rem" }
            }}
          >
            The SAT/PSAT/NMSQT is a standardized test used for college admissions and scholarships in the United States. It is currently administered by the College Board, an American nonprofit organization. The SAT/PSAT covers three skill areas: reading, writing and language, and math. The SAT/PSAT is also good practice for the SAT, the main test used in college admissions. Based on scores in the SAT/PSAT, one can obtain a National Merit Scholarship. The SAT/PSAT exam can be taken any year, but it only counts for scholarships typically in 11th grade. In this course, we will discuss various sections of the SAT/PSAT test with specific test-taking tricks and tips. We will do this as a three-part, 20-hour course consisting of 10 sessions:
          </Typography>
          <Box
            component="ul"
            sx={{
              listStyle: "none",
              p: 0,
              m: 0,
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
              alignItems: "center",
              mb: 0,
            }}
          >
            <Box component="li" sx={{ display: "flex", alignItems: "center" }}>
              <CheckIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
              SAT/PSAT Reading
            </Box>
            <Box component="li" sx={{ display: "flex", alignItems: "center" }}>
              <CheckIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
              SAT/PSAT Writing and Language
            </Box>
            <Box component="li" sx={{ display: "flex", alignItems: "center" }}>
              <CheckIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
              SAT/PSAT Math
            </Box>
          </Box>
          <Typography 
            variant="body1" 
            sx={{ 
              fontWeight: 600, 
              mt: 2,
              fontSize: { xs: "1.2rem", md: "1.5rem" }
            }}
          >
            Final Exam: Actual ACT exam from QAS tests
          </Typography>
          
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src={psatImg}
                alt="SAT/PSAT Training"
                sx={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "750px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ mt: 2 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: "#1a365d",
                    mb: 1.5,
                    fontSize: "1.8rem",
                  }}
                >
                  SAT/PSAT TRAINING
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#1a365d",
                      mr: 0.5,
                      fontWeight: 600,
                      fontSize: "1.2rem",
                    }}
                  >
                    CURRICULUM URL:
                  </Typography>
                  <Button
                    startIcon={<DownloadIcon />}
                    onClick={() =>
                      handleExternalLink("/Documents/AMC_SAT_Curriculum.pdf")
                    }
                    sx={{
                      color: "#00b800",
                      textTransform: "none",
                      fontWeight: 600,
                      p: 0,
                      fontSize: "1.2rem",
                      "&:hover": {
                        backgroundColor: "transparent",
                        textDecoration: "underline",
                        color: "#6cc24a",
                      },
                    }}
                  >
                    SAT/PSAT TRAINING - Download
                  </Button>
                </Box>

                {[
                  { label: "STARTING DATE:", value: "JAN 28,2024" },
                  { label: "LOCATION:", value: "VIRTUAL" },
                  { label: "SCHEDULE:", value: "ALTERNATE SUNDAY" },
                  { label: "TIME:", value: "1:00 PM PST - 3:00 PM PST" },
                  { label: "SEMESTER:", value: "FALL AND SPRING" },
                  { label: "Pre-requisites:", value: "Grade: 9-11 only" },
                ].map((item, index) => (
                  <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#1a365d",
                        mr: 0.5,
                        fontWeight: 600,
                        fontSize: "1.2rem",
                      }}
                    >
                      {item.label}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#00b800",
                        fontWeight: 600,
                        fontSize: "1.2rem",
                      }}
                    >
                      {item.value}
                    </Typography>
                  </Box>
                ))}

                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#1a365d",
                      mr: 0.5,
                      fontWeight: 600,
                      fontSize: "1.2rem",
                    }}
                  >
                    CONTACT US:
                  </Typography>
                  <Button
                    startIcon={<EmailIcon />}
                    onClick={() =>
                      handleExternalLink("mailto:SUPPORT@AGOURAMATHCIRCLE.ORG")
                    }
                    sx={{
                      color: "#00b800",
                      textTransform: "none",
                      fontWeight: 600,
                      p: 0,
                      fontSize: "1.2rem",
                      "&:hover": {
                        backgroundColor: "transparent",
                        textDecoration: "underline",
                        color: "#6cc24a",
                      },
                    }}
                  >
                    SUPPORT@AGOURAMATHCIRCLE.ORG
                  </Button>
                </Box>

                {/* SAT/PSAT Register Now Button - FIXED */}
                <Box sx={{ mt: 3 }}>
                  <Button
                    variant="contained"
                    onClick={() => handleNavigation("/registration/student")}
                    sx={{
                      backgroundColor: "#00b800",
                      color: "white",
                      px: 4,
                      py: 1.2,
                      borderRadius: "5px",
                      fontWeight: 600,
                      fontSize: "1.1rem",
                      textTransform: "uppercase",
                      transition: "all 0.3s ease",
                      animation: "slideUp 0.6s ease-out 0.2s forwards",
                      opacity: 0,
                      transform: "translateY(30px)",
                      "&:hover": {
                        backgroundColor: "#009600",
                        transform: "translateY(-3px)",
                        boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
                      },
                      "&:active": {
                        transform: "translateY(-1px)",
                        boxShadow: "0 5px 10px rgba(0, 0, 0, 0.2)",
                      },
                    }}
                  >
                    Register Now
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* SAT/PSAT TEAM */}
          <Box sx={{ mt: 6 }}>
            <Typography
              variant="h3"
              sx={{ fontWeight: 700, mb: 4, fontSize: { xs: "1.8rem", md: "2.2rem" } }}
            >
              SAT/PSAT TEAM
            </Typography>

            <Grid container spacing={3}>
              {[
                { name: "ANAND", logo: "F", img: AnandImg },
                { name: "MUGIL SHANMUGAM", logo: "G", img: MugilImg },
                { name: "SRIYA KALYAN", logo: "T", img: SriyaImg },
                { name: "CHARLIE NICKS", logo: "L", img: CharlieImg },
                { name: "RUHAN", logo: "N", img: RuhanImg },
                { name: "BHAVYA", logo: "D", img: BhavyaImg },
              ].map((member, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Box sx={{ textAlign: "center" }}>
                    <Box
                      sx={{
                        width: "280px",
                        mx: "auto",
                        backgroundColor: "#fff",
                        borderRadius: "18px",
                        border: "3px solid #e0e0e0",
                        boxShadow: "0 8px 18px rgba(0,0,0,0.25)",
                        padding: "16px",
                      }}
                    >
                      <Box
                        sx={{
                          width: "100%",
                          height: "260px",
                          overflow: "hidden",
                          borderRadius: "14px",
                          position: "relative",
                          cursor: "pointer",
                          "&:hover .overlay": { opacity: 1 },
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
                            transition: "transform 0.3s ease",
                            "&:hover": {
                              transform: "scale(1.05)",
                            },
                          }}
                        />

                        {/* SOCIAL ICONS - Fixed position without sliding */}
                        <Box
                          className="overlay"
                          sx={{
                            position: "absolute",
                            bottom: "20px",
                            left: 0,
                            right: 0,
                            display: "flex",
                            justifyContent: "center",
                            gap: "8px",
                            opacity: 0,
                            transition: "opacity 0.3s ease",
                          }}
                        >
                          {socialIcons.map((icon, idx) => (
                            <Box
                              key={idx}
                              sx={iconStyle}
                              dangerouslySetInnerHTML={{
                                __html: icon.svg
                              }}
                            />
                          ))}
                        </Box>
                      </Box>

                      <Typography
                        variant="body1"
                        sx={{
                          mt: 1.4,
                          fontWeight: 700,
                          fontSize: "1.15rem",
                          textTransform: "capitalize",
                        }}
                      >
                        {member.name}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* ACT TEAM */}
          <Box sx={{ mt: 8 }}>
            <Typography
              variant="h3"
              sx={{ fontWeight: 700, mb: 4, fontSize: { xs: "1.8rem", md: "2.2rem" } }}
            >
              ACT TEAM
            </Typography>

            <Grid container spacing={3} justifyContent="center">
              {[
                { name: "RESHMA CHELLAMMA", logo: "R", img: ReshmaImg },
                { name: "NAMRATHA YADALLA", logo: "N", img: NamrathaImg },
                { name: "SHRINIDHI PRABHARAHAN", logo: "S", img: ShrinidhiImg },
                { name: "ANUSHA GREWAL", logo: "A", img: AnushaImg },
                { name: "NAYANA ASHOK", logo: "N", img: NayanaImg },
              ].map((member, index) => (
                <Grid item xs={12} sm={6} md={3} lg={3} key={index}>
                  <Box sx={{ textAlign: "center" }}>
                    <Box
                      sx={{
                        width: "280px",
                        mx: "auto",
                        backgroundColor: "#fff",
                        borderRadius: "18px",
                        border: "3px solid #e0e0e0",
                        boxShadow: "0 8px 18px rgba(0,0,0,0.25)",
                        padding: "16px",
                      }}
                    >
                      <Box
                        sx={{
                          width: "100%",
                          height: "260px",
                          overflow: "hidden",
                          borderRadius: "14px",
                          position: "relative",
                          cursor: "pointer",
                          "&:hover .overlay": { opacity: 1 },
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
                            transition: "transform 0.3s ease",
                            "&:hover": {
                              transform: "scale(1.05)",
                            },
                          }}
                        />

                        {/* SOCIAL ICONS - Fixed position without sliding */}
                        <Box
                          className="overlay"
                          sx={{
                            position: "absolute",
                            bottom: "20px",
                            left: 0,
                            right: 0,
                            display: "flex",
                            justifyContent: "center",
                            gap: "8px",
                            opacity: 0,
                            transition: "opacity 0.3s ease",
                          }}
                        >
                          {socialIcons.map((icon, idx) => (
                            <Box
                              key={idx}
                              sx={iconStyle}
                              dangerouslySetInnerHTML={{
                                __html: icon.svg
                              }}
                            />
                          ))}
                        </Box>
                      </Box>

                      <Typography
                        variant="body1"
                        sx={{
                          mt: 1.4,
                          fontWeight: 700,
                          fontSize: "1.15rem",
                          textTransform: "capitalize",
                        }}
                      >
                        {member.name}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

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
        </Container>
      </Box>

      {/* Add CSS animation for slideUp effect */}
      <style jsx global>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Box>
  );
};

export default TestPreparation;

