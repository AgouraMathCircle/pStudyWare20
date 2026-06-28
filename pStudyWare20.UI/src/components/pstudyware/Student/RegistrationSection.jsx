import React, { useState, useEffect } from 'react';
import {
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
import studentDashboardService from '../../../services/studentDashboardService';
import { APPLICATION_ADMIN_TITLE_COLOR } from '../styles/applicationSurfaces';

const RegistrationSection = ({ registrationData, username, onSuccess, onError }) => {
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [submitMessage, setSubmitMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasOpenRegistration, setHasOpenRegistration] = useState(false);

  // Check if there are any open registrations
  useEffect(() => {
    if (registrationData && registrationData.length > 0) {
      const hasOpen = registrationData.some(
        student => student.regStatus === 'Open' || student.regStatus === 'open'
      );
      setHasOpenRegistration(hasOpen);
    }
  }, [registrationData]);

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
      if (onError) {
        onError('Please select at least one student to register.');
      }
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      console.log('RegistrationSection: Submitting registration for students:', selectedStudents);

      // Submit registration for each selected student
      for (const studentId of selectedStudents) {
        console.log('RegistrationSection: Registering student ID:', studentId);

        // Call the API to submit registration
        const response = await studentDashboardService.submitRegistration(
          studentId,
          username
        );

        console.log('RegistrationSection: Registration response:', response);

        if (!response.isSuccess) {
          throw new Error(response.message || 'Registration failed');
        }
      }

      // All registrations successful
      const successMessage = selectedStudents.length === 1
        ? 'You have successfully registered for Fall 2024 session.'
        : `Successfully registered ${selectedStudents.length} students for Fall 2024 session.`;

      setSubmitMessage(successMessage);
      setSelectedStudents([]);

      // Notify parent component of success
      if (onSuccess) {
        onSuccess(successMessage);
      }

    } catch (error) {
      console.error('RegistrationSection: Error submitting registration:', error);
      const errorMessage = error.message || 'Error submitting registration. Please try again.';
      setSubmitMessage(errorMessage);

      // Notify parent component of error
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'Open':
        return <Chip label="Open" color="success" size="small" sx={{ fontSize: '0.7rem' }} />;
      case 'Closed':
        return <Chip label="Closed" color="error" size="small" sx={{ fontSize: '0.7rem' }} />;
      case 'Waiting List':
        return <Chip label="Waiting List" color="warning" size="small" sx={{ fontSize: '0.7rem' }} />;
      default:
        return <Chip label={status} color="default" size="small" sx={{ fontSize: '0.7rem' }} />;
    }
  };

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: APPLICATION_ADMIN_TITLE_COLOR, fontSize: '1rem' }}>
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
              <TableCell padding="checkbox" sx={{ fontSize: '0.75rem', padding: '3px 5px' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
                  Select
                </Typography>
              </TableCell>
              <TableCell sx={{ fontSize: '0.75rem', padding: '3px 5px' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
                  Student ID
                </Typography>
              </TableCell>
              <TableCell sx={{ fontSize: '0.75rem', padding: '3px 5px' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
                  Name
                </Typography>
              </TableCell>
              <TableCell sx={{ fontSize: '0.75rem', padding: '3px 5px' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
                  Location
                </Typography>
              </TableCell>
              <TableCell sx={{ fontSize: '0.75rem', padding: '3px 5px' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
                  Grade
                </Typography>
              </TableCell>
              <TableCell sx={{ fontSize: '0.75rem', padding: '3px 5px' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
                  School
                </Typography>
              </TableCell>
              <TableCell sx={{ fontSize: '0.75rem', padding: '3px 5px' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
                  Parent Name
                </Typography>
              </TableCell>
              <TableCell sx={{ fontSize: '0.75rem', padding: '3px 5px' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
                  Class
                </Typography>
              </TableCell>
              <TableCell sx={{ fontSize: '0.75rem', padding: '3px 5px' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
                  Status
                </Typography>
              </TableCell>
              <TableCell sx={{ fontSize: '0.75rem', padding: '3px 5px' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
                  Available Space
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {registrationData.map((student) => {
              const status = student.regStatus || '';
              const isClosed = status.toLowerCase().includes('closed') || status.toLowerCase() === 'full - closed';
              const isWaitingList = status.toLowerCase().includes('waiting');
              const isOpen = status.toLowerCase() === 'open' && !isClosed && !isWaitingList;

              return (
                <TableRow key={student.studentId} hover>
                  <TableCell padding="checkbox" sx={{ fontSize: '0.75rem', padding: '3px 5px' }}>
                    {isOpen ? (
                      <Checkbox
                        checked={selectedStudents.includes(student.studentId)}
                        onChange={() => handleStudentSelection(student.studentId)}
                        disabled={false}
                      />
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {isClosed && (
                          <Chip label="Closed" color="error" size="small" sx={{ fontSize: '0.7rem' }} />
                        )}
                        {isWaitingList && (
                          <Chip label="Waiting" color="warning" size="small" sx={{ fontSize: '0.7rem' }} />
                        )}
                      </Box>
                    )}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', padding: '3px 5px' }}>{student.studentId}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', padding: '3px 5px' }}>{student.studentName}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', padding: '3px 5px' }}>{student.eventLocation}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', padding: '3px 5px' }}>{student.grade}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', padding: '3px 5px' }}>{student.school}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', padding: '3px 5px' }}>{student.parentName}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', padding: '3px 5px' }}>{student.class}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', padding: '3px 5px' }}>
                    {getStatusChip(student.regStatus)}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', padding: '3px 5px' }}>{student.openSpace}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Submit Button - Only show if there are open registrations */}
      {hasOpenRegistration && (
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
      )}

      {/* Message if no open registrations */}
      {!hasOpenRegistration && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            Registration is currently closed or all students are on the waiting list.
            Please contact us via Message Center if you have any questions.
          </Typography>
        </Alert>
      )}

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
    </Box>
  );
};

export default RegistrationSection; 