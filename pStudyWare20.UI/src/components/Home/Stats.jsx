import React from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  keyframes,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SchoolIcon from "@mui/icons-material/School";
import PeopleIcon from "@mui/icons-material/People";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import ComputerIcon from "@mui/icons-material/Computer";

// Background image moved to public/assets/images/
const counterBg2 = "/assets/images/bg/counter-bg2.jpg";

// Arrow images moved to public/assets/images/
const arrow2 = "/assets/images/arrow-2.png";
const arrow3 = "/assets/images/arrow-3.png";
const arrow4 = "/assets/images/arrow-4.png";
const arrow5 = "/assets/images/arrow-5.png";

// Keyframe animations
const fadeInAnimation = keyframes`
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const upDownAnimation = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const leftRightAnimation = keyframes`
  0% {
    transform: translateX(0px);
  }
  50% {
    transform: translateX(-20px);
  }
  100% {
    transform: translateX(0px);
  }
`;

const Stats = () => {
  const statsData = [
    {
      icon: <SchoolIcon />,
      number: "8",
      label: "Chapter",
      description: "Agoura Onsite and Online",
      color: "#D9F3FB",
      iconColor: "#40c1ec",
    },
    {
      icon: <PeopleIcon />,
      number: "1000",
      label: "Students",
      description: "More than 1000 Students",
      color: "#FEF1CD",
      iconColor: "#FCB903",
    },
    {
      icon: <VolunteerActivismIcon />,
      number: "125",
      label: "Volunteers",
      description: "More than 125 Volunteers",
      color: "#FCDBDF",
      iconColor: "#53b50a",
    },
    {
      icon: <ComputerIcon />,
      number: "6",
      label: "Subjects",
      description:
        "Problem solving, Test Preparation, Data Science, Triangular Talks, Coding Games, Satellite Program",
      color: "#DBF7E1",
      iconColor: "#4AD567",
    },
  ];

  return (
    <Box
      sx={{
        backgroundImage: `url(${counterBg2})`,
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        padding: { xs: "50px 0", md: "120px 0 90px 0" },
        position: "relative",
        overflow: "hidden",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderTop: "3px solid #40c1ec",
        borderBottom: "3px solid #40c1ec",
        boxShadow:
          "inset 0 10px 20px rgba(64, 193, 236, 0.1), inset 0 -10px 20px rgba(64, 193, 236, 0.1)",
      }}
    >
      {/* Animated Arrows */}
      <Box
        component="img"
        src={arrow5}
        alt="Animated Arrow"
        sx={{
          position: "absolute",
          top: "20%",
          left: "10%",
          animation: `${leftRightAnimation} 3s ease-in-out infinite`,
          "@media (max-width: 768px)": {
            display: "none",
          },
        }}
      />
      <Box
        component="img"
        src={arrow2}
        alt="Animated Arrow"
        sx={{
          position: "absolute",
          top: "30%",
          right: "15%",
          animation: `${upDownAnimation} 3s ease-in-out infinite`,
          "@media (max-width: 768px)": {
            display: "none",
          },
        }}
      />
      <Box
        component="img"
        src={arrow4}
        alt="Animated Arrow"
        sx={{
          position: "absolute",
          bottom: "30%",
          left: "5%",
          animation: `${upDownAnimation} 3s ease-in-out infinite 1s`,
          "@media (max-width: 768px)": {
            display: "none",
          },
        }}
      />
      <Box
        component="img"
        src={arrow3}
        alt="Animated Arrow"
        sx={{
          position: "absolute",
          bottom: "20%",
          right: "10%",
          animation: `${leftRightAnimation} 3s ease-in-out infinite 1.5s`,
          "@media (max-width: 768px)": {
            display: "none",
          },
        }}
      />

      <Container maxWidth="lg" sx={{ width: "100%" }}>
        <Grid container spacing={4} alignItems="center">
          {/* Left Column - Text Content */}
          <Grid item xs={12} lg={5}>
            <Box
              sx={{
                animation: `${fadeInAnimation} 0.8s ease-out`,
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  color: "#ffffff",
                  fontWeight: 700,
                  marginBottom: "10px",
                  "@media (max-width: 600px)": {
                    fontSize: "28px",
                  },
                }}
              >
                Why Join Agoura Math Circle?
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#ffffff",
                  marginBottom: "40px",
                  lineHeight: 1.8,
                  fontSize: "16px",
                  "@media (max-width: 768px)": {
                    paddingRight: 0,
                  },
                  "@media (min-width: 769px)": {
                    paddingRight: "40px",
                  },
                }}
              >
                Agoura Math Circle offers diverse learning opportunities to
                cater to students' varying interests, such as engineering,
                computer science, and problem-solving for national math
                competitions such as AMC and Math Kangaroo. Additionally, we
                hold monthly seminars from highly qualified STEM professionals
                and prepare students for standardized testing. Currently, we
                provide both online and on-site programs for the Math Circle and
                online classes for Engineering Circle, Test Preparation, and
                Triangular Talks. Our latest addition is the Satellite program,
                where we collaborate with students, teachers, schools, and
                educational institutions to support the setup of their own
                clubs, study groups, or enrichment classes.
              </Typography>
              <Button
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                href="/mathcircle"
                component="a"
                sx={{
                  backgroundColor: "#53b50a",
                  color: "#ffffff",
                  padding: "12px 24px",
                  borderRadius: "3px",
                  textTransform: "capitalize",
                  fontWeight: 600,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "#4a9d09",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  },
                }}
              >
                Start Course
              </Button>
            </Box>
          </Grid>

          {/* Right Column - Statistics */}
          <Grid item xs={12} lg={7}>
            <Grid container spacing={3}>
              {statsData.map((stat, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card
                    sx={{
                      backgroundColor: "#ffffff",
                      borderRadius: "10px",
                      padding: "30px 20px",
                      transition: "all 0.3s ease",
                      animation: `${fadeInAnimation} 0.8s ease-out ${
                        0.2 + index * 0.1
                      }s both`,
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                      },
                    }}
                  >
                    <CardContent sx={{ padding: 0, textAlign: "center" }}>
                      <Box
                        sx={{
                          width: "70px",
                          height: "70px",
                          borderRadius: "50%",
                          backgroundColor: stat.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto 15px",
                        }}
                      >
                        <Box
                          sx={{
                            color: stat.iconColor,
                            fontSize: "30px",
                          }}
                        >
                          {stat.icon}
                        </Box>
                      </Box>
                      <Typography
                        variant="h3"
                        sx={{
                          color: "#53b50a",
                          fontWeight: 700,
                          marginBottom: "5px",
                          fontSize: "28px",
                        }}
                      >
                        {stat.number}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          color: "#102d47",
                          fontWeight: 600,
                          marginBottom: "5px",
                          fontSize: "17px",
                        }}
                      >
                        {stat.label}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#505050",
                          fontSize: "14px",
                          lineHeight: 1.4,
                        }}
                      >
                        {stat.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Stats;
