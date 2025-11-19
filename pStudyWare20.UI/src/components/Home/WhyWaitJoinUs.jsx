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

      <Container
        maxWidth={false}
        disableGutters
        className="home-section-container"
        sx={{ width: "100%", position: "relative", zIndex: 2 }}
      >
        {/* Heading */}
        <Box sx={{ textAlign: "center", mb: 2 }}>
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
              width: "100%",
              fontSize: { xs: "0.95rem", sm: "1rem", md: "1.1rem" },
              lineHeight: 1.6,
              textShadow: "1px 1px 4px rgba(0,0,0,0.3)",
              px: { xs: 2, sm: 0 },
            }}
          >
            Joining Agoura Math Circle offers numerous learning opportunities
            for students, volunteers, schools/educational institutions, and
            donors tailored to their diverse interests.
          </Typography>
        </Box>

        {/* Centered Cards Grid */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            flexWrap: { xs: "nowrap", sm: "wrap" },
            justifyContent: { xs: "center", sm: "space-between" },
            gap: { xs: "15px", sm: "15px", md: "20px" },
            width: "100%",
          }}
        >
          {cardData.map((card) => (
            <Box
              key={card.title}
              sx={{
                flex: { xs: "0 0 100%", sm: "0 0 calc(50% - 7.5px)", md: "0 0 calc(25% - 15px)", lg: "0 0 calc(25% - 15px)" },
                minWidth: 0,
                maxWidth: { xs: "100%", sm: "calc(50% - 7.5px)", md: "calc(25% - 15px)" },
              }}
            >
              <Card
                sx={{
                  backgroundColor: "#fff",
                  borderRadius: "14px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                  textAlign: "center",
                  p: { xs: 2, sm: 2.5, md: 3 },
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
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
                    mb: 0.5,
                    fontSize: { xs: "1.1rem", sm: "1.2rem", md: "1.35rem" },
                  }}
                >
                  {card.title}
                </Typography>

                <Box
                  sx={{
                    width: "100%",
                    height: { xs: "120px", sm: "140px", md: "160px", lg: "180px" },
                    mb: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    borderRadius: "0px",
                    border: { xs: "10px solid rgb(255, 255, 255)", sm: "12px solid rgb(255, 255, 255)", md: "15px solid rgb(255, 255, 255)" },
                    boxShadow: "8px 8px 24px rgba(0, 0, 0, 0.4), 4px 4px 12px rgba(0, 0, 0, 0.3)",
                    flex: 1,
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
                    backgroundColor: "#53b50a",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: { xs: "0.9rem", sm: "0.95rem", md: "1rem" },
                    py: { xs: 1, sm: 1.1, md: 1.2 },
                    px: { xs: 2.5, sm: 3, md: 3.5 },
                    borderRadius: "8px",
                    textTransform: "capitalize",
                    boxShadow: "0 4px 12px rgba(83,181,10,0.3)",
                    transition: "all 0.3s ease",
                    mt: "auto",
                    "&:hover": {
                      backgroundColor: "#000000",
                      color: "#ffffff",
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 16px rgba(0,0,0,0.4)",
                    },
                  }}
                >
                  {card.buttonText}
                </Button>
              </Card>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default JoinUs;
