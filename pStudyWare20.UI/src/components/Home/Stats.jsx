import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  Container,
  Grid,
  keyframes,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SchoolIcon from "@mui/icons-material/School";
import PeopleIcon from "@mui/icons-material/People";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import ComputerIcon from "@mui/icons-material/Computer";

// Import images from src/assets
// Component is in src/components/Home/, so need to go up two levels (../../) to reach src/
import counterBg2Img from "../../assets/images/bg/counter-bg2.jpg";
import arrow2Img from "../../assets/images/arrow-2.png";
import arrow3Img from "../../assets/images/arrow-3.png";
import arrow4Img from "../../assets/images/arrow-4.png";
import arrow5Img from "../../assets/images/arrow-5.png";

// Keyframe animations
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

// CORRECTED Counter component
const Counter = ({ end, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const observerRef = useRef(null);
  const hasAnimatedRef = useRef(false);
  const animationFrameId = useRef(null); // Ref to hold the animation frame ID

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          startCounter();
          hasAnimatedRef.current = true;
          observer.disconnect(); // Disconnect after animation starts
        }
      },
      { threshold: 0.1 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
      observerRef.current = observer;
    }

    // Cleanup function
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      // Cancel the animation frame on component unmount to prevent memory leaks
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [end, duration]);

  const startCounter = () => {
    let startTime = null;
    const startValue = 0;
    const endValue = end;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      const currentCount = Math.floor(
        startValue + easeOutQuart * (endValue - startValue)
      );
      setCount(currentCount);

      if (progress < 1) {
        animationFrameId.current = requestAnimationFrame(animate);
      } else {
        setCount(endValue);
      }
    };

    animationFrameId.current = requestAnimationFrame(animate);
  };

  return <span ref={countRef}>{count}</span>;
};

const Stats = () => {
  const statsData = [
    {
      icon: <SchoolIcon />,
      number: 8,
      label: "Chapter",
      description: "Agoura Onsite and Online",
      color: "#D9F3FB",
      iconColor: "#40c1ec",
    },
    {
      icon: <PeopleIcon />,
      number: 1000,
      label: "Students",
      description: "More than 1000 Students",
      color: "#FEF1CD",
      iconColor: "#FCB903",
    },
    {
      icon: <VolunteerActivismIcon />,
      number: 125,
      label: "Volunteers",
      description: "More than 125 Volunteers",
      color: "#FCDBDF",
      iconColor: "#53b50a",
    },
    {
      icon: <ComputerIcon />,
      number: 6,
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
        backgroundImage: `url(${counterBg2Img})`,
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        padding: { xs: "20px 0", md: "20px 0" },
        position: "relative",
        overflow: "hidden",
        minHeight: "60vh",
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
        src={arrow5Img}
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
        src={arrow2Img}
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
        src={arrow4Img}
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
        src={arrow3Img}
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

      <Container
        maxWidth={false}
        disableGutters
        className="home-section-container"
        sx={{ width: "100%" }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            gap: "30px",
            alignItems: "flex-start",
          }}
        >
          {/* Left Column - Text Content */}
          <Box
            sx={{
              flex: { xs: "1", lg: "0 0 40%" },
              width: { xs: "100%", lg: "40%" },
            }}
          >
            <Typography
              variant="h4"
              sx={{
                color: "white",
                fontSize: { xs: "2rem", md: "2.8rem" },
                fontWeight: 500,
                lineHeight: 1.1,
                textAlign: { xs: "left", md: "left" },
              }}
            >
              Why Join Agoura Math Circle?
            </Typography>
            <Typography
              sx={{
                color: "white",
                fontSize: { xs: "1rem", md: "1.1rem" },
                lineHeight: 1.7,
                marginBottom: "30px",
                textAlign: { xs: "justify", md: "justify" },
              }}
            >
              Agoura Math Circle offers diverse learning opportunities to cater
              to students' varying interests, such as engineering, computer
              science, and problem-solving for national math competitions such
              as AMC and Math Kangaroo. Additionally, we hold monthly seminars
              from highly qualified STEM professionals and prepare students for
              standardized testing. Currently, we provide both online and
              on-site programs for the Math Circle and online classes for
              Engineering Circle, Test Preparation, and Triangular Talks. Our
              latest addition is the Satellite program, where we collaborate
              with students, teachers, schools, and educational institutions to
              support the setup of their own clubs, study groups, or enrichment
              classes.
            </Typography>
            <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
              <Button
                endIcon={<ArrowForwardIcon />}
                href="/about/math-circle"
                sx={{
                  backgroundColor: "#53b50a",
                  color: "#fff",
                  border: "2px solid transparent",
                  fontWeight: 600,
                  fontSize: "16px",
                  padding: "12px 24px",
                  borderRadius: "3px",
                  textTransform: "capitalize",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "transparent",
                    borderColor: "#fff",
                    color: "#fff",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  },
                }}
              >
                Start Course
              </Button>
            </Box>
          </Box>

          {/* Right Column - Statistics Cards */}
          <Box
            sx={{
              flex: { xs: "1", lg: "0 0 60%" },
              width: { xs: "100%", lg: "60%" },
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {/* All cards */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {xs:"1fr", sm:"1fr 1fr"},
                gap: "20px"
              }}
            >
              {statsData.map((stat, index) => (
                <Card
                  key={index}
                  sx={{
                    backgroundColor: "rgb(255, 255, 255)",
                    borderRadius: "10px",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                    padding: "30px 10px",
                    flex: 1,
                    display: "flex !important",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "10px",
                    boxSizing: "border-box",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  {/* Icon Circle */}
                  <Box
                    sx={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      backgroundColor: stat.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {React.cloneElement(stat.icon, {
                      sx: {
                        color: stat.iconColor,
                        fontSize: 28,
                      },
                    })}
                  </Box>

                  {/* Text Content */}
                  <Box
                    sx={{
                      flex: 1,
                      textAlign: "left",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "1.5rem",
                        fontWeight: 800,
                        color: "#333",
                        lineHeight: 1,
                        marginBottom: "8px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span>
                        <Counter end={stat.number} duration={2000} />
                        {stat.number === 1000 && "+"}
                      </span>
                      <span>{stat.label}</span>
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "17px",
                        color: "rgb(80, 80, 80)",
                        fontFamily: "'Nunito', sans-serif",
                        fontWeight: 500,
                        lineHeight: 1.4,
                      }}
                    >
                      {stat.description}
                    </Typography>
                  </Box>
                </Card>
              ))}
            </Box>

          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Stats;
