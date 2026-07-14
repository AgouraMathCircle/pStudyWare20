import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useAuth } from "../../../contexts/AuthContext";
import authService from "../../../services/authService";
import AppSnackbar from "./AppSnackbar";
import { useAppSnackbar } from "./useAppSnackbar";
import StudentHeader, { StudentRoleHeaderSpacer } from "../Student/StudentHeader";
import AdminHeader, { AdminRoleHeaderSpacer } from "../Admin/AdminHeader";
import InstructorHeader, {
  InstructorRoleHeaderSpacer,
} from "../Instructor/InstructorHeader";
import VolunteerHeader, {
  VolunteerRoleHeaderSpacer,
} from "../Volunteer/VolunteerHeader";
import { adminSessionListTitleSx } from "../styles/applicationSurfaces";
import "./ChangePassword.css";

const NEW_PASSWORD_MIN_LEN = 10;
const NEW_PASSWORD_MAX_LEN = 16;
const CURRENT_PASSWORD_MAX_LEN = 50;

/**
 * Resolve portal role for header + page chrome.
 * Coordinator (C) shares instructor chrome.
 */
const resolvePortalRole = (user, pathname = "") => {
  const memberType = String(
    user?.memberType || user?.MemberType || "",
  ).toUpperCase();
  const role = String(user?.role || "").toLowerCase();

  if (
    pathname.includes("/pstudyware/instructor") ||
    memberType === "I" ||
    memberType === "C" ||
    role.includes("instructor") ||
    role.includes("coordinator")
  ) {
    return "instructor";
  }
  if (
    pathname.includes("/pstudyware/volunteer") ||
    memberType === "V" ||
    role.includes("volunteer")
  ) {
    return "volunteer";
  }
  if (
    pathname.includes("/pstudyware/student") ||
    memberType === "S" ||
    role.includes("student")
  ) {
    return "student";
  }
  if (
    pathname.includes("/admin") ||
    memberType === "A" ||
    role.includes("admin")
  ) {
    return "admin";
  }
  return "admin";
};

/**
 * Shared Change Password page for all roles:
 * Student, Admin, SystemAdmin, Instructor, Coordinator, Volunteer.
 *
 * @param {object} props
 * @param {boolean} [props.skipRoleHeader=false] - When true, parent shell already
 *   renders the role header (InstructorShell / VolunteerShell).
 */
