import React from "react";
import { useLocation } from "react-router-dom";
import {
  Facebook,
  Twitter,
  YouTube,
  LinkedIn,
  Instagram,
  LocationOn,
  Email,
} from "@mui/icons-material";
import { Box, Typography, Container, Grid, Link } from "@mui/material";
import { styled } from "@mui/material/styles";

// Import images from src/assets
import arrow8Img from "../assets/images/arrow-8.png";
import arrow9Img from "../assets/images/arrow-9.png";
import arrow3Img from "../assets/images/arrow-3.png";
import arrow7Img from "../assets/images/arrow-7.png";

import Newsletter from "./Newsletter";
// Styled components for custom styling
const StyledFooter = styled(Box)(({ theme }) => ({
  color: "#eee",
  position: "relative",
  background: "linear-gradient(135deg, #102d47 0%, #1e3c72 100%)",
  paddingTop: "0px",
  zIndex: 1,
  [theme.breakpoints.down("md")]: {
    paddingTop: "80px",
  },
  [theme.breakpoints.down("sm")]: {
    paddingTop: "60px",
  },
}));

const FooterContent = styled(Box)(({ theme }) => ({
  paddingTop: "05px",
  [theme.breakpoints.down("md")]: {
    paddingTop: "10px",
  },
  [theme.breakpoints.down("sm")]: {
    paddingTop: "10px",
  },
}));

const FooterWidget = styled(Box)(({ theme }) => ({
  margin: "05px 0px",
  [theme.breakpoints.down("md")]: {
    margin: "10px 0",
  },
}));

const WidgetTitle = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  fontSize: "1.5rem",
  marginBottom: "20px",
  color: "#fff",
}));

const WidgetMenu = styled("ul")(({ theme }) => ({
  listStyle: "none",
  padding: 0,
  margin: 0,
  "& li": {
    marginBottom: "10px",
    "& a": {
      color: "#aeaeae",
      textDecoration: "none",
      transition: "color 0.3s ease",
      "&:hover": {
        color: "#53b50a",
      },
    },
  },
}));

const AddressWidget = styled("ul")(({ theme }) => ({
  listStyle: "none",
  padding: 0,
  margin: 0,
  "& li": {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    marginBottom: "16px",
    "& .MuiSvgIcon-root": {
      color: "#7fff00",
      marginTop: "2px",
    },
    "& .desc": {
      color: "#aeaeae",
      lineHeight: 1.4,
    },
    "& a": {
      color: "#aeaeae",
      textDecoration: "none",
      transition: "color 0.3s ease",
      "&:hover": {
        color: "#7fff00",
      },
    },
  },
}));

const FooterSocial = styled("ul")(({ theme }) => ({
  listStyle: "none",
  padding: 0,
  margin: "20px 0 0 0",
  display: "flex",
  gap: "16px",
  "& li": {
    "& a": {
      color: "#fff",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "45px",
      height: "45px",
      borderRadius: "50%",
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      fontSize: "20px",
      "&:hover": {
        color: "#7fff00",
        backgroundColor: "rgba(127, 255, 0, 0.2)",
        transform: "scale(1.1)",
      },
    },
  },
}));

const FooterBottom = styled(Box)(({ theme }) => ({
  borderTop: "1px solid rgba(255, 255, 255, 0.1)",
  padding: "20px 0",
  backgroundColor: "rgba(0, 0, 0, 0.2)",
}));

const CopyrightMenu = styled("ul")(({ theme }) => ({
  listStyle: "none",
  padding: 0,
  margin: 0,
  display: "flex",
  justifyContent: "flex-end",
  [theme.breakpoints.down("md")]: {
    justifyContent: "center",
    marginTop: "10px",
  },
  "& li": {
    "& a": {
      color: "#aeaeae",
      textDecoration: "none",
      transition: "color 0.3s ease",
      "&:hover": {
        color: "#53b50a",
      },
    },
  },
}));

