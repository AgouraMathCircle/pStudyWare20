import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Card,
  IconButton,
  keyframes,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
// Import images from src/assets
import arrow2Img from "../assets/images/arrow-2.png";
import arrow3Img from "../assets/images/arrow-3.png";
import arrow4Img from "../assets/images/arrow-4.png";
import arrow5Img from "../assets/images/arrow-5.png";

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

const VideoGallery = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const videos = [
    {
      id: "EViqvhjPO_0",
      title: "AMC Success Story 1",
    },
    {
      id: "brFBSTL7o10",
      title: "AMC Success Story 2",
    },
    {
      id: "LnDwNFbK61g",
      title: "AMC Success Story 3",
    },
    {
      id: "6rUbesvZ9cM",
      title: "AMC Success Story 4",
    },
  ];

  // Create video pairs for side-by-side display
  const videoPairs = [
    [videos[0], videos[1]],
    [videos[2], videos[3]],
  ];

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % videoPairs.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [videoPairs.length]);

  return (
    <Box
      sx={{
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
        boxShadow: "inset 0 10px 20px rgba(64, 193, 236, 0.1), inset 0 -10px 20px rgba(64, 193, 236, 0.1)",
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

      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          gap: 6,
          alignItems: 'center',
          width: '100%'
        }}>
          
          {/* Left Side: Success Story Text */}
          <Box sx={{ 
            flex: 1,
            width: '100%'
          }}>
            <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  justifyContent: { xs: "center", md: "flex-start" },
                  mb: 2,
                }}
              >
                <Typography
                  sx={{
                    color: "#40c1ec",
                    fontWeight: 600,
                    fontSize: "1rem",
                    textTransform: "uppercase",
                  }}
                >
                  Success Story
                </Typography>
                <Box
                  sx={{
                    height: "2px",
                    width: "60px",
                    backgroundColor: "#40c1ec",
                    opacity: 0.5,
                  }}
                />
              </Box>
              <Typography
                variant="h2"
                sx={{
                  color: "black",
                  fontWeight: 700,
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                  lineHeight: 1.2,
                  mb: 3,
                }}
              >
                Students are always happy with us!
              </Typography>
            </Box>
          </Box>

          {/* Right Side: Video Carousel */}
          <Box sx={{ 
            flex: 1,
            width: '100%',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Video Carousel Container */}
            <Box sx={{
              display: 'flex',
              transition: 'transform 0.8s ease-in-out',
              transform: `translateX(-${currentSlide * 100}%)`,
            }}>
              {videoPairs.map((pair, pairIndex) => (
                <Box
                  key={`pair-${pairIndex}`}
                  sx={{
                    minWidth: '100%',
                    flexShrink: 0,
                    display: 'flex',
                    gap: 3,
                    padding: 1,
                  }}
                >
                  {pair.map((video, videoIndex) => (
                    <Box
                      key={`${video.id}-${pairIndex}-${videoIndex}`}
                      sx={{
                        width: 'calc(50% - 12px)',
                        flexShrink: 0,
                      }}
                    >
                      <Card
                        sx={{
                          backgroundColor: "#ffffff",
                          borderRadius: "12px",
                          overflow: "hidden",
                          boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.15)",
                          border: "12px solid #ffffff",
                          transition: "all 0.3s ease",
                          position: "relative",
                          // 16:9 Aspect Ratio for EACH video
                          height: 0,
                          paddingBottom: '56.25%', // 16:9 aspect ratio
                          "&:hover": {
                            transform: "translateY(-5px)",
                            boxShadow: "0px 15px 35px rgba(0, 0, 0, 0.25)",
                            border: "12px solid #ffffff",
                            "&::after": {
                              content: '""',
                              position: "absolute",
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              border: "3px solid #40c1ec",
                              borderRadius: "4px",
                            }
                          }
                        }}
                      >
                        {/* Video Thumbnail Container */}
                        <Box
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            backgroundImage: `url(https://img.youtube.com/vi/${video.id}/hqdefault.jpg)`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            "&:hover > .play-button": {
                              opacity: 1,
                              transform: "translate(-50%, -50%) scale(1.1)",
                            }
                          }}
                        >
                          <IconButton
                            className="play-button"
                            href={`https://www.youtube.com/watch?v=${video.id}`}
                            target="_blank"
                            sx={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              backgroundColor: "rgba(255, 0, 0, 0.9)",
                              color: "#fff",
                              width: "60px",
                              height: "60px",
                              borderRadius: "50%",
                              opacity: 0.9,
                              transition: "all 0.3s ease",
                              "&:hover": {
                                backgroundColor: "rgba(255, 0, 0, 1)",
                                transform: "translate(-50%, -50%) scale(1.2)",
                              },
                            }}
                          >
                            <PlayArrowIcon sx={{ fontSize: "2rem", ml: "4px" }} />
                          </IconButton>
                        </Box>
                      </Card>
                    </Box>
                  ))}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default VideoGallery;