import React from "react";
import { Box, Container, Typography, Link } from "@mui/material";
import {
  PersonOutline as PersonIcon,
  CalendarTodayOutlined as CalendarIcon,
  SchoolOutlined as SchoolIcon,
  NotesOutlined as NotesIcon,
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import "../styles/Internship.css";

import pageHeaderImg from "../assets/images/about/page-header.jpg";
import arrow1Img from "../assets/images/arrow-1.png";
import arrow2Img from "../assets/images/arrow-2.png";
import arrow3Img from "../assets/images/arrow-3.png";

const getStatusBadge = (applicationDates) => {
  if (!applicationDates) return null;
  const lower = applicationDates.toLowerCase();
  if (lower.includes("currently open")) {
    return { label: "Now Open", className: "status-now-open" };
  }
  if (lower.includes("first come first serve")) {
    return { label: "FCFS", className: "status-deadline" };
  }
  if (lower.includes("anytime")) {
    return { label: "Open", className: "status-now-open" };
  }
  return { label: "Apply", className: "status-deadline" };
};

const InternshipCard = ({ program }) => {
  const status = getStatusBadge(program.applicationDates);

  return (
    <div className="internship-card">
      {status && (
        <span className={`status-badge ${status.className}`}>
          {status.label}
        </span>
      )}
      <h3>{program.title}</h3>
      {program.subtitle && (
        <p className="subtitle">{program.subtitle}</p>
      )}
      <div className="card-info">
        {program.gradeLevel && (
          <div className="info-item">
            {program.gradeLevel.toLowerCase().startsWith("age") ? (
              <PersonIcon className="info-icon" fontSize="small" />
            ) : (
              <SchoolIcon className="info-icon" fontSize="small" />
            )}
            <span>
              <span className="info-label">
                {program.gradeLevel.toLowerCase().startsWith("age")
                  ? "Age:"
                  : "Grade:"}
              </span>
              {program.gradeLevel}
            </span>
          </div>
        )}
        {program.date && (
          <div className="info-item">
            <CalendarIcon className="info-icon" fontSize="small" />
            <span>
              <span className="info-label">Start:</span>
              {program.date}
            </span>
          </div>
        )}
        {program.applicationDates && (
          <div className="info-item">
            <CalendarIcon className="info-icon" fontSize="small" />
            <span>{program.applicationDates}</span>
          </div>
        )}
        {program.notes && (
          <div className="info-item">
            <NotesIcon className="info-icon" fontSize="small" />
            <span>{program.notes}</span>
          </div>
        )}
      </div>
      <div className="card-actions">
        {program.links && program.links.length > 0 ? (
          program.links.map((link, index) => (
            <Link
              key={index}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="apply-btn"
              sx={{ mb: index < program.links.length - 1 ? 1 : 0 }}
            >
              {program.links.length > 1
                ? `Program Link ${index + 1}`
                : "Program Link"}
            </Link>
          ))
        ) : (
          <span className="apply-btn no-link-btn">No Link Available</span>
        )}
      </div>
    </div>
  );
};

const Internship = () => {
  const internshipPrograms = [
    {
      id: 1,
      title: "Volunteering at Cedar Sinai (Teen Volunteer Program - Summer)",
      date: "June 15th",
      gradeLevel: "Age 14 & Above",
      links: [
        "https://www.cedars-sinai.org/volunteer-services/high-school-students.html",
      ],
      applicationDates: "Opens March 30th, 2026 - Closes April 2nd, 2026",
    },
    {
      id: 2,
      title: "Volunteering at Cedar Sinai (Teen Volunteer Program - Fall)",
      date: "Oct 5th, 2026",
      gradeLevel: "Age 14 & Above",
      links: [
        "https://www.cedars-sinai.org/volunteer-services/high-school-students.html",
      ],
      applicationDates: "Opens August 3rd, 2026 - Closes August 6th, 2026",
    },
    {
      id: 3,
      title: "Kaiser - Teen Summer Program (New Teens during Summer only)",
      gradeLevel: "9th to 12th",
      links: [
        "https://kpvolunteer.samaritan.com/custom/511/volunteer_registration",
      ],
      applicationDates: "Opens March 9th, 2026 - Closes April 13th, 2026",
    },
    {
      id: 4,
      title: "Collective of Youth Leaders (COYL) Program",
      subtitle: "Please email Jesus Escobar (jeescobar@chla.usc.edu)",
      gradeLevel: "9th to 12th grade",
      links: [
        "https://www.chla.org/blog/serving-community/youth-activism-chlas-collective-youth-leaders-teens-take-action-prevent",
      ],
      applicationDates: "Opens Anytime - Closes Anytime",
    },
    {
      id: 5,
      title: "City of Hope - Summer Internship",
      subtitle:
        "Arthur Riggs Diabetes & Metabolism Research Institute Summer Research Program",
      gradeLevel: "Age 16",
      links: [
        "https://www.cityofhope.org/academics/students-and-youth/dmri-summer-research-program",
        "https://www.cityofhope.org/academics/students-and-youth/ar-dmri-summer-research-program-application",
      ],
      applicationDates: "Opens November 1st, 2025 - Closes April 5th, 2026",
    },
    {
      id: 6,
      title:
        "Scripps Research Translational Institute (SRTI): Research Internship Program",
      gradeLevel: "Age 16",
      links: [
        "https://www.scripps.edu/science-and-medicine/translational-institute/education-and-training/student-research-internship/index.html",
      ],
      applicationDates: "Opens November 1st, 2025 - Closes March 30th, 2026",
    },
    {
      id: 7,
      title: "Agoura Math Circle (AMC) - Volunteering",
      gradeLevel: "9th to 12th grade",
      links: ["https://agouramathcircle.org/volunteerregistration.aspx"],
    },
    {
      id: 8,
      title: "Global Volunteering - African Library Project (ALP) Book Drive",
      links: ["https://www.africanlibraryproject.org/book-drives/"],
      applicationDates: "Opens Anytime - Closes Per Country",
    },
    {
      id: 9,
      title: "Congressional Award - Gold medal takes 2 years",
      gradeLevel: "Age 13 1/2 to 18",
      links: ["https://www.congressionalaward.org/register/"],
      applicationDates: "Opens Anytime - Closes Per each Award timeline",
    },
    {
      id: 10,
      title: "UCLA Health Volunteen Summer Program",
      gradeLevel: "Age 16",
      links: [
        "https://www.uclahealth.org/volunteer/westwood/student-programs/high-school-students",
      ],
      applicationDates: "Opens April 1st, 2026 - Closes First Come First Serve",
    },
    {
      id: 11,
      title:
        "City of Hope - Eugene and Ruth Roberts Summer Student Academy Internship",
      gradeLevel: "Age 16 & Above",
      links: [
        "https://www.imgs-coh.edu/summer-student-academy/summer-student-academy-how-to-apply",
      ],
      applicationDates: "Opens January 10th, 2026 - Closes March 11th, 2026",
    },
    {
      id: 12,
      title: "Biotech Summer Experience",
      gradeLevel: "Age 16",
      links: [
        "https://st.llnl.gov/sci-ed/summer-workshops/biotech-summer-experience",
      ],
      applicationDates: "Opens January 19th, 2026 - Closes February 26th, 2026",
    },
    {
      id: 13,
      title: "NASA - OS101: NASA Open Science training",
      subtitle: "ID: 023251",
      gradeLevel: "10th to 11th",
      links: [
        "https://stemgateway.nasa.gov/s/course-offering/a0B5J0000049Ih32AA/open-science-101",
      ],
      applicationDates: "Opens January 5th, 2026 - Closes September 30th, 2026",
    },
    {
      id: 14,
      title: "Keck Graduate Institute (KGI) Super Heroes of STEM Internship",
      gradeLevel: "9th to 12th",
      links: [
        "https://www.kgi.edu/academics/summer-programs/super-heroes-of-stem/",
      ],
      applicationDates: "Currently open",
    },
    {
      id: 15,
      title: "Science and Engineering Apprenticeship Program (SEAP)",
      gradeLevel: "9th to 12th",
      links: ["https://www.navalsteminterns.us/seap"],
      applicationDates: "Opens August 1st, 2026 - Closes November 1st, 2026",
    },
    {
      id: 16,
      title: "USC's Young Researchers Program (YRP)",
      gradeLevel: "13th grade, Local school",
      links: ["https://dornsife.usc.edu/youngresearchersprogram/"],
      applicationDates: "Opens February 1st, 2026 - Closes April 5th, 2026",
    },
    {
      id: 17,
      title: "OFFICE OF THE DISTRICT ATTORNEY - LAW Internships (Summer)",
      gradeLevel: "Age 16",
      applicationDates: "Currently Open – Closes April 15th, 2026",
    },
    {
      id: 18,
      title: "OFFICE OF THE DISTRICT ATTORNEY - LAW Internships (Fall)",
      gradeLevel: "Age 16",
      applicationDates: "Currently Open – Closes July 15th, 2026",
    },
    {
      id: 19,
      title: "CSUN - Research under professors",
      gradeLevel: "9th to 12th",
      links: ["https://www.csun.edu/science-mathematics/research"],
      notes: "Contact: Email to professors",
    },
  ];

  return (
    <Box className="internship-page">
      {/* Breadcrumbs Start */}
      <Box className="sc-breadcrumbs breadcrumbs-overlay">
        <Box className="breadcrumbs-img">
          <img src={pageHeaderImg} alt="Breadcrumbs Image" />
        </Box>
        <Box className="breadcrumbs-text white-color">
          <Typography variant="h1" className="page-title">
            INTERNSHIP
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
              justifyContent: "center",
              flexWrap: "wrap",
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
              <Link
                component={RouterLink}
                to="/resources"
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
                Resources &gt;
              </Link>
            </Box>
            <Box component="li" sx={{ display: "inline-block" }}>
              <Typography component="span" sx={{ color: "#2a5298" }}>
                Internship
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

          <Typography
            variant="h3"
            className="heading"
            sx={{ marginBottom: "20px" }}
          >
            Research{" "}
            <Box component="span" className="color2">
              Internships and Volunteering Opportunities
            </Box>
          </Typography>

          <Typography variant="body1" className="internship-intro">
            Explore curated opportunities for students to gain hands-on experience
            and contribute to the community. These programs range from
            high-level research to community-driven service.
          </Typography>

          <div className="internship-grid">
            {internshipPrograms.map((program) => (
              <InternshipCard key={program.id} program={program} />
            ))}
          </div>
        </Container>
      </Box>
      {/* About Section End */}
    </Box>
  );
};

export default Internship;
