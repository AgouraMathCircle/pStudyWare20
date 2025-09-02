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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import volunteerService from "../services/volunteerService";
import "../styles/VolunteerRegistration.css";

const VolunteerRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    country: "",
    schoolName: "",
    grade: "",
    sessionId: "F2024",
    locationId: "",
    locationName: "",
    sessionName: "Fall Session 2024",
    interestedFor: "",
    aboutYourself: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [locations, setLocations] = useState([]);

  // Load locations on component mount
  useEffect(() => {
    const loadLocations = async () => {
      try {
        const locationData = await volunteerService.getLocations();
        setLocations(locationData);
      } catch (error) {
        console.error("Error loading locations:", error);
      }
    };
    loadLocations();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required field validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "Please enter your First name.";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Please enter your Last name.";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Please enter your Email Address.";
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid Email ID.";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Please enter your Phone Number.";
    } else if (!/^[01]?[- .]?(\([2-9]\d{2}\)|[2-9]\d{2})[- .]?\d{3}[- .]?\d{4}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid Phone No.";
    }
    if (!formData.city.trim()) {
      newErrors.city = "Please enter City Name.";
    }
    if (!formData.state.trim()) {
      newErrors.state = "Please enter State Name.";
    }
    if (!formData.country) {
      newErrors.country = "Please select a country.";
    }
    if (!formData.schoolName.trim()) {
      newErrors.schoolName = "Please enter School/University Name.";
    }
    if (!formData.grade) {
      newErrors.grade = "Please select Grade/Degree.";
    }
    if (!formData.locationId) {
      newErrors.locationId = "Please select Course/Location.";
    }
    if (!formData.interestedFor || formData.interestedFor === "0") {
      newErrors.interestedFor = "Please select Interested For.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await volunteerService.registerVolunteer(formData);
      
      if (response.isSuccess) {
        setSubmitStatus({
          type: "success",
          message: `${formData.firstName} has successfully added into AMC volunteer list.`
        });
        // Reset form after successful submission
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          city: "",
          state: "",
          country: "",
          schoolName: "",
          grade: "",
          sessionId: "F2024",
          locationId: "",
          locationName: "",
          sessionName: "Fall Session 2024",
          interestedFor: "",
          aboutYourself: "",
        });
      } else {
        setSubmitStatus({
          type: "error",
          message: response.errorMessage || "Registration failed. Please try again."
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "An error occurred during registration. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const countries = [
    { value: "US", label: "United States" },
    { value: "CA", label: "Canada" },
    { value: "GB", label: "United Kingdom" },
    { value: "CN", label: "China" },
    { value: "IN", label: "India" },
    { value: "SG", label: "Singapore" },
    { value: "MX", label: "Mexico" },
    { value: "MY", label: "Malaysia" },
    { value: "AF", label: "Afghanistan" },
    { value: "AL", label: "Albania" },
    { value: "DZ", label: "Algeria" },
    { value: "AS", label: "American Samoa" },
    { value: "AD", label: "Andorra" },
    { value: "AO", label: "Angola" },
    { value: "AI", label: "Anguilla" },
    { value: "AQ", label: "Antarctica" },
    { value: "AG", label: "Antigua And Barbuda" },
    { value: "AR", label: "Argentina" },
    { value: "AM", label: "Armenia" },
    { value: "AW", label: "Aruba" },
    { value: "AU", label: "Australia" },
    { value: "AT", label: "Austria" },
    { value: "AZ", label: "Azerbaijan" },
    { value: "BS", label: "Bahamas" },
    { value: "BH", label: "Bahrain" },
    { value: "BD", label: "Bangladesh" },
    { value: "BB", label: "Barbados" },
    { value: "BY", label: "Belarus" },
    { value: "BE", label: "Belgium" },
    { value: "BZ", label: "Belize" },
    { value: "BJ", label: "Benin" },
    { value: "BM", label: "Bermuda" },
    { value: "BT", label: "Bhutan" },
    { value: "BO", label: "Bolivia" },
    { value: "BA", label: "Bosnia And Herzegowina" },
    { value: "BW", label: "Botswana" },
    { value: "BV", label: "Bouvet Island" },
    { value: "BR", label: "Brazil" },
    { value: "IO", label: "British Indian Ocean Territory" },
    { value: "BN", label: "Brunei Darussalam" },
    { value: "BG", label: "Bulgaria" },
    { value: "BF", label: "Burkina Faso" },
    { value: "BI", label: "Burundi" },
    { value: "KH", label: "Cambodia" },
    { value: "CM", label: "Cameroon" },
    { value: "CV", label: "Cape Verde" },
    { value: "KY", label: "Cayman Islands" },
    { value: "CF", label: "Central African Republic" },
    { value: "TD", label: "Chad" },
    { value: "CL", label: "Chile" },
    { value: "CX", label: "Christmas Island" },
    { value: "CC", label: "Cocos (Keeling) Islands" },
    { value: "CO", label: "Colombia" },
    { value: "KM", label: "Comoros" },
    { value: "CG", label: "Congo" },
    { value: "CK", label: "Cook Islands" },
    { value: "CR", label: "Costa Rica" },
    { value: "CI", label: "Cote D'Ivoire" },
    { value: "HR", label: "Croatia (Local Name: Hrvatska)" },
    { value: "CU", label: "Cuba" },
    { value: "CY", label: "Cyprus" },
    { value: "CZ", label: "Czech Republic" },
    { value: "DK", label: "Denmark" },
    { value: "DJ", label: "Djibouti" },
    { value: "DM", label: "Dominica" },
    { value: "DO", label: "Dominican Republic" },
    { value: "TP", label: "East Timor" },
    { value: "EC", label: "Ecuador" },
    { value: "EG", label: "Egypt" },
    { value: "SV", label: "El Salvador" },
    { value: "GQ", label: "Equatorial Guinea" },
    { value: "ER", label: "Eritrea" },
    { value: "EE", label: "Estonia" },
    { value: "ET", label: "Ethiopia" },
    { value: "FK", label: "Falkland Islands (Malvinas)" },
    { value: "FO", label: "Faroe Islands" },
    { value: "FJ", label: "Fiji" },
    { value: "FI", label: "Finland" },
    { value: "FR", label: "France" },
    { value: "GF", label: "French Guiana" },
    { value: "PF", label: "French Polynesia" },
    { value: "TF", label: "French Southern Territories" },
    { value: "GA", label: "Gabon" },
    { value: "GM", label: "Gambia" },
    { value: "GE", label: "Georgia" },
    { value: "DE", label: "Germany" },
    { value: "GH", label: "Ghana" },
    { value: "GI", label: "Gibraltar" },
    { value: "GR", label: "Greece" },
    { value: "GL", label: "Greenland" },
    { value: "GD", label: "Grenada" },
    { value: "GP", label: "Guadeloupe" },
    { value: "GU", label: "Guam" },
    { value: "GT", label: "Guatemala" },
    { value: "GN", label: "Guinea" },
    { value: "GW", label: "Guinea-Bissau" },
    { value: "GY", label: "Guyana" },
    { value: "HT", label: "Haiti" },
    { value: "HM", label: "Heard And Mc Donald Islands" },
    { value: "VA", label: "Holy See (Vatican City State)" },
    { value: "HN", label: "Honduras" },
    { value: "HK", label: "Hong Kong" },
    { value: "HU", label: "Hungary" },
    { value: "IS", label: "Icel And" },
    { value: "ID", label: "Indonesia" },
    { value: "IR", label: "Iran (Islamic Republic Of)" },
    { value: "IQ", label: "Iraq" },
    { value: "IE", label: "Ireland" },
    { value: "IL", label: "Israel" },
    { value: "IT", label: "Italy" },
    { value: "JM", label: "Jamaica" },
    { value: "JP", label: "Japan" },
    { value: "JO", label: "Jordan" },
    { value: "KZ", label: "Kazakhstan" },
    { value: "KE", label: "Kenya" },
    { value: "KI", label: "Kiribati" },
    { value: "KP", label: "Korea, Dem People'S Republic" },
    { value: "KR", label: "Korea, Republic Of" },
    { value: "KW", label: "Kuwait" },
    { value: "KG", label: "Kyrgyzstan" },
    { value: "LA", label: "Lao People'S Dem Republic" },
    { value: "LV", label: "Latvia" },
    { value: "LB", label: "Lebanon" },
    { value: "LS", label: "Lesotho" },
    { value: "LR", label: "Liberia" },
    { value: "LY", label: "Libyan Arab Jamahiriya" },
    { value: "LI", label: "Liechtenstein" },
    { value: "LT", label: "Lithuania" },
    { value: "LU", label: "Luxembourg" },
    { value: "MO", label: "Macau" },
    { value: "MK", label: "Macedonia" },
    { value: "MG", label: "Madagascar" },
    { value: "MW", label: "Malawi" },
    { value: "MV", label: "Maldives" },
    { value: "ML", label: "Mali" },
    { value: "MT", label: "Malta" },
    { value: "MH", label: "Marshall Islands" },
    { value: "MQ", label: "Martinique" },
    { value: "MR", label: "Mauritania" },
    { value: "MU", label: "Mauritius" },
    { value: "YT", label: "Mayotte" },
    { value: "FM", label: "Micronesia, Federated States" },
    { value: "MD", label: "Moldova, Republic Of" },
    { value: "MC", label: "Monaco" },
    { value: "MN", label: "Mongolia" },
    { value: "MS", label: "Montserrat" },
    { value: "MA", label: "Morocco" },
    { value: "MZ", label: "Mozambique" },
    { value: "MM", label: "Myanmar" },
    { value: "NA", label: "Namibia" },
    { value: "NR", label: "Nauru" },
    { value: "NP", label: "Nepal" },
    { value: "NL", label: "Netherlands" },
    { value: "AN", label: "Netherlands Ant Illes" },
    { value: "NC", label: "New Caledonia" },
    { value: "NZ", label: "New Zealand" },
    { value: "NI", label: "Nicaragua" },
    { value: "NE", label: "Niger" },
    { value: "NG", label: "Nigeria" },
    { value: "NU", label: "Niue" },
    { value: "NF", label: "Norfolk Island" },
    { value: "MP", label: "Northern Mariana Islands" },
    { value: "NO", label: "Norway" },
    { value: "OM", label: "Oman" },
    { value: "PK", label: "Pakistan" },
    { value: "PW", label: "Palau" },
    { value: "PA", label: "Panama" },
    { value: "PG", label: "Papua New Guinea" },
    { value: "PY", label: "Paraguay" },
    { value: "PE", label: "Peru" },
    { value: "PH", label: "Philippines" },
    { value: "PN", label: "Pitcairn" },
    { value: "PL", label: "Poland" },
    { value: "PT", label: "Portugal" },
    { value: "PR", label: "Puerto Rico" },
    { value: "QA", label: "Qatar" },
    { value: "RE", label: "Reunion" },
    { value: "RO", label: "Romania" },
    { value: "RU", label: "Russian Federation" },
    { value: "RW", label: "Rwanda" },
    { value: "KN", label: "Saint K Itts And Nevis" },
    { value: "LC", label: "Saint Lucia" },
    { value: "VC", label: "Saint Vincent, The Grenadines" },
    { value: "WS", label: "Samoa" },
    { value: "SM", label: "San Marino" },
    { value: "ST", label: "Sao Tome And Principe" },
    { value: "SA", label: "Saudi Arabia" },
    { value: "SN", label: "Senegal" },
    { value: "SC", label: "Seychelles" },
    { value: "SL", label: "Sierra Leone" },
    { value: "SK", label: "Slovakia (Slovak Republic)" },
    { value: "SI", label: "Slovenia" },
    { value: "SB", label: "Solomon Islands" },
    { value: "SO", label: "Somalia" },
    { value: "ZA", label: "South Africa" },
    { value: "GS", label: "South Georgia , S Sandwich Is." },
    { value: "ES", label: "Spain" },
    { value: "LK", label: "Sri Lanka" },
    { value: "SH", label: "St. Helena" },
    { value: "PM", label: "St. Pierre And Miquelon" },
    { value: "SD", label: "Sudan" },
    { value: "SR", label: "Suriname" },
    { value: "SJ", label: "Svalbard, Jan Mayen Islands" },
    { value: "SZ", label: "Sw Aziland" },
    { value: "SE", label: "Sweden" },
    { value: "CH", label: "Switzerland" },
    { value: "SY", label: "Syrian Arab Republic" },
    { value: "TW", label: "Taiwan" },
    { value: "TJ", label: "Tajikistan" },
    { value: "TZ", label: "Tanzania, United Republic Of" },
    { value: "TH", label: "Thailand" },
    { value: "TG", label: "Togo" },
    { value: "TK", label: "Tokelau" },
    { value: "TO", label: "Tonga" },
    { value: "TT", label: "Trinidad And Tobago" },
    { value: "TN", label: "Tunisia" },
    { value: "TR", label: "Turkey" },
    { value: "TM", label: "Turkmenistan" },
    { value: "TC", label: "Turks And Caicos Islands" },
    { value: "TV", label: "Tuvalu" },
    { value: "UG", label: "Uganda" },
    { value: "UA", label: "Ukraine" },
    { value: "AE", label: "United Arab Emirates" },
    { value: "UM", label: "United States Minor Is." },
    { value: "UY", label: "Uruguay" },
    { value: "UZ", label: "Uzbekistan" },
    { value: "VU", label: "Vanuatu" },
    { value: "VE", label: "Venezuela" },
    { value: "VN", label: "Viet Nam" },
    { value: "VG", label: "Virgin Islands (British)" },
    { value: "VI", label: "Virgin Islands (U.S.)" },
    { value: "WF", label: "Wallis And Futuna Islands" },
    { value: "EH", label: "Western Sahara" },
    { value: "YE", label: "Yemen" },
    { value: "ZR", label: "Zaire" },
    { value: "ZM", label: "Zambia" },
    { value: "ZW", label: "Zimbabwe" },
  ];

  const grades = [
    { value: "High School Freshman", label: "9" },
    { value: "10", label: "10" },
    { value: "11", label: "11" },
    { value: "12", label: "12" },
    { value: "UG", label: "UG" },
    { value: "Graduate", label: "Graduate" },
    { value: "PhD", label: "PhD" },
    { value: "Others", label: "Others" },
  ];

  const interestedOptions = [
    { value: "0", label: "--Select--" },
    { value: "Tutoring", label: "Tutoring" },
    { value: "Document Review", label: "Document Reviewer" },
    { value: "Class Coordinator", label: "Class Coordinator" },
    { value: "Facility Inspection", label: "Facility Inspection" },
    { value: "Grading", label: "Grading" },
    { value: "Yard Duty", label: "Yard Duty" },
    { value: "Others", label: "Others" },
  ];

  return (
    <div className="volunteer-registration">
      {/* Breadcrumbs */}
      <Box sx={{ p: 2, backgroundColor: "#f5f5f5" }}>
        <Container maxWidth="lg">
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" href="/" underline="hover">
              Home
            </Link>
            <Link color="inherit" href="/registration" underline="hover">
              Registration
            </Link>
            <Typography color="text.primary">Volunteer Registration</Typography>
          </Breadcrumbs>
        </Container>
      </Box>

      {/* Page Header */}
      <Box
        sx={{
          backgroundImage: "url('/src/assets/images/about/page-header.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
          py: 8,
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
          },
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" sx={{ position: "relative", zIndex: 1 }}>
            VOLUNTEER REGISTRATION
          </Typography>
          <Box sx={{ position: "relative", zIndex: 1, mt: 2 }}>
            <Typography variant="body1">
              Home &gt; Registration &gt; Volunteer Registration
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Success Message */}
      {submitStatus?.type === "success" && (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Alert severity="success" sx={{ mb: 3 }}>
            <Typography variant="h6" component="span">
              {submitStatus.message}
            </Typography>
          </Alert>
        </Container>
      )}

      {/* Error Message */}
      {submitStatus?.type === "error" && (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {submitStatus.message}
          </Alert>
        </Container>
      )}

      {/* Main Form */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={4}>
              {/* Personal Information */}
              <Grid item xs={12} lg={6}>
                <Typography variant="h4" component="h2" sx={{ mb: 3, color: "#174a10" }}>
                  Personal <span style={{ color: "#53b50a" }}>Information</span>
                </Typography>

                <TextField
                  fullWidth
                  label="First Name"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  sx={{ mb: 2 }}
                  required
                />

                <TextField
                  fullWidth
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                  sx={{ mb: 2 }}
                  required
                />

                <TextField
                  fullWidth
                  label="Email ID"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  error={!!errors.email}
                  helperText={errors.email}
                  sx={{ mb: 2 }}
                  required
                />

                <TextField
                  fullWidth
                  label="Phone (999-999-9999)"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  error={!!errors.phone}
                  helperText={errors.phone}
                  sx={{ mb: 2 }}
                  required
                />

                <TextField
                  fullWidth
                  label="City"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  error={!!errors.city}
                  helperText={errors.city}
                  sx={{ mb: 2 }}
                  required
                />

                <TextField
                  fullWidth
                  label="State"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  error={!!errors.state}
                  helperText={errors.state}
                  sx={{ mb: 2 }}
                  required
                />

                <FormControl fullWidth sx={{ mb: 2 }} required>
                  <InputLabel>Country</InputLabel>
                  <Select
                    value={formData.country}
                    label="Country"
                    onChange={(e) => handleInputChange("country", e.target.value)}
                    error={!!errors.country}
                  >
                    {countries.map((country) => (
                      <MenuItem key={country.value} value={country.value}>
                        {country.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.country && (
                    <FormHelperText error>{errors.country}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* Educational Information */}
              <Grid item xs={12} lg={6}>
                <Typography variant="h4" component="h2" sx={{ mb: 3, color: "#174a10" }}>
                  Educational <span style={{ color: "#53b50a" }}>Information</span>
                </Typography>

                <TextField
                  fullWidth
                  label="School/University Name"
                  value={formData.schoolName}
                  onChange={(e) => handleInputChange("schoolName", e.target.value)}
                  error={!!errors.schoolName}
                  helperText={errors.schoolName}
                  sx={{ mb: 2 }}
                  required
                />

                <FormControl fullWidth sx={{ mb: 2 }} required>
                  <InputLabel>Grade/Degree</InputLabel>
                  <Select
                    value={formData.grade}
                    label="Grade/Degree"
                    onChange={(e) => handleInputChange("grade", e.target.value)}
                    error={!!errors.grade}
                  >
                    {grades.map((grade) => (
                      <MenuItem key={grade.value} value={grade.value}>
                        {grade.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.grade && (
                    <FormHelperText error>{errors.grade}</FormHelperText>
                  )}
                </FormControl>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Register For</InputLabel>
                  <Select
                    value={formData.sessionId}
                    label="Register For"
                    onChange={(e) => handleInputChange("sessionId", e.target.value)}
                  >
                    <MenuItem value="F2024">Fall Session 2024</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 2 }} required>
                  <InputLabel>Course/Location</InputLabel>
                  <Select
                    value={formData.locationId}
                    label="Course/Location"
                    onChange={(e) => {
                      const location = locations.find(loc => loc.id === e.target.value);
                      handleInputChange("locationId", e.target.value);
                      handleInputChange("locationName", location?.name || "");
                    }}
                    error={!!errors.locationId}
                  >
                    {locations.map((location) => (
                      <MenuItem key={location.id} value={location.id}>
                        {location.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.locationId && (
                    <FormHelperText error>{errors.locationId}</FormHelperText>
                  )}
                </FormControl>

                <FormControl fullWidth sx={{ mb: 2 }} required>
                  <InputLabel>Interested For</InputLabel>
                  <Select
                    value={formData.interestedFor}
                    label="Interested For"
                    onChange={(e) => handleInputChange("interestedFor", e.target.value)}
                    error={!!errors.interestedFor}
                  >
                    {interestedOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.interestedFor && (
                    <FormHelperText error>{errors.interestedFor}</FormHelperText>
                  )}
                </FormControl>

                <TextField
                  fullWidth
                  label="About Yourself (Achievements, Merits, etc)"
                  multiline
                  rows={8}
                  value={formData.aboutYourself}
                  onChange={(e) => handleInputChange("aboutYourself", e.target.value)}
                  sx={{ mb: 2 }}
                />
              </Grid>
            </Grid>

            {/* Submit Button */}
            <Box sx={{ mt: 4, textAlign: "center" }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isSubmitting}
                sx={{
                  backgroundColor: "#174a10",
                  color: "white",
                  px: 6,
                  py: 2,
                  fontSize: "1.1rem",
                  "&:hover": {
                    backgroundColor: "#0d2e0a",
                  },
                  "&:disabled": {
                    backgroundColor: "#cccccc",
                  },
                }}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default VolunteerRegistration;
