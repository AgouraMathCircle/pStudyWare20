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
  Alert,
  Box,
  Paper,
  Breadcrumbs,
  Link,
  CircularProgress,
  Snackbar,
  Divider,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import volunteerService from "../services/volunteerService";
import "../styles/VolunteerRegistration.css";

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
      "Please enter a valid phone number"
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
          "error"
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
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

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
        "success"
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
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="volunteer-registration-container">
      {/* Breadcrumbs */}
      <div className="sc-breadcrumbs breadcrumbs-overlay">
        <div className="breadcrumbs-img">
          <img
            src="/assets/images/about/page-header.jpg"
            alt="Breadcrumbs Image"
          />
        </div>
        <div className="breadcrumbs-text white-color">
          <h1 className="page-title">VOLUNTEER REGISTRATION</h1>
          <nav className="breadcrumb-nav">
            <Link to="/" className="breadcrumb-link">
              Home
            </Link>
            <span className="breadcrumb-separator"> &gt; </span>
            <Link to="/registration" className="breadcrumb-link">
              Registration
            </Link>
            <span className="breadcrumb-separator"> &gt; </span>
            <span className="breadcrumb-current">Volunteer Registration</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Main Form - Vertical Layout */}
          <Paper elevation={3} sx={{ p: 4 }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={4}>
                {/* Personal Information Section - Full Width */}
                <Grid item xs={12}>
                  <Card sx={{ p: 2 }}>
                    <CardContent>
                      <Typography
                        variant="h5"
                        gutterBottom
                        sx={{
                          color: "#174a10",
                          fontWeight: "bold",
                          textAlign: "center",
                          mb: 3,
                        }}
                      >
                        Personal{" "}
                        <span style={{ color: "#1976d2" }}>Information</span>
                      </Typography>

                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Controller
                            name="firstName"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                label="First Name *"
                                error={!!errors.firstName}
                                helperText={errors.firstName?.message}
                                variant="outlined"
                              />
                            )}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Controller
                            name="lastName"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                label="Last Name *"
                                error={!!errors.lastName}
                                helperText={errors.lastName?.message}
                                variant="outlined"
                              />
                            )}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                label="Email ID *"
                                type="email"
                                error={!!errors.email}
                                helperText={errors.email?.message}
                                variant="outlined"
                              />
                            )}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Controller
                            name="phoneNo"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                label="Phone (999-999-9999) *"
                                placeholder="999-999-9999"
                                error={!!errors.phoneNo}
                                helperText={errors.phoneNo?.message}
                                variant="outlined"
                              />
                            )}
                          />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                          <Controller
                            name="city"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                label="City *"
                                error={!!errors.city}
                                helperText={errors.city?.message}
                                variant="outlined"
                              />
                            )}
                          />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                          <Controller
                            name="state"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                label="State *"
                                error={!!errors.state}
                                helperText={errors.state?.message}
                                variant="outlined"
                              />
                            )}
                          />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                          <Controller
                            name="country"
                            control={control}
                            render={({ field }) => (
                              <FormControl fullWidth error={!!errors.country}>
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
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Educational Information Section - Full Width */}
                <Grid item xs={12}>
                  <Card sx={{ p: 2 }}>
                    <CardContent>
                      <Typography
                        variant="h5"
                        gutterBottom
                        sx={{
                          color: "#174a10",
                          fontWeight: "bold",
                          textAlign: "center",
                          mb: 3,
                        }}
                      >
                        Educational{" "}
                        <span style={{ color: "#1976d2" }}>Information</span>
                      </Typography>

                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Controller
                            name="schoolName"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                label="School/University *"
                                error={!!errors.schoolName}
                                helperText={errors.schoolName?.message}
                                variant="outlined"
                              />
                            )}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Controller
                            name="grade"
                            control={control}
                            render={({ field }) => (
                              <FormControl fullWidth error={!!errors.grade}>
                                <InputLabel>Grade/Degree *</InputLabel>
                                <Select {...field} label="Grade/Degree *">
                                  {grades.map((grade) => (
                                    <MenuItem
                                      key={grade.value}
                                      value={grade.value}
                                    >
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
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Controller
                            name="sessionId"
                            control={control}
                            render={({ field }) => (
                              <FormControl fullWidth error={!!errors.sessionId}>
                                <InputLabel>Register For *</InputLabel>
                                <Select {...field} label="Register For *">
                                  {sessions.map((session) => (
                                    <MenuItem
                                      key={session.id}
                                      value={session.id}
                                    >
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
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Controller
                            name="locationId"
                            control={control}
                            render={({ field }) => (
                              <FormControl
                                fullWidth
                                error={!!errors.locationId}
                              >
                                <InputLabel>Course/Location *</InputLabel>
                                <Select {...field} label="Course/Location *">
                                  <MenuItem value={0}>
                                    <em>--Select--</em>
                                  </MenuItem>
                                  {locations.map((location) => (
                                    <MenuItem
                                      key={location.id}
                                      value={location.id}
                                    >
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
                        </Grid>

                        <Grid item xs={12}>
                          <Controller
                            name="interestedFor"
                            control={control}
                            render={({ field }) => (
                              <FormControl
                                fullWidth
                                error={!!errors.interestedFor}
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
                        </Grid>

                        <Grid item xs={12}>
                          <Controller
                            name="aboutyourself"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                label="About Yourself (Achievements, Merits, etc)"
                                multiline
                                rows={4}
                                error={!!errors.aboutyourself}
                                helperText={errors.aboutyourself?.message}
                                variant="outlined"
                                placeholder="Tell us about your achievements, merits, and any additional information..."
                              />
                            )}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Submit Button - Full Width */}
                <Grid item xs={12}>
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mt: 4 }}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={loading}
                      sx={{
                        minWidth: 250,
                        py: 1.5,
                        fontSize: "1.1rem",
                        fontWeight: "bold",
                        backgroundColor: "#1976d2",
                        "&:hover": {
                          backgroundColor: "#1565c0",
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
                </Grid>
              </Grid>
            </form>
          </Paper>

          {/* Success/Error Snackbar */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={snackbar.severity}
              sx={{ width: "100%" }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Container>
      </div>
    </div>
  );
};

export default VolunteerRegistration;
