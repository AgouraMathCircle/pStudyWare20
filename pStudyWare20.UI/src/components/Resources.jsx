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

const linkSx = { color: "#000000", textDecoration: "none" };
const buyOnlineLinkSx = {
  color: "#53b50a",
  textDecoration: "none",
  fontWeight: 600,
  "&:hover": {
    color: "#439009",
    textDecoration: "underline",
  },
};
const buyOnlineSuffix = " Buy ONLINE";

const getBuyOnlineDescription = (text) =>
  text.endsWith(buyOnlineSuffix)
    ? text.slice(0, -buyOnlineSuffix.length)
    : text;

const BuyOnlineListItem = ({ item, icon: Icon }) => (
  <ListItem>
    <ListItemIcon>
      <Icon />
    </ListItemIcon>
    <ListItemText className="resource-link">
      {getBuyOnlineDescription(item.text)}{" "}
      <Link href={item.href} target="_blank" sx={buyOnlineLinkSx}>
        Buy ONLINE
      </Link>
    </ListItemText>
  </ListItem>
);
const prodDocumentsBase = "https://agouramathcircle.org/documents";

const collegeBragSheet = `${prodDocumentsBase}/CollegeApplication_BragSheet_Template.docx`;
const collegeApplicationTracker = `${prodDocumentsBase}/CollegeApplication_Tracker_Template.xlsx`;
const medicalPathwayOverview = `${prodDocumentsBase}/Medical_Pathway_Overview.pdf`;
const bsmdBamdProgram = `${prodDocumentsBase}/BSMD_BAMD.pdf`;
const bsdoBadoProgram = `${prodDocumentsBase}/BSDO_%20BADO.pdf`;

const listSx = {
  "& .MuiListItem-root": {
    paddingTop: "2px",
    paddingBottom: "2px",
  },
};

const mathGuidelinesResources = [
  {
    text: "Complete Kumon Workbooks (Computation, Geometry and Word Problems) until Grade 6th. Buy ONLINE",
    href: "http://www.amazon.com/Grade-Fractions-Kumon-Math-Workbooks/dp/1933241608/ref=sr_1_1?s=books&ie=UTF8&qid=1419441335&sr=1-1&keywords=kumon+6+th+grade",
  },
  {
    text: "Complete CliffsStudySolver Basic Math and Pre-Algebra. Buy ONLINE",
    href: "http://www.amazon.com/CliffsStudySolver-Basic-Pre-Algebra-Jonathan-White/dp/0764537644/ref=sr_1_4?s=books&ie=UTF8&qid=1419442195&sr=1-4&keywords=Cliff+PreAlgebra",
  },
  {
    text: "Complete The Art of Problem Solving, Pre-Algebra. Buy ONLINE",
    href: "http://www.amazon.com/Prealgebra-Richard-Rusczyk/dp/1934124214/ref=sr_1_1?s=books&ie=UTF8&qid=1419442834&sr=1-1&keywords=art+of+problem+solving+prealgebra",
  },
  {
    text: "Complete CliffsStudySolver Algebra I. Buy ONLINE",
    href: "http://www.amazon.com/CliffsStudySolver-Algebra-I-Pt/dp/0764537636/ref=sr_1_6?s=books&ie=UTF8&qid=1419442274&sr=1-6&keywords=Cliff+Algebra+1",
  },
  {
    text: "Complete CliffsStudySolver Algebra II. Buy ONLINE",
    href: "http://www.amazon.com/CliffsStudySolver-Algebra-Mary-Jane-Sterling/dp/0764541358/ref=sr_1_16?s=books&ie=UTF8&qid=1419442613&sr=1-16&keywords=Cliff+Algebra",
  },
  {
    text: "Complete CliffsStudySolver Geometry. Buy ONLINE",
    href: "http://www.amazon.com/CliffsStudySolver-Algebra-Mary-Jane-Sterling/dp/0764541358/ref=sr_1_16?s=books&ie=UTF8&qid=1419442613&sr=1-16&keywords=Cliff+Algebra",
  },
  {
    text: "Complete CliffsStudySolver Trigonometry. Buy ONLINE",
    href: "http://www.amazon.com/CliffsStudySolver-Trigonometry-David-Herzog/dp/0764579681/ref=sr_1_sc_3?s=books&ie=UTF8&qid=1419443184&sr=1-3-spell&keywords=cliff+trigonomeerty",
  },
  {
    text: "Complete The Art of Problem Solving, Introduction to Counting & Probability. Buy ONLINE",
    href: "http://www.amazon.com/CliffsQuickReview-Statistics-David-H-Voelker/dp/0764563882/ref=sr_1_5?s=books&ie=UTF8&qid=1419443471&sr=1-5&keywords=Cliffs+Statistics",
  },
  {
    text: "Complete The Art of Problem Solving, Precalculus. Buy ONLINE",
    href: "http://www.amazon.com/Introduction-Counting-Probability-Problem-Solving/dp/1934124109/ref=pd_sim_b_8?ie=UTF8&refRID=0ES3621D3T0XF4AX928B",
  },
  {
    text: "The Geometry Problem Solver. Buy ONLINE",
    href: "http://www.amazon.com/The-Geometry-Problem-Solver-Editors/dp/0878915109/ref=pd_sim_b_3?ie=UTF8&refRID=1PG1XA7BD5XGHVX4P02R",
  },
  {
    text: "Algebra & Trigonometry Problem Solver. Buy ONLINE",
    href: "http://www.amazon.com/Algebra-Trigonometry-Problem-Solvers-Solution/dp/0878915087/ref=sr_1_5?ie=UTF8&qid=1419534738&sr=8-5&keywords=problem+solver",
  },
  {
    text: "Pre-Calculus Problem Solver. Buy ONLINE",
    href: "http://www.amazon.com/Pre-Calculus-Problem-Solver-Solvers-Solution/dp/0878915567/ref=pd_sim_b_3?ie=UTF8&refRID=1TGJKQ2QPHTHG5V9QQVG",
  },
];

