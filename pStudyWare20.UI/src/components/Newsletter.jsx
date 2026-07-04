import React, { useEffect, useState } from "react";
import { Box, Typography, Container, Grid } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import footerSubscribeBgImg from "../assets/images/bg/footer-subscribe-bg.jpg";
import newsletterService from "../services/newsletterService";
import { getNewsletterStatusClass } from "../utils/newsletterStatus";
import "../styles/Newsletter.css";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!statusMessage) return undefined;

    const timer = setTimeout(() => {
      setStatusMessage("");
      setIsError(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [statusMessage]);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage("");
    setIsError(false);
    setIsSubmitting(true);

    try {
      const response = await newsletterService.subscribe(email);

      if (response?.isSuccess) {
        setStatusMessage(
          response.message || "Thank you for subscribing!"
        );
        setEmail("");
      } else {
        setIsError(true);
        setStatusMessage(
          response?.errorMessage ||
            "Unable to subscribe. Please try again."
        );
      }
    } catch (error) {
      setIsError(true);
      setStatusMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container
      maxWidth={false}
      disableGutters
      className="home-section-container"
    >
      <Box
        className="footer-newsletter subscribe-bg-image"
        sx={{
          backgroundImage: `url(${footerSubscribeBgImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} lg={6} className="md-text-center">
            <Typography
              variant="h3"
              className="title white-color mb-0"
              sx={{
                fontSize: { xs: "24px", md: "28px", lg: "39px" },
                lineHeight: 1,
                fontWeight: 600,
                color: "#ffffff",
                marginBottom: 0,
                textAlign: { xs: "center", lg: "left" },
              }}
            >
              Subscribe To Our Newsletter
            </Typography>
            <Typography
              variant="body1"
              className="des"
              sx={{
                color: "#eee",
                marginTop: "15px",
                fontSize: { xs: "14px", md: "16px" },
                lineHeight: 1.5,
                textAlign: { xs: "center", lg: "left" },
              }}
            >
              subscribe with us to know the updates and news about our classes
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            lg={6}
            className="text-right md-text-center"
            sx={{
              display: "flex",
              justifyContent: { xs: "center", lg: "flex-end" },
              alignItems: "center",
            }}
          >
            <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                name="email"
                placeholder="E-mail Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
              />
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Subscribing..." : "Subscribe"}{" "}
                <ArrowForward className="arrow-icon" />
              </button>
              {statusMessage && (
                <div
                  className={`newsletter-status ${getNewsletterStatusClass(
                    statusMessage,
                    isError
                  )}`}
                >
                  {statusMessage}
                </div>
              )}
            </form>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Newsletter;
