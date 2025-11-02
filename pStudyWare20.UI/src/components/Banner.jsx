import React from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  keyframes,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
// Import images from src/assets
import arrow1Img from "../../assets/images/banner/arrow-1.png";
import arrow2Img from "../../assets/images/banner/arrow-2.png";
import arrow3Img from "../../assets/images/banner/arrow-3.png";
import arrow4Img from "../../assets/images/banner/arrow-4.png";
import arrow5Img from "../../assets/images/banner/arrow-5.png";
import bannerBg2Img from "../../assets/images/banner/banner-bg2.jpg";

// Keyframe animations
const upDownAnimation = keyframes`
  0% {
    transform: translateY(30px);
  }
  50% {
    transform: translateY(-50px);
  }
  100% {
    transform: translateY(0);
  }
`;

const leftRightAnimation = keyframes`
  0% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(-50px);
  }
  100% {
    transform: translateX(0);
  }
`;

const Banner = () => {
  return (
    <Box
      sx={{
        position: "relative",
        backgroundImage: `url(${bannerBg2Img})`,
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#f3fafc",
        minHeight: "750px",
        display: "grid",
        alignItems: "flex-end",
        zIndex: 9,
        overflow: "hidden",
        "@media (max-width: 900px)": {
          minHeight: "600px",
        },
        "@media (max-width: 600px)": {
          minHeight: "500px",
        },
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid xs={12} lg={6}>
            <Box
              sx={{
                paddingBottom: "200px",
                "@media (max-width: 900px)": {
                  paddingBottom: "150px",
                },
                "@media (max-width: 600px)": {
                  paddingBottom: "100px",
                },
              }}
            >
              <Typography
                variant="h1"
                sx={{
                  color: "#ffffff",
                  fontSize: "60px",
                  lineHeight: 1.2,
                  fontWeight: 700,
                  marginBottom: "15px",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                  "@media (max-width: 1200px)": {
                    fontSize: "48px",
                  },
                  "@media (max-width: 900px)": {
                    fontSize: "36px",
                  },
                  "@media (max-width: 600px)": {
                    fontSize: "28px",
                  },
                }}
              >
                Free&nbsp;
                <br />
                Educational Program
              </Typography>
              <Button
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                href="/mathcircle"
                component="a"
                sx={{
                  outline: "none",
                  border: "none",
                  padding: "16px 30px",
                  borderRadius: "3px",
                  display: "inline-block",
                  textTransform: "capitalize",
                  fontSize: "16px",
                  fontWeight: 600,
                  backgroundColor: "#53b50a",
                  color: "#ffffff",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "#4a9d09",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  },
                  "& .MuiButton-endIcon": {
                    marginLeft: "8px",
                    transition: "transform 0.3s ease",
                  },
                  "&:hover .MuiButton-endIcon": {
                    transform: "translateX(4px)",
                  },
                }}
              >
                Learn More
              </Button>
            </Box>
          </Grid>
          <Grid xs={12} lg={6}>
            {/* Right side content - hidden on mobile */}
            <Box
              sx={{
                display: { xs: "none", lg: "block" },
                position: "relative",
                height: "100%",
              }}
            >
              {/* Animated circle placeholder */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: "7.5%",
                  right: "32.5%",
                  width: "200px",
                  height: "200px",
                  borderRadius: "50%",
                  background: "rgba(64, 193, 236, 0.5)",
                  animation: "pulse-border 3s ease-out infinite",
                  zIndex: -1,
                  opacity: 0.5,
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Animated Arrows */}
      <Box
        sx={{
          position: "absolute",
          zIndex: 1,
          bottom: "20%",
          left: "36%",
          animation: `${leftRightAnimation} 8s cubic-bezier(0.41, 0.04, 0.03, 1.1) infinite`,
          "& img": {
            maxWidth: "100%",
            height: "auto",
          },
        }}
      >
        <img src={arrow1Img} alt="Animated arrow 1" />
      </Box>

      <Box
        sx={{
          position: "absolute",
          zIndex: 1,
          bottom: "55%",
          left: "50%",
          animation: `${upDownAnimation} 8s alternate infinite`,
          "& img": {
            maxWidth: "100%",
            height: "auto",
          },
        }}
      >
        <img src={arrow2Img} alt="Animated arrow 2" />
      </Box>

      <Box
        sx={{
          position: "absolute",
          zIndex: 1,
          top: "12%",
          left: "40%",
          animation: `${upDownAnimation} 8s alternate infinite`,
          "& img": {
            maxWidth: "100%",
            height: "auto",
          },
        }}
      >
        <img src={arrow3Img} alt="Animated arrow 3" />
      </Box>

      <Box
        sx={{
          position: "absolute",
          zIndex: 1,
          bottom: "35%",
          left: "12%",
          animation: `${leftRightAnimation} 8s cubic-bezier(0.41, 0.04, 0.03, 1.1) infinite`,
          "& img": {
            maxWidth: "100%",
            height: "auto",
          },
        }}
      >
        <img src={arrow4Img} alt="Animated arrow 4" />
      </Box>

      <Box
        sx={{
          position: "absolute",
          zIndex: 1,
          top: "10%",
          right: "8%",
          animation: `${upDownAnimation} 8s alternate infinite`,
          "& img": {
            maxWidth: "100%",
            height: "auto",
          },
        }}
      >
        <img src={arrow5Img} alt="Animated arrow 5" />
      </Box>

      {/* Global styles for animations */}
      <style>{`
        @keyframes pulse-border {
          0% {
            transform: translateX(-50%) scale(1);
            opacity: 0.5;
          }
          50% {
            transform: translateX(-50%) scale(1.1);
            opacity: 0.3;
          }
          100% {
            transform: translateX(-50%) scale(1);
            opacity: 0.5;
          }
        }
      `}</style>
    </Box>
  );
};

export default Banner;