const mathCompetitionResources = [
  {
    text: "Competition Math for Middle School. Buy ONLINE",
    href: "http://www.amazon.com/gp/product/1441488871?keywords=middle%20school%20math%20competition&qid=1445567657&ref_=sr_1_1&sr=8-1",
  },
  {
    text: "American Mathematics Competitions 8 Practice. Buy ONLINE",
    href: "http://www.amazon.com/American-Mathematics-Competitions-8-Practice/dp/1493582259/ref=sr_1_fkmr1_1?s=books&ie=UTF8&qid=1445568081&sr=1-1-fkmr1&keywords=amc+8+practice+tests",
  },
  {
    text: "American Mathematics Competitions 10 Practice. Buy ONLINE",
    href: "http://www.amazon.com/gp/product/1506132065?psc=1&redirect=true&ref_=ox_sc_act_title_1&smid=ATVPDKIKX0DER",
  },
  {
    text: "Problem-Solving Strategies. Buy ONLINE",
    href: "http://www.amazon.com/gp/product/1441488871?keywords=middle%20school%20math%20competition&qid=1445567657&ref_=sr_1_1&sr=8-1",
  },
  {
    text: "The Art and Craft of Problem Solving. Buy ONLINE",
    href: "http://www.amazon.com/Art-Craft-Problem-Solving/dp/0471789011/ref=sr_1_1?s=books&ie=UTF8&qid=1445568469&sr=1-1&keywords=paul+zeitz",
  },
  {
    text: "First Steps for Math Olympians. Buy ONLINE",
    href: "http://www.amazon.com/First-Steps-Math-Olympians-Competitions/dp/088385824X/ref=pd_sim_14_9?ie=UTF8&refRID=0T2Y3HBBM8GYJ4HKXJ60",
  },
];

