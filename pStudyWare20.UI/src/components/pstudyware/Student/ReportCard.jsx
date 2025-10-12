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
  Chip
} from '@mui/material';
import {
  Assessment as AssessmentIcon
} from '@mui/icons-material';

const ReportCard = ({ reportCardData }) => {
  const getScoreColor = (score, totalScore) => {
    const percentage = (score / totalScore) * 100;
    if (percentage >= 90) return '#4caf50';
    if (percentage >= 80) return '#ff9800';
    if (percentage >= 70) return '#ff5722';
    return '#f44336';
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AssessmentIcon sx={{ mr: 1, color: '#1976d2' }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2' }}>
            Last Session - Report Card
          </Typography>
        </Box>

        <TableContainer component={Paper} sx={{ maxHeight: 200 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Student Name
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Class
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Session
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Exam Type
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Exam Date
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Total Score
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Top Score
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    AVG Score
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Your Score
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Comments
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reportCardData.map((report, index) => (
                <TableRow key={index} hover>
                  <TableCell>{report.studentName}</TableCell>
                  <TableCell>{report.group}</TableCell>
                  <TableCell>
                    <Chip 
                      label={report.semester} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{report.examType}</TableCell>
                  <TableCell>{new Date(report.examDate).toLocaleDateString()}</TableCell>
                  <TableCell>{report.totalCredit}</TableCell>
                  <TableCell>{report.highestScore}</TableCell>
                  <TableCell>{report.classAverage}</TableCell>
                  <TableCell>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 600,
                        color: getScoreColor(report.receivedCredit, report.totalCredit)
                      }}
                    >
                      {report.receivedCredit}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                      {report.comments}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 2, p: 2, backgroundColor: '#e8f5e8', borderRadius: 1 }}>
          <Typography variant="body2" sx={{ color: '#2e7d32', fontSize: '0.875rem' }}>
            <strong>Performance Summary:</strong> Keep up the great work! Continue practicing and reviewing 
            class materials to improve your scores.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ReportCard; 