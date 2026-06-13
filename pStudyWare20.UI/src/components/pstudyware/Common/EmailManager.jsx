import React, { useState, useEffect, useRef, useMemo } from "react";
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
  Tooltip,
} from "@mui/material";
import {
  Send as SendIcon,
  Download as DownloadIcon,
  Email as EmailIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  Reply as ReplyIcon,
  Visibility as VisibilityIcon,
  FirstPage as FirstPageIcon,
  KeyboardArrowLeft as PrevPageIcon,
  KeyboardArrowRight as NextPageIcon,
  LastPage as LastPageIcon,
} from "@mui/icons-material";
import { useAuth } from "../../../contexts/AuthContext";
import emailManagerService from "../../../services/emailManagerService";
import StudentHeader from "../Student/StudentHeader";
import AdminHeader from "../Admin/AdminHeader";
import AdminSessionListPagination from "../Admin/AdminSessionListPagination";
import { getPortalUsername } from "../../../utils/portalUsername";
import {
  getMessagePreview,
  getMessageFieldValue,
  sortRows,
} from "../../../utils/tableSort";
import SortableHeader from "./SortableHeader";
import AppConfirmDialog from "./AppConfirmDialog";
import {
  portalPaperAntiLiftSx,
  APPLICATION_SURFACE_BG,
  APPLICATION_SURFACE_BORDER,
  adminSessionListEmptyCellSx,
  adminSessionListEmptyTextSx,
  adminSessionListFindButtonSx,
  adminSessionListGridTableSx,
  adminSessionListHeaderBarSx,
  adminSessionListMenuItemSx,
  adminSessionListPanelCardSx,
  adminSessionListPanelContentSx,
  adminSessionListSearchBarSx,
  adminSessionListSearchFieldSx,
  adminSessionListSearchLabelSx,
  adminSessionListSearchSelectSx,
  adminSessionListTableActionLinkSx,
  adminSessionListTableBodyCellSx,
  adminSessionListTableBodyRowSx,
  adminSessionListTableContainerSx,
  adminSessionListTableHeadCellSx,
  adminSessionListTableHeadRowSx,
  adminSessionListTitleSx,
  adminSessionListToolbarButtonSx,
} from "../styles/applicationSurfaces";
import {
  PORTAL_MODAL_FG,
  portalModalActionsSx,
  portalModalClearButtonSx,
  portalModalContentSx,
  portalModalFieldSx,
  portalModalPaperSx,
  portalModalSendButtonSx,
  portalModalTitleSx,
} from "./portalModalStyles";

