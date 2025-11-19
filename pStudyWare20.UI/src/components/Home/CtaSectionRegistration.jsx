import React from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  keyframes,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import satelliteLogoImg from "../../assets/images/about/Satellite_logo.jpg";
import triangularTalksLogoImg from "../../assets/images/talk/Triangular-Talks-Logo.png";
import ctaBgImage from "../../assets/images/bg/cta-bg.jpg";
// Import images from src/assets
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
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
import "../../styles/Home/CtaSection.css";

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
  // Duplicate images for seamless continuous loop
  const allClassImages = [...classImages, ...classImages, ...classImages, ...classImages];

  return (
    <>
      {/* First CTA Section - Registration */}
      <Box
        className="cta-section cta-section-primary"
        sx={{
          backgroundImage: `url(${ctaBgImage2})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Container
          maxWidth={false}
          disableGutters
          className="home-section-container"
        >
          <Box
            className="cta-primary-layout"
            sx={{
              animation: `${fadeInAnimation} 0.8s ease-out`,
            }}
          >
            <Box
              className="cta-primary-text"
              sx={{
                animation: `${fadeInAnimation} 0.8s ease-out 0.1s both`,
              }}
            >
              <Typography className="cta-badge">Agoura Math Circle</Typography>
              <Typography variant="h2" className="cta-title">
                AMC&apos;s Fall Semester 2025 starts on Saturday, August 23,
                2025.
              </Typography>
              <Button
                className="cta-primary-button"
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                href="/studentregistration"
                component="a"
              >
                Register Now
              </Button>
            </Box>
            <Box
              className="cta-primary-gallery"
              sx={{
                animation: `${fadeInAnimation} 0.8s ease-out 0.25s both`,
              }}
            >
              <Box 
                className="cta-gallery-viewport"
                sx={{
                  overflow: "hidden",
                  width: "100%",
                  position: "relative",
                }}
              >
                <Box 
                  className="cta-gallery-track"
                  sx={{
                    display: "flex",
                    animation: "continuousScroll 20s linear infinite",
                    gap: { xs: 1.5, sm: 2, md: 2 },
                    "&:hover": {
                      animationPlayState: "paused",
                    },
                  }}
                >
                  {/* All Images - Duplicated for seamless loop */}
                  {allClassImages.map((image, index) => (
                    <Box 
                      className="img-p" 
                      key={`class-image-${index}`}
                    >
                      <Box className="img-part position-relative">
                        <Box
                          component="img"
                          className=""
                          src={image}
                          alt={`Agoura Math Circle ${(index % classImages.length) + 1}`}
                        />
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* CSS Keyframes */}
      <style>
        {`
          @keyframes continuousScroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
        `}
      </style>
    </>
  );
};

export default CtaSection;
