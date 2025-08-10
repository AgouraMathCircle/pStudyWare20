import React from "react";
import {
  Facebook,
  Twitter,
  YouTube,
  LinkedIn,
  Instagram,
  LocationOn,
  Email,
} from "@mui/icons-material";
import {
  Box,
  Typography,
  Container,
  Grid,
  TextField,
  Button,
  Link,
} from "@mui/material";
import { styled } from "@mui/material/styles";
// Arrow images moved to public/assets/images/
const arrow8 = "/assets/images/arrow-8.png";
const arrow9 = "/assets/images/arrow-9.png";
const arrow3 = "/assets/images/arrow-3.png";
const arrow7 = "/assets/images/arrow-7.png";

// Styled components for custom styling
const StyledFooter = styled(Box)(({ theme }) => ({
  color: "#eee",
  position: "relative",
  background: "linear-gradient(135deg, #102d47 0%, #1e3c72 100%)",
  paddingTop: 0,
  marginTop: 0,
}));

const NewsletterSection = styled(Box)(({ theme }) => ({
  padding: "65px 0 60px",
  borderBottom: "2px solid rgba(255, 255, 255, 0.2)",
  background: "linear-gradient(135deg, #53b50a 0%, #4a7c59 100%)",
  borderRadius: "8px",
  position: "relative",
  top: "-110px",
  marginBottom: "-50px",
  paddingLeft: "50px",
  paddingRight: "50px",
  [theme.breakpoints.down("md")]: {
    paddingLeft: "20px",
    paddingRight: "20px",
  },
}));

const NewsletterForm = styled("form")(({ theme }) => ({
  maxWidth: "498px",
  margin: "0 0 0 auto",
  position: "relative",
  display: "flex",
  [theme.breakpoints.down("md")]: {
    margin: "20px auto 0",
  },
}));

const NewsletterInput = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    height: "60px",
    borderRadius: "5px 0 0 5px",
    backgroundColor: "#fff",
    "& fieldset": {
      border: "none",
    },
    "& input": {
      padding: "10px 18px",
      color: "#102d47",
    },
  },
}));

const NewsletterButton = styled(Button)(({ theme }) => ({
  height: "60px",
  background: "#1c2337",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: 600,
  padding: "10px 27px",
  borderRadius: "0 4px 4px 0",
  textTransform: "none",
  "&:hover": {
    background: "#53b50a",
  },
}));

const FooterContent = styled(Box)(({ theme }) => ({
  padding: "62px 0 70px",
  [theme.breakpoints.down("md")]: {
    padding: "20px 0",
  },
}));

const FooterWidget = styled(Box)(({ theme }) => ({
  margin: "40px 0px",
  [theme.breakpoints.down("md")]: {
    margin: "20px 0",
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
      transition: "color 0.3s ease",
      "&:hover": {
        color: "#7fff00",
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
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription logic here
    console.log("Newsletter subscription submitted");
  };

  return (
    <StyledFooter component="footer" id="sc-footer">
      <Container>
        <NewsletterSection>
          <Grid container alignItems="center" spacing={3}>
            <Grid item xs={12} lg={6}>
              <Typography
                variant="h3"
                sx={{
                  color: "#ffffff",
                  fontSize: "39px",
                  lineHeight: 1,
                  fontWeight: 600,
                  marginBottom: 0,
                  textAlign: { xs: "center", lg: "left" },
                  textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                }}
              >
                Subscribe Our Newsletter
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#ffffff",
                  marginTop: "15px",
                  textAlign: { xs: "center", lg: "left" },
                  opacity: 0.9,
                }}
              >
                subscribe with us to know the updates and news about our classes
              </Typography>
            </Grid>
            <Grid item xs={12} lg={6}>
              <Box sx={{ textAlign: { xs: "center", lg: "right" } }}>
                <NewsletterForm onSubmit={handleNewsletterSubmit}>
                  <NewsletterInput
                    type="email"
                    name="email"
                    placeholder="E-mail Address"
                    required
                    fullWidth
                  />
                  <NewsletterButton type="submit" variant="contained">
                    Subscribe
                  </NewsletterButton>
                </NewsletterForm>
              </Box>
            </Grid>
          </Grid>
        </NewsletterSection>

        <FooterContent>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={5}>
              <FooterWidget>
                <WidgetTitle variant="h4">
                  AMC SEMESTER SCHEDULE- PST
                </WidgetTitle>
                <WidgetMenu>
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
                <WidgetMenu>
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
            <Grid item xs={12} lg={3}>
              <FooterWidget>
                <WidgetTitle variant="h4">Contact Info</WidgetTitle>
                <AddressWidget>
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
        <Container>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="body2"
                sx={{
                  color: "#aeaeae",
                  textAlign: { xs: "center", md: "left" },
                }}
              >
                © Copyright 2015-2024 Agoura Math Circle. All Rights Reserved.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <CopyrightMenu>
                <li>
                  <Link href="ContactUs.aspx" underline="none">
                    Support
                  </Link>
                </li>
              </CopyrightMenu>
            </Grid>
          </Grid>
        </Container>
      </FooterBottom>

      <AnimatedArrow className="animated-arrow-1">
        <img src={arrow8} alt="" />
      </AnimatedArrow>
      <AnimatedArrow className="animated-arrow-2">
        <img src={arrow9} alt="" />
      </AnimatedArrow>
      <AnimatedArrow className="animated-arrow-3">
        <img src={arrow3} alt="" />
      </AnimatedArrow>
      <AnimatedArrow className="animated-arrow-4">
        <img src={arrow7} alt="" />
      </AnimatedArrow>
    </StyledFooter>
  );
};

export default Footer;