const getEmailTrackingId = (message) => {
  const id =
    message?.trackingID ??
    message?.TrackingID ??
    message?.emailID ??
    message?.EmailID;
  const parsed = Number(id);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

const MESSAGE_TABLE_COLUMN_WIDTHS = {
  actions: 128,
  messageDate: 136,
  status: 84,
};

const messageListColumnWidths = {
  actions: "10%",
  from: "16%",
  subject: "16%",
  messageDate: "12%",
  status: "8%",
};

const messageTableCellBaseSx = {
  fontSize: "0.75rem",
  padding: "3px 5px",
  borderRight: "1px solid #4caf50",
};

const messageTableActionsCellSx = {
  ...messageTableCellBaseSx,
  width: MESSAGE_TABLE_COLUMN_WIDTHS.actions,
  minWidth: MESSAGE_TABLE_COLUMN_WIDTHS.actions,
  maxWidth: MESSAGE_TABLE_COLUMN_WIDTHS.actions,
  whiteSpace: "nowrap",
};

const messageTableDateCellSx = {
  ...messageTableCellBaseSx,
  width: MESSAGE_TABLE_COLUMN_WIDTHS.messageDate,
  minWidth: MESSAGE_TABLE_COLUMN_WIDTHS.messageDate,
  maxWidth: MESSAGE_TABLE_COLUMN_WIDTHS.messageDate,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const messageTableStatusCellSx = {
  ...messageTableCellBaseSx,
  width: MESSAGE_TABLE_COLUMN_WIDTHS.status,
  minWidth: MESSAGE_TABLE_COLUMN_WIDTHS.status,
  maxWidth: MESSAGE_TABLE_COLUMN_WIDTHS.status,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  borderRight: "none",
};

const EmailManager = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [messageBodyLoading, setMessageBodyLoading] = useState(false);
  const inboxLoadRef = useRef(0);
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("ALL");
  const [searchCriteria, setSearchCriteria] = useState("contains");
  const [sortField, setSortField] = useState("messageDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [goToPageInput, setGoToPageInput] = useState("1");

  const pageSize = 25;

  // Compose/Reply/View modal state
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [formMode, setFormMode] = useState("compose"); // 'compose' | 'reply' | 'view'
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Form fields
  const [sendTo, setSendTo] = useState("");
  const [subject, setSubject] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [deletingMessage, setDeletingMessage] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [composeValidationAttempted, setComposeValidationAttempted] =
    useState(false);

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
  const username = getPortalUsername(user);
  const firstName = user?.firstName || "";
  const chapterId = user?.chapterID || "1";

  const composeRecipientError = useMemo(() => {
    if (formMode === "view") {
      return "";
    }
    if (formMode === "reply") {
      return sendTo?.trim() ? "" : "Recipient is required";
    }
    if (memberType === "A") {
      return selectedClass ? "" : "Please select a class to send to";
    }
    if (memberType === "I" || memberType === "V" || memberType === "S") {
      if (selectedStudent) {
        return "";
      }
      return memberType === "S"
        ? "Please select an instructor to send to"
        : "Please select a student to send to";
    }
    return "";
  }, [
    formMode,
    memberType,
    sendTo,
    selectedClass,
    selectedStudent,
  ]);

  const composeSubjectError =
    composeValidationAttempted && !subject.trim()
      ? "Subject is required"
      : "";
  const composeMessageError =
    composeValidationAttempted && !messageBody.trim()
      ? "Message is required"
      : "";
  const composeRecipientFieldError =
    composeValidationAttempted ? composeRecipientError : "";

  const isComposeFormValid =
    formMode !== "view" &&
    !composeRecipientError &&
    subject.trim().length > 0 &&
    messageBody.trim().length > 0;

  const fetchInbox = async (portalUsername) => {
    const loadId = ++inboxLoadRef.current;
    setMessagesLoading(true);
    setLoadError(null);

    try {
      const response = await emailManagerService.getMessages(portalUsername);
      if (loadId !== inboxLoadRef.current) {
        return;
      }

      const list = response?.messages ?? response?.Messages ?? [];
      const explicitFailure =
        response?.isSuccess === false || response?.IsSuccess === false;
      const success =
        !explicitFailure &&
        (response?.isSuccess === true ||
          response?.IsSuccess === true ||
          Array.isArray(list));

      if (success) {
        setMessages(list);
        setFilteredMessages(list);
      } else {
        const errorMsg =
          response?.errorMessage ||
          response?.ErrorMessage ||
          "Error loading messages";
        setLoadError(errorMsg);
        showSnackbar(errorMsg, "error");
      }
    } catch (error) {
      if (loadId !== inboxLoadRef.current) {
        return;
      }
      const errorMsg = error.message || "Error loading messages";
      setLoadError(errorMsg);
      showSnackbar(errorMsg, "error");
    } finally {
      if (loadId === inboxLoadRef.current) {
        setMessagesLoading(false);
      }
    }
  };

  // Load inbox when portal username is available
  useEffect(() => {
    if (!username) {
      setMessagesLoading(false);
      return;
    }

    fetchInbox(username);
  }, [username]);

  // Load compose dropdowns separately (do not block inbox reload)
  useEffect(() => {
    if (!username) {
      return;
    }

    if (memberType === "A") {
      loadEmailGroups();
    } else if (memberType === "I" || memberType === "V" || memberType === "S") {
      loadStudentList();
    }
  }, [username, memberType]);

  // Apply search when messages or search criteria change
  useEffect(() => {
    handleSearch();
  }, [messages, searchBy, searchCriteria, searchTerm]);

  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortField(field);
    setCurrentPage(1);
    setGoToPageInput("1");
  };

  const sortedMessages = useMemo(
    () => sortRows(filteredMessages, sortField, sortOrder, getMessageFieldValue),
    [filteredMessages, sortField, sortOrder]
  );

  const totalRecords = sortedMessages.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 0;
  const paginatedMessages = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedMessages.slice(start, start + pageSize);
  }, [sortedMessages, currentPage, pageSize]);

  useEffect(() => {
    if (totalPages === 0) {
      if (currentPage !== 1) {
        setCurrentPage(1);
        setGoToPageInput("1");
      }
      return;
    }
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
      setGoToPageInput(String(totalPages));
    }
  }, [currentPage, totalPages]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setGoToPageInput(String(page));
    }
  };

  const handleGoToPage = () => {
    const page = parseInt(goToPageInput, 10);
    if (!Number.isNaN(page) && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    } else {
      setGoToPageInput(String(currentPage));
    }
  };

  const loadMessages = async () => {
    if (!username) return;
    await fetchInbox(username);
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
    const trackingId = getEmailTrackingId(message);
    const rowBody = message.message || message.Message || "";

    setSubject(message.subject || message.Subject || "");
    setSendTo(message.sendFrom || message.SendFrom || "");
    setMessageBody(rowBody);
    setSelectedMessage(message);
    setFormMode("view");
    setMessageModalOpen(true);

    if (rowBody.trim()) {
      return;
    }

    if (!trackingId) {
      showSnackbar("Unable to load message details (missing message ID).", "error");
      return;
    }

    setMessageBodyLoading(true);
    try {
      const response = await emailManagerService.getMessage(trackingId);
      const success = response?.isSuccess ?? response?.IsSuccess;
      const body =
        response?.message?.message ??
        response?.message?.Message ??
        response?.Message?.message ??
        response?.Message?.Message ??
        "";

      if (success && body) {
        setMessageBody(body);
        setSelectedMessage({ ...message, message: body, Message: body });
      } else if (!success) {
        showSnackbar(
          response?.errorMessage ||
            response?.ErrorMessage ||
            "Unable to load message body.",
          "error"
        );
      }
    } catch (error) {
      showSnackbar("Error loading message: " + error.message, "error");
    } finally {
      setMessageBodyLoading(false);
    }
  };

  const handleReplyMessage = (message) => {
    setSelectedMessage(message);
    setSubject(message.subject);
    setMessageBody("");
    setSendTo(message.sendFrom);
    setFormMode("reply");
    setMessageModalOpen(true);
  };

  const handleDeleteMessage = (message) => {
    setMessageToDelete(message);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirmClose = () => {
    if (deletingMessage) {
      return;
    }
    setDeleteConfirmOpen(false);
    setMessageToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!messageToDelete) {
      return;
    }

    const deletedId = getEmailTrackingId(messageToDelete);
    if (!deletedId) {
      showSnackbar("Unable to delete message (missing message ID).", "error");
      return;
    }

    try {
      setDeletingMessage(true);
      const response = await emailManagerService.updateMessageStatus({
        trackingID: deletedId,
        mode: "T",
        sendTo: username,
      });

      const success = response?.isSuccess === true || response?.IsSuccess === true;
      if (success) {
        const removeDeleted = (list) =>
          list.filter((item) => getEmailTrackingId(item) !== deletedId);

        setMessages(removeDeleted);
        setFilteredMessages(removeDeleted);
        showSnackbar(
          response.message ||
            response.Message ||
            "Message deleted successfully",
          "success"
        );
        setDeleteConfirmOpen(false);
        setMessageToDelete(null);
      } else {
        showSnackbar(
          response?.errorMessage ||
            response?.ErrorMessage ||
            "Error deleting message",
          "error"
        );
      }
    } catch (error) {
      showSnackbar(
        error.response?.data?.message ||
          error.response?.data?.errorMessage ||
          error.message ||
          "Error deleting message",
        "error"
      );
    } finally {
      setDeletingMessage(false);
    }
  };

  const handleSendMessage = async () => {
    if (sendingMessage) {
      return;
    }

    setComposeValidationAttempted(true);

    if (!isComposeFormValid) {
      showSnackbar("Please complete all required fields before sending.", "warning");
      return;
    }

    let finalSendTo = sendTo;
    let finalSendBy = "";
    let finalFromName = firstName;

    try {
      // Determine sendTo based on member type
      if (memberType === "A") {
        if (formMode === "reply") {
          finalSendTo = sendTo;
          finalSendBy = selectedMessage?.sendBy || "";
        } else {
          finalSendTo = selectedClass;
        }
      } else if (memberType === "I" || memberType === "V" || memberType === "S") {
        if (formMode === "reply") {
          finalSendTo = sendTo;
          finalSendBy = selectedMessage?.sendBy || "";
          if (memberType === "S") {
            finalFromName = selectedMessage?.senderName || finalFromName;
          }
        } else {
          const studentInfo = selectedStudent.split("~");
          finalSendTo = studentInfo[0];
          finalSendBy = studentInfo[1] || "";
          finalFromName =
            studentList.find((s) => s.value === selectedStudent)?.text ||
            firstName;
        }
      }

      const request = {
        sendTo: finalSendTo,
        sendFrom: username || undefined,
        subject: subject.trim(),
        message: messageBody.trim(),
        sendBy: finalSendBy,
        replyToEmailID:
          formMode === "reply" ? getEmailTrackingId(selectedMessage) : null,
        mode: formMode === "reply" ? "R" : "N",
        chapterID: chapterId,
        memberType: memberType,
        fromName: finalFromName,
      };

      setSendingMessage(true);
      const response = await emailManagerService.sendMessage(request);
      if (response.isSuccess || response.IsSuccess) {
        showSnackbar(
          response.message ||
            response.Message ||
            "Your message has been sent successfully",
          "success"
        );
        closeMessageModal();
        loadMessages();
      } else {
        showSnackbar(
          response.errorMessage ||
            response.ErrorMessage ||
            "Error sending message",
          "error"
        );
      }
    } catch (error) {
      showSnackbar(
        error.response?.data?.message ||
          error.response?.data?.errorMessage ||
          error.message ||
          "Error sending message",
        "error"
      );
    } finally {
      setSendingMessage(false);
    }
  };

  const handleExportToExcel = async () => {
    try {
      await emailManagerService.exportMessagesToExcel(username);
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
    setComposeValidationAttempted(false);
    setSendingMessage(false);
  };

  const closeMessageModal = () => {
    if (sendingMessage) {
      return;
    }
    setMessageModalOpen(false);
    resetForm();
  };

  const handleOpenCompose = () => {
    resetForm();
    setFormMode("compose");
    setMessageModalOpen(true);
  };

  const getMessageModalTitle = () => {
    if (formMode === "view") return "View Message";
    if (formMode === "reply") return "Reply to Message";
    return "Compose New Message";
  };

  const getMessageModalIcon = () => {
    const iconSx = { fontSize: 20 };
    if (formMode === "view") return <VisibilityIcon sx={iconSx} />;
    if (formMode === "reply") return <ReplyIcon sx={iconSx} />;
    return <SendIcon sx={iconSx} />;
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
    setCurrentPage(1);
    setGoToPageInput("1");
  };

  const isStudent =
    user?.role === "Student" || user?.memberType?.toUpperCase() === "S";

  const isStudentMessageCenter =
    location.pathname === "/pstudyware/student/message-center";
  const isRoleDashboardShell =
    location.pathname.startsWith("/pstudyware/instructor/") ||
    location.pathname.startsWith("/pstudyware/volunteer/");

  const shouldShowStudentHeader =
    (isStudent || isStudentMessageCenter) && !isRoleDashboardShell;

  const isAdminMessageCenter =
    user?.memberType?.toUpperCase() === "A" &&
    (location.pathname === "/pstudyware/admin/message-center" ||
      location.pathname === "/admin/message-center");

  const useSessionListTableUi =
    isAdminMessageCenter || isStudentMessageCenter;

  const containerTopMargin =
    shouldShowStudentHeader ||
    isRoleDashboardShell ||
    useSessionListTableUi
      ? 0
      : 4;

  const legacySearchBarSx = {
    backgroundColor: "#4caf50",
    p: 0.5,
    borderRadius: 1,
    mb: 2,
    display: "flex",
    alignItems: "center",
    gap: 1.5,
    flexWrap: "wrap",
  };

  const legacySearchLabelSx = {
    color: "white",
    fontSize: "0.75rem",
    whiteSpace: "nowrap",
  };

  const legacySearchSelectSx = {
    color: "white",
    fontSize: "0.75rem",
    minWidth: 100,
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
    "& .MuiSelect-icon": { color: "white" },
  };

  const legacySearchFieldSx = {
    minWidth: 150,
    "& .MuiOutlinedInput-root": {
      backgroundColor: "white",
      fontSize: "0.75rem",
    },
  };

  const legacyFindButtonSx = {
    backgroundColor: "white",
    color: "#4caf50",
    fontSize: "0.75rem",
    textTransform: "none",
    px: 2,
    "&:hover": { backgroundColor: "#f5f5f5" },
  };

  const legacyMenuItemSx = { fontSize: "0.75rem" };

  return (
    <Box>
      {isAdminMessageCenter && <AdminHeader user={user} />}
      {isAdminMessageCenter && <Box sx={{ height: "48px" }} aria-hidden />}
      {shouldShowStudentHeader && <StudentHeader user={user} />}
      {/* Spacer to account for fixed StudentHeader */}
      {shouldShowStudentHeader && <Box sx={{ height: "48px" }} />}
      <Container maxWidth="xl" sx={{ mt: containerTopMargin, mb: 4 }}>
        <Paper
          elevation={useSessionListTableUi ? 0 : 3}
          sx={
            useSessionListTableUi
              ? adminSessionListPanelCardSx
              : { p: 3, ...portalPaperAntiLiftSx }
          }
        >
          <Box sx={useSessionListTableUi ? adminSessionListPanelContentSx : undefined}>
          {/* Header */}
          <Box
            sx={
              useSessionListTableUi
                ? adminSessionListHeaderBarSx
                : {
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }
            }
          >
            <Typography
              variant="subtitle1"
              component="h1"
              sx={
useSessionListTableUi
            ? adminSessionListTitleSx
                  : {
                      fontSize: "1rem",
                      fontWeight: 600,
                    }
              }
            >
              {!useSessionListTableUi && (
                <EmailIcon sx={{ mr: 1, verticalAlign: "middle" }} />
              )}
              Message Center - New Messages
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Button
                variant="contained"
                color={useSessionListTableUi ? "success" : undefined}
                size={useSessionListTableUi ? "small" : "medium"}
                startIcon={<SendIcon />}
                onClick={handleOpenCompose}
                sx={
                  useSessionListTableUi
                    ? adminSessionListToolbarButtonSx
                    : {
                        backgroundColor: "#4caf50",
                        fontSize: "0.875rem",
                        textTransform: "none",
                        px: 2,
                        py: 0.75,
                        "&:hover": { backgroundColor: "#45a049" },
                      }
                }
              >
                Compose
              </Button>
              <Button
                variant="contained"
                color={useSessionListTableUi ? "success" : undefined}
                size={useSessionListTableUi ? "small" : "medium"}
                startIcon={<DownloadIcon />}
                onClick={handleExportToExcel}
                sx={
                  useSessionListTableUi
                    ? adminSessionListToolbarButtonSx
                    : {
                        backgroundColor: "#4caf50",
                        fontSize: "0.875rem",
                        textTransform: "none",
                        px: 2,
                        py: 0.75,
                        "&:hover": { backgroundColor: "#45a049" },
                      }
                }
              >
                Export to Excel
              </Button>
              <Button
                variant="contained"
                color={useSessionListTableUi ? "success" : undefined}
                size={useSessionListTableUi ? "small" : "medium"}
                onClick={() => navigate("/pstudyware/sentemail")}
                sx={
                  useSessionListTableUi
                    ? adminSessionListToolbarButtonSx
                    : {
                        backgroundColor: "#4caf50",
                        fontSize: "0.875rem",
                        textTransform: "none",
                        px: 2,
                        py: 0.75,
                        "&:hover": { backgroundColor: "#45a049" },
                      }
                }
              >
                View Sent Messages
              </Button>
            </Box>
          </Box>

          {/* Search Bar */}
          <Box
            sx={
              useSessionListTableUi ? adminSessionListSearchBarSx : legacySearchBarSx
            }
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: useSessionListTableUi ? 0.5 : 1,
              }}
            >
              <Typography
                sx={
                  useSessionListTableUi
                    ? adminSessionListSearchLabelSx
                    : legacySearchLabelSx
                }
              >
                Search By:
              </Typography>
              <Select
                value={searchBy}
                onChange={(e) => setSearchBy(e.target.value)}
                size="small"
                sx={
                  useSessionListTableUi
                    ? adminSessionListSearchSelectSx
                    : legacySearchSelectSx
                }
              >
                <MenuItem
                  value="ALL"
                  sx={
useSessionListTableUi
            ? adminSessionListMenuItemSx
                      : legacyMenuItemSx
                  }
                >
                  -ALL-
                </MenuItem>
                <MenuItem
                  value="FROM"
                  sx={
useSessionListTableUi
            ? adminSessionListMenuItemSx
                      : legacyMenuItemSx
                  }
                >
                  From
                </MenuItem>
                <MenuItem
                  value="SUBJECT"
                  sx={
useSessionListTableUi
            ? adminSessionListMenuItemSx
                      : legacyMenuItemSx
                  }
                >
                  Subject
                </MenuItem>
                <MenuItem
                  value="STATUS"
                  sx={
useSessionListTableUi
            ? adminSessionListMenuItemSx
                      : legacyMenuItemSx
                  }
                >
                  Status
                </MenuItem>
              </Select>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: useSessionListTableUi ? 0.5 : 1,
              }}
            >
              <Typography
                sx={
                  useSessionListTableUi
                    ? adminSessionListSearchLabelSx
                    : legacySearchLabelSx
                }
              >
                Criteria:
              </Typography>
              <Select
                value={searchCriteria}
                onChange={(e) => setSearchCriteria(e.target.value)}
                size="small"
                sx={
                  useSessionListTableUi
                    ? adminSessionListSearchSelectSx
                    : legacySearchSelectSx
                }
              >
                <MenuItem
                  value="contains"
                  sx={
useSessionListTableUi
            ? adminSessionListMenuItemSx
                      : legacyMenuItemSx
                  }
                >
                  Contains
                </MenuItem>
                <MenuItem
                  value="equals"
                  sx={
useSessionListTableUi
            ? adminSessionListMenuItemSx
                      : legacyMenuItemSx
                  }
                >
                  Equals
                </MenuItem>
                <MenuItem
                  value="starts_with"
                  sx={
useSessionListTableUi
            ? adminSessionListMenuItemSx
                      : legacyMenuItemSx
                  }
                >
                  Starts With
                </MenuItem>
              </Select>
            </Box>

            <TextField
              size="small"
              placeholder="Search Text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={
