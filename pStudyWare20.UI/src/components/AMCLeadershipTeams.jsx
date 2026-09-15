import React from "react";
import { Box, Typography, Container } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import XIcon from "@mui/icons-material/X";
import GoogleIcon from "@mui/icons-material/Google";

import personIcon from "../assets/images/team/person-icon.png";

// Board Members
import bharatImg from "../assets/images/team/BaharthPatel.png";
import andrewImg from "../assets/images/team/volunteers/Andrew.png";
import kalyanaImg from "../assets/images/team/Team/Kalyan.png";
import pawanImg from "../assets/images/team/volunteers/pawan.png";
import woodburyImg from "../assets/images/team/Team/JWoodbury.png";
import prabhaharanImg from "../assets/images/team/volunteers/Prabhaharan.png";
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
import swaytha from "../assets/images/team/volunteers/Swaytha.jpg";
import sumitaImg from "../assets/images/team/volunteers/SumitaEswaran.jpeg";

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

const AMCLeadershipTeams = () => {
  return (
    <>
      {/* AMC Board Members */}
      <Container
        maxWidth="lg"
        sx={{ py: { xs: 3, md: 6 }, px: { xs: 2, md: 4 } }}
      >
        <SectionTitle>AMC Board Members</SectionTitle>
        <Box className="leaders-grid">
          {[
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
    </>
  );
};

export default AMCLeadershipTeams;
