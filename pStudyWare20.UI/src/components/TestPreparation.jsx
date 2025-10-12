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
import { motion } from "framer-motion";
import "../styles/TestPreparation.css";
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
    fontSize: { xs: "1.2rem", md: "1.5rem" } // ✅ responsive font size
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
        display: "block",   // 👈 removes the bottom inline gap
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
<motion.div
  initial={{ y: 100, opacity: 0 }}   // start down and invisible
  whileInView={{ y: 0, opacity: 1 }} // slide up + fade in
  transition={{ duration: 0.8, ease: "easeOut" }}
  viewport={{ once: true }}          // animate only once
>
    {/* Register Now Button */}
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
          fontSize: "1.1rem", // Increased
          textTransform: "uppercase",
          "&:hover": {
            backgroundColor: "#009600",
          },
        }}
      >
        Register Now
      </Button>
      </motion.div>
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
    fontSize: { xs: "1.2rem", md: "1.5rem" } // ✅ responsive font size
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
          fontSize: "1.8rem", // Increased
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
            fontSize: "1.2rem", // Increased
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
            fontSize: "1.2rem", // Increased
            "&:hover": {
              backgroundColor: "transparent",
              textDecoration: "underline",
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
              fontSize: "1.2rem", // Increased
            }}
          >
            {item.label}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#00b800",
              fontWeight: 600,
              fontSize: "1.2rem", // Increased
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
            fontSize: "1.2rem", // Increased
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
            fontSize: "1.2rem", // Increased
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
        onClick={() => handleNavigation("/registration/student")}
        sx={{
          backgroundColor: "#00b800",
          color: "white",
          px: 4,
          py: 1.2,
          borderRadius: "5px",
          fontWeight: 600,
          fontSize: "1.1rem", // Increased
          textTransform: "uppercase",
          "&:hover": {
            backgroundColor: "#009600",
          },
        }}
      >
        Register Now
      </Button>
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
      { name: "ANAND", logo: "F", img: "/images/placeholder1.jpg" },
      { name: "MUGIL SHANMUGAM", logo: "G", img: "/images/placeholder2.jpg" },
      { name: "SRIYA KALYAN", logo: "T", img: "/images/placeholder3.jpg" },
      { name: "CHARLIE NICKS", logo: "L", img: ".. /assets/images/team/Team/charlie.jpg" },
      { name: "RUHAN", logo: "N", img: "/images/placeholder5.jpg" },
      { name: "BHAVYA", logo: "D", img: "/images/placeholder6.jpg" },
    ].map((member, index) => (
      <Grid item xs={6} sm={4} md={2} key={index}>
        <Box sx={{ textAlign: "center" }}>
          <Box
            sx={{
              position: "relative",
              width: "150px",
              height: "150px",
              mx: "auto",
              overflow: "hidden",
              cursor: "pointer",
              "&:hover .overlay": { opacity: 1, transform: "translateY(0)" },
            }}
          >
            <Box
              component="img"
              src={member.img}
              alt={member.name}
              sx={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }}
            />
            {/* Hover Box */}
            <Box
              className="overlay"
              sx={{
                position: "absolute",
                bottom: "10px",
                right: "10px",
                width: "40px",
                height: "40px",
                bgcolor: "#fff",
                border: "2px solid #333",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#000",
                fontWeight: 700,
                fontSize: "1rem",
                opacity: 0,
                boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
                transition: "opacity 0.3s ease, transform 0.3s ease",
                transform: "translateY(10px)",
              }}
            >
              {member.logo}
            </Box>
          </Box>
          <Typography variant="body1" sx={{ mt: 1, fontWeight: 600 }}>
            {member.name}
          </Typography>
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

  <Grid container spacing={3}>
    {[
      { name: "RESHMA CHELLAMMA", logo: "F", img: "/images/act-placeholder1.jpg" },
      { name: "SHRINIDHI PRABHAHARAN", logo: "G", img: "/images/act-placeholder2.jpg" },
      { name: "NAMRATHA YADALLA", logo: "T", img: "/images/act-placeholder3.jpg" },
      { name: "ANUSHA GREWAL", logo: "L", img: "/images/act-placeholder4.jpg" },
      { name: "NAYANA ASHOK", logo: "N", img: "/images/act-placeholder5.jpg" },
    ].map((member, index) => (
      <Grid item xs={6} sm={4} md={2} key={index}>
        <Box sx={{ textAlign: "center" }}>
          <Box
            sx={{
              position: "relative",
              width: "150px",
              height: "150px",
              mx: "auto",
              overflow: "hidden",
              cursor: "pointer",
              "&:hover .overlay": { opacity: 1, transform: "translateY(0)" },
            }}
          >
            <Box
              component="img"
              src={member.img}
              alt={member.name}
              sx={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }}
            />
            {/* Hover Box */}
            <Box
              className="overlay"
              sx={{
                position: "absolute",
                bottom: "10px",
                right: "10px",
                width: "40px",
                height: "40px",
                bgcolor: "#fff",
                border: "2px solid #333",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#000",
                fontWeight: 700,
                fontSize: "1rem",
                opacity: 0,
                boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
                transition: "opacity 0.3s ease, transform 0.3s ease",
                transform: "translateY(10px)",
              }}
            >
              {member.logo}
            </Box>
          </Box>
          <Typography variant="body1" sx={{ mt: 1, fontWeight: 600 }}>
            {member.name}
          </Typography>
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
    </Box>
  );
};
export default TestPreparation;

