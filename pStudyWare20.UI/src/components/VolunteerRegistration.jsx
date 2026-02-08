import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Box,
  Paper,
  Breadcrumbs,
  Divider,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import volunteerService from "../services/volunteerService";
import "../styles/VolunteerRegistration.css";
// Import images from src/assets
import pageHeaderImg from "../assets/images/about/page-header.jpg";

// Validation schema
const validationSchema = yup.object({
  firstName: yup
    .string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters"),
  lastName: yup
    .string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters"),
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address"),
  phoneNo: yup
    .string()
    .required("Phone number is required")
    .matches(
      /^[01]?[- .]?(\([2-9]\d{2}\)|[2-9]\d{2})[- .]?\d{3}[- .]?\d{4}$/,
      "Please enter a valid phone number",
    ),
  city: yup
    .string()
    .required("City is required")
    .min(2, "City must be at least 2 characters"),
  state: yup
    .string()
    .required("State is required")
    .min(2, "State must be at least 2 characters"),
  country: yup.string().required("Country is required"),
  schoolName: yup
    .string()
    .required("School/University name is required")
    .min(2, "School/University name must be at least 2 characters"),
  grade: yup.string().required("Grade/Degree is required"),
  sessionId: yup.string().required("Register For is required"),
  locationId: yup
    .number()
    .required("Course/Location is required")
    .min(1, "Please select a course/location"),
  interestedFor: yup
    .string()
    .required("Please select an area of interest")
    .notOneOf(["0"], "Please select an area of interest"),
  aboutyourself: yup
    .string()
    .max(500, "About yourself must be less than 500 characters"),
});

