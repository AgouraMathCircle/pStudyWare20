import React, { useState, useEffect } from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  FormControlLabel,
  RadioGroup,
  Radio,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// Import images from src/assets
import pageHeaderImg from "../assets/images/about/page-header.jpg";
import studentService from "../services/studentService";
import "../styles/StudentRegistration.css";

const SELECT_ITEM_HEIGHT = 36;
const SELECT_MENU_PADDING = 8;

const createSelectMenuProps = (visibleItems) => ({
  anchorOrigin: { vertical: "bottom", horizontal: "left" },
  transformOrigin: { vertical: "top", horizontal: "left" },
  PaperProps: {
    sx: {
      maxHeight: SELECT_ITEM_HEIGHT * visibleItems + SELECT_MENU_PADDING,
      overflowY: "auto",
    },
  },
  MenuListProps: {
    sx: {
      py: 0,
      "& .MuiMenuItem-root": {
        minHeight: SELECT_ITEM_HEIGHT,
      },
    },
  },
});

const registrationSelectMenuProps = createSelectMenuProps(15);
const countrySelectMenuProps = createSelectMenuProps(10);

const isEmptySelectValue = (value) =>
  value === undefined ||
  value === null ||
  value === "" ||
  value === "0" ||
  value === 0;

const currentYear = new Date().getFullYear();

const requiredSelect = (requiredMessage, emptyMessage) =>
  yup
    .mixed()
    .required(requiredMessage)
    .test("selected", emptyMessage, (value) => !isEmptySelectValue(value));

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
        .trim()
        .required(
          "Student email is required when using student email as username",
        )
        .email("Please enter a valid student email address"),
    otherwise: (schema) =>
      schema
        .transform((value) =>
          value?.trim() === "" ? undefined : value?.trim(),
        )
        .optional()
        .email("Please enter a valid student email address"),
  }),
  studentSchoolName: yup
    .string()
    .required("Student school name is required")
    .min(2, "Student school name must be at least 2 characters"),
  studentGrade: requiredSelect(
    "Student grade is required",
    "Please select a grade",
  ),
  sessionId: requiredSelect("Session is required", "Please select a session"),
  locationId: requiredSelect(
    "Course/Location is required",
    "Please select a course/location",
  ),
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

const defaultFormValues = {
  parentFirstName: "",
  parentLastName: "",
  parentEmail: "",
  parentPhoneNo: "",
  city: "",
  state: "",
  country: "US",
  studentFirstName: "",
  studentLastName: "",
  studentEmail: "",
  studentSchoolName: "",
  studentGrade: "0",
  sessionId: "0",
  locationId: "0",
  userName: "P",
  liabilitySignature: "",
  ruleSignature: "",
  picturePermission: true,
};

