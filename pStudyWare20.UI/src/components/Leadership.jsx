import React from "react";
import { Box, Typography, Button, Container, Grid } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import GoogleIcon from "@mui/icons-material/Google";
import { useNavigate } from "react-router-dom";
import pageHeaderImg from "../assets/images/about/page-header.jpg";
import personIcon from "../assets/images/team/person-icon.png";
import sriyaImg from "../assets/images/team/2.jpg";
import andrewImg from "../assets/images/team/3.jpg";
import kalyanaImg from "../assets/images/team/Team/Kalyan.png";
import pawanImg from "../assets/images/team/volunteers/Pawan.jpg";
import woodburyImg from "../assets/images/team/Team/JWoodbury.png";
import prabhaharanImg from "../assets/images/team/volunteers/Prabhaharan.png";
import ashokImg from "../assets/images/team/Team/Ashok.png";
import venodhaImg from "../assets/images/team/volunteers/Vinodha.jpg";
import minitaImg from "../assets/images/team/Team/Minita.png";
import dianaImg from "../assets/images/team/Team/Diana.png";
import josephImg from "../assets/images/team/Team/JosephKeays.png";
import chitraImg from "../assets/images/team/Team/Chitra-2.png";
import karthikImg from "../assets/images/volunteers/Karthik.png";
import deniseImg from "../assets/images/team/Denise.jpg";
import srinivasuImg from "../assets/images/team/volunteers/Srinivasu.png";
import gopiImg from "../assets/images/team/volunteers/Gopi.jpg";
import swapnaImg from "../assets/images/team/volunteers/Swapna.jpg";
import anandImg from "../assets/images/team/volunteers/Anand.png";
import lisaImg from "../assets/images/team/Lisa.jpg";
import harshadhaImg from "../assets/images/team/Harshadha.jpg";
import ashokRajendranImg from "../assets/images/team/volunteers/Ashok.jpg";
import austinLawImg from "../assets/images/team/Team/AustinLaw.png";
import joshnaImg from "../assets/images/team/Team/Joshna.png";
import charlieImg from "../assets/images/team/volunteers/charlie.png";
import mugilImg from "../assets/images/team/volunteers/mugil.jpg";
import vaibhavImg from "../assets/images/team/volunteers/Vaibhav.png";
import monishkaImg from "../assets/images/team/volunteers/Monishka.png";
import pranavImg from "../assets/images/team/1.jpg";
import bharatImg from "../assets/images/team/BaharthPatel.png";
import visaImg from "../assets/images/volunteers/Visa.png";
import "../styles/Leadership.css";

