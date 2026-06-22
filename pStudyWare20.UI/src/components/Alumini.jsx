import React from "react";
import { Box, Container, Typography, Grid } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import XIcon from "@mui/icons-material/X";
import GoogleIcon from "@mui/icons-material/Google";
import pageHeaderImg from "../assets/images/about/page-header.jpg";
import "../styles/Alumini.css";
import "../styles/OurTeam.css";
import maylianImg from "../assets/images/team/Team/Maylian.png";
import vaibhavImg from "../assets/images/team/volunteers/Vaibhav.png";
import siddhartaImg from "../assets/images/team/volunteers/Siddharta.png";
import suryatejImg from "../assets/images/team/volunteers/Suryatej.png";
import evanImg from "../assets/images/team/volunteers/EvanSonnenberg.png";
import jacobImg from "../assets/images/team/volunteers/Jacob.png";
import ashwinImg from "../assets/images/team/volunteers/Ashwin.png";
import benjaminImg from "../assets/images/team/volunteers/Benjamin.png";
import shriyaImg from "../assets/images/team/volunteers/Shriya.png";
import divyaImg from "../assets/images/team/volunteers/Divya.png";
import siddhiImg from "../assets/images/team/volunteers/Siddhi.png";
import nithinImg from "../assets/images/team/volunteers/Nithin.png";
import angelaImg from "../assets/images/team/volunteers/Angela.png";
import shruthiImg from "../assets/images/team/volunteers/Shruthi.png";
import saishriyaImg from "../assets/images/team/volunteers/Saishriya.png";
import meghanaImg from "../assets/images/team/volunteers/Meghana.png";
import rishabhImg from "../assets/images/team/volunteers/Rishabh.png";
import unaImg from "../assets/images/team/volunteers/UnaMclain.png";
import aidenImg from "../assets/images/team/volunteers/Aiden.png";
import michaelImg from "../assets/images/team/volunteers/Michael.png";
import personIcon from "../assets/images/team/person-icon.png";
import ishImg from "../assets/images/team/volunteers/ISH-DUBEY.jpg";
import pavetraImg from "../assets/images/team/volunteers/PAVETRASRISAKTHIVELNIRMALA.jpg";
import shreyamBhImg from "../assets/images/team/volunteers/SHREYAM BHATTACHARYA.jpg";
import kavyaImg from "../assets/images/team/volunteers/KAVYA-SREERAJ.jpg";
import pradyumnaImg from "../assets/images/team/volunteers/Pradyumna Denduluri.jpeg";
import navyaImg from "../assets/images/team/volunteers/NAVYA-SREERAJ.jpg";
import yanaImg from "../assets/images/team/volunteers/YANA SEEDHAR.jpg";
import shrishImg from "../assets/images/team/volunteers/SHRISH GOEL.jpg";
import prositImg from "../assets/images/team/volunteers/prosit.jpg";
import nethraImg from "../assets/images/team/volunteers/Nethra_Ashokkumar_photo.jpg";
import sriyabImg from "../assets/images/team/volunteers/SRIYABANDARUPALLI.jpg";
import pratyushImg from "../assets/images/team/volunteers/PRATYUSHMUDGAL.jpg";
import abhishaiImg from "../assets/images/team/volunteers/Abhishai.jpg";

import AustinImg from "../assets/images/team/person-icon.png";
import CharlieImg from "../assets/images/team/volunteers/charlie.png";

