import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { useAppSnackbar } from "../Common/useAppSnackbar";
import AppSnackbar from "../Common/AppSnackbar";
import { useAuth } from "../../../contexts/AuthContext";
import instructorService from "../../../services/instructorService";
import studentWaitingListService from "../../../services/studentWaitingListService";
import AdminHeader, { AdminRoleHeaderSpacer } from "./AdminHeader";
import InstructorList from "./InstructorList";
import InstructorForm from "./InstructorForm";
import {
  adminSessionListPanelCardSx,
  adminSessionListPanelContentSx,
} from "../styles/applicationSurfaces";

const instructorManagementPageSx = {
  flex: 1,
  minHeight: 0,
  width: "100%",
  display: "flex",
  flexDirection: "column",
};

const parseChapterFromInstructorInfo = (info) => {
  if (!info || typeof info !== "string") return "";
  const parts = info.split("~#");
  return (parts[7] || "").trim();
};

const normalizeRowMemberStatus = (status, instructorInfo = "") => {
  const value = String(status ?? "").trim().toLowerCase();
  if (value === "1" || value === "active") return "1";
  if (value === "0" || value === "inactive" || value === "deactive") return "0";

  if (instructorInfo) {
    const approved = (instructorInfo.split("~#")[8] || "").trim();
    return approved === "0" ? "0" : "1";
  }

  return "1";
};

const normalizeInstructorRow = (row) => {
  if (!row || typeof row !== "object") return row;

  const instructorInfo = row.instructorInfo ?? row.InstructorInfo ?? "";

  return {
    instructorID: row.instructorID ?? row.InstructorID,
    firstName: row.firstName ?? row.FirstName ?? "",
    lastName: row.lastName ?? row.LastName ?? "",
    emailID: row.emailID ?? row.EmailID ?? "",
    contactPhone: row.contactPhone ?? row.ContactPhone ?? "",
    chapterName: row.chapterName ?? row.ChapterName ?? "",
    chapterID:
      row.chapterID ??
      row.ChapterID ??
      parseChapterFromInstructorInfo(instructorInfo) ??
      "",
    instructorType: row.instructorType ?? row.InstructorType ?? "",
    class: row["class"] ?? row.Class ?? "",
    section: row.section ?? row.Section ?? "",
    userName: row.userName ?? row.UserName ?? "",
    memberStatus: normalizeRowMemberStatus(
      row.memberStatus ?? row.MemberStatus,
      instructorInfo,
    ),
    instructorInfo,
    lastLogin: row.lastLogin ?? row.LastLogin,
  };
};

const mapChapterOptions = (chapterRows) =>
  (chapterRows || []).map((chapter) => ({
    value: String(chapter.chapterID ?? chapter.ChapterID ?? ""),
    label: chapter.chapterName ?? chapter.ChapterName ?? "",
    chapterID: chapter.chapterID ?? chapter.ChapterID ?? "",
    chapterName: chapter.chapterName ?? chapter.ChapterName ?? "",
    location: chapter.location ?? chapter.Location ?? "",
  }));

