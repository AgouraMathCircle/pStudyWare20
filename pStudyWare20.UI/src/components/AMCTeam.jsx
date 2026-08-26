import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import "../styles/About.css";
// Import team member images
import teamMember1 from "../assets/images/team/1.jpg";
import teamMember2 from "../assets/images/team/2.jpg";
import teamMember14 from "../assets/images/team/volunteers/charlie.png";
// Import new team member images from Team folder
import austinLaw from "../assets/images/team/Team/AustinLaw.png";
import joshna from "../assets/images/team/Team/Joshna.png";
// Import new team member images from volunteers folder
import mugil from "../assets/images/team/volunteers/mugil.jpg";
import ruhan from "../assets/images/team/volunteers/ruhan.png";
import monishka from "../assets/images/team/volunteers/Monishka.png";
import vibusha from "../assets/images/team/volunteers/Vibusha.png";
import anusha from "../assets/images/team/volunteers/Anusha.jpg";
import userImg from "../assets/images/team/volunteers/user.jpg";
import nayanaAshok from "../assets/images/team/volunteers/Nayana_Ashok_Photo.jpg";
import bhavyaShanmugam from "../assets/images/team/volunteers/BHAVYASHANMUGAM.jpg";
import shrinidhiPrabhaharan from "../assets/images/team/volunteers/Shrinidhi_Prabhaharan_Photo.jpg";
import tanushree from "../assets/images/team/volunteers/Tanushree.jpeg";
import nickCheng from "../assets/images/team/volunteers/NICKCHENG.jpg";
import yili from "../assets/images/team/volunteers/YILI.jpg";
import dhruva from "../assets/images/team/volunteers/Dhruva.jpg";
import alexanderBankhead from "../assets/images/team/volunteers/AlexanderBankhead.jpeg";

