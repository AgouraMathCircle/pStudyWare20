import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { authService } from "../services";
import {
  TextField,
  Button,
  Typography,
  Box,
  Container,
  Grid,
  Paper,
  IconButton,
  InputAdornment,
  Alert,
  FormControl,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Facebook,
  Twitter,
  LinkedIn,
  Instagram,
  YouTube,
} from "@mui/icons-material";
import "../styles/Login.css";
// Import images from src/assets
import pageHeaderImg from "../assets/images/about/page-header.jpg";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitMessage, setSubmitMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: "",
      });
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Please enter your Email ID.";
    } else if (
      !/\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid Email ID.";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password can't be empty!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validateForm()) {
      setIsLoading(true);
      setSubmitMessage("");

      try {
        const response = await authService.login(
          formData.email,
          formData.password
        );

        setSubmitMessage("Login successful! Redirecting...");

        // Store user data in localStorage (already done in authService)
        console.log("Login successful:", response);

        // Trigger storage event to update other components
        window.dispatchEvent(new Event("storage"));

        // Check user MemberType and redirect accordingly (same logic as login.aspx.cs)
        const user = authService.getCurrentUser();
        if (user && user.memberType) {
          const memberType = user.memberType.toUpperCase();

          setTimeout(() => {
            switch (memberType) {
              case "A":
                navigate("/admin/dashboard");
                break;
              case "I":
                navigate("/instructor/dashboard");
                break;
              case "S":
                navigate("/student/dashboard");
                break;
              case "V":
                navigate("/volunteer/dashboard");
                break;
              default:
                navigate("/dashboard");
                break;
            }
          }, 1500);
        } else {
          // Fallback to role-based redirection if MemberType is not available
          if (user && user.role === "Student") {
            setTimeout(() => {
              navigate("/student/dashboard");
            }, 1500);
          } else {
            setTimeout(() => {
              navigate("/dashboard");
            }, 1500);
          }
        }
      } catch (error) {
        // Display error message (same as lblMessage.Text in login.aspx.cs)
        setSubmitMessage("Invalid email Id or password. Please try again.");
        console.error("Login error:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setSubmitMessage("");
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setSubmitMessage("Please enter your email address first.");
      return;
    }

    setIsLoading(true);
    setSubmitMessage("");

    try {
      await authService.forgotPassword(formData.email);
      setSubmitMessage("Password reset email sent! Please check your inbox.");
    } catch (error) {
      setSubmitMessage(
        error.message || "Failed to send reset email. Please try again."
      );
      console.error("Forgot password error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="main-content">
      {/* Breadcrumbs Start */}
      <div className="sc-breadcrumbs breadcrumbs-overlay">
        <div className="breadcrumbs-img">
          <img src={pageHeaderImg} alt="Breadcrumbs Image" />
        </div>
        <div className="breadcrumbs-text white-color">
          <h1 className="page-title">LOGIN</h1>
          <ul>
            <li>
              <a className="active" href="/">
                Home &gt;
              </a>
            </li>
            <li className="active">Login</li>
          </ul>
        </div>
      </div>
      {/* Breadcrumbs End */}

      {/* Login Section Start */}
      <div
        id="sc-about login"
        className="sc-about pt-80 pb-70 md-pt-40 position-relative arrow-animation-1"
      >
        <div className="login-title text-center">
          <h2 className="title">LOGIN HERE!</h2>
        </div>

        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* Login Form */}
            <Grid item xs={12} md={7}>
              <Paper
                elevation={3}
                className="login-form-container"
                sx={{
                  padding: 4,
                  borderRadius: 2,
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <form onSubmit={handleSubmit} className="login-form">
                  {/* Email Field */}
                  <TextField
                    fullWidth
                    label="User Name"
                    variant="outlined"
                    value={formData.email}
                    onChange={handleChange("email")}
                    error={!!errors.email}
                    helperText={errors.email}
                    margin="normal"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": {
                          borderColor: "#53b50a",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#53b50a",
                        },
                      },
                    }}
                  />

                  {/* Password Field */}
                  <FormControl fullWidth margin="normal" variant="outlined">
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <OutlinedInput
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange("password")}
                      error={!!errors.password}
                      startAdornment={
                        <InputAdornment position="start">
                          <Lock color="action" />
                        </InputAdornment>
                      }
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Password"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "&:hover fieldset": {
                            borderColor: "#53b50a",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#53b50a",
                          },
                        },
                      }}
                    />
                    {errors.password && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ mt: 1 }}
                      >
                        {errors.password}
                      </Typography>
                    )}
                  </FormControl>

                  {/* Submit Button */}
                  <Box sx={{ mt: 3, mb: 2 }}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      size="large"
                      disabled={isLoading}
                      sx={{
                        backgroundColor: "#53b50a",
                        "&:hover": {
                          backgroundColor: "#4a7c59",
                        },
                        "&:disabled": {
                          backgroundColor: "#cccccc",
                          color: "#666666",
                        },
                        py: 1.5,
                        fontSize: "1.1rem",
                        fontWeight: 600,
                      }}
                    >
                      {isLoading ? "Logging in..." : "Submit"}
                    </Button>
                  </Box>

                  {/* Forgot Password Button */}
                  <Box sx={{ mb: 2 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="large"
                      onClick={handleForgotPassword}
                      disabled={isLoading}
                      sx={{
                        borderColor: "#53b50a",
                        color: "#53b50a",
                        "&:hover": {
                          borderColor: "#4a7c59",
                          backgroundColor: "rgba(83, 181, 10, 0.1)",
                        },
                        "&:disabled": {
                          borderColor: "#cccccc",
                          color: "#666666",
                        },
                        py: 1.5,
                        fontSize: "1rem",
                      }}
                    >
                      {isLoading ? "Sending..." : "Forgot Password"}
                    </Button>
                  </Box>

                  {/* Message Display */}
                  {submitMessage && (
                    <Alert
                      severity={
                        submitMessage.includes("successful")
                          ? "success"
                          : "error"
                      }
                      sx={{ mt: 2 }}
                    >
                      {submitMessage}
                    </Alert>
                  )}
                </form>
              </Paper>
            </Grid>

            {/* Contact Information */}
            <Grid item xs={12} md={5}>
              <Paper
                elevation={3}
                className="contact-info-container"
                sx={{
                  padding: 4,
                  borderRadius: 2,
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(10px)",
                  height: "fit-content",
                }}
              >
                <Typography
                  variant="h5"
                  component="h3"
                  gutterBottom
                  sx={{ fontWeight: 600, color: "#333" }}
                >
                  CONTACT US
                </Typography>

                <Box sx={{ mt: 3 }}>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    <strong>Email:</strong>{" "}
                    <a
                      href="mailto:support@agouramathcircle.org"
                      style={{
                        color: "#53b50a",
                        textDecoration: "none",
                        fontWeight: 500,
                      }}
                    >
                      support@agouramathcircle.org
                    </a>
                  </Typography>
                </Box>

                {/* Social Media Links */}
                <Box sx={{ mt: 4 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: 600, color: "#333" }}
                  >
                    Follow Us
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                    <IconButton
                      href="https://www.facebook.com/profile.php?id=100010784343153"
                      target="_blank"
                      sx={{
                        color: "#1877f2",
                        "&:hover": {
                          backgroundColor: "rgba(24, 119, 242, 0.1)",
                        },
                      }}
                    >
                      <Facebook />
                    </IconButton>
                    <IconButton
                      href="https://twitter.com/Agouramathcirle"
                      target="_blank"
                      sx={{
                        color: "#1da1f2",
                        "&:hover": {
                          backgroundColor: "rgba(29, 161, 242, 0.1)",
                        },
                      }}
                    >
                      <Twitter />
                    </IconButton>
                    <IconButton
                      href="https://www.linkedin.com/in/agouramathcircle/"
                      target="_blank"
                      sx={{
                        color: "#0077b5",
                        "&:hover": {
                          backgroundColor: "rgba(0, 119, 181, 0.1)",
                        },
                      }}
                    >
                      <LinkedIn />
                    </IconButton>
                    <IconButton
                      href="https://www.instagram.com/agouramathcircle/"
                      target="_blank"
                      sx={{
                        color: "#e4405f",
                        "&:hover": {
                          backgroundColor: "rgba(228, 64, 95, 0.1)",
                        },
                      }}
                    >
                      <Instagram />
                    </IconButton>
                    <IconButton
                      href="https://www.youtube.com/channel/UCWK2w-BVGps-Y9c08B5pRgA/videos"
                      target="_blank"
                      sx={{
                        color: "#ff0000",
                        "&:hover": { backgroundColor: "rgba(255, 0, 0, 0.1)" },
                      }}
                    >
                      <YouTube />
                    </IconButton>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>

        {/* Animated Arrows */}
        {/* <div className="animated-arrow-1 animated-arrow left-right-new">
          <img src={arrow1} alt="" />
        </div>
        <div className="animated-arrow-2 animated-arrow up-down-new">
          <img src={arrow2} alt="" />
        </div>
        <div className="animated-arrow-3 animated-arrow up-down-new">
          <img src={arrow3} alt="" />
        </div>
        <div className="animated-arrow-4 animated-arrow left-right-new">
          <img src={arrow3} alt="" />
        </div> */}
      </div>
      {/* Login Section End */}
    </div>
  );
};

export default Login;
