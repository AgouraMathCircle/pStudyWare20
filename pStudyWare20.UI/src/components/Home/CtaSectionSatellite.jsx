import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Container,
  keyframes,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import satelliteLogoImg from "../../assets/images/about/Satellite_logo.jpg";
import triangularTalksLogoImg from "../../assets/images/talk/Triangular-Talks-Logo.png";
import ctaBgImage from "../../assets/images/bg/cta-bg.jpg";
// Import images from src/assets
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
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

const CtaSectionSatellite = () => {
  return (
    <>
      {/* Second CTA Section - Satellite Program and Triangular Talks */}
      <Box
        className="cta-section cta-section-primary"
        sx={{
          backgroundImage: `url(${ctaBgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          width: "100%",
          margin: 0,
          paddingTop: { xs: "8px", sm: "10px", md: "12px" },
          paddingBottom: { xs: "8px", sm: "10px", md: "12px" },
        }}
      >
        <Container
          maxWidth={false}
          disableGutters
          className="home-section-container"
        >
          <Box
            className="cta-primary-layout"
            sx={{
              animation: `${fadeInAnimation} 0.8s ease-out`,
            }}
          >
            <Grid
              container
              spacing={{ xs: 2, sm: 3, md: 4 }}
              alignItems="stretch"
              justifyContent="space-evenly"
              sx={{ width: "100%" }}
            >
              {/* Satellite Program */}
              <Grid
                item
                xs={12}
                sm={4}
                md={4}
                lg={4}
                sx={{ margin: 0 }}
              >
                <Box
                  sx={{
                    textAlign: "center",
                    animation: `${fadeInAnimation} 0.8s ease-out`,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-evenly",
                    minHeight: { xs: "auto", sm: "300px", md: "320px" },
                    padding: { xs: "12px", sm: "10px", md: "12px" },
                    gap: { xs: "12px", sm: "10px", md: "12px" },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      component="img"
                      src={satelliteLogoImg}
                      alt="Satellite Program"
                      sx={{
                        width: { xs: "180px", sm: "160px", md: "200px" },
                        height: { xs: "100px", sm: "90px", md: "115px" },
                        borderRadius: "10px",
                        objectFit: "contain",
                        display: "block",
                        margin: "0 auto",
                        marginBottom: { xs: "8px", sm: "6px", md: "8px" },
                      }}
                    />
                    <Typography
                      variant="h5"
                      sx={{
                        color: "#ffffff",
                        fontWeight: 600,
                        textDecoration: "none",
                        fontSize: { xs: "1.1rem", sm: "1.05rem", md: "1.25rem" },
                        marginBottom: 0,
                      }}
                    >
                      Start your own club
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      gap: { xs: 1, sm: 1 },
                      justifyContent: "center",
                      flexWrap: "wrap",
                      marginTop: { xs: "8px", sm: "6px", md: "8px" },
                    }}
                  >
                    <Button
                      variant="contained"
                      endIcon={<ArrowForwardIcon />}
                      href="/satellite-program"
                      component="a"
                      sx={{
                        backgroundColor: "#53b50a",
                        color: "#ffffff",
                        padding: { xs: "6px 12px", sm: "6px 10px", md: "8px 16px" },
                        borderRadius: "3px",
                        textTransform: "capitalize",
                        fontWeight: 600,
                        fontSize: { xs: "0.8rem", sm: "0.75rem", md: "0.85rem" },
                        transition: "all 0.3s ease",
                        "&:hover": {
                          backgroundColor: "transparent",
                          border: "2px solid #ffffff",
                          color: "#ffffff",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      Learn More
                    </Button>
                    <Button
                      variant="outlined"
                      endIcon={<ArrowForwardIcon />}
                      href="https://docs.google.com/forms/d/e/1FAIpQLSee8eQUL8tt0Iygl_-ocQ9c4fzO3F3VwfIrPRlwXBFZ2XVfBA/viewform?usp=pp_url"
                      component="a"
                      target="_blank"
                      sx={{
                        borderColor: "#53b50a",
                        backgroundColor: "#53b50a",
                        color: "#ffffff",
                        padding: { xs: "6px 12px", sm: "6px 10px", md: "8px 16px" },
                        borderRadius: "3px",
                        textTransform: "capitalize",
                        fontWeight: 600,
                        fontSize: { xs: "0.8rem", sm: "0.75rem", md: "0.85rem" },
                        transition: "all 0.3s ease",
                        "&:hover": {
                          borderColor: "#ffffff",
                          backgroundColor: "transparent",
                          color: "#ffffff",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      Register Now
                    </Button>
                  </Box>
                </Box>
              </Grid>

              {/* YouTube Video */}
              <Grid
                item
                xs={12}
                sm={4}
                md={4}
                lg={4}
                sx={{ margin: 0 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    animation: `${fadeInAnimation} 0.8s ease-out 0.2s both`,
                    height: "100%",
                    minHeight: { xs: "auto", sm: "300px", md: "320px" },
                    padding: { xs: "12px", sm: "10px", md: "12px" },
                  }}
                >
                  <Box
                    component="iframe"
                    width="280"
                    height="280"
                    src="https://www.youtube.com/embed/qdNXuaToB1M?enablejsapi=1&rel=0&modestbranding=1"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    sx={{
                      borderRadius: "8px",
                      width: "100%",
                      maxWidth: { xs: "100%", sm: "220px", md: "260px", lg: "280px" },
                      height: { xs: "200px", sm: "180px", md: "220px", lg: "260px" },
                    }}
                  />
                </Box>
              </Grid>

              {/* Triangular Talks */}
              <Grid
                item
                xs={12}
                sm={4}
                md={4}
                lg={4}
                sx={{ margin: 0 }}
              >
                <Box
                  sx={{
                    textAlign: "center",
                    animation: `${fadeInAnimation} 0.8s ease-out 0.4s both`,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-evenly",
                    minHeight: { xs: "auto", sm: "300px", md: "320px" },
                    padding: { xs: "12px", sm: "10px", md: "12px" },
                    gap: { xs: "12px", sm: "10px", md: "12px" },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      component="img"
                      src={triangularTalksLogoImg}
                      alt="Triangular Talks"
                      sx={{
                        width: { xs: "180px", sm: "160px", md: "200px" },
                        height: { xs: "100px", sm: "90px", md: "115px" },
                        borderRadius: "10px",
                        objectFit: "contain",
                        display: "block",
                        margin: "0 auto",
                        marginBottom: { xs: "8px", sm: "6px", md: "8px" },
                      }}
                    />
                    <Typography
                      variant="h5"
                      sx={{
                        color: "#ffffff",
                        fontWeight: 600,
                        textDecoration: "none",
                        fontSize: { xs: "1.1rem", sm: "1.05rem", md: "1.25rem" },
                        marginBottom: 0,
                      }}
                    >
                      Coming Soon!!
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      gap: { xs: 1, sm: 1 },
                      justifyContent: "center",
                      flexWrap: "wrap",
                      marginTop: { xs: "8px", sm: "6px", md: "8px" },
                    }}
                  >
                    <Button
                      variant="contained"
                      endIcon={<ArrowForwardIcon />}
                      href="http://triangulartalks.org/"
                      component="a"
                      target="_blank"
                      sx={{
                        backgroundColor: "#53b50a",
                        color: "#ffffff",
                        padding: { xs: "6px 12px", sm: "6px 10px", md: "8px 16px" },
                        borderRadius: "3px",
                        textTransform: "capitalize",
                        fontWeight: 600,
                        fontSize: { xs: "0.8rem", sm: "0.75rem", md: "0.85rem" },
                        transition: "all 0.3s ease",
                        "&:hover": {
                          backgroundColor: "transparent",
                          border: "2px solid #ffffff",
                          color: "#ffffff",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      Learn More
                    </Button>
                    <Button
                      variant="outlined"
                      endIcon={<PlayArrowIcon />}
                      href="https://us06web.zoom.us/j/3215897076"
                      component="a"
                      target="_blank"
                      sx={{
                        borderColor: "#53b50a",
                        backgroundColor: "#53b50a",
                        color: "#ffffff",
                        padding: { xs: "6px 12px", sm: "6px 10px", md: "8px 16px" },
                        borderRadius: "3px",
                        textTransform: "capitalize",
                        fontWeight: 600,
                        fontSize: { xs: "0.8rem", sm: "0.75rem", md: "0.85rem" },
                        transition: "all 0.3s ease",
                        "&:hover": {
                          borderColor: "#ffffff",
                          backgroundColor: "transparent",
                          color: "#ffffff",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      Join the Meeting
                    </Button>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default CtaSectionSatellite;
