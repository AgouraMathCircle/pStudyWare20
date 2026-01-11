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
    Calculate as MathIcon,
    MenuBook as BookIcon,
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
                                    color: "#2a5298",
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
                            <Typography component="span" sx={{ color: "#2a5298" }}>
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
                            <Typography
                                variant="h3"
                                className="heading"
                                sx={{ marginBottom: "40px" }}
                            >
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
                                    Research Internships and Volunteering Opportunities
                                </Box>
                            </Typography>
                            <List
                                className="list-styled"
                                sx={{
                                    "& .MuiListItem-root": {
                                        paddingTop: "2px",
                                        paddingBottom: "2px",
                                    },
                                }}
                            >
                                <ListItem>
                                    <ListItemIcon>
                                        <ArrowIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        <Link
                                            href="/pstudyware/Documents/Research_Internships_Volunteering.pdf"
                                            target="_blank"
                                            sx={{ color: "#000000", textDecoration: "none" }}
                                        >
                                            Research Internships and Volunteering Opportunities
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
                                    College Application Process
                                </Box>
                            </Typography>
                            <List
                                className="list-styled"
                                sx={{
                                    "& .MuiListItem-root": {
                                        paddingTop: "2px",
                                        paddingBottom: "2px",
                                    },
                                }}
                            >
                                <ListItem>
                                    <ListItemIcon>
                                        <DocumentIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        <Link
                                            href="/pstudyware/Documents/CollegeApplication_BragSheet_Template.docx"
                                            target="_blank"
                                            sx={{ color: "#000000", textDecoration: "none" }}
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
                                            href="/pstudyware/Documents/CollegeApplication_Tracker_Template.xlsx"
                                            target="_blank"
                                            sx={{ color: "#000000", textDecoration: "none" }}
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
                            <List
                                className="list-styled"
                                sx={{
                                    "& .MuiListItem-root": {
                                        paddingTop: "2px",
                                        paddingBottom: "2px",
                                    },
                                }}
                            >
                                <ListItem>
                                    <ListItemIcon>
                                        <ScienceIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        <Link
                                            href="/pstudyware/Documents/Medical_Pathway_Overview.pdf"
                                            target="_blank"
                                            sx={{ color: "#000000", textDecoration: "none" }}
                                        >
                                            Medical Pathway - Overview
                                        </Link>
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <ScienceIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        <Link
                                            href="/pstudyware/Documents/BSMD_BAMD_Program.pdf"
                                            target="_blank"
                                            sx={{ color: "#000000", textDecoration: "none" }}
                                        >
                                            BSMD and BAMD Program
                                        </Link>
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <ScienceIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        <Link
                                            href="/pstudyware/Documents/BSDO_BADO_Program.pdf"
                                            target="_blank"
                                            sx={{ color: "#000000", textDecoration: "none" }}
                                        >
                                            BSDO and BADO Program
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
                                    Mathematics Guidelines for Study
                                </Box>
                            </Typography>
                            <List
                                className="list-styled"
                                sx={{
                                    "& .MuiListItem-root": {
                                        paddingTop: "2px",
                                        paddingBottom: "2px",
                                    },
                                }}
                            >
                                <ListItem>
                                    <ListItemIcon>
                                        <MathIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        <Link
                                            href="https://www.amazon.com"
                                            target="_blank"
                                            sx={{ color: "#000000", textDecoration: "none" }}
                                        >
                                            Complete Kumon Workbooks (Computation, Geometry and Word
                                            Problems) until Grade 6th. Buy ONLINE
                                        </Link>
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <MathIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        <Link
                                            href="https://www.amazon.com"
                                            target="_blank"
                                            sx={{ color: "#000000", textDecoration: "none" }}
                                        >
                                            Complete CliffsStudySolver Basic Math and Pre-Algebra. Buy
                                            ONLINE
                                        </Link>
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <MathIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        <Link
                                            href="https://www.amazon.com"
                                            target="_blank"
                                            sx={{ color: "#000000", textDecoration: "none" }}
                                        >
                                            Complete The Art of Problem Solving, Pre-Algebra. Buy
                                            ONLINE
                                        </Link>
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <MathIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        <Link
                                            href="https://www.amazon.com"
                                            target="_blank"
                                            sx={{ color: "#000000", textDecoration: "none" }}
                                        >
                                            Complete CliffsStudySolver Algebra I. Buy ONLINE
                                        </Link>
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <MathIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        <Link
                                            href="https://www.amazon.com"
                                            target="_blank"
                                            sx={{ color: "#000000", textDecoration: "none" }}
                                        >
                                            Complete CliffsStudySolver Algebra II. Buy ONLINE
                                        </Link>
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <MathIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        <Link
                                            href="https://www.amazon.com"
                                            target="_blank"
                                            sx={{ color: "#000000", textDecoration: "none" }}
                                        >
                                            Complete CliffsStudySolver Geometry. Buy ONLINE
                                        </Link>
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <MathIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        <Link
                                            href="https://www.amazon.com"
                                            target="_blank"
                                            sx={{ color: "#000000", textDecoration: "none" }}
                                        >
                                            Complete CliffsStudySolver Trigonometry. Buy ONLINE
                                        </Link>
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <MathIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        <Link
                                            href="https://www.amazon.com"
                                            target="_blank"
                                            sx={{ color: "#000000", textDecoration: "none" }}
                                        >
                                            Complete The Art of Problem Solving, Introduction to
                                            Counting & Probability. Buy ONLINE
                                        </Link>
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <MathIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        <Link
                                            href="https://www.amazon.com"
                                            target="_blank"
                                            sx={{ color: "#000000", textDecoration: "none" }}
                                        >
                                            Complete The Art of Problem Solving, Precalculus. Buy
                                            ONLINE
                                        </Link>
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <MathIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        <Link
                                            href="https://www.amazon.com"
                                            target="_blank"
                                            sx={{ color: "#000000", textDecoration: "none" }}
                                        >
                                            The Geometry Problem Solver. Buy ONLINE
                                        </Link>
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <MathIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        <Link
                                            href="https://www.amazon.com"
                                            target="_blank"
                                            sx={{ color: "#000000", textDecoration: "none" }}
                                        >
                                            Algebra & Trigonometry Problem Solver. Buy ONLINE
                                        </Link>
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <MathIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        <Link
                                            href="https://www.amazon.com"
                                            target="_blank"
                                            sx={{ color: "#000000", textDecoration: "none" }}
                                        >
                                            Pre-Calculus Problem Solver. Buy ONLINE
                                        </Link>
                                    </ListItemText>
                                </ListItem>
                            </List>
                        </Grid>
                        <Grid container className="row row-res">
                            <Grid item xs={12} lg={8}>
                                <Box className="img-part" sx={{ textAlign: "center", mb: 4 }}>
                                    <img src={aboutImage} alt="About AMC" />
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid container className="row row-res">
                        <Grid item xs={12} lg={8}>
                            <Typography variant="h4" className="heading">
                                <Box component="span" className="color2">
                                    Mathematics Competitions Guides
                                </Box>
                            </Typography>
                            <List
                                className="list-styled"
                                sx={{
                                    "& .MuiListItem-root": {
                                        paddingTop: "2px",
                                        paddingBottom: "2px",
                                    },
                                }}
                            >
                                <ListItem>
                                    <ListItemIcon>
                                        <MathIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        <Link
                                            href="https://www.amazon.com"
                                            target="_blank"
                                            sx={{ color: "#000000", textDecoration: "none" }}
                                        >
                                            Competition Math for Middle School. Buy ONLINE
                                        </Link>
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <MathIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        <Link
                                            href="https://www.amazon.com"
                                            target="_blank"
                                            sx={{ color: "#000000", textDecoration: "none" }}
                                        >
                                            American Mathematics Competitions 8 Practice. Buy ONLINE
                                        </Link>
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <MathIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        <Link
                                            href="https://www.amazon.com"
                                            target="_blank"
                                            sx={{ color: "#000000", textDecoration: "none" }}
                                        >
                                            American Mathematics Competitions 10 Practice. Buy ONLINE
                                        </Link>
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <MathIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        <Link
                                            href="https://www.amazon.com"
                                            target="_blank"
                                            sx={{ color: "#000000", textDecoration: "none" }}
                                        >
                                            Problem-Solving Strategies. Buy ONLINE
                                        </Link>
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <MathIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        <Link
                                            href="https://www.amazon.com"
                                            target="_blank"
                                            sx={{ color: "#000000", textDecoration: "none" }}
                                        >
                                            The Art and Craft of Problem Solving. Buy ONLINE
                                        </Link>
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <MathIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        <Link
                                            href="https://www.amazon.com"
                                            target="_blank"
                                            sx={{ color: "#000000", textDecoration: "none" }}
                                        >
                                            First Steps for Math Olympians. Buy ONLINE
                                        </Link>
                                    </ListItemText>
                                </ListItem>
                            </List>
                        </Grid>
                        <Grid item xs={12} lg={4}>
                            <Box className="img-part" sx={{ textAlign: "center", mt: 2 }}>
                                <img src={mathImage} alt="Mathematics" className="img-small" />
                            </Box>
                        </Grid>
                    </Grid>

                    <Grid container className="row row-res">
                        <Grid item xs={12} lg={8}>
                            <Typography variant="h4" className="heading">
                                <Box component="span" className="color2">
                                    SAT/ACT Prep Books
                                </Box>
                            </Typography>
                            <List
                                className="list-styled"
                                sx={{
                                    "& .MuiListItem-root": {
                                        paddingTop: "2px",
                                        paddingBottom: "2px",
                                    },
                                }}
                            >
                                <ListItem>
                                    <ListItemIcon>
                                        <BookIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        <Link
                                            href="https://www.amazon.com"
                                            target="_blank"
                                            sx={{ color: "#000000", textDecoration: "none" }}
                                        >
                                            SAT Prep Black Book. Buy ONLINE
                                        </Link>
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <BookIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        <Link
                                            href="https://www.amazon.com"
                                            target="_blank"
                                            sx={{ color: "#000000", textDecoration: "none" }}
                                        >
                                            The Complete Guide to SAT Reading. Buy ONLINE
                                        </Link>
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <BookIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        <Link
                                            href="https://www.amazon.com"
                                            target="_blank"
                                            sx={{ color: "#000000", textDecoration: "none" }}
                                        >
                                            The College Panda's SAT Writing. Buy ONLINE
                                        </Link>
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <BookIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        <Link
                                            href="https://www.amazon.com"
                                            target="_blank"
                                            sx={{ color: "#000000", textDecoration: "none" }}
                                        >
                                            Dr. Jang's SAT 800 Math Workbook. Buy ONLINE
                                        </Link>
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <BookIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        <Link
                                            href="https://www.amazon.com"
                                            target="_blank"
                                            sx={{ color: "#000000", textDecoration: "none" }}
                                        >
                                            The College Panda's SAT Essay. Buy ONLINE
                                        </Link>
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <BookIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        <Link
                                            href="https://www.amazon.com"
                                            target="_blank"
                                            sx={{ color: "#000000", textDecoration: "none" }}
                                        >
                                            ACT Prep Black Book. Buy ONLINE
                                        </Link>
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <BookIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        <Link
                                            href="https://www.amazon.com"
                                            target="_blank"
                                            sx={{ color: "#000000", textDecoration: "none" }}
                                        >
                                            The Official ACT Prep Guide. Buy ONLINE
                                        </Link>
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <BookIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        <Link
                                            href="https://www.amazon.com"
                                            target="_blank"
                                            sx={{ color: "#000000", textDecoration: "none" }}
                                        >
                                            For the Love of ACT Science. Buy ONLINE
                                        </Link>
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <BookIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        <Link
                                            href="https://www.amazon.com"
                                            target="_blank"
                                            sx={{ color: "#000000", textDecoration: "none" }}
                                        >
                                            The College Panda's ACT English. Buy ONLINE
                                        </Link>
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <BookIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        <Link
                                            href="https://www.amazon.com"
                                            target="_blank"
                                            sx={{ color: "#000000", textDecoration: "none" }}
                                        >
                                            Dr. Jang's SAT* 800 Physics Subject Test. Buy ONLINE
                                        </Link>
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <BookIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        <Link
                                            href="https://www.amazon.com"
                                            target="_blank"
                                            sx={{ color: "#000000", textDecoration: "none" }}
                                        >
                                            Dr. Jang's SAT 800 Chemistry Subject. Buy ONLINE
                                        </Link>
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <BookIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        <Link
                                            href="https://www.amazon.com"
                                            target="_blank"
                                            sx={{ color: "#000000", textDecoration: "none" }}
                                        >
                                            SAT II Mathematics level 2. Buy ONLINE
                                        </Link>
                                    </ListItemText>
                                </ListItem>
                            </List>
                        </Grid>
                        <Grid item xs={12} lg={4}>
                            <Box className="img-part" sx={{ textAlign: "center", mt: 2 }}>
                                <img src={satImage} alt="SAT/ACT Prep" className="img-small" />
                            </Box>
                        </Grid>
                    </Grid>

                    {/* Reference Links Section */}
                    <Grid container className="row row-res">
                        <Grid item xs={12} lg={8}>
                            <Typography variant="h4" className="heading">
                                <Box component="span" className="color2">
                                    Reference Links
                                </Box>
                            </Typography>
                            <List
                                className="list-styled"
                                sx={{
                                    "& .MuiListItem-root": {
                                        paddingTop: "2px",
                                        paddingBottom: "2px",
                                    },
                                }}
                            >
                                <ListItem>
                                    <ListItemIcon>
                                        <ArrowIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        <Link
                                            href="https://ocw.mit.edu"
                                            target="_blank"
                                            sx={{ color: "#000000", textDecoration: "none" }}
                                        >
                                            MIT Free Math Course
                                        </Link>
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <ArrowIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        <Link
                                            href="https://www.khanacademy.org"
                                            target="_blank"
                                            sx={{ color: "#000000", textDecoration: "none" }}
                                        >
                                            You can learn anything
                                        </Link>
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <ArrowIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        <Link
                                            href="https://artofproblemsolving.com"
                                            target="_blank"
                                            sx={{ color: "#000000", textDecoration: "none" }}
                                        >
                                            Art of Problem Solving
                                        </Link>
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <ArrowIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        <Link
                                            href="https://www.nasa.gov"
                                            target="_blank"
                                            sx={{ color: "#000000", textDecoration: "none" }}
                                        >
                                            Science (NASA)
                                        </Link>
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <ArrowIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        <Link
                                            href="https://www.khanacademy.org"
                                            target="_blank"
                                            sx={{ color: "#000000", textDecoration: "none" }}
                                        >
                                            Free Learning Tools
                                        </Link>
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <ArrowIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        <Link
                                            href="https://www.khanacademy.org/math"
                                            target="_blank"
                                            sx={{ color: "#000000", textDecoration: "none" }}
                                        >
                                            Free Math Tutorial
                                        </Link>
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <ArrowIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        <Link
                                            href="https://www.powerprep.com"
                                            target="_blank"
                                            sx={{ color: "#000000", textDecoration: "none" }}
                                        >
                                            Math Blog
                                        </Link>
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <ArrowIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        <Link
                                            href="https://www.collegeconfidential.com"
                                            target="_blank"
                                            sx={{ color: "#000000", textDecoration: "none" }}
                                        >
                                            College Confidential
                                        </Link>
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <ArrowIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        <Link
                                            href="https://www.commonapp.org"
                                            target="_blank"
                                            sx={{ color: "#000000", textDecoration: "none" }}
                                        >
                                            Apply College- Common Application
                                        </Link>
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <ArrowIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        <Link
                                            href="https://www.magoosh.com"
                                            target="_blank"
                                            sx={{ color: "#000000", textDecoration: "none" }}
                                        >
                                            SAT Training/Prep-Magoosh
                                        </Link>
                                    </ListItemText>
                                </ListItem>
                            </List>
                        </Grid>
                        <Grid item xs={12} lg={4}>
                            <Box className="img-part" sx={{ textAlign: "center", mt: 2 }}>
                                <img
                                    src={referenceImage}
                                    alt="Reference Links"
                                    className="img-small"
                                />
                            </Box>
                        </Grid>
                    </Grid>

                    {/* Articles Section */}
                    <Grid container className="row row-res">
                        <Grid item xs={12} lg={8}>
                            <Typography variant="h4" className="heading">
                                <Box component="span" className="color2">
                                    Articles
                                </Box>
                            </Typography>
                            <List
                                className="list-styled"
                                sx={{
                                    "& .MuiListItem-root": {
                                        paddingTop: "2px",
                                        paddingBottom: "2px",
                                    },
                                }}
                            >
                                <ListItem>
                                    <ListItemIcon>
                                        <BookIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        <Link
                                            href="/pstudyware/Documents/10_Steps_to_Improving_Your_Study_Skills.pdf"
                                            target="_blank"
                                            sx={{ color: "#000000", textDecoration: "none" }}
                                        >
                                            10 Steps to Improving Your Study Skills
                                        </Link>
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <BookIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        <Link
                                            href="/pstudyware/Documents/Why_would_a_high_school_senior_choose_MIT_over_Caltech.pdf"
                                            target="_blank"
                                            sx={{ color: "#000000", textDecoration: "none" }}
                                        >
                                            Why would a high school senior choose MIT over Caltech?
                                        </Link>
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <BookIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        <Link
                                            href="/pstudyware/Documents/Caltech_secrets_of_the_worlds_number_one_university.pdf"
                                            target="_blank"
                                            sx={{ color: "#000000", textDecoration: "none" }}
                                        >
                                            Caltech: secrets of the worlds number one university
                                        </Link>
                                    </ListItemText>
                                </ListItem>
                            </List>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
            {/* About Section End */}
        </Box>
    );
};

export default Resources;
