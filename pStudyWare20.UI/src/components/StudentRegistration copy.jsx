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
  FormControlLabel,
  RadioGroup,
  Radio,
  Checkbox,
  Divider,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// Import images from src/assets
import pageHeaderImg from "../assets/images/about/page-header.jpg";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import studentService from "../services/studentService";
import "../styles/StudentRegistration.css";

// Validation schema
const validationSchema = yup.object({
  parentFirstName: yup
    .string()
    .required("Parent first name is required")
    .min(2, "Parent first name must be at least 2 characters")
    .max(50, "Parent first name must be less than 50 characters"),
  parentLastName: yup
    .string()
    .required("Parent last name is required")
    .min(2, "Parent last name must be at least 2 characters")
    .max(50, "Parent last name must be less than 50 characters"),
  parentEmail: yup
    .string()
    .required("Parent email is required")
    .email("Please enter a valid parent email address"),
  parentPhoneNo: yup
    .string()
    .required("Parent phone number is required")
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
  studentFirstName: yup
    .string()
    .required("Student first name is required")
    .min(2, "Student first name must be at least 2 characters")
    .max(50, "Student first name must be less than 50 characters"),
  studentLastName: yup
    .string()
    .required("Student last name is required")
    .min(2, "Student last name must be at least 2 characters")
    .max(50, "Student last name must be less than 50 characters"),
  studentEmail: yup.string().when("userName", {
    is: "S",
    then: (schema) =>
      schema
        .required(
          "Student email is required when using student email as username"
        )
        .email("Please enter a valid student email address"),
    otherwise: (schema) =>
      schema.email("Please enter a valid student email address"),
  }),
  studentSchoolName: yup
    .string()
    .required("Student school name is required")
    .min(2, "Student school name must be at least 2 characters"),
  studentGrade: yup
    .string()
    .required("Student grade is required")
    .notOneOf(["0"], "Please select a grade"),
  sessionId: yup
    .string()
    .required("Session is required")
    .notOneOf(["0"], "Please select a session"),
  locationId: yup
    .number()
    .required("Course/Location is required")
    .min(1, "Please select a course/location"),
  userName: yup.string().required("Please select username option"),
  liabilitySignature: yup
    .string()
    .required("Liability signature is required")
    .min(2, "Please enter your full name"),
  ruleSignature: yup
    .string()
    .required("Rule signature is required")
    .min(2, "Please enter your full name"),
  picturePermission: yup.boolean(),
});

