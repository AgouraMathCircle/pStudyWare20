import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  keyframes,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

// Background images moved to public/assets/images/
const ctaBgImage = "/assets/images/bg/cta-bg.jpg";
const ctaBgImage2 = "/assets/images/bg/cta-bg2.jpg";

// Class images for carousel
const classImages = [
  "/assets/images/class/010.jpg",
  "/assets/images/class/011.jpg",
  "/assets/images/class/001.jpg",
  "/assets/images/class/002.jpg",
  "/assets/images/class/003.jpg",
  "/assets/images/class/004.jpg",
  "/assets/images/class/005.jpg",
  "/assets/images/class/006.jpg",
  "/assets/images/class/007.jpg",
  "/assets/images/class/008.jpg",
  "/assets/images/class/009.jpg",
];

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

const CtaSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);

  // News items for the third CTA section
  const newsItems = [
    {
      subtitle: "Agoura Math Circle",
      title: "Triangular Talks - April 13, 2024 at 9 AM PST.",
    },
    {
      subtitle: "Math Circle",
      title: "AMC Fall semester starts on 24 Aug,2024",
    },
    {
      subtitle: "Agoura Engineering Circle",
      title: "Coding Game final presentation on May 18th, 2024.",
    },
    {
      subtitle: "Satellite Program",
      title: "Want to start your own club? Join our Satellite Program.",
    },
  ];

  // Auto-rotate class images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % classImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Auto-rotate news items
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNewsIndex((prev) => (prev + 1) % newsItems.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* First CTA Section - Registration */}
      <Box
        sx={{
          backgroundImage: `url(${ctaBgImage2})`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          padding: { xs: "40px 0", md: "70px 0" },
          marginBottom: { xs: "40px", md: "80px" },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} lg={4}>
              <Box
                sx={{
                  animation: `${fadeInAnimation} 0.8s ease-out`,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: "#40c1ec",
                    marginBottom: "10px",
                    fontWeight: 600,
                  }}
                >
                  Agoura Math Circle
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    color: "#102d47",
                    marginBottom: "20px",
                    fontWeight: 700,
                    lineHeight: 1.2,
                    "@media (max-width: 600px)": {
                      fontSize: "24px",
                    },
                  }}
                >
                  AMC's Fall Semester 2024 starts on Saturday, August 24, 2024.
                </Typography>
                <Button
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  href="/studentregistration"
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
                  Register Now
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} lg={8}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "300px",
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={6} md={6}>
                    <Card
                      sx={{
                        height: "200px",
                        overflow: "hidden",
                        transition: "transform 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.05)",
                        },
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={classImages[currentImageIndex]}
                        alt="Class activity"
                        sx={{
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Card>
                  </Grid>
                  <Grid item xs={6} md={6}>
                    <Card
                      sx={{
                        height: "200px",
                        overflow: "hidden",
                        transition: "transform 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.05)",
                        },
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={
                          classImages[
                            (currentImageIndex + 1) % classImages.length
                          ]
                        }
                        alt="Class activity"
                        sx={{
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Second CTA Section - Satellite Program and Triangular Talks */}
      <Box
        sx={{
          backgroundImage: `url(${ctaBgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          padding: { xs: "30px 0", md: "30px 0" },
          marginBottom: { xs: "40px", md: "80px" },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            {/* Satellite Program */}
            <Grid item xs={12} lg={4} md={6}>
              <Box
                sx={{
                  textAlign: "center",
                  animation: `${fadeInAnimation} 0.8s ease-out`,
                }}
              >
                <Box
                  component="img"
                  src="/assets/images/about/satellite_logo.jpg"
                  alt="Satellite Program"
                  sx={{
                    width: "250px",
                    height: "150px",
                    borderRadius: "10px",
                    marginBottom: "16px",
                    "@media (max-width: 600px)": {
                      width: "200px",
                      height: "120px",
                    },
                  }}
                />
                <Typography
                  variant="h5"
                  sx={{
                    color: "#ffffff",
                    marginBottom: "16px",
                    fontWeight: 600,
                  }}
                >
                  Start your own club
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Button
                    variant="contained"
                    endIcon={<ArrowForwardIcon />}
                    href="/satellite-program"
                    component="a"
                    sx={{
                      backgroundColor: "#53b50a",
                      color: "#ffffff",
                      padding: "10px 20px",
                      borderRadius: "3px",
                      textTransform: "capitalize",
                      fontWeight: 600,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "#4a9d09",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    Learn More
                  </Button>
                  <Button
                    variant="outlined"
                    endIcon={<ArrowForwardIcon />}
                    href="https://docs.google.com/forms/d/e/1FAIpQLSee8eQUL8tt0Iygl_-ocQ9c4fzO3F3VwfIrPRlwXBFZ2XVfBA/viewform?usp=pp_url"
                    component="a"
                    target="_blank"
                    sx={{
                      borderColor: "#ffffff",
                      color: "#ffffff",
                      padding: "10px 20px",
                      borderRadius: "3px",
                      textTransform: "capitalize",
                      fontWeight: 600,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        borderColor: "#53b50a",
                        backgroundColor: "#53b50a",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    Register Now
                  </Button>
                </Box>
              </Box>
            </Grid>

            {/* YouTube Video */}
            <Grid item xs={12} lg={3} md={6}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  animation: `${fadeInAnimation} 0.8s ease-out 0.2s both`,
                }}
              >
                <Box
                  component="iframe"
                  width="300"
                  height="300"
                  src="https://www.youtube.com/embed/qdNXuaToB1M"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  sx={{
                    borderRadius: "8px",
                    "@media (max-width: 600px)": {
                      width: "280px",
                      height: "280px",
                    },
                  }}
                />
              </Box>
            </Grid>

            {/* Triangular Talks */}
            <Grid item xs={12} lg={5} md={12}>
              <Box
                sx={{
                  textAlign: "center",
                  animation: `${fadeInAnimation} 0.8s ease-out 0.4s both`,
                }}
              >
                <Box
                  component="img"
                  src="/assets/images/talk/Triangular-Talks-Logo.png"
                  alt="Triangular Talks"
                  sx={{
                    width: "250px",
                    height: "150px",
                    borderRadius: "10px",
                    marginBottom: "16px",
                    "@media (max-width: 600px)": {
                      width: "200px",
                      height: "120px",
                    },
                  }}
                />
                <Typography
                  variant="h5"
                  sx={{
                    color: "#ffffff",
                    marginBottom: "16px",
                    fontWeight: 600,
                  }}
                >
                  June 29, 2024
                  <br />
                  9.00 AM - 10:00 AM PST
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Button
                    variant="contained"
                    endIcon={<ArrowForwardIcon />}
                    href="http://triangulartalks.org/"
                    component="a"
                    target="_blank"
                    sx={{
                      backgroundColor: "#53b50a",
                      color: "#ffffff",
                      padding: "10px 20px",
                      borderRadius: "3px",
                      textTransform: "capitalize",
                      fontWeight: 600,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "#4a9d09",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    Learn More
                  </Button>
                  <Button
                    variant="outlined"
                    endIcon={<PlayArrowIcon />}
                    href="https://us06web.zoom.us/j/89825144487?pwd=NDdCRXFUWXFESXM3dXpEekNzbkFNUT09"
                    component="a"
                    target="_blank"
                    sx={{
                      borderColor: "#ffffff",
                      color: "#ffffff",
                      padding: "10px 20px",
                      borderRadius: "3px",
                      textTransform: "capitalize",
                      fontWeight: 600,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        borderColor: "#53b50a",
                        backgroundColor: "#53b50a",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    Join the Meeting
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Third CTA Section - News Carousel */}
      <Box
        sx={{
          backgroundImage: `url(${ctaBgImage2})`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          padding: { xs: "40px 0", md: "70px 0" },
          marginBottom: { xs: "40px", md: "80px" },
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              textAlign: "center",
              animation: `${fadeInAnimation} 0.8s ease-out`,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: "#40c1ec",
                marginBottom: "10px",
                fontWeight: 600,
                position: "relative",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: "-5px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "50px",
                  height: "2px",
                  backgroundColor: "#40c1ec",
                },
              }}
            >
              {newsItems[currentNewsIndex].subtitle}
            </Typography>
            <Typography
              variant="h4"
              sx={{
                color: "#102d47",
                fontWeight: 700,
                lineHeight: 1.2,
                "@media (max-width: 600px)": {
                  fontSize: "24px",
                },
              }}
            >
              {newsItems[currentNewsIndex].title}
            </Typography>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default CtaSection;
