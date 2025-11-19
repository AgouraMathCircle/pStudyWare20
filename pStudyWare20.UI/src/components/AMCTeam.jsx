import React from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import GoogleIcon from "@mui/icons-material/Google";
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
  { name: "AUSTIN LAW", role: "SENIOR VICE PRESIDENT", image: austinLaw },
  { name: "JOSHNA JUDE", role: "SENIOR VICE PRESIDENT", image: joshna },
  { name: "CHARLIE NICKS", role: "SENIOR VICE PRESIDENT", image: teamMember14 },
  { name: "MUGIL", role: "SENIOR VICE PRESIDENT", image: mugil },
  { name: "RUHAN", role: "SENIOR VICE PRESIDENT", image: ruhan },
  { name: "MONISHKA TANWANI", role: "SENIOR VICE PRESIDENT", image: monishka },
  { name: "VIBUSHA", role: "SENIOR VICE PRESIDENT", image: vibusha },
  // Vice Presidents
  { name: "ANUSHA PANDEY", role: "VICE PRESIDENT", image: anusha },
  { name: "CAITLYN DEPRANO", role: "VICE PRESIDENT", image: userImg },
  { name: "NAYANA ASHOK", role: "VICE PRESIDENT", image: nayanaAshok },
  { name: "BHAVYA SHANMUGAM", role: "VICE PRESIDENT", image: bhavyaShanmugam },
  { name: "DHEEKSHAW GOPINATH", role: "VICE PRESIDENT", image: userImg },
  {
    name: "SHRINIDHI PRABHAHARAN",
    role: "VICE PRESIDENT",
    image: shrinidhiPrabhaharan,
  },
  { name: "THANUSHRI VEDAVALLI", role: "VICE PRESIDENT", image: tanushree },
  // Assistant Vice Presidents
  {
    name: "AAROHAN CHAKRAVARTY",
    role: "ASSISTANT VICE PRESIDENT",
    image: userImg,
  },
  { name: "ASHWIKA TASIN", role: "ASSISTANT VICE PRESIDENT", image: userImg },
  { name: "AVISHI GOEL", role: "ASSISTANT VICE PRESIDENT", image: userImg },
  { name: "AYUSHI AGARWAL", role: "ASSISTANT VICE PRESIDENT", image: userImg },
  { name: "IONE MCLAINL", role: "ASSISTANT VICE PRESIDENT", image: userImg },
  { name: "JUSTIN ZHANG", role: "ASSISTANT VICE PRESIDENT", image: userImg },
  { name: "NICK CHENG", role: "ASSISTANT VICE PRESIDENT", image: nickCheng },
  { name: "KARINA DORDI", role: "ASSISTANT VICE PRESIDENT", image: userImg },
  { name: "NYSHA PRASAD", role: "ASSISTANT VICE PRESIDENT", image: userImg },
  { name: "YI LI", role: "ASSISTANT VICE PRESIDENT", image: yili },
  { name: "OJAL MAHAJAN", role: "ASSISTANT VICE PRESIDENT", image: userImg },
  { name: "DHRUVA MADHAN", role: "ASSISTANT VICE PRESIDENT", image: dhruva },
  {
    name: "SRISHARAN MURUGESAN",
    role: "ASSISTANT VICE PRESIDENT",
    image: userImg,
  },
  { name: "SASHANK VINOTH", role: "ASSISTANT VICE PRESIDENT", image: userImg },
  {
    name: "ALEXANDER BANKHEAD",
    role: "ASSISTANT VICE PRESIDENT",
    image: alexanderBankhead,
  },
  { name: "SIMRAN KAUR", role: "ASSISTANT VICE PRESIDENT", image: userImg },
  { name: "HARI GEESON", role: "ASSISTANT VICE PRESIDENT", image: userImg },
  { name: "PRANAV KUNDERU", role: "ASSISTANT VICE PRESIDENT", image: userImg },
  { name: "SANJAY REDDY", role: "ASSISTANT VICE PRESIDENT", image: userImg },
  {
    name: "SYLESH SUNDARESAN",
    role: "ASSISTANT VICE PRESIDENT",
    image: userImg,
  },
  { name: "JOHANATHAN JHU", role: "ASSISTANT VICE PRESIDENT", image: userImg },
  { name: "ADITI MAHAJAN", role: "ASSISTANT VICE PRESIDENT", image: userImg },
  { name: "RISHIK TANWANI", role: "ASSISTANT VICE PRESIDENT", image: userImg },
];

