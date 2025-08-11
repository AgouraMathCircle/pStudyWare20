import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Container,
  Grid,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import "../styles/FAQ.css";
// Import images from src/assets
import pageHeaderImg from "../assets/images/about/page-header.jpg";
import arrow1Img from "../assets/images/arrow-1.png";
import arrow2Img from "../assets/images/arrow-2.png";
import arrow3Img from "../assets/images/arrow-3.png";

const FAQ = () => {
  const [expanded, setExpanded] = useState(null);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : null);
  };

  const faqData = [
    {
      question: "How to register a student?",
      answer:
        "To register an existing student, navigate to the dashboard and check the reenrollment option for existing students during the registration window. For new students, complete the form, and the system will automatically add them to the wait-list. Screening profiles and allocating spots are based on availability.",
      videoLink: "https://youtu.be/M0akh5uwhF8",
    },
    {
      question: "Do existing students need to register?",
      answer:
        "Yes, registration is mandatory for both new and existing students every semester.",
    },
    {
      question: "Is there a specific timeframe for registration?",
      answer:
        "The registration window typically opens in July to August for the Fall semester and December to January for the Spring semester. Registration links are emailed and available on the website. Due to high demand, early registration is advised.",
    },
    {
      question: "Can I use the same email for multiple student accounts?",
      answer:
        "Yes, our system supports multiple students with a single account using a unique email. For parents registering multiple children, a single email can be used. Different IDs are required only if students play different roles in the same semester.",
    },
    {
      question:
        "Completed registration, no login credentials received, what to do?",
      answer:
        "Check your spam folder for login credentials. If not present, try logging in with your registered email ID and use the 'forgot password' to reset your password.",
    },
    {
      question:
        "Received email with login details, yet unable to login with default password, what to do?",
      answer:
        "Reset your password using the 'forgot password' option. If the problem persists, email support@agouramathcircle.org.",
    },
    {
      question: "Where can I find homework?",
      answer:
        "Login with student/parent credentials, click on 'Class Materials,' and locate the homework section.",
    },
    {
      question: "Is there a centralized repository for study materials?",
      answer:
        "Yes, class materials are periodically published for every session on the website under 'Class Material.' Each session includes the following materials: Quiz: Will be posted exactly at 2 pm PST on the session day, Lecture Notes: Posted 1-2 days prior to the session, Class Work: Posted 1-2 days prior to the session, Classwork Solution: Posted after the session, Homework: Posted after the session, Answer Key: Posted after the session.",
      videoLink: "https://youtu.be/iMKokyQ8IzY",
    },
    {
      question: "How to upload scores for quiz, classwork, and homework?",
      answer:
        "For onsite, coordinators manage scores. For online, parents play a vital role in entering the scores into the student report in the website.",
      videoLink: "https://youtu.be/ehuPdwX02OU",
    },
    {
      question: "When to register for AMC 8, AMC 10, and Math Kangaroo?",
      answer:
        "Look out for emails from support@AgouraMathCircle.org for registration information.",
    },
    {
      question: "What to do if we skip a class?",
      answer:
        "Inform the class coordinator via the website message center to mark the student absent. Support will be provided to catch up in the following class.",
      videoLink: "https://youtu.be/8jqPdXlUlDs",
    },
    {
      question: "Forgot to bring homework, what to do?",
      answer: "Bring it to the next class.",
    },
    {
      question: "Is the online program curriculum different from onsite?",
      answer:
        "No, the class material and structure are the same. The only difference is parent involvement in correcting and entering scores for the online program.",
    },
    {
      question: "How to prepare before the class?",
      answer:
        "Watch relevant YouTube videos and review class materials beforehand. Lecture notes and class work are available 1-2 days before the session.",
    },
    {
      question: "What to bring for the class?",
      answer:
        "Carry stationary supplies. Onsite students bring homework and online students print quiz, lecture Notes, and classwork.",
    },
    {
      question: "How to correct wrong or missed scores?",
      answer:
        "Onsite - Email the class coordinator via the website message center. Online - Parents can make the necessary corrections to the score.",
      videoLink: "https://youtu.be/ehuPdwX02OU",
    },
    {
      question: "How Is each class structured?",
      answer:
        "The classes start at 2pm and end at 5pm PST. 2pm - We begin each class with a 15 mins quiz based on last session topic. 2.15pm - Lecture Notes- Start with a new topic for the day. 3.00pm - Classwork - Kids work individually or in groups to solve the problems. 3.45pm - Break. 4.00pm - Classwork Solutions - The Instructors explain the solutions for each problem. 5.00pm - Class ends.",
    },
    {
      question: "How can I volunteer?",
      answer:
        "We welcome parents and high school students to volunteer. It takes a village to run a free program like this without compromising the high standards of the organization. We encourage students to complete Senior Advance class before signing up as a volunteer. Register using the following link: Volunteer Registration. Student volunteers - If you have already signed up for a learning program and have a student account, use a different email id while signing up as a volunteer. Parents volunteers - If you already have an account for kid(s), use a different id to sign up for the volunteer registration.",
    },
    {
      question: "How to get extra help for the kid?",
      answer:
        "Student volunteers are available from 1.30 pm to provide necessary help.",
    },
    {
      question: "Can I change my class?",
      answer: "Yes, contact the class coordinator with your concerns.",
    },
    {
      question: "How can parents help their child excel?",
      answer:
        "Encourage them to go through class material, finish homework, and consider volunteering.",
    },
    {
      question: "Can an onsite student attend an online class?",
      answer:
        "Yes, only when sick or out of station. Inform the coordinator for the Zoom link.",
    },
    {
      question: "Can an onsite student take final exams online?",
      answer:
        "Yes, only when sick or out of station. Inform the coordinator for the Zoom link.",
    },
    {
      question: "How to enter a timesheet?",
      answer:
        "We highly encourage the high school students to clock their hours for service hours.",
      videoLink: "https://youtu.be/UP5H360d0pw",
    },
    {
      question: "How does the VIRTUAL classes work?",
      answer:
        "VIRTUAL students have access to the same class material as the onsite students. The class material includes lecture notes, classwork, quiz, and homework. We provide the solutions and answer keys to quiz, classwork and homework the following week. Parents can download these and work with their students. We encourage kids to watch Youtube videos uploaded for each session.",
    },
    {
      question: "How can I donate?",
      answer:
        "We do not accept cash donations. Donations through check are preferred. You may also donate using Paypal here. Please note Paypal deducts a 3% fee on all donations.",
    },
    {
      question: "My child finds the class too difficult / too easy?",
      answer:
        "Please talk to the class coordinator during onsite class. We can move your child to upper/lower classes if needed. We want our students to be challenged and learn new concepts.",
    },
    {
      question: "Do we organize competitive exams?",
      answer:
        "Yes, we do organize AMC 8, Kangaroo Maths and Geometry bee each year. We encourage students to participate in these.",
    },
    {
      question: "Website guide - With Student Login",
      answer: "",
      videoLink: "https://youtu.be/LwUHzL2J7YI",
    },
  ];

  return (
    <div className="main-content">
      {/* Breadcrumbs Start */}
      <div className="sc-breadcrumbs breadcrumbs-overlay">
        <div className="breadcrumbs-img">
          <img src={pageHeaderImg} alt="Breadcrumbs Image" />
        </div>
        <div className="breadcrumbs-text white-color">
          <h1 className="page-title">FAQ</h1>
          <ul>
            <li>
              <a className="active" href="/">
                Home &gt;
              </a>
            </li>
            <li className="active">Faq</li>
          </ul>
        </div>
      </div>
      {/* Breadcrumbs End */}

      {/* About Section Start */}
      <div
        id="sc-about faq"
        className="sc-about pt-80 pb-70 md-pt-40 position-relative arrow-animation-1"
      >
        <div className="faq-title text-center">
          <h2 className="title">AMC FAQ</h2>
        </div>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <div className="faq-accordion-container">
                {faqData.map((faq, index) => (
                  <Accordion
                    key={index}
                    expanded={expanded === `panel${index}`}
                    onChange={handleChange(`panel${index}`)}
                    className="faq-accordion-item"
                    sx={{
                      "& .MuiAccordionSummary-root": {
                        backgroundColor: "#f8f9fa",
                        borderRadius: "8px",
                        marginBottom: "2px",
                        "&:hover": {
                          backgroundColor: "#e8f5e8",
                        },
                        "&.Mui-expanded": {
                          backgroundColor: "#53b50a",
                          color: "#ffffff",
                        },
                      },
                      "& .MuiAccordionDetails-root": {
                        backgroundColor: "white",
                        borderTop: "1px solid #e5e7eb",
                        borderRadius: "0 0 8px 8px",
                      },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMore />}
                      aria-controls={`panel${index}bh-content`}
                      id={`panel${index}bh-header`}
                      sx={{
                        "& .MuiAccordionSummary-content": {
                          alignItems: "center",
                        },
                      }}
                    >
                      <Typography
                        variant="h6"
                        component="h3"
                        sx={{ fontWeight: 600 }}
                      >
                        {faq.question}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography
                        variant="body1"
                        sx={{
                          lineHeight: 1.6,
                          "& a": {
                            color: "#53b50a",
                            textDecoration: "none",
                            fontWeight: 600,
                            "&:hover": {
                              color: "#4a7c59",
                              textDecoration: "underline",
                            },
                          },
                        }}
                      >
                        {faq.answer}
                        {faq.videoLink && (
                          <a
                            href={faq.videoLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {" "}
                            Watch Video
                          </a>
                        )}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </div>
            </Grid>
          </Grid>
        </Container>

        {/* Animated Arrows */}
        {/* <div className="animated-arrow-1 animated-arrow left-right-new">
          <img src={arrow1} alt="" />
        </div>
        <div className="animated-arrow-2 animated-arrow up-down-new">
          <img src={arrow2} alt="" />
        </div>
        <div className="animated-arrow-3 animated-arrow up-down-new">
          <img src={arrow3} alt="" />
        </div>
        <div className="animated-arrow-4 animated-arrow left-right-new">
          <img src={arrow3} alt="" />
        </div> */}
      </div>
      {/* About Section End */}
    </div>
  );
};

export default FAQ;
