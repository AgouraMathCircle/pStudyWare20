import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Box, Button, Container, Paper, Grid } from "@mui/material";
import { authService, userService } from "../services";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);

    // Fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        const data = await userService.getDashboardData();
        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    authService.logout();
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4">Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography variant="h4" component="h1">
            Welcome to Dashboard
          </Typography>
          <Button variant="outlined" color="error" onClick={handleLogout}>
            Logout
          </Button>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                User Information
              </Typography>
              {user && (
                <Box>
                  <Typography>
                    <strong>Email:</strong> {user.email}
                  </Typography>
                  <Typography>
                    <strong>Name:</strong> {user.name || "N/A"}
                  </Typography>
                  <Typography>
                    <strong>Role:</strong> {user.role || "User"}
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Dashboard Data
              </Typography>
              {dashboardData ? (
                <Box>
                  <Typography>
                    <strong>Status:</strong> {dashboardData.status || "Active"}
                  </Typography>
                  <Typography>
                    <strong>Last Login:</strong>{" "}
                    {dashboardData.lastLogin || "N/A"}
                  </Typography>
                </Box>
              ) : (
                <Typography color="text.secondary">
                  No dashboard data available
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Dashboard;
