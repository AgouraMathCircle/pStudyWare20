import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Grid,
} from "@mui/material";

const MeetingForm = ({
  meeting,
  chapters,
  onSubmit,
  onCancel,
  isSystemAdmin,
}) => {
  // Helper to get property value (handles both camelCase and PascalCase)
  const getProp = (obj, propName) => {
    if (obj[propName] !== undefined) return obj[propName];
    const camelCase = propName.charAt(0).toLowerCase() + propName.slice(1);
    if (obj[camelCase] !== undefined) return obj[camelCase];
    return "";
  };

  const [formData, setFormData] = useState({
    rowId: "0",
    chapterId: "",
    class: "JB",
    section: "A",
    meetingProviderUrl: "",
    meetingUrl: "",
    meetingId: "",
    passcode: "",
    adminLogin: "",
    adminPassCode: "",
    includeSection: "0",
    active: "1",
    meetingDate: "",
    meetingHour: "00",
    meetingMinute: "00",
  });

  const [errors, setErrors] = useState({});

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

  // Section options
  const sectionOptions = [
    { value: "A", label: "A" },
    { value: "B", label: "B" },
  ];

  // Hour options (0-23)
  const hourOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, "0");
    return { value: hour, label: hour };
  });

  // Minute options
  const minuteOptions = [
    { value: "00", label: "00" },
    { value: "15", label: "15" },
    { value: "30", label: "30" },
    { value: "45", label: "45" },
  ];

  // Initialize form with meeting data when editing
  useEffect(() => {
    if (meeting) {
      const [hour = "00", minute = "00"] = (
        meeting.MeetingTime || "00:00"
      ).split(":");
      setFormData({
        rowId: meeting.RowID?.toString() || "0",
        chapterId: meeting.ChapterID || "",
        class: meeting.Class || "JB",
        section: meeting.Section || "A",
        meetingProviderUrl: meeting.MeetingProviderURL || "",
        meetingUrl: meeting.MeetingURL || "",
        meetingId: meeting.MeetingID || "",
        passcode: meeting.Passcode || "",
        adminLogin: meeting.AdminLogin || "",
        adminPassCode: meeting.AdminPassCode || "",
        includeSection: meeting.IncludeSection ? "1" : "0",
        active: meeting.Active ? "1" : "0",
        meetingDate: meeting.MeetingDate || "",
        meetingHour: hour,
        meetingMinute: minute,
      });
    } else {
      // Reset form for new meeting
      setFormData({
        rowId: "0",
        chapterId: "",
        class: "JB",
        section: "A",
        meetingProviderUrl: "",
        meetingUrl: "",
        meetingId: "",
        passcode: "",
        adminLogin: "",
        adminPassCode: "",
        includeSection: "0",
        active: "1",
        meetingDate: "",
        meetingHour: "00",
        meetingMinute: "00",
      });
    }
    setErrors({});
  }, [meeting]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.chapterId) {
      newErrors.chapterId = "Chapter is required";
    }

    if (!formData.meetingDate) {
      newErrors.meetingDate = "Meeting Date is required";
    } else {
      // Validate date format MM/DD/YYYY
      const dateRegex =
        /^(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\d\d$/;
      if (!dateRegex.test(formData.meetingDate)) {
        newErrors.meetingDate = "Please enter date in MM/DD/YYYY format";
      }
    }

    if (!formData.meetingProviderUrl) {
      newErrors.meetingProviderUrl = "Meeting Provider URL is required";
    }

    if (!formData.meetingUrl) {
      newErrors.meetingUrl = "Meeting URL is required";
    }

    if (!formData.meetingId) {
      newErrors.meetingId = "Meeting ID is required";
    }

    if (!formData.passcode) {
      newErrors.passcode = "Passcode is required";
    }

    if (!formData.adminLogin) {
      newErrors.adminLogin = "Admin Login is required";
    }

    if (!formData.adminPassCode) {
      newErrors.adminPassCode = "Admin PassCode is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const meetingTime = `${formData.meetingHour}:${formData.meetingMinute}`;

    const submitData = {
      rowId: formData.rowId,
      chapterId: formData.chapterId,
      class: formData.class,
      section: formData.section,
      meetingProviderUrl: formData.meetingProviderUrl,
      meetingUrl: formData.meetingUrl,
      meetingId: formData.meetingId,
      passcode: formData.passcode,
      adminLogin: formData.adminLogin,
      adminPassCode: formData.adminPassCode,
      includeSection: formData.includeSection,
      active: formData.active,
      meetingTime: meetingTime,
      meetingDate: formData.meetingDate,
    };

    onSubmit(submitData);
  };

  if (!isSystemAdmin) {
    return null; // Don't show form if user is not system admin
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            backgroundColor: "#4CAF50",
            color: "white",
            p: 2,
            mb: 2,
            borderRadius: 1,
          }}
        >
          Update Meeting Schedule
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Chapter */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.chapterId}>
                <InputLabel>Chapter *</InputLabel>
                <Select
                  value={formData.chapterId}
                  onChange={(e) => handleChange("chapterId", e.target.value)}
                  label="Chapter *"
                >
                  <MenuItem value="">Select Chapter</MenuItem>
                  {chapters.map((chapter, idx) => {
                    const value =
                      getProp(chapter, "ChapterID") ||
                      getProp(chapter, "Value") ||
                      chapter.value ||
                      "";
                    const text =
                      getProp(chapter, "ChapterName") ||
                      getProp(chapter, "Text") ||
                      chapter.text ||
                      "";
                    return (
                      <MenuItem key={value || idx} value={value}>
                        {text}
                      </MenuItem>
                    );
                  })}
                </Select>
                {errors.chapterId && (
                  <Typography variant="caption" color="error">
                    {errors.chapterId}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Class */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Class</InputLabel>
                <Select
                  value={formData.class}
                  onChange={(e) => handleChange("class", e.target.value)}
                  label="Class"
                >
                  {classOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Section */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Section</InputLabel>
                <Select
                  value={formData.section}
                  onChange={(e) => handleChange("section", e.target.value)}
                  label="Section"
                >
                  {sectionOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Meeting Date */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Meeting Date (MM/DD/YYYY) *"
                value={formData.meetingDate}
                onChange={(e) => handleChange("meetingDate", e.target.value)}
                error={!!errors.meetingDate}
                helperText={errors.meetingDate}
                placeholder="MM/DD/YYYY"
              />
            </Grid>

            {/* Meeting Time - Hour and Minute */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", gap: 1 }}>
                <FormControl fullWidth>
                  <InputLabel>Hour</InputLabel>
                  <Select
                    value={formData.meetingHour}
                    onChange={(e) =>
                      handleChange("meetingHour", e.target.value)
                    }
                    label="Hour"
                  >
                    {hourOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Minute</InputLabel>
                  <Select
                    value={formData.meetingMinute}
                    onChange={(e) =>
                      handleChange("meetingMinute", e.target.value)
                    }
                    label="Minute"
                  >
                    {minuteOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>

            {/* Meeting Provider URL */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Meeting Provider URL *"
                value={formData.meetingProviderUrl}
                onChange={(e) =>
                  handleChange("meetingProviderUrl", e.target.value)
                }
                error={!!errors.meetingProviderUrl}
                helperText={errors.meetingProviderUrl}
              />
            </Grid>

            {/* Meeting URL */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Meeting URL *"
                value={formData.meetingUrl}
                onChange={(e) => handleChange("meetingUrl", e.target.value)}
                error={!!errors.meetingUrl}
                helperText={errors.meetingUrl}
              />
            </Grid>

            {/* Meeting ID */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Meeting ID *"
                value={formData.meetingId}
                onChange={(e) => handleChange("meetingId", e.target.value)}
                error={!!errors.meetingId}
                helperText={errors.meetingId}
              />
            </Grid>

            {/* Passcode */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Passcode *"
                value={formData.passcode}
                onChange={(e) => handleChange("passcode", e.target.value)}
                error={!!errors.passcode}
                helperText={errors.passcode}
              />
            </Grid>

            {/* Admin Login */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Admin Login *"
                value={formData.adminLogin}
                onChange={(e) => handleChange("adminLogin", e.target.value)}
                error={!!errors.adminLogin}
                helperText={errors.adminLogin}
              />
            </Grid>

            {/* Admin PassCode */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Admin PassCode *"
                value={formData.adminPassCode}
                onChange={(e) => handleChange("adminPassCode", e.target.value)}
                error={!!errors.adminPassCode}
                helperText={errors.adminPassCode}
              />
            </Grid>

            {/* Include Section */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Include Section</InputLabel>
                <Select
                  value={formData.includeSection}
                  onChange={(e) =>
                    handleChange("includeSection", e.target.value)
                  }
                  label="Include Section"
                >
                  <MenuItem value="0">No</MenuItem>
                  <MenuItem value="1">Yes</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Active */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Active</InputLabel>
                <Select
                  value={formData.active}
                  onChange={(e) => handleChange("active", e.target.value)}
                  label="Active"
                >
                  <MenuItem value="0">No</MenuItem>
                  <MenuItem value="1">Yes</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Required Fields Note */}
            <Grid item xs={12}>
              <Typography variant="caption" color="error">
                * Required Fields
              </Typography>
            </Grid>

            {/* Action Buttons */}
            <Grid item xs={12}>
              <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ minWidth: 100 }}
                >
                  Submit
                </Button>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={onCancel}
                  sx={{ minWidth: 100 }}
                >
                  Cancel
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default MeetingForm;