const ChangePassword = ({ skipRoleHeader = false }) => {
  const location = useLocation();
  const { user } = useAuth();
  const { snackbar, showSnackbar, closeSnackbar } = useAppSnackbar();
  const [loading, setLoading] = useState(false);
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

  const portalRole = resolvePortalRole(user, location.pathname);
  const showOwnHeader = !skipRoleHeader;

  const displayName =
    user?.username || user?.Username || user?.email || user?.Email || "";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setValidationErrors((prev) => ({ ...prev, [name]: "" }));
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
    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await authService.changePassword(
        formData.currentPassword,
        formData.password,
      );

      if (response?.isSuccess || response?.IsSuccess) {
        showSnackbar(
          "You have changed your password successfully!",
          "success",
        );
        setFormData({
          currentPassword: "",
          password: "",
          confirmPassword: "",
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        showSnackbar(
          response?.message ||
            response?.Message ||
            "Failed to update password. Please try again.",
          "error",
        );
      }
    } catch (err) {
      console.error("Error updating password:", err);
      showSnackbar(
        err.message || "Failed to update password. Please try again.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const passwordVisibilityAdornment = (show, toggle) => (
    <InputAdornment position="end">
      <IconButton
        aria-label="toggle password visibility"
        onClick={toggle}
        onMouseDown={handleMouseDownPassword}
        edge="end"
        size="small"
        className="change-password-visibility-btn"
      >
        {show ? (
          <VisibilityOff fontSize="small" />
        ) : (
          <Visibility fontSize="small" />
        )}
      </IconButton>
    </InputAdornment>
  );

  const renderPasswordField = ({
    name,
    show,
    toggle,
    maxLength,
    helperText,
    autoComplete,
  }) => (
    <TextField
      name={name}
      size="small"
      type={show ? "text" : "password"}
      value={formData[name]}
      onChange={handleInputChange}
      error={!!validationErrors[name]}
      helperText={helperText}
      required
      variant="outlined"
      autoComplete={autoComplete}
      inputProps={{ maxLength }}
      className="change-password-field"
      InputProps={{
        endAdornment: passwordVisibilityAdornment(show, toggle),
      }}
    />
  );

  const roleHeader = (() => {
    if (!showOwnHeader) return null;
    if (portalRole === "student") {
      return (
        <>
          <StudentHeader user={user} />
          <StudentRoleHeaderSpacer />
        </>
      );
    }
    if (portalRole === "admin") {
      return (
        <>
          <AdminHeader user={user} />
          <AdminRoleHeaderSpacer />
        </>
      );
    }
    if (portalRole === "instructor") {
      return (
        <>
          <InstructorHeader user={user} />
          <InstructorRoleHeaderSpacer />
        </>
      );
    }
    if (portalRole === "volunteer") {
      return (
        <>
          <VolunteerHeader user={user} />
          <VolunteerRoleHeaderSpacer />
        </>
      );
    }
    return null;
  })();

  const pageClassName = [
    "change-password-page",
    portalRole === "student" ? "change-password-page--student student-dashboard" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Box className={pageClassName}>
      {roleHeader}

      <div className="change-password-container">
        <div className="change-password-card">
          <div className="change-password-card-content">
            <Typography
              variant="subtitle1"
              component="h1"
              className="change-password-title"
              sx={adminSessionListTitleSx}
            >
              Change Password
            </Typography>

            <form className="change-password-form" onSubmit={handleSubmit}>
              <div className="change-password-table-wrap">
                <table className="change-password-table">
                  <tbody>
                    <tr>
                      <th scope="row" className="change-password-label-cell">
                        User Name:
                      </th>
                      <td className="change-password-value-cell">
                        <span className="change-password-value-text">
                          {displayName}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row" className="change-password-label-cell">
                        Current Password:
                      </th>
                      <td className="change-password-input-cell">
                        {renderPasswordField({
                          name: "currentPassword",
                          show: showCurrentPassword,
                          toggle: () => setShowCurrentPassword((v) => !v),
                          maxLength: CURRENT_PASSWORD_MAX_LEN,
                          helperText: validationErrors.currentPassword,
                          autoComplete: "current-password",
                        })}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row" className="change-password-label-cell">
                        Password:
                      </th>
                      <td className="change-password-input-cell">
                        {renderPasswordField({
                          name: "password",
                          show: showPassword,
                          toggle: () => setShowPassword((v) => !v),
                          maxLength: NEW_PASSWORD_MAX_LEN,
                          helperText:
                            validationErrors.password ||
                            `${NEW_PASSWORD_MIN_LEN}–${NEW_PASSWORD_MAX_LEN} characters`,
                          autoComplete: "new-password",
                        })}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row" className="change-password-label-cell">
                        Confirm Password:
                      </th>
                      <td className="change-password-input-cell">
                        {renderPasswordField({
                          name: "confirmPassword",
                          show: showConfirmPassword,
                          toggle: () => setShowConfirmPassword((v) => !v),
                          maxLength: NEW_PASSWORD_MAX_LEN,
                          helperText: validationErrors.confirmPassword,
                          autoComplete: "new-password",
                        })}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="change-password-submit-row">
                <div
                  className="change-password-submit-spacer"
                  aria-hidden="true"
                />
                <div className="change-password-submit-cell">
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading}
                    className="change-password-submit-btn"
                  >
                    {loading ? (
                      <CircularProgress size={22} color="inherit" />
                    ) : (
                      "Submit"
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <AppSnackbar snackbar={snackbar} onClose={closeSnackbar} />
    </Box>
  );
};

export default ChangePassword;