const StudentRegistration = () => {
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
  const [countries, setCountries] = useState([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      parentFirstName: "",
      parentLastName: "",
      parentEmail: "",
      parentPhoneNo: "",
      city: "",
      state: "",
      country: "",
      studentFirstName: "",
      studentLastName: "",
      studentEmail: "",
      studentSchoolName: "",
      studentGrade: "0",
      sessionId: "0",
      locationId: 0,
      userName: "P",
      liabilitySignature: "",
      ruleSignature: "",
      picturePermission: true,
    },
  });

  const userNameOption = watch("userName");

  // Load dropdown data
  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        const [locationsData, sessionsData, gradesData, countriesData] =
          await Promise.all([
            studentService.getLocations(),
            studentService.getSessions(),
            studentService.getGrades(),
            studentService.getCountries(),
          ]);

        setLocations(locationsData);
        setSessions(sessionsData);
        setGrades(gradesData);
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
      // Prepare the data for API submission - matching the DTO structure exactly
      const studentData = {
        ParentFirstName: data.parentFirstName,
        ParentLastName: data.parentLastName,
        ParentEmail: data.parentEmail,
        ParentPhoneNo: data.parentPhoneNo,
        City: data.city,
        State: data.state,
        Country: data.country,
        StudentFirstName: data.studentFirstName,
        StudentLastName: data.studentLastName,
        StudentEmail: data.studentEmail || "",
        StudentSchoolName: data.studentSchoolName,
        StudentGrade: data.studentGrade,
        SessionId: data.sessionId,
        LocationId: data.locationId,
        UserName: data.userName,
        LiabilitySignature: data.liabilitySignature,
        RuleSignature: data.ruleSignature,
        PicturePermission: data.picturePermission,
        Address: "", // Add if needed
      };

      console.log("Prepared student data for API:", studentData);

      const response = await studentService.registerStudent(studentData);

      console.log("API Response:", response);

      // Check if the response indicates success
      if (response && response.isSuccess !== false) {
        showSnackbar(
          "Student registration submitted successfully! We will review it and update your enrollment status by email.",
          "success"
        );

        // Reset form after successful submission
        reset();

        // Optionally redirect after a delay
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else {
        showSnackbar(
          response?.ErrorMessage || "Registration failed. Please try again.",
          "error"
        );
      }
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
    <div className="student-registration-container">
      {/* Breadcrumbs */}
      <div
        className="sc-breadcrumbs breadcrumbs-overlay"
        style={{ "--page-header-bg": `url(${pageHeaderImg})` }}
      >
        <div className="breadcrumbs-img">
          <img src={pageHeaderImg} alt="Breadcrumbs Image" />
        </div>
        <div className="breadcrumbs-text white-color">
          <h1 className="page-title">STUDENT REGISTRATION</h1>
          <ul>
            <li>
              <RouterLink to="/" className="active">
                Home &gt;
              </RouterLink>
            </li>
            <li className="active">Registration &gt;</li>
            <li className="active">Student Registration</li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <Container maxWidth="lg" sx={{ py: 4, maxWidth: "90%", px: "10px" }}>
          {/* Header */}
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              color: "#174a10",
              fontWeight: "bold",
              textAlign: "center",
              mb: 0.25,
              mt: -3.75,
            }}
          >
            Register for New Student
          </Typography>

          {/* Important Notice */}
          <Paper elevation={2} sx={{ p: 3, mb: 4, backgroundColor: "#fff3cd" }}>
            <Typography variant="h6" color="error" gutterBottom>
              <strong>Important:</strong>
            </Typography>
            <Typography variant="body2" paragraph>
              Registration for the Fall 2025 Semester is now closed due to full
              capacity. Unfortunately, no more spots are available. We invite
              you to register for our upcoming Spring 2026 Semester. Thank you
              for your interest in Agoura Math Circle!
            </Typography>
            <Typography variant="body2" paragraph color="error">
              <strong>
                Existing students, please do not use this page to register for
                ONLINE or ONSITE Math Circle classes. Instead, follow the
                separate registration instructions provided for returning
                students. This page is for new students only.
              </strong>
            </Typography>
            <Typography variant="body2" paragraph color="success.main">
              <strong>Register Now:</strong> Use this page to register for any
              type of program (Test Preparation- SAT/PSAT and ACT and
              Engineering circle - Data Science, Game Development and Artificial
              Intelligence), with the exception of existing students registering
              for a new semester at math circle. Please carefully choose the
              course and location.
            </Typography>
          </Paper>

          {/* Main Form - Vertical Layout */}
          <Paper elevation={6} sx={{ p: 8 }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={8}>
                {/* Parent Information Section - Full Width */}
                <Grid item xs={12}>
                  <Card sx={{ p: 2 }}>
                    <CardContent sx={{ p: 0 }}>
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
                        Parent{" "}
                        <span style={{ color: "#1976d2" }}>Information</span>
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        <Controller
                          name="parentFirstName"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="First Name *"
                              error={!!errors.parentFirstName}
                              helperText={errors.parentFirstName?.message}
                              variant="outlined"
                            />
                          )}
                        />

                        <Controller
                          name="parentLastName"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Last Name *"
                              error={!!errors.parentLastName}
                              helperText={errors.parentLastName?.message}
                              variant="outlined"
                            />
                          )}
                        />

                        <Controller
                          name="parentEmail"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Email ID *"
                              type="email"
                              error={!!errors.parentEmail}
                              helperText={errors.parentEmail?.message}
                              variant="outlined"
                            />
                          )}
                        />

                        <Controller
                          name="parentPhoneNo"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Phone (999-999-9999) *"
                              placeholder="999-999-9999"
                              error={!!errors.parentPhoneNo}
                              helperText={errors.parentPhoneNo?.message}
                              variant="outlined"
                            />
                          )}
                        />

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

                        <Controller
                          name="userName"
                          control={control}
                          render={({ field }) => (
                            <FormControl
                              component="fieldset"
                              error={!!errors.userName}
                            >
                              <Typography variant="subtitle2" gutterBottom>
                                User Name *
                              </Typography>
                              <RadioGroup {...field} row>
                                <FormControlLabel
                                  value="P"
                                  control={<Radio />}
                                  label="Parent Email as User Name"
                                />
                                <FormControlLabel
                                  value="S"
                                  control={<Radio />}
                                  label="Student Email as User Name"
                                />
                              </RadioGroup>
                              {errors.userName && (
                                <FormHelperText>
                                  {errors.userName.message}
                                </FormHelperText>
                              )}
                            </FormControl>
                          )}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <Card sx={{ p: 2 }}>
                    <CardContent sx={{ p: 0 }}>
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
                        Parent{" "}
                        <span style={{ color: "#1976d2" }}>Information</span>
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        <Controller
                          name="parentFirstName"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="First Name *"
                              error={!!errors.parentFirstName}
                              helperText={errors.parentFirstName?.message}
                              variant="outlined"
                            />
                          )}
                        />

                        <Controller
                          name="parentLastName"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Last Name *"
                              error={!!errors.parentLastName}
                              helperText={errors.parentLastName?.message}
                              variant="outlined"
                            />
                          )}
                        />

                        <Controller
                          name="parentEmail"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Email ID *"
                              type="email"
                              error={!!errors.parentEmail}
                              helperText={errors.parentEmail?.message}
                              variant="outlined"
                            />
                          )}
                        />

                        <Controller
                          name="parentPhoneNo"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Phone (999-999-9999) *"
                              placeholder="999-999-9999"
                              error={!!errors.parentPhoneNo}
                              helperText={errors.parentPhoneNo?.message}
                              variant="outlined"
                            />
                          )}
                        />

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

                        <Controller
                          name="userName"
                          control={control}
                          render={({ field }) => (
                            <FormControl
                              component="fieldset"
                              error={!!errors.userName}
                            >
                              <Typography variant="subtitle2" gutterBottom>
                                User Name *
                              </Typography>
                              <RadioGroup {...field} row>
                                <FormControlLabel
                                  value="P"
                                  control={<Radio />}
                                  label="Parent Email as User Name"
                                />
                                <FormControlLabel
                                  value="S"
                                  control={<Radio />}
                                  label="Student Email as User Name"
                                />
                              </RadioGroup>
                              {errors.userName && (
                                <FormHelperText>
                                  {errors.userName.message}
                                </FormHelperText>
                              )}
                            </FormControl>
                          )}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                {/* Student Information Section - Full Width */}
                {/* <Grid item xs={6}>
                  <Card sx={{ p: 2 }}>
                    <CardContent sx={{ p: 0 }}>
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
                        Student{" "}
                        <span style={{ color: "#1976d2" }}>Information</span>
                      </Typography>



                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                          width: "100%",
                        }}
                      >
                        <Controller
                          name="studentFirstName"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              sx={{ width: "100%" }}
                              label="Student First Name *"
                              error={!!errors.studentFirstName}
                              helperText={errors.studentFirstName?.message}
                              variant="outlined"
                            />
                          )}
                        />

                        <Controller
                          name="studentLastName"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              sx={{ width: "100%" }}
                              label="Student Last Name *"
                              error={!!errors.studentLastName}
                              helperText={errors.studentLastName?.message}
                              variant="outlined"
                            />
                          )}
                        />

                        <Controller
                          name="studentEmail"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              sx={{ width: "100%" }}
                              label="Student Email ID"
                              type="email"
                              error={!!errors.studentEmail}
                              helperText={
                                errors.studentEmail?.message ||
                                (userNameOption === "S"
                                  ? "Required when using student email as username"
                                  : "Optional")
                              }
                              variant="outlined"
                              required={userNameOption === "S"}
                            />
                          )}
                        />

                        <Controller
                          name="studentSchoolName"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              sx={{ width: "100%" }}
                              label="School *"
                              error={!!errors.studentSchoolName}
                              helperText={errors.studentSchoolName?.message}
                              variant="outlined"
                            />
                          )}
                        />

                        <Controller
                          name="studentGrade"
                          control={control}
                          render={({ field }) => (
                            <FormControl
                              fullWidth
                              error={!!errors.studentGrade}
                            >
                              <InputLabel>Grade *</InputLabel>
                              <Select {...field} label="Grade *">
                                <MenuItem value="0">
                                  <em>--Select--</em>
                                </MenuItem>
                                {grades.map((grade) => (
                                  <MenuItem
                                    key={grade.value}
                                    value={grade.value}
                                  >
                                    {grade.label}
                                  </MenuItem>
                                ))}
                              </Select>
                              {errors.studentGrade && (
                                <FormHelperText>
                                  {errors.studentGrade.message}
                                </FormHelperText>
                              )}
                            </FormControl>
                          )}
                        />

                        <Controller
                          name="sessionId"
                          control={control}
                          render={({ field }) => (
                            <FormControl fullWidth error={!!errors.sessionId}>
                              <InputLabel>Register For *</InputLabel>
                              <Select {...field} label="Register For *">
                                <MenuItem value="0">
                                  <em>--Select--</em>
                                </MenuItem>
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
                            <FormControl fullWidth error={!!errors.locationId}>
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
                      </Box>
                    </CardContent>
                  </Card>
                </Grid> */}

                {/* Signatures and Agreements Section - Full Width */}
                <Grid item xs={12}>
                  <Card sx={{ p: 2, mt: 2 }}>
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
                        Agreements &{" "}
                        <span style={{ color: "#1976d2" }}>Signatures</span>
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 3,
                        }}
                      >
                        <Typography variant="body2" paragraph>
                          Pressing the "Submit" button I agree the Agoura Math
                          Circle{" "}
                          <Link href="#" color="primary">
                            Terms
                          </Link>{" "}
                          and{" "}
                          <Link href="#" color="primary">
                            Rules
                          </Link>
                        </Typography>

                        <Controller
                          name="liabilitySignature"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Liability Signature *"
                              error={!!errors.liabilitySignature}
                              helperText={errors.liabilitySignature?.message}
                              variant="outlined"
                              placeholder="Enter your full name"
                            />
                          )}
                        />
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ mt: 1, display: "block" }}
                        >
                          DO NOT SIGN WITHOUT READING. I HAVE READ THIS
                          ASSUMPTION OF RISK, WAIVER OF LIABILITY AND INDEMNITY
                          AGREEMENT AND AGREE TO ITS TERMS.
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ mt: 1, display: "block" }}
                        >
                          By printing your name in the box and pressing the
                          submit button, I acknowledge that I have read and am
                          electronically signing the Waiver of Liability,
                          Assumption of Risk and Indemnity Agreement on behalf
                          of myself or my dependent minor participant.
                        </Typography>

                        <Controller
                          name="ruleSignature"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Rule Signature *"
                              error={!!errors.ruleSignature}
                              helperText={errors.ruleSignature?.message}
                              variant="outlined"
                              placeholder="Enter your full name"
                            />
                          )}
                        />
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ mt: 1, display: "block" }}
                        >
                          By printing your name in the box and pressing the
                          submit button, I acknowledge that I have read and am
                          electronically signing the Agoura Math Circle Rules
                          and Expectations on behalf of myself or my dependent
                          minor participant.
                        </Typography>

                        <Controller
                          name="picturePermission"
                          control={control}
                          render={({ field }) => (
                            <FormControlLabel
                              control={
                                <Checkbox
                                  {...field}
                                  checked={field.value}
                                  color="primary"
                                />
                              }
                              label={
                                <Typography variant="body2">
                                  I give permission to use the pictures/videos.
                                  Occasionally, we take pictures at AMC
                                  meetings, which may be used for publicity
                                  purposes [e.g.: posted on our web site or used
                                  in a brochure about AMC.]
                                </Typography>
                              }
                            />
                          )}
                        />
                      </Box>
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

export default StudentRegistration;
