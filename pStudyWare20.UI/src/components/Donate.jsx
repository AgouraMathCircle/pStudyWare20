import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  Chip,
  Avatar,
  CircularProgress,
  Alert,
  Paper,
  TextField,
  keyframes,
} from "@mui/material";
import {
  Diamond,
  WorkspacePremium,
  EmojiEvents,
  Star,
  MilitaryTech,
  Favorite,
  AttachMoney,
  People,
  ExpandMore,
  CheckCircle,
  CardGiftcard,
  Event,
  School,
  Public,
  Description,
  AccountBalance,
  Receipt,
} from "@mui/icons-material";
import { paypalService } from "../services";
import donorService from "../services/donorService";

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

const slideInAnimation = keyframes`
  0% {
    opacity: 0;
    transform: translateX(-20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
`;

const Donate = () => {
  const [donors, setDonors] = useState([]);
  const [pastDonors, setPastDonors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedAccordion, setExpandedAccordion] = useState("current");
  const [donationAmount, setDonationAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Donation levels with their details
  const donationLevels = [
    {
      name: "Diamond",
      icon: <Diamond sx={{ fontSize: 40, color: "#B9F2FF" }} />,
      amount: "$10,000+",
      color: "#B9F2FF",
      bgColor: "#E3F2FD",
      borderColor: "#B9F2FF",
      benefits: [
        { icon: <CardGiftcard />, text: "Naming rights for a program" },
        { icon: <Event />, text: "VIP event invitations" },
        { icon: <People />, text: "Personal consultation" },
        { icon: <Public />, text: "Recognition on website" },
        { icon: <School />, text: "Annual report feature" },
      ],
      description:
        "Our highest level of support, providing comprehensive recognition and exclusive benefits for major donors.",
    },
    {
      name: "Platinum",
      icon: <WorkspacePremium sx={{ fontSize: 40, color: "#E5E4E2" }} />,
      amount: "$5,000 - $9,999",
      color: "#E5E4E2",
      bgColor: "#F5F5F5",
      borderColor: "#E5E4E2",
      benefits: [
        { icon: <CardGiftcard />, text: "Program sponsorship" },
        { icon: <Event />, text: "Event invitations" },
        { icon: <Public />, text: "Newsletter recognition" },
        { icon: <Public />, text: "Social media shoutout" },
        { icon: <CardGiftcard />, text: "Thank you plaque" },
      ],
      description:
        "Premium support level with significant recognition and special event access.",
    },
    {
      name: "Gold",
      icon: <EmojiEvents sx={{ fontSize: 40, color: "#FFD700" }} />,
      amount: "$2,500 - $4,999",
      color: "#FFD700",
      bgColor: "#FFF8E1",
      borderColor: "#FFD700",
      benefits: [
        { icon: <School />, text: "Classroom sponsorship" },
        { icon: <Event />, text: "Event invitations" },
        { icon: <Public />, text: "Newsletter recognition" },
        { icon: <Public />, text: "Social media mention" },
        { icon: <CardGiftcard />, text: "Thank you certificate" },
      ],
      description:
        "Gold level support with classroom sponsorship and event participation opportunities.",
    },
    {
      name: "Silver",
      icon: <Star sx={{ fontSize: 40, color: "#C0C0C0" }} />,
      amount: "$1,000 - $2,499",
      color: "#C0C0C0",
      bgColor: "#FAFAFA",
      borderColor: "#C0C0C0",
      benefits: [
        { icon: <School />, text: "Student scholarship" },
        { icon: <Event />, text: "Event invitations" },
        { icon: <Public />, text: "Newsletter recognition" },
        { icon: <CardGiftcard />, text: "Thank you letter" },
        { icon: <Public />, text: "Donor wall listing" },
      ],
      description:
        "Silver level support providing student scholarships and community recognition.",
    },
    {
      name: "Bronze",
      icon: <MilitaryTech sx={{ fontSize: 40, color: "#CD7F32" }} />,
      amount: "$500 - $999",
      color: "#CD7F32",
      bgColor: "#FDF5E6",
      borderColor: "#CD7F32",
      benefits: [
        { icon: <School />, text: "General support" },
        { icon: <Public />, text: "Newsletter recognition" },
        { icon: <CardGiftcard />, text: "Thank you letter" },
        { icon: <Public />, text: "Donor wall listing" },
        { icon: <AttachMoney />, text: "Tax deduction" },
      ],
      description:
        "Bronze level support with basic recognition and tax benefits.",
    },
  ];

  // Financial reports data
  const financialReports = [
    { year: "2023", link: "/documents/Statements/AMC PnL 2023.pdf" },
    { year: "2022", link: "/documents/Statements/AMC PnL 2022.pdf" },
    { year: "2021", link: "/documents/Statements/AMC PnL 2021.pdf" },
    { year: "2020", link: "/documents/Statements/AMC PnL 2020.pdf" },
    { year: "2019", link: "/documents/Statements/AMC PnL 2019.pdf" },
    { year: "2018", link: "/documents/Statements/AMC PnL 2018.pdf" },
    { year: "2017", link: "/documents/Statements/AMC PnL 2017.pdf" },
    { year: "2016", link: "/documents/Statements/AMC PnL 2016.pdf" },
  ];

  // Sponsors data
  const sponsors = [
    {
      name: "Alapio",
      image: "/assets/images/clients/clients-1.png",
      link: "https://www.alapio.org",
    },
    { name: "Client 3", image: "/assets/images/clients/clients-3.jpg" },
    {
      name: "NextPhase Recruiting",
      image: "/assets/images/clients/clients-4.png",
      link: "https://nextphase-recruiting.com",
    },
    { name: "Client 5", image: "/assets/images/clients/clients-5.png" },
    { name: "Client 7", image: "/assets/images/clients/clients-7.jpg" },
    {
      name: "Spring Info Services",
      image: "/assets/images/clients/clients-6.png",
      link: "http://springinfoservices.com",
    },
    {
      name: "Bits Informatics",
      image: "/assets/images/clients/clients-8.png",
      link: "https://bitsi.in",
    },
    { name: "Client 2", image: "/assets/images/clients/clients-2.png" },
  ];

  // Fetch donors data from API using axios
  useEffect(() => {
    const fetchDonors = async () => {
      try {
        setLoading(true);
        const currentYear = new Date().getFullYear();

        // Fetch current year donors using the new API
        const currentDonors = await fetchCurrentYearDonors(currentYear);

        // Transform API data to match component structure
        const transformedDonors = currentDonors.map((donor) => ({
          id: donor.id,
          name: donor.name,
          level: donor.donationLevel,
          amount: getDonationAmountByLevel(donor.donationLevel),
          image: getDonorImage(donor.id),
          message: getDonorMessage(donor.donationLevel),
        }));

        setDonors(transformedDonors);

        // Fetch past year donors (last 3 years)
        const pastYears = [currentYear - 1, currentYear - 2, currentYear - 3];
        const pastDonorsData = {};

        for (const year of pastYears) {
          try {
            const pastDonors = await fetchPastYearDonors(year);
            if (pastDonors && pastDonors.length > 0) {
              pastDonorsData[year] = pastDonors.map((donor) => ({
                id: donor.id,
                name: donor.name,
                level: donor.donationLevel,
                amount: getDonationAmountByLevel(donor.donationLevel),
                image: getDonorImage(donor.id),
                message: getDonorMessage(donor.donationLevel),
              }));
            }
          } catch (err) {
            console.warn(`Could not fetch donors for year ${year}:`, err);
          }
        }

        setPastDonors(pastDonorsData);
      } catch (err) {
        console.error("Error fetching donors:", err);
        setError("Failed to load donors. Please try again later.");

        // Fallback data for demonstration
        setDonors([
          {
            id: 1,
            name: "John Smith",
            level: "Diamond",
            amount: 15000,
            image: "/assets/images/team/1.jpg",
            message: "Supporting education for future generations",
          },
          {
            id: 2,
            name: "Sarah Johnson",
            level: "Platinum",
            amount: 7500,
            image: "/assets/images/team/2.jpg",
            message: "Investing in our children's future",
          },
          {
            id: 3,
            name: "Michael Chen",
            level: "Gold",
            amount: 3500,
            image: "/assets/images/team/3.jpg",
            message: "Math education is the foundation of innovation",
          },
          {
            id: 4,
            name: "Emily Davis",
            level: "Silver",
            amount: 1800,
            image: "/assets/images/team/4.jpg",
            message: "Every child deserves quality education",
          },
          {
            id: 5,
            name: "David Wilson",
            level: "Bronze",
            amount: 750,
            image: "/assets/images/team/5.jpg",
            message: "Supporting local education initiatives",
          },
          {
            id: 6,
            name: "Lisa Brown",
            level: "Gold",
            amount: 3000,
            image: "/assets/images/team/6.jpg",
            message: "Building a stronger community through education",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDonors();
  }, []);

  // Handle PayPal return URLs and pending donations
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentId = urlParams.get("paymentId");
    const payerId = urlParams.get("PayerID");
    const token = urlParams.get("token");

    // Check if this is a PayPal return
    if (paymentId && payerId && token) {
      // This is a successful PayPal return
      handleSuccessfulPayment(paymentId, payerId);
    } else if (urlParams.get("canceled") === "true") {
      // This is a canceled PayPal return
      alert("Donation was canceled. You can try again anytime.");
      sessionStorage.removeItem("pendingDonation");
    }

    // Check for pending donation in sessionStorage
    const pendingDonation = sessionStorage.getItem("pendingDonation");
    if (pendingDonation && !paymentId && !payerId) {
      // There's a pending donation but no PayPal return - clear it
      sessionStorage.removeItem("pendingDonation");
    }
  }, []);

  // Helper function to get donation amount by level
  const getDonationAmountByLevel = (level) => {
    const levelAmounts = {
      Diamond: 15000,
      Platinum: 7500,
      Gold: 3500,
      Silver: 1800,
      Bronze: 750,
    };
    return levelAmounts[level] || 1000;
  };

  // Helper function to get donor image
  const getDonorImage = (donorId) => {
    const teamImages = [
      "/assets/images/team/1.jpg",
      "/assets/images/team/2.jpg",
      "/assets/images/team/3.jpg",
      "/assets/images/team/4.jpg",
      "/assets/images/team/5.jpg",
      "/assets/images/team/6.jpg",
      "/assets/images/team/7.jpg",
      "/assets/images/team/8.jpg",
    ];
    return teamImages[(donorId - 1) % teamImages.length];
  };

  // Helper function to get donor message
  const getDonorMessage = (level) => {
    const messages = {
      Diamond: "Supporting education for future generations",
      Platinum: "Investing in our children's future",
      Gold: "Math education is the foundation of innovation",
      Silver: "Every child deserves quality education",
      Bronze: "Supporting local education initiatives",
    };
    return messages[level] || "Making a difference through education";
  };

  const getLevelColor = (level) => {
    const levelData = donationLevels.find((l) => l.name === level);
    return levelData ? levelData.color : "#666";
  };

  const getLevelIcon = (level) => {
    const levelData = donationLevels.find((l) => l.name === level);
    return levelData ? levelData.icon : <AttachMoney />;
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedAccordion(isExpanded ? panel : false);
  };

  const handleDonate = async (level) => {
    try {
      setIsProcessingPayment(true);
      setError(null);

      // Validate required fields
      if (!donorName.trim()) {
        setError("Please enter your name");
        return;
      }

      if (!donorEmail.trim()) {
        setError("Please enter your email");
        return;
      }

      if (!donationAmount || !paypalService.validateAmount(donationAmount)) {
        setError("Please enter a valid donation amount");
        return;
      }

      // Validate amount matches level
      if (!paypalService.isAmountValidForLevel(donationAmount, level)) {
        const range = paypalService.getLevelAmountRange(level);
        setError(
          `For ${level} level, amount must be between $${range.min} and $${range.max}`
        );
        return;
      }

      // Create PayPal payment
      const paymentData = {
        amount: paypalService.formatAmount(donationAmount),
        level: level,
        donorName: donorName.trim(),
        donorEmail: donorEmail.trim(),
        description: `AMC ${level} Level Donation - ${donorName.trim()}`,
      };

      const paymentResponse = await paypalService.createPayment(paymentData);

      // Redirect to PayPal for payment
      if (paymentResponse.approvalUrl) {
        // Store donation data in sessionStorage for retrieval after PayPal redirect
        sessionStorage.setItem(
          "pendingDonation",
          JSON.stringify({
            donorName: donorName.trim(),
            donorEmail: donorEmail.trim(),
            amount: donationAmount,
            level: level,
            paymentId: paymentResponse.paymentId,
          })
        );

        window.location.href = paymentResponse.approvalUrl;
      } else {
        setError("Failed to create PayPal payment. Please try again.");
      }
    } catch (err) {
      console.error("Error processing donation:", err);
      setError(err.message || "Failed to process donation. Please try again.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Function to handle successful PayPal payment and add donor to database
  const handleSuccessfulPayment = async (paymentId, payerId) => {
    try {
      // Execute PayPal payment
      const executeResponse = await paypalService.executePayment(
        paymentId,
        payerId
      );

      if (executeResponse.status === "COMPLETED") {
        // Get stored donation data
        const storedDonation = sessionStorage.getItem("pendingDonation");
        if (storedDonation) {
          const donationData = JSON.parse(storedDonation);

          // Add donor to database
          const newDonor = {
            name: donationData.donorName,
            year: new Date().getFullYear(),
            donationLevel: donationData.level,
            postedBy: "PayPal Donation",
            semester: "Online",
          };

          await addDonor(newDonor);

          // Clear stored data
          sessionStorage.removeItem("pendingDonation");

          // Refresh donors list
          const currentYear = new Date().getFullYear();
          const currentDonors = await fetchCurrentYearDonors(currentYear);
          const transformedDonors = currentDonors.map((donor) => ({
            id: donor.id,
            name: donor.name,
            level: donor.donationLevel,
            amount: getDonationAmountByLevel(donor.donationLevel),
            image: getDonorImage(donor.id),
            message: getDonorMessage(donor.donationLevel),
          }));
          setDonors(transformedDonors);

          // Show success message
          alert(
            "Thank you for your donation! Your payment has been processed successfully."
          );
        }
      }
    } catch (error) {
      console.error("Error handling successful payment:", error);
      alert(
        "Payment was successful, but there was an issue recording your donation. Please contact us."
      );
    }
  };

  const handleLevelSelect = (level) => {
    setSelectedLevel(level);
    const range = paypalService.getLevelAmountRange(level);
    setDonationAmount(range.min.toString());
  };

  const handleAmountChange = (event) => {
    const value = event.target.value;
    setDonationAmount(value);

    // Auto-select level based on amount
    const numAmount = parseFloat(value);
    if (!isNaN(numAmount)) {
      const levels = ["Diamond", "Platinum", "Gold", "Silver", "Bronze"];
      for (const level of levels) {
        if (paypalService.isAmountValidForLevel(numAmount, level)) {
          setSelectedLevel(level);
          break;
        }
      }
    }
  };

  // API functions for donor management
  const fetchCurrentYearDonors = async (year) => {
    try {
      return await donorService.getCurrentYearDonors(year);
    } catch (error) {
      console.error(`Error fetching current year donors for ${year}:`, error);
      throw error;
    }
  };

  const fetchPastYearDonors = async (year) => {
    try {
      return await donorService.getPastYearDonors(year);
    } catch (error) {
      console.error(`Error fetching past year donors for ${year}:`, error);
      throw error;
    }
  };

  const addDonor = async (donorData) => {
    try {
      return await donorService.createDonor(donorData);
    } catch (error) {
      console.error("Error adding donor:", error);
      throw error;
    }
  };

  const updateDonor = async (id, donorData) => {
    try {
      return await donorService.updateDonor(id, donorData);
    } catch (error) {
      console.error(`Error updating donor ${id}:`, error);
      throw error;
    }
  };

  const deleteDonor = async (id) => {
    try {
      return await donorService.deleteDonor(id);
    } catch (error) {
      console.error(`Error deleting donor ${id}:`, error);
      throw error;
    }
  };

  const getDonorById = async (id) => {
    try {
      return await donorService.getDonorById(id);
    } catch (error) {
      console.error(`Error fetching donor ${id}:`, error);
      throw error;
    }
  };

  const getDonorsByLevel = async (level) => {
    try {
      return await donorService.getDonorsByLevel(level);
    } catch (error) {
      console.error(`Error fetching donors for level ${level}:`, error);
      throw error;
    }
  };

  const getDonorStatistics = async () => {
    try {
      return await donorService.getDonorStatistics();
    } catch (error) {
      console.error("Error fetching donor statistics:", error);
      throw error;
    }
  };

  // Admin functions for donor management (could be used in admin panel)
  const handleAddDonor = async (donorData) => {
    try {
      const newDonor = await addDonor(donorData);
      console.log("Donor added successfully:", newDonor);

      // Refresh current year donors
      const currentYear = new Date().getFullYear();
      const currentDonors = await fetchCurrentYearDonors(currentYear);
      const transformedDonors = currentDonors.map((donor) => ({
        id: donor.id,
        name: donor.name,
        level: donor.donationLevel,
        amount: getDonationAmountByLevel(donor.donationLevel),
        image: getDonorImage(donor.id),
        message: getDonorMessage(donor.donationLevel),
      }));
      setDonors(transformedDonors);

      return newDonor;
    } catch (error) {
      console.error("Error adding donor:", error);
      throw error;
    }
  };

  const handleUpdateDonor = async (id, donorData) => {
    try {
      const updatedDonor = await updateDonor(id, donorData);
      console.log("Donor updated successfully:", updatedDonor);

      // Refresh current year donors
      const currentYear = new Date().getFullYear();
      const currentDonors = await fetchCurrentYearDonors(currentYear);
      const transformedDonors = currentDonors.map((donor) => ({
        id: donor.id,
        name: donor.name,
        level: donor.donationLevel,
        amount: getDonationAmountByLevel(donor.donationLevel),
        image: getDonorImage(donor.id),
        message: getDonorMessage(donor.donationLevel),
      }));
      setDonors(transformedDonors);

      return updatedDonor;
    } catch (error) {
      console.error("Error updating donor:", error);
      throw error;
    }
  };

  const handleDeleteDonor = async (id) => {
    try {
      const success = await deleteDonor(id);
      if (success) {
        console.log("Donor deleted successfully");

        // Refresh current year donors
        const currentYear = new Date().getFullYear();
        const currentDonors = await fetchCurrentYearDonors(currentYear);
        const transformedDonors = currentDonors.map((donor) => ({
          id: donor.id,
          name: donor.name,
          level: donor.donationLevel,
          amount: getDonationAmountByLevel(donor.donationLevel),
          image: getDonorImage(donor.id),
          message: getDonorMessage(donor.donationLevel),
        }));
        setDonors(transformedDonors);
      }
      return success;
    } catch (error) {
      console.error("Error deleting donor:", error);
      throw error;
    }
  };

  const groupDonorsByLevel = (donors) => {
    const grouped = {
      Diamond: [],
      Platinum: [],
      Gold: [],
      Silver: [],
      Bronze: [],
    };

    donors.forEach((donor) => {
      if (grouped[donor.level]) {
        grouped[donor.level].push(donor);
      }
    });

    return grouped;
  };

  const groupedDonors = groupDonorsByLevel(donors);

  // Helper function to render donor list
  const renderDonorList = (donors) => {
    const grouped = groupDonorsByLevel(donors);

    return Object.entries(grouped).map(
      ([level, levelDonors]) =>
        levelDonors.length > 0 && (
          <Box key={level} sx={{ marginBottom: "20px" }}>
            <Typography
              variant="h6"
              sx={{
                color: "#102d47",
                fontWeight: 600,
                marginBottom: "10px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              {getLevelIcon(level)}
              {level} Level Donors
            </Typography>
            <List sx={{ padding: 0 }}>
              {levelDonors.map((donor) => (
                <ListItem
                  key={donor.id}
                  sx={{
                    padding: "8px 0",
                    borderBottom: "1px solid #f0f0f0",
                  }}
                >
                  <ListItemIcon>
                    <CheckCircle sx={{ color: getLevelColor(level) }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={donor.name}
                    sx={{
                      "& .MuiListItemText-primary": {
                        color: "#102d47",
                        fontWeight: 500,
                      },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )
    );
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
        padding: { xs: "40px 0", md: "80px 0" },
      }}
    >
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box
          sx={{
            textAlign: "center",
            marginBottom: { xs: "40px", md: "60px" },
            animation: `${fadeInAnimation} 0.8s ease-out`,
          }}
        >
          <Typography
            variant="h2"
            sx={{
              color: "#102d47",
              fontWeight: 700,
              marginBottom: "20px",
              "@media (max-width: 600px)": {
                fontSize: "32px",
              },
            }}
          >
            DONATIONS
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: "#666",
              maxWidth: "800px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Support Agoura Math Circle - A student-run nonprofit, tax-exempt
            501(c) community service organization
          </Typography>
        </Box>

        {/* Main Content Section */}
        <Grid
          container
          spacing={4}
          sx={{ marginBottom: { xs: "40px", md: "60px" } }}
        >
          {/* Left Column - Donation Information */}
          <Grid item xs={12} lg={8}>
            <Card
              sx={{
                padding: { xs: "20px", md: "30px" },
                borderRadius: "15px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                animation: `${fadeInAnimation} 0.8s ease-out 0.2s both`,
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  color: "#102d47",
                  fontWeight: 700,
                  marginBottom: "20px",
                }}
              >
                Donate to <span style={{ color: "#53b50a" }}>AMC</span>
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: "#666",
                  lineHeight: 1.8,
                  marginBottom: "20px",
                }}
              >
                The Agoura Math Circle is a student run nonprofit, tax exempt
                501(c) community service organization and needs your help to
                maintain the various events that we hold. Please note that
                donations are tax-deductible. We graciously accept donations at
                our events.
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: "#666",
                  lineHeight: 1.8,
                  marginBottom: "20px",
                }}
              >
                Please make the payment to Agoura Math Circle using Credit Card.
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  color: "#53b50a",
                  fontWeight: 600,
                  marginBottom: "30px",
                }}
              >
                Our Tax ID: 81-1050140
              </Typography>

              {/* PayPal Integration */}
              <Box
                sx={{
                  border: "2px solid #e0e0e0",
                  borderRadius: "10px",
                  padding: "20px",
                  backgroundColor: "#fafafa",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: "#102d47",
                    marginBottom: "20px",
                    textAlign: "center",
                  }}
                >
                  Make a Donation
                </Typography>

                {error && (
                  <Alert severity="error" sx={{ marginBottom: "20px" }}>
                    {error}
                  </Alert>
                )}

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Your Name"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      required
                      sx={{ marginBottom: "15px" }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Your Email"
                      type="email"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      required
                      sx={{ marginBottom: "15px" }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Donation Amount ($)"
                      type="number"
                      value={donationAmount}
                      onChange={handleAmountChange}
                      required
                      inputProps={{ min: "1", step: "0.01" }}
                      sx={{ marginBottom: "15px" }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#666",
                        marginBottom: "10px",
                        textAlign: "center",
                      }}
                    >
                      Select Donation Level:
                    </Typography>
                    <Grid container spacing={1} justifyContent="center">
                      {donationLevels.map((level) => (
                        <Grid item key={level.name}>
                          <Chip
                            label={level.name}
                            onClick={() => handleLevelSelect(level.name)}
                            sx={{
                              backgroundColor:
                                selectedLevel === level.name
                                  ? level.color
                                  : "#e0e0e0",
                              color:
                                selectedLevel === level.name ? "#fff" : "#666",
                              cursor: "pointer",
                              "&:hover": {
                                backgroundColor:
                                  selectedLevel === level.name
                                    ? level.color
                                    : "#d0d0d0",
                              },
                            }}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<AttachMoney />}
                      onClick={() => handleDonate(selectedLevel || "Bronze")}
                      disabled={
                        isProcessingPayment ||
                        !donorName ||
                        !donorEmail ||
                        !donationAmount
                      }
                      fullWidth
                      sx={{
                        backgroundColor: "#53b50a",
                        color: "#fff",
                        fontWeight: 600,
                        textTransform: "none",
                        borderRadius: "25px",
                        padding: "12px 30px",
                        fontSize: "18px",
                        marginTop: "10px",
                        "&:hover": {
                          backgroundColor: "#45a049",
                        },
                        "&:disabled": {
                          backgroundColor: "#ccc",
                          color: "#666",
                        },
                      }}
                    >
                      {isProcessingPayment
                        ? "Processing..."
                        : "Donate with PayPal"}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Card>
          </Grid>

          {/* Right Column - Financial Reports */}
          <Grid item xs={12} lg={4}>
            <Card
              sx={{
                padding: { xs: "20px", md: "30px" },
                borderRadius: "15px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                animation: `${fadeInAnimation} 0.8s ease-out 0.3s both`,
              }}
            >
              <Box
                sx={{
                  textAlign: "center",
                  marginBottom: "20px",
                }}
              >
                <img
                  src="/assets/images/box.jpg"
                  alt="Donation Box"
                  style={{
                    width: "100%",
                    maxWidth: "150px",
                    height: "auto",
                    borderRadius: "10px",
                  }}
                />
              </Box>

              <Typography
                variant="h4"
                sx={{
                  color: "#102d47",
                  fontWeight: 700,
                  textAlign: "center",
                  marginBottom: "20px",
                }}
              >
                FINANCIAL REPORTS
              </Typography>

              <List sx={{ padding: 0 }}>
                {financialReports.map((report, index) => (
                  <ListItem
                    key={report.year}
                    sx={{
                      padding: "8px 0",
                      borderBottom:
                        index < financialReports.length - 1
                          ? "1px solid #e0e0e0"
                          : "none",
                    }}
                  >
                    <ListItemIcon>
                      <Description sx={{ color: "#53b50a" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={`${report.year} Statement`}
                      sx={{
                        "& .MuiListItemText-primary": {
                          color: "#102d47",
                          fontWeight: 500,
                        },
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Card>
          </Grid>
        </Grid>

        {/* Sponsors Section */}
        <Box
          sx={{
            marginBottom: { xs: "40px", md: "60px" },
            animation: `${fadeInAnimation} 0.8s ease-out 0.4s both`,
          }}
        >
          <Typography
            variant="h3"
            sx={{
              textAlign: "center",
              color: "#102d47",
              fontWeight: 600,
              marginBottom: "40px",
            }}
          >
            OUR SPONSORS
          </Typography>

          <Grid container spacing={3} justifyContent="center">
            {sponsors.map((sponsor, index) => (
              <Grid item xs={6} sm={4} md={3} lg={2} key={sponsor.name}>
                <Card
                  sx={{
                    padding: "15px",
                    textAlign: "center",
                    borderRadius: "10px",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  <img
                    src={sponsor.image}
                    alt={sponsor.name}
                    style={{
                      width: "100%",
                      height: "auto",
                      maxHeight: "80px",
                      objectFit: "contain",
                    }}
                  />
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Donors Section */}
        <Box
          sx={{
            animation: `${fadeInAnimation} 0.8s ease-out 0.5s both`,
          }}
        >
          <Typography
            variant="h3"
            sx={{
              textAlign: "center",
              color: "#102d47",
              fontWeight: 600,
              marginBottom: "20px",
            }}
          >
            DONORS OF AMC
          </Typography>
          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
              color: "#666",
              marginBottom: "40px",
            }}
          >
            Agoura Math Circle thanks the following donors for their generous
            support of our organization.
          </Typography>

          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                padding: "60px 0",
              }}
            >
              <CircularProgress size={60} />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ marginBottom: "20px" }}>
              {error}
            </Alert>
          ) : (
            <Box sx={{ maxWidth: "1000px", margin: "0 auto" }}>
              {/* Current Year Donors */}
              <Accordion
                expanded={expandedAccordion === "current"}
                onChange={handleAccordionChange("current")}
                sx={{
                  marginBottom: "16px",
                  borderRadius: "12px",
                  border: "2px solid #53b50a",
                  backgroundColor: "#f8fff8",
                  "&:before": {
                    display: "none",
                  },
                  "&.Mui-expanded": {
                    margin: "16px 0",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={
                    <ExpandMore sx={{ color: "#53b50a", fontSize: 28 }} />
                  }
                  sx={{
                    padding: "20px 24px",
                    "& .MuiAccordionSummary-content": {
                      margin: 0,
                    },
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color: "#102d47",
                    }}
                  >
                    {new Date().getFullYear()} Donors
                  </Typography>
                </AccordionSummary>
                <AccordionDetails
                  sx={{
                    padding: "0 24px 24px",
                    backgroundColor: "rgba(255,255,255,0.8)",
                  }}
                >
                  {renderDonorList(donors)}
                </AccordionDetails>
              </Accordion>

              {/* Historical Donors */}
              {Object.keys(pastDonors).map((year) => (
                <Accordion
                  key={year}
                  expanded={expandedAccordion === year}
                  onChange={handleAccordionChange(year)}
                  sx={{
                    marginBottom: "16px",
                    borderRadius: "12px",
                    border: "2px solid #e0e0e0",
                    backgroundColor: "#fafafa",
                    "&:before": {
                      display: "none",
                    },
                    "&.Mui-expanded": {
                      margin: "16px 0",
                      boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={
                      <ExpandMore sx={{ color: "#666", fontSize: 28 }} />
                    }
                    sx={{
                      padding: "20px 24px",
                      "& .MuiAccordionSummary-content": {
                        margin: 0,
                      },
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: "#102d47",
                      }}
                    >
                      {year} Donors
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails
                    sx={{
                      padding: "0 24px 24px",
                      backgroundColor: "rgba(255,255,255,0.8)",
                    }}
                  >
                    {renderDonorList(pastDonors[year])}
                  </AccordionDetails>
                </Accordion>
              ))}

              {/* Show message if no past donors */}
              {Object.keys(pastDonors).length === 0 && (
                <Accordion
                  expanded={expandedAccordion === "historical"}
                  onChange={handleAccordionChange("historical")}
                  sx={{
                    marginBottom: "16px",
                    borderRadius: "12px",
                    border: "2px solid #e0e0e0",
                    backgroundColor: "#fafafa",
                    "&:before": {
                      display: "none",
                    },
                    "&.Mui-expanded": {
                      margin: "16px 0",
                      boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={
                      <ExpandMore sx={{ color: "#666", fontSize: 28 }} />
                    }
                    sx={{
                      padding: "20px 24px",
                      "& .MuiAccordionSummary-content": {
                        margin: 0,
                      },
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: "#102d47",
                      }}
                    >
                      Historical Donors
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails
                    sx={{
                      padding: "0 24px 24px",
                      backgroundColor: "rgba(255,255,255,0.8)",
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#666",
                        textAlign: "center",
                        fontStyle: "italic",
                      }}
                    >
                      Historical donor data will be displayed here when
                      available.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              )}
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default Donate;
