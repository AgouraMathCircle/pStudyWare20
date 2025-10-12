import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Button,
  Alert,
  Chip,
  Divider
} from '@mui/material';
import {
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';

const RegistrationSection = ({ registrationData }) => {
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [submitMessage, setSubmitMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStudentSelection = (studentId) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSubmit = async () => {
    if (selectedStudents.length === 0) {
      setSubmitMessage('Please select at least one student to register.');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      // TODO: Replace with actual API call
      // await api.post('/student/register', { studentIds: selectedStudents });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitMessage('Registration submitted successfully!');
      setSelectedStudents([]);
    } catch (error) {
      setSubmitMessage('Error submitting registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'Open':
        return <Chip label="Open" color="success" size="small" />;
      case 'Closed':
        return <Chip label="Closed" color="error" size="small" />;
      case 'Waiting List':
        return <Chip label="Waiting List" color="warning" size="small" />;
      default:
        return <Chip label={status} color="default" size="small" />;
    }
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: '#1976d2' }}>
          Course Registration
        </Typography>

        {/* Important Notice */}
        <Alert 
          severity="warning" 
          icon={<WarningIcon />}
          sx={{ mb: 3 }}
        >
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Note:</strong> Agoura Math Circle YouTube channel subscription is required for all students. 
            We will publish all of the lecture videos. If you are not subscribed, your application will be declined.
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Subscribe to:</strong>{' '}
            <a 
              href="https://www.youtube.com/channel/UCWK2w-BVGps-Y9c08B5pRgA/videos" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#1976d2', textDecoration: 'none' }}
            >
              Agoura Math Circle YouTube Channel
            </a>
          </Typography>
        </Alert>

        {/* Registration Instructions */}
        <Box sx={{ mb: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="h6" sx={{ mb: 1, color: '#1976d2' }}>
            Registration Steps:
          </Typography>
          <Box component="ol" sx={{ pl: 2, m: 0 }}>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
              Select the check box and click the submit button.
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
              After registering, please update your student profile. Click the Edit pencil icon and update the student's Profile. This is REQUIRED.
            </Typography>
            <Typography component="li" variant="body2">
              If you have any questions, please contact us via Message Center.
            </Typography>
          </Box>
        </Box>

        {/* Registration Table */}
        <TableContainer component={Paper} sx={{ mb: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell padding="checkbox">
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Select
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Student ID
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Name
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Location
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Grade
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    School
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Parent Name
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Class
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Status
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Available Space
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {registrationData.map((student) => (
                <TableRow key={student.studentId} hover>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedStudents.includes(student.studentId)}
                      onChange={() => handleStudentSelection(student.studentId)}
                      disabled={student.regStatus === 'Closed'}
                    />
                  </TableCell>
                  <TableCell>{student.studentId}</TableCell>
                  <TableCell>{student.studentName}</TableCell>
                  <TableCell>{student.eventLocation}</TableCell>
                  <TableCell>{student.grade}</TableCell>
                  <TableCell>{student.school}</TableCell>
                  <TableCell>{student.parentName}</TableCell>
                  <TableCell>{student.class}</TableCell>
                  <TableCell>
                    {getStatusChip(student.regStatus)}
                  </TableCell>
                  <TableCell>{student.openSpace}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Submit Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isSubmitting || selectedStudents.length === 0}
            sx={{
              backgroundColor: '#53b50a',
              '&:hover': { backgroundColor: '#4a7c59' },
              '&:disabled': { backgroundColor: '#cccccc' },
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Registration'}
          </Button>
        </Box>

        {/* Submit Message */}
        {submitMessage && (
          <Alert 
            severity={submitMessage.includes('successfully') ? 'success' : 'error'}
            icon={submitMessage.includes('successfully') ? <CheckCircleIcon /> : <CancelIcon />}
            sx={{ mt: 2 }}
          >
            {submitMessage}
          </Alert>
        )}

        {/* Additional Information */}
        <Divider sx={{ my: 2 }} />
        <Box sx={{ p: 2, backgroundColor: '#e8f5e8', borderRadius: 1 }}>
          <Typography variant="body2" sx={{ color: '#2e7d32' }}>
            <strong>Important:</strong> If your kids are planning to attend our Fall 2024, please register ASAP. 
            We have a limited amount of slots and there are many students in the waiting list. 
            Please don't register if you are not planning to attend the Agoura Math Circle's Fall 2024. 
            It will help us accommodate the waiting list students.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RegistrationSection; 