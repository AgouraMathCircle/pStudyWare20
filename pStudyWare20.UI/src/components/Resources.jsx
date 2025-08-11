import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Link,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import {
  Description as DocumentIcon,
  School as SchoolIcon,
  Science as ScienceIcon,
  Business as BusinessIcon,
  Engineering as EngineeringIcon,
  ArrowForward as ArrowIcon,
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import "../styles/Resources.css";

// Import images from src/assets
import pageHeaderImg from "../assets/images/about/page-header.jpg";
import aboutImage from "../assets/images/about/about-own.png";
import mathImage from "../assets/images/more-pics/18815106_430259484010193_8107987424437199662_o.jpg";
import satImage from "../assets/images/more-pics/60774483_818756345160503_5977584716335808512_n.jpg";
import referenceImage from "../assets/images/more-pics/60961218_818756365160501_3183596365871579136_n.jpg";
import arrow1Img from "../assets/images/arrow-1.png";
import arrow2Img from "../assets/images/arrow-2.png";
import arrow3Img from "../assets/images/arrow-3.png";

const Resources = () => {
  return (
    <Box className="main-content">
      {/* Breadcrumbs Start */}
      <Box className="sc-breadcrumbs breadcrumbs-overlay">
        <Box className="breadcrumbs-img">
          <img src={pageHeaderImg} alt="Breadcrumbs Image" />
        </Box>
        <Box className="breadcrumbs-text white-color">
          <Typography variant="h1" className="page-title">
            RESOURCES
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
              <Link
                component={RouterLink}
                to="/"
                className="active"
                sx={{
                  color: "white",
                  textDecoration: "underline",
                  p: 0,
                  minWidth: "auto",
                  fontSize: "inherit",
                  textTransform: "none",
                }}
              >
                Home &gt;
              </Link>
            </Box>
            <Box component="li" sx={{ display: "inline-block" }}>
              <Typography component="span" sx={{ color: "white" }}>
                Resources
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      {/* Breadcrumbs End */}

      {/* About Section Start */}
      <Box
        id="sc-about"
        className="sc-about pt-80 pb-70 md-pt-40 position-relative arrow-animation-1"
      >
        <Container maxWidth="lg">
          {/* Animated Arrows */}
          <Box className="animated-arrow-1 animated-arrow left-right-new">
            <img src={arrow1Img} alt="" />
          </Box>
          <Box className="animated-arrow-2 animated-arrow up-down-new">
            <img src={arrow2Img} alt="" />
          </Box>
          <Box className="animated-arrow-3 animated-arrow up-down-new">
            <img src={arrow3Img} alt="" />
          </Box>
          <Box className="animated-arrow-4 animated-arrow left-right-new">
            <img src={arrow3Img} alt="" />
          </Box>

          <Grid container className="row row-res">
            <Grid item xs={12}>
              <Typography variant="h3" className="heading">
                Helpful{" "}
                <Box component="span" className="color2">
                  Resources
                </Box>
              </Typography>
            </Grid>
          </Grid>

          <Grid container className="row row-res">
            <Grid item xs={12} lg={8}>
              <Typography variant="h4" className="heading">
                <Box component="span" className="color2">
                  College Application Process
                </Box>
              </Typography>
              <List className="list-styled">
                <ListItem>
                  <ListItemIcon>
                    <DocumentIcon />
                  </ListItemIcon>
                  <ListItemText>
                    <Link
                      href="documents/CollegeApplication_BragSheet_Template.docx"
                      target="_blank"
                      sx={{ color: "primary.main", textDecoration: "none" }}
                    >
                      College Brag Sheet
                    </Link>
                  </ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <DocumentIcon />
                  </ListItemIcon>
                  <ListItemText>
                    <Link
                      href="documents/CollegeApplication_Tracker_Template.xlsx"
                      target="_blank"
                      sx={{ color: "primary.main", textDecoration: "none" }}
                    >
                      College Application Tracking
                    </Link>
                  </ListItemText>
                </ListItem>
              </List>
            </Grid>
          </Grid>

          <Grid container className="row row-res">
            <Grid item xs={12} lg={8}>
              <Typography variant="h4" className="heading">
                <Box component="span" className="color2">
                  Medical Pathway
                </Box>
              </Typography>
              <List className="list-styled">
                <ListItem>
                  <ListItemIcon>
                    <ScienceIcon />
                  </ListItemIcon>
                  <ListItemText>
                    <Link
                      href="documents/MedicalPathway_Guide.pdf"
                      target="_blank"
                      sx={{ color: "primary.main", textDecoration: "none" }}
                    >
                      Medical School Application Guide
                    </Link>
                  </ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <ScienceIcon />
                  </ListItemIcon>
                  <ListItemText>
                    <Link
                      href="documents/PreMed_Checklist.pdf"
                      target="_blank"
                      sx={{ color: "primary.main", textDecoration: "none" }}
                    >
                      Pre-Med Checklist
                    </Link>
                  </ListItemText>
                </ListItem>
              </List>
            </Grid>
          </Grid>

          <Grid container className="row row-res">
            <Grid item xs={12} lg={8}>
              <Typography variant="h4" className="heading">
                <Box component="span" className="color2">
                  Engineering Pathway
                </Box>
              </Typography>
              <List className="list-styled">
                <ListItem>
                  <ListItemIcon>
                    <EngineeringIcon />
                  </ListItemIcon>
                  <ListItemText>
                    <Link
                      href="documents/Engineering_Application_Guide.pdf"
                      target="_blank"
                      sx={{ color: "primary.main", textDecoration: "none" }}
                    >
                      Engineering School Application Guide
                    </Link>
                  </ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <EngineeringIcon />
                  </ListItemIcon>
                  <ListItemText>
                    <Link
                      href="documents/Engineering_Projects_Portfolio.pdf"
                      target="_blank"
                      sx={{ color: "primary.main", textDecoration: "none" }}
                    >
                      Engineering Projects Portfolio Guide
                    </Link>
                  </ListItemText>
                </ListItem>
              </List>
            </Grid>
          </Grid>

          <Grid container className="row row-res">
            <Grid item xs={12} lg={8}>
              <Typography variant="h4" className="heading">
                <Box component="span" className="color2">
                  Business Pathway
                </Box>
              </Typography>
              <List className="list-styled">
                <ListItem>
                  <ListItemIcon>
                    <BusinessIcon />
                  </ListItemIcon>
                  <ListItemText>
                    <Link
                      href="documents/Business_School_Guide.pdf"
                      target="_blank"
                      sx={{ color: "primary.main", textDecoration: "none" }}
                    >
                      Business School Application Guide
                    </Link>
                  </ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <BusinessIcon />
                  </ListItemIcon>
                  <ListItemText>
                    <Link
                      href="documents/Entrepreneurship_Resources.pdf"
                      target="_blank"
                      sx={{ color: "primary.main", textDecoration: "none" }}
                    >
                      Entrepreneurship Resources
                    </Link>
                  </ListItemText>
                </ListItem>
              </List>
            </Grid>
          </Grid>

          <Grid container className="row row-res">
            <Grid item xs={12} lg={8}>
              <Typography variant="h4" className="heading">
                <Box component="span" className="color2">
                  Test Preparation
                </Box>
              </Typography>
              <List className="list-styled">
                <ListItem>
                  <ListItemIcon>
                    <SchoolIcon />
                  </ListItemIcon>
                  <ListItemText>
                    <Link
                      href="documents/SAT_Study_Guide.pdf"
                      target="_blank"
                      sx={{ color: "primary.main", textDecoration: "none" }}
                    >
                      SAT Study Guide
                    </Link>
                  </ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <SchoolIcon />
                  </ListItemIcon>
                  <ListItemText>
                    <Link
                      href="documents/ACT_Study_Guide.pdf"
                      target="_blank"
                      sx={{ color: "primary.main", textDecoration: "none" }}
                    >
                      ACT Study Guide
                    </Link>
                  </ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <SchoolIcon />
                  </ListItemIcon>
                  <ListItemText>
                    <Link
                      href="documents/AP_Exam_Resources.pdf"
                      target="_blank"
                      sx={{ color: "primary.main", textDecoration: "none" }}
                    >
                      AP Exam Resources
                    </Link>
                  </ListItemText>
                </ListItem>
              </List>
            </Grid>
          </Grid>

          {/* Additional Resources Section */}
          <Grid container spacing={4} sx={{ mt: 4 }}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: "100%", p: 3 }}>
                <CardContent>
                  <Typography
                    variant="h5"
                    sx={{ mb: 2, color: "primary.main" }}
                  >
                    Math Resources
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <ArrowIcon />
                      </ListItemIcon>
                      <ListItemText>
                        <Link
                          href="documents/AMC_Study_Materials.pdf"
                          target="_blank"
                          sx={{ color: "primary.main", textDecoration: "none" }}
                        >
                          AMC Study Materials
                        </Link>
                      </ListItemText>
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <ArrowIcon />
                      </ListItemIcon>
                      <ListItemText>
                        <Link
                          href="documents/Problem_Solving_Strategies.pdf"
                          target="_blank"
                          sx={{ color: "primary.main", textDecoration: "none" }}
                        >
                          Problem Solving Strategies
                        </Link>
                      </ListItemText>
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: "100%", p: 3 }}>
                <CardContent>
                  <Typography
                    variant="h5"
                    sx={{ mb: 2, color: "primary.main" }}
                  >
                    Reference Materials
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <ArrowIcon />
                      </ListItemIcon>
                      <ListItemText>
                        <Link
                          href="documents/College_Application_Timeline.pdf"
                          target="_blank"
                          sx={{ color: "primary.main", textDecoration: "none" }}
                        >
                          College Application Timeline
                        </Link>
                      </ListItemText>
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <ArrowIcon />
                      </ListItemIcon>
                      <ListItemText>
                        <Link
                          href="documents/Scholarship_Resources.pdf"
                          target="_blank"
                          sx={{ color: "primary.main", textDecoration: "none" }}
                        >
                          Scholarship Resources
                        </Link>
                      </ListItemText>
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
      {/* About Section End */}
    </Box>
  );
};

export default Resources;