const StudentRegistration = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [locations, setLocations] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [grades, setGrades] = useState([]);
  const [countries, setCountries] = useState([]);
  const [submitButtonHover, setSubmitButtonHover] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    watch,
    clearErrors,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: defaultFormValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldFocusError: true,
  });

  const userNameOption = watch("userName");

  // Auto-dismiss snackbar after 5 seconds
  useEffect(() => {
    if (snackbar.open) {
      const timer = setTimeout(() => {
        setSnackbar((prev) => ({ ...prev, open: false }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [snackbar.open]);

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
        LocationId: Number(data.locationId),
        UserName: data.userName,
        LiabilitySignature: data.liabilitySignature,
        RuleSignature: data.ruleSignature,
        PicturePermission: data.picturePermission,
      };

      console.log("Prepared student data for API:", studentData);

      const response = await studentService.registerStudent(studentData);

      console.log("API Response:", response);

      if (response && response.isSuccess !== false) {
        setSuccessDialogOpen(true);
      } else {
        showSnackbar(
          response?.ErrorMessage || "Registration failed. Please try again.",
          "error",
        );
      }
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

  const handleRegisterAnother = () => {
    const parentData = {
      parentFirstName: getValues("parentFirstName"),
      parentLastName: getValues("parentLastName"),
      parentEmail: getValues("parentEmail"),
      parentPhoneNo: getValues("parentPhoneNo"),
      city: getValues("city"),
      state: getValues("state"),
      country: getValues("country"),
      userName: getValues("userName"),
    };
    clearErrors();
    reset(
      { ...defaultFormValues, ...parentData },
      {
        keepErrors: false,
        keepDirty: false,
        keepTouched: false,
        keepIsSubmitted: false,
      },
    );
    setSuccessDialogOpen(false);
  };

  const onInvalid = () => {
    showSnackbar(
      "Please fill in all required fields before submitting.",
      "error",
    );
  };

  const handleSuccessDialogClose = () => {
    setSuccessDialogOpen(false);
    navigate("/");
  };

  return (
    <div className="student-registration-container">
      {/* Breadcrumbs Section */}
      <div className="sc-breadcrumbs breadcrumbs-overlay">
        <div className="breadcrumbs-img">
          <img src={pageHeaderImg} alt="Breadcrumbs Image" />
        </div>
        <div className="breadcrumbs-text white-color">
          <h1 className="page-title">STUDENT REGISTRATION</h1>
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
            <li className="active">Student Registration</li>
          </ul>
        </div>
      </div>

      {/* Main Content Section */}
      <div
        className="sc-about"
        style={{ paddingTop: "20px", paddingBottom: "35px" }}
      >
        <div className="container">
          {/* Header */}
          <div
            className="sec-title text-center"
            style={{ marginBottom: "2px" }}
          >
            <h3
              className="title"
              style={{ fontSize: "1.75rem", marginBottom: "6px" }}
            >
              Register for New Student
            </h3>
          </div>

          {/* Important Notice */}
          <div className="row registration-notice-row">
            <div className="important-notice">
              <p>
                <span style={{ color: "#d32f2f", fontWeight: "bold" }}>
                  Important:
                </span>{" "}
                Registration for the Spring 2026 Semester is closed now. We
                invite you to register for our upcoming Fall 2026 Semester.
                Thank you for your interest in Agoura Math Circle!{" "}
                <span style={{ color: "#d32f2f", fontWeight: "bold" }}>
                  Existing students, please do not use this page to register for
                  ONLINE or ONSITE Math Circle classes. Instead, follow the
                  separate registration instructions provided for returning
                  students. This page is for new students only. .
                </span>
              </p>
              <p>
                <span
                  style={{
                    color: "#2e7d32",
                    fontWeight: "bold",
                    fontStyle: "italic",
                  }}
                >
                  Register Now.
                </span>{" "}
                Use this page to register for any course/program (
                <span style={{ color: "#1976d2", fontStyle: "italic" }}>
                  Test Preparation
                </span>{" "}
                - SAT/PSAT and ACT,{" "}
                <span style={{ color: "#1976d2", fontStyle: "italic" }}>
                  Engineering circle
                </span>{" "}
                - Foundations of Data Science, Introduction to AI, and
                Engineering Design & 3D Modeling), with the exception of
                existing students registering for a new semester at math circle.
                Please carefully choose the course and location. After you
                submit your application, we will review and decide based on the
                availability of space and eligibility.
              </p>
              <p className="notice-engineering-text">
                Engineering Circle:Before you apply for Agoura Engineering
                Circle, please review the curriculum and the criteria for
                eligibility and make an informed decision to see if this is the
                right class for you. Due to the limited available space and the
                challenging material, we will conduct an assessment. We will
                email details regarding this assessment. Based on the
                eligibility and performance of the student on the exam, we will
                decide on the student's enrollment.
              </p>
            </div>
          </div>

          {/* Main Form */}
          <div className="row">
            <form
              noValidate
              onSubmit={handleSubmit(onSubmit, onInvalid)}
              style={{ width: "100%" }}
            >
              <div className="registration-form-layout">
                {/* Parent Information Section */}
                <div className="registration-parent-column">
                  <div
                    className="form-section parent-info-section registration-card"
                    style={{
                      padding: "20px 20px 4px",
                      marginBottom: "0",
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
                      Parent{" "}
                      <span style={{ color: "#1976d2" }}>Information</span>
                    </h4>
                    <div className="form-group-container parent-form-fields">
                      <Controller
                        name="parentFirstName"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            required
                            label="First Name"
                            error={!!errors.parentFirstName}
                            helperText={errors.parentFirstName?.message}
                            variant="outlined"
                            size="small"
                            className="form-input-field"
                            sx={{ width: "100%" }}
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
                            required
                            label="Last Name"
                            error={!!errors.parentLastName}
                            helperText={errors.parentLastName?.message}
                            variant="outlined"
                            size="small"
                            sx={{ width: "100%" }}
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
                            required
                            label="Email ID"
                            type="email"
                            error={!!errors.parentEmail}
                            helperText={errors.parentEmail?.message}
                            variant="outlined"
                            size="small"
                            sx={{ width: "100%" }}
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
                            required
                            label="Phone (999-999-9999)"
                            placeholder="999-999-9999"
                            error={!!errors.parentPhoneNo}
                            helperText={errors.parentPhoneNo?.message}
                            variant="outlined"
                            size="small"
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
                            fullWidth
                            required
                            label="City"
                            error={!!errors.city}
                            helperText={errors.city?.message}
                            variant="outlined"
                            size="small"
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
                            fullWidth
                            required
                            label="State"
                            error={!!errors.state}
                            helperText={errors.state?.message}
                            variant="outlined"
                            size="small"
                            sx={{ width: "100%" }}
                          />
                        )}
                      />

                      <Controller
                        name="country"
                        control={control}
                        render={({ field }) => (
                          <FormControl
                            fullWidth
                            required
                            variant="outlined"
                            size="small"
                            error={!!errors.country}
                            sx={{ width: "100%" }}
                          >
                            <InputLabel id="country-label">Country</InputLabel>
                            <Select
                              {...field}
                              labelId="country-label"
                              id="country-select"
                              label="Country"
                              MenuProps={countrySelectMenuProps}
                            >
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
                            className="user-name-control"
                            error={!!errors.userName}
                            sx={{
                              marginTop: 0,
                              marginBottom: 0,
                              width: "100%",
                            }}
                          >
                            <div className="user-name-row">
                              <span className="user-name-label">
                                User Name{" "}
                                <span className="required-asterisk">*</span>
                              </span>
                              <RadioGroup
                                {...field}
                                row
                                className="user-name-radio-group"
                                sx={{ flexWrap: "nowrap" }}
                              >
                                <FormControlLabel
                                  value="P"
                                  control={<Radio size="small" />}
                                  label="Parent Email as User Name"
                                />
                                <FormControlLabel
                                  value="S"
                                  control={<Radio size="small" />}
                                  label="Student Email as User Name"
                                />
                              </RadioGroup>
                            </div>
                            {errors.userName && (
                              <FormHelperText>
                                {errors.userName.message}
                              </FormHelperText>
                            )}
                          </FormControl>
                        )}
                      />
                    </div>
                  </div>
                </div>
                {/* Student Information Section */}
                <div className="registration-student-column">
                  <div
                    className="form-section student-info-section registration-card"
                    style={{
                      marginBottom: "0",
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
                      Student{" "}
                      <span style={{ color: "#1976d2" }}>Information</span>
                    </h4>
                    <div className="form-group-container student-form-fields">
                      <Controller
                        name="studentFirstName"
                        control={control}
                        render={({ field, fieldState }) => (
                          <TextField
                            {...field}
                            fullWidth
                            required
                            label="Student First Name"
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                            variant="outlined"
                            size="small"
                            className="form-input-field"
                            sx={{ width: "100%" }}
                          />
                        )}
                      />

                      <Controller
                        name="studentLastName"
                        control={control}
                        render={({ field, fieldState }) => (
                          <TextField
                            {...field}
                            fullWidth
                            required
                            label="Student Last Name"
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                            variant="outlined"
                            size="small"
                            sx={{ width: "100%" }}
                          />
                        )}
                      />

                      <Controller
                        name="studentEmail"
                        control={control}
                        render={({ field, fieldState }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label={
                              userNameOption === "S"
                                ? "Student Email ID"
                                : "Student Email ID (Optional)"
                            }
                            type="email"
                            error={!!fieldState.error}
                            helperText={
                              fieldState.error?.message ||
                              (userNameOption === "S"
                                ? "Required when using student email as username"
                                : "")
                            }
                            variant="outlined"
                            size="small"
                            required={userNameOption === "S"}
                            sx={{ width: "100%" }}
                          />
                        )}
                      />

                      <Controller
                        name="studentSchoolName"
                        control={control}
                        render={({ field, fieldState }) => (
                          <TextField
                            {...field}
                            fullWidth
                            required
                            label="School"
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                            variant="outlined"
                            size="small"
                            sx={{ width: "100%" }}
                          />
                        )}
                      />

                      <Controller
                        name="studentGrade"
                        control={control}
                        render={({ field, fieldState }) => (
                          <FormControl
                            fullWidth
                            required
                            variant="outlined"
                            size="small"
                            error={!!fieldState.error}
                            sx={{ width: "100%" }}
                          >
                            <InputLabel id="student-grade-label">
                              Grade
                            </InputLabel>
                            <Select
                              {...field}
                              labelId="student-grade-label"
                              id="student-grade-select"
                              label="Grade"
                              displayEmpty
                            >
                              <MenuItem value="0">
                                <em>--Select--</em>
                              </MenuItem>
                              {grades.map((grade) => (
                                <MenuItem key={grade.value} value={grade.value}>
                                  {grade.label}
                                </MenuItem>
                              ))}
                            </Select>
                            {fieldState.error && (
                              <FormHelperText>
                                {fieldState.error.message}
                              </FormHelperText>
                            )}
                          </FormControl>
                        )}
                      />

                      <Controller
                        name="sessionId"
                        control={control}
                        render={({ field, fieldState }) => (
                          <FormControl
                            fullWidth
                            required
                            variant="outlined"
                            size="small"
                            error={!!fieldState.error}
                            sx={{ width: "100%" }}
                          >
                            <InputLabel id="session-label">
                              Register For
                            </InputLabel>
                            <Select
                              {...field}
                              labelId="session-label"
                              id="session-select"
                              label="Register For"
                              displayEmpty
                            >
                              <MenuItem value="0">
                                <em>--Select--</em>
                              </MenuItem>
                              {sessions.map((session) => (
                                <MenuItem key={session.id} value={session.id}>
                                  {session.name}
                                </MenuItem>
                              ))}
                            </Select>
                            {fieldState.error && (
                              <FormHelperText>
                                {fieldState.error.message}
                              </FormHelperText>
                            )}
                          </FormControl>
                        )}
                      />

                      <Controller
                        name="locationId"
                        control={control}
                        render={({ field, fieldState }) => (
                          <FormControl
                            fullWidth
                            required
                            variant="outlined"
                            size="small"
                            error={!!fieldState.error}
                            sx={{ width: "100%" }}
                          >
                            <InputLabel id="location-label">
                              Course/Location
                            </InputLabel>
                            <Select
                              {...field}
                              labelId="location-label"
                              id="location-select"
                              label="Course/Location"
                              displayEmpty
                              MenuProps={registrationSelectMenuProps}
                            >
                              <MenuItem value="0">
                                <em>--Select--</em>
                              </MenuItem>
                              {locations.map((location) => (
                                <MenuItem
                                  key={location.id}
                                  value={String(location.id)}
                                >
                                  {location.name}
                                </MenuItem>
                              ))}
                            </Select>
                            {fieldState.error && (
                              <FormHelperText>
                                {fieldState.error.message}
                              </FormHelperText>
                            )}
                          </FormControl>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Signatures and Agreements Section */}
              <div className="registration-signature-column">
                <div
                  className="form-section signature-section registration-card"
                  style={{
                    marginTop: "0px",
                    marginBottom: "16px",
                  }}
                >
                  <div className="form-group-container signature-form-fields">
                    <p className="agreement-text">
                      Pressing the "Submit" button I agree the Agoura Math
                      Circle{" "}
                      <button
                        type="button"
                        onClick={() => setTermsOpen(true)}
                        style={{
                          backgroundColor: "#53b50a",
                          color: "#ffffff",
                          border: "none",
                          padding: "4px 12px",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "0.875rem",
                          fontWeight: "500",
                          margin: "0 2px",
                        }}
                      >
                        Terms
                      </button>{" "}
                      and{" "}
                      <button
                        type="button"
                        onClick={() => setRulesOpen(true)}
                        style={{
                          backgroundColor: "#53b50a",
                          color: "#ffffff",
                          border: "none",
                          padding: "4px 12px",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "0.875rem",
                          fontWeight: "500",
                          margin: "0 2px",
                        }}
                      >
                        Rules
                      </button>
                    </p>
                    <p className="signature-help-text">
                      Please sign the waiver (Liability Signature)
                      <span className="required-asterisk">*</span>. DO NOT SIGN
                      WITHOUT READING. I HAVE READ THIS ASSUMPTION OF RISK,
                      WAIVER OF LIABILITY AND INDEMNITY AGREEMENT AND AGREE TO
                      ITS TERMS.
                    </p>
                    <Controller
                      name="liabilitySignature"
                      control={control}
                      render={({ field, fieldState }) => (
                        <TextField
                          {...field}
                          fullWidth
                          required
                          label="Liability Signature"
                          error={!!fieldState.error}
                          helperText={fieldState.error?.message}
                          variant="outlined"
                          size="small"
                          className="form-input-field"
                          placeholder="Enter your full name"
                          sx={{ width: "100%" }}
                        />
                      )}
                    />
                    <p className="signature-help-text">
                      By printing your name in the box and pressing the submit
                      button, I acknowledge that I have read and am
                      electronically signing the Waiver of Liability, Assumption
                      of Risk and Indemnity Agreement on behalf of myself or my
                      dependent minor participant.
                    </p>

                    <Controller
                      name="ruleSignature"
                      control={control}
                      render={({ field, fieldState }) => (
                        <TextField
                          {...field}
                          fullWidth
                          required
                          label="Signature"
                          error={!!fieldState.error}
                          helperText={fieldState.error?.message}
                          variant="outlined"
                          size="small"
                          className="form-input-field"
                          placeholder="Enter your full name"
                          sx={{ width: "100%" }}
                        />
                      )}
                    />
                    <p className="signature-help-text">
                      By printing your name in the box and pressing the submit
                      button, I acknowledge that I have read and am
                      electronically signing the Agoura Math Circle Rules and
                      Expectations on behalf of myself or my dependent minor
                      participant.
                    </p>
                    <p className="signature-help-text">
                      Occasionally, we take pictures at AMC meetings, which may
                      be used for publicity purposes [e.g.: posted on our web
                      site or used in a brochure about AMC.] Do you give us
                      permission to include you in such photographs?
                    </p>
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
                            <span style={{ fontSize: "0.875rem" }}>
                              I give permission to use the pictures/videos.
                            </span>
                          }
                        />
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="row">
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
                      color: loading ? "#53b50a" : "#ffffff",
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

          {/* Success/Error Snackbar */}
          {snackbar.open && (
            <div
              style={{
                position: "fixed",
                top: "100px",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 99999,
                minWidth: "150px",
                maxWidth: "250px",
                padding: "6px 8px",
                backgroundColor:
                  snackbar.severity === "error" ? "#f44336" : "#1976d2",
                color: "#ffffff",
                borderRadius: "2px",
                boxShadow: "0 2px 3px rgba(0,0,0,0.3)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                fontSize: "0.75rem",
                lineHeight: "1.3",
              }}
            >
              <span style={{ flex: 1, paddingRight: "5px" }}>
                {snackbar.message}
              </span>
              <button
                onClick={handleCloseSnackbar}
                style={{
                  background: "none",
                  border: "none",
                  color: "#ffffff",
                  fontSize: "16px",
                  cursor: "pointer",
                  padding: "0",
                  lineHeight: "1",
                  flexShrink: 0,
                }}
              >
                ×
              </button>
            </div>
          )}

          {/* Registration Success Dialog */}
          <Dialog
            open={successDialogOpen}
            onClose={handleSuccessDialogClose}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle sx={{ color: "#174a10", fontWeight: "bold" }}>
              Registration Successful
            </DialogTitle>
            <DialogContent>
              <Typography>
                Registration successful, do you want to register another
                student? you will receive an email once it is approved.
              </Typography>
            </DialogContent>
            <DialogActions sx={{ padding: "16px 24px" }}>
              <Button onClick={handleSuccessDialogClose} color="inherit">
                No
              </Button>
              <Button
                onClick={handleRegisterAnother}
                variant="contained"
                sx={{
                  backgroundColor: "#53b50a",
                  "&:hover": { backgroundColor: "#469409" },
                }}
              >
                Yes
              </Button>
            </DialogActions>
          </Dialog>

          {/* Rules Popup Dialog */}
          <Dialog
            open={rulesOpen}
            onClose={() => setRulesOpen(false)}
            maxWidth="md"
            fullWidth
            PaperProps={{
              style: {
                maxHeight: "90vh",
                backgroundColor: "#f5f5f5",
              },
            }}
          >
            <DialogTitle
              sx={{
                backgroundColor: "#f5f5f5",
                color: "#174a10",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 24px",
                borderBottom: "1px solid #e0e0e0",
              }}
            >
              <Typography
                variant="h6"
                component="div"
                sx={{ fontWeight: "bold", color: "#174a10" }}
              >
                Agoura Math Circle rules and expectations
              </Typography>
              <IconButton
                aria-label="close"
                onClick={() => setRulesOpen(false)}
                sx={{
                  color: "#174a10",
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent
              dividers
              sx={{
                padding: "24px",
                backgroundColor: "#f5f5f5",
              }}
            >
              <Typography
                variant="body1"
                paragraph
                sx={{ marginBottom: "20px" }}
              >
                By joining the Agoura Math Circle students and parents agree to
                abide the following rules:
              </Typography>
              <ol style={{ fontSize: "large", paddingLeft: "20px" }}>
                <li style={{ marginBottom: "15px" }}>
                  Arrive on Time: All the classes start at 2 p.m. sharp. We
                  strongly discourage late arrivals since they are very
                  disruptive to the sessions.
                </li>
                <li style={{ marginBottom: "15px" }}>
                  COME PREPARED: Bring a 3 ring binder dedicated to the Agoura
                  Math Circle materials. You will be putting handouts and
                  worksheets into this binder
                  <br />
                  Bring scratch paper.
                  <br />
                  Bring pencils, pens and erasers.
                  <br />
                  If asked by the instructor, bring additional supplies (such as
                  compasses and rulers for geometry sessions; calculators, graph
                  paper, etc.)
                  <br />
                  Make your best effort in completing problems assigned for
                  homework.
                  <br />
                  If you have missed a session, be sure to download the handout
                  from the web page and work through it at home.
                </li>
                <li style={{ marginBottom: "15px" }}>
                  BEHAVIOR RULES:No food or drink in the classrooms while
                  classes are in session (you may have a snack during the break
                  only).
                  <br />
                  No cell phones or electronic games are allowed during class
                  time. Calculators are allowed only in sessions when
                  instructors have asked to bring them.
                  <br />
                  No running and playing in the classrooms, hallways, bathrooms
                  or elevators.
                  <br />
                  Stay quiet in the hallways.
                  <br />
                  Follow the instructions of group instructors and staff.
                  <br />
                  Be engaged in the classroom activities (no working on outside
                  projects or homework; no cell phones; no playing games; no
                  reading of outside materials).
                  <br />
                  Maintain classroom environment conductive of learning (be
                  respectful to the instructors, your peers; stay in your seat;
                  do not speak out of turn).
                  <br />
                  Be careful with the furniture and classroom equipment, as well
                  as when using any university facilities.
                  <br />
                  Clean up your work space before leaving the classroom.
                </li>
                <li style={{ marginBottom: "15px" }}>
                  FOR PARENTS: Parents (except for specially designated room
                  parents) are generally not allowed in the classrooms during
                  the math circle sessions.
                  <br />
                  Room parents help the lead instructor and circle docents and
                  divide their attention equally between the children.
                  <br />
                  Please stay with your children until the session starts.
                  <br />
                  Please sign in and sign out your child on the sign up sheets
                  provided next to the classroom (the sign-up sheets are
                  maintained by room parents).
                  <br />
                  Conversation in the hallways should be kept to a minimum.
                  <br />
                  All the classes end at 5 p.m. sharp. Please pick up your
                  child(ren) promptly at the end of the math circle sessions.
                </li>
                <li style={{ marginBottom: "15px" }}>
                  Home work is required for all students. Students need to bring
                  their Student ID Card and Home Work for every session. If your
                  kid/s will not be able to attend this session, please contact
                  the Instructor via the message center. If students are absent
                  for more than two classes or missing homework for 2 classes,
                  they will be dropped.
                </li>
                <li style={{ marginBottom: "15px" }}>
                  Agoura Math Circle YouTube channel subscription is required
                  for all students. We publish the lecture videos a week before
                  the class. All students must watch the lecture videos before
                  coming to the class. Subscribe to{" "}
                  <a
                    href="https://www.youtube.com/channel/UCWK2w-BVGps-Y9c08B5pRgA/videos"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#1976d2" }}
                  >
                    Agoura Math Circle YouTube Channel.
                  </a>
                </li>
              </ol>
              <Typography
                variant="body2"
                sx={{ marginTop: "20px", fontWeight: "bold" }}
              >
                Last revised: January 1, 2020
              </Typography>
            </DialogContent>
          </Dialog>

          {/* Terms Popup Dialog */}
          <Dialog
            open={termsOpen}
            onClose={() => setTermsOpen(false)}
            maxWidth="md"
            fullWidth
            PaperProps={{
              style: {
                maxHeight: "90vh",
                backgroundColor: "#f5f5f5",
              },
            }}
          >
            <DialogTitle
              sx={{
                backgroundColor: "#f5f5f5",
                color: "#174a10",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 24px",
                borderBottom: "1px solid #e0e0e0",
              }}
            >
              <Typography
                variant="h6"
                component="div"
                sx={{ fontWeight: "bold", color: "#174a10" }}
              >
                ASSUMPTION OF RISK, WAIVER OF LIABILITY AND INDEMNITY AGREEMENT
              </Typography>
              <IconButton
                aria-label="close"
                onClick={() => setTermsOpen(false)}
                sx={{
                  color: "#174a10",
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent
              dividers
              sx={{
                padding: "24px",
                backgroundColor: "#f5f5f5",
              }}
            >
              <Typography
                variant="body1"
                paragraph
                sx={{ marginBottom: "15px", textAlign: "justify" }}
              >
                I will not attempt to hold Agoura Math Circle, its directors,
                officers, teachers, volunteers, shareholders, members,
                employees, affiliates, sponsors, and/or insurers (all together,
                "Releasees") liable for any damages, injury, and/or loss to
                person or property one might sustain while participating in the
                Agoura Math Circle Program. I knowingly and voluntarily release
                Releasees from any and all liability whatsoever for any personal
                injury (including death) or property damage arising
                from-participation in Agoura Math Circle's program including,
                without limitation, any incidental travel. I further knowingly
                and voluntarily agree to defend, indemnify, and hold harmless
                the Releasees from any and all liabilities, damages, claims,
                demands, causes of action, loss and/or liability (including
                attorneys' fees) arising out of my own actions or omissions
                while participating in/and/or attending the Agoura Math Circle
                Program or any incident thereto.
              </Typography>
              <Typography
                variant="body1"
                paragraph
                sx={{ marginBottom: "15px", textAlign: "justify" }}
              >
                I fully recognize that there are dangers and risks I may be
                exposed to by participating in the Agoura Math Circle Program
                including, but not limited to injury, illness, substantial
                bodily harm, death, and or property damage for which I may be
                liable. I expressly and knowingly assume the full risk, without
                limitation. I expressly acknowledge and agree that I am
                voluntarily participating in the Agoura Math Circle Program and
                that it is my sole responsibility to comply with any and all
                applicable laws. I expressly acknowledge and agree that it is my
                sole responsibility to participate only in those activities for
                which I have the necessary skills, fitness, and training. I
                expressly acknowledge and agree that Releasees do not warrant or
                guarantee as to the condition, safety, or suitability of any
                equipment, vehicle, roadway, sidewalk, classroom, classroom
                furniture, property, building, parking lot, and/or location or
                structure of any kind that may be involved, used, and/or visited
                in connection with the Agoura Math Circle Program.
              </Typography>
              <Typography
                variant="body1"
                paragraph
                sx={{
                  marginBottom: "15px",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                DO NOT SIGN WITHOUT READING. I HAVE READ THIS ASSUMPTION OF
                RISK, WAIVER OF LIABILITY AND INDEMNITY AGREEMENT AND AGREE TO
                ITS TERMS.
              </Typography>
              <Typography
                variant="body2"
                sx={{ marginTop: "20px", fontStyle: "italic" }}
              >
                <strong>Last revised: January 1, {currentYear}</strong>
              </Typography>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default StudentRegistration;
