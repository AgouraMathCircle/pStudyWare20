import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  IconButton,
  keyframes,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
// Import images from src/assets
import counterBg2Img from "../../assets/images/bg/counter-bg2.jpg";
import arrow2Img from "../../assets/images/arrow-2.png";
import arrow3Img from "../../assets/images/arrow-3.png";
import arrow4Img from "../../assets/images/arrow-4.png";
import arrow5Img from "../../assets/images/arrow-5.png";

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
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const videosPerView = 3; // Changed from 2 to 3
  const totalSlides = Math.ceil(videos.length / videosPerView);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === totalSlides - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? totalSlides - 1 : prevIndex - 1
    );
  };

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [currentIndex]);

  const getCurrentVideos = () => {
    const startIndex = currentIndex * videosPerView;
    const currentVideos = videos.slice(startIndex, startIndex + videosPerView);

    // If we don't have exactly 3 videos, fill with the first videos to avoid blanks
    if (currentVideos.length < videosPerView) {
      const remainingSlots = videosPerView - currentVideos.length;
      const additionalVideos = videos.slice(0, remainingSlots);
      return [...currentVideos, ...additionalVideos];
    }

    return currentVideos;
  };

  return (
    <Box
      sx={{
        backgroundImage: `url(${counterBg2Img})`,
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        padding: { xs: "30px 0", md: "60px 0" }, // Reduced padding
        position: "relative",
        overflow: "hidden",
        minHeight: "80vh", // Reduced from 100vh to 80vh
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
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

      <Container maxWidth="lg" sx={{ width: "100%" }}>
        <Grid container spacing={3} alignItems="center"> {/* Reduced spacing from 4 to 3 */}
          {/* Left Side - Content */}
          <Grid item xs={12} lg={4}>
            <Box
              sx={{
                animation: `${fadeInAnimation} 0.8s ease-out`,
                paddingTop: { xs: 0, lg: "15px" }, // Reduced padding
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: "#40c1ec",
                  fontWeight: 600,
                  marginBottom: "8px", // Reduced margin
                  textTransform: "uppercase",
                }}
              >
                Success Story{" "}
                <Box
                  component="span"
                  sx={{
                    display: "inline-block",
                    width: "30px",
                    height: "2px",
                    backgroundColor: "#40c1ec",
                    marginLeft: "10px",
                  }}
                />
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  color: "#ffffff",
                  fontWeight: 700,
                  marginBottom: 0,
                  "@media (max-width: 600px)": {
                    fontSize: "28px",
                  },
                }}
              >
                Students are always happy with us!
              </Typography>
            </Box>
          </Grid>

          {/* Right Side - Video Carousel */}
          <Grid item xs={12} lg={8}>
            <Box
              sx={{
                position: "relative",
                animation: `${fadeInAnimation} 0.8s ease-out 0.2s both`,
                maxWidth: "1000px",
                margin: "0 auto",
              }}
            >
              {/* Video Grid */}
              <Grid container spacing={2}>
                {getCurrentVideos().map((video, index) => (
                  <Grid
                    item
                    xs={12}
                    md={4}
                    key={`${video.id}-${currentIndex}-${index}`}
                  >
                    <Card
                      sx={{
                        backgroundColor: "#ffffff",
                        borderRadius: "10px",
                        overflow: "hidden",
                        boxShadow: "0px 0px 16px rgba(4, 59, 80, 0.1)",
                        transition: "all 0.3s ease",
                        height: "100%",
                        "&:hover": {
                          transform: "translateY(-5px)",
                          boxShadow: "0px 8px 25px rgba(4, 59, 80, 0.15)",
                        },
                      }}
                    >
                      <CardContent sx={{ padding: 0 }}>
                        <Box
                          sx={{
                            position: "relative",
                            width: "100%",
                            height: "160px", // Reduced height to accommodate 3 videos
                            overflow: "hidden",
                          }}
                        >
                          <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${video.id}`}
                            title={video.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            style={{
                              border: "none",
                            }}
                          />
                          <Box
                            sx={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              backgroundColor: "rgba(0, 0, 0, 0.7)",
                              borderRadius: "50%",
                              width: "50px", // Reduced size
                              height: "50px", // Reduced size
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              opacity: 0,
                              transition: "opacity 0.3s ease",
                              "&:hover": {
                                opacity: 1,
                              },
                            }}
                          >
                            <PlayArrowIcon
                              sx={{
                                color: "#ffffff",
                                fontSize: "24px", // Reduced size
                              }}
                            />
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {/* Navigation Arrows */}
              <IconButton
                onClick={prevSlide}
                sx={{
                  position: "absolute",
                  left: "-60px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  backgroundColor: "#ffffff",
                  color: "#40c1ec",
                  width: "50px",
                  height: "50px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  "&:hover": {
                    backgroundColor: "#40c1ec",
                    color: "#ffffff",
                  },
                  "@media (max-width: 1200px)": {
                    left: "-40px",
                  },
                  "@media (max-width: 768px)": {
                    left: "10px",
                    top: "auto",
                    bottom: "-60px",
                    transform: "none",
                  },
                }}
              >
                <ChevronLeftIcon />
              </IconButton>

              <IconButton
                onClick={nextSlide}
                sx={{
                  position: "absolute",
                  right: "-60px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  backgroundColor: "#ffffff",
                  color: "#40c1ec",
                  width: "50px",
                  height: "50px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  "&:hover": {
                    backgroundColor: "#40c1ec",
                    color: "#ffffff",
                  },
                  "@media (max-width: 1200px)": {
                    right: "-40px",
                  },
                  "@media (max-width: 768px)": {
                    right: "10px",
                    top: "auto",
                    bottom: "-60px",
                    transform: "none",
                  },
                }}
              >
                <ChevronRightIcon />
              </IconButton>

              {/* Dots Indicator */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "20px", // Reduced margin
                  gap: "8px",
                }}
              >
                {Array.from({ length: totalSlides }, (_, index) => (
                  <Box
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    sx={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      backgroundColor:
                        index === currentIndex
                          ? "#40c1ec"
                          : "rgba(255, 255, 255, 0.5)",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor:
                          index === currentIndex
                            ? "#40c1ec"
                            : "rgba(255, 255, 255, 0.8)",
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default VideoGallery;
