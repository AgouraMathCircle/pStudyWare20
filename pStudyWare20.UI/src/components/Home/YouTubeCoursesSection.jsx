import React from "react";
import { Box, Container, Card, Button, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const videoData = [
  { id: "A6W75S2NBlg" },
  { id: "3QSSHMgz-cM" },
  { id: "NLrwZ0vIRoA" },
  { id: "gUF9luUuzUo" },
  { id: "y392WZHOvlo" },
  { id: "feb7_Byu-ng" },
];

const SubscribeYouTube = () => {
  // Create sets: first three and next three videos
  const firstSet = videoData.slice(0, 3); // Videos 1,2,3
  const secondSet = videoData.slice(3, 6); // Videos 4,5,6
  // Duplicate sets for continuous loop
  const allVideos = [...firstSet, ...secondSet, ...firstSet, ...secondSet];

  return (
    <Box sx={{ backgroundColor: "#e6f4f1", pt: "15px", pb: "10px" }}>
      <Container
        maxWidth={false}
        disableGutters
        className="home-section-container"
      >
        {/* Horizontal Scrolling Container */}
        <Box
          sx={{
            overflow: "hidden",
            mb: "5px",
            width: "100%",
            position: "relative",
          }}
        >
          <Box
            sx={{
              display: "flex",
              animation: "continuousScroll 20s linear infinite",
              gap: { xs: 1, sm: 1.5, md: 2 },
              "&:hover": {
                animationPlayState: "paused",
              },
            }}
          >
            {/* All Videos - Duplicated for seamless loop */}
            {allVideos.map((video, index) => (
              <Card
                key={`video-${index}`}
                sx={{
                  flex: "0 0 auto",
                  width: {
                    xs: 280,
                    sm: 300,
                    md: 320,
                  },
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                  border: "15px solid rgb(255, 255, 255)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
                  },
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    height: 0,
                    paddingBottom: "100%",
                  }}
                >
                  <iframe
                    src={`https://www.youtube.com/embed/${video.id}?enablejsapi=1&rel=0&modestbranding=1`}
                    title={`YouTube video ${video.id}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      border: 0,
                    }}
                  ></iframe>
                </Box>
              </Card>
            ))}
          </Box>
        </Box>

        {/* Call to Action */}
        <Box sx={{ textAlign: "center", pt: "15px" }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              color: "#1c3d5a",
              mb: 3,
              fontSize: { xs: "1.75rem", md: "2.125rem" },
              textAlign: "center",
            }}
          >
            Subscribe to YouTube for More Course Videos
          </Typography>
          <Button
            variant="contained"
            href="https://www.youtube.com/c/AgouraMathCircle"
            endIcon={<ArrowForwardIcon />}
            sx={{
              backgroundColor: "#53b50a",
              color: "#fff",
              fontWeight: "bold",
              py: 1.5,
              px: 4,
              fontSize: "1.1rem",
              borderRadius: "8px",
              textTransform: "none",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#000000",
                color: "#ffffff",
              },
            }}
          >
            Subscribe to Our Channel
          </Button>
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

export default SubscribeYouTube;
