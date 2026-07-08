import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import volunteerService from "../services/volunteerService";
import studentService from "../services/studentService";
import "../styles/VolunteerRegistration.css";
import pageHeaderImg from "../assets/images/about/page-header.jpg";

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
const currentYear = new Date().getFullYear();

const ABOUT_YOURSELF_MAX_CHARS = 500;
const AGREEMENT_SCROLL_THRESHOLD = 24;

const isAgreementContentFullyRead = (element) => {
  if (!element) {
    return false;
  }

  if (element.scrollHeight <= element.clientHeight + 1) {
    return true;
  }

  return (
    element.scrollHeight - element.scrollTop - element.clientHeight <=
    AGREEMENT_SCROLL_THRESHOLD
  );
};

const isEmptySelectValue = (value) =>
  value === undefined ||
  value === null ||
  value === "" ||
  value === "0" ||
  value === 0;

const requiredSelect = (requiredMessage, emptyMessage) =>
  yup
    .mixed()
    .required(requiredMessage)
    .test("selected", emptyMessage, (value) => !isEmptySelectValue(value));

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
    .matches(/^\d{10}$/, "Phone number must be exactly 10 digits"),
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
  grade: requiredSelect(
    "Grade/Degree is required",
    "Please select a grade/degree",
  ),
  sessionId: requiredSelect(
    "Register For is required",
    "Please select a session",
  ),
  locationId: requiredSelect(
    "Course/Location is required",
    "Please select a course/location",
  ),
  interestedFor: requiredSelect(
    "Please select an area of interest",
    "Please select an area of interest",
  ),
  aboutyourself: yup
    .string()
    .max(
      ABOUT_YOURSELF_MAX_CHARS,
      `About yourself must be ${ABOUT_YOURSELF_MAX_CHARS} characters or less`,
    ),
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
  firstName: "",
  lastName: "",
  email: "",
  phoneNo: "",
  city: "",
  state: "",
  country: "US",
  schoolName: "",
  grade: "0",
  sessionId: "0",
  locationId: "0",
  interestedFor: "0",
  aboutyourself: "",
  liabilitySignature: "",
  ruleSignature: "",
  picturePermission: true,
};

