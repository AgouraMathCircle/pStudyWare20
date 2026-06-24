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
// Import images from src/assets
import satelliteLogoImg from "../../assets/images/about/Satellite_logo.jpg";
import triangularTalksLogoImg from "../../assets/images/talk/Triangular-Talks-Logo.png";
import ctaBgImage from "../../assets/images/bg/cta-bg.jpg";
import ctaBgImage2 from "../../assets/images/bg/cta-bg2.jpg";
import award2026_1 from "../../assets/images/gallery/photos/AwardCeremony2026/IMG 1.jpeg";
import award2026_2 from "../../assets/images/gallery/photos/AwardCeremony2026/IMG 2.jpeg";
import award2026_3 from "../../assets/images/gallery/photos/AwardCeremony2026/IMG 3.jpeg";
import award2026_4 from "../../assets/images/gallery/photos/AwardCeremony2026/IMG 4.jpeg";
import award2026_5 from "../../assets/images/gallery/photos/AwardCeremony2026/IMG 5.jpeg";
import award2026_6 from "../../assets/images/gallery/photos/AwardCeremony2026/IMG 6.jpeg";
import award2026_7 from "../../assets/images/gallery/photos/AwardCeremony2026/IMG 7.jpg";
import award2026_8 from "../../assets/images/gallery/photos/AwardCeremony2026/IMG 8.jpg";
import award2026_9 from "../../assets/images/gallery/photos/AwardCeremony2026/IMG 9.jpg";
import award2026_10 from "../../assets/images/gallery/photos/AwardCeremony2026/IMG 10.jpg";
import award2026_11 from "../../assets/images/gallery/photos/AwardCeremony2026/702043303_2699111117125007_350006303293899090_n.jpg";
import award2026_12 from "../../assets/images/gallery/photos/AwardCeremony2026/702209742_2699111300458322_4851501361847296435_n.jpg";
import award2026_13 from "../../assets/images/gallery/photos/AwardCeremony2026/702273406_2699111453791640_6425016817942404446_n.jpg";
import award2026_14 from "../../assets/images/gallery/photos/AwardCeremony2026/702107084_2699111743791611_4185937333306236328_n.jpg";
import award2026_15 from "../../assets/images/gallery/photos/AwardCeremony2026/702191501_2699112190458233_7860505479694526610_n.jpg";
import award2026_16 from "../../assets/images/gallery/photos/AwardCeremony2026/702064010_2699112283791557_6409814095350757349_n.jpg";
import award2026_17 from "../../assets/images/gallery/photos/AwardCeremony2026/702087051_2699112483791537_5641882611819009816_n.jpg";
import award2026_18 from "../../assets/images/gallery/photos/AwardCeremony2026/702094161_2699112623791523_1137279335811766909_n.jpg";
import award2026_19 from "../../assets/images/gallery/photos/AwardCeremony2026/702051665_2699112693791516_7438569826337495576_n.jpg";
import award2026_20 from "../../assets/images/gallery/photos/AwardCeremony2026/702325042_2701215580247894_8611988381996383593_n.jpg";
import award2026_21 from "../../assets/images/gallery/photos/AwardCeremony2026/702621355_2701217093581076_2170575568894046260_n.jpg";
import award2026_22 from "../../assets/images/gallery/photos/AwardCeremony2026/702718823_2701217206914398_1760117873653005247_n.jpg";

// All Award 2026 images
const award2026Images = [
  award2026_1,
  award2026_2,
  award2026_3,
  award2026_4,
  award2026_5,
  award2026_6,
  award2026_7,
  award2026_8,
  award2026_9,
  award2026_10,
  award2026_11,
  award2026_12,
  award2026_13,
  award2026_14,
  award2026_15,
  award2026_16,
  award2026_17,
  award2026_18,
  award2026_19,
  award2026_20,
  award2026_21,
  award2026_22,
];

// Class images are now all Award 2026 images
const classImages = award2026Images;

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
      title: "Triangular Talks - Coming Soon!",
    },
    {
      subtitle: "Math Circle",
      title: "AMC Fall semester starts on 29 Aug, 2026",
    },
    {
      subtitle: "Agoura Engineering Circle",
      title:
        "Mobile App Development and Artificial Intelligence courses start on Aug 29, 2026",
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
          padding: { xs: "20px 0", md: "30px 0" },
          marginBottom: { xs: "20px", md: "30px" },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={3} alignItems="center">
            <Grid xs={12} lg={4}>
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
                  AMC's Fall Semester 2026 starts on Saturday, August 29, 2026.
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
            <Grid xs={12} lg={8}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "300px",
                }}
              >
                <Grid container spacing={2}>
                  <Grid xs={6} md={6}>
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
                        image={award2026Images[0]}
                        alt="Award Ceremony 2026"
                        sx={{
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Card>
                  </Grid>
                  <Grid xs={6} md={6}>
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
                        image={award2026Images[1]}
                        alt="Award Ceremony 2026"
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
          padding: { xs: "15px 0", md: "15px 0" },
          marginBottom: { xs: "20px", md: "30px" },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            {/* Satellite Program */}
            <Grid xs={12} lg={4} md={6}>
              <Box
                sx={{
                  textAlign: "center",
                  animation: `${fadeInAnimation} 0.8s ease-out`,
                }}
              >
                <Box
                  component="img"
                  src={satelliteLogoImg}
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
            <Grid xs={12} lg={3} md={6}>
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
                  src="https://www.youtube.com/embed/qdNXuaToB1M?enablejsapi=1&rel=0&modestbranding=1"
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
            <Grid xs={12} lg={5} md={12}>
              <Box
                sx={{
                  textAlign: "center",
                  animation: `${fadeInAnimation} 0.8s ease-out 0.4s both`,
                }}
              >
                <Box
                  component="img"
                  src={triangularTalksLogoImg}
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
          padding: { xs: "20px 0", md: "30px 0" },
          marginBottom: { xs: "20px", md: "30px" },
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
