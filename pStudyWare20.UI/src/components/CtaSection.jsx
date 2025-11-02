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
import class010 from "../../assets/images/class/010.jpg";
import class011 from "../../assets/images/class/011.jpg";
import class001 from "../../assets/images/class/001.jpg";
import class002 from "../../assets/images/class/002.jpg";
import class003 from "../../assets/images/class/003.jpg";
import class004 from "../../assets/images/class/004.jpg";
import class005 from "../../assets/images/class/005.jpg";
import class006 from "../../assets/images/class/006.jpg";
import class007 from "../../assets/images/class/007.jpg";
import class008 from "../../assets/images/class/008.jpg";
import class009 from "../../assets/images/class/009.jpg";

// Class images for carousel
const classImages = [
  class010,
  class011,
  class001,
  class002,
  class003,
  class004,
  class005,
  class006,
  class007,
  class008,
  class009,
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
          marginBottom: 0, // Remove extra margin below the section
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              minHeight: { md: 340, lg: 340 },
              px: { xs: 1, md: 2 },
            }}
          >
            {/* Text Section - left */}
            <Box
              sx={{
                flex: "0 0 500px",
                maxWidth: "500px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                animation: `${fadeInAnimation} 0.8s ease-out`,
                pl: { lg: 2, xs: 0 },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: "#40c1ec",
                  marginBottom: "10px",
                  fontWeight: 600,
                  textAlign: "left",
                }}
              >
                Agoura Math Circle
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  color: "#102d47",
                  marginBottom: "32px",
                  fontWeight: 700,
                  lineHeight: 1.1,
                  fontSize: { xs: "2rem", md: "2.6rem", lg: "2.6rem" }, // increased font size
                  textAlign: "left",
                  maxWidth: "100%",
                  letterSpacing: "-1px",
                  wordBreak: "break-word",
                }}
              >
                AMC's Fall Semester 2025
                <br />
                starts on Saturday,
                <br />
                August 23, 2025.
              </Typography>
              <Button
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                href="/studentregistration"
                component="a"
                sx={{
                  backgroundColor: "#53b50a",
                  color: "#ffffff",
                  padding: "16px 40px",
                  borderRadius: "5px",
                  textTransform: "capitalize",
                  fontWeight: 600,
                  fontSize: "1.25rem",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "#4a9d09",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  },
                  width: "fit-content",
                  mt: 2,
                }}
              >
                Register Now
              </Button>
            </Box>
            {/* Image Section - right */}
            <Box
              sx={{
                display: "flex",
                gap: 6,
                ml: { md: 0, lg: 0 }, // Move images more to the left
                pr: { md: 2, lg: 2 },
              }}
            >
              <Card
                sx={{
                  width: { xs: "200px", md: "290px", lg: "320px" },
                  height: { xs: "120px", md: "180px", lg: "200px" },
                  overflow: "hidden",
                  transition: "transform 0.3s ease",
                  "&:hover": { transform: "scale(1.05)" },
                  boxShadow: 3,
                  background: "#fff",
                }}
              >
                <CardMedia
                  component="img"
                  image={classImages[currentImageIndex]}
                  alt="Class activity"
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Card>
              <Card
                sx={{
                  width: { xs: "200px", md: "290px", lg: "320px" },
                  height: { xs: "120px", md: "180px", lg: "200px" },
                  overflow: "hidden",
                  transition: "transform 0.3s ease",
                  "&:hover": { transform: "scale(1.05)" },
                  boxShadow: 3,
                  background: "#fff",
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
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Card>
            </Box>
          </Box>
        </Container>
      </Box>

     
      
    </>
  );
};

export default CtaSection;
