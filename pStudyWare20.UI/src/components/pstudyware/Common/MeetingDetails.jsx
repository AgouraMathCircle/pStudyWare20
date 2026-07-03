import React, { useState, useEffect } from "react";

import {

  Container,

  Typography,

  Button,

  Box,

  Grid,

  Card,

  CardContent,

} from "@mui/material";

import { Add as AddIcon, Refresh as RefreshIcon } from "@mui/icons-material";

import { useAuth } from "../../../contexts/AuthContext";

import meetingDetailsService from "../../../services/meetingDetailsService";

import AdminHeader, { AdminRoleHeaderSpacer } from "../Admin/AdminHeader";

import MeetingList from "./MeetingList";

import MeetingForm from "./MeetingForm";

import AppSnackbar from "./AppSnackbar";

import { useAppSnackbar } from "./useAppSnackbar";

import {

  adminSessionListFindButtonSx,

  adminSessionListHeaderBarSx,

  adminSessionListPanelCardSx,

  adminSessionListPanelContentSx,

  adminSessionListTitleSx,

} from "../styles/applicationSurfaces";

import "../../../styles/AdminMeetingDetails.css";



const adminMeetingDetailsPageSx = {

  flex: 1,

  minHeight: 0,

  width: "100%",

  display: "flex",

  flexDirection: "column",

};



const refreshToolbarButtonSx = {

  ...adminSessionListFindButtonSx,

  backgroundColor: "#4caf50",

  color: "white",

  flexShrink: 0,

  px: 1.5,

  "&:hover": { backgroundColor: "#43a047" },

};



const addMeetingButtonSx = {

  ...adminSessionListFindButtonSx,

  backgroundColor: "#4caf50",

  color: "white",

  flexShrink: 0,

  px: 1.5,

  "&:hover": { backgroundColor: "#43a047" },

};



