import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Typography,
  Box,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Assignment as AssignmentIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import {
  adminSessionListHeaderBarSx,
  adminSessionListTitleSx,
} from "../styles/applicationSurfaces";

const ONLINE_EXAM_PATH = "/pstudyware/student/online-exam";
const sectionTitle = "Final Exam Information";

const OnlineExamSection = ({ loading = false }) => {
  return (
    <Box className="online-exam-information" sx={{ width: "100%" }}>
      <Box sx={adminSessionListHeaderBarSx}>
        <Typography variant="subtitle1" component="div" sx={adminSessionListTitleSx}>
          {sectionTitle}
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 1.5 }}>
          <CircularProgress size={32} />
        </Box>
      ) : (
        <>
      <Alert severity="warning" icon={<WarningIcon />} sx={{ mb: 1.5 }}>
        <Typography variant="body1" sx={{ mb: 0.75, fontWeight: 600 }}>
          OnSite Students
        </Typography>
        <Typography variant="body2">
          The Spring Semester OnSite Final Exam for Agoura Math Circle is scheduled
          for Saturday, May 16th, from 12:00 PM PST to 2:00 PM PST In-Person (El
          Camino Real High School, Woodland Hills). It is mandatory for all
          students. By participating in the final exam, you will receive priority
          in next year&apos;s registration process.
        </Typography>
      </Alert>

      <Alert severity="error" icon={<WarningIcon />} sx={{ mb: 1.5 }}>
        <Typography variant="body1" sx={{ mb: 0.75, fontWeight: 600 }}>
          OnLine Students
        </Typography>
        <Typography variant="body2" sx={{ mb: 0.75 }}>
          The Spring Semester Online Final Exam for Agoura Math Circle is scheduled
          for Saturday, May 16th, from 12:00 PM PST to 2:00 PM PST. This final exam
          will be conducted online via Zoom.
        </Typography>
        <Typography variant="body2" sx={{ mb: 0.75 }}>
          The meeting information can be found on your dashboard, so please make
          sure to join the Zoom meeting at least 15 minutes prior to the start
          time. It is mandatory for all students who missed the onsite exam to
          take the final exam. By participating in the final exam, you will receive
          priority in next year&apos;s registration process.
        </Typography>
        <Typography variant="body2" sx={{ mb: 0.75 }}>
          Furthermore, we would like to announce that the top three scores in each
          class will be awarded. The final exam will solely focus on the material
          covered during the Spring Semester, including classwork, homework, and
          quiz questions. Please note that access to any previous materials will not
          be available during the exam period.
        </Typography>
        <Typography variant="body2">
          For the Spring 2026 Registration, it will open during the first week of
          Aug 2025. You will receive an email notification regarding this.
        </Typography>
      </Alert>

      <Box sx={{ textAlign: "center", mb: 0.75 }}>
        <Button
          className="online-exam-launch-btn"
          variant="contained"
          size="large"
          component={RouterLink}
          to={ONLINE_EXAM_PATH}
          startIcon={<AssignmentIcon sx={{ color: "#ffffff" }} />}
          sx={{
            backgroundColor: "#174a10",
            "&:hover": {
              backgroundColor: "#0f3310",
              color: "#ffffff",
            },
            px: 4,
            py: 1,
            fontSize: "0.9375rem",
            fontWeight: 600,
            textTransform: "none",
            color: "#ffffff",
            textDecoration: "none",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
          }}
        >
          Click - Final Exam
        </Button>
      </Box>
        </>
      )}
    </Box>
  );
};

export default OnlineExamSection;
