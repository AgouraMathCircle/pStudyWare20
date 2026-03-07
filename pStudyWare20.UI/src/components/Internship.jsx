import React from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Link,
  Grid,
  Chip,
} from "@mui/material";
import {
  ArrowForward as ArrowForwardIcon,
  SchoolOutlined as SchoolIcon,
  CalendarTodayOutlined as CalendarIcon,
} from "@mui/icons-material";
import "../styles/Internship.css";

const Internship = () => {
  const internshipPrograms = [
    {
      id: 1,
      title: "Volunteering at Cedar Sinai (Teen Volunteer Program - Summer)",
      date: "June 15th",
      gradeLevel: "Age 14 & Above",
      links: ["https://www.cedars-sinai.org/volunteer-services/high-school-students.html"],
      applicationDates: "Opens March 30th, 2026 - Closes April 2nd, 2026",
    },
    {
      id: 2,
      title: "Volunteering at Cedar Sinai (Teen Volunteer Program - Fall)",
      date: "Oct 5th, 2026",
      gradeLevel: "Age 14 & Above",
      links: ["https://www.cedars-sinai.org/volunteer-services/high-school-students.html"],
      applicationDates: "Opens August 3rd, 2026 - Closes August 6th, 2026",
    },
    {
      id: 3,
      title: "Kaiser - Teen Summer Program (New Teens during Summer only)",
      gradeLevel: "9th to 12th",
      links: ["https://kpvolunteer.samaritan.com/custom/511/volunteer_registration"],
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
      subtitle: "Arthur Riggs Diabetes & Metabolism Research Institute Summer Research Program",
      gradeLevel: "Age 16",
      links: [
        "https://www.cityofhope.org/academics/students-and-youth/dmri-summer-research-program",
        "https://www.cityofhope.org/academics/students-and-youth/ar-dmri-summer-research-program-application",
      ],
      applicationDates: "Opens November 1st, 2025 - Closes April 5th, 2026",
    },
    {
      id: 6,
      title: "Scripps Research Translational Institute (SRTI): Research Internship Program",
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
      title: "City of Hope - Eugene and Ruth Roberts Summer Student Academy Internship",
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
      links: ["https://st.llnl.gov/sci-ed/summer-workshops/biotech-summer-experience"],
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
      links: ["https://www.kgi.edu/academics/summer-programs/super-heroes-of-stem/"],
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
      {/* Main Content Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        {/* Section Title */}
        <Box sx={{ mb: 5, textAlign: "center" }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "28px", md: "36px" },
              fontWeight: 700,
              color: "#1c3d5a",
              mb: 2,
            }}
          >
            Research Internships and Volunteering Opportunities
          </Typography>
          <Box
            sx={{
              width: "80px",
              height: "4px",
              background: "linear-gradient(135deg, #53b50a 0%, #2a5298 100%)",
              margin: "0 auto",
            }}
          ></Box>
        </Box>

        {/* Internship Programs Grid */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {internshipPrograms.map((program) => (
            <Grid item xs={12} sm={6} md={4} key={program.id}>
              <Card
                className="internship-card"
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.3s ease",
                  border: "1px solid #e0e0e0",
                  "&:hover": {
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
                    transform: "translateY(-4px)",
                  },
                }}
              >
                <CardContent
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Title */}
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color: "#1c3d5a",
                      mb: 1.5,
                      lineHeight: 1.3,
                      fontSize: "16px",
                    }}
                  >
                    {program.title}
                  </Typography>

                  {/* Subtitle if exists */}
                  {program.subtitle && (
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#666",
                        mb: 1.5,
                        fontStyle: "italic",
                        fontSize: "13px",
                      }}
                    >
                      {program.subtitle}
                    </Typography>
                  )}

                  {/* Date Badge */}
                  {program.date && (
                    <Box sx={{ mb: 1.5 }}>
                      <Chip
                        icon={<CalendarIcon />}
                        label={program.date}
                        size="small"
                        sx={{
                          background: "#f0f0f0",
                          color: "#1c3d5a",
                          fontWeight: 500,
                        }}
                      />
                    </Box>
                  )}

                  {/* Grade Level */}
                  {program.gradeLevel && (
                    <Box sx={{ mb: 1.5, display: "flex", alignItems: "center" }}>
                      <SchoolIcon
                        sx={{
                          width: "18px",
                          height: "18px",
                          color: "#53b50a",
                          mr: 1,
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#555",
                          fontSize: "13px",
                          fontWeight: 500,
                        }}
                      >
                        {program.gradeLevel}
                      </Typography>
                    </Box>
                  )}

                  {/* Application Dates */}
                  {program.applicationDates && (
                    <Box sx={{ mb: 1.5, display: "flex", alignItems: "flex-start" }}>
                      <CalendarIcon
                        sx={{
                          width: "18px",
                          height: "18px",
                          color: "#2a5298",
                          mr: 1,
                          mt: 0.3,
                          flexShrink: 0,
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#555",
                          fontSize: "12px",
                        }}
                      >
                        {program.applicationDates}
                      </Typography>
                    </Box>
                  )}

                  {/* Notes */}
                  {program.notes && (
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#666",
                        mb: 1.5,
                        fontSize: "12px",
                      }}
                    >
                      {program.notes}
                    </Typography>
                  )}

                  {/* Program Links */}
                  <Box sx={{ mt: "auto", display: "flex", flexDirection: "column", gap: 1 }}>
                    {program.links && program.links.length > 0 && (
                      <>
                        {program.links.map((link, index) => (
                          <Link
                            key={index}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                              color: "#2a5298",
                              textDecoration: "none",
                              fontSize: "13px",
                              fontWeight: 600,
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                              "&:hover": {
                                textDecoration: "underline",
                                color: "#53b50a",
                              },
                            }}
                          >
                            Program Link <ArrowForwardIcon sx={{ width: "14px", height: "14px" }} />
                          </Link>
                        ))}
                      </>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Internship;