import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  keyframes,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
// Import images from src/assets
import teamMember1 from "../../assets/images/team/1.jpg";
import teamMember2 from "../../assets/images/team/2.jpg";
import teamMember13 from "../../assets/images/team/13.png";
import teamMember3 from "../../assets/images/team/3.jpg";
import teamMember8 from "../../assets/images/team/8.jpg";
import teamMemberCharlie from "../../assets/images/team/volunteers/charlie.png";
import teamMember4 from "../../assets/images/team/4.jpg";
import teamMember5 from "../../assets/images/team/5.jpg";
import teamMember6 from "../../assets/images/team/6.jpg";
import teamMemberMugil from "../../assets/images/team/volunteers/mugil.jpg";

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

const Team = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const teamMembers = [
    {
      id: 1,
      name: "PRANAV KALYAN",
      role: "FOUNDER & PRESIDENT",
      image: teamMember1,
    },
    {
      id: 2,
      name: "SRIYA KALYAN",
      role: "CHIEF EXECUTIVE OFFICER",
      image: teamMember2,
    },
    {
      id: 3,
      name: "DR BHARAT PATEL",
      role: "DIRECTOR",
      image: teamMember13,
    },
    {
      id: 4,
      name: "ANDREW XU",
      role: "DIRECTOR",
      image: teamMember3,
    },
    {
      id: 5,
      name: "JOSHNA JUDE",
      role: "SENIOR VICE PRESIDENT",
      image: teamMember8,
    },
    {
      id: 6,
      name: "CHARLIE NICKS",
      role: "SENIOR VICE PRESIDENT",
      image: teamMemberCharlie,
    },
    {
      id: 7,
      name: "MINITA CLARKE",
      role: "ADVISORY BOARD",
      image: teamMember4,
    },
    {
      id: 8,
      name: "DIANA NGUYEN",
      role: "ADVISORY BOARD",
      image: teamMember5,
    },
    {
      id: 9,
      name: "JOSEPH KEAYS",
      role: "ADVISORY BOARD",
      image: teamMember6,
    },
    {
      id: 10,
      name: "MUGIL SHANMUGAM",
      role: "SENIOR VICE PRESIDENT",
      image: teamMemberMugil,
    },
  ];

  const membersPerView = 4;
  const totalSlides = Math.ceil(teamMembers.length / membersPerView);

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

  const getCurrentMembers = () => {
    const startIndex = currentIndex * membersPerView;
    const currentMembers = teamMembers.slice(
      startIndex,
      startIndex + membersPerView
    );

    // If we don't have exactly 4 members, fill with the first members to avoid blanks
    if (currentMembers.length < membersPerView) {
      const remainingSlots = membersPerView - currentMembers.length;
      const additionalMembers = teamMembers.slice(0, remainingSlots);
      return [...currentMembers, ...additionalMembers];
    }

    return currentMembers;
  };

  return (
    <Box
      sx={{
        backgroundColor: "#d5e8e2",
        padding: { xs: "40px 0", md: "80px 0" },
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="lg" sx={{ width: "100%" }}>
        {/* Section Header */}
        <Box
          sx={{
            textAlign: "center",
            marginBottom: { xs: "40px", md: "60px" },
            animation: `${fadeInAnimation} 0.8s ease-out`,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "#40c1ec",
              fontWeight: 600,
              marginBottom: "10px",
              textTransform: "uppercase",
            }}
          >
            Team
          </Typography>
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
            AMC Members
          </Typography>
        </Box>

        {/* Team Members Carousel */}
        <Box
          sx={{
            position: "relative",
            animation: `${fadeInAnimation} 0.8s ease-out 0.2s both`,
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {/* Team Members Grid */}
          <Grid container spacing={3} justifyContent="center">
            {getCurrentMembers().map((member, index) => (
              <Grid
                xs={12}
                sm={6}
                md={3}
                key={`${member.id}-${currentIndex}-${index}`}
              >
                <Card
                  sx={{
                    backgroundColor: "#ffffff",
                    borderRadius: "5px",
                    overflow: "hidden",
                    boxShadow: "0px 0px 16px rgba(4, 59, 80, 0.1)",
                    transition: "all 0.5s ease",
                    animation: `${fadeInAnimation} 0.8s ease-out ${
                      0.3 + index * 0.1
                    }s both`,
                    height: "100%",
                    "&:hover": {
                      transform: "translateY(-10px)",
                      boxShadow: "0px 8px 25px rgba(4, 59, 80, 0.15)",
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    image={member.image}
                    alt={member.name}
                    sx={{
                      height: "220px",
                      objectFit: "cover",
                    }}
                  />
                  <CardContent
                    sx={{
                      padding: "20px 20px 20px",
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#102d47",
                        fontWeight: 600,
                        marginBottom: "8px",
                        fontSize: "18px",
                        lineHeight: "1.3",
                        "&:hover": {
                          color: "#53b50a",
                        },
                      }}
                    >
                      {member.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#505050",
                        fontSize: "14px",
                        fontWeight: 500,
                      }}
                    >
                      {member.role}
                    </Typography>
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

export default Team;
