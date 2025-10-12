import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Grid,
  Alert,
  CircularProgress,
  Container,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { useAuth } from "../../../contexts/AuthContext";
import { useParams } from "react-router-dom";
import studentDashboardService from "../../../services/studentDashboardService";
import { countries } from "../../../constants/countries";

const UpdateProfile = () => {
  const { user } = useAuth();
  const { studentId } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
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
  });

  // Grades 1-12
  const grades = Array.from({ length: 12 }, (_, i) => i + 1);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        // If studentId from URL params is available, use it to fetch profile
        if (studentId) {
          const response = await studentDashboardService.getStudentProfileById(
            parseInt(studentId)
          );
          console.log("Fetched profile by ID:", response);

          if (response.studentProfile) {
            const profile = response.studentProfile;
            setFormData({
              studentID: profile.studentID || "",
              studentFName: profile.studentFName || "",
              studentLName: profile.studentLName || "",
              studentEmail: profile.studentEmail || profile.email || "",
              school: profile.school || "",
              grade: profile.grade || "",
              phoneNumber: profile.phoneNumber || profile.phone || "",
              city: profile.city || "",
              state: profile.state || "",
              country: profile.country || "US",
            });
          }
        } else {
          // Fallback to username/chapterId if no studentId in URL
          const username = user?.email || user?.username;
          const chapterId = user?.chapterId || user?.chapterID || 1;

          const response = await studentDashboardService.getStudentProfile(
            username,
            chapterId
          );
          console.log("Fetched profile by username:", response);

          if (response.studentProfile) {
            const profile = response.studentProfile;
            setFormData({
              studentID: profile.studentID || "",
              studentFName: profile.studentFName || "",
              studentLName: profile.studentLName || "",
              studentEmail: profile.studentEmail || profile.email || "",
              school: profile.school || "",
              grade: profile.grade || "",
              phoneNumber: profile.phoneNumber || profile.phone || "",
              city: profile.city || "",
              state: profile.state || "",
              country: profile.country || "US",
            });
          }
        }
      } catch (err) {
        console.error("Error loading profile:", err);
        setError("Failed to load profile data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, studentId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(false);

      // TODO: Call the API to update the profile
      // For now, we'll just show a success message
      console.log("Updating profile with data:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess(true);

      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
        <PersonIcon sx={{ fontSize: 28, color: "#1976d2" }} />
        <Typography variant="h5" sx={{ fontWeight: 600, color: "#1976d2" }}>
          Update Your Profile
        </Typography>
      </Box>

      {/* Success Message */}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          You have updated your profile successfully!
        </Alert>
      )}

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Form */}
      <Paper elevation={3} sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Student First Name */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Student First Name"
                name="studentFName"
                value={formData.studentFName}
                onChange={handleInputChange}
                required
                variant="outlined"
              />
            </Grid>

            {/* Student Last Name */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Student Last Name"
                name="studentLName"
                value={formData.studentLName}
                onChange={handleInputChange}
                required
                variant="outlined"
              />
            </Grid>

            {/* Student Email */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Student Email Address"
                name="studentEmail"
                type="email"
                value={formData.studentEmail}
                onChange={handleInputChange}
                required
                variant="outlined"
              />
            </Grid>

            {/* School */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="School"
                name="school"
                value={formData.school}
                onChange={handleInputChange}
                variant="outlined"
              />
            </Grid>

            {/* Grade */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Grade</InputLabel>
                <Select
                  name="grade"
                  value={formData.grade}
                  onChange={handleInputChange}
                  label="Grade"
                >
                  {grades.map((grade) => (
                    <MenuItem key={grade} value={grade}>
                      {grade}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Parent Contact Phone */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Parent Contact Phone"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                variant="outlined"
              />
            </Grid>

            {/* City */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                variant="outlined"
              />
            </Grid>

            {/* State */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="State"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                variant="outlined"
              />
            </Grid>

            {/* Country */}
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Country</InputLabel>
                <Select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  label="Country"
                >
                  {countries.map((country) => (
                    <MenuItem key={country.value} value={country.value}>
                      {country.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={submitting}
                  sx={{
                    minWidth: 200,
                    height: 45,
                    fontSize: "1rem",
                  }}
                >
                  {submitting ? <CircularProgress size={24} /> : "Submit"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default UpdateProfile;
