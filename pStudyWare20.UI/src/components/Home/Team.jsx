import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  useTheme,
  useMediaQuery,
  keyframes,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
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

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const itemsPerSlide = isMobile ? 1 : 3;
  const totalSlides = useMemo(
    () => Math.ceil(teamMembers.length / itemsPerSlide),
    [itemsPerSlide, teamMembers.length]
  );

  useEffect(() => {
    setIndex((i) => (i >= totalSlides ? 0 : i));
  }, [totalSlides]);

  useEffect(() => {
    if (paused || totalSlides <= 1) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(t);
  }, [paused, totalSlides]);

  const next = () => setIndex((i) => (i + 1) % totalSlides);
  const prev = () => setIndex((i) => (i - 1 + totalSlides) % totalSlides);

  const slice = teamMembers.slice(
    index * itemsPerSlide,
    index * itemsPerSlide + itemsPerSlide
  );

  return (
    <Box
      sx={{
        backgroundColor: "#d5e8e2",
        padding: { xs: "20px 0", md: "20px 0" },
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container
        maxWidth={false}
        disableGutters
        className="home-section-container"
        sx={{ width: "100%" }}
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
            variant="h6"
            sx={{
              color: "#40c1ec",
              fontWeight: 700,
              marginBottom: "10px",
              textTransform: "uppercase",
            }}
          >
            Team
          </Typography>
          <Typography
            variant="h4"
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

        {/* Team Members Carousel (same as Sponsors) */}
        <Box
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          sx={{
            overflow: "hidden",
            width: "100%",
            position: "relative",
            animation: `${fadeInAnimation} 0.8s ease-out 0.2s both`,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: { xs: 2, sm: 2.5, md: 3 },
              flexWrap: "wrap",
              minHeight: 400,
            }}
          >
            {slice.map((member, i) => (
              <Card
                key={`team-${member.id}-${index}-${i}`}
                sx={{
                  flex: "0 0 auto",
                  width: {
                    xs: 300,
                    sm: 340,
                    md: 380,
                  },
                  backgroundColor: "#ffffff",
                  borderRadius: "5px",
                  overflow: "hidden",
                  boxShadow: "0px 0px 16px rgba(4, 59, 80, 0.1)",
                  transition: "all 0.5s ease",
                  height: "100%",
                  animation: `${fadeInAnimation} 0.6s ease-out ${
                    i * 0.1
                  }s both`,
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
                    height: { xs: "280px", sm: "320px", md: "360px" },
                    width: "100%",
                    objectFit: "contain",
                    backgroundColor: "#f5f5f5",
                    border: "5px solid rgb(255, 255, 255)",
                    boxShadow:
                      "8px 8px 24px rgba(0, 0, 0, 0.4), 4px 4px 12px rgba(0, 0, 0, 0.3), 2px 2px 6px rgba(0, 0, 0, 0.2)",
                  }}
                />
                <CardContent
                  sx={{
                    padding: "20px",
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
                      fontSize: { xs: "16px", sm: "17px", md: "18px" },
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
                      fontSize: { xs: "12px", sm: "13px", md: "14px" },
                      fontWeight: 500,
                    }}
                  >
                    {member.role}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>

          {totalSlides > 1 && (
            <>
              <IconButton
                onClick={prev}
                sx={{
                  position: "absolute",
                  left: { xs: -8, sm: -48 },
                  top: "50%",
                  transform: "translateY(-50%)",
                  bgcolor: "rgba(255,255,255,0.9)",
                  "&:hover": { bgcolor: "white" },
                  boxShadow: 1,
                }}
              >
                <ChevronLeftIcon />
              </IconButton>
              <IconButton
                onClick={next}
                sx={{
                  position: "absolute",
                  right: { xs: -8, sm: -48 },
                  top: "50%",
                  transform: "translateY(-50%)",
                  bgcolor: "rgba(255,255,255,0.9)",
                  "&:hover": { bgcolor: "white" },
                  boxShadow: 1,
                }}
              >
                <ChevronRightIcon />
              </IconButton>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 0.5,
                  mt: 2,
                }}
              >
                {Array.from({ length: totalSlides }).map((_, i) => (
                  <Box
                    key={i}
                    onClick={() => setIndex(i)}
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: index === i ? "primary.main" : "grey.400",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </Box>
            </>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default Team;
