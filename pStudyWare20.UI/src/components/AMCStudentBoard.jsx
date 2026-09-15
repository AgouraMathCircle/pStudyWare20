import React from "react";
import { Box, Typography, Container } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import XIcon from "@mui/icons-material/X";
import GoogleIcon from "@mui/icons-material/Google";
import "../styles/Leadership.css";
import personIcon from "../assets/images/team/person-icon.png";

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
import monishkaImg from "../assets/images/team/volunteers/Monishka.png";
import ruhanImg from "../assets/images/team/volunteers/ruhan.png";

const smritiImg = new URL("../assets/images/team/volunteers/Smriti Chaudhury.jpeg", import.meta.url).href;
const shubhamImg = new URL("../assets/images/team/volunteers/Shubham Bhattacharya.jpeg", import.meta.url).href;
const srihariSatheeshImg = new URL("../assets/images/team/volunteers/Srihari Satheesh.jpeg", import.meta.url).href;

const AMCStudentBoard = () => {
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
    <Container
      maxWidth="lg"
      sx={{ py: { xs: 3, md: 6 }, px: { xs: 2, md: 4 } }}
    >
      <SectionTitle>AMC Student Board</SectionTitle>
      <Box className="leaders-grid">
        {[
          { img: monishkaImg, name: "MONISHKA TANWANIL", role: "Senior Vice President" },
          { img: ruhanImg, name: "RUHAN", role: "Senior Vice President" },
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
  );
};

export default AMCStudentBoard;
