import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import XIcon from "@mui/icons-material/X";
import GoogleIcon from "@mui/icons-material/Google";
import { useNavigate } from "react-router-dom";
import pageHeaderImg from "../assets/images/about/page-header.jpg";
import personIcon from "../assets/images/team/person-icon.png";

// Board Members
import pranavImg from "../assets/images/team/1.jpg";
import sriyaImg from "../assets/images/team/volunteers/sriyakalyan.png";
import bharatImg from "../assets/images/team/BaharthPatel.png";
import andrewImg from "../assets/images/team/volunteers/Andrew.png";
import kalyanaImg from "../assets/images/team/Team/Kalyan.png";
import pawanImg from "../assets/images/team/volunteers/pawan.png";
import woodburyImg from "../assets/images/team/Team/JWoodbury.png";
import prabhaharanImg from "../assets/images/team/volunteers/Prabhaharan.png";
import ashokImg from "../assets/images/team/volunteers/Ashok.jpg";
import venodhaImg from "../assets/images/team/volunteers/vinotha.png";

// Advisory Board
import minitaImg from "../assets/images/team/Team/Minita.png";
import dianaImg from "../assets/images/team/Team/Diana.png";
import josephImg from "../assets/images/team/Team/JosephKeays.png";
import chitraImg from "../assets/images/team/Team/Chitra-2.png";

// Executive Team
import srinivasuImg from "../assets/images/team/volunteers/Srinivasu.png";
import swapnaImg from "../assets/images/team/volunteers/Swapna.jpg";
import sasikalaImg from "../assets/images/team/volunteers/Sasikala.png";
import anandImg from "../assets/images/team/volunteers/Anand.png";
import lisaImg from "../assets/images/team/Lisa.jpg";
import hussainImg from "../assets/images/team/volunteers/Hussain.jpg";
import visaImg from "../assets/images/volunteers/Visa.png";
import venugopalImg from "../assets/images/team/volunteers/Venugopal.png";
import amarpalImg from "../assets/images/team/volunteers/Amarpal.png";

// Student Board
import nayana from "../assets/images/team/volunteers/Nayana_Ashok_Photo.jpg";
import shrinidhi from "../assets/images/team/volunteers/Shrinidhi_Prabhaharan_Photo.jpg";
import ioneImg from "../assets/images/team/volunteers/Ione_Mclain.jpeg";
import baavikasaiImg from "../assets/images/team/volunteers/Baavikasai_B.jpeg";
import srihariImg from "../assets/images/team/volunteers/srihari.jpeg";
import syleshImg from "../assets/images/team/volunteers/Sylesh.jpg";
import justinImg from "../assets/images/team/volunteers/Justin.jpeg";
import nikkiImg from "../assets/images/team/volunteers/Nikki_Ranjit.jpeg";
import dakshinImg from "../assets/images/team/volunteers/DakshinSaravana.jpeg";
import sushantImg from "../assets/images/team/volunteers/Sushant.jpeg";
import roshiniImg from "../assets/images/team/volunteers/roshini.jpeg";
import joannaImg from "../assets/images/team/volunteers/JoannaSuresh.jpeg";
import jonathanzhuImg from "../assets/images/team/volunteers/Jonathanzhu.jpeg";
import bhavyaImg from "../assets/images/team/volunteers/BHAVYASHANMUGAM.jpg";
import avaImg from "../assets/images/team/volunteers/ava.jpg";
import shreyaImg from "../assets/images/team/volunteers/ShreyaMukherjee.jpeg";
import simranImg from "../assets/images/team/volunteers/Simran.jpeg";
import haridevImg from "../assets/images/team/volunteers/Haridev.jpg";
import swaytha from "../assets/images/team/volunteers/Swaytha.jpg";
import sumitaImg from "../assets/images/team/volunteers/SumitaEswaran.jpeg";
import aaravImg from "../assets/images/team/volunteers/Aaru.jpeg";
import "../styles/Leadership.css";

// Resolve filenames that contain spaces (Vite static import doesn't support spaces)
const smritiImg = new URL("../assets/images/team/volunteers/Smriti Chaudhury.jpeg", import.meta.url).href;
const shubhamImg = new URL("../assets/images/team/volunteers/Shubham Bhattacharya.jpeg", import.meta.url).href;
const srihariSatheeshImg = new URL("../assets/images/team/volunteers/Srihari Satheesh.jpeg", import.meta.url).href;

