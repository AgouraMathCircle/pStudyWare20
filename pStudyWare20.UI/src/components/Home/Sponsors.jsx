import React from "react";
import { Box, Typography, Container, keyframes } from "@mui/material";
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
  const sponsors = [
    {
      id: 1,
      name: "Alapio",
      image: client1Img,
      link: "https://www.alapio.org",
    },
    {
      id: 2,
      name: "Drs. Bharat and Ninna Patel Family Foundation",
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
      name: "Andrew XU Family Foundation",
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
      name: "Caminoreal",
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
      name: "Agoura Hills Dental Designs",
      image: client2Img,
      link: null,
    },
  ];

  // Duplicate sponsors for seamless continuous loop
  const allSponsors = [...sponsors, ...sponsors, ...sponsors, ...sponsors];

  return (
    <Box
      sx={{
        backgroundColor: "#e3f8f1",
        padding: { xs: "20px 0", md: "35px 0 50px 0" },
      }}
    >
      <Container
        maxWidth={false}
        disableGutters
        className="home-section-container"
      >
        {/* Section Header */}
        <Box
          sx={{
            textAlign: "center",
            marginBottom: "10px",
            animation: `${fadeInAnimation} 0.8s ease-out`,
          }}
        >
          <Typography
            variant="h3"
            sx={{
              color: "#102d47",
              fontWeight: 600,
              marginBottom: 0,
              "@media (max-width: 600px)": {
                fontSize: "28px",
              },
            }}
          >
            Our Sponsors
          </Typography>
        </Box>

        {/* Horizontal Scrolling Container */}
        <Box
          sx={{
            overflow: "hidden",
            width: "100%",
            position: "relative",
          }}
        >
          <Box
            sx={{
              display: "flex",
              animation: "continuousScroll 20s linear infinite",
              gap: { xs: 1.5, sm: 2, md: 2 },
              "&:hover": {
                animationPlayState: "paused",
              },
            }}
          >
            {/* All Sponsors - Duplicated for seamless loop */}
            {allSponsors.map((sponsor, index) => (
              <Box
                key={`sponsor-${index}`}
                sx={{
                  flex: "0 0 auto",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: { xs: "10px", sm: "12px", md: "12px" },
                  backgroundColor: "#ffffff",
                  borderRadius: "8px",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                  transition: "all 0.3s ease",
                  width: { xs: 180, sm: 200, md: 220 },
                  height: { xs: "80px", sm: "90px", md: "100px" },
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
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
                        maxHeight: { xs: "60px", sm: "65px", md: "70px" },
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
                      maxHeight: { xs: "60px", sm: "65px", md: "70px" },
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
            ))}
          </Box>
        </Box>
      </Container>

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
    </Box>
  );
};

export default Sponsors;
