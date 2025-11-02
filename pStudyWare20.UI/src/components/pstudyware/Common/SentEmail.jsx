import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Container,
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  IconButton,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import {
  Email as EmailIcon,
  Visibility as ViewIcon,
  FirstPage as FirstPageIcon,
  KeyboardArrowLeft as PrevPageIcon,
  KeyboardArrowRight as NextPageIcon,
  LastPage as LastPageIcon,
} from "@mui/icons-material";
import { useAuth } from "../../../contexts/AuthContext";
import sentEmailService from "../../../services/sentEmailService";
import StudentHeader from "../Student/StudentHeader";

const SentEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();

  // State
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("ALL");
  const [searchCriteria, setSearchCriteria] = useState("contains");

  // Compose/View form state
  const [showComposeForm, setShowComposeForm] = useState(false);
  const [formMode, setFormMode] = useState("view"); // 'view'
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Form fields
  const [sendTo, setSendTo] = useState("");
  const [subject, setSubject] = useState("");
  const [messageBody, setMessageBody] = useState("");

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
    vertical: "bottom",
  });

  const username = user?.email || user?.username || "";
  const isStudent =
    user?.role === "Student" || user?.memberType?.toUpperCase() === "S";

  // Check URL parameters for viewing a specific message
  const action = searchParams.get("Action");
  const emailId = searchParams.get("sEmailID");

  // Load sent messages
  useEffect(() => {
    const loadSentMessages = async () => {
      if (!isAuthenticated || !user) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        const username = user.email || user.username;
        console.log("Loading sent messages for:", username);
        const response = await sentEmailService.getSentMessages(username);
        console.log("Sent messages response:", response);

        if (response.isSuccess || response.IsSuccess) {
          // Handle both camelCase and PascalCase response formats
          const messagesList = response.messages || response.Messages || [];
          console.log("Loaded messages count:", messagesList.length);
          setMessages(messagesList);
          setFilteredMessages(messagesList);
        } else {
          const errorMsg =
            response.errorMessage ||
            response.ErrorMessage ||
            "Failed to load sent messages";
          console.error("Failed to load sent messages:", errorMsg);
          showSnackbar(errorMsg, "error");
        }
      } catch (error) {
        console.error("Error loading sent messages:", error);
        console.error("Error details:", error.response?.data || error.message);
        showSnackbar(
          error.response?.data?.message ||
            error.message ||
            "Error loading sent messages. Please try again.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    loadSentMessages();
  }, [isAuthenticated, user, navigate]);

  // Load specific message if action=V
  useEffect(() => {
    const loadMessageDetails = async () => {
      if (action === "V" && emailId) {
        try {
          const response = await sentEmailService.getMessageDetails(
            parseInt(emailId)
          );

          if (response.isSuccess || response.IsSuccess) {
            // Handle both camelCase and PascalCase response formats
            const messageDetails = {
              emailID:
                response.emailID || response.EmailID || parseInt(emailId),
              sendTo:
                searchParams.get("SendTo") ||
                response.sendTo ||
                response.SendTo ||
                "",
              sendFrom: "",
              subject:
                searchParams.get("Subject") ||
                response.subject ||
                response.Subject ||
                "",
              name:
                searchParams.get("Name") ||
                response.name ||
                response.Name ||
                "",
              sendBy:
                searchParams.get("Sendby") ||
                response.sendBy ||
                response.SendBy ||
                "",
              message: response.message || response.Message || "",
            };

            setSelectedMessage(messageDetails);
            setSendTo(messageDetails.sendTo);
            setSubject(messageDetails.subject);
            setMessageBody(messageDetails.message);
            setFormMode("view");
            setShowComposeForm(true);
          } else {
            const errorMsg =
              response.errorMessage ||
              response.ErrorMessage ||
              "Failed to load message details";
            showSnackbar(errorMsg, "error");
          }
        } catch (error) {
          console.error("Error loading message details:", error);
          showSnackbar(
            "Error loading message details. Please try again.",
            "error"
          );
        }
      }
    };

    loadMessageDetails();
  }, [action, emailId, searchParams]);

  // Implement search functionality
  const handleSearch = () => {
    let filtered = [...messages];

    if (searchBy !== "ALL" && searchTerm.trim()) {
      filtered = filtered.filter((message) => {
        let fieldValue = "";

        switch (searchBy) {
          case "FROM":
            fieldValue = message.sendFrom || message.SendFrom || "";
            break;
          case "TO":
            fieldValue = message.sendTo || message.SendTo || "";
            break;
          case "SUBJECT":
            fieldValue = message.subject || message.Subject || "";
            break;
          default:
            return true;
        }

        fieldValue = fieldValue.toString().toLowerCase();
        const search = searchTerm.toLowerCase();

        switch (searchCriteria) {
          case "equals":
            return fieldValue === search;
          case "contains":
            return fieldValue.includes(search);
          case "starts_with":
            return fieldValue.startsWith(search);
          default:
            return fieldValue.includes(search);
        }
      });
    }

    setFilteredMessages(filtered);
  };

  // Apply search when messages or search criteria change
  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, searchBy, searchCriteria, searchTerm]);

  // Handle view message
  const handleViewMessage = async (message) => {
    try {
      // Handle both camelCase and PascalCase for emailID
      const emailID =
        message.emailID ||
        message.EmailID ||
        message.messageID ||
        message.MessageID;
      const response = await sentEmailService.getMessageDetails(emailID);

      if (response.isSuccess || response.IsSuccess) {
        // Handle both camelCase and PascalCase response formats
        const messageDetails = {
          emailID: emailID,
          sendTo: message.sendTo || message.SendTo || "",
          sendFrom: message.sendFrom || message.SendFrom || "",
          subject: message.subject || message.Subject || "",
          name: message.name || message.Name || "",
          sendBy: message.sendBy || message.SendBy || "",
          message: response.message || response.Message || "",
        };

        setSelectedMessage(messageDetails);
        setSendTo(messageDetails.sendTo);
        setSubject(messageDetails.subject);
        setMessageBody(messageDetails.message);
        setFormMode("view");
        setShowComposeForm(true);
      } else {
        const errorMsg =
          response.errorMessage ||
          response.ErrorMessage ||
          "Failed to load message details";
        showSnackbar(errorMsg, "error");
      }
    } catch (error) {
      console.error("Error loading message details:", error);
      showSnackbar("Error loading message details. Please try again.", "error");
    }
  };

  // Handle close form
  const handleCloseForm = () => {
    setShowComposeForm(false);
    setSelectedMessage(null);
    setSubject("");
    setMessageBody("");
    setSendTo("");
    // Clear URL parameters
    navigate("/pstudyware/sentemail", { replace: true });
  };

  // Handle navigation to inbox
  const handleViewNewMessages = () => {
    navigate("/pstudyware/emailmanager");
  };

  // Handle close snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const showSnackbar = (message, severity = "info", vertical = "bottom") => {
    setSnackbar({ open: true, message, severity, vertical });
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {isStudent && <StudentHeader user={user} />}
      {/* Spacer to account for fixed StudentHeader */}
      {isStudent && <Box sx={{ height: "40px" }} />}
      <Container maxWidth="xl" sx={{ mt: isStudent ? 0 : 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          {/* Header */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Typography
              variant="subtitle1"
              component="h1"
              sx={{ fontSize: "1rem", fontWeight: 600 }}
            >
              <EmailIcon sx={{ mr: 1, verticalAlign: "middle" }} />
              Message Center - Sent Messages
            </Typography>
            <Box>
              <Button
                variant="contained"
                onClick={handleViewNewMessages}
                sx={{
                  backgroundColor: "#4caf50",
                  fontSize: "0.875rem",
                  textTransform: "none",
                  px: 2,
                  py: 0.75,
                  "&:hover": { backgroundColor: "#45a049" },
                }}
              >
                View New Messages
              </Button>
            </Box>
          </Box>

          {/* Search Bar */}
          <Box
            sx={{
              backgroundColor: "#4caf50",
              p: 0.5,
              borderRadius: 1,
              mb: 2,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              flexWrap: "wrap",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                sx={{
                  color: "white",
                  fontSize: "0.75rem",
                  whiteSpace: "nowrap",
                }}
              >
                Search By:
              </Typography>
              <Select
                value={searchBy}
                onChange={(e) => setSearchBy(e.target.value)}
                size="small"
                sx={{
                  color: "white",
                  fontSize: "0.75rem",
                  minWidth: 100,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "white",
                  },
                  "& .MuiSelect-icon": { color: "white" },
                }}
              >
                <MenuItem value="ALL" sx={{ fontSize: "0.75rem" }}>
                  -ALL-
                </MenuItem>
                <MenuItem value="FROM" sx={{ fontSize: "0.75rem" }}>
                  From
                </MenuItem>
                <MenuItem value="TO" sx={{ fontSize: "0.75rem" }}>
                  To
                </MenuItem>
                <MenuItem value="SUBJECT" sx={{ fontSize: "0.75rem" }}>
                  Subject
                </MenuItem>
              </Select>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                sx={{
                  color: "white",
                  fontSize: "0.75rem",
                  whiteSpace: "nowrap",
                }}
              >
                Criteria:
              </Typography>
              <Select
                value={searchCriteria}
                onChange={(e) => setSearchCriteria(e.target.value)}
                size="small"
                sx={{
                  color: "white",
                  fontSize: "0.75rem",
                  minWidth: 100,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "white",
                  },
                  "& .MuiSelect-icon": { color: "white" },
                }}
              >
                <MenuItem value="contains" sx={{ fontSize: "0.75rem" }}>
                  Contains
                </MenuItem>
                <MenuItem value="equals" sx={{ fontSize: "0.75rem" }}>
                  Equals
                </MenuItem>
                <MenuItem value="starts_with" sx={{ fontSize: "0.75rem" }}>
                  Starts With
                </MenuItem>
              </Select>
            </Box>

            <TextField
              size="small"
              placeholder="Search Text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                minWidth: 150,
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "white",
                  fontSize: "0.75rem",
                },
              }}
            />

            <Button
              variant="contained"
              size="small"
              onClick={handleSearch}
              sx={{
                backgroundColor: "white",
                color: "#4caf50",
                fontSize: "0.75rem",
                textTransform: "none",
                px: 2,
                "&:hover": { backgroundColor: "#f5f5f5" },
              }}
            >
              Find
            </Button>
          </Box>

          {/* Messages Table */}
          <TableContainer component={Paper} sx={{ mb: 2, width: "100%" }}>
            <Table sx={{ width: "100%", tableLayout: "fixed" }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#e8f5e8" }}>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      borderRight: "1px solid #4caf50",
                      width: "15%",
                      fontSize: "0.75rem",
                      padding: "3px 5px",
                    }}
                  >
                    Actions
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      borderRight: "1px solid #4caf50",
                      width: "20%",
                      fontSize: "0.75rem",
                      padding: "3px 5px",
                    }}
                  >
                    From
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      borderRight: "1px solid #4caf50",
                      width: "20%",
                      fontSize: "0.75rem",
                      padding: "3px 5px",
                    }}
                  >
                    To
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      borderRight: "1px solid #4caf50",
                      width: "20%",
                      fontSize: "0.75rem",
                      padding: "3px 5px",
                    }}
                  >
                    Subject
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      borderRight: "1px solid #4caf50",
                      width: "25%",
                      minWidth: "200px",
                      maxWidth: "400px",
                      fontSize: "0.75rem",
                      padding: "3px 5px",
                    }}
                  >
                    Message
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      borderRight: "1px solid #4caf50",
                      width: "15%",
                      fontSize: "0.75rem",
                      padding: "3px 5px",
                    }}
                  >
                    Message Date
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredMessages.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      align="center"
                      sx={{ fontSize: "0.75rem", padding: "3px 5px" }}
                    >
                      No messages found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMessages.map((message) => (
                    <TableRow
                      key={message.messageID}
                      sx={{
                        "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" },
                      }}
                    >
                      <TableCell
                        sx={{
                          borderRight: "1px solid #4caf50",
                          width: "15%",
                          fontSize: "0.75rem",
                          padding: "3px 5px",
                        }}
                      >
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleViewMessage(message)}
                          title="View"
                        >
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                      <TableCell
                        sx={{
                          borderRight: "1px solid #4caf50",
                          width: "20%",
                          fontSize: "0.75rem",
                          padding: "3px 5px",
                        }}
                      >
                        {message.sendFrom || message.SendFrom || ""}
                      </TableCell>
                      <TableCell
                        sx={{
                          borderRight: "1px solid #4caf50",
                          width: "20%",
                          fontSize: "0.75rem",
                          padding: "3px 5px",
                        }}
                      >
                        {message.sendTo || message.SendTo || ""}
                      </TableCell>
                      <TableCell
                        sx={{
                          borderRight: "1px solid #4caf50",
                          width: "20%",
                          fontSize: "0.75rem",
                          padding: "3px 5px",
                        }}
                      >
                        {message.subject || message.Subject || ""}
                      </TableCell>
                      <TableCell
                        sx={{
                          borderRight: "1px solid #4caf50",
                          width: "25%",
                          minWidth: "200px",
                          maxWidth: "400px",
                          fontSize: "0.75rem",
                          padding: "3px 5px",
                        }}
                        title={message.message || message.Message || ""}
                      >
                        <Box
                          sx={{
                            wordBreak: "break-word",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            width: "100%",
                          }}
                        >
                          {message.message || message.Message || ""}
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{
                          borderRight: "1px solid #4caf50",
                          width: "15%",
                          fontSize: "0.75rem",
                          padding: "3px 5px",
                        }}
                      >
                        {formatDate(message.sendDate || message.SendDate)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination Bar */}
          <Box
            sx={{
              backgroundColor: "#4caf50",
              p: 0.5,
              borderRadius: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 1.5,
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <IconButton
                size="small"
                sx={{ color: "white", padding: "2px" }}
                disabled={true}
              >
                <FirstPageIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                sx={{ color: "white", padding: "2px" }}
                disabled={true}
              >
                <PrevPageIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                sx={{ color: "white", padding: "2px" }}
                disabled={false}
              >
                <NextPageIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                sx={{ color: "white", padding: "2px" }}
                disabled={false}
              >
                <LastPageIcon fontSize="small" />
              </IconButton>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Typography sx={{ color: "white", fontSize: "0.75rem" }}>
                GoTo
              </Typography>
              <Select
                size="small"
                value={1}
                sx={{
                  color: "white",
                  minWidth: 50,
                  fontSize: "0.75rem",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "white",
                  },
                  "& .MuiSelect-icon": { color: "white" },
                }}
              >
                <MenuItem value={1} sx={{ fontSize: "0.75rem" }}>
                  1
                </MenuItem>
              </Select>
            </Box>

            <Typography sx={{ color: "white", fontSize: "0.75rem" }}>
              Page(s): 1 of 1
            </Typography>

            <Typography sx={{ color: "white", fontSize: "0.75rem" }}>
              Record(s): 1 - {filteredMessages.length} of{" "}
              {filteredMessages.length}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Typography sx={{ color: "white", fontSize: "0.75rem" }}>
                Go to Page Number:
              </Typography>
              <TextField
                size="small"
                type="number"
                value=""
                sx={{
                  width: 50,
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "white",
                    fontSize: "0.75rem",
                  },
                }}
                inputProps={{ min: 1, max: 1 }}
              />
              <Button
                size="small"
                variant="contained"
                sx={{
                  backgroundColor: "white",
                  color: "#4caf50",
                  fontSize: "0.75rem",
                  "&:hover": { backgroundColor: "#f5f5f5" },
                }}
              >
                Go
              </Button>
            </Box>
          </Box>

          {/* View Message Form */}
          {showComposeForm && (
            <Paper
              elevation={2}
              sx={{
                p: 2,
                pt: 2,
                pb: 2,
                mt: 2,
                backgroundColor: "#4CAF50",
                color: "white",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: "white", mb: 1.5 }}
              >
                View Sent Message
              </Typography>

              <Box
                sx={{
                  width: "100%",
                  maxWidth: "700px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                {/* To Field */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Typography
                    sx={{
                      color: "#424242",
                      fontSize: "0.95rem",
                      fontWeight: 500,
                      minWidth: "80px",
                      textAlign: "right",
                    }}
                  >
                    To:
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={sendTo}
                    disabled
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "white",
                        "& fieldset": {
                          borderColor: "#87CEEB",
                          borderWidth: 2,
                        },
                        "&:hover fieldset": {
                          borderColor: "#87CEEB",
                        },
                        "&.Mui-disabled fieldset": {
                          borderColor: "#87CEEB",
                        },
                      },
                    }}
                  />
                </Box>

                {/* Subject Field */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Typography
                    sx={{
                      color: "#424242",
                      fontSize: "0.95rem",
                      fontWeight: 500,
                      minWidth: "80px",
                      textAlign: "right",
                    }}
                  >
                    Subject:
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={subject}
                    disabled
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "white",
                        "& fieldset": {
                          borderColor: "#87CEEB",
                          borderWidth: 2,
                        },
                        "&:hover fieldset": {
                          borderColor: "#87CEEB",
                        },
                        "&.Mui-disabled fieldset": {
                          borderColor: "#87CEEB",
                        },
                      },
                    }}
                  />
                </Box>

                {/* Message Field */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 2,
                  }}
                >
                  <Typography
                    sx={{
                      color: "#424242",
                      fontSize: "0.95rem",
                      fontWeight: 500,
                      minWidth: "80px",
                      textAlign: "right",
                      pt: 1,
                    }}
                  >
                    Message:
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={6}
                    value={messageBody}
                    disabled
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "white",
                        "& fieldset": {
                          borderColor: "#87CEEB",
                          borderWidth: 2,
                        },
                        "&:hover fieldset": {
                          borderColor: "#87CEEB",
                        },
                        "&.Mui-disabled fieldset": {
                          borderColor: "#87CEEB",
                        },
                      },
                    }}
                  />
                </Box>

                {/* Close Button */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 1,
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={handleCloseForm}
                    size="large"
                    sx={{
                      borderColor: "white",
                      color: "white",
                      px: 4,
                      py: 1.5,
                      fontSize: "1rem",
                      fontWeight: 500,
                      borderRadius: 1,
                      "&:hover": {
                        borderColor: "white",
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                      },
                    }}
                  >
                    Close
                  </Button>
                </Box>
              </Box>
            </Paper>
          )}
        </Paper>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{
            vertical: snackbar.vertical || "bottom",
            horizontal: "center",
          }}
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
    </Box>
  );
};

export default SentEmail;
