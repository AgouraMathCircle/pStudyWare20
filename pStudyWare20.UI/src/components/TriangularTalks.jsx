import React from "react";
import { Container, Typography, Box, Paper } from "@mui/material";

const TriangularTalks = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h1" component="h1" gutterBottom>
          Triangular Talks
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Discover our innovative Triangular Talks program that brings together
          students, educators, and industry professionals.
        </Typography>
      </Box>

      <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h2" component="h2" gutterBottom>
          About Triangular Talks
        </Typography>
        <Typography variant="body1" paragraph>
          Triangular Talks is a unique program that creates meaningful
          connections between three key groups:
        </Typography>
        <Box component="ul" sx={{ pl: 3 }}>
          <Typography component="li" variant="body1" paragraph>
            <strong>Students:</strong> Young learners eager to explore
            mathematics and engineering
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Educators:</strong> Experienced teachers and mentors who
            guide the learning process
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Industry Professionals:</strong> Experts from various fields
            who share real-world applications
          </Typography>
        </Box>
      </Paper>

      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h2" component="h2" gutterBottom>
          Program Benefits
        </Typography>
        <Typography variant="body1" paragraph>
          This triangular approach provides students with:
        </Typography>
        <Box component="ul" sx={{ pl: 3 }}>
          <Typography component="li" variant="body1" paragraph>
            Real-world context for mathematical concepts
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            Direct access to industry professionals
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            Mentorship opportunities from experienced educators
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            Networking and career exploration possibilities
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default TriangularTalks;
