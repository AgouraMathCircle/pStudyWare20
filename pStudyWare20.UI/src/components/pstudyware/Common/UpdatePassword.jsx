import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Container,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useAuth } from "../../../contexts/AuthContext";
import authService from "../../../services/authService";
import StudentHeader from "../Student/StudentHeader";
import { APPLICATION_ADMIN_TITLE_COLOR } from "../../../styles/applicationSurfaces";

const NEW_PASSWORD_MIN_LEN = 10;
const NEW_PASSWORD_MAX_LEN = 16;
const CURRENT_PASSWORD_MAX_LEN = 50;

const UpdatePassword = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    currentPassword: "",
    password: "",
    confirmPassword: "",
  });

  const [validationErrors, setValidationErrors] = useState({
    currentPassword: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation errors when user types
    setValidationErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    // Clear general error
    setError(null);
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.currentPassword) {
      errors.currentPassword = "Current password is required";
      isValid = false;
    }

    if (!formData.password) {
      errors.password = "New password is required";
      isValid = false;
    } else if (formData.password.length < NEW_PASSWORD_MIN_LEN) {
      errors.password = `New password must be at least ${NEW_PASSWORD_MIN_LEN} characters`;
      isValid = false;
    } else if (formData.password.length > NEW_PASSWORD_MAX_LEN) {
      errors.password = `New password cannot exceed ${NEW_PASSWORD_MAX_LEN} characters`;
      isValid = false;
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Confirm password cannot be empty";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Password must match confirm password";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const response = await authService.updatePassword(
        formData.currentPassword,
        formData.password,
      );

      if (response?.isSuccess || response?.IsSuccess) {
        setSuccess(true);
        setFormData({
          currentPassword: "",
          password: "",
          confirmPassword: "",
        });
        // Scroll to top to show success message
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setError(
          response?.message ||
            response?.Message ||
            "Failed to update password. Please try again.",
        );
      }
    } catch (err) {
      console.error("Error updating password:", err);
      setError(err.message || "Failed to update password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowCurrentPassword = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const isStudent =
    user?.role === "Student" || user?.memberType?.toUpperCase() === "S";
  const isDashboardShell =
    location.pathname.startsWith("/pstudyware/instructor/") ||
    location.pathname.startsWith("/pstudyware/volunteer/");
  const isAdminPasswordPage =
    user?.role === "Admin" ||
    user?.role === "SystemAdmin" ||
    user?.memberType?.toUpperCase() === "A" ||
    location.pathname.startsWith("/pstudyware/admin/") ||
    location.pathname.startsWith("/admin/");

  return (
    <Box>
      {isStudent && !isDashboardShell && <StudentHeader user={user} />}
      {isStudent && !isDashboardShell && (
        <Box sx={{ height: "48px" }} aria-hidden />
      )}
      <Container maxWidth="md" sx={{ py: isDashboardShell ? 1 : 4 }}>
        {/* Success Message */}
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            You have changed your password successfully!
          </Alert>
        )}

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Header - Left Aligned Title */}
        <Box sx={{ textAlign: "left", mb: 3 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              color: isAdminPasswordPage
                ? APPLICATION_ADMIN_TITLE_COLOR
                : "#1976d2",
              mb: 4,
            }}
          >
            Update Password
          </Typography>
        </Box>

        {/* Form Container - Lime Green Background */}
        <Box
          sx={{
            backgroundColor: "#66CC00",
            padding: 4,
            borderRadius: 1,
            width: "100%",
          }}
        >
          <form onSubmit={handleSubmit}>
            {/* User Name Field */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="body1"
                sx={{
                  color: "#666666",
                  mb: 1,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span style={{ marginRight: "8px" }}>User Name:</span>
                <span style={{ color: "#666666" }}>
                  {user?.username ||
                    user?.Username ||
                    user?.email ||
                    user?.Email}
                </span>
              </Typography>
            </Box>

            {/* Current password */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="body1"
                sx={{
                  color: "#666666",
                  mb: 1,
                }}
              >
                Current Password:
              </Typography>
              <TextField
                fullWidth
                name="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                value={formData.currentPassword}
                onChange={handleInputChange}
                error={!!validationErrors.currentPassword}
                helperText={validationErrors.currentPassword}
                required
                variant="outlined"
                autoComplete="current-password"
                inputProps={{ maxLength: CURRENT_PASSWORD_MAX_LEN }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#E0FFFF",
                    "& fieldset": {
                      borderColor: "#B0B0B0",
                    },
                    "&:hover fieldset": {
                      borderColor: "#808080",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#808080",
                    },
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle current password visibility"
                        onClick={handleClickShowCurrentPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showCurrentPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* New password */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="body1"
                sx={{
                  color: "#666666",
                  mb: 1,
                }}
              >
                New Password ({NEW_PASSWORD_MIN_LEN}–{NEW_PASSWORD_MAX_LEN}{" "}
                characters):
              </Typography>
              <TextField
                fullWidth
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                error={!!validationErrors.password}
                helperText={validationErrors.password}
                required
                variant="outlined"
                autoComplete="new-password"
                inputProps={{ maxLength: NEW_PASSWORD_MAX_LEN }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#E0FFFF",
                    "& fieldset": {
                      borderColor: "#B0B0B0",
                    },
                    "&:hover fieldset": {
                      borderColor: "#808080",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#808080",
                    },
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Confirm Password Field */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="body1"
                sx={{
                  color: "#666666",
                  mb: 1,
                }}
              >
                Confirm New Password:
              </Typography>
              <TextField
                fullWidth
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={!!validationErrors.confirmPassword}
                helperText={validationErrors.confirmPassword}
                required
                variant="outlined"
                autoComplete="new-password"
                inputProps={{ maxLength: NEW_PASSWORD_MAX_LEN }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#E0FFFF",
                    "& fieldset": {
                      borderColor: "#B0B0B0",
                    },
                    "&:hover fieldset": {
                      borderColor: "#808080",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#808080",
                    },
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={handleClickShowConfirmPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Submit Button */}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  minWidth: 200,
                  height: 45,
                  fontSize: "1rem",
                  backgroundColor: "#336600",
                  color: "#FFFFFF",
                  "&:hover": {
                    backgroundColor: "#2d5a00",
                  },
                  "&:disabled": {
                    backgroundColor: "#999999",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Submit"
                )}
              </Button>
            </Box>
          </form>
        </Box>
      </Container>
    </Box>
  );
};

export default UpdatePassword;
