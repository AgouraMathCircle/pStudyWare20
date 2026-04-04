import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Alert,
  Snackbar,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Reply as ReplyIcon,
  Send as SendIcon,
  Download as DownloadIcon,
  Email as EmailIcon,
  FirstPage as FirstPageIcon,
  KeyboardArrowLeft as PrevPageIcon,
  KeyboardArrowRight as NextPageIcon,
  LastPage as LastPageIcon,
} from "@mui/icons-material";
import { useAuth } from "../../../contexts/AuthContext";
import emailManagerService from "../../../services/emailManagerService";
import StudentHeader from "../Student/StudentHeader";

const EmailManager = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("ALL");
  const [searchCriteria, setSearchCriteria] = useState("contains");

  // Compose/Reply form state
  const [showComposeForm, setShowComposeForm] = useState(true);
  const [formMode, setFormMode] = useState("compose"); // 'compose' or 'reply' or 'view'
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Form fields
  const [sendTo, setSendTo] = useState("");
  const [subject, setSubject] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");

  // Dropdowns data
  const [emailGroups, setEmailGroups] = useState([]);
  const [studentList, setStudentList] = useState([]);

  // UI state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
    vertical: "top",
  });

  // Member type
  const memberType = user?.memberType?.toUpperCase() || "";
  const username = user?.email || user?.username || "";
  const firstName = user?.firstName || "";
  const chapterId = user?.chapterID || "1";

  // Load messages on mount
  useEffect(() => {
    loadMessages();
    if (memberType === "A") {
      loadEmailGroups();
    } else if (memberType === "I" || memberType === "V") {
      loadStudentList();
    }
  }, []);

  // Apply search when messages or search criteria change
  useEffect(() => {
    handleSearch();
  }, [messages, searchBy, searchCriteria, searchTerm]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const response = await emailManagerService.getMessages(username);
      if (response.isSuccess) {
        setMessages(response.messages || []);
        setFilteredMessages(response.messages || []);
      } else {
        showSnackbar(
          response.errorMessage || "Error loading messages",
          "error"
        );
      }
    } catch (error) {
      showSnackbar("Error loading messages: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const loadEmailGroups = async () => {
    try {
      const response = await emailManagerService.getInstructorEmailGroups(
        username
      );
      if (response.isSuccess) {
        setEmailGroups(response.emailGroups || []);
      }
    } catch (error) {
      console.error("Error loading email groups:", error);
    }
  };

  const loadStudentList = async () => {
    try {
      const response = await emailManagerService.getStudentListForEmail({
        username,
        memberType: "I",
      });
      if (response.isSuccess) {
        setStudentList(response.students || []);
      }
    } catch (error) {
      console.error("Error loading student list:", error);
    }
  };

  const handleViewMessage = async (message) => {
    try {
      // First, populate with available data from the table row (including message column data)
      setSubject(message.subject || "");
      setSendTo(message.sendFrom || "");
      setMessageBody(message.message || message.Message || "");
      setFormMode("view");
      setShowComposeForm(true);

      // Scroll to the form section
      setTimeout(() => {
        const formElement = document.getElementById("compose-form-section");
        if (formElement) {
          formElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);

      // Fetch full message details to get complete message body (in case table has truncated version)
      try {
        const response = await emailManagerService.getMessage(message.messageID || message.messageid || message.MessageID);
        if (response.isSuccess && response.message) {
          setSelectedMessage(response.message);
          setSubject(response.message.subject || message.subject || "");
          // Use API response message body if available, otherwise keep table row data
          setMessageBody(response.message.message || message.message || message.Message || "");
          setSendTo(response.message.sendFrom || message.sendFrom || "");
        } else if (response.message) {
          // Handle case where response.message might be at root level
          setSelectedMessage(response.message);
          setSubject(response.message.subject || message.subject || "");
          setMessageBody(response.message.message || message.message || message.Message || "");
          setSendTo(response.message.sendFrom || message.sendFrom || "");
        } else {
          // If API doesn't return message body, use table row data (already set above)
          setSelectedMessage(message);
        }
      } catch (apiError) {
        // If API call fails, keep the table row data we already set
        setSelectedMessage(message);
        console.error("Error fetching full message details:", apiError);
      }
    } catch (error) {
      // Even if everything fails, show what we have from the table
      console.error("Error loading message details:", error);
      showSnackbar("Displaying message from table. Full details may be limited.", "warning");
    }
  };

  const handleReplyMessage = (message) => {
    setSelectedMessage(message);
    setSubject(message.subject);
    setMessageBody("");
    setSendTo(message.sendFrom);
    setFormMode("reply");
    setShowComposeForm(true);
  };

  const handleDeleteMessage = async (message) => {
    if (window.confirm("Do you want to delete this email?")) {
      try {
        const response = await emailManagerService.updateMessageStatus({
          trackingID: message.trackingID,
          mode: "T",
          sendTo: username,
        });
        if (response.isSuccess) {
          showSnackbar("Message deleted successfully", "success");
          loadMessages();
        } else {
          showSnackbar(
            response.errorMessage || "Error deleting message",
            "error"
          );
        }
      } catch (error) {
        showSnackbar("Error deleting message: " + error.message, "error");
      }
    }
  };

  const handleSendMessage = async () => {
    try {
      if (!subject || !messageBody) {
        showSnackbar("Please fill in subject and message", "warning");
        return;
      }

      let finalSendTo = sendTo;
      let finalSendBy = "";
      let finalFromName = firstName;

      // Determine sendTo based on member type
      if (memberType === "A") {
        if (formMode === "reply") {
          finalSendTo = sendTo;
          finalSendBy = selectedMessage?.sendBy || "";
        } else {
          finalSendTo = selectedClass;
        }
      } else if (memberType === "I" || memberType === "V") {
        if (formMode === "reply") {
          finalSendTo = sendTo;
          finalSendBy = selectedMessage?.sendBy || "";
        } else {
          const studentInfo = selectedStudent.split("~");
          finalSendTo = studentInfo[0];
          finalSendBy = studentInfo[1] || "";
          finalFromName =
            studentList.find((s) => s.value === selectedStudent)?.text ||
            firstName;
        }
      } else if (memberType === "S") {
        if (formMode === "reply") {
          finalSendTo = sendTo;
          finalSendBy = selectedMessage?.sendBy || "";
          finalFromName = selectedMessage?.senderName || "";
        }
      }

      const request = {
        sendTo: finalSendTo,
        sendFrom: username,
        subject: subject,
        message: messageBody,
        sendBy: finalSendBy,
        replyToEmailID:
          formMode === "reply" ? selectedMessage?.messageID : null,
        mode: formMode === "reply" ? "R" : "N",
        chapterID: chapterId,
        memberType: memberType,
        fromName: finalFromName,
      };

      const response = await emailManagerService.sendMessage(request);
      if (response.isSuccess) {
        showSnackbar(
          response.message || "Message sent successfully",
          "success"
        );
        resetForm();
        loadMessages();
      } else {
        showSnackbar(response.errorMessage || "Error sending message", "error");
      }
    } catch (error) {
      showSnackbar("Error sending message: " + error.message, "error");
    }
  };

  const handleExportToExcel = async () => {
    try {
      const blob = await emailManagerService.exportMessagesToExcel(username);

      // Create a proper Excel file download
      // Since backend returns HTML content, use .xls extension with proper MIME type
      // Excel will open HTML files with .xls extension if MIME type is correct
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      // Use .xls extension - Excel will open HTML content with this extension
      link.setAttribute("download", "MessageCenter.xls");
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();

      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);

      showSnackbar("Messages exported successfully", "success", "top");
    } catch (error) {
      showSnackbar("Error exporting messages: " + error.message, "error");
    }
  };

  const resetForm = () => {
    setFormMode("compose");
    setSelectedMessage(null);
    setSubject("");
    setMessageBody("");
    setSendTo("");
    setSelectedClass("");
    setSelectedStudent("");
  };

  const clearMessageFields = () => {
    setSubject("");
    setMessageBody("");
  };

  const showSnackbar = (message, severity = "info", vertical = "top") => {
    setSnackbar({ open: true, message, severity, vertical });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  // Implement search functionality
  const handleSearch = () => {
    let filtered = [...messages];

    if (searchBy !== "ALL" && searchTerm.trim()) {
      filtered = filtered.filter((message) => {
        let fieldValue = "";

        switch (searchBy) {
          case "FROM":
            fieldValue = message.sendFrom || "";
            break;
          case "SUBJECT":
            fieldValue = message.subject || "";
            break;
          case "STATUS":
            fieldValue = message.status || "";
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
            return fieldValue.includes(search); // Default to contains
        }
      });
    }

    setFilteredMessages(filtered);
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

  const isStudent =
    user?.role === "Student" || user?.memberType?.toUpperCase() === "S";

  const isStudentMessageCenter =
    location.pathname === "/pstudyware/student/message-center";
  const isRoleDashboardShell =
    location.pathname.startsWith("/pstudyware/instructor/") ||
    location.pathname.startsWith("/pstudyware/volunteer/");

  const shouldShowStudentHeader =
    (isStudent || isStudentMessageCenter) && !isRoleDashboardShell;

  const containerTopMargin =
    shouldShowStudentHeader || isRoleDashboardShell ? 0 : 4;

  return (
    <Box>
      {shouldShowStudentHeader && <StudentHeader user={user} />}
      {/* Spacer to account for fixed StudentHeader */}
      {shouldShowStudentHeader && <Box sx={{ height: "40px" }} />}
      <Container maxWidth="xl" sx={{ mt: containerTopMargin, mb: 4 }}>
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
              Message Center - New Messages
            </Typography>
            <Box>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={handleExportToExcel}
                sx={{
                  mr: 1,
                  backgroundColor: "#4caf50",
                  fontSize: "0.875rem",
                  textTransform: "none",
                  px: 2,
                  py: 0.75,
                  "&:hover": { backgroundColor: "#45a049" },
                }}
              >
                Export Excel
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate("/pstudyware/sentemail")}
                sx={{
                  backgroundColor: "#4caf50",
                  fontSize: "0.875rem",
                  textTransform: "none",
                  px: 2,
                  py: 0.75,
                  "&:hover": { backgroundColor: "#45a049" },
                }}
              >
                View Sent Messages
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
                <MenuItem value="SUBJECT" sx={{ fontSize: "0.75rem" }}>
                  Subject
                </MenuItem>
                <MenuItem value="STATUS" sx={{ fontSize: "0.75rem" }}>
                  Status
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
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      width: "10%",
                      fontSize: "0.75rem",
                      padding: "3px 5px",
                    }}
                  >
                    Status
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
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="secondary"
                          onClick={() => handleReplyMessage(message)}
                          title="Reply"
                        >
                          <ReplyIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteMessage(message)}
                          title="Delete"
                        >
                          <DeleteIcon fontSize="small" />
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
                        {message.sendFrom}
                      </TableCell>
                      <TableCell
                        sx={{
                          borderRight: "1px solid #4caf50",
                          width: "20%",
                          fontSize: "0.75rem",
                          padding: "3px 5px",
                        }}
                      >
                        {message.subject}
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
                        {formatDate(message.sendDate)}
                      </TableCell>
                      <TableCell
                        sx={{
                          width: "10%",
                          fontSize: "0.75rem",
                          padding: "3px 5px",
                        }}
                      >
                        {message.status}
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
              Record(s): 1 - 1 of 1
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

          {/* Compose/Reply Form */}
          {showComposeForm && (
            <Paper
              id="compose-form-section"
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
                {formMode === "view"
                  ? "View Message"
                  : formMode === "reply"
                  ? "Reply to Message"
                  : "Compose New Message"}
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
                {/* From Field */}
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
                    From:
                  </Typography>
                  {formMode === "view" || formMode === "reply" ? (
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
                  ) : memberType === "A" ? (
                    <FormControl fullWidth variant="outlined">
                      <Select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        displayEmpty
                        sx={{
                          backgroundColor: "white",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#87CEEB",
                            borderWidth: 2,
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#87CEEB",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#87CEEB",
                          },
                        }}
                      >
                        <MenuItem value="" disabled>
                          Select Class
                        </MenuItem>
                        {emailGroups.map((group) => (
                          <MenuItem key={group.value} value={group.value}>
                            {group.text}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ) : memberType === "I" || memberType === "V" ? (
                    <FormControl fullWidth variant="outlined">
                      <Select
                        value={selectedStudent}
                        onChange={(e) => setSelectedStudent(e.target.value)}
                        displayEmpty
                        sx={{
                          backgroundColor: "white",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#87CEEB",
                            borderWidth: 2,
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#87CEEB",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#87CEEB",
                          },
                        }}
                      >
                        <MenuItem value="" disabled>
                          Select Student
                        </MenuItem>
                        {studentList.map((student) => (
                          <MenuItem key={student.value} value={student.value}>
                            {student.text}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ) : (
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={
                        user?.firstName && user?.lastName
                          ? `${user.firstName} ${user.lastName}`
                          : firstName
                      }
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
                  )}
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
                    onChange={(e) => setSubject(e.target.value)}
                    disabled={formMode === "view"}
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
                        "&.Mui-focused fieldset": {
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
                    onChange={(e) => setMessageBody(e.target.value)}
                    disabled={formMode === "view"}
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
                        "&.Mui-focused fieldset": {
                          borderColor: "#87CEEB",
                        },
                      },
                    }}
                  />
                </Box>

                {/* Send Button */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 2,
                    mt: 1,
                  }}
                >
                  {formMode !== "view" && (
                    <>
                      <Button
                        variant="outlined"
                        onClick={clearMessageFields}
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
                        Clear
                      </Button>
                      <Button
                        variant="contained"
                        onClick={handleSendMessage}
                        size="large"
                        sx={{
                          backgroundColor: "#2E7D32",
                          color: "white",
                          px: 4,
                          py: 1.5,
                          fontSize: "1rem",
                          fontWeight: 500,
                          borderRadius: 1,
                          "&:hover": {
                            backgroundColor: "#1B5E20",
                          },
                        }}
                      >
                        Send
                      </Button>
                    </>
                  )}
                  {formMode === "view" && (
                    <Button
                      variant="outlined"
                      onClick={resetForm}
                      size="large"
                      sx={{
                        borderColor: "white",
                        color: "white",
                        px: 4,
                        py: 1.5,
                        fontSize: "1rem",
                        "&:hover": {
                          borderColor: "white",
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                        },
                      }}
                    >
                      Close
                    </Button>
                  )}
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
            vertical: snackbar.vertical || "top",
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

export default EmailManager;
