import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  CircularProgress,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import PortalDialog from "./PortalDialog";
import AppSnackbar from "./AppSnackbar";
import { useAppSnackbar } from "./useAppSnackbar";
import PortalModalSelect from "./PortalModalSelect";
import { portalModalFieldSx, portalModalSendButtonSx } from "./portalModalStyles";
import { useAuth } from "../../../contexts/AuthContext";
import studentDashboardService from "../../../services/studentDashboardService";
import { countries } from "../../../constants/countries";

const GRADES = Array.from({ length: 12 }, (_, i) => i + 1);

const emptyFormData = {
  studentID: "",
  studentFName: "",
  studentLName: "",
  studentEmail: "",
  school: "",
  grade: "",
  phoneNumber: "",
  city: "",
  state: "",
  country: "US",
};

const getPhoneDigits = (phoneNumber) => String(phoneNumber || "").replace(/\D/g, "");

const validateProfileForm = (data) => {
  const errors = {};
  const phoneNumber = String(data.phoneNumber || "").trim();
  const phoneDigits = getPhoneDigits(phoneNumber);

  if (phoneNumber && phoneDigits.length !== 10) {
    errors.phoneNumber = "Enter a valid 10-digit phone number.";
  }

  return errors;
};

const mapProfileToForm = (p, fallbackId = "") => ({
  studentID: String(p.studentID ?? p.StudentID ?? fallbackId),
  studentFName: p.studentFName ?? p.StudentFName ?? "",
  studentLName: p.studentLName ?? p.StudentLName ?? "",
  studentEmail: p.studentEmail ?? p.StudentEmail ?? p.email ?? "",
  school: p.school ?? p.School ?? "",
  grade: String(p.grade ?? p.Grade ?? ""),
  phoneNumber: p.phoneNumber ?? p.PhoneNumber ?? p.phone ?? "",
  city: p.city ?? p.City ?? "",
  state: p.state ?? p.State ?? "",
  country: (p.country ?? p.Country ?? "US").toString().slice(0, 2) || "US",
});