const VolunteerRegistration = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [locations, setLocations] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [grades, setGrades] = useState([]);
  const [interestedOptions, setInterestedOptions] = useState([]);
  const [countries, setCountries] = useState([]);
  const [submitButtonHover, setSubmitButtonHover] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNo: "",
      city: "",
      state: "",
      country: "",
      schoolName: "",
      grade: "",
      sessionId: "",
      locationId: 0,
      interestedFor: "0",
      aboutyourself: "",
    },
  });

  // Load dropdown data
  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        const [
          locationsData,
          sessionsData,
          gradesData,
          interestedData,
          countriesData,
        ] = await Promise.all([
          volunteerService.getLocations(),
          volunteerService.getSessions(),
          volunteerService.getGrades(),
          volunteerService.getInterestedOptions(),
          volunteerService.getCountries(),
        ]);

        setLocations(locationsData);
        setSessions(sessionsData);
        setGrades(gradesData);
        setInterestedOptions(interestedData);
        setCountries(countriesData);
      } catch (error) {
        console.error("Error loading dropdown data:", error);
        showSnackbar(
          "Error loading form data. Please refresh the page.",
          "error",
        );
      }
    };

    loadDropdownData();
  }, []);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Auto-hide snackbar after 6 seconds
  useEffect(() => {
    if (snackbar.open) {
      const timer = setTimeout(() => {
        setSnackbar((prev) => ({ ...prev, open: false }));
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [snackbar.open]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Prepare the data for API submission - matching the DTO structure
      const volunteerData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNo: data.phoneNo,
        city: data.city,
        state: data.state,
        country: data.country,
        schoolName: data.schoolName,
        grade: data.grade,
        sessionId: data.sessionId,
        locationId: data.locationId,
        interestedFor: data.interestedFor,
        aboutyourself: data.aboutyourself || "",
      };

      const response = await volunteerService.registerVolunteer(volunteerData);

      showSnackbar(
        "Volunteer registration submitted successfully! We will contact you soon.",
        "success",
      );

      // Reset form after successful submission
      reset();

      // Optionally redirect after a delay
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Registration error:", error);
      showSnackbar(
        error.message || "Failed to submit registration. Please try again.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="volunteer-registration-container">
      {/* Breadcrumbs */}
      <div
        className="sc-breadcrumbs breadcrumbs-overlay"
        style={{ "--page-header-bg": `url(${pageHeaderImg})` }}
      >
        <div className="breadcrumbs-img">
          <img src={pageHeaderImg} alt="Breadcrumbs Image" />
        </div>
        <div className="breadcrumbs-text white-color">
          <h1 className="page-title">VOLUNTEER REGISTRATION</h1>
          <ul>
            <li>
              <a className="active" href="/">
                Home &gt;
              </a>
            </li>
            <li>
              <a className="active" href="/registration">
                Registration &gt;
              </a>
            </li>
            <li className="active">Volunteer Registration</li>
          </ul>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="sc-about pt-80 pb-70 md-pt-40">
        <div className="container">
          {/* Main Form */}
          <div className="row">
            <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
              <div className="row">
                {/* Personal Information Section */}
                <div className="col-lg-6 md-mb-30">
                  <div
                    className="form-section"
                    style={{
                      padding: "20px",
                      backgroundColor: "#ffffff",
                      borderRadius: "8px",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      marginBottom: "20px",
                    }}
                  >
                    <h4
                      className="heading"
                      style={{
                        color: "#174a10",
                        fontWeight: "bold",
                        textAlign: "center",
                        marginBottom: "20px",
                      }}
                    >
                      Personal{" "}
                      <span style={{ color: "#1976d2" }}>Information</span>
                    </h4>
                    <div
                      className="form-group-container"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                      }}
                    >
                      <Controller
                        name="firstName"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="First Name *"
                            error={!!errors.firstName}
                            helperText={errors.firstName?.message}
                            variant="outlined"
                            sx={{ width: "100%" }}
                          />
                        )}
                      />

                      <Controller
                        name="lastName"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Last Name *"
                            error={!!errors.lastName}
                            helperText={errors.lastName?.message}
                            variant="outlined"
                            sx={{ width: "100%" }}
                          />
                        )}
                      />

                      <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Email ID *"
                            type="email"
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            variant="outlined"
                            sx={{ width: "100%" }}
                          />
                        )}
                      />

                      <Controller
                        name="phoneNo"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Phone (999-999-9999) *"
                            placeholder="999-999-9999"
                            error={!!errors.phoneNo}
                            helperText={errors.phoneNo?.message}
                            variant="outlined"
                            sx={{ width: "100%" }}
                          />
                        )}
                      />

                      <Controller
                        name="city"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="City *"
                            error={!!errors.city}
                            helperText={errors.city?.message}
                            variant="outlined"
                            sx={{ width: "100%" }}
                          />
                        )}
                      />

                      <Controller
                        name="state"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="State *"
                            error={!!errors.state}
                            helperText={errors.state?.message}
                            variant="outlined"
                            sx={{ width: "100%" }}
                          />
                        )}
                      />

                      <Controller
                        name="country"
                        control={control}
                        render={({ field }) => (
                          <FormControl
                            error={!!errors.country}
                            sx={{ width: "100%" }}
                          >
                            <InputLabel>Country *</InputLabel>
                            <Select {...field} label="Country *">
                              {countries.map((country) => (
                                <MenuItem
                                  key={country.value}
                                  value={country.value}
                                >
                                  {country.label}
                                </MenuItem>
                              ))}
                            </Select>
                            {errors.country && (
                              <FormHelperText>
                                {errors.country.message}
                              </FormHelperText>
                            )}
                          </FormControl>
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Educational Information Section */}
                <div className="col-lg-6 md-mb-30">
                  <div
                    className="form-section"
                    style={{
                      padding: "20px",
                      backgroundColor: "#ffffff",
                      borderRadius: "8px",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      marginBottom: "20px",
                    }}
                  >
                    <h4
                      className="heading"
                      style={{
                        color: "#174a10",
                        fontWeight: "bold",
                        textAlign: "center",
                        marginBottom: "20px",
                      }}
                    >
                      Educational{" "}
                      <span style={{ color: "#1976d2" }}>Information</span>
                    </h4>
                    <div
                      className="form-group-container"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                      }}
                    >
                      <Controller
                        name="schoolName"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="School/University *"
                            error={!!errors.schoolName}
                            helperText={errors.schoolName?.message}
                            variant="outlined"
                            sx={{ width: "100%" }}
                          />
                        )}
                      />

                      <Controller
                        name="grade"
                        control={control}
                        render={({ field }) => (
                          <FormControl
                            error={!!errors.grade}
                            sx={{ width: "100%" }}
                          >
                            <InputLabel>Grade/Degree *</InputLabel>
                            <Select {...field} label="Grade/Degree *">
                              {grades.map((grade) => (
                                <MenuItem key={grade.value} value={grade.value}>
                                  {grade.label}
                                </MenuItem>
                              ))}
                            </Select>
                            {errors.grade && (
                              <FormHelperText>
                                {errors.grade.message}
                              </FormHelperText>
                            )}
                          </FormControl>
                        )}
                      />

                      <Controller
                        name="sessionId"
                        control={control}
                        render={({ field }) => (
                          <FormControl
                            error={!!errors.sessionId}
                            sx={{ width: "100%" }}
                          >
                            <InputLabel>Register For *</InputLabel>
                            <Select {...field} label="Register For *">
                              {sessions.map((session) => (
                                <MenuItem key={session.id} value={session.id}>
                                  {session.name}
                                </MenuItem>
                              ))}
                            </Select>
                            {errors.sessionId && (
                              <FormHelperText>
                                {errors.sessionId.message}
                              </FormHelperText>
                            )}
                          </FormControl>
                        )}
                      />

                      <Controller
                        name="locationId"
                        control={control}
                        render={({ field }) => (
                          <FormControl
                            error={!!errors.locationId}
                            sx={{ width: "100%" }}
                          >
                            <InputLabel>Course/Location *</InputLabel>
                            <Select {...field} label="Course/Location *">
                              <MenuItem value={0}>
                                <em>--Select--</em>
                              </MenuItem>
                              {locations.map((location) => (
                                <MenuItem key={location.id} value={location.id}>
                                  {location.name}
                                </MenuItem>
                              ))}
                            </Select>
                            {errors.locationId && (
                              <FormHelperText>
                                {errors.locationId.message}
                              </FormHelperText>
                            )}
                          </FormControl>
                        )}
                      />

                      <Controller
                        name="interestedFor"
                        control={control}
                        render={({ field }) => (
                          <FormControl
                            error={!!errors.interestedFor}
                            sx={{ width: "100%" }}
                          >
                            <InputLabel>Interested For *</InputLabel>
                            <Select {...field} label="Interested For *">
                              <MenuItem value="0">
                                <em>--Select--</em>
                              </MenuItem>
                              {interestedOptions.map((option) => (
                                <MenuItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </MenuItem>
                              ))}
                            </Select>
                            {errors.interestedFor && (
                              <FormHelperText>
                                {errors.interestedFor.message}
                              </FormHelperText>
                            )}
                          </FormControl>
                        )}
                      />

                      <Controller
                        name="aboutyourself"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="About Yourself (Achievements, Merits, etc)"
                            multiline
                            rows={4}
                            error={!!errors.aboutyourself}
                            helperText={errors.aboutyourself?.message}
                            variant="outlined"
                            placeholder="Tell us about your achievements, merits, and any additional information..."
                            sx={{ width: "100%" }}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div
                  className="col-lg-12 text-center"
                  style={{ marginTop: "10px", marginBottom: "10px" }}
                >
                  <button
                    type="submit"
                    disabled={loading}
                    onMouseEnter={() => !loading && setSubmitButtonHover(true)}
                    onMouseLeave={() => setSubmitButtonHover(false)}
                    style={{
                      minWidth: "150px",
                      padding: "12px 10px",
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                      backgroundColor: loading
                        ? "#53b50a"
                        : submitButtonHover
                          ? "#4a7c59"
                          : "#53b50a",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "25px",
                      cursor: loading ? "not-allowed" : "pointer",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {loading ? <span>Submitting...</span> : "Submit"}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Success/Error Snackbar - Custom fixed div so it appears above navbar */}
          {snackbar.open && (
            <div
              style={{
                position: "fixed",
                top: "100px",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 99999,
                minWidth: "200px",
                maxWidth: "400px",
                padding: "12px 16px",
                backgroundColor:
                  snackbar.severity === "error" ? "#d32f2f" : "#1976d2",
                color: "#ffffff",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                fontSize: "0.875rem",
                lineHeight: "1.4",
              }}
            >
              <span style={{ flex: 1, paddingRight: "12px" }}>
                {snackbar.message}
              </span>
              <button
                type="button"
                onClick={handleCloseSnackbar}
                aria-label="Close"
                style={{
                  background: "none",
                  border: "none",
                  color: "#ffffff",
                  fontSize: "20px",
                  cursor: "pointer",
                  padding: "0",
                  lineHeight: "1",
                  flexShrink: 0,
                  opacity: 0.9,
                }}
              >
                ×
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VolunteerRegistration;