const AnimatedArrow = styled(Box)(({ theme }) => ({
  position: "absolute",
  "&.animated-arrow-1": {
    top: "20%",
    left: "5%",
    animation: "leftRight 3s ease-in-out infinite",
  },
  "&.animated-arrow-2": {
    top: "40%",
    right: "10%",
    animation: "upDown 4s ease-in-out infinite",
  },
  "&.animated-arrow-3": {
    bottom: "30%",
    left: "15%",
    animation: "upDown 3.5s ease-in-out infinite",
  },
  "&.animated-arrow-4": {
    bottom: "20%",
    right: "5%",
    animation: "leftRight 4.5s ease-in-out infinite",
  },
  "@keyframes leftRight": {
    "0%, 100%": { transform: "translateX(0)" },
    "50%": { transform: "translateX(20px)" },
  },
  "@keyframes upDown": {
    "0%, 100%": { transform: "translateY(0)" },
    "50%": { transform: "translateY(-20px)" },
  },
}));

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <>
      <StyledFooter
        component="footer"
        id="sc-footer"
        sx={(theme) => ({
          paddingTop: isHomePage ? "120px" : "40px",
          [theme.breakpoints.down("md")]: {
            paddingTop: isHomePage ? "80px" : "30px",
          },
          [theme.breakpoints.down("sm")]: {
            paddingTop: isHomePage ? "60px" : "20px",
          },
        })}
      >
        {isHomePage && <Newsletter />}
        <Container
          maxWidth={false}
          disableGutters
          className="home-section-container"
        >
          <FooterContent>
            <Grid container spacing={3} justifyContent="space-between">
              <Grid item xs={12} lg={4}>
                <FooterWidget>
                  <WidgetTitle variant="h4">
                    AMC SEMESTER SCHEDULE- PST
                  </WidgetTitle>
                  <WidgetMenu
                    sx={{
                      "& li a": {
                        color: "#53b50a",
                      },
                    }}
                  >
                    <li>
                      <Link href="#" underline="none">
                        SEMESTER: FALL AND SPRING
                      </Link>
                    </li>
                    <li>
                      <Link href="#" underline="none">
                        MATH CIRCLE: ALTERNATE SATURDAY 2 PM TO 5 PM
                      </Link>
                    </li>
                    <li>
                      <Link href="#" underline="none">
                        ENGINEERING CIRCLE: ALTERNATE SATURDAY 9 AM TO 11 AM
                      </Link>
                    </li>
                    <li>
                      <Link href="#" underline="none">
                        SAT/PSAT: ALTERNATE SUNDAY 1 PM TO 3 PM
                      </Link>
                    </li>
                    <li>
                      <Link href="#" underline="none">
                        ACT: ALTERNATE SUNDAY 1 PM TO 3 PM
                      </Link>
                    </li>
                  </WidgetMenu>
                </FooterWidget>
              </Grid>
              <Grid item xs={12} lg={4}>
                <FooterWidget>
                  <WidgetTitle variant="h4">CLASS LOCATION</WidgetTitle>
                  <WidgetMenu
                    sx={{
                      "& li a": {
                        color: "#53b50a",
                      },
                    }}
                  >
                    <li>
                      <Link href="#" underline="none">
                        MATH CIRCLE:ONSITE (AGOURA)
                      </Link>
                    </li>
                    <li>
                      <Link href="#" underline="none">
                        MATH CIRCLE:VIRTUAL TRAINING
                      </Link>
                    </li>
                    <li>
                      <Link href="#" underline="none">
                        ENGINEERING CIRCLE: VIRTUAL TRAINING
                      </Link>
                    </li>
                    <li>
                      <Link href="#" underline="none">
                        SAT/PSAT : VIRTUAL TRAINING
                      </Link>
                    </li>
                    <li>
                      <Link href="#" underline="none">
                        ACT: VIRTUAL TRAINING
                      </Link>
                    </li>
                  </WidgetMenu>
                </FooterWidget>
              </Grid>
              <Grid item xs={12} lg={4}>
                <FooterWidget>
                  <WidgetTitle variant="h4">Contact Info</WidgetTitle>
                  <AddressWidget
                    sx={{
                      "& li .desc": {
                        color: "#ffffff",
                      },
                      "& li a": {
                        color: "#ffffff",
                      },
                    }}
                  >
                    <li>
                      <LocationOn />
                      <div className="desc">
                        Agoura Chapter
                        <br />
                        El Camino Real High School
                        <br />
                        5440 Valley Cir Blvd, Woodland Hills
                        <br />
                        CA 91367
                      </div>
                    </li>
                    <li>
                      <Email />
                      <Link
                        href="mailto:info@agouramathcircle.org"
                        underline="none"
                      >
                        info@agouramathcircle.org
                      </Link>
                    </li>
                  </AddressWidget>

                  <FooterSocial>
                    <li>
                      <Link
                        href="https://www.facebook.com/profile.php?id=100010784343153"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Facebook />
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="https://twitter.com/Agouramathcirle"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Twitter />
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="https://www.youtube.com/channel/UCWK2w-BVGps-Y9c08B5pRgA/videos"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <YouTube />
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="https://www.linkedin.com/in/agouramathcircle/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <LinkedIn />
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="https://www.instagram.com/agouramathcircle/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Instagram />
                      </Link>
                    </li>
                  </FooterSocial>
                </FooterWidget>
              </Grid>
            </Grid>
          </FooterContent>
        </Container>

        <FooterBottom>
          <Container
            maxWidth={false}
            disableGutters
            className="home-section-container"
          >
            <Grid
              container
              alignItems="center"
              spacing={2}
              justifyContent="space-between"
            >
              <Grid item xs={12} md={6}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#aeaeae",
                    textAlign: { xs: "center", md: "left" },
                  }}
                >
                  © Copyright 2015-{currentYear} Agoura Math Circle. All Rights
                  Reserved.
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: { xs: "center", md: "flex-end" },
                  }}
                >
                  <CopyrightMenu>
                    <li>
                      <Link href="/contact" underline="none">
                        Support
                      </Link>
                    </li>
                  </CopyrightMenu>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </FooterBottom>

        <AnimatedArrow className="animated-arrow-1">
          <img src={arrow8Img} alt="" />
        </AnimatedArrow>
        <AnimatedArrow className="animated-arrow-2">
          <img src={arrow9Img} alt="" />
        </AnimatedArrow>
        <AnimatedArrow className="animated-arrow-3">
          <img src={arrow3Img} alt="" />
        </AnimatedArrow>
        <AnimatedArrow className="animated-arrow-4">
          <img src={arrow7Img} alt="" />
        </AnimatedArrow>
      </StyledFooter>
    </>
  );
};

export default Footer;
