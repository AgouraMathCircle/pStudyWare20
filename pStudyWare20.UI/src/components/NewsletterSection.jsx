import React from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  TextField,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import "../styles/NewsletterSection.css";

const NewsletterSectionBox = styled(Box)(({ theme }) => ({
  padding: "40px 50px",
  borderBottom: "2px solid rgba(255, 255, 255, 0.2)",
  background: "linear-gradient(135deg, #1c3d5a 0%, #2a5a8a 100%)",
  borderRadius: "8px",
  position: "relative",
  zIndex: 50,
  transform: "translateY(-80px)",
  overflow: "visible",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",

  [theme.breakpoints.down("md")]: {
    padding: "30px 20px",
    marginTop: "30px",
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

const NewsletterSection = () => {
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription logic here
    console.log("Newsletter subscription submitted");
  };

  return (
    <Container
      maxWidth={false}
      disableGutters
      className="home-section-container"
    >
      <NewsletterSectionBox>
        <Grid container alignItems="center" spacing={4}>
          <Grid item xs={12} lg={6}>
            <Typography
              variant="h3"
              sx={{
                color: "#ffffff",
                fontSize: { xs: "32px", md: "39px" },
                lineHeight: 1.2,
                fontWeight: 600,
                marginBottom: "15px",
                textAlign: { xs: "center", lg: "left" },
              }}
            >
              Subscribe Our Newsletter
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#ffffff",
                fontSize: { xs: "14px", md: "16px" },
                textAlign: { xs: "center", lg: "left" },
                opacity: 0.95,
                lineHeight: 1.5,
              }}
            >
              subscribe with us to know the updates and news about our classes
            </Typography>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Box
              sx={{
                display: "flex",
                justifyContent: { xs: "center", lg: "flex-end" },
                width: "100%",
              }}
            >
              <NewsletterForm onSubmit={handleNewsletterSubmit}>
                <NewsletterInput
                  type="email"
                  name="email"
                  placeholder="E-mail Address"
                  required
                  fullWidth
                />
                <NewsletterButton type="submit" variant="contained">
                  Subscribe →
                </NewsletterButton>
              </NewsletterForm>
            </Box>
          </Grid>
        </Grid>
      </NewsletterSectionBox>
    </Container>
  );
};

export default NewsletterSection;