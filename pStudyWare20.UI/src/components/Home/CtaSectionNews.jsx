import React, { useState, useEffect } from "react";
import { Box, Typography, Container, keyframes } from "@mui/material";

import ctaBgImage2 from "../../assets/images/bg/cta-bg2.jpg";
import "../../styles/Home/CtaSection.css";

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

const CtaSectionNews = () => {
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const newsItems = [
    {
      subtitle: "Agoura Math Circle",
      title: "Triangular Talks - April 30, 2025",
    },
    {
      subtitle: "Math Circle",
      title: "AMC Fall semester starts on 23 Aug,2025",
    },
    {
      subtitle: "Agoura Engineering Circle",
      title:
        "Mobile App Development and Artificial Intelligence courses start on Aug 23, 2025",
    },
    {
      subtitle: "Satellite Program",
      title: "Want to start your own club? Join our Satellite Program.",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNewsIndex((prev) => (prev + 1) % newsItems.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [newsItems.length]);

  return (
    <>
      {/* Third CTA Section - News Carousel */}
      <Box
        className="cta-section cta-section-primary"
        sx={{
          backgroundImage: `url(${ctaBgImage2})`,
          width: "100%",
          backgroundRepeat: "repeat",
          margin: "10px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Container
          maxWidth={false}
          disableGutters
          className="home-section-container"
          sx={{
            margin: "0 auto",
            maxWidth: "calc(100% - 20px)",
          }}
        >
          <Box
            sx={{
              textAlign: "center",
              animation: `${fadeInAnimation} 0.8s ease-out`,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: "#40c1ec",
                marginBottom: "10px",
                fontWeight: 600,
                position: "relative",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: "-5px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "50px",
                  height: "2px",
                  backgroundColor: "#40c1ec",
                },
              }}
            >
              {newsItems[currentNewsIndex].subtitle}
            </Typography>
            <Typography
              variant="h4"
              sx={{
                color: "#102d47",
                fontWeight: 500,
                lineHeight: 1.2,
                "@media (max-width: 600px)": {
                  fontSize: "24px",
                },
              }}
            >
              {newsItems[currentNewsIndex].title}
            </Typography>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default CtaSectionNews;
