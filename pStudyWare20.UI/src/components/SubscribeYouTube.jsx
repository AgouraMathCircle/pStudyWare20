// src/components/Home/SubscribeYouTube.jsx
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

  return (
    <Box sx={{ backgroundColor: "#e6f4f1", py: { xs: 6, md: 8 } }}>
      <Container maxWidth="lg">
        {/* Horizontal Scrolling Container */}
        <Box
          sx={{
            overflow: "hidden",
            mb: 6,
            width: "100%",
            position: "relative",
          }}
        >
          <Box
            sx={{
              display: "flex",
              animation: "slideAndWait 8s infinite",
              gap: { xs: 2, sm: 3, md: 4 },
              "&:hover": {
                animationPlayState: "paused",
              },
            }}
          >
            {/* First Set - Videos 1,2,3 */}
            {firstSet.map((video, index) => (
              <Card
                key={`first-${index}`}
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
                    paddingBottom: "56.25%",
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

            {/* Second Set - Videos 4,5,6 */}
            {secondSet.map((video, index) => (
              <Card
                key={`second-${index}`}
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
                    paddingBottom: "56.25%",
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
        <Box sx={{ textAlign: "center" }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              color: "#1c3d5a",
              mb: 3,
              fontSize: { xs: "1.75rem", md: "2.125rem" },
            }}
          >
            Subscribe YouTube for More Course Videos
          </Typography>
          <Button
            variant="contained"
            href="https://www.youtube.com/c/AgouraMathCircle"
            target="_blank"
            endIcon={<ArrowForwardIcon />}
            sx={{
              backgroundColor: "#76b900",
              color: "#fff",
              fontWeight: "bold",
              py: 1.5,
              px: 4,
              fontSize: "1.1rem",
              borderRadius: "8px",
              textTransform: "none",
              "&:hover": { backgroundColor: "#1c3d5a" },
            }}
          >
            Subscribe Our Channel
          </Button>
        </Box>
      </Container>

      {/* CSS Keyframes */}
      <style>
        {`
          @keyframes slideAndWait {
            /* Show first set (1,2,3) */
            0%, 25% {
              transform: translateX(0);
            }
            /* Slide to second set (4,5,6) */
            35%, 60% {
              transform: translateX(-50%);
            }
            /* Slide back to first set (1,2,3) */
            70%, 100% {
              transform: translateX(0);
            }
          }
        `}
      </style>
    </Box>
  );
};

export default SubscribeYouTube;