const VolunteerRegistration = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [termsOpened, setTermsOpened] = useState(false);
  const [rulesOpened, setRulesOpened] = useState(false);
  const [termsScrolled, setTermsScrolled] = useState(false);
  const [rulesScrolled, setRulesScrolled] = useState(false);
  const [highlightTermsButton, setHighlightTermsButton] = useState(false);
  const [highlightRulesButton, setHighlightRulesButton] = useState(false);
  const [termsButtonError, setTermsButtonError] = useState("");
  const [rulesButtonError, setRulesButtonError] = useState("");
  const termsContentRef = useRef(null);
  const rulesContentRef = useRef(null);
  const termsButtonRef = useRef(null);
  const rulesButtonRef = useRef(null);
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
    defaultValues: defaultFormValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldFocusError: true,
  });

  const checkAgreementScrollState = useCallback((element, setScrolled) => {
    if (isAgreementContentFullyRead(element)) {
      setScrolled(true);
    }
  }, []);

  const openTermsDialog = () => {
    setTermsOpened(true);
    setTermsOpen(true);
  };

  const openRulesDialog = () => {
    setRulesOpened(true);
    setRulesOpen(true);
  };

  const scrollToAgreementButton = (buttonRef) => {
    buttonRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const resetAgreementReview = () => {
    setTermsOpened(false);
    setRulesOpened(false);
    setTermsScrolled(false);
    setRulesScrolled(false);
    setHighlightTermsButton(false);
    setHighlightRulesButton(false);
    setTermsButtonError("");
    setRulesButtonError("");
  };

  const getAgreementButtonError = (opened, scrolled, label) => {
    if (opened && scrolled) {
      return "";
    }

    if (!opened) {
      return `Please click ${label} and scroll to the end.`;
    }

    return `Please scroll ${label} to the end.`;
  };

  const validateAgreementReview = () => {
    const termsComplete = termsOpened && termsScrolled;
    const rulesComplete = rulesOpened && rulesScrolled;

    if (termsComplete && rulesComplete) {
      setHighlightTermsButton(false);
      setHighlightRulesButton(false);
      setTermsButtonError("");
      setRulesButtonError("");
      return true;
    }

    setHighlightTermsButton(!termsComplete);
    setHighlightRulesButton(!rulesComplete);
    setTermsButtonError(
      getAgreementButtonError(termsOpened, termsScrolled, "Terms"),
    );
    setRulesButtonError(
      getAgreementButtonError(rulesOpened, rulesScrolled, "Rules"),
    );

    window.requestAnimationFrame(() => {
      if (!termsComplete) {
        scrollToAgreementButton(termsButtonRef);
      } else {
        scrollToAgreementButton(rulesButtonRef);
      }
    });

    return false;
  };

  useEffect(() => {
    if (termsOpened && termsScrolled) {
      setHighlightTermsButton(false);
      setTermsButtonError("");
    }
  }, [termsOpened, termsScrolled]);

  useEffect(() => {
    if (rulesOpened && rulesScrolled) {
      setHighlightRulesButton(false);
      setRulesButtonError("");
    }
  }, [rulesOpened, rulesScrolled]);

  useEffect(() => {
    if (!termsOpen) {
      return undefined;
    }

    const frameId = window.requestAnimationFrame(() => {
      checkAgreementScrollState(termsContentRef.current, setTermsScrolled);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [termsOpen, checkAgreementScrollState]);

  useEffect(() => {
    if (!rulesOpen) {
      return undefined;
    }

    const frameId = window.requestAnimationFrame(() => {
      checkAgreementScrollState(rulesContentRef.current, setRulesScrolled);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [rulesOpen, checkAgreementScrollState]);

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
          studentService.getCountries(),
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

  useEffect(() => {
    if (snackbar.open) {
      const timer = setTimeout(() => {
        setSnackbar((prev) => ({ ...prev, open: false }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [snackbar.open]);

  const onSubmit = async (data) => {
    if (!validateAgreementReview()) {
      return;
    }

    setLoading(true);
    try {
      const selectedSession = sessions.find(
        (session) => String(session.id) === String(data.sessionId),
      );
      const selectedLocation = locations.find(
        (location) => String(location.id) === String(data.locationId),
      );
      const selectedGrade = grades.find(
        (grade) => String(grade.value) === String(data.grade),
      );
      const selectedInterest = interestedOptions.find(
        (option) => String(option.value) === String(data.interestedFor),
      );

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
        gradeName: selectedGrade?.label ?? "",
        sessionId: data.sessionId,
        sessionName: selectedSession?.name ?? "",
        locationId: Number(data.locationId),
        // Email label: Name - Location - City
        locationName: selectedLocation?.emailLabel ?? selectedLocation?.name ?? "",
        interestedFor: data.interestedFor,
        interestedForName: selectedInterest?.label ?? "",
        aboutyourself: data.aboutyourself || "",
        liabilitySignature: data.liabilitySignature,
        ruleSignature: data.ruleSignature,
        picturePermission: data.picturePermission,
      };

      await volunteerService.registerVolunteer(volunteerData);

      showSnackbar(
        "Volunteer registration submitted successfully! We will contact you soon.",
        "success",
      );

      reset(defaultFormValues);
      resetAgreementReview();

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

  const onInvalid = () => {
    showSnackbar(
      "Please fill in all required fields before submitting.",
      "error",
    );
  };

  return (
    <div className="volunteer-registration-container">
      {/* Breadcrumbs Section */}
      <div className="sc-breadcrumbs breadcrumbs-overlay">
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
            <li className="active">Registration &gt;</li>
            <li className="active">Volunteer Registration</li>
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
              Register for New Volunteer
            </h3>
          </div>

          {/* Main Form */}
          <div className="row">
            <form
              noValidate
              onSubmit={handleSubmit(onSubmit, onInvalid)}
              style={{ width: "100%" }}
            >
              <div className="registration-form-layout">
                {/* Personal Information Section */}
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
                      Personal{" "}
                      <span style={{ color: "#1976d2" }}>Information</span>
                    </h4>
                    <div className="form-group-container parent-form-fields">
                      <Controller
                        name="firstName"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            required
                            label="First Name"
                            error={!!errors.firstName}
                            helperText={errors.firstName?.message}
                            variant="outlined"
                            size="small"
                            className="form-input-field"
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
                            fullWidth
                            required
                            label="Last Name"
                            error={!!errors.lastName}
                            helperText={errors.lastName?.message}
                            variant="outlined"
                            size="small"
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
                            fullWidth
                            required
                            label="Email ID"
                            type="email"
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            variant="outlined"
                            size="small"
                            sx={{ width: "100%" }}
                          />
                        )}
                      />

                      <Controller
                        name="phoneNo"
                        control={control}
                        render={({ field: { onChange, value, ...field } }) => (
                          <TextField
                            {...field}
                            value={value}
                            onChange={(event) => {
                              onChange(
                                event.target.value
                                  .replace(/\D/g, "")
                                  .slice(0, 10),
                              );
                            }}
                            fullWidth
                            required
                            label="Phone"
                            placeholder="10 digit phone number"
                            inputProps={{
                              inputMode: "numeric",
                              maxLength: 10,
                            }}
                            error={!!errors.phoneNo}
                            helperText={errors.phoneNo?.message}
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
                            <InputLabel id="country-label" required>
                              Country
                            </InputLabel>
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
                    </div>
                  </div>
                </div>

                {/* Educational Information Section */}
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
                      Educational{" "}
                      <span style={{ color: "#1976d2" }}>Information</span>
                    </h4>
                    <div
                      className="form-group-container"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                      }}
                    >
                      <Controller
                        name="schoolName"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            required
                            label="School/University"
                            error={!!errors.schoolName}
                            helperText={errors.schoolName?.message}
                            variant="outlined"
                            size="small"
                            className="form-input-field"
                            sx={{ width: "100%" }}
                          />
                        )}
                      />

                      <Controller
                        name="grade"
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
                            <InputLabel id="grade-label" required>
                              Grade/Degree
                            </InputLabel>
                            <Select
                              {...field}
                              labelId="grade-label"
                              id="grade-select"
                              label="Grade/Degree"
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
                            <InputLabel id="session-label" required>
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
                            <InputLabel id="location-label" required>
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

                      <Controller
                        name="interestedFor"
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
                            <InputLabel id="interested-label" required>
                              Interested For
                            </InputLabel>
                            <Select
                              {...field}
                              labelId="interested-label"
                              id="interested-select"
                              label="Interested For"
                              displayEmpty
                            >
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
                            {fieldState.error && (
                              <FormHelperText>
                                {fieldState.error.message}
                              </FormHelperText>
                            )}
                          </FormControl>
                        )}
                      />

                      <Controller
                        name="aboutyourself"
                        control={control}
                        render={({ field: { onChange, value, ...field } }) => (
                          <TextField
                            {...field}
                            value={value}
                            onChange={(event) => {
                              onChange(
                                event.target.value.slice(
                                  0,
                                  ABOUT_YOURSELF_MAX_CHARS,
                                ),
                              );
                            }}
                            fullWidth
                            label={`About Yourself (Achievements, Merits, etc) (${(value ?? "").length}/${ABOUT_YOURSELF_MAX_CHARS} characters)`}
                            multiline
                            rows={3}
                            inputProps={{ maxLength: ABOUT_YOURSELF_MAX_CHARS }}
                            error={!!errors.aboutyourself}
                            helperText={errors.aboutyourself?.message || ""}
                            FormHelperTextProps={{
                              sx: {
                                display: errors.aboutyourself?.message
                                  ? "block"
                                  : "none",
                                margin: 0,
                              },
                            }}
                            variant="outlined"
                            size="small"
                            placeholder="Tell us about your achievements, merits, and additional information..."
                            sx={{ width: "100%" }}
                          />
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
                      <span className="agreement-inline-actions">
                        <span className="agreement-button-wrap">
                          <button
                            type="button"
                            ref={termsButtonRef}
                            className={`agreement-action-button${
                              highlightTermsButton
                                ? " agreement-action-button--highlight"
                                : ""
                            }`}
                            onClick={openTermsDialog}
                          >
                            Terms
                          </button>
                          {termsButtonError && (
                            <FormHelperText
                              error
                              className="agreement-button-error"
                            >
                              {termsButtonError}
                            </FormHelperText>
                          )}
                        </span>
                        <span className="agreement-and">and</span>
                        <span className="agreement-button-wrap">
                          <button
                            type="button"
                            ref={rulesButtonRef}
                            className={`agreement-action-button${
                              highlightRulesButton
                                ? " agreement-action-button--highlight"
                                : ""
                            }`}
                            onClick={openRulesDialog}
                          >
                            Rules
                          </button>
                          {rulesButtonError && (
                            <FormHelperText
                              error
                              className="agreement-button-error"
                            >
                              {rulesButtonError}
                            </FormHelperText>
                          )}
                        </span>
                      </span>
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
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          required
                          label="Liability Signature"
                          error={!!errors.liabilitySignature}
                          helperText={errors.liabilitySignature?.message}
                          variant="outlined"
                          size="small"
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
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          required
                          label="Signature"
                          error={!!errors.ruleSignature}
                          helperText={errors.ruleSignature?.message}
                          variant="outlined"
                          size="small"
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
                type="button"
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
              ref={rulesContentRef}
              dividers
              onScroll={(event) => {
                checkAgreementScrollState(
                  event.currentTarget,
                  setRulesScrolled,
                );
              }}
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
                Last revised: January 1, {currentYear}
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
              ref={termsContentRef}
              dividers
              onScroll={(event) => {
                checkAgreementScrollState(
                  event.currentTarget,
                  setTermsScrolled,
                );
              }}
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

export default VolunteerRegistration;
