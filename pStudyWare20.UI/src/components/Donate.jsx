import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Description,
  ExpandMore,
  Diamond,
  Star,
  EmojiEvents,
  WorkspacePremium,
  MilitaryTech,
  KeyboardArrowUp,
} from "@mui/icons-material";
import { donateService, donorService } from "../services";
import "../styles/Donate.css";
// Import images from src/assets
import pageHeaderImg from "../assets/images/about/page-header.jpg";
import donateButtonImg from "../assets/images/donate_button.jpg";
import boxImg from "../assets/images/donatebox.png";
import Sponsors from "./common/Sponsors";
import paymentOptionsImg from "../assets/images/paymentOptions.png";

const Donate = () => {
  const [donorsData, setDonorsData] = useState({
    currentYearDonors: [],
    pastYearDonors: {},
    statistics: null,
  });
  const [donorsLoading, setDonorsLoading] = useState(true);
  const [donorsError, setDonorsError] = useState(null);
  const [expandedYear, setExpandedYear] = useState("current");

  // Financial reports data
  const financialReports = [
    { year: "2025", link: "/pstudyware/Documents/Statements/AMC PnL 2025.pdf" },
    { year: "2024", link: "/pstudyware/Documents/Statements/AMC PnL 2024.pdf" },
    { year: "2023", link: "/pstudyware/Documents/Statements/AMC PnL 2023.pdf" },
    { year: "2022", link: "/pstudyware/Documents/Statements/AMC PnL 2022.pdf" },
    { year: "2021", link: "/pstudyware/Documents/Statements/AMC PnL 2021.pdf" },
    { year: "2020", link: "/pstudyware/Documents/Statements/AMC PnL 2020.pdf" },
    { year: "2019", link: "/pstudyware/Documents/Statements/AMC PnL 2019.pdf" },
    { year: "2018", link: "/pstudyware/Documents/Statements/AMC PnL 2018.pdf" },
    { year: "2017", link: "/pstudyware/Documents/Statements/AMC PnL 2017.pdf" },
    { year: "2016", link: "/pstudyware/Documents/Statements/AMC PnL 2016.pdf" },
  ];

  // Donor level configurations
  const donorLevels = {
    DIAMOND: { icon: Diamond, color: "#e3f2fd", textColor: "#1976d2" },
    PLATINUM: { icon: Star, color: "#f3e5f5", textColor: "#7b1fa2" },
    GOLD: { icon: EmojiEvents, color: "#fff8e1", textColor: "#f57c00" },
    SILVER: { icon: WorkspacePremium, color: "#f1f8e9", textColor: "#388e3c" },
    BRONZE: { icon: MilitaryTech, color: "#fce4ec", textColor: "#c2185b" },
  };

  // Fetch donors data from API
  useEffect(() => {
    const fetchDonorsData = async () => {
      try {
        setDonorsLoading(true);
        setDonorsError(null);

        const response = await donateService.getDashboardData();

        if (response.isSuccess) {
          setDonorsData({
            currentYearDonors: response.currentYearDonors || [],
            pastYearDonors: response.pastYearDonors || {},
            statistics: response.statistics,
          });
        } else {
          setDonorsError(
            response.errorMessage || "Failed to load donors data."
          );
        }
      } catch (err) {
        console.error("Error fetching donors:", err);
        setDonorsError("Failed to load donors. Please try again later.");
      } finally {
        setDonorsLoading(false);
      }
    };

    fetchDonorsData();
  }, []);

  const handlePayPalSubmit = () => {
    // The form will submit to PayPal
    // No need to prevent default as we want the form to submit
  };

  const handleYearChange = (year) => {
    setExpandedYear(expandedYear === year ? null : year);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="main-content">
      {/* Breadcrumbs Start */}
      <div className="sc-breadcrumbs breadcrumbs-overlay">
        <div className="breadcrumbs-img">
          <img src={pageHeaderImg} alt="Breadcrumbs Image" />
        </div>
        <div className="breadcrumbs-text white-color">
          <h1 className="page-title">DONATIONS</h1>
          <ul>
            <li>
              <a className="active" href="/">
                Home &gt;
              </a>
            </li>
            <li className="active">Donations</li>
          </ul>
        </div>
      </div>
      {/* Breadcrumbs End */}

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={1}>
          {/* Left Column - Donate to AMC Section */}
          <Grid item size={{ xs: 12, md: 6 }}>
            <Card
              elevation={0}

              sx={{
                backgroundColor: "white",
                borderRadius: "12px",
                overflow: "hidden",
                padding: 2,
                height: "100%",
              }}
            >
              <CardContent sx={{ p: 0 }}>
                {/* Title */}
                <Typography
                  variant="h2"
                  sx={{
                    color: "#2c3e50",
                    fontWeight: 700,
                    fontSize: { xs: "2rem", md: "2.5rem" },
                    mb: 3,
                  }}
                >
                  Donate to <span style={{ color: "#53b50a" }}>AMC</span>
                </Typography>

                {/* Description Text */}
                <Typography
                  variant="body1"
                  sx={{
                    color: "#666",
                    lineHeight: 1.8,
                    mb: 2,
                    fontSize: "1.1rem",
                  }}
                >
                  The Agoura Math Circle is a student run nonprofit, tax exempt
                  501(c) community service organization and needs your help to
                  maintain the various events that we hold. Please note that
                  donations are tax-deductible. We graciously accept donations
                  at our events.
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    color: "#666",
                    lineHeight: 1.8,
                    mb: 2,
                    fontSize: "1.1rem",
                  }}
                >
                  Please make the payment to Agoura Math Circle using Credit
                  Card.
                </Typography>

                <Typography
                  variant="h6"
                  sx={{
                    color: "#53b50a",
                    fontWeight: 600,
                    mb: 4,
                    fontSize: "1.2rem",
                  }}
                >
                  Our Tax ID: 81-1050140
                </Typography>

                {/* PayPal Donate Button */}

              </CardContent>
            </Card>
          </Grid>

          <Grid item size={{ xs: 12, md: 6 }}>
            <Card
              elevation={0}

              sx={{
                backgroundColor: "white",
                borderRadius: "12px",
                overflow: "hidden",
                padding: 6.3,
                height: "100%",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  maxWidth: 300,
                  height: 200,
                  margin: "0 auto",
                  borderRadius: "15px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
              >

                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "30%",
                    background:
                      "linear-gradient(90deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: "-10px",
                      left: 0,
                      right: 0,
                      height: "20px",
                      background:
                        "linear-gradient(90deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%)",
                      borderRadius: "50%",
                    },
                  }}
                />

                <img
                  src={boxImg}
                  alt="Donation Box"
                  style={{
                    height: "200px",
                    verticalAlign: "middle",
                    boxSizing: "border-box",
                    position: "absolute",
                  }}
                />
              </Box>

              <CardContent sx={{ p: 0 }}>
                <Box sx={{ mb: 4, textAlign: "center" }}>
                  <Box
                    component="form"
                    action="https://www.paypal.com/cgi-bin/webscr"
                    method="post"
                    target="_blank"
                    onSubmit={handlePayPalSubmit}
                    sx={{
                      width: "90%",
                      mx: "auto",
                      display: "block",
                      "&:hover": {
                        transform: "scale(1.02)",
                      },
                      transition: "transform 0.3s ease",
                    }}
                  >
                    <input type="hidden" name="cmd" value="_s-xclick" />
                    <input
                      type="hidden"
                      name="hosted_button_id"
                      value="HS272WGLNXDTN"
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      sx={{
                        width: "90%",
                        backgroundColor: "#53b50a",
                        "&:hover": {
                          backgroundColor: "#469b09",
                        },
                        textTransform: "none",
                        fontWeight: 600,
                        fontSize: 20,
                        mx: "auto",        // centers horizontally
                        display: "block",   // required for mx auto to work
                        py: 1.5,
                      }}
                    >
                      Donate with PayPal
                    </Button>

                    <img
                      alt=""
                      src="https://www.paypal.com/en_US/i/scr/pixel.gif"
                      width="1"
                      height="1"
                      style={{ display: "none" }}
                    />
                  </Box>
                </Box>

                {/* Payment Method Logos */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    flexWrap: "wrap",
                    mt: 2,
                  }}
                >
                  <Grid container spacing={0} alignItems="center" justifyContent="flex-start">
                    <Grid size={"auto"}>
                      <Typography variant="body2" sx={{ color: "#666", fontSize: "1.2rem" }}>
                        We accept:
                      </Typography>
                    </Grid>
                    <Grid size={"grow"}>
                      <img
                        src={paymentOptionsImg}
                        alt="Payment Options"
                        style={{ width: '100%', aspectRatio: '5/1', objectFit: 'cover' }}
                      />
                    </Grid>
                  </Grid>

                </Box>

              </CardContent>
            </Card>
          </Grid>

          {/* Right Column - Illustration and Financial Reports */}
          <Grid item size={{ xs: 12, md: 12, lg: 4 }}>

            {/* Financial Reports Section */}
            <Card
              elevation={0}
              sx={{
                backgroundColor: "white",
                borderRadius: "12px",
                overflow: "hidden",
                padding: 1.5,
                height: "100%",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h5"
                  sx={{
                    color: "#2c3e50",
                    fontWeight: 700,
                    textAlign: "center",
                    mb: 3,
                    fontSize: "1.5rem",
                  }}
                >
                  FINANCIAL REPORTS
                </Typography>

                <Box sx={{ mt: 2 }}>
                  {financialReports.map((report, index) => (
                    <Box
                      key={report.year}
                      component="a"
                      href={report.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        py: 1.5,
                        textDecoration: "none",
                        borderBottom:
                          index < financialReports.length - 1
                            ? "1px solid #e0e0e0"
                            : "none",
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: "#f8f9fa",
                        },
                      }}
                    >
                      <Description
                        sx={{
                          color: "#53b50a",
                          mr: 2,
                          fontSize: "1.2rem",
                        }}
                      />
                      <Typography
                        variant="body1"
                        sx={{
                          color: "#2c3e50",
                          fontWeight: 500,
                          flex: 1,
                        }}
                      >
                        {report.year} Statement
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item size={{ xs: 12, md: 12, lg: 8 }}>
            <Card
              elevation={0}

              sx={{
                backgroundColor: "white",
                borderRadius: "12px",
                overflow: "hidden",
                padding: 1.5,
                height: "100%",
              }}
            >
              <CardContent sx={{ p: 0 }}>


                {/* Our Sponsors Section */}
                <Box sx={{ mt: 1, mb: 1 }}>
                  <Sponsors variant="donate" />
                </Box>

              </CardContent>
            </Card>
          </Grid>


        </Grid>

        <Card
          elevation={0}
          sx={{
            backgroundColor: "white",
            borderRadius: "12px",
            overflow: "hidden",
            padding: 1.5,
            height: "100%",
            mt: 1
          }}
        >
          {/* Donors of AMC Section */}
          <Box sx={{ mt: 2, mb: 1 }}>

            <Typography
              variant="h3"
              sx={{
                color: "#2c3e50",
                fontWeight: 700,
                textAlign: "center",
                fontSize: { xs: "2rem", md: "2.5rem" },
              }}
            >
              DONORS OF AMC
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "#666",
                textAlign: "center",
                mb: 4,
                fontSize: "1.1rem",
                maxWidth: 600,
                mx: "auto",
              }}
            >
              Agoura Math Circle thanks the following donors for their generous
              support of our organization.
            </Typography>

            {donorsLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
              </Box>
            ) : donorsError ? (
              <Alert severity="error" sx={{ maxWidth: 600, mx: "auto" }}>
                {donorsError}
              </Alert>
            ) : (
              <Box sx={{ mx: "auto" }}>
                {/* Current Year Donors */}
                {donorsData.currentYearDonors.length > 0 && (
                  <Accordion
                    expanded={expandedYear === "current"}
                    onChange={() => handleYearChange("current")}
                    sx={{ mb: 2 }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMore />}
                      sx={{
                        backgroundColor: "#53b50a",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "#4a9d0a",
                        },
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {donorsData.statistics?.currentYear ||
                          new Date().getFullYear()}{" "}
                        Donors
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 0 }}>
                      {Object.entries(
                        donorService.groupDonorsByLevel(donorsData.currentYearDonors),
                      ).map(([level, donors]) => (
                        <Box key={level} sx={{ mb: 2 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              color: "#2c3e50",
                              fontWeight: 600,
                              mb: 1,
                              pl: 2,
                              pt: 2,
                            }}
                          >
                            {level} Level Donors
                          </Typography>
                          <Grid container spacing={1} sx={{ px: 2, pb: 2 }}>
                            {donors.map((donor, index) => (
                              <Grid item xs={12} sm={6} md={4} key={index}>
                                <Chip
                                  label={donor.donorName || "Anonymous"}
                                  sx={{
                                    backgroundColor:
                                      donorLevels[level]?.color || "#f5f5f5",
                                    color:
                                      donorLevels[level]?.textColor || "#666",
                                    fontWeight: 500,
                                    width: "100%",
                                    justifyContent: "flex-start",
                                  }}
                                  icon={
                                    donorLevels[level]?.icon
                                      ? React.createElement(
                                        donorLevels[level].icon,
                                      )
                                      : undefined
                                  }
                                />
                              </Grid>
                            ))}
                          </Grid>
                        </Box>
                      ))}
                    </AccordionDetails>
                  </Accordion>

                )}

                {/* Past Year Donors */}
                {Object.keys(donorsData.pastYearDonors).map((year) => (
                  <Accordion
                    key={year}
                    expanded={expandedYear === year}
                    onChange={() => handleYearChange(year)}
                    sx={{ mb: 2 }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMore />}
                      sx={{
                        backgroundColor: "#53b50a",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "#4a9d0a",
                        },
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {year} Donors
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 0 }}>
                      {Object.entries(
                        donorService.groupDonorsByLevel(donorsData.pastYearDonors[year] || []),
                      ).map(([level, donors]) => (
                        <Box key={level} sx={{ mb: 2 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              color: "#2c3e50",
                              fontWeight: 600,
                              mb: 1,
                              pl: 2,
                              pt: 2,
                            }}
                          >
                            {level} Level Donors
                          </Typography>
                          <Grid container spacing={1} sx={{ px: 2, pb: 2 }}>
                            {donors.map((donor, index) => (
                              <Grid item xs={12} sm={6} md={4} key={index}>
                                <Chip
                                  label={donor.donorName || "Anonymous"}
                                  sx={{
                                    backgroundColor:
                                      donorLevels[level]?.color || "#f5f5f5",
                                    color:
                                      donorLevels[level]?.textColor || "#666",
                                    fontWeight: 500,
                                    width: "100%",
                                    justifyContent: "flex-start",
                                  }}
                                  icon={
                                    donorLevels[level]?.icon
                                      ? React.createElement(
                                        donorLevels[level].icon,
                                      )
                                      : undefined
                                  }
                                />
                              </Grid>
                            ))}
                          </Grid>
                        </Box>
                      ))}
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            )}
          </Box>
        </Card>
      </Container>



      {/* Scroll to Top Button */}
      <Button
        onClick={scrollToTop}
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          minWidth: "auto",
          width: 50,
          height: 50,
          borderRadius: "50%",
          backgroundColor: "#53b50a",
          color: "white",
          boxShadow: "0 4px 15px rgba(83, 181, 10, 0.3)",
          "&:hover": {
            backgroundColor: "#4a9d0a",
            transform: "translateY(-2px)",
            boxShadow: "0 6px 20px rgba(83, 181, 10, 0.4)",
          },
          zIndex: 1000,
        }}
      >
        <KeyboardArrowUp />
      </Button>

    </div>
  );
};

export default Donate;
