import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Chip,
  Tabs,
  Tab,
  Divider,
} from "@mui/material";
import donorService from "../services/donorService";

const Donors = () => {
  const [currentYearDonors, setCurrentYearDonors] = useState([]);
  const [pastYearDonors, setPastYearDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentYear] = useState(new Date().getFullYear());
  const [pastYear] = useState(currentYear - 1);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch current year donors
        const currentDonors = await donorService.getCurrentYearDonors(
          currentYear
        );
        setCurrentYearDonors(currentDonors);

        // Fetch past year donors
        const pastDonors = await donorService.getPastYearDonors(pastYear);
        setPastYearDonors(pastDonors);
      } catch (err) {
        console.error("Error fetching donors:", err);
        setError(
          err.message || "Failed to load donors. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDonors();
  }, [currentYear, pastYear]);

  // Group donors by donation level
  const groupDonorsByLevel = (donors) => {
    return donorService.groupDonorsByLevel(donors);
  };

  const getLevelColor = (level) => {
    return donorService.getLevelColor(level);
  };

  const getLevelTextColor = (level) => {
    return donorService.getLevelTextColor(level);
  };

  const renderDonorsSection = (donors, year, title) => {
    if (!donors || donors.length === 0) {
      return (
        <Box textAlign="center" py={4}>
          <Typography variant="body1" color="text.secondary">
            No donors found for {year}.
          </Typography>
        </Box>
      );
    }

    const groupedDonors = groupDonorsByLevel(donors);

    return (
      <Box>
        {Object.entries(groupedDonors).map(([level, levelDonors]) => {
          if (levelDonors.length === 0) return null;

          return (
            <Box key={level} mb={4}>
              <Box textAlign="center" mb={3}>
                <Typography variant="h5" component="h2" gutterBottom>
                  {level} Level Donors
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {levelDonors.length} donor
                  {levelDonors.length !== 1 ? "s" : ""}
                </Typography>
              </Box>

              <Grid container spacing={2}>
                {levelDonors.map((donor, index) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    key={donor.id || index}
                  >
                    <Card
                      sx={{
                        height: "100%",
                        transition: "transform 0.2s ease-in-out",
                        border: `2px solid ${getLevelColor(level)}`,
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: 4,
                        },
                      }}
                    >
                      <CardContent sx={{ textAlign: "center", p: 2 }}>
                        <Chip
                          label={level}
                          sx={{
                            backgroundColor: getLevelColor(level),
                            color: getLevelTextColor(level),
                            fontWeight: "bold",
                            mb: 2,
                            width: "100%",
                          }}
                        />

                        <Typography
                          variant="h6"
                          component="h3"
                          gutterBottom
                          sx={{
                            fontWeight: 600,
                            color: "#102d47",
                          }}
                        >
                          {donor.name || "Anonymous Donor"}
                        </Typography>

                        {donor.amount && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontWeight: 500 }}
                          >
                            {donorService.formatAmount(donor.amount)}
                          </Typography>
                        )}

                        {donor.date && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 1 }}
                          >
                            {donorService.formatDate(donor.date)}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          );
        })}
      </Box>
    );
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Our Generous Donors
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Thank you to our generous supporters who make our programs possible
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="donor year tabs"
          centered
        >
          <Tab
            label={`Current Year (${currentYear})`}
            id="tab-0"
            aria-controls="tabpanel-0"
          />
          <Tab
            label={`Past Year (${pastYear})`}
            id="tab-1"
            aria-controls="tabpanel-1"
          />
        </Tabs>
      </Box>

      <Box
        role="tabpanel"
        hidden={activeTab !== 0}
        id="tabpanel-0"
        aria-labelledby="tab-0"
      >
        {renderDonorsSection(currentYearDonors, currentYear, "Current Year")}
      </Box>

      <Box
        role="tabpanel"
        hidden={activeTab !== 1}
        id="tabpanel-1"
        aria-labelledby="tab-1"
      >
        {renderDonorsSection(pastYearDonors, pastYear, "Past Year")}
      </Box>
    </Container>
  );
};

export default Donors;
