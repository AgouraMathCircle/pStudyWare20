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
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  FormLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import studentService from "../services/studentService";
import "../styles/StudentRegistration.css";
// Import images from src/assets
import pageHeaderImg from "../assets/images/about/page-header.jpg";
import arrow1Img from "../assets/images/arrow-1.png";
import arrow2Img from "../assets/images/arrow-2.png";
import arrow3Img from "../assets/images/arrow-3.png";

const StudentRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Parent Information
    parentFirstName: "",
    parentLastName: "",
    parentEmail: "",
    parentPhone: "",
    city: "",
    state: "",
    country: "US",

    // Student Information
    studentFirstName: "",
    studentLastName: "",
    studentEmail: "",
    school: "",
    grade: "0",
    session: "0",
    location: "0",

    // User Name Selection
    userNameType: "P", // P for Parent, S for Student

    // Signatures
    waiverSignature: "",
    ruleSignature: "",
    picturePermission: true,

    // Validation
    validEmailAddress: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [locations, setLocations] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [grades, setGrades] = useState([]);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    // Load all data from services
    loadFormData();
  }, []);

  const loadFormData = async () => {
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
      console.error("Error loading form data:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Parent Information Validation
    if (!formData.parentFirstName.trim()) {
      newErrors.parentFirstName = "Please enter your First name.";
    }
    if (!formData.parentLastName.trim()) {
      newErrors.parentLastName = "Please enter your Last name.";
    }
    if (!formData.parentEmail.trim()) {
      newErrors.parentEmail = "Please enter your Email Address.";
    } else if (
      !/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(
        formData.parentEmail
      )
    ) {
      newErrors.parentEmail = "Please enter a valid Parent Email ID.";
    }
    if (!formData.parentPhone.trim()) {
      newErrors.parentPhone = "Please enter your Phone Number.";
    } else if (
      !/^[01]?[- .]?(\([2-9]\d{2}\)|[2-9]\d{2})[- .]?\d{3}[- .]?\d{4}$/.test(
        formData.parentPhone
      )
    ) {
      newErrors.parentPhone = "Please enter a valid Phone No.";
    }
    if (!formData.city.trim()) {
      newErrors.city = "Please enter City Name.";
    }
    if (!formData.state.trim()) {
      newErrors.state = "Please enter State Name.";
    }

    // Student Information Validation
    if (!formData.studentFirstName.trim()) {
      newErrors.studentFirstName = "Please enter Student First name.";
    }
    if (!formData.studentLastName.trim()) {
      newErrors.studentLastName = "Please enter Student Last name.";
    }
    if (!formData.school.trim()) {
      newErrors.school = "Please enter Student School Name.";
    }
    if (formData.grade === "0") {
      newErrors.grade = "Please select Grade.";
    }
    if (formData.session === "0") {
      newErrors.session = "Please select Session.";
    }
    if (formData.location === "0") {
      newErrors.location = "Please select Course/Location.";
    }

    // Student Email Validation
    if (formData.userNameType === "S" && !formData.studentEmail.trim()) {
      newErrors.studentEmail = "Please enter student email";
    } else if (
      formData.studentEmail.trim() &&
      !/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(
        formData.studentEmail
      )
    ) {
      newErrors.studentEmail = "Please enter a valid Student Email ID.";
    }

    // Signature Validation
    if (!formData.waiverSignature.trim()) {
      newErrors.waiverSignature = "Please sign the waiver";
    }
    if (!formData.ruleSignature.trim()) {
      newErrors.ruleSignature = "Please Sign.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setSubmitError("");

    try {
      const response = await studentService.registerStudent(formData);
      setIsSubmitted(true);
    } catch (error) {
      setSubmitError(error.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="student-registration">
        <Container maxWidth="lg">
          {/* Breadcrumbs */}
          <Box sx={{ mb: 3 }}>
            <Breadcrumbs aria-label="breadcrumb">
              <Link color="inherit" href="/" underline="hover">
                Home
              </Link>
              <Link color="inherit" href="/registration" underline="hover">
                Registration
              </Link>
              <Typography color="text.primary">Student Registration</Typography>
            </Breadcrumbs>
          </Box>

          <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              color="primary"
            >
              Registration Successful!
            </Typography>
            <Typography variant="h6" gutterBottom>
              {formData.studentFirstName} {formData.studentLastName}'s
              application has successfully been submitted.
            </Typography>
            <Typography variant="body1" color="text.secondary">
              We will review it and update your enrollment status by email.
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                onClick={() => navigate("/")}
                sx={{ mr: 2 }}
              >
                Go Home
              </Button>
              <Button
                variant="outlined"
                onClick={() => window.location.reload()}
              >
                Register Another Student
              </Button>
            </Box>
          </Paper>
        </Container>
      </div>
    );
  }

  return (
    <div className="student-registration">
      <Container maxWidth="lg">
        {/* Breadcrumbs */}
        <Box sx={{ mb: 3 }}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" href="/" underline="hover">
              Home
            </Link>
            <Link color="inherit" href="/registration" underline="hover">
              Registration
            </Link>
            <Typography color="text.primary">Student Registration</Typography>
          </Breadcrumbs>
        </Box>

        {/* Page Header */}
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography variant="h2" component="h1" gutterBottom>
            STUDENT REGISTRATION
          </Typography>
          <Typography variant="h5" color="text.secondary">
            Register for New Student
          </Typography>
        </Box>

        {/* Important Notice */}
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Important Notice
          </Typography>
          <Typography variant="body1" paragraph>
            Registration for the Fall 2024 Semester is now closed due to full
            capacity. Unfortunately, no more spots are available. We invite you
            to register for our upcoming Spring 2025 Semester. Thank you for
            your interest in Agoura Math Circle!
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>
              Existing students, please do not use this page to register for
              ONLINE or ONSITE Math Circle classes. Instead, follow the separate
              registration instructions provided for returning students. This
              page is for new students only.
            </strong>
          </Typography>
        </Alert>

        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Register Now
          </Typography>
          <Typography variant="body1">
            Use this page to register for any type of program (
            <Link href="/test-preparation" target="_blank" color="primary">
              Test Preparation- SAT/PSAT and ACT
            </Link>{" "}
            and
            <Link href="/engineering-circle" target="_blank" color="primary">
              Engineering circle - Data Science, Game Development and Artificial
              Intelligence
            </Link>
            ), with the exception of existing students registering for a new
            semester at math circle. Please carefully choose the course and
            location. After you submit your application, we will review and
            decide based on the availability of space and eligibility.
          </Typography>
        </Alert>

        <Alert severity="error" sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Engineering Circle
          </Typography>
          <Typography variant="body1">
            Before you apply for Agoura Engineering Circle, please review the
            <Link href="/test-preparation" target="_blank" color="primary">
              {" "}
              curriculum
            </Link>
            and the criteria for eligibility and make an informed decision to
            see if this is the right class for you. Due to the limited available
            space and the challenging material, we will conduct an assessment.
            We will email details regarding this assessment. Based on the
            eligibility and performance of the student on the exam, we will
            decide on the student's enrollment.
          </Typography>
        </Alert>

        {/* Error Alert */}
        {submitError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {submitError}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            {/* Parent Information */}
            <Grid item xs={12} md={6}>
              <Card elevation={2}>
                <CardContent>
                  <Typography
                    variant="h5"
                    component="h2"
                    gutterBottom
                    color="primary"
                  >
                    Parent Information
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="First Name"
                        name="parentFirstName"
                        value={formData.parentFirstName}
                        onChange={handleInputChange}
                        error={!!errors.parentFirstName}
                        helperText={errors.parentFirstName}
                        margin="normal"
                        required
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        name="parentLastName"
                        value={formData.parentLastName}
                        onChange={handleInputChange}
                        error={!!errors.parentLastName}
                        helperText={errors.parentLastName}
                        margin="normal"
                        required
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email ID"
                        name="parentEmail"
                        type="email"
                        value={formData.parentEmail}
                        onChange={handleInputChange}
                        error={!!errors.parentEmail}
                        helperText={errors.parentEmail}
                        margin="normal"
                        required
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phone (999-999-9999)"
                        name="parentPhone"
                        value={formData.parentPhone}
                        onChange={handleInputChange}
                        error={!!errors.parentPhone}
                        helperText={errors.parentPhone}
                        margin="normal"
                        required
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="City"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        error={!!errors.city}
                        helperText={errors.city}
                        margin="normal"
                        required
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="State"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        error={!!errors.state}
                        helperText={errors.state}
                        margin="normal"
                        required
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <FormControl fullWidth margin="normal">
                        <InputLabel>Country</InputLabel>
                        <Select
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          label="Country"
                        >
                          {countries.map((country) => (
                            <MenuItem key={country.value} value={country.value}>
                              {country.text}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <FormControl component="fieldset" margin="normal">
                        <FormLabel component="legend">User Name</FormLabel>
                        <RadioGroup
                          name="userNameType"
                          value={formData.userNameType}
                          onChange={handleInputChange}
                        >
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
                      </FormControl>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Student Information */}
            <Grid item xs={12} md={6}>
              <Card elevation={2}>
                <CardContent>
                  <Typography
                    variant="h5"
                    component="h2"
                    gutterBottom
                    color="primary"
                  >
                    Student Information
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Student First Name"
                        name="studentFirstName"
                        value={formData.studentFirstName}
                        onChange={handleInputChange}
                        error={!!errors.studentFirstName}
                        helperText={errors.studentFirstName}
                        margin="normal"
                        required
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Student Last Name"
                        name="studentLastName"
                        value={formData.studentLastName}
                        onChange={handleInputChange}
                        error={!!errors.studentLastName}
                        helperText={errors.studentLastName}
                        margin="normal"
                        required
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Student Email ID"
                        name="studentEmail"
                        type="email"
                        value={formData.studentEmail}
                        onChange={handleInputChange}
                        error={!!errors.studentEmail}
                        helperText={errors.studentEmail}
                        margin="normal"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="School"
                        name="school"
                        value={formData.school}
                        onChange={handleInputChange}
                        error={!!errors.school}
                        helperText={errors.school}
                        margin="normal"
                        required
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl
                        fullWidth
                        margin="normal"
                        error={!!errors.grade}
                      >
                        <InputLabel>Grade</InputLabel>
                        <Select
                          name="grade"
                          value={formData.grade}
                          onChange={handleInputChange}
                          label="Grade"
                        >
                          {grades.map((grade) => (
                            <MenuItem key={grade.value} value={grade.value}>
                              {grade.text}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.grade && (
                          <FormHelperText>{errors.grade}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl
                        fullWidth
                        margin="normal"
                        error={!!errors.session}
                      >
                        <InputLabel>Register For</InputLabel>
                        <Select
                          name="session"
                          value={formData.session}
                          onChange={handleInputChange}
                          label="Register For"
                        >
                          {sessions.map((session) => (
                            <MenuItem key={session.value} value={session.value}>
                              {session.text}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.session && (
                          <FormHelperText>{errors.session}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <FormControl
                        fullWidth
                        margin="normal"
                        error={!!errors.location}
                      >
                        <InputLabel>Course/Location</InputLabel>
                        <Select
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          label="Course/Location"
                        >
                          {locations.map((location) => (
                            <MenuItem
                              key={location.value}
                              value={location.value}
                            >
                              {location.text}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.location && (
                          <FormHelperText>{errors.location}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Terms and Signatures */}
          <Card elevation={2} sx={{ mt: 4 }}>
            <CardContent>
              <Typography
                variant="h5"
                component="h2"
                gutterBottom
                color="primary"
              >
                Terms and Signatures
              </Typography>

              <Typography variant="body1" paragraph>
                Pressing the "Submit" button I agree the Agoura Math Circle
                <Button
                  variant="text"
                  color="primary"
                  onClick={() => window.open("#terms-modal", "_blank")}
                  sx={{ mx: 1 }}
                >
                  Terms
                </Button>{" "}
                and
                <Button
                  variant="text"
                  color="primary"
                  onClick={() => window.open("#rules-modal", "_blank")}
                  sx={{ mx: 1 }}
                >
                  Rules
                </Button>
              </Typography>

              <TextField
                fullWidth
                label="Waiver Signature (Liability Signature)*"
                name="waiverSignature"
                value={formData.waiverSignature}
                onChange={handleInputChange}
                error={!!errors.waiverSignature}
                helperText={
                  errors.waiverSignature ||
                  "DO NOT SIGN WITHOUT READING. I HAVE READ THIS ASSUMPTION OF RISK, WAIVER OF LIABILITY AND INDEMNITY AGREEMENT AND AGREE TO ITS TERMS."
                }
                margin="normal"
                required
              />

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                By printing your name in the box and pressing the submit button,
                I acknowledge that I have read and am electronically signing the
                Waiver of Liability, Assumption of Risk and Indemnity Agreement
                on behalf of myself or my dependent minor participant.
              </Typography>

              <TextField
                fullWidth
                label="Rules Signature*"
                name="ruleSignature"
                value={formData.ruleSignature}
                onChange={handleInputChange}
                error={!!errors.ruleSignature}
                helperText={
                  errors.ruleSignature ||
                  "By printing your name in the box and pressing the submit button, I acknowledge that I have read and am electronically signing the Agoura Math Circle Rules and Expectations on behalf of myself or my dependent minor participant."
                }
                margin="normal"
                required
              />

              <FormControlLabel
                control={
                  <Checkbox
                    name="picturePermission"
                    checked={formData.picturePermission}
                    onChange={handleInputChange}
                  />
                }
                label="I give permission to use the pictures/videos"
                sx={{ mt: 2 }}
              />

              <Typography variant="body2" color="text.secondary">
                Occasionally, we take pictures at AMC meetings, which may be
                used for publicity purposes [e.g.: posted on our web site or
                used in a brochure about AMC.] Do you give us permission to
                include you in such photographs?
              </Typography>

              <Box sx={{ mt: 3, textAlign: "center" }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  sx={{ minWidth: 200 }}
                >
                  {isLoading ? "Submitting..." : "Submit Registration"}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </form>

        {/* Related Links */}
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="h6" gutterBottom>
            Related Links
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="outlined"
              onClick={() => navigate("/volunteerregistration")}
            >
              Volunteer Registration
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate("/test-preparation")}
            >
              Test Preparation
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate("/engineering-circle")}
            >
              Engineering Circle
            </Button>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default StudentRegistration;
