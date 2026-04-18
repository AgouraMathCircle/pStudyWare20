import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Box,
  Typography,
} from "@mui/material";
import { APPLICATION_ADMIN_TITLE_COLOR } from "../../../styles/applicationSurfaces";

const InstructorForm = ({
  open,
  onClose,
  onSubmit,
  instructor,
  chapters,
  isEdit,
}) => {
  const [formData, setFormData] = useState({
    instructorID: 0,
    firstName: "",
    lastName: "",
    emailID: "",
    contactPhone: "",
    chapterID: "",
    class: "JB",
    section: "A",
    instructorType: "P",
    memberStatus: "1",
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  // Class options
  const classOptions = [
    { value: "JB", label: "Junior Beginner" },
    { value: "JI", label: "Junior Intermediate" },
    { value: "JA", label: "Junior Advanced" },
    { value: "SB", label: "Senior Beginner" },
    { value: "SI", label: "Senior Intermediate" },
    { value: "SA", label: "Senior Advanced" },
    { value: "DS", label: "Data Science" },
    { value: "AI", label: "Artificial Intelligence" },
    { value: "GD", label: "Game Development" },
    { value: "AD", label: "App Development" },
    { value: "DM", label: "Data Management" },
    { value: "ST", label: "PSAT" },
    { value: "AT", label: "ACT" },
  ];

  // Instructor type options
  const typeOptions = [
    { value: "P", label: "Primary" },
    { value: "S", label: "Secondary" },
    { value: "C", label: "Coordinator" },
    { value: "V", label: "Volunteer" },
  ];

  // Status options
  const statusOptions = [
    { value: "1", label: "Active" },
    { value: "0", label: "Inactive" },
  ];

  // Section options
  const sectionOptions = [
    { value: "A", label: "A" },
    { value: "B", label: "B" },
    { value: "C", label: "C" },
  ];

  // Initialize form data when instructor prop changes
  useEffect(() => {
    if (instructor && isEdit) {
      const chapterIDRaw = instructor.chapterID ?? instructor.ChapterID ?? "";
      const classRaw = instructor.class ?? instructor.Class ?? "JB";
      const sectionRaw = instructor.section ?? instructor.Section ?? "A";
      const typeRaw =
        instructor.instructorType ?? instructor.InstructorType ?? "P";
      const statusRaw =
        instructor.memberStatus ?? instructor.MemberStatus ?? "1";

      setFormData({
        instructorID: instructor.instructorID ?? instructor.InstructorID ?? 0,
        firstName: instructor.firstName ?? instructor.FirstName ?? "",
        lastName: instructor.lastName ?? instructor.LastName ?? "",
        emailID: instructor.emailID ?? instructor.EmailID ?? "",
        contactPhone:
          instructor.contactPhone ?? instructor.ContactPhone ?? "",
        // Force string IDs so <Select> matches MenuItem values.
        chapterID: chapterIDRaw !== "" ? String(chapterIDRaw) : "",
        class: classRaw || "JB",
        section: sectionRaw || "A",
        instructorType: typeRaw || "P",
        memberStatus: statusRaw !== "" ? String(statusRaw) : "1",
      });
    } else {
      // Reset form for new instructor
      setFormData({
        instructorID: 0,
        firstName: "",
        lastName: "",
        emailID: "",
        contactPhone: "",
        chapterID:
          chapters && chapters.length > 0 ? String(chapters[0].value) : "",
        class: "JB",
        section: "A",
        instructorType: "P",
        memberStatus: "1",
      });
    }
    setErrors({});
    setSubmitError("");
  }, [instructor, isEdit, open, chapters]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First Name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last Name is required";
    }

    if (!formData.emailID.trim()) {
      newErrors.emailID = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailID)) {
      newErrors.emailID = "Invalid email format";
    }

    if (!formData.contactPhone.trim()) {
      newErrors.contactPhone = "Contact Phone is required";
    }

    if (!formData.chapterID) {
      newErrors.chapterID = "Chapter is required";
    }

    if (!formData.class) {
      newErrors.class = "Class is required";
    }

    if (!formData.section) {
      newErrors.section = "Section is required";
    }

    if (!formData.instructorType) {
      newErrors.instructorType = "Instructor Type is required";
    }

    if (!formData.memberStatus) {
      newErrors.memberStatus = "Status is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
      handleClose();
    } catch (error) {
      setSubmitError(
        error.message || "An error occurred while saving the instructor",
      );
    }
  };

  // Handle close
  const handleClose = () => {
    setFormData({
      instructorID: 0,
      firstName: "",
      lastName: "",
      emailID: "",
      contactPhone: "",
      chapterID: "",
      class: "JB",
      section: "A",
      instructorType: "P",
      memberStatus: "1",
    });
    setErrors({});
    setSubmitError("");
    onClose();
  };

  if (!open) return null;

  const formFields = (
    <Box sx={{ mt: 2 }}>
      {submitError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {submitError}
        </Alert>
      )}

      <Grid container spacing={2}>
        {/* First Name */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            error={!!errors.firstName}
            helperText={errors.firstName}
            required
            size="small"
          />
        </Grid>

        {/* Last Name */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            error={!!errors.lastName}
            helperText={errors.lastName}
            required
            size="small"
          />
        </Grid>

        {/* Email */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Email ID"
            name="emailID"
            type="email"
            value={formData.emailID}
            onChange={handleChange}
            error={!!errors.emailID}
            helperText={errors.emailID}
            required
            size="small"
          />
        </Grid>

        {/* Contact Phone */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Contact Phone"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleChange}
            error={!!errors.contactPhone}
            helperText={errors.contactPhone}
            required
            size="small"
          />
        </Grid>

        {/* Chapter */}
        <Grid item xs={12} sm={6}>
          <FormControl
            fullWidth
            error={!!errors.chapterID}
            required
            size="small"
          >
            <InputLabel>Chapter</InputLabel>
            <Select
              name="chapterID"
              value={formData.chapterID}
              onChange={handleChange}
              label="Chapter"
            >
              {chapters && chapters.length > 0 ? (
                chapters.map((chapter) => (
                  <MenuItem
                    key={String(chapter.value)}
                    value={String(chapter.value)}
                  >
                    {chapter.label}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="">No chapters available</MenuItem>
              )}
            </Select>
            {errors.chapterID && (
              <Typography variant="caption" color="error">
                {errors.chapterID}
              </Typography>
            )}
          </FormControl>
        </Grid>

        {/* Instructor Type */}
        <Grid item xs={12} sm={6}>
          <FormControl
            fullWidth
            error={!!errors.instructorType}
            required
            size="small"
          >
            <InputLabel>Type</InputLabel>
            <Select
              name="instructorType"
              value={formData.instructorType}
              onChange={handleChange}
              label="Type"
            >
              {typeOptions.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
            {errors.instructorType && (
              <Typography variant="caption" color="error">
                {errors.instructorType}
              </Typography>
            )}
          </FormControl>
        </Grid>

        {/* Class */}
        <Grid item xs={12} sm={6}>
          <FormControl
            fullWidth
            error={!!errors.class}
            required
            size="small"
          >
            <InputLabel>Class</InputLabel>
            <Select
              name="class"
              value={formData.class}
              onChange={handleChange}
              label="Class"
            >
              {classOptions.map((classOption) => (
                <MenuItem key={classOption.value} value={classOption.value}>
                  {classOption.label}
                </MenuItem>
              ))}
            </Select>
            {errors.class && (
              <Typography variant="caption" color="error">
                {errors.class}
              </Typography>
            )}
          </FormControl>
        </Grid>

        {/* Section */}
        <Grid item xs={12} sm={6}>
          <FormControl
            fullWidth
            error={!!errors.section}
            required
            size="small"
          >
            <InputLabel>Section</InputLabel>
            <Select
              name="section"
              value={formData.section}
              onChange={handleChange}
              label="Section"
            >
              {sectionOptions.map((section) => (
                <MenuItem key={section.value} value={section.value}>
                  {section.label}
                </MenuItem>
              ))}
            </Select>
            {errors.section && (
              <Typography variant="caption" color="error">
                {errors.section}
              </Typography>
            )}
          </FormControl>
        </Grid>

        {/* Status */}
        <Grid item xs={12} sm={6}>
          <FormControl
            fullWidth
            error={!!errors.memberStatus}
            required
            size="small"
          >
            <InputLabel>Status</InputLabel>
            <Select
              name="memberStatus"
              value={formData.memberStatus}
              onChange={handleChange}
              label="Status"
            >
              {statusOptions.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Select>
            {errors.memberStatus && (
              <Typography variant="caption" color="error">
                {errors.memberStatus}
              </Typography>
            )}
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6" sx={{ fontWeight: 600, color: APPLICATION_ADMIN_TITLE_COLOR }}>
          {isEdit ? "Update Instructor" : "Add Instructor"}
        </Typography>
      </DialogTitle>
      <DialogContent>{formFields}</DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {isEdit ? "Update" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InstructorForm;
