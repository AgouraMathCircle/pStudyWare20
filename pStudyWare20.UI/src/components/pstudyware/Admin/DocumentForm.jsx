import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Grid,
  Chip,
} from "@mui/material";
import {
  CloudUpload as UploadIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import documentService from "../../../services/documentService";

const DocumentForm = ({ open, onClose, onSubmit, document, isEdit }) => {
  const [formData, setFormData] = useState({
    topics: "",
    videoURL:
      "https://www.youtube.com/channel/UCWK2w-BVGps-Y9c08B5pRgA/featured",
    description: "Quiz",
    session: "Fall Session 1",
    class: "JB",
    publish: "0",
    file: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // Description options (from the legacy system)
  const descriptionOptions = [
    "Quiz",
    "Quiz Solution",
    "Lecture Notes",
    "Lecture Presentation",
    "Class Work",
    "Class Work Solution",
    "Home Work",
    "Home Work Solution",
    "Answer Key",
    "Study Guide",
    "Mock Test",
    "Answer Sheet",
    "Final Exam",
    "Final Exam Answer Sheet",
    "Placement Test",
    "AMC 8 PreTest",
    "Math Kangaroo PreTest",
    "Math Count PreTest",
    "Project",
    "Syllabus",
    "Miscellaneous",
  ];

  // Session options
  const sessionOptions = [
    ...Array.from({ length: 10 }, (_, i) => `Fall Session ${i + 1}`),
    ...Array.from({ length: 10 }, (_, i) => `Spring Session ${i + 1}`),
    "Miscellanous",
  ];

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
    { value: "ST", label: "PSAT/SAT" },
    { value: "AT", label: "ACT" },
  ];

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      if (isEdit && document) {
        setFormData({
          topics: document.topics || "",
          videoURL:
            document.videoURL ||
            "https://www.youtube.com/channel/UCWK2w-BVGps-Y9c08B5pRgA/featured",
          description: document.description || "Quiz",
          session: document.session || "Fall Session 1",
          class: document.class || "JB",
          publish: document.publish === "Y" ? "1" : "0",
          file: null,
        });
      } else {
        setFormData({
          topics: "",
          videoURL:
            "https://www.youtube.com/channel/UCWK2w-BVGps-Y9c08B5pRgA/featured",
          description: "Quiz",
          session: "Fall Session 1",
          class: "JB",
          publish: "0",
          file: null,
        });
      }
      setErrors({});
      setUploadError("");
    }
  }, [open, isEdit, document]);

  // Handle input change
  const handleChange = (event) => {
    const { name, value } = event.target;
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

  // Handle file change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setUploadError("");

    if (file) {
      // Validate file type (only PDF)
      if (file.type !== "application/pdf") {
        setUploadError("Only PDF files are allowed.");
        event.target.value = "";
        return;
      }

      // Validate file size (max 2 MB)
      const maxSize = 2 * 1024 * 1024; // 2 MB in bytes
      if (file.size > maxSize) {
        setUploadError("File size must be less than 2 MB.");
        event.target.value = "";
        return;
      }

      setFormData((prev) => ({
        ...prev,
        file: file,
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.topics.trim()) {
      newErrors.topics = "Topics is required";
    }

    if (!formData.file && !isEdit) {
      newErrors.file = "Please select a PDF file to upload";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Convert file to byte array
      let fileContent = [];
      let contentType = "";
      let docName = "";

      if (formData.file) {
        fileContent = await documentService.fileToByteArray(formData.file);
        contentType = formData.file.type;
        docName = formData.file.name;
      }

      // Prepare upload data
      const uploadData = {
        topics: formData.topics,
        videoURL: formData.videoURL,
        docName: docName,
        description: formData.description,
        class: formData.class,
        session: formData.session,
        publish: formData.publish,
        docType: "W",
        fileContent: fileContent,
        contentType: contentType,
      };

      await onSubmit(uploadData);
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      setUploadError(
        error.message || "Failed to upload document. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: "primary.main",
          color: "white",
          fontWeight: 600,
        }}
      >
        Upload Class Material (PDF only, max 2 MB)
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        {uploadError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {uploadError}
          </Alert>
        )}

        <Grid container spacing={2}>
          {/* Topics */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Topics"
              name="topics"
              value={formData.topics}
              onChange={handleChange}
              error={!!errors.topics}
              helperText={errors.topics}
              required
              inputProps={{ maxLength: 100 }}
            />
          </Grid>

          {/* Video URL */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Video URL"
              name="videoURL"
              value={formData.videoURL}
              onChange={handleChange}
              inputProps={{ maxLength: 100 }}
            />
          </Grid>

          {/* File Upload */}
          <Grid item xs={12}>
            <Box
              sx={{
                border: "2px dashed",
                borderColor: errors.file ? "error.main" : "primary.main",
                borderRadius: 2,
                p: 2,
                textAlign: "center",
                backgroundColor: "grey.50",
              }}
            >
              <input
                accept="application/pdf"
                style={{ display: "none" }}
                id="file-upload"
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor="file-upload">
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<UploadIcon />}
                  sx={{ textTransform: "none", fontWeight: 500 }}
                >
                  Select PDF File
                </Button>
              </label>
              {formData.file && (
                <Box sx={{ mt: 2 }}>
                  <Chip
                    label={formData.file.name}
                    color="primary"
                    variant="outlined"
                    onDelete={() =>
                      setFormData((prev) => ({ ...prev, file: null }))
                    }
                  />
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Size: {(formData.file.size / 1024).toFixed(2)} KB
                  </Typography>
                </Box>
              )}
              {errors.file && (
                <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                  {errors.file}
                </Typography>
              )}
            </Box>
          </Grid>

          {/* Description */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Description</InputLabel>
              <Select
                name="description"
                value={formData.description}
                onChange={handleChange}
                label="Description"
              >
                {descriptionOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Session */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Session</InputLabel>
              <Select
                name="session"
                value={formData.session}
                onChange={handleChange}
                label="Session"
              >
                {sessionOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Class */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Class</InputLabel>
              <Select
                name="class"
                value={formData.class}
                onChange={handleChange}
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

          {/* Publish */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Publish</InputLabel>
              <Select
                name="publish"
                value={formData.publish}
                onChange={handleChange}
                label="Publish"
              >
                <MenuItem value="0">No</MenuItem>
                <MenuItem value="1">Yes</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          startIcon={<CloseIcon />}
          disabled={loading}
          sx={{ textTransform: "none" }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <UploadIcon />}
          sx={{ textTransform: "none", fontWeight: 500, minWidth: 120 }}
        >
          {loading ? "Uploading..." : "Upload"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DocumentForm;
