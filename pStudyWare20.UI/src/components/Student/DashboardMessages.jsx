import React, { useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Alert,
  Link,
  Chip,
  Divider,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import {
  Warning as WarningIcon,
  Info as InfoIcon,
  YouTube as YouTubeIcon,
  Message as MessageIcon,
  School as SchoolIcon,
  Engineering as EngineeringIcon,
  Assignment as AssignmentIcon,
  VideoCall as VideoCallIcon,
  Edit as EditIcon,
} from "@mui/icons-material";

const DashboardMessages = ({ messages, announcements }) => {
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [showRegistration, setShowRegistration] = useState(true);
  const [showFinalExam, setShowFinalExam] = useState(false);
  const [showWaitingList, setShowWaitingList] = useState(false);

  // Mock registration data - this would come from API
  const registrationData = [
    {
      studentId: "001",
      studentName: "John Doe",
      eventLocation: "Agoura Hills",
      grade: "8th Grade",
      school: "Lindero Canyon Middle School",
      parentName: "Jane Doe",
      class: "Advanced Math",
      regStatus: "Open",
      openSpace: "5",
    },
  ];

  const handleStudentSelection = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSubmitRegistration = () => {
    console.log("Submitting registration for students:", selectedStudents);
    // TODO: API call to submit registration
  };

  return (
    <Box sx={{ mb: 3 }}>
      {/* Dashboard Messages Section */}
      <Card sx={{ mb: 3, backgroundColor: "#f5f5f5" }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Dashboard Messages
          </Typography>
          {/* This would be populated from the pStudyware_DashboardMessage.ascx component */}
          <Typography variant="body2" color="text.secondary">
            Welcome to your student dashboard. Check for important announcements
            and updates.
          </Typography>
        </CardContent>
      </Card>

      {/* Registration Window Section */}
      {showRegistration && (
        <Card sx={{ mb: 3, border: "2px solid #ff9800" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <WarningIcon sx={{ color: "#ff9800", mr: 1 }} />
              <Typography
                variant="h6"
                sx={{ color: "#ff9800", fontWeight: 600 }}
              >
                Registration Window
              </Typography>
            </Box>

            {/* Registration Status Messages */}
            {!showWaitingList && (
              <Box sx={{ mb: 2 }}>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body2" sx={{ color: "blue", mb: 1 }}>
                  Note: Agoura Math Circle YouTube channel subscription is
                  required for all students. We will publish all of the lecture
                  videos.
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "red",
                    fontSize: "1.2rem",
                    fontWeight: 600,
                    mb: 1,
                  }}
                >
                  If you are not Subscribed, your application will be declined.
                </Typography>
                <Typography variant="body2" sx={{ color: "blue", mb: 2 }}>
                  Subscribe to{" "}
                  <Link
                    href="https://www.youtube.com/channel/UCWK2w-BVGps-Y9c08B5pRgA/videos"
                    target="_blank"
                    sx={{ color: "blue", textDecoration: "underline" }}
                  >
                    Agoura Math Circle YouTube Channel
                  </Link>
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Typography variant="body2" sx={{ mb: 2 }}>
                  If your kids are planning to attend our Spring Fall 2024,
                  please register ASAP. We have a limited amount of slots and
                  there are many students in the waiting list. Please don't
                  register if you are not planning to attend the Agoura Math
                  Circle's Spring Fall 2024. It will help us accommodate the
                  waiting list students.
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                  Registration Steps:
                </Typography>
                <Typography variant="body2" sx={{ color: "blue", mb: 1 }}>
                  Step 1: Select the check box and click the submit button.
                </Typography>
                <Typography variant="body2" sx={{ color: "blue", mb: 2 }}>
                  Step 2: After registering, please update your student profile,
                  it will help us to place you in the correct class. Click the
                  Edit pencil icon and update the student's Profile. This is
                  REQUIRED. If you have any questions, please contact us via
                  Message Center.
                </Typography>
              </Box>
            )}

            {/* Waiting List Message */}
            {showWaitingList && (
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="body2"
                  sx={{ color: "red", fontWeight: 600 }}
                >
                  Your kids are on the waiting list for our Fall Semester 2024
                  because they did not take the final exam. The final exam is
                  required for Fall 2024 semester registration. Take the final
                  exam (Class Material Section) and update the answer key in the
                  update score section. After the update of the answer key, you
                  will be able to register for Fall 2024. otherwise, we will
                  open the registration when a spot becomes available for the
                  class. If you have a question, please contact us via Message
                  Center.
                </Typography>
              </Box>
            )}

            {/* Registration Grid */}
            <TableContainer component={Paper} sx={{ mb: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableCell padding="checkbox">
                      <Checkbox />
                    </TableCell>
                    <TableCell>Student Id</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Grade</TableCell>
                    <TableCell>School</TableCell>
                    <TableCell>Parent Name</TableCell>
                    <TableCell>Class</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Available Space</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {registrationData.map((student) => (
                    <TableRow key={student.studentId}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedStudents.includes(student.studentId)}
                          onChange={() =>
                            handleStudentSelection(student.studentId)
                          }
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
                        <Chip
                          label={student.regStatus}
                          color={
                            student.regStatus === "Open" ? "success" : "error"
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{student.openSpace}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Button
              variant="contained"
              onClick={handleSubmitRegistration}
              sx={{
                backgroundColor: "#53b50a",
                "&:hover": { backgroundColor: "#4a7c59" },
              }}
            >
              Submit
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Final Exam Section */}
      {showFinalExam && (
        <Card sx={{ mb: 3, border: "2px solid #f44336" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <WarningIcon sx={{ color: "#f44336", mr: 1 }} />
              <Typography
                variant="h6"
                sx={{ color: "#f44336", fontWeight: 600 }}
              >
                Final Exam Notice
              </Typography>
            </Box>

            <Typography
              variant="body2"
              sx={{ color: "red", fontWeight: 600, mb: 2 }}
            >
              The Spring Semester Online Final Exam for Agoura Math Circle is
              scheduled for Sunday, May 19th, from 2:00 PM PST to 3:30 PM PST.
              This final exam will be conducted online via Zoom. The meeting
              information can be found on your dashboard, so please make sure to
              join the Zoom meeting at least 15 minutes prior to the start time.
              It is mandatory for all students who missed the onsite exam to
              take the final exam. By participating in the final exam, you will
              receive priority in next year's registration process.
            </Typography>

            <Typography variant="body2" sx={{ mb: 2 }}>
              Furthermore, we would like to announce that the top three scores
              in each class will be awarded. The final exam will solely focus on
              the material covered during the Spring Semester, including
              classwork, homework, and quiz questions. Please note that access
              to any previous materials will not be available during the exam
              period.
            </Typography>

            <Typography variant="body2" sx={{ mb: 2 }}>
              For the Fall 2024 Registration, it will open during the first week
              of August 2024. You will receive an email notification regarding
              this.
            </Typography>

            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Button
                variant="contained"
                size="large"
                href="/student/final-exam"
                sx={{
                  backgroundColor: "#53b50a",
                  fontSize: "1.1rem",
                  padding: "12px 24px",
                  "&:hover": { backgroundColor: "#4a7c59" },
                }}
              >
                * Click - Final Exam *
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Error/Success Messages */}
      <Box sx={{ mt: 2 }}>
        {/* These would be populated based on API responses */}
      </Box>
    </Box>
  );
};

export default DashboardMessages;