useSessionListTableUi
            ? adminSessionListSearchFieldSx
                  : legacySearchFieldSx
              }
            />

            <Button
              variant="contained"
              size="small"
              onClick={handleSearch}
              sx={
useSessionListTableUi
            ? adminSessionListFindButtonSx
                  : legacyFindButtonSx
              }
            >
              Find
            </Button>
          </Box>

          {/* Messages Table */}
          <TableContainer
            component={Paper}
            sx={
              useSessionListTableUi
                ? { ...adminSessionListTableContainerSx, mb: 2 }
                : { mb: 2, width: "100%" }
            }
          >
            <Table
              sx={
useSessionListTableUi
            ? adminSessionListGridTableSx
                  : { width: "100%", tableLayout: "fixed" }
              }
              size={useSessionListTableUi ? "small" : "medium"}
            >
              {!useSessionListTableUi && (
                <colgroup>
                  <col
                    style={{ width: `${MESSAGE_TABLE_COLUMN_WIDTHS.actions}px` }}
                  />
                  <col style={{ width: "16%" }} />
                  <col style={{ width: "18%" }} />
                  <col />
                  <col
                    style={{
                      width: `${MESSAGE_TABLE_COLUMN_WIDTHS.messageDate}px`,
                    }}
                  />
                  <col
                    style={{ width: `${MESSAGE_TABLE_COLUMN_WIDTHS.status}px` }}
                  />
                </colgroup>
              )}
              <TableHead>
                <TableRow
                  sx={
useSessionListTableUi
            ? adminSessionListTableHeadRowSx
                      : { backgroundColor: "#e8f5e8" }
                  }
                >
                  <TableCell
                    sx={
useSessionListTableUi
            ? adminSessionListTableHeadCellSx(
                            messageListColumnWidths.actions,
                          )
                        : { fontWeight: 600, ...messageTableActionsCellSx }
                    }
                  >
                    Actions
                  </TableCell>
                  <SortableHeader
                    label="From"
                    field="from"
                    sortField={sortField}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                    headCellSx={
                      useSessionListTableUi
                        ? adminSessionListTableHeadCellSx(
                            messageListColumnWidths.from
                          )
                        : {
                            fontWeight: 600,
                            ...messageTableCellBaseSx,
                            width: "16%",
                          }
                    }
                  />
                  <SortableHeader
                    label="Subject"
                    field="subject"
                    sortField={sortField}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                    headCellSx={
                      useSessionListTableUi
                        ? adminSessionListTableHeadCellSx(
                            messageListColumnWidths.subject
                          )
                        : {
                            fontWeight: 600,
                            ...messageTableCellBaseSx,
                            width: "18%",
                          }
                    }
                  />
                  <SortableHeader
                    label="Message"
                    field="message"
                    sortField={sortField}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                    headCellSx={
                      useSessionListTableUi
                        ? adminSessionListTableHeadCellSx()
                        : { fontWeight: 600, ...messageTableCellBaseSx }
                    }
                  />
                  <SortableHeader
                    label="Message Date"
                    field="messageDate"
                    sortField={sortField}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                    headCellSx={
                      useSessionListTableUi
                        ? adminSessionListTableHeadCellSx(
                            messageListColumnWidths.messageDate
                          )
                        : { fontWeight: 600, ...messageTableDateCellSx }
                    }
                  />
                  <SortableHeader
                    label="Status"
                    field="status"
                    sortField={sortField}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                    headCellSx={
                      useSessionListTableUi
                        ? adminSessionListTableHeadCellSx(
                            messageListColumnWidths.status,
                            true
                          )
                        : { fontWeight: 600, ...messageTableStatusCellSx }
                    }
                  />
                </TableRow>
              </TableHead>
              <TableBody>
                {messagesLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      align="center"
                      sx={useSessionListTableUi ? adminSessionListEmptyCellSx : { py: 4 }}
                    >
                      <CircularProgress size={28} />
                      <Typography
                        variant="body2"
                        sx={
useSessionListTableUi
            ? adminSessionListEmptyTextSx
                            : { mt: 1, color: "text.secondary" }
                        }
                      >
                        Loading messages...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : loadError ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      align="center"
                      sx={useSessionListTableUi ? adminSessionListEmptyCellSx : { py: 3 }}
                    >
                      <Typography variant="body2" color="error" sx={{ mb: 1 }}>
                        {loadError}
                      </Typography>
                      <Button size="small" variant="outlined" onClick={loadMessages}>
                        Retry
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : filteredMessages.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      align="center"
                      sx={
                        useSessionListTableUi
                          ? adminSessionListEmptyCellSx
                          : { fontSize: "0.75rem", padding: "3px 5px" }
                      }
                    >
                      <Typography
                        sx={useSessionListTableUi ? adminSessionListEmptyTextSx : undefined}
                      >
                        No messages found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedMessages.map((message, index) => (
                    <TableRow
                      key={getEmailTrackingId(message) ?? message.messageID ?? index}
                      sx={
                        useSessionListTableUi
                          ? adminSessionListTableBodyRowSx
                          : { "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" } }
                      }
                    >
                      <TableCell
                        sx={
useSessionListTableUi
            ? adminSessionListTableBodyCellSx({ action: true })
                            : messageTableActionsCellSx
                        }
                      >
                        <Box
                          component="span"
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 0.35,
                            flexWrap: "nowrap",
                          }}
                        >
                          <Box
                            component="span"
                            onClick={() => handleViewMessage(message)}
                            sx={adminSessionListTableActionLinkSx}
                          >
                            View
                          </Box>
                          <Typography
                            component="span"
                            sx={{
                              fontSize: "0.75rem",
                              color: "text.disabled",
                              userSelect: "none",
                              lineHeight: 1,
                            }}
                          >
                            /
                          </Typography>
                          <Box
                            component="span"
                            onClick={() => handleReplyMessage(message)}
                            sx={adminSessionListTableActionLinkSx}
                          >
                            Reply
                          </Box>
                          <Typography
                            component="span"
                            sx={{
                              fontSize: "0.75rem",
                              color: "text.disabled",
                              userSelect: "none",
                              lineHeight: 1,
                            }}
                          >
                            /
                          </Typography>
                          <Box
                            component="span"
                            onClick={() => handleDeleteMessage(message)}
                            sx={adminSessionListTableActionLinkSx}
                          >
                            Delete
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={
useSessionListTableUi
            ? adminSessionListTableBodyCellSx({ ellipsis: true })
                            : { ...messageTableCellBaseSx, width: "16%" }
                        }
                      >
                        {useSessionListTableUi ? (
                          <Tooltip title={message.sendFrom ?? "—"}>
                            <span>{message.sendFrom ?? "—"}</span>
                          </Tooltip>
                        ) : (
                          message.sendFrom
                        )}
                      </TableCell>
                      <TableCell
                        sx={
useSessionListTableUi
            ? adminSessionListTableBodyCellSx({ ellipsis: true })
                            : { ...messageTableCellBaseSx, width: "18%" }
                        }
                      >
                        {useSessionListTableUi ? (
                          <Tooltip title={message.subject ?? "—"}>
                            <span>{message.subject ?? "—"}</span>
                          </Tooltip>
                        ) : (
                          message.subject
                        )}
                      </TableCell>
                      <TableCell
                        sx={
useSessionListTableUi
            ? adminSessionListTableBodyCellSx({ ellipsis: true })
                            : messageTableCellBaseSx
                        }
                        title={
                          useSessionListTableUi ? undefined : getMessagePreview(message)
                        }
                      >
                        {useSessionListTableUi ? (
                          <Tooltip title={getMessagePreview(message) || "—"}>
                            <span>{getMessagePreview(message) || "—"}</span>
                          </Tooltip>
                        ) : (
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
                            {getMessagePreview(message)}
                          </Box>
                        )}
                      </TableCell>
                      <TableCell
                        sx={
useSessionListTableUi
            ? adminSessionListTableBodyCellSx()
                            : messageTableDateCellSx
                        }
                      >
                        {formatDate(message.sendDate)}
                      </TableCell>
                      <TableCell
                        sx={
useSessionListTableUi
            ? adminSessionListTableBodyCellSx({ isLast: true })
                            : messageTableStatusCellSx
                        }
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
          {useSessionListTableUi ? (
            <AdminSessionListPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalRecords={totalRecords}
              pageSize={pageSize}
              goToPageInput={goToPageInput}
              onGoToPageInputChange={setGoToPageInput}
              onPageChange={handlePageChange}
              onGoToPage={handleGoToPage}
            />
          ) : (
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
                  disabled={currentPage === 1 || totalRecords === 0}
                  onClick={() => handlePageChange(1)}
                >
                  <FirstPageIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  sx={{ color: "white", padding: "2px" }}
                  disabled={currentPage === 1 || totalRecords === 0}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <PrevPageIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  sx={{ color: "white", padding: "2px" }}
                  disabled={currentPage === totalPages || totalRecords === 0}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  <NextPageIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  sx={{ color: "white", padding: "2px" }}
                  disabled={currentPage === totalPages || totalRecords === 0}
                  onClick={() => handlePageChange(totalPages)}
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
                  value={totalRecords > 0 ? currentPage : ""}
                  onChange={(e) => handlePageChange(Number(e.target.value))}
                  disabled={totalRecords === 0}
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
                  {totalRecords > 0 ? (
                    Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <MenuItem
                          key={page}
                          value={page}
                          sx={{ fontSize: "0.75rem" }}
                        >
                          {page}
                        </MenuItem>
                      )
                    )
                  ) : (
                    <MenuItem value="" sx={{ fontSize: "0.75rem" }}>
                      -
                    </MenuItem>
                  )}
                </Select>
              </Box>

              <Typography sx={{ color: "white", fontSize: "0.75rem" }}>
                Page(s): {totalRecords > 0 ? currentPage : 0} of{" "}
                {totalRecords > 0 ? totalPages : 0}
              </Typography>

              <Typography sx={{ color: "white", fontSize: "0.75rem" }}>
                Record(s):{" "}
                {totalRecords > 0
                  ? `${(currentPage - 1) * pageSize + 1} - ${Math.min(
                      currentPage * pageSize,
                      totalRecords
                    )} of ${totalRecords}`
                  : "0 of 0"}
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Typography sx={{ color: "white", fontSize: "0.75rem" }}>
                  Go to Page Number:
                </Typography>
                <TextField
                  size="small"
                  type="number"
                  value={goToPageInput}
                  onChange={(e) => setGoToPageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleGoToPage();
                    }
                  }}
                  sx={{
                    width: 50,
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "white",
                      fontSize: "0.75rem",
                    },
                  }}
                  inputProps={{ min: 1, max: totalPages || 1 }}
                />
                <Button
                  size="small"
                  variant="contained"
                  onClick={handleGoToPage}
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
          )}
          </Box>

          {/* Compose / Reply / View modal */}
          <Dialog
            open={messageModalOpen}
            onClose={(_, reason) => {
              if (sendingMessage && reason === "backdropClick") {
                return;
              }
              closeMessageModal();
            }}
            maxWidth="md"
            fullWidth
            scroll="paper"
            aria-labelledby="compose-message-dialog-title"
            PaperProps={{ sx: portalModalPaperSx }}
          >
            <DialogTitle
              id="compose-message-dialog-title"
              sx={portalModalTitleSx}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {getMessageModalIcon()}
                <Typography
                  component="span"
                  sx={{ fontWeight: 600, fontSize: "1rem" }}
                >
                  {getMessageModalTitle()}
                </Typography>
              </Box>
              <IconButton
                aria-label="close"
                onClick={closeMessageModal}
                disabled={sendingMessage}
                size="small"
                sx={{
                  color: "white",
                  "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.15)" },
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={portalModalContentSx}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {formMode === "reply" && selectedMessage && (
                  <Box
                    sx={{
                      bgcolor: APPLICATION_SURFACE_BG,
                      border: `1px solid ${APPLICATION_SURFACE_BORDER}`,
                      borderRadius: 1,
                      px: 1.5,
                      py: 0.75,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ color: PORTAL_MODAL_FG, fontSize: "0.8rem" }}
                    >
                      Replying to: {sendTo}
                      {subject ? ` — "${subject}"` : ""}
                    </Typography>
                  </Box>
                )}

                {formMode === "view" || formMode === "reply" ? (
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="From"
                    value={sendTo}
                    disabled
                    sx={portalModalFieldSx}
                  />
                ) : memberType === "A" ? (
                  <FormControl
                    fullWidth
                    size="small"
                    sx={portalModalFieldSx}
                    error={!!composeRecipientFieldError}
                  >
                    <InputLabel>Send To (Class)</InputLabel>
                    <Select
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      label="Send To (Class)"
                      disabled={sendingMessage}
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
                    {composeRecipientFieldError && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ mt: 0.5, ml: 1.75 }}
                      >
                        {composeRecipientFieldError}
                      </Typography>
                    )}
                  </FormControl>
                ) : memberType === "I" || memberType === "V" || memberType === "S" ? (
                  <FormControl
                    fullWidth
                    size="small"
                    sx={portalModalFieldSx}
                    error={!!composeRecipientFieldError}
                  >
                    <InputLabel>
                      {memberType === "S"
                        ? "Send To (Instructor)"
                        : "Send To (Student)"}
                    </InputLabel>
                    <Select
                      value={selectedStudent}
                      onChange={(e) => setSelectedStudent(e.target.value)}
                      label={
                        memberType === "S"
                          ? "Send To (Instructor)"
                          : "Send To (Student)"
                      }
                      disabled={sendingMessage}
                    >
                      <MenuItem value="" disabled>
                        {memberType === "S"
                          ? "Select Instructor"
                          : "Select Student"}
                      </MenuItem>
                      {studentList.map((student) => (
                        <MenuItem key={student.value} value={student.value}>
                          {student.text}
                        </MenuItem>
                      ))}
                    </Select>
                    {composeRecipientFieldError && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ mt: 0.5, ml: 1.75 }}
                      >
                        {composeRecipientFieldError}
                      </Typography>
                    )}
                  </FormControl>
                ) : (
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Send To"
                    value={
                      user?.firstName && user?.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : firstName
                    }
                    disabled
                    sx={portalModalFieldSx}
                  />
                )}

                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  label="Subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  disabled={formMode === "view" || sendingMessage}
                  required
                  error={!!composeSubjectError}
                  helperText={composeSubjectError}
                  sx={portalModalFieldSx}
                />

                <TextField
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={8}
                  size="small"
                  label="Message"
                  value={
                    messageBodyLoading ? "Loading message..." : messageBody
                  }
                  onChange={(e) => setMessageBody(e.target.value)}
                  disabled={
                    formMode === "view" || messageBodyLoading || sendingMessage
                  }
                  required
                  error={!!composeMessageError}
                  helperText={composeMessageError}
                  sx={portalModalFieldSx}
                />
              </Box>
            </DialogContent>
            <DialogActions sx={portalModalActionsSx}>
              {formMode !== "view" && (
                <Button
                  variant="outlined"
                  onClick={clearMessageFields}
                  disabled={sendingMessage}
                  sx={portalModalClearButtonSx}
                >
                  Clear
                </Button>
              )}
              <Box sx={{ flex: 1 }} />
              <Button
                onClick={closeMessageModal}
                color="inherit"
                disabled={sendingMessage}
                sx={{ textTransform: "none", fontSize: "0.875rem" }}
              >
                Close
              </Button>
              {formMode !== "view" && (
                <Button
                  variant="contained"
                  onClick={handleSendMessage}
                  disabled={!isComposeFormValid || sendingMessage}
                  startIcon={
                    sendingMessage ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : (
                      <SendIcon />
                    )
                  }
                  sx={portalModalSendButtonSx}
                >
                  {sendingMessage ? "Sending..." : "Send"}
                </Button>
              )}
            </DialogActions>
          </Dialog>
        </Paper>

        <AppConfirmDialog
          open={deleteConfirmOpen}
          onClose={handleDeleteConfirmClose}
          onConfirm={handleDeleteConfirm}
          title="Delete Email"
          message="Do you want to delete this email?"
          confirmLabel="Delete"
          confirmColor="error"
          icon={<DeleteIcon sx={{ fontSize: 20 }} />}
          loading={deletingMessage}
        />

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{
            vertical: snackbar.vertical || "top",
            horizontal: "center",
          }}
          sx={{ zIndex: (theme) => theme.zIndex.modal + 1 }}
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
