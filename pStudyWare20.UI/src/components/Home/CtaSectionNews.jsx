import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  keyframes,
  IconButton,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import ctaBgImage2 from "../../assets/images/bg/cta-bg2.jpg";
import "../../styles/Home/CtaSection.css";

const AUTOPLAY_MS = 5000;

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

const newsItems = [
  {
    subtitle: "Agoura Math Circle",
    title: "Triangular Talks - Coming Soon!",
  },
  {
    subtitle: "Math Circle",
    title: "AMC Fall semester starts on 29 Aug, 2026",
  },
  {
    subtitle: "Agoura Engineering Circle",
    title:
      "Mobile App Development and Artificial Intelligence courses start on Aug 29, 2026",
  },
  {
    subtitle: "Satellite Program",
    title: "Want to start your own club? Join our Satellite Program.",
  },
];

const CtaSectionNews = () => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const totalSlides = newsItems.length;

  useEffect(() => {
    setIndex((i) => (i >= totalSlides ? 0 : i));
  }, [totalSlides]);

  useEffect(() => {
    if (paused || totalSlides <= 1) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % totalSlides);
    }, AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [paused, totalSlides]);

  const next = () => setIndex((i) => (i + 1) % totalSlides);
  const prev = () => setIndex((i) => (i - 1 + totalSlides) % totalSlides);

  const item = newsItems[index];

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
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            sx={{ position: "relative", width: "100%" }}
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
                minHeight: 120,
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
                {item.subtitle}
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
                {item.title}
              </Typography>
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
    </>
  );
};

export default CtaSectionNews;
