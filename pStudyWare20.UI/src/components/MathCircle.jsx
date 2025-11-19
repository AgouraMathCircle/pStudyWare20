import React, { useEffect, useRef, useState } from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AndroidIcon from "@mui/icons-material/Android";
import AppleIcon from "@mui/icons-material/Apple";
import YouTubeIcon from "@mui/icons-material/YouTube";
import VideoGallerys from "../components/Home/VideoGallery";
import AMCTeam from "./AMCTeam";
import ComputerOutlinedIcon from "@mui/icons-material/ComputerOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import "../styles/MathCircle.css";
import counterBg2Img from "../assets/images/bg/counter-bg2.jpg";
import pageHeaderImg from "../assets/images/about/page-header.jpg";
import aboutAmcImg from "../assets/images/about/about-amc copy copy.png";
import arrow1Img from "../assets/images/arrow-1.png";
import arrow2Img from "../assets/images/arrow-2.png";
import arrow3Img from "../assets/images/arrow-3.png";
import arrow4Img from "../assets/images/arrow-4.png";
import arrow5Img from "../assets/images/arrow-5.png";

// Counter Section Component (moved outside)
const CounterSection = ({ counterRef }) => {
  return (
    <Box
      ref={counterRef}
      className="sc-counter"
      sx={{
        py: { xs: 8, md: 10 },
        backgroundColor: "#c9fdc9 !important", // ✅ forces mint green
        backgroundImage: "none !important", // ✅ removes the gradient
        color: "#000", // optional, since old CSS had white text
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative circles and triangle */}
      <Box
        sx={{
          position: "absolute",
          top: 20,
          left: 40,
          width: 24,
          height: 24,
          borderRadius: "50%",
          border: "2px solid #F9D774",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: 40,
          right: 60,
          width: 0,
          height: 0,
          borderBottom: "20px solid transparent",
          borderLeft: "20px solid transparent",
          borderRight: "20px solid transparent",
          borderTop: "20px solid #82D5E2",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: 40,
          left: 80,
          width: 24,
          height: 24,
          borderRadius: "50%",
          border: "2px solid #F9A1A1",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: 30,
          right: 60,
          width: 28,
          height: 28,
          borderRadius: "50%",
          border: "2px solid #82D5E2",
        }}
      />

      {/* Counter Items */}
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center">
          {/* 1️⃣ Chapter */}
          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                backgroundColor: "#fff",
                p: 5,
                borderRadius: "20px",
                textAlign: "center",
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                minHeight: "200px",
              }}
            >
              <Box
                sx={{
                  mx: "auto",
                  mb: 3,
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  backgroundColor: "#E0F3FF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ComputerOutlinedIcon sx={{ fontSize: 40, color: "#64B5F6" }} />
              </Box>
              <Typography
                className="counter-value"
                data-target="8"
                variant="h4"
                sx={{ fontWeight: 700, color: "#002B5B" }}
              >
                0+
              </Typography>
              <Typography sx={{ color: "#003B73" }}>Chapter</Typography>
            </Box>
          </Grid>

          {/* 2️⃣ Students */}
          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                backgroundColor: "#fff",
                p: 5,
                borderRadius: "20px",
                textAlign: "center",
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                minHeight: "200px",
              }}
            >
              <Box
                sx={{
                  mx: "auto",
                  mb: 3,
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  backgroundColor: "#FFE0E0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MenuBookOutlinedIcon sx={{ fontSize: 40, color: "#FF8A80" }} />
              </Box>
              <Typography
                className="counter-value"
                data-target="1000"
                variant="h4"
                sx={{ fontWeight: 700, color: "#002B5B" }}
              >
                0+
              </Typography>
              <Typography sx={{ color: "#003B73" }}>Students</Typography>
            </Box>
          </Grid>

          {/* 3️⃣ Volunteers */}
          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                backgroundColor: "#fff",
                p: 5,
                borderRadius: "20px",
                textAlign: "center",
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                minHeight: "200px",
              }}
            >
              <Box
                sx={{
                  mx: "auto",
                  mb: 3,
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  backgroundColor: "#D4EDDA",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <GroupsOutlinedIcon sx={{ fontSize: 40, color: "#81C784" }} />
              </Box>
              <Typography
                className="counter-value"
                data-target="125"
                variant="h4"
                sx={{ fontWeight: 700, color: "#002B5B" }}
              >
                0+
              </Typography>
              <Typography sx={{ color: "#003B73" }}>Volunteers</Typography>
            </Box>
          </Grid>

          {/* 4️⃣ Subjects */}
          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                backgroundColor: "#fff",
                p: 5,
                borderRadius: "20px",
                textAlign: "center",
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                minHeight: "200px",
              }}
            >
              <Box
                sx={{
                  mx: "auto",
                  mb: 3,
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  backgroundColor: "#FFF8E1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AssessmentOutlinedIcon
                  sx={{ fontSize: 40, color: "#FFD54F" }}
                />
              </Box>
              <Typography
                className="counter-value"
                data-target="6"
                variant="h4"
                sx={{ fontWeight: 700, color: "#002B5B" }}
              >
                0+
              </Typography>
              <Typography sx={{ color: "#003B73" }}>Subjects</Typography>
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
        <Box component="img" src={arrow5Img} alt="" />
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
        <Box component="img" src={arrow4Img} alt="" />
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
  );
};

// Download Section Component
const DownloadSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        backgroundImage: `url(${counterBg2Img})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        py: { xs: 6, md: 12 },
        px: { xs: 2, md: 6 },
        overflow: "hidden",
      }}
    >
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
        <Box component="img" src={arrow5Img} alt="" />
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
        <Box component="img" src={arrow4Img} alt="" />
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

      {/* Main Content */}
      <Grid
        container
        spacing={6}
        justifyContent="center"
        alignItems="center"
        textAlign="center"
      >
        {/* Left Column */}
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 2 }}>
            <AndroidIcon sx={{ fontSize: 60, color: "#9be15d", mx: 1 }} />
            <AppleIcon sx={{ fontSize: 60, color: "#cfd2d7", mx: 1 }} />
          </Box>

          <Typography
            variant="h5"
            sx={{
              color: "white",
              fontWeight: 500,
              mb: 3,
            }}
          >
            Download Our Mobile App for VIRTUAL Classes
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#58a82d",
                color: "white",
                px: 4,
                py: 1.2,
                borderRadius: "5px",
                fontWeight: 600,
                textTransform: "none",
                transform: isVisible ? "translateY(0)" : "translateY(50px)",
                opacity: isVisible ? 1 : 0,
                transition: "all 0.8s ease-out",
                "&:hover": {
                  backgroundColor: "#4c8c2b",
                },
              }}
              onClick={() =>
                window.open(
                  "https://apps.apple.com/us/app/agoura-math-circle/id1438597363",
                  "_blank"
                )
              }
            >
              IOS App →
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#58a82d",
                color: "white",
                px: 4,
                py: 1.2,
                borderRadius: "5px",
                fontWeight: 600,
                textTransform: "none",
                transform: isVisible ? "translateY(0)" : "translateY(50px)",
                opacity: isVisible ? 1 : 0,
                transition: "all 0.8s ease-out 0.2s",
                "&:hover": {
                  backgroundColor: "#4c8c2b",
                },
              }}
            >
              Android App →
            </Button>
          </Box>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 2 }}>
            <YouTubeIcon sx={{ fontSize: 60, color: "#ff0000" }} />
          </Box>

          <Typography
            variant="h5"
            sx={{
              color: "white",
              fontWeight: 500,
              mb: 3,
            }}
          >
            Subscribe Youtube for More Course Videos
          </Typography>

          <Button
            variant="contained"
            sx={{
              backgroundColor: "#58a82d",
              color: "white",
              px: 5,
              py: 1.2,
              borderRadius: "5px",
              fontWeight: 600,
              textTransform: "none",
              transform: isVisible ? "translateY(0)" : "translateY(50px)",
              opacity: isVisible ? 1 : 0,
              transition: "all 0.8s ease-out 0.4s",
              "&:hover": {
                backgroundColor: "#4c8c2b",
              },
            }}
          >
            Subscribe Our Channel →
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

// Main MathCircle Component
const MathCircle = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const counterRef = useRef(null);
  const buttonsRef = useRef(null);
  const registerButtonRef = useRef(null);
  const [buttonsVisible, setButtonsVisible] = useState(false);
  const [registerButtonVisible, setRegisterButtonVisible] = useState(false);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleExternalLink = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Intersection Observer for About section buttons
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        console.log("Button observer triggered:", entry.isIntersecting);
        if (entry.isIntersecting) {
          setButtonsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.3,
        rootMargin: "0px 0px -100px 0px",
      }
    );

    if (buttonsRef.current) {
      observer.observe(buttonsRef.current);
    }

    return () => {
      if (buttonsRef.current) {
        observer.unobserve(buttonsRef.current);
      }
    };
  }, []);

  // Intersection Observer for Register button
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        console.log(
          "Register button observer triggered:",
          entry.isIntersecting
        );
        if (entry.isIntersecting) {
          setRegisterButtonVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.3,
        rootMargin: "0px 0px -100px 0px",
      }
    );

    if (registerButtonRef.current) {
      observer.observe(registerButtonRef.current);
    }

    return () => {
      if (registerButtonRef.current) {
        observer.unobserve(registerButtonRef.current);
      }
    };
  }, []);

  // Counter animation effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animate counters
            const counters = entry.target.querySelectorAll(".counter-value");
            counters.forEach((counter) => {
              const target = parseInt(counter.getAttribute("data-target"));
              const duration = 2000;
              const step = target / (duration / 16);
              let current = 0;

              const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                  counter.innerText = target + "+";
                  clearInterval(timer);
                } else {
                  counter.innerText = Math.floor(current) + "+";
                }
              }, 16);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current);
      }
    };
  }, []);

  // SkillItem component
  const SkillItem = ({ text }) => (
    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
      <CheckCircleOutlineIcon color="primary" sx={{ mr: 1.5 }} />
      <Typography variant="body1">{text}</Typography>
    </Box>
  );

  return (
    <Box className="math-circle-container">
      {/* Breadcrumbs Section */}
      <Box className="sc-breadcrumbs breadcrumbs-overlay">
        <Box className="breadcrumbs-img">
          <img src={pageHeaderImg} alt="Breadcrumbs" />
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
            About Us
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
                  textDecoration: "none",
                  p: 0,
                  minWidth: "auto",
                  fontSize: "inherit",
                  textTransform: "none",
                  "&:hover": { textDecoration: "none" },
                }}
              >
                Home &gt;
              </Button>
            </Box>
            <Box component="li" sx={{ display: "inline-block" }}>
              <Typography component="span" sx={{ color: "white" }}>
                {" "}
                About Us &gt;{" "}
              </Typography>
            </Box>
            <Box component="li" sx={{ display: "inline-block" }}>
              <Typography component="span" sx={{ color: "white" }}>
                {" "}
                Math Circle{" "}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* About Section */}
      <Box
        id="sc-about"
        className="sc-about pt-80 pb-70 md-pt-40 position-relative"
        sx={{
          pt: { xs: 4, md: 8 },
          pb: { xs: 4, md: 6 },
          position: "relative",
        }}
      >
        <Container maxWidth="lg">
          <Grid
            container
            direction="row"
            flexWrap={{ xs: "wrap", md: "nowrap" }}
            spacing={4}
            alignItems="flex-start"
          >
            {/* Image on left */}
            <Grid item xs={12} md={5}>
              <Box
                className="img-part"
                sx={{ position: "relative", overflow: "visible" }}
              >
                <Box
                  component="img"
                  src={aboutAmcImg}
                  alt="About"
                  sx={{ width: "100%", height: "auto", display: "block" }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: "-40px",
                    right: "-30px",
                    backgroundColor: "white",
                    color: "black",
                    padding: "15px",
                    borderRadius: "8px",
                    width: "120px",
                    height: "120px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {" "}
                    1000+{" "}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                    {" "}
                    Students{" "}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            {/* Text content on right */}
            <Grid
              item
              xs={12}
              md={7}
              sx={{ ml: { xs: 0, md: 4 }, pl: { xs: 0, md: 4 } }}
            >
              <Box className="sec-title mb-20">
                <Typography
                  variant="h2"
                  className="title mb-20"
                  sx={{
                    fontWeight: 700,
                    mb: 2.5,
                    fontSize: { xs: "1.8rem", md: "2.5rem" },
                  }}
                >
                  ABOUT AMC
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 2 }}>
                  The Agoura Math Circle is a student-run, 501(c)(3) nonprofit
                  community service organization founded by Pranav Kalyan in
                  September 2015. Agoura Math Circle is a free educational
                  program focusing on the problem-solving skills that lead
                  students to success in both academics and the real world. More
                  importantly, Agoura Math Circle gives students confidence and
                  the skills to tackle any type of problem, academic or
                  otherwise. Our goal is to create a strong foundation for kids
                  to increase critical thinking and motivate kids to aim for top
                  universities in a fun-filled environment.
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 4 }}>
                  Agoura Math Circle has many opportunities for students
                  dependent on their various interests. At the moment we have
                  online and OnSite where students can learn math and
                  Engineering. These chapters work together to support our
                  students as best we can. Agoura Engineering Circle is a place
                  for high school students to apply their math skills to
                  engineering. Our test preparation course, offered to 8th
                  graders and up, help students achieve the score they want for
                  standardized tests like the PSAT, SAT and ACT. For kids around
                  the world who still wish to learn math concepts, we have a
                  YouTube channel.
                </Typography>

                {/* Animated Buttons Container */}
                <Box
                  ref={buttonsRef}
                  sx={{
                    opacity: buttonsVisible ? 1 : 0,
                    transform: buttonsVisible
                      ? "translateY(0)"
                      : "translateY(50px)",
                    transition: "all 0.8s ease-out",
                  }}
                >
                  <Grid
                    container
                    spacing={2}
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ textAlign: "center" }}>
                        <Button
                          variant="contained"
                          onClick={() => handleNavigation("/about/leadership")}
                          sx={{
                            backgroundColor: "#58a82d",
                            color: "white",
                            px: 3,
                            py: 1.5,
                            borderRadius: "5px",
                            fontWeight: 600,
                            textDecoration: "none",
                            "&:hover": {
                              backgroundColor: "#191970",
                              transform: "translateY(-3px)",
                              boxShadow: "0 6px 12px rgba(0,0,0,0.2)",
                              textDecoration: "none",
                            },
                            transition: "all 0.3s ease",
                          }}
                        >
                          Leadership
                        </Button>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ textAlign: "center" }}>
                        <Button
                          variant="contained"
                          onClick={() => handleNavigation("/about/team")}
                          sx={{
                            backgroundColor: "#58a82d",
                            color: "white",
                            px: 3,
                            py: 1.5,
                            borderRadius: "5px",
                            fontWeight: 600,
                            textDecoration: "none",
                            "&:hover": {
                              backgroundColor: "#191970",
                              transform: "translateY(-3px)",
                              boxShadow: "0 6px 12px rgba(0,0,0,0.2)",
                              textDecoration: "none",
                            },
                            transition: "all 0.3s ease",
                          }}
                        >
                          Our Team
                        </Button>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ textAlign: "center" }}>
                        <Button
                          variant="contained"
                          onClick={() => handleNavigation("/about/alumni")}
                          sx={{
                            backgroundColor: "#58a82d",
                            color: "white",
                            px: 3,
                            py: 1.5,
                            borderRadius: "5px",
                            fontWeight: 600,
                            textDecoration: "none",
                            "&:hover": {
                              backgroundColor: "#191970",
                              transform: "translateY(-3px)",
                              boxShadow: "0 6px 12px rgba(0,0,0,0.2)",
                              textDecoration: "none",
                            },
                            transition: "all 0.3s ease",
                          }}
                        >
                          AMC Alumni
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Skills Section */}
      <Box sx={{ py: { xs: 4, md: 8 } }}>
        <Container maxWidth="lg">
          {/* Skills + Button Row */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "flex-start",
              gap: 2,
            }}
          >
            {/* Skills Area */}
            <Box sx={{ flex: 1 }}>
              <Grid container spacing={1}>
                {/* Column 1 */}
                <Grid item xs={12} sm={4} md={3}>
                  <SkillItem text="Problem Solving Skills" />
                  <SkillItem text="Pre-Algebra" />
                </Grid>
                {/* Column 2 */}
                <Grid item xs={12} sm={4} md={5}>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <SkillItem text="Basic Math" />
                    </Grid>
                    <Grid item xs={6}>
                      <SkillItem text="Calculus" />
                    </Grid>
                    <Grid item xs={6}>
                      <SkillItem text="Pre Calculus" />
                    </Grid>
                    <Grid item xs={6}>
                      <SkillItem text="MATH COUNTS" />
                    </Grid>
                    <Grid item xs={6}></Grid>
                    <Grid item xs={6}>
                      <SkillItem text="AMC 8" />
                    </Grid>
                    <Grid item xs={6}>
                      <SkillItem text="AMC 10" />
                    </Grid>
                    <Grid item xs={6}>
                      <SkillItem text="AMC 12" />
                    </Grid>
                  </Grid>
                </Grid>
                {/* Column 3 */}
                <Grid item xs={12} sm={4} md={4}>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <SkillItem text="MATH Kangaroo" />
                    </Grid>
                    <Grid item xs={6}>
                      <SkillItem text="MATH LEAGUE" />
                    </Grid>
                    <Grid item xs={6}></Grid>
                    <Grid item xs={6}>
                      <SkillItem text="ACT/PSAT" />
                    </Grid>
                  </Grid>
                  <SkillItem text="Introduction to Data Science" />
                  <SkillItem text="Introduction to Artificial Intelligence" />
                </Grid>
              </Grid>
            </Box>

            {/* Register Button Area */}
            <Box
              ref={registerButtonRef}
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "flex-start",
                mt: { xs: 4, md: 0 },
                width: { xs: "100%", md: "auto" },
                opacity: registerButtonVisible ? 1 : 0,
                transform: registerButtonVisible
                  ? "translateY(0)"
                  : "translateY(50px)",
                transition: "all 0.8s ease-out 0.3s",
              }}
            >
              <Button
                variant="contained"
                onClick={() => handleNavigation("/registration/student")}
                sx={{
                  backgroundColor: "#58a82d",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                  borderRadius: "8px",
                  textTransform: "none",
                  textDecoration: "none",
                  px: 5,
                  py: 2,
                  "&:hover": {
                    backgroundColor: "#191970",
                    transform: "translateY(-3px)",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
                    textDecoration: "none",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Register Now
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Counter Section */}
      <CounterSection counterRef={counterRef} />

      {/* Team Section */}
      <Box className="sc-team" sx={{ py: { xs: 4, md: 6 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography
              variant="h2"
              sx={{ fontWeight: 700, fontSize: { xs: "2rem", md: "2.5rem" } }}
            >
              AMC TEAM
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 3,
            }}
          >
            <AMCTeam />
          </Box>
        </Container>
      </Box>

      {/* Download Section */}
      <DownloadSection />
      <VideoGallerys />
    </Box>
  );
};

export default MathCircle;
