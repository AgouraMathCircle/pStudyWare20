import React, { useState } from "react";
import {
  Alert,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { CloudUpload as UploadIcon } from "@mui/icons-material";
import PortalDialog from "../Common/PortalDialog";
import { portalModalFieldSx, portalModalSendButtonSx } from "../Common/portalModalStyles";

const REPOSITORY_ALLOWED_EXTENSIONS = [".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx"];

const descriptionOptions = [
  "Quiz",
  "Quiz Solution",
  "Lecture Notes",
  "Class Work",
  "Class Work Solution",
  "Home Work",
  "Home Work Solution",
  "Answer Key",
  "Placement Test",
  "AMC 8 PreTest",
  "Math Kangaroo PreTest",
  "Math Count PreTest",
  "Miscellaneous",
  "Final Exam",
];

const sessionOptions = [
  ...Array.from({ length: 9 }, (_, i) => `Fall Session ${i + 1}`),
  ...Array.from({ length: 10 }, (_, i) => `Spring Session ${i + 1}`),
  "Miscellanous",
];

const classOptions = [
  { value: "JB", label: "Junior Beginner" },
  { value: "JI", label: "Junior Intermediate" },
  { value: "JA", label: "Junior Advanced" },
  { value: "SB", label: "Senior Beginner" },
  { value: "SI", label: "Senior Intermediate" },
  { value: "SA", label: "Senior Advanced" },
];

const defaultFormData = {
  topics: "",
  description: "Quiz",
  session: "Fall Session 1",
  class: "JB",
  publish: "0",
};

const isAllowedRepositoryFile = (fileName) => {
  const lower = String(fileName ?? "").toLowerCase();
  return REPOSITORY_ALLOWED_EXTENSIONS.some((ext) => lower.endsWith(ext));
};

const DocumentRepositoryUploadForm = ({ open, onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState(defaultFormData);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!isAllowedRepositoryFile(file.name)) {
      setError("Sorry, we can accept only Word, Excel and PowerPoint files.");
      setSelectedFile(null);
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
    setError("");
  };

  const handleSubmit = async () => {
    if (!selectedFile?.name) {
      setError("Please select a file to upload.");
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const base64 = String(event.target?.result ?? "").split(",")[1];
          if (!base64) {
            setError("Unable to read the selected file.");
            return;
          }

          const result = await onSubmit({
            Topics: formData.topics.trim(),
            DocName: selectedFile.name,
            Description: formData.description,
            Class: formData.class,
            Session: formData.session,
            Publish: formData.publish,
            FileContent: base64,
          });
          if (result?.isSuccess === true || result?.IsSuccess === true) {
            handleClose();
          }
        } catch {
          setError("Error preparing file for upload.");
        }
      };
      reader.onerror = () => setError("Error reading the selected file.");
      reader.readAsDataURL(selectedFile);
    } catch {
      setError("Error preparing file for upload.");
    }
  };

  const handleClose = () => {
    setFormData(defaultFormData);
    setSelectedFile(null);
    setError("");
    onClose();
  };

  return (
    <PortalDialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      disableClose={loading}
      ariaLabelledby="document-repository-upload-dialog-title"
      title="Upload Documents (Word/Excel/PowerPoint)"
      icon={<UploadIcon sx={{ fontSize: 20 }} />}
      actions={
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={
            loading ? <CircularProgress size={16} color="inherit" /> : <UploadIcon />
          }
          sx={portalModalSendButtonSx}
        >
          {loading ? "Uploading..." : "Submit"}
        </Button>
      }
    >
      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 2 }}>
        Word, Excel, and PowerPoint files only
      </Typography>

      {error ? (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      ) : null}

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Topics"
            name="topics"
            value={formData.topics}
            onChange={handleChange}
            placeholder="Enter document topics"
            size="small"
            inputProps={{ maxLength: 100 }}
            sx={portalModalFieldSx}
          />
        </Grid>

        <Grid item xs={12}>
          <Button variant="outlined" component="label" fullWidth startIcon={<UploadIcon />}>
            {selectedFile?.name || "Select File *"}
            <input
              type="file"
              hidden
              accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx"
              onChange={handleFileChange}
            />
          </Button>
          {selectedFile ? (
            <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5, display: "block" }}>
              Size: {(selectedFile.size / 1024).toFixed(2)} KB
            </Typography>
          ) : null}
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small" sx={portalModalFieldSx}>
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

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small" sx={portalModalFieldSx}>
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

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small" sx={portalModalFieldSx}>
            <InputLabel>Class</InputLabel>
            <Select name="class" value={formData.class} onChange={handleChange} label="Class">
              {classOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small" sx={portalModalFieldSx}>
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
    </PortalDialog>
  );
};

export default DocumentRepositoryUploadForm;
