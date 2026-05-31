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
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getPhoneDigits = (phoneNumber) => String(phoneNumber || "").replace(/\D/g, "");

const validateProfileForm = (data) => {
  const errors = {};
  const email = String(data.studentEmail || "").trim();
  const phoneNumber = String(data.phoneNumber || "").trim();
  const phoneDigits = getPhoneDigits(phoneNumber);

  if (!email) {
    errors.studentEmail = "Student email address is required.";
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.studentEmail = "Enter a valid email address.";
  }

  if (phoneNumber && phoneDigits.length !== 10) {
    errors.phoneNumber = "Enter a valid 10-digit phone number.";
  }

  return errors;
};

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
  const [validationErrors, setValidationErrors] = useState({});

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
    const nextValue = name === "phoneNumber" ? value.replace(/\D/g, "").slice(0, 10) : value;
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
      setError("Please fix the highlighted fields before submitting.");
      return;
    }

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
      <Box sx={{ height: "48px" }} />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              backgroundColor: "rgba(25, 118, 210, 0.12)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PersonIcon sx={{ fontSize: 28, color: "#1976d2" }} />
          </Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#1976d2",
              fontSize: { xs: "1.6rem", md: "2rem" },
            }}
          >
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

        <Paper
          elevation={3}
          sx={{
            p: { xs: 2.5, md: 4 },
            borderRadius: 3,
            backgroundColor: "rgba(255, 255, 255, 0.97)",
            boxShadow: "0 18px 45px rgba(0, 0, 0, 0.22)",
          }}
        >
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
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
              <Grid size={{ xs: 12, md: 4 }}>
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
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="Student Email Address"
                  name="studentEmail"
                  type="email"
                  value={formData.studentEmail}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                  error={Boolean(validationErrors.studentEmail)}
                  helperText={validationErrors.studentEmail}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="School"
                  name="school"
                  value={formData.school}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 2 }}>
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
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <TextField
                  fullWidth
                  label="Parent Contact Phone"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  variant="outlined"
                  error={Boolean(validationErrors.phoneNumber)}
                  helperText={validationErrors.phoneNumber || "Use 10 digits, e.g. 9999999999."}
                  inputProps={{
                    inputMode: "numeric",
                    maxLength: 10,
                    pattern: "[0-9]*",
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <TextField
                  fullWidth
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
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
              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={submitting}
                    sx={{
                      minWidth: { xs: "100%", sm: 240 },
                      height: 48,
                      fontSize: "1rem",
                      fontWeight: 700,
                      borderRadius: 2,
                      textTransform: "uppercase",
                      boxShadow: "0 8px 18px rgba(25, 118, 210, 0.25)",
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
    </Box>
  );
};

export default UpdateProfile;
