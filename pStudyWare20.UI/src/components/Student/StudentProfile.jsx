import React from 'react';
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
  IconButton,
  Chip
} from '@mui/material';
import {
  Edit as EditIcon,
  Person as PersonIcon
} from '@mui/icons-material';

const StudentProfile = ({ profileData }) => {
  const handleEditProfile = (studentId) => {
    // TODO: Navigate to edit profile page
    console.log('Edit profile for student:', studentId);
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <PersonIcon sx={{ mr: 1, color: '#1976d2' }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2' }}>
            Student Profile
          </Typography>
        </Box>

        <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Student #
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Student Name
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Program
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Class
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
                    Parent
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Contact #
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Email
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Session
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Location
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Actions
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {profileData.map((student) => (
                <TableRow key={student.studentId} hover>
                  <TableCell>{student.studentId}</TableCell>
                  <TableCell>{student.studentName}</TableCell>
                  <TableCell>
                    <Chip 
                      label={student.program} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{student.class}</TableCell>
                  <TableCell>{student.grade}</TableCell>
                  <TableCell>{student.school}</TableCell>
                  <TableCell>{student.parentName}</TableCell>
                  <TableCell>{student.phoneNumber}</TableCell>
                  <TableCell>{student.emailAddress}</TableCell>
                  <TableCell>
                    <Chip 
                      label={student.eventSession} 
                      size="small" 
                      color="secondary" 
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{student.eventLocation}</TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleEditProfile(student.studentId)}
                      sx={{ color: '#53b50a' }}
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 2, p: 2, backgroundColor: '#e3f2fd', borderRadius: 1 }}>
          <Typography variant="body2" sx={{ color: '#1976d2', fontSize: '0.875rem' }}>
            <strong>Note:</strong> Please keep your profile information up to date. 
            Click the edit icon to update your student profile information.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StudentProfile; 