const AMCTeam = () => {
  return (
    <>
      {chief.map((member, index) => (
        <Box
          key={index}
          sx={{
            flex: "0 0 auto",
            width: { xs: "100%", sm: "48%", md: "48%", lg: "48%" },
            mb: 3,
          }}
        >
          <Card
            sx={{
              height: "100%",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
              },
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: { xs: "300px", sm: "350px", md: "400px", lg: "450px" },
                mb: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                borderRadius: "0px",
                border: {
                  xs: "10px solid rgb(255, 255, 255)",
                  sm: "12px solid rgb(255, 255, 255)",
                  md: "15px solid rgb(255, 255, 255)",
                },
                boxShadow:
                  "8px 8px 24px rgba(0, 0, 0, 0.4), 4px 4px 12px rgba(0, 0, 0, 0.3)",
                flex: 1,
                padding: { xs: "8px", sm: "10px", md: "12px" },
              }}
            >
              <Box
                component="img"
                src={member.image}
                alt={member.name}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  transition: "transform 0.3s ease",
                  "&:hover": { transform: "scale(1.05)" },
                }}
              />
            </Box>
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, fontSize: "1.1rem", mb: 1 }}
              >
                {member.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  fontWeight: 500,
                  fontSize: "0.9rem",
                }}
              >
                {member.role}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      ))}
      <Box sx={{ textAlign: "center", mt: "10px", mb: "10px", width: "100%" }}>
        <Typography
          variant="h2"
          sx={{ fontWeight: 700, fontSize: { xs: "2rem", md: "2.5rem" } }}
        >
          AMC Student Board Members
        </Typography>
      </Box>
      <Box
        component="div"
        className="row"
        sx={{
          width: "100%",
          display: "flex",
          flexWrap: "wrap",
          margin: 0,
          gap: 4,
        }}
      >
        {teamMembers.map((member, index) => (
          <Box
            key={index}
            component="div"
            className="col-lg-3"
            sx={{
              flex: {
                xs: "0 0 100%",
                sm: "0 0 calc(50% - 16px)",
                md: "0 0 calc(25% - 24px)",
                lg: "0 0 calc(25% - 24px)",
              },
              maxWidth: {
                xs: "100%",
                sm: "calc(50% - 16px)",
                md: "calc(25% - 24px)",
                lg: "calc(25% - 24px)",
              },
              padding: 0,
              mb: 0,
            }}
          >
            <Box component="div" className="team-inner-item">
              <Box component="div" className="team-wrap">
                <Box component="div" className="team-img">
                  <Box component="a" href="" sx={{ display: "block" }}>
                    <Box
                      component="img"
                      src={member.image}
                      alt={member.name}
                      sx={{
                        width: "100%",
                        height: "auto",
                        display: "block",
                      }}
                    />
                  </Box>
                  <Box component="ul" className="team-social">
                    <Box component="li">
                      <Box component="a" href="" className="social-icon">
                        <FacebookIcon sx={{ fontSize: "15px" }} />
                      </Box>
                    </Box>
                    <Box component="li">
                      <Box component="a" href="" className="social-icon">
                        <GoogleIcon sx={{ fontSize: "15px" }} />
                      </Box>
                    </Box>
                    <Box component="li">
                      <Box component="a" href="" className="social-icon">
                        <TwitterIcon sx={{ fontSize: "15px" }} />
                      </Box>
                    </Box>
                    <Box component="li">
                      <Box component="a" href="" className="social-icon">
                        <LinkedInIcon sx={{ fontSize: "15px" }} />
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Box component="div" className="team-item-text">
                  <Box component="div" className="team-details">
                    <Typography
                      component="h3"
                      className="team-name"
                      sx={{
                        fontSize: "18px",
                        margin: "20px 0 4px",
                        textTransform: "uppercase",
                        fontWeight: 600,
                      }}
                    >
                      <Box
                        component="a"
                        href=""
                        sx={{
                          color: "#102d47",
                          textDecoration: "none",
                          "&:hover": { color: "#53b50a" },
                        }}
                      >
                        {member.name}
                      </Box>
                    </Typography>
                    <Typography
                      component="span"
                      className="team-title"
                      sx={{
                        color: "#666",
                        fontSize: "0.9rem",
                        fontWeight: 500,
                        display: "block",
                      }}
                    >
                      {member.role}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </>
  );
};

export default AMCTeam;