const satActPrepResources = [
  {
    text: "SAT Prep Black Book. Buy ONLINE",
    href: "https://www.amazon.com/SAT-Prep-Black-Book-Strategies/dp/0692916164/ref=sr_1_10?ie=UTF8&qid=1533187048&sr=8-10&keywords=SAT+Reading1",
  },
  {
    text: "The Complete Guide to SAT Reading. Buy ONLINE",
    href: "https://www.amazon.com/Critical-Reader-3rd-Complete-Reading/dp/0997517875/ref=pd_bxgy_14_img_3?_encoding=UTF8&pd_rd_i=0997517875&pd_rd_r=YKB2NZC2JXGCYFHNK5Q8&pd_rd_w=KMQj6&pd_rd_wg=aD72B&psc=1&refRID=YKB2NZC2JXGCYFHNK5Q8",
  },
  {
    text: "The College Panda's SAT Writing. Buy ONLINE",
    href: "https://www.amazon.com/gp/product/0989496430/ref=oh_aui_detailpage_o08_s00?ie=UTF8&psc=1",
  },
  {
    text: "Dr. Jang's SAT 800 Math Workbook. Buy ONLINE",
    href: "https://www.amazon.com/Dr-Jangs-Math-Workbook-2018/dp/1548123196/ref=sr_1_3?s=books&ie=UTF8&qid=1533187371&sr=1-3&keywords=sat+800+math",
  },
  {
    text: "The College Panda's SAT Essay. Buy ONLINE",
    href: "https://www.amazon.com/College-Pandas-SAT-Essay-Battle-tested/dp/0989496465/ref=sr_1_3?s=books&ie=UTF8&qid=1533188435&sr=1-3&keywords=sat+essay",
  },
  {
    text: "ACT Prep Black Book. Buy ONLINE",
    href: "https://www.amazon.com/ACT-Prep-Black-Book-Strategies/dp/0692078398/ref=tmm_pap_swatch_0?_encoding=UTF8&qid=1533187659&sr=8-1-spons",
  },
  {
    text: "The Official ACT Prep Guide. Buy ONLINE",
    href: "https://www.amazon.com/dp/1119508061?aaxitk=YRhUKyTjRghmIHpXHnGiQg&pd_rd_i=1119508061&pf_rd_m=ATVPDKIKX0DER&pf_rd_p=3930100107420870094&pf_rd_s=desktop-sx-top-slot&pf_rd_t=301&pf_rd_i=act&hsa_cr_id=1095773070001&sb-ci-n=asinImage&sb-ci-v=https%3A%2F%2Fimages-na.ssl-images-amazon.com%2Fimages%2FI%2F51HswhGlNEL.jpg&sb-ci-a=1119508061",
  },
  {
    text: "For the Love of ACT Science. Buy ONLINE",
    href: "https://www.amazon.com/Love-ACT-Science-innovative-standardized/dp/0996832203/ref=sr_1_3?s=books&ie=UTF8&qid=1533187810&sr=1-3&keywords=act+science+prep+book+2018",
  },
  {
    text: "The College Panda's ACT English. Buy ONLINE",
    href: "https://www.amazon.com/College-Pandas-ACT-English-Advanced/dp/0989496406/ref=sr_1_4?s=books&ie=UTF8&qid=1533187902&sr=1-4&keywords=act+english",
  },
  {
    text: "Dr. Jang's SAT* 800 Physics Subject Test. Buy ONLINE",
    href: "https://www.amazon.com/Dr-Jangs-Physics-Subject-Test/dp/1532874987/ref=pd_sim_14_10?_encoding=UTF8&pd_rd_i=1532874987&pd_rd_r=D8N6A10RVSSVN4G0JY81&pd_rd_w=hqkUZ&pd_rd_wg=TNvMJ&psc=1&refRID=D8N6A10RVSSVN4G0JY81",
  },
  {
    text: "Dr. Jang's SAT 800 Chemistry Subject. Buy ONLINE",
    href: "https://www.amazon.com/Dr-Jangs-Chemistry-Subject-Test/dp/1515216411/ref=pd_sim_14_8?_encoding=UTF8&pd_rd_i=1515216411&pd_rd_r=18W6H3RYRD0ZJ31GB11C&pd_rd_w=ICsrW&pd_rd_wg=7QYzG&psc=1&refRID=18W6H3RYRD0ZJ31GB11C",
  },
  {
    text: "SAT II Mathematics level 2. Buy ONLINE",
    href: "https://www.amazon.com/SAT-II-Mathmatics-level-Designed/dp/1523381531/ref=pd_sim_14_6?_encoding=UTF8&pd_rd_i=1523381531&pd_rd_r=1QF3YFH8BQ1XT7HZD106&pd_rd_w=ZbUsn&pd_rd_wg=I1UAM&psc=1&refRID=1QF3YFH8BQ1XT7HZD106",
  },
];

