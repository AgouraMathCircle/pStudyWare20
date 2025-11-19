import React from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  keyframes,
} from "@mui/material";
// Import images from src/assets
import eventsImage from "../../assets/images/courses/8.png";
import scheduleImage from "../../assets/images/about/12.jpg";
import mediaImage from "../../assets/images/courses/10.png";
import "../../styles/Home/WhatWeDo.css";

// Keyframe animations
const fadeInAnimation = keyframes`
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const WhatWeDo = () => {
  return (
    <Box className="what-we-do-section">
      <Container
        maxWidth={false}
        disableGutters
        className="home-section-container"
      >
        {/* Section Header */}
        <Box className="what-we-do-header">
          <Typography
            variant="h6"
            className="what-we-do-subtitle"
            component="div"
          >
            Agoura Math Circle
          </Typography>
          <Typography variant="h3" className="what-we-do-title">
            What We Do
          </Typography>
        </Box>

        {/* Cards Grid */}
        <Box className="what-we-do-grid">
          {/* Events/Programs Card */}
          <Box className="what-we-do-card">
            <Box className="img-p">
              <Box className="img-part position-relative">
                <a href="#">
                  <img src={eventsImage} alt="Events and Programs" />
                </a>
              </Box>
            </Box>
            <Box className="what-we-do-content-part">
              <Typography
                variant="h5"
                className="what-we-do-card-title what-we-do-card-title--small"
                component="h5"
              >
                <a href="#">EVENTS/PROGRAMS</a>
              </Typography>
              <Box className="what-we-do-des" component="div">
                Math Circle - Agoura, CA Chapter
                <br />
                Math Circle - Charlotte, NC Chapter
                <br />
                Math Circle - Online Chapter
                <br />
                Engineering Circle - Intro to Data Science /AI
                <br />
                Test Preparation - ACT and SAT/PSAT
                <br />
                Triangular Talks - Every Month
                <br />
                Satellite Program -
                <a
                  href="/studentregistration"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Register
                </a>
                <br />
                Math Kangraoo -{" "}
                <a
                  href="https://mathkangaroo.oasis-lms.com/Public/Catalog/Home.aspx?Criteria=44&Option=503&tab=2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Register
                </a>
              </Box>
            </Box>
          </Box>

          {/* Fall Semester 2024 Card */}
          <Box className="what-we-do-card">
            <Box className="img-p">
              <Box className="img-part position-relative">
                <a href="#">
                  <img src={scheduleImage} alt="Fall Semester 2024" />
                </a>
              </Box>
            </Box>
            <Box className="what-we-do-content-part">
              <Typography
                variant="h5"
                className="what-we-do-card-title what-we-do-card-title--small"
                component="h5"
              >
                <a href="#">Fall Semester 2025</a>
              </Typography>
              <Box className="what-we-do-des" component="div">
                08/23/2025: 2.00 - 5.00 PM (SATURDAY)
                <br />
                09/06/2025: 2.00 - 5.00 PM (SATURDAY)
                <br />
                09/20/2025: 2.00 - 5.00 PM (SATURDAY)
                <br />
                10/04/2025: 2.00 - 5.00 PM (SATURDAY)
                <br />
                10/18/2025: 2.00 - 5.00 PM (SATURDAY)
                <br />
                11/01/2025: 2.00 - 5.00 PM (SATURDAY)
                <br />
                11/15/2025: 2.00 - 5.00 PM (SATURDAY)
                <br />
                12/06/2025: 2.00 - 5.00 PM (SATURDAY)
                <br />
                12/20/2025: 2.00 - 5.00 PM FINAL EXAM
              </Box>
            </Box>
          </Box>

          {/* Media/News Card */}
          <Box className="what-we-do-card">
            <Box className="img-p">
              <Box className="img-part position-relative">
                <a href="#">
                  <img src={mediaImage} alt="Media and News" />
                </a>
              </Box>
            </Box>
            <Box className="what-we-do-content-part">
              <Typography
                variant="h5"
                className="what-we-do-card-title what-we-do-card-title--small"
                component="h5"
              >
                <a href="#">MEDIA/NEWS</a>
              </Typography>
              <Box className="what-we-do-des" component="div">
                <ul
                  style={{ listStyle: "disc", paddingLeft: "20px", margin: 0 }}
                >
                  {" "}
                  <li>
                    <a
                      href="https://www.youtube.com/embed/CBYiGhtXrWM"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      10 years of excellence
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://timesofindia.indiatimes.com/city/madurai/us-settled-siblings-keen-to-teach-city-students-math-for-free/articleshow/70252199.cms"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      AMC Launched in India, July 2019
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.youtube.com/watch?v=j_CUTnHSNHQ"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      CBS Los Angeles
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.youtube.com/watch?v=LnDwNFbK61g"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Juniority TV
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.indiawest.com/news/global_indian/agoura-math-circle-founded-by-teen-pranav-kalyan-helping-students/article_cd3fd3f0-4b1d-11e7-9794-17deed101e75.html"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      India West
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://twitter.com/Agouramathcirle"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Join AMC Twitter
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.facebook.com/profile.php?id=100010784343153"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      AMC Facebook
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.linkedin.com/in/agouramathcircle/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Connect in Linkedin
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.instagram.com/agouramathcircle/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Follow Instagram
                    </a>
                  </li>
                  <li>
                    <a href="/news-gallery">
                      <button className="active">More</button>
                    </a>
                  </li>
                </ul>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default WhatWeDo;
