import React, { useState, useEffect, useMemo } from "react";
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
import { useParams, useSearchParams } from "react-router-dom";
import studentDashboardService from "../../../services/studentDashboardService";
import { countries } from "../../../constants/countries";
import StudentHeader from "../Student/StudentHeader";

const GRADES = Array.from({ length: 12 }, (_, i) => i + 1);

/**
 * Update student profile — mirrors pStudayWare/UpdateProfile.aspx + UpdateProfile.aspx.cs
 * Load: AMC_spSelectStudentProfile via GetStudentProfileById; fallback GetStudentProfile (username/chapter).
 * Save: AMC_spUpdateStudentProfile via POST UpdateStudentProfile.
 */
const UpdateProfile = () => {
  const { user } = useAuth();
  const { studentId: studentIdParam } = useParams();
  const [searchParams] = useSearchParams();

  const resolvedStudentId = useMemo(() => {
    const q = searchParams.get("StudentID");
    if (studentIdParam) return String(studentIdParam).trim();
    if (q) return String(q).trim();
    return "";
  }, [studentIdParam, searchParams]);

  const chapterId = useMemo(() => {
    const c = user?.chapterId ?? user?.chapterID;
    const n = parseInt(String(c ?? "1"), 10);
    return Number.isFinite(n) && n > 0 ? n : 1;
  }, [user]);

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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        if (resolvedStudentId) {
          const id = parseInt(resolvedStudentId, 10);
          if (!Number.isFinite(id) || id <= 0) {
            setError("Invalid Student ID.");
            return;
          }
          const response = await studentDashboardService.getStudentProfileById(id);
          if (response?.isSuccess && response.studentProfile) {
            const p = response.studentProfile;
            setFormData({
              studentID: String(p.studentID ?? p.StudentID ?? id),
              studentFName: p.studentFName ?? p.StudentFName ?? "",
              studentLName: p.studentLName ?? p.StudentLName ?? "",
              studentEmail:
                p.studentEmail ?? p.StudentEmail ?? p.email ?? "",
              school: p.school ?? p.School ?? "",
              grade: String(p.grade ?? p.Grade ?? ""),
              phoneNumber:
                p.phoneNumber ?? p.PhoneNumber ?? p.phone ?? "",
              city: p.city ?? p.City ?? "",
              state: p.state ?? p.State ?? "",
              country: (p.country ?? p.Country ?? "US").toString().slice(0, 2) || "US",
            });
          } else {
            setError(response?.message || "Profile not found.");
          }
          return;
        }

        const username = user?.username || user?.email;
        if (!username) {
          setError("Sign in required, or open this page with a Student ID (URL or ?StudentID=).");
          return;
        }

        const response = await studentDashboardService.getStudentProfile(
          username,
          chapterId
        );
        if (response?.isSuccess && response.studentProfile) {
          const p = response.studentProfile;
          setFormData({
            studentID: String(p.studentID ?? p.StudentID ?? ""),
            studentFName: p.studentFName ?? p.StudentFName ?? "",
            studentLName: p.studentLName ?? p.StudentLName ?? "",
            studentEmail:
              p.studentEmail ?? p.StudentEmail ?? p.email ?? "",
            school: p.school ?? p.School ?? "",
            grade: String(p.grade ?? p.Grade ?? ""),
            phoneNumber:
              p.phoneNumber ?? p.PhoneNumber ?? p.phone ?? "",
            city: p.city ?? p.City ?? "",
            state: p.state ?? p.State ?? "",
            country: (p.country ?? p.Country ?? "US").toString().slice(0, 2) || "US",
          });
        } else {
          setError(response?.message || "Profile not found.");
        }
      } catch (err) {
        console.error("Error loading profile:", err);
        setError("Failed to load profile data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, resolvedStudentId, chapterId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const sid = parseInt(formData.studentID, 10);
    if (!Number.isFinite(sid) || sid <= 0) {
      setError("Missing or invalid Student ID.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(false);

      const res = await studentDashboardService.updateStudentProfile({
        studentID: sid,
        studentFName: formData.studentFName,
        studentLName: formData.studentLName,
        studentEmail: formData.studentEmail,
        school: formData.school,
        grade: String(formData.grade ?? ""),
        city: formData.city,
        state: formData.state,
        country: formData.country,
        phoneNumber: formData.phoneNumber,
        class: "",
        memberType: user?.memberType ?? "",
      });

      if (res?.isSuccess) {
        setSuccess(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setError(res?.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to update profile. Please try again."
      );
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
    <Box>
      <StudentHeader user={user} />
      <Box sx={{ height: "40px" }} />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
          <PersonIcon sx={{ fontSize: 28, color: "#1976d2" }} />
          <Typography variant="h5" sx={{ fontWeight: 600, color: "#1976d2" }}>
            Update Your Profile
          </Typography>
        </Box>

        {success && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(false)}>
            You have updated your profile successfully!
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Paper elevation={3} sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
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
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Grade</InputLabel>
                  <Select
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
                  </Select>
                </FormControl>
              </Grid>
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
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Country</InputLabel>
                  <Select
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
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={submitting}
                    sx={{ minWidth: 200, height: 45, fontSize: "1rem" }}
                  >
                    {submitting ? <CircularProgress size={24} /> : "Submit"}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default UpdateProfile;