// Team members data
export const chief = [
  { name: "PRANAV KALYAN", role: "FOUNDER & PRESIDENT", image: teamMember1 },
  {
    name: "SRIYA KALYAN",
    role: "CHIEF EXECUTIVE OFFICER",
    image: teamMember2,
  },
];
export const teamMembers = [
  // Senior Vice Presidents
  { name: "JOSHNA JUDE", role: "SENIOR VICE PRESIDENT", image: joshna },
  { name: "MUGIL", role: "SENIOR VICE PRESIDENT", image: mugil },
  { name: "VIBUSHA", role: "SVP", image: vibusha },
  { name: "MONISHKA TANWANI", role: "SENIOR VICE PRESIDENT", image: monishka },
  { name: "RUHAN", role: "SENIOR VICE PRESIDENT", image: ruhan },
  // { name: "AUSTIN LAW", role: "SENIOR VICE PRESIDENT", image: austinLaw },
  // { name: "CHARLIE NICKS", role: "SENIOR VICE PRESIDENT", image: teamMember14 },
  // Vice Presidents
  // { name: "ANUSHA PANDEY", role: "VICE PRESIDENT", image: anusha },
  // { name: "CAITLYN DEPRANO", role: "VICE PRESIDENT", image: userImg },
  // { name: "NAYANA ASHOK", role: "VICE PRESIDENT", image: nayanaAshok },
  // { name: "BHAVYA SHANMUGAM", role: "VICE PRESIDENT", image: bhavyaShanmugam },
  // { name: "DHEEKSHAW GOPINATH", role: "VICE PRESIDENT", image: userImg },
  // {
  //   name: "SHRINIDHI PRABHAHARAN",
  //   role: "VICE PRESIDENT",
  //   image: shrinidhiPrabhaharan,
  // },
  // { name: "THANUSHRI VEDAVALLI", role: "VICE PRESIDENT", image: tanushree },
  // Assistant Vice Presidents
  // {
  //   name: "AAROHAN CHAKRAVARTY",
  //   role: "ASSISTANT VICE PRESIDENT",
  //   image: userImg,
  // },
  // { name: "ASHWIKA TASIN", role: "ASSISTANT VICE PRESIDENT", image: userImg },
  // { name: "AVISHI GOEL", role: "ASSISTANT VICE PRESIDENT", image: userImg },
  // { name: "AYUSHI AGARWAL", role: "ASSISTANT VICE PRESIDENT", image: userImg },
  // { name: "IONE MCLAINL", role: "ASSISTANT VICE PRESIDENT", image: userImg },
  // { name: "JUSTIN ZHANG", role: "ASSISTANT VICE PRESIDENT", image: userImg },
  // { name: "NICK CHENG", role: "ASSISTANT VICE PRESIDENT", image: nickCheng },
  // { name: "KARINA DORDI", role: "ASSISTANT VICE PRESIDENT", image: userImg },
  // { name: "NYSHA PRASAD", role: "ASSISTANT VICE PRESIDENT", image: userImg },
  // { name: "YI LI", role: "ASSISTANT VICE PRESIDENT", image: yili },
  // { name: "OJAL MAHAJAN", role: "ASSISTANT VICE PRESIDENT", image: userImg },
  // { name: "DHRUVA MADHAN", role: "ASSISTANT VICE PRESIDENT", image: dhruva },
  // {
  //   name: "SRISHARAN MURUGESAN",
  //   role: "ASSISTANT VICE PRESIDENT",
  //   image: userImg,
  // },
  // { name: "SASHANK VINOTH", role: "ASSISTANT VICE PRESIDENT", image: userImg },
  // {
  //   name: "ALEXANDER BANKHEAD",
  //   role: "ASSISTANT VICE PRESIDENT",
  //   image: alexanderBankhead,
  // },
  // { name: "SIMRAN KAUR", role: "ASSISTANT VICE PRESIDENT", image: userImg },
  // { name: "HARI GEESON", role: "ASSISTANT VICE PRESIDENT", image: userImg },
  // { name: "PRANAV KUNDERU", role: "ASSISTANT VICE PRESIDENT", image: userImg },
  // { name: "SANJAY REDDY", role: "ASSISTANT VICE PRESIDENT", image: userImg },
  // {
  //   name: "SYLESH SUNDARESAN",
  //   role: "ASSISTANT VICE PRESIDENT",
  //   image: userImg,
  // },
  // { name: "JOHANATHAN JHU", role: "ASSISTANT VICE PRESIDENT", image: userImg },
  // { name: "ADITI MAHAJAN", role: "ASSISTANT VICE PRESIDENT", image: userImg },
  // { name: "RISHIK TANWANI", role: "ASSISTANT VICE PRESIDENT", image: userImg },
  // { name: "Aarohan Chakravarty", role: "ASSISTANT VICE PRESIDENT", image: userImg },
  // { name: "Ashwika Tasin", role: "ASSISTANT VICE PRESIDENT", image: userImg },
  // { name: "Avishi Goel", role: "ASSISTANT VICE PRESIDENT", image: userImg },
  // { name: "Ayushi Agarwal", role: "ASSISTANT VICE PRESIDENT", image: userImg },
  // { name: "Ione Mclainl", role: "ASSISTANT VICE PRESIDENT", image: userImg },
  // { name: "Justin zhang", role: "ASSISTANT VICE PRESIDENT", image: userImg },
  // { name: "Nick Cheng", role: "ASSISTANT VICE PRESIDENT", image: userImg },
  // { name: "Karina Dordi", role: "ASSISTANT VICE PRESIDENT", image: userImg },
  // { name: "Nysha Prasad", role: "ASSISTANT VICE PRESIDENT", image: userImg },
  // { name: "Yi Li", role: "ASSISTANT VICE PRESIDENT", image: userImg },
  // { name: "Ojal Mahajan", role: "ASSISTANT VICE PRESIDENT", image: userImg },
  // { name: "Dhruva Madhan", role: "ASSISTANT VICE PRESIDENT", image: userImg },
  // { name: "Srisharan Murugesan", role: "ASSISTANT VICE PRESIDENT", image: userImg },
  // { name: "Sashank Vinoth", role: "ASSISTANT VICE PRESIDENT", image: userImg },
  // { name: "Alexander Bankhead", role: "ASSISTANT VICE PRESIDENT", image: userImg },
  // { name: "Simran Kaur", role: "ASSISTANT VICE PRESIDENT", image: userImg },
  // { name: "Hari Geeson", role: "ASSISTANT VICE PRESIDENT", image: userImg },
  // { name: "Pranav Kunderu", role: "ASSISTANT VICE PRESIDENT", image: userImg },
  // { name: "Sanjay Reddy", role: "ASSISTANT VICE PRESIDENT", image: userImg },
  // { name: "Johanathan Jhu", role: "ASSISTANT VICE PRESIDENT", image: userImg },
  // { name: "Aditi Mahajan", role: "ASSISTANT VICE PRESIDENT", image: userImg },
];

