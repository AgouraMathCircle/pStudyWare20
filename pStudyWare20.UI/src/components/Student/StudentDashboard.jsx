import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  Alert,
  Button,
  Chip,
  Divider,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  FormControlLabel,
  Link,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Upload as UploadIcon,
  Assessment as AssessmentIcon,
  Message as MessageIcon,
  Lock as LockIcon,
  Logout as LogoutIcon,
  Edit as EditIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  YouTube as YouTubeIcon,
  VideoCall as VideoCallIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services";
import StudentHeader from "./StudentHeader";
import DashboardMessages from "./DashboardMessages";
import StudentProfile from "./StudentProfile";
import ReportCard from "./ReportCard";
import RegistrationSection from "./RegistrationSection";
import FinalExamSection from "./FinalExamSection";
import "../../styles/StudentDashboard.css";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    registrationData: [],
    profileData: [],
    reportCardData: [],
    messages: [],
    announcements: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        if (!currentUser) {
          navigate("/login");
          return;
        }
        setUser(currentUser);

        // TODO: Replace with actual API calls
        // For now, using mock data
        setDashboardData({
          registrationData: [
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
          ],
          profileData: [
            {
              studentId: "001",
              studentName: "John Doe",
              program: "Math Circle",
              class: "Advanced Math",
              grade: "8th Grade",
              school: "Lindero Canyon Middle School",
              parentName: "Jane Doe",
              phoneNumber: "(555) 123-4567",
              emailAddress: "jane.doe@email.com",
              eventSession: "Fall 2024",
              eventLocation: "Agoura Hills",
            },
          ],
          reportCardData: [
            {
              studentName: "John Doe",
              group: "Advanced Math",
              semester: "Spring 2024",
              examType: "Final Exam",
              examDate: "2024-05-19",
              totalCredit: 100,
              highestScore: 95,
              classAverage: 78.5,
              receivedCredit: 88,
              comments: "Excellent work!",
            },
          ],
          messages: [
            {
              type: "important",
              title: "YouTube Channel Subscription Required",
              content:
                "Agoura Math Circle YouTube channel subscription is required for all students. If you are not subscribed, your application will be declined.",
              link: "https://www.youtube.com/channel/UCWK2w-BVGps-Y9c08B5pRgA/videos",
            },
          ],
          announcements: [
            {
              type: "registration",
              title: "Fall 2024 Registration",
              content:
                "Fall Semester 2024 registration will close on 08/10/2024. Please register ASAP as we have limited slots.",
              urgent: true,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4">Loading Dashboard...</Typography>
      </Container>
    );
  }

  return (
    <Box className="student-dashboard">
      <StudentHeader user={user} />
      <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Left Content */}
          <Grid item xs={12} lg={8}>
            {/* Dashboard Messages */}
            <DashboardMessages
              messages={dashboardData.messages}
              announcements={dashboardData.announcements}
            />

            {/* Registration Section */}
            <RegistrationSection
              registrationData={dashboardData.registrationData}
            />

            {/* Final Exam Section */}
            <FinalExamSection />

            {/* Error/Success Messages */}
            <Box sx={{ mt: 2 }}>
              {/* These would be populated based on API responses */}
            </Box>
          </Grid>

          {/* Right Content */}
          <Grid item xs={12} lg={4}>
            {/* Student Profile */}
            <StudentProfile profileData={dashboardData.profileData} />

            {/* Report Card */}
            <ReportCard reportCardData={dashboardData.reportCardData} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default StudentDashboard;
