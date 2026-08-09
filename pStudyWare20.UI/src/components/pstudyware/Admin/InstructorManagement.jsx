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
import volunteersRequestService from "../../../services/volunteersRequestService";
import { getPortalUsername } from "../../../utils/portalUsername";
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

/** Map AMC_ChapterMaster rows (Name, Location, City) for the Chapter dropdown. */
const mapChapterOptions = (chapterRows) =>
  (chapterRows || [])
    .map((chapter) => {
      const chapterID = String(chapter.chapterID ?? chapter.ChapterID ?? "").trim();
      if (!chapterID) return null;

      const name = String(
        chapter.name ??
          chapter.Name ??
          chapter.chapterName ??
          chapter.ChapterName ??
          "",
      ).trim();
      const location = String(chapter.location ?? chapter.Location ?? "").trim();
      const city = String(chapter.city ?? chapter.City ?? "").trim();
      const label =
        String(chapter.label ?? chapter.Label ?? "").trim() ||
        [name, location, city].filter(Boolean).join(" - ");

      return {
        value: chapterID,
        chapterID,
        chapterName: name,
        name,
        location,
        city,
        volunteerEmailGroup: chapter.volunteerEmailGroup ?? chapter.VolunteerEmailGroup ?? "",
        label: label || `Chapter ${chapterID}`,
      };
    })
    .filter(Boolean);

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

  // Load chapter dropdown from AMC_ChapterMaster via VolunteersRequest API
  useEffect(() => {
    const loadChapters = async () => {
      try {
        const chapterResponse = await volunteersRequestService.getChapterLocations();
        const chapterRows =
          chapterResponse?.chapterLocations ??
          chapterResponse?.ChapterLocations ??
          [];
        if (chapterResponse?.isSuccess !== false && Array.isArray(chapterRows)) {
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

        // Chapter Admin privileges (SystemAdmin uses a separate portal stack)
        const memberType = user.memberType?.toUpperCase();
        const isAdmin = memberType === "A";
        const portalUsername = getPortalUsername(user);

        setAdminPrivileges({
          isAdmin,
          isSystemAdmin: false,
          canAddInstructor: false,
          canExportData: isAdmin,
        });

        if (!portalUsername) {
          showSnackbar(
            "Unable to resolve portal username. Please log in again.",
            "error",
          );
          return;
        }

        // Get instructor list — BE filters to assigned classes for Chapter Admin
        const response = await instructorService.getInstructorList(portalUsername);

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

      const chapterID = String(
        formData?.chapterID ?? formData?.ChapterID ?? "",
      ).trim();
      if (!chapterID) {
        showSnackbar("Chapter is required.", "error");
        throw new Error("Chapter is required");
      }

      const response = await instructorService.addOrUpdateInstructor({
        ...formData,
        instructorID,
        chapterID,
        class:
          formData?.class ??
          formData?.Class ??
          formData?.classCode ??
          "",
        section: formData?.section ?? formData?.Section ?? "A",
        instructorType:
          formData?.instructorType ?? formData?.InstructorType ?? "P",
        memberStatus: formData?.memberStatus ?? formData?.MemberStatus ?? "1",
      });

      if (response.isSuccess) {
        // --- GOOGLE GROUP SYNC ---
        try {
          // Instructors use 'userName' for Google Workspace email, fallback to emailID for backward compatibility
          const targetUsername = selectedInstructor?.userName?.trim() || formData?.userName?.trim() || formData?.emailID?.trim() || selectedInstructor?.emailID?.trim();
          const oldChapter = chapters.find(c => String(c.chapterID) === String(selectedInstructor?.chapterID || selectedInstructor?.ChapterID));
          const newChapter = chapters.find(c => String(c.chapterID) === String(chapterID));
          
          const oldGroupEmail = oldChapter?.volunteerEmailGroup;
          const newGroupEmail = newChapter?.volunteerEmailGroup;

          const oldStatus = String(selectedInstructor?.memberStatus ?? "1").trim().toLowerCase();
          const newStatus = String(formData?.memberStatus ?? formData?.MemberStatus ?? "1").trim().toLowerCase();

          const isOldActive = oldStatus === "1" || oldStatus === "active";
          const isNewActive = newStatus === "1" || newStatus === "active";

          if (targetUsername) {
            if (isEdit) {
              if (isOldActive && oldGroupEmail && (!isNewActive || oldGroupEmail !== newGroupEmail)) {
                await instructorService.removeMemberFromGroup(oldGroupEmail, targetUsername).catch(e => console.error("Failed to remove from old group", e));
              }
              if (isNewActive && newGroupEmail && (!isOldActive || oldGroupEmail !== newGroupEmail)) {
                await instructorService.addMemberToGroup(newGroupEmail, targetUsername).catch(e => console.error("Failed to add to new group", e));
              }
            } else {
              if (isNewActive && newGroupEmail) {
                await instructorService.addMemberToGroup(newGroupEmail, targetUsername).catch(e => console.error("Failed to add to new group", e));
              }
            }
          }
        } catch (syncErr) {
          console.error("Google Group Sync Error:", syncErr);
        }
        // --- END GOOGLE GROUP SYNC ---

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
      const portalUsername = getPortalUsername(user);
      if (!portalUsername) {
        showSnackbar(
          "Unable to resolve portal username. Please log in again.",
          "error",
        );
        return;
      }

      console.log("InstructorManagement: Exporting to Excel");
      showSnackbar("Generating Excel file...", "info");

      await instructorService.exportInstructorListToExcel(portalUsername);

      showSnackbar("Excel file downloaded successfully!", "success");
    } catch (err) {
      console.error("Error exporting to Excel:", err);
      showSnackbar("Error exporting to Excel. Please try again.", "error");
    }
  };

  // Refresh instructor list
  const refreshInstructors = async () => {
    try {
      const portalUsername = getPortalUsername(user);
      if (!portalUsername) {
        showSnackbar(
          "Unable to resolve portal username. Please log in again.",
          "error",
        );
        return;
      }

      const response = await instructorService.getInstructorList(portalUsername);

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