const Leadership = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const formatName = (name) => {
    const parts = name.split(" ");
    if (name.length > 14 && parts.length > 1) {
      return (
        <>
          <span>{parts[0]}</span>
          <br />
          <span>{parts.slice(1).join(" ")}</span>
        </>
      );
    }
    return name;
  };

  return (
    <Box className="leadership-page">
      <Box className="sc-breadcrumbs breadcrumbs-overlay">
        <Box className="breadcrumbs-img">
          <img src={pageHeaderImg} alt="Breadcrumbs" />
        </Box>
        <Box className="breadcrumbs-text white-color">
          <Typography
            variant="h1"
            className="page-title"
            sx={{ fontSize: { xs: "2.2rem", md: "3.5rem" }, fontWeight: 700, mb: 2 }}
          >
            Leadership
          </Typography>
          <Box
            component="ul"
            sx={{
              listStyle: "none",
              p: 0,
              m: 0,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box component="li" sx={{ display: "inline-block" }}>
              <Button
                onClick={() => handleNavigation("/")}
                sx={{
                  color: "white",
                  textDecoration: "none",
                  p: 0,
                  minWidth: "auto",
                  fontSize: "inherit",
                  textTransform: "none",
                  "&:hover": { textDecoration: "none" },
                }}
              >
                Home &gt;
              </Button>
            </Box>
            <Box component="li" sx={{ display: "inline-block" }}>
              <Typography component="span" sx={{ color: "white" }}>
                {" "} About Us &gt; {" "}
              </Typography>
            </Box>
            <Box component="li" sx={{ display: "inline-block" }}>
              <Typography component="span" sx={{ color: "white" }}>
                {" "} Leadership {" "}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 6 }, px: { xs: 2, md: 4 } }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            fontSize: { xs: "1.9rem", md: "2.2rem" },
            color: "#002855",
            textAlign: "center",
            mb: 3,
          }}
        >
          AMC Board Members
        </Typography>

        <Grid container spacing={2} justifyContent="flex-start" alignItems="stretch">
          {[ 
            { img: pranavImg, name: "PRANAV KALYAN", role: "Director" },
            { img: sriyaImg, name: "SRIYA KALYAN", role: "Director" },
            { img: bharatImg, name: "DR. BHARAT PATEL", role: "Director" },
            { img: andrewImg, name: "ANDREW XU", role: "Director" },
            { img: kalyanaImg, name: "KALYANA KUMAR M", role: "Director" },
            { img: pawanImg, name: "PAWAN DUBEY", role: "Director" },
            { img: woodburyImg, name: "JONATHAN WOODBURY", role: "Director" },
            { img: prabhaharanImg, name: "PRABHAHARAN R", role: "Director" },
            { img: ashokImg, name: "ASHOK RAJADURAI", role: "Treasurer" },
            { img: venodhaImg, name: "VENODHA SUNDARESAN", role: "Director" },
          ].map((m) => (
            <Grid key={m.name} item xs={12} sm={3} md={3}>
              <Box className="leader-card">
                <Box className="leader-image">
                  <img src={m.img} alt="Board Member" />
                  <Box className="social-overlay">
                    <Box className="social-icon">
                      <FacebookIcon />
                    </Box>
                    <Box className="social-icon">
                      <GoogleIcon />
                    </Box>
                    <Box className="social-icon">
                      <TwitterIcon />
                    </Box>
                    <Box className="social-icon">
                      <LinkedInIcon />
                    </Box>
                  </Box>
                </Box>
                <Box className="leader-info">
                  <Typography className="leader-name" variant="h6">
                    {formatName(m.name)}
                  </Typography>
                  <Typography className="leader-role" variant="body2">
                    {m.role}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

      </Container>

      

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 }, px: { xs: 2, md: 4 } }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            fontSize: { xs: "1.9rem", md: "2.2rem" },
            color: "#002855",
            textAlign: "center",
            mb: 3,
          }}
        >
          AMC Advisory Board Members
        </Typography>

        <Grid container spacing={2} justifyContent="flex-start" alignItems="stretch">
          {[
            { img: minitaImg, name: "MINITA CLARK", role: "ECRCHS" },
            { img: dianaImg, name: "DIANA NGUYEN", role: "Moorpark" },
            { img: josephImg, name: "JOSEPH KEAYS", role: "Agoura High" },
            { img: chitraImg, name: "CHITRA JAYARAMAN", role: "Bank Of America" },
            { img: karthikImg, name: "KARTHIK REDDY", role: "Key Software" },
            { img: deniseImg, name: "DENISE RATIU", role: "Hale Charter" },
          ].map((m) => (
            <Grid key={m.name} item xs={12} sm={3} md={3}>
              <Box className="leader-card">
                <Box className="leader-image">
                  <img src={m.img} alt="Advisory Member" />
                  <Box className="social-overlay">
                    <Box className="social-icon">
                      <FacebookIcon />
                    </Box>
                    <Box className="social-icon">
                      <GoogleIcon />
                    </Box>
                    <Box className="social-icon">
                      <TwitterIcon />
                    </Box>
                    <Box className="social-icon">
                      <LinkedInIcon />
                    </Box>
                  </Box>
                </Box>
                <Box className="leader-info">
                  <Typography className="leader-name" variant="h6">
                    {m.name}
                  </Typography>
                  <Typography className="leader-role" variant="body2">
                    {m.role}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

       <Container maxWidth="lg" sx={{ py: { xs: 3, md: 6 }, px: { xs: 2, md: 4 } }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            fontSize: { xs: "1.9rem", md: "2.2rem" },
            color: "#002855",
            textAlign: "center",
            mb: 3,
          }}
        >
          AMC Executive Team
        </Typography>

        <Grid container spacing={2} justifyContent="flex-start" alignItems="stretch">
          {[
            { img: kalyanaImg, name: "KALYANA KUMAR M", role: "Chief Operations Officer" },
            { img: pawanImg, name: "PAWAN DUBEY", role: "EVP, Math Circle" },
            { img: prabhaharanImg, name: "PRABHAHARAN R", role: "EVP, Online Math Circle" },
            { img: srinivasuImg, name: "SRINIVASU B", role: "EVP, Online Math Circle" },
            { img: gopiImg, name: "GOPINATH SRINIVASAN", role: "EVP, Engineering Circle" },
            { img: ashokRajendranImg, name: "ASHOK RAJENDRAN", role: "EVP, Document Management" },
            { img: swapnaImg, name: "SWAPNA MADHAN", role: "EVP, Satellite Program" },
            { img: venodhaImg, name: "VENODHA S", role: "EVP, Social Media" },
            { img: anandImg, name: "ANAND VINAYAGAM", role: "EVP, Standardized Test Prep" },
            { img: lisaImg, name: "LISA GUO", role: "EVP, Triangular Talks" },
            { img: harshadhaImg, name: "HARSHADHA MADIRAJU", role: "EVP, Information Technology" },
            { img: ashokImg, name: "ASHOK RAJADURAI", role: "EVP, Finance" },
            { img: visaImg, name: "VISALAKSHI KASI", role: "EVP, Competitive Math & Admin" },
          ].map((m) => (
            <Grid key={m.name} item xs={12} sm={3} md={3}>
              <Box className="leader-card">
                <Box className="leader-image">
                  <img src={m.img} alt="Board Member" />
                  <Box className="social-overlay">
                    <Box className="social-icon">
                      <FacebookIcon />
                    </Box>
                    <Box className="social-icon">
                      <GoogleIcon />
                    </Box>
                    <Box className="social-icon">
                      <TwitterIcon />
                    </Box>
                    <Box className="social-icon">
                      <LinkedInIcon />
                    </Box>
                  </Box>
                </Box>
                <Box className="leader-info">
                  <Typography className="leader-name" variant="h6">
                    {formatName(m.name)}
                  </Typography>
                  <Typography className="leader-role" variant="body2">
                    {m.role}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

    
      </Container>
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 6 }, px: { xs: 2, md: 4 } }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            fontSize: { xs: "1.9rem", md: "2.2rem" },
            color: "#002855",
            textAlign: "center",
            mb: 3,
          }}
        >
          AMC Student Board
        </Typography>

        <Grid container spacing={2} justifyContent="flex-start" alignItems="stretch">
          {[
            { img: vaibhavImg, name: "VAIBHAV GARG", role: "Senior Vice President" },
            { img: austinLawImg, name: "AUSTIN LAW", role: "Senior Vice President" },
            { img: joshnaImg, name: "JOSHNA JUDE", role: "Senior Vice President" },
            { img: charlieImg, name: "CHARLIE NICKS", role: "Senior Vice President" },
            { img: mugilImg, name: "MUGIL", role: "Senior Vice President" },
            { img: monishkaImg, name: "MONISHKA TANWANI", role: "Senior Vice President" },
          ].map((m) => (
            <Grid key={m.name} item xs={12} sm={3} md={3}>
              <Box className="leader-card">
                <Box className="leader-image">
                  <img src={m.img} alt="Student Board Member" />
                  <Box className="social-overlay">
                    <Box className="social-icon">
                      <FacebookIcon />
                    </Box>
                    <Box className="social-icon">
                      <GoogleIcon />
                    </Box>
                    <Box className="social-icon">
                      <TwitterIcon />
                    </Box>
                    <Box className="social-icon">
                      <LinkedInIcon />
                    </Box>
                  </Box>
                </Box>
                <Box className="leader-info">
                  <Typography className="leader-name" variant="h6">
                    {formatName(m.name)}
                  </Typography>
                  <Typography className="leader-role" variant="body2">
                    {m.role}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>


    </Box>
  );
};

export default Leadership;
