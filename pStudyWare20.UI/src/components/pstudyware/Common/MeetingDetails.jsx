import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Alert,
  Snackbar,
  CircularProgress,
  Grid,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useAuth } from "../../../contexts/AuthContext";
import meetingDetailsService from "../../../services/meetingDetailsService";
import MeetingList from "./MeetingList";
import MeetingForm from "./MeetingForm";
import { APPLICATION_ADMIN_TITLE_COLOR } from "../styles/applicationSurfaces";

const MeetingDetails = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [meetings, setMeetings] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [privileges, setPrivileges] = useState({
    isAdmin: false,
    isSystemAdmin: false,
    canAddMeetings: false,
    canEditMeetings: false,
  });

  // UI state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Load data on mount
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);

      // Check privileges
      const privilegesResponse =
        await meetingDetailsService.checkMeetingDetailsPrivileges();
      if (privilegesResponse.isSuccess) {
        setPrivileges({
          isAdmin: privilegesResponse.isAdmin,
          isSystemAdmin: privilegesResponse.isSystemAdmin,
          canAddMeetings: privilegesResponse.canAddMeetings,
          canEditMeetings: privilegesResponse.canEditMeetings,
        });
      }

      // Load meetings and chapters using individual endpoints
      const [meetingsResponse, chaptersResponse] = await Promise.all([
        meetingDetailsService.getAllMeetingSchedules(),
        meetingDetailsService.getChapterLocations(),
      ]);

      console.log("MeetingDetails: Meetings response", meetingsResponse);
      console.log("MeetingDetails: Chapters response", chaptersResponse);

      if (meetingsResponse && meetingsResponse.isSuccess) {
        const meetings = meetingsResponse.meetingSchedules || [];
        console.log("MeetingDetails: Number of meetings", meetings.length);
        console.log("MeetingDetails: First meeting", meetings[0]);
        setMeetings(meetings);
      } else {
        console.error(
          "MeetingDetails: Error loading meetings",
          meetingsResponse
        );
        showSnackbar(
          meetingsResponse?.errorMessage || "Error loading meetings",
          "error"
        );
      }

      if (chaptersResponse && chaptersResponse.isSuccess) {
        const chapters = chaptersResponse.chapterLocations || [];
        console.log("MeetingDetails: Number of chapters", chapters.length);
        console.log("MeetingDetails: First chapter", chapters[0]);
        setChapters(chapters);
      } else {
        console.error(
          "MeetingDetails: Error loading chapters",
          chaptersResponse
        );
        showSnackbar(
          chaptersResponse?.errorMessage || "Error loading chapters",
          "error"
        );
      }
    } catch (error) {
      showSnackbar("Error loading data: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const loadMeetings = async () => {
    try {
      const response = await meetingDetailsService.getAllMeetingSchedules();
      if (response.isSuccess) {
        setMeetings(response.meetingSchedules || []);
      } else {
        showSnackbar(
          response.errorMessage || "Error loading meetings",
          "error"
        );
      }
    } catch (error) {
      showSnackbar("Error loading meetings: " + error.message, "error");
    }
  };

  const handleAddMeeting = () => {
    setSelectedMeeting(null);
    setShowForm(true);
  };

  const handleEditMeeting = async (rowId) => {
    try {
      const response = await meetingDetailsService.getMeetingScheduleById(
        rowId
      );
      if (response.isSuccess && response.meetingSchedule) {
        setSelectedMeeting(response.meetingSchedule);
        setShowForm(true);
      } else {
        showSnackbar(
          response.errorMessage || "Error loading meeting details",
          "error"
        );
      }
    } catch (error) {
      showSnackbar("Error loading meeting details: " + error.message, "error");
    }
  };

  const handleSubmitMeeting = async (formData) => {
    try {
      const response = await meetingDetailsService.upsertMeetingSchedule(
        formData
      );
      if (response.isSuccess) {
        showSnackbar(
          response.message || "Meeting schedule updated successfully",
          "success"
        );
        setShowForm(false);
        setSelectedMeeting(null);
        loadMeetings();
      } else {
        showSnackbar(
          response.errorMessage || "Error updating meeting schedule",
          "error"
        );
      }
    } catch (error) {
      showSnackbar(
        "Error updating meeting schedule: " + error.message,
        "error"
      );
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setSelectedMeeting(null);
  };

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  // Check if user has admin access
  if (!privileges.isAdmin) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Alert severity="error">
            You do not have permission to access this page. Admin access
            required.
          </Alert>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box>
            {/* Header */}
            <Box
              sx={{
                mb: 1,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  color: APPLICATION_ADMIN_TITLE_COLOR,
                  fontSize: "1rem",
                }}
              >
                Meeting Schedule List
              </Typography>
              {privileges.canAddMeetings && !showForm && (
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={handleAddMeeting}
                  sx={{ fontSize: "0.75rem", px: 1.5, py: 0.25 }}
                >
                  Add Meeting
                </Button>
              )}
            </Box>

            {/* Message Display */}
            {snackbar.open && snackbar.severity === "success" && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {snackbar.message}
              </Alert>
            )}

            {/* Meeting List */}
            {!showForm && (
              <MeetingList
                meetings={meetings}
                onEdit={handleEditMeeting}
                canEdit={privileges.canEditMeetings}
              />
            )}

            {/* Meeting Form */}
            {showForm && (
              <MeetingForm
                meeting={selectedMeeting}
                chapters={chapters}
                onSubmit={handleSubmitMeeting}
                onCancel={handleCancelForm}
                isSystemAdmin={privileges.isSystemAdmin}
              />
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default MeetingDetails;
