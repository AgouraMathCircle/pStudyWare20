import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  Link,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Avatar,
  CircularProgress,
  Alert,
  IconButton,
  keyframes,
} from "@mui/material";
import {
  AttachMoney,
  Payment,
  AccountBalance,
  Description,
  ExpandMore,
  Diamond,
  Star,
  EmojiEvents,
  WorkspacePremium,
  MilitaryTech,
  KeyboardArrowUp,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { donateService } from "../services";
import "../styles/Donate.css";
// Import images from src/assets
import pageHeaderImg from "../assets/images/about/page-header.jpg";
import donateButtonImg from "../assets/images/donate_button.jpg";
import boxImg from "../assets/images/box.jpg";
// Import sponsor images
import client1Img from "../assets/images/clients/clients-1.png";
import client2Img from "../assets/images/clients/clients-2.png";
import client3Img from "../assets/images/clients/clients-3.png";
import client4Img from "../assets/images/clients/clients-4.png";
import client5Img from "../assets/images/clients/clients-5.png";
import client6Img from "../assets/images/clients/clients-6.png";
import client7Img from "../assets/images/clients/clients-7.png";
import client8Img from "../assets/images/clients/clients-8.png";

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

const Donate = () => {
  const navigate = useNavigate();
  const [donorsData, setDonorsData] = useState({
    currentYearDonors: [],
    pastYearDonors: {},
    statistics: null,
  });
  const [donorsLoading, setDonorsLoading] = useState(true);
  const [donorsError, setDonorsError] = useState(null);
  const [expandedYear, setExpandedYear] = useState("2020");
  const [currentSponsorIndex, setCurrentSponsorIndex] = useState(0);

  // Financial reports data
  const financialReports = [
    { year: "2023", link: "/pstudyware/Documents/Statements/AMC PnL 2023.pdf" },
    { year: "2022", link: "/pstudyware/Documents/Statements/AMC PnL 2022.pdf" },
    { year: "2021", link: "/pstudyware/Documents/Statements/AMC PnL 2021.pdf" },
    { year: "2020", link: "/pstudyware/Documents/Statements/AMC PnL 2020.pdf" },
    { year: "2019", link: "/pstudyware/Documents/Statements/AMC PnL 2019.pdf" },
    { year: "2018", link: "/pstudyware/Documents/Statements/AMC PnL 2018.pdf" },
    { year: "2017", link: "/pstudyware/Documents/Statements/AMC PnL 2017.pdf" },
    { year: "2016", link: "/pstudyware/Documents/Statements/AMC PnL 2016.pdf" },
  ];

  // Sponsors data
  const sponsors = [
    {
      id: 1,
      name: "Alapio",
      image: client1Img,
      link: "https://www.alapio.org",
    },
    {
      id: 2,
      name: "Dr.Bharat Patel & Dr.Ninna Patel Family Foundation",
      image: client2Img,
      link: null,
    },
    {
      id: 3,
      name: "NextPhase Recruiting",
      image: client3Img,
      link: "https://nextphase-recruiting.com",
    },
    {
      id: 4,
      name: "ANDREW XU FAMILY FOUNDATION",
      image: client4Img,
      link: null,
    },
    {
      id: 5,
      name: "Spring Info Services",
      image: client5Img,
      link: "http://springinfoservices.com",
    },
    {
      id: 6,
      name: "Camreal",
      image: client6Img,
      link: "https://www.camreal.com",
    },
    {
      id: 7,
      name: "Bits Informatics",
      image: client7Img,
      link: "https://bitsi.in",
    },
    {
      id: 8,
      name: "Dr.Daksha Jain & Mr.Sudhir Kapadia Family Foundation",
      image: client8Img,
      link: null,
    },
  ];

  const sponsorsPerView = 5; // Show 5 sponsors per view on desktop
  const totalSlides = Math.ceil(sponsors.length / sponsorsPerView);

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

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      nextSponsorSlide();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [currentSponsorIndex]);

  const handlePayPalSubmit = () => {
    // The form will submit to PayPal
    // No need to prevent default as we want the form to submit
  };

  // Carousel functions
  const nextSponsorSlide = () => {
    setCurrentSponsorIndex((prevIndex) =>
      prevIndex === totalSlides - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSponsorSlide = () => {
    setCurrentSponsorIndex((prevIndex) =>
      prevIndex === 0 ? totalSlides - 1 : prevIndex - 1
    );
  };

  const getCurrentSponsors = () => {
    const startIndex = currentSponsorIndex * sponsorsPerView;
    const currentSponsors = sponsors.slice(
      startIndex,
      startIndex + sponsorsPerView
    );

    // If we don't have exactly 5 sponsors, fill with the first sponsors to avoid blanks
    if (currentSponsors.length < sponsorsPerView) {
      const remainingSlots = sponsorsPerView - currentSponsors.length;
      const additionalSponsors = sponsors.slice(0, remainingSlots);
      return [...currentSponsors, ...additionalSponsors];
    }

    return currentSponsors;
  };

  const handleYearChange = (year) => {
    setExpandedYear(expandedYear === year ? null : year);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Group donors by level
  const groupDonorsByLevel = (donors) => {
    const grouped = {};
    donors.forEach((donor) => {
      const level = donor.donorLevel || "BRONZE";
      console.log("Donor:", donor.donorName, "Level:", level);
      if (!grouped[level]) {
        grouped[level] = [];
      }
      grouped[level].push(donor);
    });
    console.log("Grouped Donors:", grouped);
    return grouped;
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
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={6}>
          {/* Left Column - Donate to AMC Section */}
          <Grid item xs={12} md={8}>
            <Card
              elevation={0}
              sx={{
                backgroundColor: "white",
                borderRadius: 0,
                boxShadow: "none",
                border: "none",
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
                <Box sx={{ mb: 3, textAlign: "center" }}>
                  <Box
                    component="form"
                    action="https://www.paypal.com/cgi-bin/webscr"
                    method="post"
                    target="_blank"
                    onSubmit={handlePayPalSubmit}
                    sx={{
                      display: "inline-block",
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
                      sx={{
                        p: 0,
                        minWidth: "auto",
                        "&:hover": {
                          opacity: 0.9,
                        },
                      }}
                    >
                      <img
                        src={donateButtonImg}
                        alt="PayPal - The safer, easier way to pay online!"
                        style={{
                          maxWidth: "100%",
                          height: "auto",
                          borderRadius: "8px",
                          boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                        }}
                      />
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
                  <Typography variant="body2" sx={{ color: "#666", mr: 1 }}>
                    We accept:
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                    }}
                  >
                    {/* Payment method icons/logos would go here */}
                    <Box
                      sx={{
                        width: 40,
                        height: 25,
                        backgroundColor: "#f0f0f0",
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                        color: "#666",
                      }}
                    >
                      VISA
                    </Box>
                    <Box
                      sx={{
                        width: 40,
                        height: 25,
                        backgroundColor: "#f0f0f0",
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                        color: "#666",
                      }}
                    >
                      MC
                    </Box>
                    <Box
                      sx={{
                        width: 40,
                        height: 25,
                        backgroundColor: "#f0f0f0",
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                        color: "#666",
                      }}
                    >
                      AMEX
                    </Box>
                    <Box
                      sx={{
                        width: 40,
                        height: 25,
                        backgroundColor: "#f0f0f0",
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                        color: "#666",
                      }}
                    >
                      DISC
                    </Box>
                    <Box
                      sx={{
                        width: 50,
                        height: 25,
                        backgroundColor: "#f0f0f0",
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                        color: "#666",
                      }}
                    >
                      PayPal
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column - Illustration and Financial Reports */}
          <Grid item xs={12} md={4}>
            {/* Donation Illustration */}
            <Box
              sx={{
                textAlign: "center",
                mb: 4,
                position: "relative",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  maxWidth: 300,
                  height: 200,
                  margin: "0 auto",
                  background:
                    "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
                  borderRadius: "15px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Decorative waves */}
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

                {/* Donation box illustration */}
                <img
                  src={boxImg}
                  alt="Donation Box"
                  style={{
                    maxWidth: "100%",
                    height: "150px",
                    verticalAlign: "middle",
                    boxSizing: "border-box",
                  }}
                />
              </Box>
            </Box>

            {/* Financial Reports Section */}
            <Card
              elevation={2}
              sx={{
                backgroundColor: "white",
                borderRadius: "12px",
                overflow: "hidden",
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
        </Grid>

        {/* Our Sponsors Section */}
        <Box
          sx={{
            backgroundColor: "#e3f8f1",
            padding: { xs: "40px 0", md: "70px 0 100px 0" },
            mt: 8,
            mb: 6,
          }}
        >
          <Container maxWidth="lg">
            {/* Section Header */}
            <Box
              sx={{
                textAlign: "center",
                marginBottom: { xs: "30px", md: "50px" },
                animation: `${fadeInAnimation} 0.8s ease-out`,
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  color: "#102d47",
                  fontWeight: 700,
                  marginBottom: 0,
                  "@media (max-width: 600px)": {
                    fontSize: "28px",
                  },
                }}
              >
                OUR SPONSORS
              </Typography>
            </Box>

            {/* Sponsors Carousel */}
            <Box
              sx={{
                position: "relative",
                animation: `${fadeInAnimation} 0.8s ease-out 0.2s both`,
                maxWidth: "1200px",
                margin: "0 auto",
              }}
            >
              {/* Sponsors Grid */}
              <Grid
                container
                spacing={3}
                justifyContent="center"
                alignItems="center"
              >
                {getCurrentSponsors().map((sponsor, index) => (
                  <Grid
                    xs={6}
                    sm={4}
                    md={2.4}
                    key={`${sponsor.id}-${currentSponsorIndex}-${index}`}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "20px",
                        backgroundColor: "#ffffff",
                        borderRadius: "10px",
                        boxShadow: "0px 0px 16px rgba(4, 59, 80, 0.1)",
                        transition: "all 0.3s ease",
                        animation: `${fadeInAnimation} 0.8s ease-out ${
                          0.3 + index * 0.1
                        }s both`,
                        height: "120px",
                        "&:hover": {
                          transform: "translateY(-5px)",
                          boxShadow: "0px 8px 25px rgba(4, 59, 80, 0.15)",
                        },
                      }}
                    >
                      {sponsor.link ? (
                        <Box
                          component="a"
                          href={sponsor.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%",
                            height: "100%",
                            textDecoration: "none",
                            "&:hover": {
                              opacity: 0.8,
                            },
                          }}
                        >
                          <Box
                            component="img"
                            src={sponsor.image}
                            alt={sponsor.name}
                            sx={{
                              maxWidth: "100%",
                              maxHeight: "80px",
                              objectFit: "contain",
                              filter: "grayscale(100%)",
                              transition: "filter 0.3s ease",
                              "&:hover": {
                                filter: "grayscale(0%)",
                              },
                            }}
                          />
                        </Box>
                      ) : (
                        <Box
                          component="img"
                          src={sponsor.image}
                          alt={sponsor.name}
                          sx={{
                            maxWidth: "100%",
                            maxHeight: "80px",
                            objectFit: "contain",
                            filter: "grayscale(100%)",
                            transition: "filter 0.3s ease",
                            "&:hover": {
                              filter: "grayscale(0%)",
                            },
                          }}
                        />
                      )}
                    </Box>
                  </Grid>
                ))}
              </Grid>

              {/* Navigation Arrows */}
              <IconButton
                onClick={prevSponsorSlide}
                sx={{
                  position: "absolute",
                  left: "-60px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  backgroundColor: "#ffffff",
                  color: "#40c1ec",
                  width: "50px",
                  height: "50px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  "&:hover": {
                    backgroundColor: "#40c1ec",
                    color: "#ffffff",
                  },
                  "@media (max-width: 1200px)": {
                    left: "-40px",
                  },
                  "@media (max-width: 768px)": {
                    left: "10px",
                    top: "auto",
                    bottom: "-60px",
                    transform: "none",
                  },
                }}
              >
                <ChevronLeft />
              </IconButton>

              <IconButton
                onClick={nextSponsorSlide}
                sx={{
                  position: "absolute",
                  right: "-60px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  backgroundColor: "#ffffff",
                  color: "#40c1ec",
                  width: "50px",
                  height: "50px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  "&:hover": {
                    backgroundColor: "#40c1ec",
                    color: "#ffffff",
                  },
                  "@media (max-width: 1200px)": {
                    right: "-40px",
                  },
                  "@media (max-width: 768px)": {
                    right: "10px",
                    top: "auto",
                    bottom: "-60px",
                    transform: "none",
                  },
                }}
              >
                <ChevronRight />
              </IconButton>

              {/* Dots Indicator */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "40px",
                  gap: "8px",
                }}
              >
                {Array.from({ length: totalSlides }, (_, index) => (
                  <Box
                    key={index}
                    onClick={() => setCurrentSponsorIndex(index)}
                    sx={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      backgroundColor:
                        index === currentSponsorIndex
                          ? "#40c1ec"
                          : "rgba(64, 193, 236, 0.3)",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor:
                          index === currentSponsorIndex
                            ? "#40c1ec"
                            : "rgba(64, 193, 236, 0.6)",
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Donors of AMC Section */}
        <Box sx={{ mt: 8, mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              color: "#2c3e50",
              fontWeight: 700,
              textAlign: "center",
              mb: 2,
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
            <Box sx={{ maxWidth: 800, mx: "auto" }}>
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
                      groupDonorsByLevel(donorsData.currentYearDonors)
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
                                        donorLevels[level].icon
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
                      groupDonorsByLevel(donorsData.pastYearDonors[year] || [])
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
                                        donorLevels[level].icon
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