const referenceLinks = [
  { text: "MIT Free Math Course", href: "http://ocw.mit.edu/index.htm#" },
  { text: "You can learn anything", href: "https://www.khanacademy.org/" },
  {
    text: "Art of Problem Solving",
    href: "http://www.artofproblemsolving.com/",
  },
  { text: "Science (NASA)", href: "http://www.nasa.gov/index.html" },
  {
    text: "Free Learning Tools",
    href: "http://www.varsitytutors.com/practice-tests",
  },
  { text: "Free Math Tutorial", href: "http://www.ONLINEnerd.com/" },
  { text: "Math Blog", href: "http://math-blog.com/" },
  {
    text: "College Confidential",
    href: "http://talk.collegeconfidential.com/",
  },
  {
    text: "Apply College- Common Application",
    href: "https://www.commonapp.org/",
  },
  { text: "SAT Training/Prep-Magoosh", href: "https://sat.magoosh.com/" },
];

const articleLinks = [
  {
    text: "10 Steps to Improving Your Study Skills",
    href: "https://academic.cuesta.edu/acasupp/as/701.htm",
  },
  {
    text: "Why would a high school senior choose MIT over Caltech?",
    href: "https://www.quora.com/Why-would-a-high-school-senior-choose-MIT-over-Caltech",
  },
  {
    text: "Caltech: secrets of the worlds number one university",
    href: "http://www.timeshighereducation.co.uk/features/caltech-secrets-of-the-worlds-number-one-university/2011008.fullarticle",
  },
];

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
                    <Link component={RouterLink} to="/internship" sx={linkSx}>
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
                    <Link href={collegeBragSheet} target="_blank" sx={linkSx}>
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
                      href={collegeApplicationTracker}
                      target="_blank"
                      sx={linkSx}
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
                      href={medicalPathwayOverview}
                      target="_blank"
                      sx={linkSx}
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
                    <Link href={bsmdBamdProgram} target="_blank" sx={linkSx}>
                      BSMD and BAMD Program
                    </Link>
                  </ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <ScienceIcon />
                  </ListItemIcon>
                  <ListItemText>
                    <Link href={bsdoBadoProgram} target="_blank" sx={linkSx}>
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
              <List className="list-styled" sx={listSx}>
                {mathGuidelinesResources.map((item) => (
                  <BuyOnlineListItem
                    key={item.text}
                    item={item}
                    icon={MathIcon}
                  />
                ))}
              </List>
            </Grid>
            <Grid item xs={12} lg={4}>
              <Box className="img-part" sx={{ textAlign: "center", mt: 2 }}>
                <img src={aboutImage} alt="About AMC" class="img-small" />
              </Box>
            </Grid>
          </Grid>

          <Grid container className="row row-res">
            <Grid item xs={12} lg={8}>
              <Typography variant="h4" className="heading">
                <Box component="span" className="color2">
                  Mathematics Competitions Guides
                </Box>
              </Typography>
              <List className="list-styled" sx={listSx}>
                {mathCompetitionResources.map((item) => (
                  <BuyOnlineListItem
                    key={item.text}
                    item={item}
                    icon={MathIcon}
                  />
                ))}
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
              <List className="list-styled" sx={listSx}>
                {satActPrepResources.map((item) => (
                  <BuyOnlineListItem
                    key={item.text}
                    item={item}
                    icon={BookIcon}
                  />
                ))}
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
              <List className="list-styled" sx={listSx}>
                {referenceLinks.map((item) => (
                  <ListItem key={item.text}>
                    <ListItemIcon>
                      <ArrowIcon />
                    </ListItemIcon>
                    <ListItemText className="resource-link">
                      <Link href={item.href} target="_blank" sx={linkSx}>
                        {item.text}
                      </Link>
                    </ListItemText>
                  </ListItem>
                ))}
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
              <List className="list-styled" sx={listSx}>
                {articleLinks.map((item) => (
                  <ListItem key={item.text}>
                    <ListItemIcon>
                      <BookIcon />
                    </ListItemIcon>
                    <ListItemText className="resource-link">
                      <Link href={item.href} target="_blank" sx={linkSx}>
                        {item.text}
                      </Link>
                    </ListItemText>
                  </ListItem>
                ))}
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
