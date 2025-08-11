import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardMedia,
  IconButton,
  keyframes,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
// Import images from src/assets
import client1Img from "../../assets/images/clients/clients-1.png";
import client3Img from "../../assets/images/clients/clients-3.png";
import client4Img from "../../assets/images/clients/clients-4.png";
import client5Img from "../../assets/images/clients/clients-5.png";
import client6Img from "../../assets/images/clients/clients-6.png";
import client7Img from "../../assets/images/clients/clients-7.png";
import client8Img from "../../assets/images/clients/clients-8.png";
import client2Img from "../../assets/images/clients/clients-2.png";

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

const Sponsors = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const sponsors = [
    {
      id: 1,
      name: "Alapio",
      image: client1Img,
      link: "https://www.alapio.org",
    },
    {
      id: 2,
      name: "Sponsor 2",
      image: client3Img,
      link: null,
    },
    {
      id: 3,
      name: "NextPhase Recruiting",
      image: client4Img,
      link: "https://nextphase-recruiting.com",
    },
    {
      id: 4,
      name: "Sponsor 4",
      image: client5Img,
      link: null,
    },
    {
      id: 5,
      name: "Spring Info Services",
      image: client6Img,
      link: "http://springinfoservices.com",
    },
    {
      id: 6,
      name: "Camreal",
      image: client7Img,
      link: "https://www.camreal.com",
    },
    {
      id: 7,
      name: "Bits Informatics",
      image: client8Img,
      link: "https://bitsi.in",
    },
    {
      id: 8,
      name: "Sponsor 8",
      image: client2Img,
      link: null,
    },
  ];

  const sponsorsPerView = 5; // Show 5 sponsors per view on desktop
  const totalSlides = Math.ceil(sponsors.length / sponsorsPerView);

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

  const getCurrentSponsors = () => {
    const startIndex = currentIndex * sponsorsPerView;
    const currentSponsors = sponsors.slice(
      startIndex,
      startIndex + sponsorsPerView
    );

    // If we don't have exactly 5 sponsors, fill with the first sponsors to avoid blanks
    if (currentSponsors.length < sponsorsPerView) {
      const remainingSlots = sponsorsPerView - currentSponsors.length;
      const additionalSponsors = sponsors.slice(0, remainingSlots);
      return [...currentSponsors, ...additionalSponsors];
    }

    return currentSponsors;
  };

  return (
    <Box
      sx={{
        backgroundColor: "#e3f8f1",
        padding: { xs: "40px 0", md: "70px 0 100px 0" },
      }}
    >
      <Container maxWidth="lg">
        {/* Section Header */}
        <Box
          sx={{
            textAlign: "center",
            marginBottom: { xs: "30px", md: "50px" },
            animation: `${fadeInAnimation} 0.8s ease-out`,
          }}
        >
          <Typography
            variant="h3"
            sx={{
              color: "#102d47",
              fontWeight: 700,
              marginBottom: 0,
              "@media (max-width: 600px)": {
                fontSize: "28px",
              },
            }}
          >
            OUR SPONSORS
          </Typography>
        </Box>

        {/* Sponsors Carousel */}
        <Box
          sx={{
            position: "relative",
            animation: `${fadeInAnimation} 0.8s ease-out 0.2s both`,
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {/* Sponsors Grid */}
          <Grid
            container
            spacing={3}
            justifyContent="center"
            alignItems="center"
          >
            {getCurrentSponsors().map((sponsor, index) => (
              <Grid
                item
                xs={6}
                sm={4}
                md={2.4}
                key={`${sponsor.id}-${currentIndex}-${index}`}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "20px",
                    backgroundColor: "#ffffff",
                    borderRadius: "10px",
                    boxShadow: "0px 0px 16px rgba(4, 59, 80, 0.1)",
                    transition: "all 0.3s ease",
                    animation: `${fadeInAnimation} 0.8s ease-out ${
                      0.3 + index * 0.1
                    }s both`,
                    height: "120px",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0px 8px 25px rgba(4, 59, 80, 0.15)",
                    },
                  }}
                >
                  {sponsor.link ? (
                    <Box
                      component="a"
                      href={sponsor.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        height: "100%",
                        textDecoration: "none",
                        "&:hover": {
                          opacity: 0.8,
                        },
                      }}
                    >
                      <Box
                        component="img"
                        src={sponsor.image}
                        alt={sponsor.name}
                        sx={{
                          maxWidth: "100%",
                          maxHeight: "80px",
                          objectFit: "contain",
                          filter: "grayscale(100%)",
                          transition: "filter 0.3s ease",
                          "&:hover": {
                            filter: "grayscale(0%)",
                          },
                        }}
                      />
                    </Box>
                  ) : (
                    <Box
                      component="img"
                      src={sponsor.image}
                      alt={sponsor.name}
                      sx={{
                        maxWidth: "100%",
                        maxHeight: "80px",
                        objectFit: "contain",
                        filter: "grayscale(100%)",
                        transition: "filter 0.3s ease",
                        "&:hover": {
                          filter: "grayscale(0%)",
                        },
                      }}
                    />
                  )}
                </Box>
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
              marginTop: "40px",
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
                      : "rgba(64, 193, 236, 0.3)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor:
                      index === currentIndex
                        ? "#40c1ec"
                        : "rgba(64, 193, 236, 0.6)",
                  },
                }}
              />
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Sponsors;