const AMCTeam = () => {
  // Icon style
  const iconStyle = {
    width: "38px",
    height: "38px",
    backgroundColor: "#6cc24a",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "0.3s",
    cursor: "pointer",
    "&:hover": { 
      transform: "scale(1.1)",
      backgroundColor: "#4fa832"
    }
  };

  // Social media icons SVG data
  const socialIcons = [
    {
      name: "facebook",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="white" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>`
    },
    {
      name: "google-plus",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="white" viewBox="0 0 24 24">
        <path d="M7.635 10.909v2.619h4.335c-.173 1.125-1.31 3.295-4.331 3.295-2.604 0-4.731-2.16-4.731-4.823 0-2.662 2.122-4.823 4.728-4.823 1.485 0 2.48.639 3.049 1.188l2.073-1.997c-1.33-1.245-3.056-1.995-5.122-1.995C3.412 4.365 0 7.785 0 12s3.412 7.635 7.635 7.635c4.41 0 7.332-3.098 7.332-7.461 0-.501-.054-.885-.12-1.265H7.635zm16.365 0h-2.183V8.726h-2.183v2.183h-2.182v2.181h2.184v2.184h2.189v-2.184H24v-2.181z"/>
      </svg>`
    },
    {
      name: "twitter",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="white" viewBox="0 0 24 24">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.213c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
      </svg>`
    },
    {
      name: "linkedin",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="white" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>`
    }
  ];

  return (
    <>
      {/* AMC Team Section */}
      <Box sx={{ mb: 6 }}>
        <Grid container spacing={3}>
          {chief.map((member, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Box sx={{ textAlign: "center" }}>
                <Box
                  sx={{
                    width: "448px",
                    mx: "auto",
                    backgroundColor: "#fff",
                    borderRadius: "18px",
                    border: "3px solid #e0e0e0",
                    boxShadow: "0 8px 18px rgba(0,0,0,0.25)",
                    padding: "16px",
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      height: "416px",
                      overflow: "hidden",
                      borderRadius: "14px",
                      position: "relative",
                      cursor: "pointer",
                      "&:hover .overlay": { opacity: 1 },
                    }}
                  >
                    <Box
                      component="img"
                      src={member.image}
                      alt={member.name}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.05)",
                        },
                      }}
                    />

                    {/* SOCIAL ICONS - Fixed position without sliding */}
                    <Box
                      className="overlay"
                      sx={{
                        position: "absolute",
                        bottom: "20px",
                        left: 0,
                        right: 0,
                        display: "flex",
                        justifyContent: "center",
                        gap: "8px",
                        opacity: 0,
                        transition: "opacity 0.3s ease",
                      }}
                    >
                      {socialIcons.map((icon, idx) => (
                        <Box
                          key={idx}
                          sx={iconStyle}
                          dangerouslySetInnerHTML={{
                            __html: icon.svg
                          }}
                        />
                      ))}
                    </Box>
                  </Box>

                  <Typography
                    variant="body1"
                    sx={{
                      mt: 1.4,
                      fontWeight: 700,
                      fontSize: "1.15rem",
                      textTransform: "capitalize",
                    }}
                  >
                    {member.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 0.5,
                      fontWeight: 500,
                      fontSize: "0.9rem",
                      color: "text.secondary",
                      textTransform: "uppercase",
                    }}
                  >
                    {member.role}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
        
      </Box>
      <Box sx={{ mt: 8 }}>

        <Grid container spacing={3} justifyContent="center">
          {teamMembers.map((member, index) => (
            <Grid item xs={12} sm={6} md={3} lg={3} key={index}>
              <Box sx={{ textAlign: "center" }}>
                <Box
                  sx={{
                    width: "280px",
                    mx: "auto",
                    backgroundColor: "#fff",
                    borderRadius: "18px",
                    border: "3px solid #e0e0e0",
                    boxShadow: "0 8px 18px rgba(0,0,0,0.25)",
                    padding: "16px",
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      height: "260px",
                      overflow: "hidden",
                      borderRadius: "14px",
                      position: "relative",
                      cursor: "pointer",
                      "&:hover .overlay": { opacity: 1 },
                    }}
                  >
                    <Box
                      component="img"
                      src={member.image}
                      alt={member.name}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.05)",
                        },
                      }}
                    />

                    <Box
                      className="overlay"
                      sx={{
                        position: "absolute",
                        bottom: "20px",
                        left: 0,
                        right: 0,
                        display: "flex",
                        justifyContent: "center",
                        gap: "8px",
                        opacity: 0,
                        transition: "opacity 0.3s ease",
                      }}
                    >
                      {socialIcons.map((icon, idx) => (
                        <Box
                          key={idx}
                          sx={iconStyle}
                          dangerouslySetInnerHTML={{
                            __html: icon.svg
                          }}
                        />
                      ))}
                    </Box>
                  </Box>

                  <Typography
                    variant="body1"
                    sx={{
                      mt: 1.4,
                      fontWeight: 700,
                      fontSize: "1.15rem",
                      textTransform: "capitalize",
                    }}
                  >
                    {member.name.toUpperCase()}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 0.5,
                      fontWeight: 500,
                      fontSize: "0.9rem",
                      color: "text.secondary",
                      textTransform: "uppercase",
                    }}
                  >
                    {member.role}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
      
    </>
  );
};

export default AMCTeam;
