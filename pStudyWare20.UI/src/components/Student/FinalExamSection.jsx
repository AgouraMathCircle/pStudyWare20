import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Alert,
  Chip
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

const FinalExamSection = () => {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: '#d32f2f' }}>
          Final Exam Information
        </Typography>

        <Alert 
          severity="error" 
          icon={<WarningIcon />}
          sx={{ mb: 3 }}
        >
          <Typography variant="body1" sx={{ mb: 1, fontWeight: 600 }}>
            Spring Semester Online Final Exam
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            The Spring Semester Online Final Exam for Agoura Math Circle is scheduled for Sunday, May 19th, 
            from 2:00 PM PST to 3:30 PM PST. This final exam will be conducted online via Zoom.
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            The meeting information can be found on your dashboard, so please make sure to join the Zoom meeting 
            at least 15 minutes prior to the start time. It is mandatory for all students who missed the onsite exam 
            to take the final exam.
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            By participating in the final exam, you will receive priority in next year's registration process.
          </Typography>
          <Typography variant="body2">
            The final exam will solely focus on the material covered during the Spring Semester, including classwork, 
            homework, and quiz questions. Please note that access to any previous materials will not be available 
            during the exam period.
          </Typography>
        </Alert>

        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<AssignmentIcon />}
            href="/student/final-exam"
            sx={{
              backgroundColor: '#d32f2f',
              '&:hover': { backgroundColor: '#b71c1c' },
              px: 4,
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 600
            }}
          >
            Click - Final Exam
          </Button>
        </Box>

        <Box sx={{ p: 2, backgroundColor: '#fff3e0', borderRadius: 1 }}>
          <Typography variant="body2" sx={{ color: '#e65100' }}>
            <strong>Note:</strong> For the Fall 2024 Registration, it will open during the first week of August 2024. 
            You will receive an email notification regarding this.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default FinalExamSection; 