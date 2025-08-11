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
import "../styles/MathCircle.css";
// Import images from src/assets
import pageHeaderImg from "../assets/images/about/page-header.jpg";
import aboutAmcImg from "../assets/images/about/about-amc copy copy.png";
import arrow1Img from "../assets/images/arrow-1.png";
import arrow2Img from "../assets/images/arrow-2.png";
import arrow3Img from "../assets/images/arrow-3.png";
import arrow4Img from "../assets/images/arrow-4.png";
import arrow5Img from "../assets/images/arrow-5.png";
import teamMember1 from "../assets/images/team/1.jpg";
import teamMember2 from "../assets/images/team/2.jpg";
import teamMember13 from "../assets/images/team/13.png";
import teamMember3 from "../assets/images/team/3.jpg";
import teamMember8 from "../assets/images/team/8.jpg";
import teamMemberCharlie from "../assets/images/team/volunteers/charlie.png";
import teamMember4 from "../assets/images/team/4.jpg";
import teamMember5 from "../assets/images/team/5.jpg";
import teamMember6 from "../assets/images/team/6.jpg";
import teamMember7 from "../assets/images/team/7.jpg";

const MathCircle = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleExternalLink = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Team members data
  const teamMembers = [
    {
      name: "PRANAV KALYAN",
      role: "FOUNDER & PRESIDENT",
      image: teamMember1,
    },
    {
      name: "SRIYA KALYAN",
      role: "CHIEF EXECUTIVE OFFICER",
      image: teamMember2,
    },
    {
      name: "DR BHARAT PATEL",
      role: "DIRECTOR",
      image: teamMember13,
    },
    {
      name: "ANDREW XU",
      role: "DIRECTOR",
      image: teamMember3,
    },
    {
      name: "JOSHNA JUDE",
      role: "SENIOR VICE PRESIDENT",
      image: teamMember8,
    },
    {
      name: "CHARLIE NICKS",
      role: "SENIOR VICE PRESIDENT",
      image: teamMemberCharlie,
    },
    {
      name: "MINITA CLARKE",
      role: "ADVISORY BOARD",
      image: teamMember4,
    },
    {
      name: "DIANA NGUYEN",
      role: "ADVISORY BOARD",
      image: teamMember5,
    },
    {
      name: "JOSEPH KEAYS",
      role: "ADVISORY BOARD",
      image: teamMember6,
    },
    {
      name: "MUGIL SHANMUGAM",
      role: "ADVISORY BOARD",
      image: teamMember7,
    },
  ];

  return (
    <Box className="math-circle-container">
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
                Math Circle
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
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={5}>
              <Box className="img-part position-relative">
                <Box
                  component="img"
                  src={aboutAmcImg}
                  alt="About Image"
                  sx={{
                    width: "100%",
                    height: "auto",
                    maxHeight: "400px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  }}
                />
                <Box
                  className="about-experience text-center"
                  sx={{
                    position: "absolute",
                    bottom: "-20px",
                    right: "-20px",
                    backgroundColor: theme.palette.primary.main,
                    color: "white",
                    padding: "20px",
                    borderRadius: "50%",
                    width: "100px",
                    height: "100px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    1000+
                  </Typography>
                  <Typography variant="body2">Students</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={7}>
              <Box className="sec-title mb-20">
                <Typography
                  variant="h2"
                  className="title mb-20"
                  sx={{
                    fontWeight: 700,
                    mb: 2.5,
                    fontSize: { xs: "2rem", md: "2.5rem" },
                  }}
                >
                  ABOUT AMC
                </Typography>
                <Box className="des about-cont" sx={{ mb: 3 }}>
                  <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 2 }}>
                    The Agoura Math Circle is a student-run, 501(c)(3) nonprofit
                    community service organization founded by Pranav Kalyan in
                    September 2015. Agoura Math Circle is a free educational
                    program focusing on the problem-solving skills that lead
                    students to success in both academics and the real world.
                    More importantly, Agoura Math Circle gives students
                    confidence and the skills to tackle any type of problem,
                    academic or otherwise. Our goal is to create a strong
                    foundation for kids to increase critical thinking and
                    motivate kids to aim for top universities in a fun-filled
                    environment.
                  </Typography>
                </Box>
                <Box className="des-sec about-cont" sx={{ mb: 4 }}>
                  <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                    Agoura Math Circle has many opportunities for students
                    dependent on their various interests. At the moment we have
                    online and OnSite where students can learn math and
                    Engineering. These chapters work together to support our
                    students as best we can. Agoura Engineering Circle is a
                    place for high school students to apply their math skills to
                    engineering. Our test preparation course, offered to 8th
                    graders and up, help students achieve the score they want
                    for standardized tests like the PSAT, SAT and ACT. For kids
                    around the world who still wish to learn math concepts, we
                    have a YouTube channel.
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ textAlign: "center" }}>
                      <Button
                        variant="contained"
                        className="readon"
                        onClick={() => handleNavigation("/about/leadership")}
                        sx={{
                          backgroundColor: theme.palette.primary.main,
                          color: "white",
                          px: 3,
                          py: 1.5,
                          borderRadius: "5px",
                          fontWeight: 600,
                          "&:hover": {
                            backgroundColor: theme.palette.primary.dark,
                          },
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
                        className="readon"
                        onClick={() => handleNavigation("/about/team")}
                        sx={{
                          backgroundColor: theme.palette.primary.main,
                          color: "white",
                          px: 3,
                          py: 1.5,
                          borderRadius: "5px",
                          fontWeight: 600,
                          "&:hover": {
                            backgroundColor: theme.palette.primary.dark,
                          },
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
                        className="readon"
                        onClick={() => handleNavigation("/about/alumni")}
                        sx={{
                          backgroundColor: theme.palette.primary.main,
                          color: "white",
                          px: 3,
                          py: 1.5,
                          borderRadius: "5px",
                          fontWeight: 600,
                          "&:hover": {
                            backgroundColor: theme.palette.primary.dark,
                          },
                        }}
                      >
                        AMC Alumni
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>

          {/* Skills Section */}
          <Box sx={{ mt: 8 }}>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6} md={3}>
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
                    Problem Solving Skills
                  </Box>
                  <Box
                    component="li"
                    sx={{ display: "flex", alignItems: "center", mb: 1 }}
                  >
                    <CheckIcon
                      sx={{ color: theme.palette.primary.main, mr: 1 }}
                    />
                    Basic Math
                  </Box>
                  <Box
                    component="li"
                    sx={{ display: "flex", alignItems: "center", mb: 1 }}
                  >
                    <CheckIcon
                      sx={{ color: theme.palette.primary.main, mr: 1 }}
                    />
                    Pre Algebra
                  </Box>
                  <Box
                    component="li"
                    sx={{ display: "flex", alignItems: "center", mb: 1 }}
                  >
                    <CheckIcon
                      sx={{ color: theme.palette.primary.main, mr: 1 }}
                    />
                    Pre Calculus
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
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
                    Calculus
                  </Box>
                  <Box
                    component="li"
                    sx={{ display: "flex", alignItems: "center", mb: 1 }}
                  >
                    <CheckIcon
                      sx={{ color: theme.palette.primary.main, mr: 1 }}
                    />
                    MATH COUNTS
                  </Box>
                  <Box
                    component="li"
                    sx={{ display: "flex", alignItems: "center", mb: 1 }}
                  >
                    <CheckIcon
                      sx={{ color: theme.palette.primary.main, mr: 1 }}
                    />
                    AMC 8
                  </Box>
                  <Box
                    component="li"
                    sx={{ display: "flex", alignItems: "center", mb: 1 }}
                  >
                    <CheckIcon
                      sx={{ color: theme.palette.primary.main, mr: 1 }}
                    />
                    AMC 10
                  </Box>
                  <Box
                    component="li"
                    sx={{ display: "flex", alignItems: "center", mb: 1 }}
                  >
                    <CheckIcon
                      sx={{ color: theme.palette.primary.main, mr: 1 }}
                    />
                    AMC 12
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
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
                    MATH Kangaroo
                  </Box>
                  <Box
                    component="li"
                    sx={{ display: "flex", alignItems: "center", mb: 1 }}
                  >
                    <CheckIcon
                      sx={{ color: theme.palette.primary.main, mr: 1 }}
                    />
                    MATH LEAGUE
                  </Box>
                  <Box
                    component="li"
                    sx={{ display: "flex", alignItems: "center", mb: 1 }}
                  >
                    <CheckIcon
                      sx={{ color: theme.palette.primary.main, mr: 1 }}
                    />
                    ACT/PSAT
                  </Box>
                  <Box
                    component="li"
                    sx={{ display: "flex", alignItems: "center", mb: 1 }}
                  >
                    <CheckIcon
                      sx={{ color: theme.palette.primary.main, mr: 1 }}
                    />
                    Introduction to Data Science
                  </Box>
                  <Box
                    component="li"
                    sx={{ display: "flex", alignItems: "center", mb: 1 }}
                  >
                    <CheckIcon
                      sx={{ color: theme.palette.primary.main, mr: 1 }}
                    />
                    Introduction to Artificial Intelligence
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Box sx={{ textAlign: "center" }}>
                  <Button
                    variant="contained"
                    className="readon"
                    onClick={() => handleNavigation("/registration/student")}
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: "white",
                      px: 3,
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
          </Box>
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
                  8+
                </Typography>
                <Typography variant="h5" className="title mb-0">
                  Chapter
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
                  1000+
                </Typography>
                <Typography variant="h5" className="title mb-0">
                  Students
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
                  125+
                </Typography>
                <Typography variant="h5" className="title mb-0">
                  Volunteers
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
                  6+
                </Typography>
                <Typography variant="h5" className="title mb-0">
                  Subjects
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

      {/* Team Section */}
      <Box
        className="sc-team team-style-1 pt-20 pb-10 md-pt-70 md-pb-20"
        sx={{
          pt: { xs: 4, md: 6 },
          pb: { xs: 2, md: 4 },
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography
              variant="h2"
              className="title mb-0"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "2rem", md: "2.5rem" },
              }}
            >
              AMC TEAM
            </Typography>
          </Box>

          <Box
            className="sc-carousel"
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 3,
            }}
          >
            {teamMembers.map((member, index) => (
              <Box
                key={index}
                className="blog-item"
                sx={{
                  flex: "0 0 auto",
                  width: { xs: "100%", sm: "45%", md: "30%", lg: "22%" },
                  mb: 3,
                }}
              >
                <Card
                  sx={{
                    height: "100%",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  <Box className="image-part">
                    <Box
                      component="img"
                      src={member.image}
                      alt={member.name}
                      sx={{
                        width: "100%",
                        height: "280px",
                        objectFit: "cover",
                        borderTopLeftRadius: "8px",
                        borderTopRightRadius: "8px",
                        transition: "transform 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.05)",
                        },
                      }}
                    />
                  </Box>
                  <CardContent className="blog-content" sx={{ p: 3 }}>
                    <Typography
                      variant="h6"
                      className="title"
                      sx={{
                        fontWeight: 700,
                        fontSize: "1.1rem",
                        mb: 1,
                      }}
                    >
                      {member.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      className="desc"
                      sx={{
                        color: "text.secondary",
                        fontWeight: 500,
                        fontSize: "0.9rem",
                      }}
                    >
                      {member.role}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default MathCircle;
