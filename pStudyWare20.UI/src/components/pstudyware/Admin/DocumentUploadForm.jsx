import React, { useState } from "react";
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
  Grid,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  CloudUpload as UploadIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { APPLICATION_ADMIN_TITLE_COLOR } from "../styles/applicationSurfaces";

const DocumentUploadForm = ({ open, onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    topics: "",
    videoURL:
      "https://www.youtube.com/channel/UCWK2w-BVGps-Y9c08B5pRgA/featured",
    description: "Quiz",
    session: "Fall Session 1",
    class: "JB",
    publish: "0",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");

  // Description options
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

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (file.type !== "application/pdf") {
        setError("Sorry, we can accept only PDF files.");
        setSelectedFile(null);
        e.target.value = "";
        return;
      }
      // Validate file size (2MB = 2097152 bytes)
      if (file.size > 2097152) {
        setError("File size must be less than 2 MB.");
        setSelectedFile(null);
        e.target.value = "";
        return;
      }
      setSelectedFile(file);
      setError("");
    }
  };

  // Handle submit
  const handleSubmit = async () => {
    // Validate
    if (!formData.topics.trim()) {
      setError("Topics is required.");
      return;
    }
    if (!selectedFile) {
      setError("Please select a PDF file.");
      return;
    }

    // Convert file to base64
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const base64 = e.target.result.split(",")[1];
        const uploadData = {
          Topics: formData.topics,
          VideoURL: formData.videoURL,
          DocName: selectedFile.name,
          Description: formData.description,
          Class: formData.class,
          Session: formData.session,
          Publish: formData.publish === "1" ? "Y" : "N",
          DocType: "W",
          FileContent: base64,
          ContentType: selectedFile.type,
        };

        await onSubmit(uploadData);
        handleClose();
      } catch (err) {
        setError("Error preparing file for upload.");
      }
    };
    reader.readAsDataURL(selectedFile);
  };

  // Handle close
  const handleClose = () => {
    setFormData({
      topics: "",
      videoURL:
        "https://www.youtube.com/channel/UCWK2w-BVGps-Y9c08B5pRgA/featured",
      description: "Quiz",
      session: "Fall Session 1",
      class: "JB",
      publish: "0",
    });
    setSelectedFile(null);
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{ backgroundColor: APPLICATION_ADMIN_TITLE_COLOR, color: "white" }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <UploadIcon />
            <Typography variant="h6">Upload Class Material</Typography>
          </Box>
          <Typography variant="caption">(only PDF &lt; 2 MB)</Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        <Grid container spacing={2}>
          {/* Topics */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Topics *"
              name="topics"
              value={formData.topics}
              onChange={handleChange}
              placeholder="Enter document topics"
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
              placeholder="Enter video URL"
            />
          </Grid>

          {/* File Upload */}
          <Grid item xs={12}>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              startIcon={<UploadIcon />}
            >
              {selectedFile ? selectedFile.name : "Select PDF File *"}
              <input
                type="file"
                hidden
                accept=".pdf"
                onChange={handleFileChange}
              />
            </Button>
            {selectedFile && (
              <Typography
                variant="caption"
                color="textSecondary"
                sx={{ mt: 0.5, display: "block" }}
              >
                Size: {(selectedFile.size / 1024).toFixed(2)} KB
              </Typography>
            )}
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

      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={handleClose}
          startIcon={<CloseIcon />}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} /> : <UploadIcon />}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DocumentUploadForm;