const Leadership = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const formatName = (name) => name;

  const MemberCard = ({ m, altText }) => (
    <Box className="leader-card">
      <Box className="leader-image">
        <img src={m.img} alt={altText || "Member"} />
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
      <Box className="leader-info">
        <Typography className="leader-name" variant="h6">
          {formatName(m.name)}
        </Typography>
        <Typography className="leader-role" variant="body2">
          {m.role}
        </Typography>
      </Box>
    </Box>
  );

  const SectionTitle = ({ children }) => (
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
      {children}
    </Typography>
  );

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
            sx={{
              fontSize: { xs: "2.2rem", md: "3.5rem" },
              fontWeight: 700,
              mb: 2,
            }}
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
                {" "}
                About Us &gt;{" "}
              </Typography>
            </Box>
            <Box component="li" sx={{ display: "inline-block" }}>
              <Typography component="span" sx={{ color: "white" }}>
                {" "}
                Leadership{" "}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* AMC Board Members */}
      <Container
        maxWidth="lg"
        sx={{ py: { xs: 3, md: 6 }, px: { xs: 2, md: 4 } }}
      >
        <SectionTitle>AMC Board Members</SectionTitle>
        <Box className="leaders-grid">
          {[
            { img: pranavImg, name: "PRANAV KALYAN", role: "Founder and President" },
            { img: sriyaImg, name: "SRIYA KALYAN", role: "Chief Executive Officer" },
            { img: bharatImg, name: "DR. BHARAT PATEL", role: "Director" },
            { img: andrewImg, name: "ANDREW XU", role: "Director" },
            { img: kalyanaImg, name: "KALYAN", role: "Director" },
            { img: pawanImg, name: "PAWAN DUBEY", role: "Director" },
            { img: woodburyImg, name: "JONATHAN WOODBURY", role: "Director" },
            { img: prabhaharanImg, name: "PRABHAHARAN R", role: "Director" },
            { img: personIcon, name: "ASHOK RAJADURAI", role: "Treasurer" },
            { img: venodhaImg, name: "VENODHA SUNDARESAN", role: "Director" },
          ].map((m) => (
            <MemberCard key={m.name} m={m} altText="Board Member" />
          ))}
        </Box>
      </Container>

      {/* AMC Advisory Board Members */}
      <Container
        maxWidth="lg"
        sx={{ py: { xs: 3, md: 5 }, px: { xs: 2, md: 4 } }}
      >
        <SectionTitle>AMC Advisory Board Members</SectionTitle>
        <Box className="leaders-grid">
          {[
            { img: minitaImg, name: "MINITA CLARK", role: "ECRCHS" },
            { img: dianaImg, name: "DIANA NGUYEN", role: "Moorpark" },
            { img: josephImg, name: "JOSEPH KEAYS", role: "Agoura High" },
            { img: chitraImg, name: "CHITRA JAYARAMAN", role: "Bank Of America" },
          ].map((m) => (
            <MemberCard key={m.name} m={m} altText="Advisory Member" />
          ))}
        </Box>
      </Container>

      {/* AMC Executive Team */}
      <Container
        maxWidth="lg"
        sx={{ py: { xs: 3, md: 6 }, px: { xs: 2, md: 4 } }}
      >
        <SectionTitle>AMC Executive Team</SectionTitle>
        <Box className="leaders-grid">
          {[
            { img: kalyanaImg, name: "KALYAN", role: "Chief Operations Officer" },
            { img: pawanImg, name: "PAWAN DUBEY", role: "EVP, Math Circle" },
            { img: prabhaharanImg, name: "PRABHAHARAN R", role: "EVP, Online Math Circle" },
            { img: srinivasuImg, name: "SRINIVASU B", role: "EVP, Document Management" },
            { img: venugopalImg, name: "VENUGOPAL", role: "EVP, Event Management" },
            { img: swapnaImg, name: "SWAPNA MADHAN", role: "EVP, Satellite Program" },
            { img: sasikalaImg, name: "SASIKALA", role: "EVP, Social Media" },
            { img: anandImg, name: "ANAND VINAYAGAM", role: "EVP, Standardized Test Prep" },
            { img: lisaImg, name: "LISA GUO", role: "EVP, Triangular Talks" },
            { img: hussainImg, name: "HUSSIAN PATEL", role: "EVP, Information Technology" },
            { img: personIcon, name: "ASHOK RAJADURAI", role: "EVP, Finance" },
            { img: visaImg, name: "VISALAKSHI KASI", role: "EVP, Competitive Math & Admin" },
            { img: swaytha, name: "SWAYTHA RAVIKUMAR", role: "EVP, Student Board Operation" },
            { img: sumitaImg, name: "SUMITA ESWARAN", role: "EVP, Student Board Operation" },
            { img: amarpalImg, name: "AMARPAL SINGH", role: "EVP, Engineering Circle" },
            { img: personIcon, name: "SANGEETHA", role: "SVP, Online Operations" },
            { img: personIcon, name: "KESAV", role: "SVP, Online Operations" },
            { img: personIcon, name: "JOSHNA JUDE", role: "SVP, Online Operations" },
            { img: personIcon, name: "THANUSHRI", role: "SVP, Online Operations" },
            { img: personIcon, name: "VIBUSHA VADIVEL", role: "SVP, Engineering Circle" },
            { img: personIcon, name: "BHAYVYA SHANMUGAM", role: "SVP, Test Preparation" },
            { img: personIcon, name: "MUGIL SHANMUGAM", role: "SVP, Test Preparation" },
          ].map((m) => (
            <MemberCard key={m.name} m={m} altText="Executive Team Member" />
          ))}
        </Box>
      </Container>

      {/* AMC Student Board */}
      <Container
        maxWidth="lg"
        sx={{ py: { xs: 3, md: 6 }, px: { xs: 2, md: 4 } }}
      >
        <SectionTitle>AMC Student Board</SectionTitle>
        <Box className="leaders-grid">
          {[
            { img: nayana, name: "NAYANA ASHOK", role: "Vice President, Operations - Onsite" },
            { img: smritiImg, name: "SMRITI CHAUDHURY", role: "Assistant Vice President, Operations - Onsite" },
            { img: ioneImg, name: "IONE MCLAIN", role: "Vice President, Operations - Online" },
            { img: shrinidhi, name: "SHRINIDHI PRABHAHARAN", role: "Vice President, Operations - Online" },
            { img: srihariImg, name: "SRIHARI", role: "Vice President, Technology" },
            { img: syleshImg, name: "SYLESH SUNDARESAN", role: "Assistant Vice President, Technology" },
            { img: justinImg, name: "JUSTIN ZHANG", role: "Vice President, Content Management" },
            { img: nikkiImg, name: "NIKKI RANJIT", role: "Vice President, Content Management" },
            { img: jonathanzhuImg, name: "JONATHAN ZHU", role: "Vice President, Facility Management" },
            { img: srihariSatheeshImg, name: "SRIHARI SATHEESH", role: "Assistant Vice President, Facility Management" },
            { img: sushantImg, name: "SUSHANT CHERUKURI", role: "Assistant Vice President, Media" },
            { img: shubhamImg, name: "SHUBHAM BHATTACHARYA", role: "Officer, Media" },
            { img: aaravImg, name: "AARAV SAVANI", role: "Assistant Vice President, Finance" },
            { img: dakshinImg, name: "DAKSHIN SARAVANA", role: "Assistant Vice President, Finance" },
            { img: personIcon, name: "DIYA RAVIKUMAR", role: "Officer, Event Management" },
            { img: personIcon, name: "YAZHINI VADIVEL", role: "Officer, Event Management" },
            { img: baavikasaiImg, name: "BAAVIKASAI BALASUBRAMANIAM", role: "Assistant Vice President, Marketing" },
            { img: personIcon, name: "DHARSHANA GOPINATH", role: "Officer, Marketing" },
            { img: simranImg, name: "SIMRAN KAUR", role: "Vice President, Engineering Circle" },
            { img: haridevImg, name: "HARIDEV PONSWAMINATHAN", role: "Officer, Engineering Circle" },
            { img: personIcon, name: "ETHAN SUH", role: "Officer, Engineering Circle" },
            { img: avaImg, name: "AVA SHAMSABADI", role: "Assistant Vice President, Triangular Talks" },
            { img: shreyaImg, name: "SHREYA MUKHERJEE", role: "Assistant Vice President, Triangular Talks" },
            { img: personIcon, name: "SASHANK VINOTH", role: "Vice President, Test Preparation" },
            { img: personIcon, name: "YALINI SARAVANAN", role: "Officer, Test Preparation" },
          ].map((m) => (
            <MemberCard key={m.name} m={m} altText="Student Board Member" />
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Leadership;