const MeetingDetails = () => {

  const { user } = useAuth();

  const [loading, setLoading] = useState(true);

  const [meetings, setMeetings] = useState([]);

  const [chapters, setChapters] = useState([]);

  const [selectedMeeting, setSelectedMeeting] = useState(null);

  const [formOpen, setFormOpen] = useState(false);

  const [formLoading, setFormLoading] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [privileges, setPrivileges] = useState({

    isAdmin: false,

    isSystemAdmin: false,

    canAddMeetings: false,

    canEditMeetings: false,

  });



  const { snackbar, showSnackbar, closeSnackbar } = useAppSnackbar("info");

  useEffect(() => {

    loadInitialData();

  }, []);



  useEffect(() => {

    if (!loading && !privileges.isAdmin) {

      showSnackbar(

        "You do not have permission to access this page. Admin access required.",

        "error",

      );

    }

  }, [loading, privileges.isAdmin, showSnackbar]);



  const loadInitialData = async () => {

    try {

      setLoading(true);



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



      const [meetingsResponse, chaptersResponse] = await Promise.all([

        meetingDetailsService.getAllMeetingSchedules(),

        meetingDetailsService.getChapterLocations(),

      ]);



      if (meetingsResponse && meetingsResponse.isSuccess) {

        setMeetings(meetingsResponse.meetingSchedules || []);

      } else {

        showSnackbar(

          meetingsResponse?.errorMessage || "Error loading meetings",

          "error",

        );

      }



      if (chaptersResponse && chaptersResponse.isSuccess) {

        setChapters(chaptersResponse.chapterLocations || []);

      } else {

        showSnackbar(

          chaptersResponse?.errorMessage || "Error loading chapters",

          "error",

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

      setLoading(true);

      const response = await meetingDetailsService.getAllMeetingSchedules();

      if (response.isSuccess) {

        setMeetings(response.meetingSchedules || []);

      } else {

        showSnackbar(

          response.errorMessage || "Error loading meetings",

          "error",

        );

      }

    } catch (error) {

      showSnackbar("Error loading meetings: " + error.message, "error");

    } finally {

      setLoading(false);

    }

  };



  const closeForm = () => {

    if (submitting) return;

    setFormOpen(false);

    setSelectedMeeting(null);

    setFormLoading(false);

  };



  const handleAddMeeting = () => {

    setSelectedMeeting(null);

    setFormLoading(false);

    setFormOpen(true);

  };



  const handleEditMeeting = async (rowId) => {

    setFormOpen(true);

    setFormLoading(true);

    setSelectedMeeting(null);



    try {

      const response = await meetingDetailsService.getMeetingScheduleById(

        rowId,

      );

      const isSuccess = response?.isSuccess ?? response?.IsSuccess;
      const schedule =
        response?.meetingSchedule ?? response?.MeetingSchedule ?? null;

      if (isSuccess && schedule) {

        setSelectedMeeting(schedule);

      } else {

        showSnackbar(

          response?.errorMessage ??
            response?.ErrorMessage ??
            "Error loading meeting details",

          "error",

        );

        closeForm();

      }

    } catch (error) {

      showSnackbar("Error loading meeting details: " + error.message, "error");

      closeForm();

    } finally {

      setFormLoading(false);

    }

  };



  const handleSubmitMeeting = async (formData) => {

    try {

      setSubmitting(true);

      const response = await meetingDetailsService.upsertMeetingSchedule(

        formData,

      );

      const isSuccess = response?.isSuccess ?? response?.IsSuccess;

      if (isSuccess) {

        showSnackbar(

          response?.message ??

            response?.Message ??

            "Data updated successfully.",

          "success",

        );

        closeForm();

        loadMeetings();

      } else {

        showSnackbar(

          response?.errorMessage ??

            response?.ErrorMessage ??

            "Error updating meeting schedule",

          "error",

        );

      }

    } catch (error) {

      const apiMessage =

        error?.response?.data?.errorMessage ??

        error?.response?.data?.ErrorMessage ??

        error?.response?.data?.message;

      showSnackbar(

        apiMessage || "Error updating meeting schedule: " + error.message,

        "error",

      );

    } finally {

      setSubmitting(false);

    }

  };



  const selectedMeetingKey = selectedMeeting

    ? `edit-${selectedMeeting.RowID ?? selectedMeeting.rowID ?? selectedMeeting.RowId ?? "unknown"}`

    : "add";



  return (

    <Box className="admin-meeting-details" sx={adminMeetingDetailsPageSx}>

      <AdminHeader user={user} />

      <AdminRoleHeaderSpacer />

      <Container maxWidth="xl" sx={{ mb: 4 }}>

        <Grid container spacing={3}>

          <Grid item xs={12}>

            <Card sx={adminSessionListPanelCardSx}>

              <CardContent sx={adminSessionListPanelContentSx}>

                <Box sx={adminSessionListHeaderBarSx}>

                  <Typography variant="subtitle1" component="div" sx={adminSessionListTitleSx}>

                    Meeting Schedule List

                  </Typography>

                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>

                    {privileges.canAddMeetings && (

                      <Button

                        variant="contained"

                        color="success"

                        size="small"

                        startIcon={<AddIcon />}

                        onClick={handleAddMeeting}

                        sx={addMeetingButtonSx}

                      >

                        Add Meeting

                      </Button>

                    )}

                    <Button

                      variant="contained"

                      color="success"

                      size="small"

                      startIcon={<RefreshIcon />}

                      onClick={loadMeetings}

                      disabled={loading}

                      sx={refreshToolbarButtonSx}

                    >

                      Refresh

                    </Button>

                  </Box>

                </Box>



                {!loading && !privileges.isAdmin ? null : (

                  <MeetingList

                    meetings={meetings}

                    chapters={chapters}

                    onEdit={handleEditMeeting}

                    canEdit={privileges.canEditMeetings}

                    loading={loading}

                  />

                )}

              </CardContent>

            </Card>

          </Grid>

        </Grid>

      </Container>



      <MeetingForm

        key={selectedMeetingKey}

        open={formOpen}

        onClose={closeForm}

        meeting={selectedMeeting}

        chapters={chapters}

        onSubmit={handleSubmitMeeting}

        isSystemAdmin={privileges.isSystemAdmin}

        loading={formLoading}

        submitting={submitting}

      />



      <AppSnackbar

        snackbar={snackbar}

        onClose={closeSnackbar}

        autoHideDuration={6000}

      />

    </Box>

  );

};



export default MeetingDetails;

