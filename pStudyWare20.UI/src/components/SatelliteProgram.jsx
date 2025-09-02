import React from "react";
import { Container, Typography, Box, Paper, Button } from "@mui/material";
import { Satellite } from "@mui/icons-material";

const SatelliteProgram = () => (
  <Container maxWidth="lg" sx={{ py: 4 }}>
    <Paper elevation={3} sx={{ p: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Satellite sx={{ mr: 2, fontSize: 40, color: "primary.main" }} />
        <Typography variant="h3" component="h1">
          Satellite Program
        </Typography>
      </Box>
      <Typography variant="body1" paragraph>
        Our satellite program extends our educational reach to students in
        remote locations. We collaborate with students, teachers, schools, and
        educational institutions to support the setup of their own clubs, study
        groups, or enrichment classes.
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>Benefits:</strong> Start your own educational club
        <br />
        <strong>Support:</strong> Guidance and resources provided
        <br />
        <strong>Reach:</strong> Available worldwide
      </Typography>
      <Box sx={{ mt: 3 }}>
        <Button variant="contained" color="primary" sx={{ mr: 2 }}>
          Join Program
        </Button>
        <Button variant="outlined" color="primary">
          Learn More
        </Button>
      </Box>
    </Paper>
  </Container>
);

export default SatelliteProgram;
