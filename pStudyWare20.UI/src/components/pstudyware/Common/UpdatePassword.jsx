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
import {
  adminSessionListHeaderBarSx,
  adminSessionListTitleSx,
} from "../styles/applicationSurfaces";
const NEW_PASSWORD_MIN_LEN = 10;
const NEW_PASSWORD_MAX_LEN = 16;
const CURRENT_PASSWORD_MAX_LEN = 50;

/** Legacy pStudyWare UpdatePassword.aspx (.control_box / .inputbox / .button) */
const LEGACY_CONTROL_BG = "#54B50A";
const LEGACY_CONTROL_BORDER = "#cceac4";
const LEGACY_INPUT_BG = "#D4E6F1";
const LEGACY_INPUT_BORDER = "#54B50A";
const LEGACY_BUTTON_BG = "#174a10";
const LEGACY_FIELD_WIDTH = 220;

const legacyCompactFieldSx = {
  width: LEGACY_FIELD_WIDTH,
  "& .MuiOutlinedInput-root": {
    backgroundColor: LEGACY_INPUT_BG,
    color: "#0e4354",
    fontSize: "0.875rem",
    "& fieldset": {
      borderColor: LEGACY_INPUT_BORDER,
    },
    "&:hover fieldset": {
      borderColor: LEGACY_INPUT_BORDER,
    },
    "&.Mui-focused fieldset": {
      borderColor: LEGACY_INPUT_BORDER,
    },
  },
  "& .MuiFormHelperText-root": {
    color: "#2980B9",
    marginLeft: 0,
  },
};

const legacyLabelSx = {
  color: "whitesmoke",
  fontSize: "0.8rem",
  lineHeight: 1.5,
  minWidth: 130,
  pt: 0.75,
  flexShrink: 0,
};

const legacyRowSx = {
  display: "flex",
  alignItems: "flex-start",
  gap: 1.5,
  mb: 1.5,
};

const legacyControlBoxSx = {
  backgroundColor: LEGACY_CONTROL_BG,
  border: `1px solid ${LEGACY_CONTROL_BORDER}`,
  borderRadius: 0,
  p: "20px 20px 15px 24px",
  width: "fit-content",
  maxWidth: "100%",
};

const legacyFieldSx = {
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
};