const Alumini = () => {
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
    <Box className="alumini-page">
      <Box className="sc-breadcrumbs breadcrumbs-overlay">
        <Box className="breadcrumbs-img">
          <img src={pageHeaderImg} alt="Breadcrumbs" />
        </Box>
        <Box className="breadcrumbs-text white-color">
          <Typography
            variant="h1"
            className="page-title"
            sx={{
              fontSize: { xs: "2.2rem", md: "3.0rem" },
              fontWeight: 700,
              mb: 2,
            }}
          >
            AMC Alumni
          </Typography>
          <ul className="breadcrumbs-list">
            <li>
              <a href="/">Home &gt;</a>
            </li>
            <li>About Us &gt;</li>
            <li>AMC Alumni</li>
          </ul>
        </Box>
      </Box>

      <Container
        maxWidth="lg"
        sx={{ py: { xs: 3, md: 6 }, px: { xs: 2, md: 4 } }}
      >
        <Typography variant="h4" align="center" sx={{ fontWeight: 700, mb: 3 }}>
          AMC Alumni
        </Typography>
        <Grid
          container
          spacing={2}
          justifyContent="center"
          alignItems="stretch"
        >
          {[
            { img: maylianImg, name: "MAYLIAN WU", college: "USC" },
            { img: vaibhavImg, name: "VAIBHAV GARG", college: "" },
            { img: siddhartaImg, name: "SIDDHARTA DUTTA", college: "" },
            { img: suryatejImg, name: "SURYATEJ", college: "" },
            { img: evanImg, name: "EVAN", college: "" },
            { img: jacobImg, name: "JACOB ALBUS", college: "" },
            { img: ashwinImg, name: "ASHWIN RAJESH", college: "" },
            { img: benjaminImg, name: "BENJAMIN CHUNG", college: "" },
            { img: shriyaImg, name: "SHRIYA RAJESH", college: "USC" },
            { img: divyaImg, name: "DIVYA", college: "" },
            {
              img: siddhiImg,
              name: "SIDDHI PORAIYAN",
              college: "NC-Chapel Hill",
            },
            { img: nithinImg, name: "NITHIN RAJESH", college: "" },
            { img: angelaImg, name: "ANGELA YANG", college: "Harvard" },
            { img: shruthiImg, name: "SHRUTHI", college: "UCLA" },
            { img: saishriyaImg, name: "SAISHRIYA", college: "UCLA" },
            { img: meghanaImg, name: "MEGHANA", college: "UC Davis" },
            { img: rishabhImg, name: "RISHABH", college: "Yale" },
            { img: unaImg, name: "UNA MCLAIN", college: "UCLA" },
            { img: aidenImg, name: "AIDEN DEPRANO", college: "UC Berkeley" },
            { img: michaelImg, name: "MICHAEL", college: "UC Berkeley" },
            { img: ishImg, name: "ISH DUBEY", college: "" },
            {
              img: pavetraImg,
              name: "PAVETRASRI SAKTHIVEL NIRMALA",
              college: "",
            },
            { img: shreyamBhImg, name: "SHREYAM BHATTACHARYA", college: "" },
            { img: kavyaImg, name: "KAVYA SREERAJ", college: "" },
            { img: pradyumnaImg, name: "PRADYUMNA DENDULURI", college: "" },
            { img: navyaImg, name: "NAVYA SREERAJ", college: "" },
            { img: yanaImg, name: "YANA SEEDHAR", college: "" },
            { img: shrishImg, name: "SHRISH GOEL", college: "" },
            { img: prositImg, name: "PROSIT SANYAL", college: "" },
            { img: nethraImg, name: "NETHRA ASHOK KUMAR", college: "" },
            { img: sriyabImg, name: "SRIYA BANDARUPALLI", college: "" },
            { img: pratyushImg, name: "PRATYUSH MUDGAL", college: "" },
            { img: abhishaiImg, name: "ABHISHAI GANTA", college: "" },
            { img: AustinImg, name: "AUSTIN LAW", college: "" },
            { img: CharlieImg, name: "CHARLIE NICKS", college: "" },
          ].map((m) => (
            <Grid key={m.name} item xs={12} sm={3} md={3}>
              <Box className="ourteam-card">
                <Box className="ourteam-image">
                  <img src={m.img || personIcon} alt="Alumni Member" />
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
                  {m.college ? (
                    <Typography className="ourteam-role" variant="body2">
                      {m.college}
                    </Typography>
                  ) : null}
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Alumini;