const InstructorManagement = () => {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [instructors, setInstructors] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  // Admin privileges state
  const [adminPrivileges, setAdminPrivileges] = useState({
    isAdmin: false,
    isSystemAdmin: false,
    canAddInstructor: false,
    canExportData: false,
  });

  const { snackbar, showSnackbar, closeSnackbar } = useAppSnackbar("info");

  // Load chapter dropdown data
  useEffect(() => {
    const loadChapters = async () => {
      try {
        const chapterResponse =
          await studentWaitingListService.getChapterLocation({ Mode: "N" });
        const chapterRows =
          chapterResponse?.chapterLocations ??
          chapterResponse?.ChapterLocations ??
          [];
        if (chapterResponse?.isSuccess && Array.isArray(chapterRows)) {
          setChapters(mapChapterOptions(chapterRows));
        } else {
          setChapters([]);
        }
      } catch (err) {
        console.error("Error loading chapter locations:", err);
        setChapters([]);
      }
    };

    loadChapters();
  }, []);

  // Load instructor data
  useEffect(() => {
    const loadInstructors = async () => {
      if (!isAuthenticated || !user) {
        return;
      }

      try {
        setLoading(true);
        console.log("InstructorManagement: Fetching instructor data");

        // Check admin privileges
        const memberType = user.memberType?.toUpperCase();
        const chapterID = user.chapterID || "1";
        const isAdmin = memberType === "A";
        const isSystemAdmin = isAdmin && chapterID === "1";

        setAdminPrivileges({
          isAdmin,
          isSystemAdmin,
          canAddInstructor: isSystemAdmin,
          canExportData: isAdmin,
        });

        // Get instructor list
        const response = await instructorService.getInstructorList(
          user.email || user.username
        );

        console.log("InstructorManagement: Instructor data response", response);

        if (response.isSuccess) {
          setInstructors(
            (response.instructorList || []).map(normalizeInstructorRow),
          );
        } else {
          showSnackbar(
            response.errorMessage || "Failed to load instructor list",
            "error"
          );
        }
      } catch (err) {
        console.error("Error fetching instructor data:", err);
        showSnackbar(
          "Error loading instructor data. Please refresh the page.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    loadInstructors();
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (!loading && (!isAuthenticated || !user)) {
      showSnackbar(
        "Access denied. Please log in as an administrator.",
        "error",
      );
    }
  }, [loading, isAuthenticated, user, showSnackbar]);

  // Handle add instructor
  const handleAdd = () => {
    setSelectedInstructor(null);
    setIsEdit(false);
    setFormOpen(true);
  };

  // Handle edit instructor
  const handleEdit = (instructor) => {
    setSelectedInstructor(normalizeInstructorRow(instructor));
    setIsEdit(true);
    setFormOpen(true);
  };

  // Handle delete instructor
  const handleDelete = async (instructorID) => {
    try {
      console.log("InstructorManagement: Deleting instructor", instructorID);
      showSnackbar("Deleting instructor...", "info");

      const response = await instructorService.deleteInstructor(instructorID);

      if (response.isSuccess) {
        showSnackbar(
          response.message || "Instructor deleted successfully!",
          "success"
        );
        // Refresh instructor list
        await refreshInstructors();
      } else {
        showSnackbar(
          response.errorMessage || "Failed to delete instructor.",
          "error"
        );
      }
    } catch (err) {
      console.error("Error deleting instructor:", err);
      showSnackbar("Error deleting instructor. Please try again.", "error");
    }
  };

  // Handle form submit
  const handleFormSubmit = async (formData) => {
    try {
      const instructorID = Number(
        formData?.instructorID ?? formData?.InstructorID ?? 0,
      );

      if (isEdit && instructorID <= 0) {
        showSnackbar(
          "Cannot update instructor: missing instructor ID. Refresh the page and try again.",
          "error",
        );
        throw new Error("Missing instructor ID");
      }

      console.log("InstructorManagement: Submitting instructor", formData);
      showSnackbar(
        isEdit ? "Updating instructor..." : "Adding instructor...",
        "info"
      );

      const response = await instructorService.addOrUpdateInstructor(formData);

      if (response.isSuccess) {
        showSnackbar(
          response.message ||
            (isEdit
              ? "Instructor updated successfully!"
              : "Instructor added successfully!"),
          "success"
        );
        // Refresh instructor list
        await refreshInstructors();
        setFormOpen(false);
      } else {
        showSnackbar(
          response.errorMessage || "Failed to save instructor.",
          "error"
        );
        throw new Error(response.errorMessage);
      }
    } catch (err) {
      console.error("Error saving instructor:", err);
      throw err;
    }
  };

  // Handle export to Excel
  const handleExportToExcel = async () => {
    try {
      console.log("InstructorManagement: Exporting to Excel");
      showSnackbar("Generating Excel file...", "info");

      await instructorService.exportInstructorListToExcel(
        user.email || user.username
      );

      showSnackbar("Excel file downloaded successfully!", "success");
    } catch (err) {
      console.error("Error exporting to Excel:", err);
      showSnackbar("Error exporting to Excel. Please try again.", "error");
    }
  };

  // Refresh instructor list
  const refreshInstructors = async () => {
    try {
      const response = await instructorService.getInstructorList(
        user.email || user.username
      );

      if (response.isSuccess) {
        setInstructors(
          (response.instructorList || []).map(normalizeInstructorRow),
        );
      } else {
        showSnackbar(
          response.errorMessage || "Failed to refresh instructor list",
          "error"
        );
      }
    } catch (err) {
      console.error("Error refreshing instructor list:", err);
      showSnackbar("Error refreshing instructor list.", "error");
    }
  };

  // Show loading while fetching data
  if (loading) {
    return (
      <Box
        sx={{
          ...instructorManagementPageSx,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="textSecondary">
          Loading Instructor Management...
        </Typography>
      </Box>
    );
  }

  if (!isAuthenticated || !user) {
    return <AppSnackbar snackbar={snackbar} onClose={closeSnackbar} autoHideDuration={6000} />;
  }

  return (
    <Box sx={instructorManagementPageSx}>
      <AdminHeader user={user} />
      <AdminRoleHeaderSpacer />
      <Container maxWidth="xl" sx={{ mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={adminSessionListPanelCardSx}>
              <CardContent sx={adminSessionListPanelContentSx}>
                <InstructorList
                  instructors={instructors}
                  onExportToExcel={handleExportToExcel}
                  canExportData={adminPrivileges.canExportData}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onAdd={handleAdd}
                  canAddInstructor={adminPrivileges.canAddInstructor}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <InstructorForm
        key={
          isEdit
            ? `edit-${selectedInstructor?.instructorID ?? "unknown"}`
            : "add"
        }
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setSelectedInstructor(null);
          setIsEdit(false);
        }}
        onSubmit={handleFormSubmit}
        instructor={selectedInstructor}
        chapters={chapters}
        isEdit={isEdit}
      />

      <AppSnackbar snackbar={snackbar} onClose={closeSnackbar} autoHideDuration={6000} />
    </Box>
  );
};

export default InstructorManagement;
