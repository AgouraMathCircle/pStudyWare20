import React from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
// UPDATED: Import the correct outlined icon
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import "../styles/MathCircle.css";

// Import images from src/assets
import pageHeaderImg from "../assets/images/about/page-header.jpg";
import aboutAmcImg from "../assets/images/about/about-amc copy copy.png";
import arrow1Img from "../assets/images/arrow-1.png";
import arrow2Img from "../assets/images/arrow-2.png";
import arrow3Img from "../assets/images/arrow-3.png";
import arrow4Img from "../assets/images/arrow-4.png";
import arrow5Img from "../assets/images/arrow-5.png";
import teamMember1 from "../assets/images/team/1.jpg";
import teamMember2 from "../assets/images/team/2.jpg";
import teamMember13 from "../assets/images/team/13.png";
import teamMember3 from "../assets/images/team/3.jpg";
import teamMember8 from "../assets/images/team/8.jpg";
import teamMemberCharlie from "../assets/images/team/volunteers/charlie.png";
import teamMember4 from "../assets/images/team/4.jpg";
import teamMember5 from "../assets/images/team/5.jpg";
import teamMember6 from "../assets/images/team/6.jpg";
import teamMember7 from "../assets/images/team/7.jpg";

const MathCircle = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleExternalLink = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Team members data
  const teamMembers = [
    { name: "PRANAV KALYAN", role: "FOUNDER & PRESIDENT", image: teamMember1 },
    { name: "SRIYA KALYAN", role: "CHIEF EXECUTIVE OFFICER", image: teamMember2 },
    { name: "DR BHARAT PATEL", role: "DIRECTOR", image: teamMember13 },
    { name: "ANDREW XU", role: "DIRECTOR", image: teamMember3 },
    { name: "JOSHNA JUDE", role: "SENIOR VICE PRESIDENT", image: teamMember8 },
    { name: "CHARLIE NICKS", role: "SENIOR VICE PRESIDENT", image: teamMemberCharlie },
    { name: "MINITA CLARKE", role: "ADVISORY BOARD", image: teamMember4 },
    { name: "DIANA NGUYEN", role: "ADVISORY BOARD", image: teamMember5 },
    { name: "JOSEPH KEAYS", role: "ADVISORY BOARD", image: teamMember6 },
    { name: "MUGIL SHANMUGAM", role: "ADVISORY BOARD", image: teamMember7 },
  ];

  // A small component for displaying each skill with an icon
  const SkillItem = ({ text }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <CheckCircleOutlineIcon color="primary" sx={{ mr: 1.5 }} />
      <Typography variant="body1">{text}</Typography>
    </Box>
  );

  return (
    <Box className="math-circle-container">
      {/* Breadcrumbs Section */}
      <Box className="sc-breadcrumbs breadcrumbs-overlay">
        <Box className="breadcrumbs-img">
          <img src={pageHeaderImg} alt="Breadcrumbs" />
        </Box>
        <Box className="breadcrumbs-text white-color">
          <Typography variant="h1" className="page-title" sx={{ fontSize: { xs: "2.5rem", md: "3.5rem" }, fontWeight: 700, mb: 2 }}>
            About Us
          </Typography>
          <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0, display: "flex", alignItems: "center", gap: 1 }}>
            <Box component="li" sx={{ display: "inline-block" }}>
              <Button onClick={() => handleNavigation("/")} sx={{ color: "white", textDecoration: "underline", p: 0, minWidth: "auto", fontSize: "inherit", textTransform: "none" }}>
                Home &gt;
              </Button>
            </Box>
            <Box component="li" sx={{ display: "inline-block" }}>
              <Typography component="span" sx={{ color: "white" }}> About Us &gt; </Typography>
            </Box>
            <Box component="li" sx={{ display: "inline-block" }}>
              <Typography component="span" sx={{ color: "white" }}> Math Circle </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* About Section */}
      <Box id="sc-about" className="sc-about pt-80 pb-70 md-pt-40 position-relative" sx={{ pt: { xs: 4, md: 8 }, pb: { xs: 4, md: 6 }, position: "relative" }}>
        <Container maxWidth="lg">
          <Grid container direction="row" flexWrap={{ xs: "wrap", md: "nowrap" }} spacing={4} alignItems="flex-start">
            {/* Image on left */}
            <Grid item xs={12} md={5}>
              <Box className="img-part" sx={{ position: "relative", overflow: "visible" }}>
                <Box component="img" src={aboutAmcImg} alt="About" sx={{ width: "100%", height: "auto", border: "20px solid white", boxShadow: "0 40px 120px rgba(0,0,0,0.8)", display: "block" }} />
                <Box sx={{ position: "absolute", bottom: "-40px", right: "-30px", backgroundColor: "white", color: "black", padding: "15px", borderRadius: "8px", width: "120px", height: "120px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}> 1000+ </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.8rem" }}> Students </Typography>
                </Box>
              </Box>
            </Grid>
            {/* Text content on right */}
            <Grid item xs={12} md={7} sx={{ ml: { xs: 0, md: 4 } }}>
              <Box className="sec-title mb-20">
                <Typography variant="h2" className="title mb-20" sx={{ fontWeight: 700, mb: 2.5, fontSize: { xs: "1.8rem", md: "2.5rem" } }}>
                  ABOUT AMC
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 2 }}>
                  The Agoura Math Circle is a student-run, 501(c)(3) nonprofit community service organization founded by Pranav Kalyan in September 2015. Agoura Math Circle is a free educational program focusing on the problem-solving skills that lead students to success in both academics and the real world. More importantly, Agoura Math Circle gives students confidence and the skills to tackle any type of problem, academic or otherwise. Our goal is to create a strong foundation for kids to increase critical thinking and motivate kids to aim for top universities in a fun-filled environment.
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 4 }}>
                  Agoura Math Circle has many opportunities for students dependent on their various interests. At the moment we have online and OnSite where students can learn math and Engineering. These chapters work together to support our students as best we can. Agoura Engineering Circle is a place for high school students to apply their math skills to engineering. Our test preparation course, offered to 8th graders and up, help students achieve the score they want for standardized tests like the PSAT, SAT and ACT. For kids around the world who still wish to learn math concepts, we have a YouTube channel.
                </Typography>
                <Grid container spacing={2} justifyContent="space-between" alignItems="center">
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ textAlign: "center" }}>
                      <Button variant="contained" onClick={() => handleNavigation("/about/leadership")} sx={{ backgroundColor: "#90EE90", color: "black", px: 3, py: 1.5, borderRadius: "5px", fontWeight: 600, "&:hover": { backgroundColor: "#76c776" } }}>
                        Leadership
                      </Button>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ textAlign: "center" }}>
                      <Button variant="contained" onClick={() => handleNavigation("/about/team")} sx={{ backgroundColor: "#90EE90", color: "black", px: 3, py: 1.5, borderRadius: "5px", fontWeight: 600, "&:hover": { backgroundColor: "#76c776" } }}>
                        Our Team
                      </Button>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ textAlign: "center" }}>
                      <Button variant="contained" onClick={() => handleNavigation("/about/alumni")} sx={{ backgroundColor: "#90EE90", color: "black", px: 3, py: 1.5, borderRadius: "5px", fontWeight: 600, "&:hover": { backgroundColor: "#76c776" } }}>
                        AMC Alumni
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* === COMPLETELY REVISED SKILLS SECTION TO MATCH IMAGE === */}
<Box sx={{ py: { xs: 4, md: 8 } }}>
  <Container maxWidth="lg">
    {/* Skills + Button Row */}
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' }, // stack on mobile, row on desktop
        alignItems: 'flex-start',
        gap: 2,
      }}
    >
      {/* Skills Area */}
      <Box sx={{ flex: 1 }}>
        <Grid container spacing={1}>
          {/* Column 1 */}
          <Grid item xs={12} sm={4} md={3}>
            <SkillItem text="Problem Solving Skills" />
            <SkillItem text="Pre-Algebra" />
          </Grid>
          {/* Column 2 */}
          <Grid item xs={12} sm={4} md={5}>
            <Grid container spacing={1}>
              <Grid item xs={6}><SkillItem text="Basic Math" /></Grid>
              <Grid item xs={6}><SkillItem text="Calculus" /></Grid>
              <Grid item xs={6}><SkillItem text="Pre Calculus" /></Grid>
              <Grid item xs={6}><SkillItem text="MATH COUNTS" /></Grid>
              <Grid item xs={6}></Grid> {/* Spacer */}
              <Grid item xs={6}><SkillItem text="AMC 8" /></Grid>
              <Grid item xs={6}><SkillItem text="AMC 10" /></Grid>
              <Grid item xs={6}><SkillItem text="AMC 12" /></Grid>
            </Grid>
          </Grid>
          {/* Column 3 */}
          <Grid item xs={12} sm={4} md={4}>
            <Grid container spacing={1}>
              <Grid item xs={6}><SkillItem text="MATH Kangaroo" /></Grid>
              <Grid item xs={6}><SkillItem text="MATH LEAGUE" /></Grid>
              <Grid item xs={6}></Grid> {/* Spacer */}
              <Grid item xs={6}><SkillItem text="ACT/PSAT" /></Grid>
            </Grid>
            <SkillItem text="Introduction to Data Science" />
            <SkillItem text="Introduction to Artificial Intelligence" />
          </Grid>
        </Grid>
      </Box>

      {/* Register Button Area */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'flex-start',
          mt: { xs: 4, md: 0 },
          width: { xs: '100%', md: 'auto' },
        }}
      >
        <Button
          variant="contained"
          onClick={() => handleNavigation("/registration/student")}
          sx={{
            backgroundColor: '#67c337',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            borderRadius: '8px',
            textTransform: 'none',
            px: 5,
            py: 2,
            '&:hover': {
              backgroundColor: '#58a82d',
            },
          }}
        >
          Register Now
        </Button>
      </Box>
    </Box>
  </Container>
</Box>


      {/* Team Section */}
      <Box className="sc-team" sx={{ py: { xs: 4, md: 6 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography variant="h2" sx={{ fontWeight: 700, fontSize: { xs: "2rem", md: "2.5rem" } }}>
              AMC TEAM
            </Typography>
          </Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 3 }}>
            {teamMembers.map((member, index) => (
              <Box key={index} sx={{ flex: "0 0 auto", width: { xs: "100%", sm: "45%", md: "30%", lg: "22%" }, mb: 3 }}>
                <Card sx={{ height: "100%", transition: "transform 0.3s ease, box-shadow 0.3s ease", "&:hover": { transform: "translateY(-5px)", boxShadow: "0 8px 25px rgba(0,0,0,0.15)" } }}>
                  <Box component="img" src={member.image} alt={member.name} sx={{ width: "100%", height: "280px", objectFit: "cover" }} />
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.1rem", mb: 1 }}>
                      {member.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 500, fontSize: "0.9rem" }}>
                      {member.role}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default MathCircle;