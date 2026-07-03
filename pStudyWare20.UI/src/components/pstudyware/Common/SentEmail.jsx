import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
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
  Alert,
  Snackbar,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import {
  Inbox as InboxIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { useAuth } from "../../../contexts/AuthContext";
import sentEmailService from "../../../services/sentEmailService";
import { getPortalUsername, getPortalLoginIdentifier } from "../../../utils/portalUsername";
import {
  getMessagePreview,
  getMessageFieldValue,
  sortRows,
} from "../../../utils/tableSort";
import SortableHeader from "./SortableHeader";
import PortalDialog from "./PortalDialog";
import StudentHeader, { StudentRoleHeaderSpacer } from "../Student/StudentHeader";
import AdminHeader, { AdminRoleHeaderSpacer } from "../Admin/AdminHeader";
import AdminSessionListPagination from "../Admin/AdminSessionListPagination";
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
  portalHeaderActionButtonSx,
} from "../styles/applicationSurfaces";
import {
  portalModalFieldSx,
  portalModalClearButtonSx,
} from "./portalModalStyles";

/** Real tracking row id — never use MessageID (Row_Number) for API calls. */
const getSentEmailTrackingId = (message) => {
  const id =
    message?.emailID ??
    message?.EmailID ??
    message?.trackingID ??
    message?.TrackingID;
  const parsed = Number(id);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

const sentListColumnWidths = {
  actions: "10%",
  from: "14%",
  to: "14%",
  subject: "14%",
  messageDate: "12%",
};

const getMessageCenterPath = (user) => {
  const memberType = user?.memberType?.toUpperCase() || "";
  if (memberType === "S") return "/pstudyware/student/message-center";
  if (memberType === "I") return "/pstudyware/instructor/message-center";
  if (memberType === "V") return "/pstudyware/volunteer/message-center";
  if (memberType === "A") return "/pstudyware/admin/message-center";
  return "/pstudyware/emailmanager";
};

/** Legacy sentemail.aspx grid [SendFrom] — always the SP SendFrom column. */
const getSentGridFromDisplay = (message, memberType) => {
  const fromCol = message?.sendFrom || message?.SendFrom || "";
  if (fromCol) {
    return fromCol;
  }
  // Student branch also exposes StudentName (same value when joins succeed).
  if (memberType === "S") {
    return message?.studentName || message?.StudentName || "";
  }
  return "";
};

/** Legacy sentemail.aspx grid [SendTo] — always the SP SendTo column. */
const getSentGridToDisplay = (message) =>
  message?.sendTo || message?.SendTo || "";

const getSentMessageFieldValue = (message, field, memberType) => {
  switch (field) {
    case "from":
      return getSentGridFromDisplay(message, memberType);
    case "to":
      return getSentGridToDisplay(message);
    case "subject":
      return message?.subject || message?.Subject || "";
    case "message":
      return getMessagePreview(message);
    case "messageDate":
      return message?.sendDate || message?.SendDate || "";
    default:
      return getMessageFieldValue(message, field);
  }
};

/**
 * Legacy sentemail.aspx View dialog — uses Emailinfo Name, not the grid SendFrom.
 * Student: parent first name. Instructor: student first name.
 */
const getSentViewFromDisplay = (message, memberType) => {
  if (memberType === "S") {
    return message?.name || message?.Name || "";
  }
  return getSentGridFromDisplay(message, memberType);
};

const getSentViewToDisplay = (message, memberType) => {
  if (memberType === "I") {
    return message?.name || message?.Name || "";
  }
  return getSentGridToDisplay(message);
};

const SentEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
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

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [sendTo, setSendTo] = useState("");
  const [sendFrom, setSendFrom] = useState("");
  const [subject, setSubject] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [messageBodyLoading, setMessageBodyLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
    vertical: "top",
  });

  const isStudent =
    user?.role === "Student" || user?.memberType?.toUpperCase() === "S";
  const isInstructor = user?.memberType?.toUpperCase() === "I";
  const memberType = user?.memberType?.toUpperCase() || "";
  const isAdmin = memberType === "A";
  const isStudentMessageCenter =
    location.pathname === "/pstudyware/student/message-center";
  const isRoleDashboardShell =
    location.pathname.startsWith("/pstudyware/instructor/") ||
    location.pathname.startsWith("/pstudyware/volunteer/");
  const shouldShowStudentHeader =
    (isStudent || isStudentMessageCenter) && !isRoleDashboardShell;

  const action = searchParams.get("Action");
  const emailId = searchParams.get("sEmailID");

  const showSnackbar = (message, severity = "info", vertical = "top") => {
    setSnackbar({ open: true, message, severity, vertical });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const loadSentMessages = async () => {
    if (!isAuthenticated || !user) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setLoadError(null);
      const portalUsername = getPortalUsername(user) || getPortalLoginIdentifier(user) || null;
      const response = await sentEmailService.getSentMessages(portalUsername);

      if (response.isSuccess || response.IsSuccess) {
        const messagesList = response.messages || response.Messages || [];
        setMessages(messagesList);
        setFilteredMessages(messagesList);
      } else {
        const errorMsg =
          response.errorMessage ||
          response.ErrorMessage ||
          "Failed to load sent messages";
        setLoadError(errorMsg);
        showSnackbar(errorMsg, "error");
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Error loading sent messages. Please try again.";
      setLoadError(errorMsg);
      showSnackbar(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSentMessages();
  }, [isAuthenticated, user, navigate]);

  const handleSearch = () => {
    let filtered = [...messages];

    if (searchBy !== "ALL" && searchTerm.trim()) {
      filtered = filtered.filter((message) => {
        let fieldValue = "";

        switch (searchBy) {
          case "FROM":
            fieldValue = getSentGridFromDisplay(message, memberType);
            break;
          case "TO":
            fieldValue = getSentGridToDisplay(message);
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
    setCurrentPage(1);
    setGoToPageInput("1");
  };

  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, searchBy, searchCriteria, searchTerm]);

  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortField(field);
    setCurrentPage(1);
    setGoToPageInput("1");
  };

  const sortedMessages = useMemo(
    () =>
      sortRows(filteredMessages, sortField, sortOrder, (message, field) =>
        getSentMessageFieldValue(message, field, memberType)
      ),
    [filteredMessages, sortField, sortOrder, memberType]
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

  const closeViewModal = () => {
    setViewModalOpen(false);
    setSendTo("");
    setSendFrom("");
    setSubject("");
    setMessageBody("");
    setMessageBodyLoading(false);
    if (action || emailId) {
      navigate("/pstudyware/sentemail", { replace: true });
    }
  };

  const openViewModal = async (message, options = {}) => {
    const trackingId = getSentEmailTrackingId(message);
    const rowBody = getMessagePreview(message);

    setSendTo(getSentViewToDisplay(message, memberType));
    setSendFrom(getSentViewFromDisplay(message, memberType));
    setSubject(message?.subject || message?.Subject || "");
    setMessageBody(rowBody);
    setViewModalOpen(true);

    const shouldFetchBody =
      options.forceReload || !rowBody.trim() || Boolean(trackingId);

    if (!shouldFetchBody) {
      return;
    }

    if (!trackingId) {
      showSnackbar("Unable to load message details (missing message ID).", "error");
      return;
    }

    try {
      setMessageBodyLoading(true);
      const response = await sentEmailService.getMessageDetails(trackingId);
      if (response.isSuccess || response.IsSuccess) {
        const body =
          response.message ??
          response.Message ??
          rowBody;
        setMessageBody(body);
      } else {
        showSnackbar(
          response.errorMessage ||
            response.ErrorMessage ||
            "Failed to load message details",
          "error"
        );
      }
    } catch (error) {
      showSnackbar("Error loading message details. Please try again.", "error");
    } finally {
      setMessageBodyLoading(false);
    }
  };

  useEffect(() => {
    const loadMessageFromUrl = async () => {
      if (action === "V" && emailId) {
        await openViewModal(
          {
            emailID: parseInt(emailId, 10),
            sendTo: searchParams.get("SendTo") || "",
            name: searchParams.get("Name") || "",
            subject: searchParams.get("Subject") || "",
            message: "",
          },
          { forceReload: true }
        );
      }
    };

    loadMessageFromUrl();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action, emailId]);

  const handleViewNewMessages = () => {
    navigate(getMessageCenterPath(user));
  };

  return (
    <Box>
      {isAdmin && <AdminHeader user={user} />}
      {isAdmin && <AdminRoleHeaderSpacer />}
      {shouldShowStudentHeader && <StudentHeader user={user} />}
      {shouldShowStudentHeader && <StudentRoleHeaderSpacer />}

      <Container maxWidth="xl" sx={{ mt: 0, mb: 4 }}>
        <Paper
          elevation={0}
          sx={{ ...adminSessionListPanelCardSx, ...portalPaperAntiLiftSx }}
        >
          <Box sx={adminSessionListPanelContentSx}>
            <Box sx={adminSessionListHeaderBarSx}>
              <Typography variant="subtitle1" component="h1" sx={adminSessionListTitleSx}>
                Message Center - Sent Messages
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  startIcon={<InboxIcon fontSize="inherit" />}
                  onClick={handleViewNewMessages}
                  sx={portalHeaderActionButtonSx}
                >
                  View New Messages
                </Button>
              </Box>
            </Box>

            <Box sx={adminSessionListSearchBarSx}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Typography sx={adminSessionListSearchLabelSx}>Search By:</Typography>
                <Select
                  value={searchBy}
                  onChange={(e) => setSearchBy(e.target.value)}
                  size="small"
                  sx={adminSessionListSearchSelectSx}
                >
                  <MenuItem value="ALL" sx={adminSessionListMenuItemSx}>
                    -ALL-
                  </MenuItem>
                  <MenuItem value="FROM" sx={adminSessionListMenuItemSx}>
                    From
                  </MenuItem>
                  <MenuItem value="TO" sx={adminSessionListMenuItemSx}>
                    To
                  </MenuItem>
                  <MenuItem value="SUBJECT" sx={adminSessionListMenuItemSx}>
                    Subject
                  </MenuItem>
                </Select>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Typography sx={adminSessionListSearchLabelSx}>Criteria:</Typography>
                <Select
                  value={searchCriteria}
                  onChange={(e) => setSearchCriteria(e.target.value)}
                  size="small"
                  sx={adminSessionListSearchSelectSx}
                >
                  <MenuItem value="contains" sx={adminSessionListMenuItemSx}>
                    Contains
                  </MenuItem>
                  <MenuItem value="equals" sx={adminSessionListMenuItemSx}>
                    Equals
                  </MenuItem>
                  <MenuItem value="starts_with" sx={adminSessionListMenuItemSx}>
                    Starts With
                  </MenuItem>
                </Select>
              </Box>

              <TextField
                size="small"
                placeholder="Search Text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={adminSessionListSearchFieldSx}
              />

              <Button
                variant="contained"
                size="small"
                onClick={handleSearch}
                sx={adminSessionListFindButtonSx}
              >
                Find
              </Button>
            </Box>

            <TableContainer
              component={Paper}
              sx={{ ...adminSessionListTableContainerSx, mb: 2 }}
            >
              <Table sx={adminSessionListGridTableSx} size="small">
                <TableHead>
                  <TableRow sx={adminSessionListTableHeadRowSx}>
                    <TableCell
                      sx={adminSessionListTableHeadCellSx(
                        sentListColumnWidths.actions
                      )}
                    >
                      Actions
                    </TableCell>
                    <SortableHeader
                      label="From"
                      field="from"
                      sortField={sortField}
                      sortOrder={sortOrder}
                      onSort={handleSort}
                      headCellSx={adminSessionListTableHeadCellSx(
                        sentListColumnWidths.from
                      )}
                    />
                    <SortableHeader
                      label="To"
                      field="to"
                      sortField={sortField}
                      sortOrder={sortOrder}
                      onSort={handleSort}
                      headCellSx={adminSessionListTableHeadCellSx(
                        sentListColumnWidths.to
                      )}
                    />
                    <SortableHeader
                      label="Subject"
                      field="subject"
                      sortField={sortField}
                      sortOrder={sortOrder}
                      onSort={handleSort}
                      headCellSx={adminSessionListTableHeadCellSx(
                        sentListColumnWidths.subject
                      )}
                    />
                    <SortableHeader
                      label="Message"
                      field="message"
                      sortField={sortField}
                      sortOrder={sortOrder}
                      onSort={handleSort}
                      headCellSx={adminSessionListTableHeadCellSx()}
                    />
                    <SortableHeader
                      label="Message Date"
                      field="messageDate"
                      sortField={sortField}
                      sortOrder={sortOrder}
                      onSort={handleSort}
                      headCellSx={adminSessionListTableHeadCellSx(
                        sentListColumnWidths.messageDate,
                        true
                      )}
                    />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={adminSessionListEmptyCellSx}>
                        <CircularProgress size={28} />
                        <Typography variant="body2" sx={adminSessionListEmptyTextSx}>
                          Loading sent messages...
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : loadError ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={adminSessionListEmptyCellSx}>
                        <Typography variant="body2" color="error" sx={{ mb: 1 }}>
                          {loadError}
                        </Typography>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={loadSentMessages}
                        >
                          Retry
                        </Button>
                      </TableCell>
                    </TableRow>
                  ) : paginatedMessages.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={adminSessionListEmptyCellSx}>
                        <Typography sx={adminSessionListEmptyTextSx}>
                          No messages found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedMessages.map((message, index) => (
                      <TableRow
                        key={getSentEmailTrackingId(message) ?? index}
                        sx={adminSessionListTableBodyRowSx}
                      >
                        <TableCell
                          sx={adminSessionListTableBodyCellSx({ action: true })}
                        >
                          <Box
                            component="span"
                            onClick={() => openViewModal(message)}
                            sx={adminSessionListTableActionLinkSx}
                          >
                            View
                          </Box>
                        </TableCell>
                        <TableCell
                          sx={adminSessionListTableBodyCellSx({ ellipsis: true })}
                        >
                          <Tooltip title={getSentGridFromDisplay(message, memberType) || "—"}>
                            <span>
                              {getSentGridFromDisplay(message, memberType) || "—"}
                            </span>
                          </Tooltip>
                        </TableCell>
                        <TableCell
                          sx={adminSessionListTableBodyCellSx({ ellipsis: true })}
                        >
                          <Tooltip title={getSentGridToDisplay(message) || "—"}>
                            <span>{getSentGridToDisplay(message) || "—"}</span>
                          </Tooltip>
                        </TableCell>
                        <TableCell
                          sx={adminSessionListTableBodyCellSx({ ellipsis: true })}
                        >
                          <Tooltip title={message.subject || message.Subject || "—"}>
                            <span>{message.subject || message.Subject || "—"}</span>
                          </Tooltip>
                        </TableCell>
                        <TableCell
                          sx={adminSessionListTableBodyCellSx({ ellipsis: true })}
                        >
                          <Tooltip title={getMessagePreview(message) || "—"}>
                            <span>{getMessagePreview(message) || "—"}</span>
                          </Tooltip>
                        </TableCell>
                        <TableCell sx={adminSessionListTableBodyCellSx({ isLast: true })}>
                          {formatDate(message.sendDate || message.SendDate)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

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
          </Box>
        </Paper>

        <PortalDialog
          open={viewModalOpen}
          onClose={closeViewModal}
          maxWidth="md"
          hideCloseIcon
          ariaLabelledby="view-sent-message-dialog-title"
          title="View Sent Message"
          icon={<VisibilityIcon sx={{ fontSize: 20 }} />}
          actions={
            <Button
              variant="outlined"
              size="small"
              onClick={closeViewModal}
              sx={portalModalClearButtonSx}
            >
              Close
            </Button>
          }
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 0.5 }}>
            {(isStudent || isAdmin || memberType === "V") && (
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="From"
                value={sendFrom}
                disabled
                InputLabelProps={{ shrink: true }}
                sx={portalModalFieldSx}
              />
            )}
            {(isInstructor || isAdmin || memberType === "V") && (
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="To"
                value={sendTo}
                disabled
                InputLabelProps={{ shrink: true }}
                sx={portalModalFieldSx}
              />
            )}
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              label="Subject"
              value={subject}
              disabled
              InputLabelProps={{ shrink: true }}
              sx={portalModalFieldSx}
            />
            <TextField
              fullWidth
              variant="outlined"
              multiline
              rows={8}
              size="small"
              label="Message"
              value={messageBodyLoading ? "Loading message..." : messageBody}
              disabled
              InputLabelProps={{ shrink: true }}
              sx={portalModalFieldSx}
            />
          </Box>
        </PortalDialog>

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

export default SentEmail;
