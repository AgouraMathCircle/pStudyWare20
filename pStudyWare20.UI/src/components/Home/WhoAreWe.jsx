import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Container, keyframes } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import aboutImage from "../../assets/images/about/about2.png";
import "../../styles/Home/WhoAreWe.css";

// Keyframe animations
const fadeInLeft = keyframes`
  0% {
    opacity: 0;
    transform: translateX(-30px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
`;

const fadeInRight = keyframes`
  0% {
    opacity: 0;
    transform: translateX(30px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
`;

const fadeInUp = keyframes`
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Description: slide in from right to left
const slideInFromRight = keyframes`
  0% {
    opacity: 0;
    transform: translateX(50px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
`;

const WhoAreWe = () => {
  const [currentDescriptionIndex, setCurrentDescriptionIndex] = useState(0);

  // Descriptions matching index.html
  const descriptions = [
    "The Agoura Math Circle, established by Pranav Kalyan in September 2015, is a student-led nonprofit community service organization registered as a 501(c)(3). Our mission is to provide a free educational program that emphasizes problem-solving skills, equipping students for success in academics and real-world challenges. We aim to boost students' confidence and problem-solving abilities, preparing them for any academic or practical task. Our ultimate objective is to lay a strong foundation for children, enhancing their critical thinking skills and inspiring them to aspire to prestigious universities, all within an engaging and enjoyable environment.",
    "Agoura Math Circle offers diverse opportunities to cater to students' varied interests. Currently, we provide both online and on-site programs for math, and online programs for engineering and test preparation. Agoura Engineering Circle specifically allows high school students to apply their math skills in engineering contexts, and our test preparation courses assist students in achieving their desired scores in standardized tests such as the PSAT, SAT, and ACT. As part of our Satellite program, we also collaborate with students, teachers, schools, and educational institutions to support the setup of their own clubs, study groups, or enrichment classes. Additionally, for young learners worldwide seeking to explore mathematical concepts, we maintain a dedicated YouTube channel.",
  ];

  // Auto-rotate descriptions every 5 seconds (stay for 5 sec)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDescriptionIndex((prevIndex) =>
        prevIndex === descriptions.length - 1 ? 0 : prevIndex + 1,
      );
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, [descriptions.length]);

  return (
    <Box className="who-section">
      <Container
        maxWidth={false}
        disableGutters
        className="home-section-container"
      >
        <Box className="who-grid">
          <Box
            className="who-media"
            sx={{
              animation: `${fadeInLeft} 1.5s ease-out 0.1s both`,
            }}
          >
            <Box
              component="span"
              className="who-dot who-dot--top-left"
              sx={{
                animation: `${fadeInLeft} 1.5s ease-out 0.1s both`,
              }}
            />
            <Box
              component="span"
              className="who-dot who-dot--bottom-right"
              sx={{
                animation: `${fadeInLeft} 1.5s ease-out 0.1s both`,
              }}
            />
            <Box
              component="span"
              className="who-ring who-ring--accent"
              sx={{
                animation: `${fadeInLeft} 1.5s ease-out 0.1s both`,
              }}
            />
            <Box className="who-media-circle">
              <Box component="img" src={aboutImage} alt="Agoura Math Circle" />
              <Button
                className="who-media-play"
                component="a"
                href="https://www.youtube.com/watch?v=j_CUTnHSNHQ"
                target="_blank"
                rel="noopener noreferrer"
              >
                <PlayArrowIcon />
              </Button>
            </Box>
          </Box>

          <Box
            className="who-content"
            sx={{
              animation: `${fadeInRight} 1.5s ease-out 0.2s both`,
            }}
          >
            <Typography
              className="who-badge"
              component="span"
              sx={{
                animation: `${fadeInUp} 1s ease-out 0.3s both`,
              }}
            >
              Who Are We
            </Typography>
            <Typography
              variant="h2"
              className="who-title"
              sx={{
                animation: `${fadeInUp} 1s ease-out 0.4s both`,
              }}
            >
              Agoura Math Circle
            </Typography>
            <Box
              sx={{
                animation: `${fadeInUp} 1.5s ease-out 0.5s both`,
                minHeight: "200px",
              }}
            >
              <Typography
                className="who-description"
                key={currentDescriptionIndex}
                sx={{
                  animation: `${slideInFromRight} 0.7s ease-out both`,
                }}
              >
                {descriptions[currentDescriptionIndex]}
              </Typography>
            </Box>
            <Box
              className="who-buttons"
              sx={{
                animation: `${fadeInUp} 2s ease-out 0.6s both`,
              }}
            >
              <Button
                className="who-primary-button"
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                component="a"
                href="/about/math-circle"
              >
                Learn More
              </Button>
              <Button
                className="who-secondary-button"
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                component="a"
                href="/studentregistration"
              >
                Register For Free Math Class
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default WhoAreWe;