const UpdatePassword = ({ embedded = false }) => {
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

    setValidationErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

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

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const isDashboardShell =
    location.pathname.startsWith("/pstudyware/instructor/") ||
    location.pathname.startsWith("/pstudyware/volunteer/");
<<<<<<< HEAD
  const isAdminPasswordPage =
    user?.role === "Admin" ||
    user?.role === "SystemAdmin" ||
    user?.memberType?.toUpperCase() === "A" ||
    location.pathname.startsWith("/pstudyware/admin/") ||
    location.pathname.startsWith("/admin/");
=======
  const isStudentPasswordPage =
    location.pathname.includes("/pstudyware/student/update-password") ||
    location.pathname.includes("/student/update-password");
  const isPortalPasswordPage =
    location.pathname.includes("/admin/update-password") ||
    location.pathname.includes("/admin/change-password") ||
    isStudentPasswordPage;
  const useLegacyCompactLayout = embedded || isPortalPasswordPage;

  const displayName =
    user?.username || user?.Username || user?.email || user?.Email || "";

  const passwordVisibilityAdornment = (show, toggle) => (
    <InputAdornment position="end">
      <IconButton
        aria-label="toggle password visibility"
        onClick={toggle}
        onMouseDown={handleMouseDownPassword}
        edge="end"
        size="small"
        sx={{ color: "#0e4354" }}
      >
        {show ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
      </IconButton>
    </InputAdornment>
  );

  const legacyForm = (
    <Box sx={legacyControlBoxSx}>
      <form onSubmit={handleSubmit}>
        <Box sx={legacyRowSx}>
          <Typography sx={legacyLabelSx}>User Name:</Typography>
          <Typography
            sx={{
              color: "whitesmoke",
              fontSize: "0.8rem",
              lineHeight: 1.5,
              pt: 0.75,
              wordBreak: "break-all",
            }}
          >
            {displayName}
          </Typography>
        </Box>

        <Box sx={legacyRowSx}>
          <Typography sx={legacyLabelSx}>Current Password:</Typography>
          <TextField
            name="currentPassword"
            size="small"
            type={showCurrentPassword ? "text" : "password"}
            value={formData.currentPassword}
            onChange={handleInputChange}
            error={!!validationErrors.currentPassword}
            helperText={validationErrors.currentPassword}
            required
            variant="outlined"
            autoComplete="current-password"
            inputProps={{ maxLength: CURRENT_PASSWORD_MAX_LEN }}
            sx={legacyCompactFieldSx}
            InputProps={{
              endAdornment: passwordVisibilityAdornment(
                showCurrentPassword,
                () => setShowCurrentPassword((v) => !v),
              ),
            }}
          />
        </Box>

        <Box sx={legacyRowSx}>
          <Typography sx={legacyLabelSx}>Password:</Typography>
          <TextField
            name="password"
            size="small"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleInputChange}
            error={!!validationErrors.password}
            helperText={
              validationErrors.password ||
              `${NEW_PASSWORD_MIN_LEN}–${NEW_PASSWORD_MAX_LEN} characters`
            }
            required
            variant="outlined"
            autoComplete="new-password"
            inputProps={{ maxLength: NEW_PASSWORD_MAX_LEN }}
            sx={legacyCompactFieldSx}
            InputProps={{
              endAdornment: passwordVisibilityAdornment(showPassword, () =>
                setShowPassword((v) => !v),
              ),
            }}
          />
        </Box>

        <Box sx={legacyRowSx}>
          <Typography sx={legacyLabelSx}>Confirm Password:</Typography>
          <TextField
            name="confirmPassword"
            size="small"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleInputChange}
            error={!!validationErrors.confirmPassword}
            helperText={validationErrors.confirmPassword}
            required
            variant="outlined"
            autoComplete="new-password"
            inputProps={{ maxLength: NEW_PASSWORD_MAX_LEN }}
            sx={legacyCompactFieldSx}
            InputProps={{
              endAdornment: passwordVisibilityAdornment(
                showConfirmPassword,
                () => setShowConfirmPassword((v) => !v),
              ),
            }}
          />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              minWidth: 100,
              height: 25,
              fontSize: "0.8rem",
              lineHeight: 1,
              backgroundColor: LEGACY_BUTTON_BG,
              color: "#FFFFFF",
              textTransform: "none",
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#0f3209",
                boxShadow: "none",
              },
              "&:disabled": {
                backgroundColor: "#999999",
              },
            }}
          >
            {loading ? "..." : "Submit"}
          </Button>
        </Box>
      </form>
    </Box>
  );

  const wideForm = (
    <Box
      sx={{
        backgroundColor: "#66CC00",
        padding: 4,
        borderRadius: 1,
        width: "100%",
      }}
    >
      <form onSubmit={handleSubmit}>
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
            <span style={{ color: "#666666" }}>{displayName}</span>
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" sx={{ color: "#666666", mb: 1 }}>
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
            sx={legacyFieldSx}
            InputProps={{
              endAdornment: passwordVisibilityAdornment(
                showCurrentPassword,
                () => setShowCurrentPassword((v) => !v),
              ),
            }}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" sx={{ color: "#666666", mb: 1 }}>
            New Password ({NEW_PASSWORD_MIN_LEN}–{NEW_PASSWORD_MAX_LEN} characters):
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
            sx={legacyFieldSx}
            InputProps={{
              endAdornment: passwordVisibilityAdornment(showPassword, () =>
                setShowPassword((v) => !v),
              ),
            }}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" sx={{ color: "#666666", mb: 1 }}>
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
            sx={legacyFieldSx}
            InputProps={{
              endAdornment: passwordVisibilityAdornment(
                showConfirmPassword,
                () => setShowConfirmPassword((v) => !v),
              ),
            }}
          />
        </Box>

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
              "&:hover": { backgroundColor: "#2d5a00" },
              "&:disabled": { backgroundColor: "#999999" },
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
          </Button>
        </Box>
      </form>
    </Box>
  );

  const alerts = (
    <>
      {success && (
        <Alert severity="success" sx={{ mb: 2, maxWidth: useLegacyCompactLayout ? 420 : "100%" }}>
          You have changed your password successfully!
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2, maxWidth: useLegacyCompactLayout ? 420 : "100%" }}>
          {error}
        </Alert>
      )}
    </>
  );

  if (useLegacyCompactLayout) {
    return (
      <Box sx={{ width: "100%" }}>
        {embedded && (
          <Box sx={adminSessionListHeaderBarSx}>
            <Typography variant="subtitle1" component="div" sx={adminSessionListTitleSx}>
              Update Password
            </Typography>
          </Box>
        )}
        {alerts}
        {legacyForm}
      </Box>
    );
  }
>>>>>>> main

  return (
    <Box>
      <Container
        maxWidth="md"
        sx={{ py: isDashboardShell ? 1 : 4 }}
      >
        {alerts}
        <Box sx={{ textAlign: "left", mb: 3 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              color: "#1976d2",
              mb: 4,
            }}
          >
            Update Password
          </Typography>
        </Box>
        {wideForm}
      </Container>
    </Box>
  );
};

export default UpdatePassword;
