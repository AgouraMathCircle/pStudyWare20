import React from "react";
import { Box, Typography, Container, Grid, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import XIcon from "@mui/icons-material/X";
import GoogleIcon from "@mui/icons-material/Google";
import pageHeaderImg from "../assets/images/about/page-header.jpg";
import personIcon from "../assets/images/team/person-icon.png";
import srinivasuImg from "../assets/images/team/volunteers/Srinivasu.png";
import jaimeImg from "../assets/images/team/volunteers/Jaime.png";
import venugopalImg from "../assets/images/team/volunteers/Venugopal.png";
import sharonImg from "../assets/images/team/volunteers/Sharon.png";
import rajImg from "../assets/images/team/volunteers/RajDenduluri.png";
import sasikalaImg from "../assets/images/team/volunteers/Sasikala.png";
import farzanehImg from "../assets/images/team/volunteers/Farzaneh.png";
import ashokImg from "../assets/images/team/volunteers/Ashok.jpg";
import sindhuImg from "../assets/images/team/volunteers/Sindhu.jpg";
import anandImg from "../assets/images/team/volunteers/Anand.png";
import veenaImg from "../assets/images/team/volunteers/Veena.png";
import madhaviImg from "../assets/images/team/volunteers/Madhavi.jpg";
import sundaresanImg from "../assets/images/team/volunteers/Sundaresan.png";
import sujataImg from "../assets/images/team/volunteers/Sujata.jpg";
import sireeshaImg from "../assets/images/team/volunteers/Sireesha.jpg";
import adhunikaImg from "../assets/images/team/volunteers/Adhunika.jpg";
import gopiImg from "../assets/images/team/volunteers/Gopi.jpg";
import anneImg from "../assets/images/team/volunteers/Anne.jpg";
import elyImg from "../assets/images/team/volunteers/Ely.jpg";
import sathyaImg from "../assets/images/team/volunteers/Sathya.png";
import srihariImg from "../assets/images/team/volunteers/srihari.jpeg";
import vaibhavTechImg from "../assets/images/team/volunteers/Vaibhav.png";
import haridevImg from "../assets/images/team/volunteers/Haridev.jpg";
import nayanaImg from "../assets/images/team/volunteers/Nayana_Ashok_Photo.jpg";
import harshaImg from "../assets/images/team/volunteers/Harsha Mullangi.jpg";
import shreyamImg from "../assets/images/team/volunteers/SHREYAM.jpg";
import prabakaranImg from "../assets/images/team/prabakaran.jpg";
import jonesImg from "../assets/images/team/volunteers/Jones.jpg";
import suhaImg from "../assets/images/team/volunteers/Suha.jpg";
import syleshImg from "../assets/images/team/volunteers/Sylesh.jpg";
import ValliImg from "../assets/images/team/volunteers/Kanagavalli_Mani.jpeg";
import UshaImg from "../assets/images/team/volunteers/Usha_Sekar.jpg";

import hussainImg from "../assets/images/team/volunteers/Hussain.jpg";
import "../styles/OurTeam.css";

const OurTeam = () => {
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
    <Box className="ourteam-page">
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
            Our Team
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
                About Us &gt;
              </Typography>
            </Box>
            <Box component="li" sx={{ display: "inline-block" }}>
              <Typography component="span" sx={{ color: "white" }}>Our Team</Typography>
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
          Technology Team
        </Typography>

        <Grid container spacing={2} justifyContent="flex-start" alignItems="stretch">
          {[
            { img: hussainImg, name: "HUSSAIN PATEL", role: "EVP Technology Executive" },
            { img: sathyaImg, name: "SATHYA", role: "SVP Software Engineer" },
            { img: srihariImg, name: "SRI HARI", role: "VP Software Engineer" },
            { img: ValliImg, name: "KANAGAVALLI MANI", role: "Service delivery manager" },
            { img: UshaImg, name: "USHA", role: "QA manager" },
            { img: syleshImg, name: "SYLESH SUNDARESAN", role: "Developer" },
            { img: jonesImg, name: "JONES", role: "Developer" },
            { img: harshaImg, name: "HARSHA MULLANGI", role: "Developer" },
            { img: personIcon, name: "RADHIKA", role: "Developer" },
            //{ img: haridevImg, name: "HARIDEV", role: "Developer" },
            //{ img: personIcon, name: "DHARSHANA", role: "Developer" },
          ].map((m) => (
            <Grid key={m.name} item xs={12} sm={3} md={3}>
              <Box className="ourteam-card">
                <Box className="ourteam-image">
                  <img src={m.img} style={{aspectRatio: "1/1", objectFit: "cover"}} alt="Technology Team Member" />
                  <Box className="social-overlay">
                    <Box className="social-icon">
                      <FacebookIcon />
                    </Box>
                    <Box className="social-icon">
                      <GoogleIcon />
                    </Box>
                    <Box className="social-icon">
                      <XIcon />
                    </Box>
                    <Box className="social-icon">
                      <LinkedInIcon />
                    </Box>
                  </Box>
                </Box>
                <Box className="ourteam-info">
                  <Typography className="ourteam-name" variant="h6">
                    {formatName(m.name)}
                  </Typography>
                  <Typography className="ourteam-role" variant="body2">
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
         Our Team

        </Typography>

        <Grid container spacing={2} justifyContent="flex-start" alignItems="stretch">
          {[
            { img: srinivasuImg, name: "SRINIVASU", role: "Vice President" },
            { img: jaimeImg, name: "JAIME GOODWIN", role: "Vice President" },
            { img: venugopalImg, name: "VENUGOPAL", role: "Vice President" },
            { img: sharonImg, name: "SHARON", role: "Vice President" },
            { img: rajImg, name: "RAJ", role: "Vice President" },
            { img: sasikalaImg, name: "SASIKALA", role: "Vice President" },
            { img: farzanehImg, name: "FARZANEH SEINI", role: "Vice President" },
            { img: ashokImg, name: "ASHOK RAJENDRAN", role: "Vice President" },
            { img: sindhuImg, name: "SINDHU SREERAJ", role: "Vice President" },
            { img: anandImg, name: "ANAND", role: "Vice President" },
            { img: veenaImg, name: "VEENA GANESAN", role: "Vice President" },
            { img: madhaviImg, name: "MADHAVI SOMYSETTY", role: "Vice President" },
            { img: sundaresanImg, name: "SUNDARESAN", role: "Vice President" },
            { img: sujataImg, name: "SUJATA BHATTACHARYA", role: "Vice President" },
            { img: sireeshaImg, name: "SIREESHA CHINTALAPATI", role: "Vice President" },
            { img: suhaImg, name: "SUHASINI YENDAMURI", role: "Vice President" },
            { img: gopiImg, name: "GOPINATH SRINIVASAN", role: "Vice President" },
            { img: anneImg, name: "SRI ANNE", role: "Vice President" },
            { img: elyImg, name: "ELY TJIPTO", role: "Vice President" },
          ].map((m) => (
            <Grid key={m.name} item xs={12} sm={3} md={3}>
              <Box className="ourteam-card">
                <Box className="ourteam-image">
                  <img src={m.img} style={{aspectRatio: "1/1", objectFit: "cover"}} alt=" Team Member" />
                  <Box className="social-overlay">
                    <Box className="social-icon">
                      <FacebookIcon />
                    </Box>
                    <Box className="social-icon">
                      <GoogleIcon />
                    </Box>
                    <Box className="social-icon">
                      <XIcon />
                    </Box>
                    <Box className="social-icon">
                      <LinkedInIcon />
                    </Box>
                  </Box>
                </Box>
                <Box className="ourteam-info">
                  <Typography className="ourteam-name" variant="h6">
                    {formatName(m.name)}
                  </Typography>
                  <Typography className="ourteam-role" variant="body2">
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

export default OurTeam;
