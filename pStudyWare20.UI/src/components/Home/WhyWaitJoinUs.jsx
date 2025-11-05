import React from "react";
import {
  Box,
  Typography,
  Container,
  Card,
  Button,
  Grid,
  keyframes,
} from "@mui/material";

import studentImg from "../../assets/images/about/11.jpg";
import volunteersImg from "../../assets/images/about/12.jpg";
import schoolsImg from "../../assets/images/about/Satellite_logo_About.png";
import donateImg from "../../assets/images/about/13.png";

import counterBg2Img from "../../assets/images/bg/counter-bg2.jpg";
import arrow2Img from "../../assets/images/arrow-2.png";
import arrow3Img from "../../assets/images/arrow-3.png";
import arrow4Img from "../../assets/images/arrow-4.png";
import arrow5Img from "../../assets/images/arrow-5.png";

const upDownAnimation = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
`;

const leftRightAnimation = keyframes`
  0%, 100% { transform: translateX(0px); }
  50% { transform: translateX(-20px); }
`;

const cardData = [
  {
    title: "For Students",
    image: studentImg,
    buttonText: "Register",
    link: "/register-student",
  },
  {
    title: "For Volunteers",
    image: volunteersImg,
    buttonText: "Register",
    link: "/register-volunteer",
  },
  {
    title: "For Schools",
    image: schoolsImg,
    buttonText: "More",
    link: "/schools",
  },
  {
    title: "Donate",
    image: donateImg,
    buttonText: "Donate",
    link: "/donate",
  },
];

const JoinUs = () => {
  return (
    <Box
      sx={{
        backgroundImage: `url(${counterBg2Img})`,
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        py: { xs: 3, md: 5 },
        position: "relative",
        overflow: "hidden",
        borderTop: "3px solid #40c1ec",
        borderBottom: "3px solid #40c1ec",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Animated Arrows (optional, same as before) */}
      <Box
        component="img"
        src={arrow5Img}
        alt="Animated Arrow"
        sx={{
          position: "absolute",
          top: "15%",
          left: "8%",
          animation: `${leftRightAnimation} 3s ease-in-out infinite`,
          "@media (max-width: 768px)": { display: "none" },
        }}
      />
      <Box
        component="img"
        src={arrow2Img}
        alt="Animated Arrow"
        sx={{
          position: "absolute",
          top: "25%",
          right: "12%",
          animation: `${upDownAnimation} 3s ease-in-out infinite`,
          "@media (max-width: 768px)": { display: "none" },
        }}
      />
      <Box
        component="img"
        src={arrow4Img}
        alt="Animated Arrow"
        sx={{
          position: "absolute",
          bottom: "25%",
          left: "4%",
          animation: `${upDownAnimation} 3s ease-in-out infinite 1s`,
          "@media (max-width: 768px)": { display: "none" },
        }}
      />
      <Box
        component="img"
        src={arrow3Img}
        alt="Animated Arrow"
        sx={{
          position: "absolute",
          bottom: "15%",
          right: "8%",
          animation: `${leftRightAnimation} 3s ease-in-out infinite 1.5s`,
          "@media (max-width: 768px)": { display: "none" },
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
        {/* Heading */}
        <Box sx={{ textAlign: "center", mb: 5 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: "bold",
              color: "#ffffff",
              fontSize: { xs: "2rem", md: "3rem" },
              mb: 1,
              textShadow: "2px 2px 8px rgba(0,0,0,0.3)",
            }}
          >
            Why Wait? Join Us!
          </Typography>
          <Typography
            sx={{
              color: "rgba(255,255,255,0.9)",
              maxWidth: "800px",
              mx: "auto",
              fontSize: "1.1rem",
              lineHeight: 1.6,
              textShadow: "1px 1px 4px rgba(0,0,0,0.3)",
            }}
          >
            Joining Agoura Math Circle offers numerous learning opportunities for
            students, volunteers, schools, and donors tailored to their interests.
          </Typography>
        </Box>

        {/* Centered Cards Grid */}
        <Grid
          container
          spacing={4}
          justifyContent="center"
          alignItems="stretch"
        >
          {cardData.map((card) => (
            <Grid
              item
              key={card.title}
              xs={12}
              sm={6}
              md={3}
              display="flex"
              justifyContent="center"
            >
              <Card
                sx={{
                  backgroundColor: "#fff",
                  borderRadius: "14px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                  textAlign: "center",
                  p: 2,
                  width: "100%",
                  maxWidth: 280,
                  transition: "all 0.3s ease",
                  border: "1px solid rgba(64, 193, 236, 0.1)",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 16px 48px rgba(0,0,0,0.25)",
                    border: "1px solid rgba(64, 193, 236, 0.3)",
                  },
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "bold",
                    color: "#1c3d5a",
                    mb: 2,
                    fontSize: { xs: "1.2rem", md: "1.3rem" },
                  }}
                >
                  {card.title}
                </Typography>

                <Box
                  sx={{
                    width: "100%",
                    height: "130px",
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    borderRadius: "10px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                >
                  <Box
                    component="img"
                    src={card.image}
                    alt={card.title}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.3s ease",
                      "&:hover": { transform: "scale(1.05)" },
                    }}
                  />
                </Box>

                <Button
                  variant="contained"
                  href={card.link}
                  sx={{
                    backgroundColor: "#4CAF50",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "1rem",
                    py: 1.2,
                    px: 3,
                    borderRadius: "8px",
                    textTransform: "capitalize",
                    boxShadow: "0 4px 12px rgba(76,175,80,0.3)",
                    "&:hover": {
                      backgroundColor: "#45a049",
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 16px rgba(76,175,80,0.4)",
                    },
                  }}
                >
                  {card.buttonText}
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default JoinUs;