const UpdateProfileModal = ({ open, onClose, studentId: studentIdProp, onSaved }) => {
  const { user } = useAuth();

  const resolvedStudentId = useMemo(() => {
    if (studentIdProp != null && String(studentIdProp).trim() !== "") {
      return String(studentIdProp).trim();
    }
    return "";
  }, [studentIdProp]);

  const chapterId = useMemo(() => {
    const c = user?.chapterId ?? user?.chapterID;
    const n = parseInt(String(c ?? "1"), 10);
    return Number.isFinite(n) && n > 0 ? n : 1;
  }, [user]);

  const { snackbar, showSnackbar, closeSnackbar } = useAppSnackbar("error");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [formData, setFormData] = useState(emptyFormData);

  useEffect(() => {
    if (!open) {
      setFormData(emptyFormData);
      setLoading(false);
      setSubmitting(false);
      setValidationErrors({});
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setValidationErrors({});

        if (resolvedStudentId) {
          const id = parseInt(resolvedStudentId, 10);
          if (!Number.isFinite(id) || id <= 0) {
            showSnackbar("Invalid Student ID.", "error");
            return;
          }
          const response = await studentDashboardService.getStudentProfileById(id);
          if (response?.isSuccess && response.studentProfile) {
            setFormData(mapProfileToForm(response.studentProfile, id));
          } else {
            showSnackbar(response?.message || "Profile not found.", "error");
          }
          return;
        }

        const username = user?.username || user?.email;
        if (!username) {
          showSnackbar("Sign in required to update your profile.", "error");
          return;
        }

        const response = await studentDashboardService.getStudentProfile(
          username,
          chapterId,
        );
        if (response?.isSuccess && response.studentProfile) {
          setFormData(mapProfileToForm(response.studentProfile));
        } else {
          showSnackbar(response?.message || "Profile not found.", "error");
        }
      } catch (err) {
        console.error("Error loading profile:", err);
        showSnackbar("Failed to load profile data. Please try again.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [open, user, resolvedStudentId, chapterId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const nextValue =
      name === "phoneNumber" ? value.replace(/\D/g, "").slice(0, 10) : value;
    setFormData((prev) => ({ ...prev, [name]: nextValue }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextValidationErrors = validateProfileForm(formData);
    if (Object.keys(nextValidationErrors).length > 0) {
      setValidationErrors(nextValidationErrors);
      showSnackbar("Please fix the highlighted fields before submitting.", "error");
      return;
    }

    const sid = parseInt(formData.studentID, 10);
    if (!Number.isFinite(sid) || sid <= 0) {
      showSnackbar("Missing or invalid Student ID.", "error");
      return;
    }

    try {
      setSubmitting(true);

      const res = await studentDashboardService.updateStudentProfile({
        studentID: sid,
        studentFName: formData.studentFName,
        studentLName: formData.studentLName,
        studentEmail: formData.studentEmail.trim(),
        school: formData.school,
        grade: String(formData.grade ?? ""),
        city: formData.city,
        state: formData.state,
        country: formData.country,
        phoneNumber: getPhoneDigits(formData.phoneNumber),
        class: "",
        memberType: user?.memberType ?? "",
      });

      if (res?.isSuccess === true || res?.IsSuccess === true) {
        const successMessage =
          res?.message ||
          res?.Message ||
          "You have updated your profile successfully";
        onSaved?.(formData, successMessage);
        onClose?.();
      } else {
        showSnackbar(res?.message || res?.Message || "Failed to update profile.", "error");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      showSnackbar(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to update profile. Please try again.",
        "error",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (submitting) return;
    onClose?.();
  };

  return (
    <>
    <PortalDialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      disableClose={submitting}
      ariaLabelledby="update-profile-dialog-title"
      title="Update Profile"
      icon={<PersonIcon sx={{ fontSize: 20 }} />}
      actions={
        <Button
          type="submit"
          form="update-profile-form"
          variant="contained"
          disabled={loading || submitting}
          startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : null}
          sx={portalModalSendButtonSx}
        >
          {submitting ? "Saving…" : "Save"}
        </Button>
      }
    >
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box component="form" id="update-profile-form" onSubmit={handleSubmit}>
          <Grid container spacing={2} sx={{ pt: 0.5 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Student First Name"
                name="studentFName"
                value={formData.studentFName}
                onChange={handleInputChange}
                required
                size="small"
                sx={portalModalFieldSx}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Student Last Name"
                name="studentLName"
                value={formData.studentLName}
                onChange={handleInputChange}
                required
                size="small"
                sx={portalModalFieldSx}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Student Email Address"
                name="studentEmail"
                value={formData.studentEmail}
                onChange={handleInputChange}
                size="small"
                sx={portalModalFieldSx}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="School"
                name="school"
                value={formData.school}
                onChange={handleInputChange}
                size="small"
                sx={portalModalFieldSx}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <FormControl fullWidth size="small" sx={portalModalFieldSx}>
                <InputLabel>Grade</InputLabel>
                <PortalModalSelect
                  name="grade"
                  value={formData.grade}
                  onChange={handleInputChange}
                  label="Grade"
                >
                  {GRADES.map((g) => (
                    <MenuItem key={g} value={String(g)}>
                      {g}
                    </MenuItem>
                  ))}
                </PortalModalSelect>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                fullWidth
                label="Parent Contact Phone"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                size="small"
                error={Boolean(validationErrors.phoneNumber)}
                helperText={
                  validationErrors.phoneNumber || "Use 10 digits, e.g. 9999999999."
                }
                inputProps={{
                  inputMode: "numeric",
                  maxLength: 10,
                  pattern: "[0-9]*",
                }}
                sx={portalModalFieldSx}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                size="small"
                sx={portalModalFieldSx}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                fullWidth
                label="State"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                size="small"
                sx={portalModalFieldSx}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth size="small" sx={portalModalFieldSx}>
                <InputLabel>Country</InputLabel>
                <PortalModalSelect
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  label="Country"
                >
                  {countries.map((c) => (
                    <MenuItem key={c.value} value={c.value}>
                      {c.label}
                    </MenuItem>
                  ))}
                </PortalModalSelect>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      )}
    </PortalDialog>
    <AppSnackbar snackbar={snackbar} onClose={closeSnackbar} />
    </>
  );
};

export default UpdateProfileModal;
