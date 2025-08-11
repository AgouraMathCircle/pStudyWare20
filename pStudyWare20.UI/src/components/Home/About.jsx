import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardMedia,
  keyframes,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
// Import images from src/assets
import aboutImage from "../../assets/images/about/about2.png";
import shapeImage from "../../assets/images/about/shap_image.png";

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

const About = () => {
  const [currentDescriptionIndex, setCurrentDescriptionIndex] = useState(0);

  // Descriptions for the carousel
  const descriptions = [
    "The Agoura Math Circle, established by Pranav Kalyan in September 2015, is a student-led nonprofit community service organization registered as a 501(c)(3). Our mission is to provide a free educational program that emphasizes problem-solving skills, equipping students for success in academics and real-world challenges. We aim to boost students' confidence and problem-solving abilities, preparing them for any academic or practical task. Our ultimate objective is to lay a strong foundation for children, enhancing their critical thinking skills and inspiring them to aspire to prestigious universities, all within an engaging and enjoyable environment.",
    "Agoura Math Circle offers diverse opportunities to cater to students' varied interests. Currently, we provide both online and on-site programs for math, and online programs for engineering and test preparation. Agoura Engineering Circle specifically allows high school students to apply their math skills in engineering contexts, and our test preparation courses assist students in achieving their desired scores in standardized tests such as the PSAT, SAT, and ACT. As part of our Satellite program, we also collaborate with students, teachers, schools, and educational institutions to support the setup of their own clubs, study groups, or enrichment classes. Additionally, for young learners worldwide seeking to explore mathematical concepts, we maintain a dedicated YouTube channel.",
  ];

  // Auto-rotate descriptions
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDescriptionIndex((prev) => (prev + 1) % descriptions.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [descriptions.length]);

  return (
    <Box
      sx={{
        backgroundColor: "#d5e8e2",
        padding: { xs: "40px 0", md: "20px 0 50px 0" },
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          {/* Image Section */}
          <Grid item xs={12} lg={5}>
            <Box
              sx={{
                position: "relative",
                animation: `${fadeInAnimation} 0.8s ease-out`,
              }}
            >
              <Card
                sx={{
                  boxShadow: "20px 10px 20px rgba(0, 0, 0, 0.2)",
                  padding: "20px",
                  borderRadius: "10px",
                  overflow: "hidden",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.02)",
                  },
                  "@media (max-width: 991px)": {
                    margin: "15px",
                    width: "auto !important",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  image={aboutImage}
                  alt="About Agoura Math Circle"
                  sx={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "8px",
                  }}
                />
                {/* YouTube Play Button Overlay */}
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    borderRadius: "50%",
                    width: "60px",
                    height: "60px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.9)",
                      transform: "translate(-50%, -50%) scale(1.1)",
                    },
                  }}
                  component="a"
                  href="https://www.youtube.com/watch?v=j_CUTnHSNHQ"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <PlayArrowIcon
                    sx={{
                      color: "#ffffff",
                      fontSize: "30px",
                    }}
                  />
                </Box>
              </Card>
            </Box>
          </Grid>

          {/* Content Section */}
          <Grid item xs={12} lg={7}>
            <Box
              sx={{
                animation: `${fadeInAnimation} 0.8s ease-out 0.2s both`,
                marginTop: { xs: "30px", lg: 0 },
              }}
            >
              {/* Subtitle */}
              <Typography
                variant="h6"
                sx={{
                  color: "#40c1ec",
                  fontWeight: 600,
                  marginBottom: "10px",
                  position: "relative",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: "-5px",
                    left: 0,
                    width: "50px",
                    height: "2px",
                    backgroundColor: "#40c1ec",
                  },
                }}
              >
                WHO ARE WE
              </Typography>

              {/* Title */}
              <Typography
                variant="h3"
                sx={{
                  color: "#102d47",
                  fontWeight: 700,
                  marginBottom: "20px",
                  lineHeight: 1.2,
                  "@media (max-width: 600px)": {
                    fontSize: "28px",
                  },
                }}
              >
                Agoura
                <br />
                Math Circle
              </Typography>

              {/* Description Carousel */}
              <Box
                sx={{
                  marginBottom: "20px",
                  minHeight: "120px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: "#505050",
                    lineHeight: 1.8,
                    fontSize: "16px",
                    opacity: 1,
                    transition: "opacity 0.5s ease",
                  }}
                >
                  {descriptions[currentDescriptionIndex]}
                </Typography>
              </Box>

              {/* Buttons */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                  animation: `${fadeInAnimation} 0.8s ease-out 0.4s both`,
                }}
              >
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
                  Learn More
                </Button>
                <Button
                  variant="outlined"
                  endIcon={<ArrowForwardIcon />}
                  href="/studentregistration"
                  component="a"
                  sx={{
                    borderColor: "#53b50a",
                    color: "#53b50a",
                    padding: "12px 24px",
                    borderRadius: "3px",
                    textTransform: "capitalize",
                    fontWeight: 600,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      borderColor: "#4a9d09",
                      backgroundColor: "#53b50a",
                      color: "#ffffff",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  Register for Free Math Class
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Floating Shape Image */}
        <Box
          component="img"
          src={shapeImage}
          alt="Decorative Shape"
          sx={{
            position: "absolute",
            bottom: "20%",
            right: "10%",
            animation: `${upDownAnimation} 3s ease-in-out infinite`,
            "@media (max-width: 768px)": {
              display: "none",
            },
          }}
        />
      </Container>
    </Box>
  );
};

export default About;
