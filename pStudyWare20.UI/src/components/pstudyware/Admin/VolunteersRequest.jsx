import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
  Grid,
  Paper,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  FirstPage as FirstPageIcon,
  KeyboardArrowLeft as PrevPageIcon,
  KeyboardArrowRight as NextPageIcon,
  LastPage as LastPageIcon,
} from "@mui/icons-material";
import { useAuth } from "../../../contexts/AuthContext";
import AdminHeader from "./AdminHeader";
import volunteersRequestService from "../../../services/volunteersRequestService";
import {
  APPLICATION_ADMIN_TITLE_COLOR,
  PORTAL_CARD_BOX_SHADOW,
  portalCardAntiLiftSx,
} from "../../../styles/applicationSurfaces";
import studentWaitingListService from "../../../services/studentWaitingListService";

const volunteersRequestPageSx = {
  flex: 1,
  minHeight: 0,
  width: "100%",
  display: "flex",
  flexDirection: "column",
};

const TYPE_OPTIONS = [
  { value: "P", label: "Primary Instructor" },
  { value: "S", label: "Secondary Instructor" },
  { value: "C", label: "Coordinator" },
  { value: "V", label: "Volunteers" },
];

const CLASS_OPTIONS = [
  { value: "JB", label: "Junior Beginner" },
  { value: "JI", label: "Junior Intermediate" },
  { value: "JA", label: "Junior Advanced" },
  { value: "SB", label: "Senior Beginner" },
  { value: "SI", label: "Senior Intermediate" },
  { value: "SA", label: "Senior Advanced" },
  { value: "DS", label: "Data Science" },
  { value: "AI", label: "Artificial Intelligence" },
  { value: "ST", label: "PSAT" },
  { value: "AT", label: "ACT" },
  { value: "GD", label: "Game Development" },
  { value: "AD", label: "App Development" },
  { value: "DM", label: "Data Management" },
];

// VolunteerInfo format: FirstName~#LastName~#Email~#ChapterID
function parseVolunteerInfo(str) {
  if (!str || typeof str !== "string") return {};
  const arr = str.split("~#");
  return {
    firstName: (arr[0] || "").trim(),
    lastName: (arr[1] || "").trim(),
    email: (arr[2] || "").trim(),
    chapterID: (arr[3] || "").trim(),
  };
}

const VolunteersRequest = () => {
  const { user, isAuthenticated } = useAuth();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chapterLocations, setChapterLocations] = useState([]);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    chapterID: "",
    type: "V",
    class: "",
    section: "A",
  });
  const [submitting, setSubmitting] = useState(false);
  const [orderBy, setOrderBy] = useState("volunteerID");
  const [order, setOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [goToPageInput, setGoToPageInput] = useState("1");
  const [searchBy, setSearchBy] = useState("ALL");
  const [searchCriteria, setSearchCriteria] = useState("contains");
  const [searchText, setSearchText] = useState("");
  const pageSize = 10;
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  const username = user?.email || user?.username || "";

  const loadList = async () => {
    if (!username) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await volunteersRequestService.getVolunteersRequest({ Username: username });
      const data = res?.volunteersRequest ?? res?.VolunteersRequest;
      if (res?.isSuccess && Array.isArray(data)) {
        setList(
          data.map((row) =>
            row && typeof row === "object"
              ? {
                  volunteerID: row.volunteerID ?? row.VolunteerID,
                  volunteerName: row.volunteerName ?? row.VolunteerName,
                  grade: row.grade ?? row.Grade,
                  location: row.location ?? row.Location,
                  school: row.school ?? row.School,
                  phone: row.phone ?? row.Phone,
                  email: row.email ?? row.Email,
                  city: row.city ?? row.City,
                  enrolledSession: row.enrolledSession ?? row.EnrolledSession,
                  interest: row.interest ?? row.Interest,
                  status: row.status ?? row.Status,
                  insertDate: row.insertDate ?? row.InsertDate,
                  comments: row.comments ?? row.Comments,
                  volunteerInfo: row.volunteerInfo ?? row.VolunteerInfo,
                }
              : null
          ).filter(Boolean)
        );
      } else {
        setList([]);
      }
    } catch (err) {
      console.error("Error loading volunteers request:", err);
      setSnackbar({
        open: true,
        message: err?.response?.data?.errorMessage ?? err?.message ?? "Error loading list.",
        severity: "error",
      });
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  const loadChapterLocations = async () => {
    try {
      const res = await studentWaitingListService.getChapterLocation({ Mode: "N" });
      const chapters = res?.chapterLocations ?? res?.ChapterLocations;
      if (res?.isSuccess && Array.isArray(chapters)) {
        setChapterLocations(chapters);
      }
    } catch (err) {
      console.error("Error loading chapter locations:", err);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setLoading(false);
      return;
    }
    loadList();
  }, [isAuthenticated, user]);

  useEffect(() => {
    loadChapterLocations();
  }, []);

  const handleSearch = () => {
    setCurrentPage(1);
    setGoToPageInput("1");
  };

  const handlePageChange = (page) => {
    const totalPages = Math.ceil((filteredAndSortedList?.length || 0) / pageSize);
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setGoToPageInput(String(page));
    }
  };

  const handleGoToPage = () => {
    const page = parseInt(goToPageInput, 10);
    const totalPages = Math.ceil((filteredAndSortedList?.length || 0) / pageSize);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    } else {
      setGoToPageInput(String(currentPage));
    }
  };

  const filteredAndSortedList = useMemo(() => {
    if (!list.length) return [];
    let filtered = list;
    if (searchBy !== "ALL" && searchText.trim()) {
      filtered = list.filter((row) => {
        let fieldValue = "";
        switch (searchBy) {
          case "VOLUNTEER_ID":
            fieldValue = (row.volunteerID ?? "").toString();
            break;
          case "NAME":
            fieldValue = row.volunteerName ?? "";
            break;
          case "EMAIL":
            fieldValue = row.email ?? "";
            break;
          case "STATUS":
            fieldValue = row.status ?? "";
            break;
          case "SCHOOL":
            fieldValue = row.school ?? "";
            break;
          default:
            return true;
        }
        fieldValue = String(fieldValue).toLowerCase();
        const search = searchText.trim().toLowerCase();
        if (searchCriteria === "equals") return fieldValue === search;
        if (searchCriteria === "starts_with") return fieldValue.startsWith(search);
        return fieldValue.includes(search);
      });
    }
    const key = orderBy;
    return [...filtered].sort((a, b) => {
      let aVal = a[key];
      let bVal = b[key];
      if (typeof aVal === "number" && typeof bVal === "number")
        return order === "asc" ? aVal - bVal : bVal - aVal;
      aVal = (aVal ?? "").toString();
      bVal = (bVal ?? "").toString();
      return order === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
  }, [list, orderBy, order, searchBy, searchCriteria, searchText]);

  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedList.slice(start, start + pageSize);
  }, [filteredAndSortedList, currentPage]);

  const totalPages = Math.ceil((filteredAndSortedList?.length || 0) / pageSize);
  const totalRecords = filteredAndSortedList?.length || 0;

  const handleEdit = (row) => {
    setSelectedRow(row);
    const parsed = parseVolunteerInfo(row.volunteerInfo);
    const nameParts = (row.volunteerName || "").split(" ");
    setForm({
      firstName: parsed.firstName || nameParts[0] || "",
      lastName: parsed.lastName || nameParts.slice(1).join(" ") || "",
      chapterID: parsed.chapterID || "",
      type: "V",
      class: "",
      section: "A",
    });
    setShowUpdateForm(true);
  };

  const handleCloseUpdateForm = () => {
    setShowUpdateForm(false);
    setSelectedRow(null);
    setForm({
      firstName: "",
      lastName: "",
      chapterID: "",
      type: "V",
      class: "",
      section: "A",
    });
  };

  const handleDeleteClick = (row) => {
    setSelectedRow(row);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedRow?.volunteerID) return;
    setSubmitting(true);
    try {
      const res = await volunteersRequestService.deleteVolunteerRequest({
        RequestID: String(selectedRow.volunteerID),
      });
      if (res?.isSuccess) {
        setSnackbar({ open: true, message: res.message || "Deleted successfully.", severity: "success" });
        setDeleteConfirmOpen(false);
        setSelectedRow(null);
        loadList();
      } else {
        setSnackbar({ open: true, message: res?.errorMessage || "Delete failed.", severity: "error" });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: err?.response?.data?.errorMessage || "Delete failed.",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateSubmit = async () => {
    if (!selectedRow) return;
    setSubmitting(true);
    try {
      const res = await volunteersRequestService.updateVolunteerStatus({
        VolundeerID: String(selectedRow.volunteerID),
        ChapterID: form.chapterID,
        Class: form.class,
        Section: form.section,
        Type: form.type,
      });
      if (res?.isSuccess) {
        setSnackbar({ open: true, message: res.message || "Volunteer approved successfully.", severity: "success" });
        handleCloseUpdateForm();
        loadList();
      } else {
        setSnackbar({ open: true, message: res?.errorMessage || "Update failed.", severity: "error" });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: err?.response?.data?.errorMessage || "Update failed.",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      const res = await volunteersRequestService.exportToExcel({ Username: username });
      const fileContent = res?.fileContent ?? res?.FileContent;
      if (!res?.isSuccess || !fileContent) {
        setSnackbar({
          open: true,
          message: res?.errorMessage ?? res?.ErrorMessage ?? "Export failed.",
          severity: "error",
        });
        return;
      }
      const base64 = typeof fileContent === "string" ? fileContent : "";
      const contentType = res?.contentType ?? res?.ContentType ?? "text/csv";
      const blob = new Blob(
        [Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))],
        { type: contentType }
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = res?.fileName ?? res?.FileName ?? "VolunteersRequest.csv";
      a.click();
      URL.revokeObjectURL(url);
      setSnackbar({ open: true, message: "Export downloaded.", severity: "success" });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err?.response?.data?.errorMessage || "Export failed.",
        severity: "error",
      });
    }
  };

  const formatDate = (d) => {
    if (!d) return "";
    const date = typeof d === "string" ? new Date(d) : d;
    return isNaN(date.getTime()) ? d : date.toLocaleDateString();
  };

  const cellPadding = "0 8px";

  return (
    <Box sx={volunteersRequestPageSx}>
      <AdminHeader user={user} />
      <Box sx={{ height: "48px" }} />
      <Container maxWidth="xl" sx={{ mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card
              sx={{
                backgroundColor: "white",
                borderRadius: 2,
                boxShadow: PORTAL_CARD_BOX_SHADOW,
                overflow: "hidden",
                ...portalCardAntiLiftSx,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    mb: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 2,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      color: APPLICATION_ADMIN_TITLE_COLOR,
                      fontSize: "1rem",
                    }}
                  >
                    Volunteers Request
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      startIcon={<DownloadIcon />}
                      onClick={handleExportExcel}
                      sx={{ fontSize: "0.75rem", px: 1.5, py: 0.25 }}
                    >
                      Export Excel
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      startIcon={<RefreshIcon />}
                      onClick={loadList}
                      disabled={loading}
                      sx={{ fontSize: "0.75rem", px: 1.5, py: 0.25 }}
                    >
                      Refresh
                    </Button>
                  </Box>
                </Box>

                {loading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <>
                    {/* Search Bar */}
                    <Box
                      sx={{
                        backgroundColor: "#4caf50",
                        p: 0.5,
                        borderRadius: 1,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        flexWrap: "wrap",
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
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
                          <MenuItem value="VOLUNTEER_ID" sx={{ fontSize: "0.75rem" }}>
                            #
                          </MenuItem>
                          <MenuItem value="NAME" sx={{ fontSize: "0.75rem" }}>
                            Name
                          </MenuItem>
                          <MenuItem value="EMAIL" sx={{ fontSize: "0.75rem" }}>
                            Email
                          </MenuItem>
                          <MenuItem value="STATUS" sx={{ fontSize: "0.75rem" }}>
                            Status
                          </MenuItem>
                          <MenuItem value="SCHOOL" sx={{ fontSize: "0.75rem" }}>
                            School
                          </MenuItem>
                        </Select>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
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
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
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
                          minHeight: 32,
                          py: 0,
                          px: 1,
                          "&:hover": { backgroundColor: "#f5f5f5" },
                        }}
                      >
                        Find
                      </Button>
                    </Box>

                    {/* Table */}
                    <TableContainer component={Paper} sx={{ width: "100%" }}>
                      <Table
                        sx={{
                          width: "100%",
                          tableLayout: "fixed",
                          "& .MuiTableCell-root": {
                            paddingTop: 0,
                            paddingBottom: 0,
                          },
                        }}
                        size="small"
                      >
                        <TableHead>
                          <TableRow sx={{ backgroundColor: "#e8f5e8" }}>
                            <TableCell
                              sx={{
                                fontWeight: 400,
                                borderRight: "1px solid #4caf50",
                                width: "8%",
                                minWidth: 88,
                                whiteSpace: "nowrap",
                                fontSize: "0.75rem",
                                padding: cellPadding,
                              }}
                            >
                              Actions
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: 400,
                                borderRight: "1px solid #4caf50",
                                width: "5%",
                                fontSize: "0.75rem",
                                padding: cellPadding,
                              }}
                            >
                              #
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: 400,
                                borderRight: "1px solid #4caf50",
                                width: "10%",
                                fontSize: "0.75rem",
                                padding: cellPadding,
                              }}
                            >
                              Volunteer Name
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: 400,
                                borderRight: "1px solid #4caf50",
                                width: "5%",
                                fontSize: "0.75rem",
                                padding: cellPadding,
                              }}
                            >
                              Grade
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: 400,
                                borderRight: "1px solid #4caf50",
                                width: "8%",
                                fontSize: "0.75rem",
                                padding: cellPadding,
                              }}
                            >
                              Location
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: 400,
                                borderRight: "1px solid #4caf50",
                                width: "8%",
                                fontSize: "0.75rem",
                                padding: cellPadding,
                              }}
                            >
                              School
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: 400,
                                borderRight: "1px solid #4caf50",
                                width: "7%",
                                fontSize: "0.75rem",
                                padding: cellPadding,
                              }}
                            >
                              Phone
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: 400,
                                borderRight: "1px solid #4caf50",
                                width: "10%",
                                fontSize: "0.75rem",
                                padding: cellPadding,
                              }}
                            >
                              Email
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: 400,
                                borderRight: "1px solid #4caf50",
                                width: "6%",
                                fontSize: "0.75rem",
                                padding: cellPadding,
                              }}
                            >
                              City
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: 400,
                                borderRight: "1px solid #4caf50",
                                width: "8%",
                                fontSize: "0.75rem",
                                padding: cellPadding,
                              }}
                            >
                              Enrolled For
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: 400,
                                borderRight: "1px solid #4caf50",
                                width: "8%",
                                fontSize: "0.75rem",
                                padding: cellPadding,
                              }}
                            >
                              Interested For
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: 400,
                                borderRight: "1px solid #4caf50",
                                width: "6%",
                                fontSize: "0.75rem",
                                padding: cellPadding,
                              }}
                            >
                              Status
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: 400,
                                borderRight: "1px solid #4caf50",
                                width: "7%",
                                fontSize: "0.75rem",
                                padding: cellPadding,
                              }}
                            >
                              Requested Date
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: 400,
                                fontSize: "0.75rem",
                                padding: cellPadding,
                              }}
                            >
                              Comments
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {paginatedList.length > 0 ? (
                            paginatedList.map((row) => (
                              <TableRow key={row.volunteerID}>
                                <TableCell
                                  sx={{
                                    borderRight: "1px solid #4caf50",
                                    fontSize: "0.75rem",
                                    padding: cellPadding,
                                    whiteSpace: "nowrap",
                                    verticalAlign: "middle",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexDirection: "row",
                                      alignItems: "center",
                                      flexWrap: "nowrap",
                                      gap: 0,
                                    }}
                                  >
                                    <Tooltip title="Update Status">
                                      <IconButton
                                        size="small"
                                        onClick={() => handleEdit(row)}
                                        sx={{ padding: "2px" }}
                                      >
                                        <EditIcon sx={{ fontSize: "1rem" }} />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                      <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => handleDeleteClick(row)}
                                        sx={{ padding: "2px" }}
                                      >
                                        <DeleteIcon sx={{ fontSize: "1rem" }} />
                                      </IconButton>
                                    </Tooltip>
                                  </Box>
                                </TableCell>
                                <TableCell
                                  sx={{
                                    borderRight: "1px solid #4caf50",
                                    fontSize: "0.75rem",
                                    padding: cellPadding,
                                  }}
                                >
                                  {row.volunteerID ?? "-"}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    borderRight: "1px solid #4caf50",
                                    fontSize: "0.75rem",
                                    padding: cellPadding,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  <Tooltip title={row.volunteerName ?? "-"}>
                                    <span>{row.volunteerName ?? "-"}</span>
                                  </Tooltip>
                                </TableCell>
                                <TableCell
                                  sx={{
                                    borderRight: "1px solid #4caf50",
                                    fontSize: "0.75rem",
                                    padding: cellPadding,
                                  }}
                                >
                                  {row.grade ?? "-"}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    borderRight: "1px solid #4caf50",
                                    fontSize: "0.75rem",
                                    padding: cellPadding,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  <Tooltip title={row.location ?? "-"}>
                                    <span>{row.location ?? "-"}</span>
                                  </Tooltip>
                                </TableCell>
                                <TableCell
                                  sx={{
                                    borderRight: "1px solid #4caf50",
                                    fontSize: "0.75rem",
                                    padding: cellPadding,
                                  }}
                                >
                                  {row.school ?? "-"}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    borderRight: "1px solid #4caf50",
                                    fontSize: "0.75rem",
                                    padding: cellPadding,
                                  }}
                                >
                                  {row.phone ?? "-"}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    borderRight: "1px solid #4caf50",
                                    fontSize: "0.75rem",
                                    padding: cellPadding,
                                    maxWidth: 120,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  <Tooltip title={row.email || "-"}>
                                    <span>{row.email ?? "-"}</span>
                                  </Tooltip>
                                </TableCell>
                                <TableCell
                                  sx={{
                                    borderRight: "1px solid #4caf50",
                                    fontSize: "0.75rem",
                                    padding: cellPadding,
                                  }}
                                >
                                  {row.city ?? "-"}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    borderRight: "1px solid #4caf50",
                                    fontSize: "0.75rem",
                                    padding: cellPadding,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  <Tooltip title={row.enrolledSession ?? "-"}>
                                    <span>{row.enrolledSession ?? "-"}</span>
                                  </Tooltip>
                                </TableCell>
                                <TableCell
                                  sx={{
                                    borderRight: "1px solid #4caf50",
                                    fontSize: "0.75rem",
                                    padding: cellPadding,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  <Tooltip title={row.interest ?? "-"}>
                                    <span>{row.interest ?? "-"}</span>
                                  </Tooltip>
                                </TableCell>
                                <TableCell
                                  sx={{
                                    borderRight: "1px solid #4caf50",
                                    fontSize: "0.75rem",
                                    padding: cellPadding,
                                  }}
                                >
                                  {row.status ?? "-"}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    borderRight: "1px solid #4caf50",
                                    fontSize: "0.75rem",
                                    padding: cellPadding,
                                  }}
                                >
                                  {formatDate(row.insertDate) || "-"}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    fontSize: "0.75rem",
                                    padding: cellPadding,
                                  }}
                                >
                                  {row.comments ?? "-"}
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell
                                colSpan={14}
                                align="center"
                                sx={{
                                  fontSize: "0.75rem",
                                  padding: cellPadding,
                                  py: 3,
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                  sx={{ fontSize: "0.75rem" }}
                                >
                                  {searchText
                                    ? "No records found matching your search."
                                    : "No records found."}
                                </Typography>
                              </TableCell>
                            </TableRow>
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
                        gap: 1,
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.25 }}
                      >
                        <IconButton
                          size="small"
                          sx={{ color: "white", padding: "2px" }}
                          onClick={() => handlePageChange(1)}
                          disabled={currentPage === 1}
                        >
                          <FirstPageIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          sx={{ color: "white", padding: "2px" }}
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          <PrevPageIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          sx={{ color: "white", padding: "2px" }}
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          <NextPageIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          sx={{ color: "white", padding: "2px" }}
                          onClick={() => handlePageChange(totalPages)}
                          disabled={currentPage === totalPages}
                        >
                          <LastPageIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.25 }}
                      >
                        <Typography sx={{ color: "white", fontSize: "0.75rem" }}>
                          GoTo
                        </Typography>
                        <Select
                          size="small"
                          value={totalPages > 0 ? currentPage : ""}
                          onChange={(e) =>
                            handlePageChange(Number(e.target.value))
                          }
                          disabled={totalPages === 0}
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
                          {totalPages > 0 ? (
                            Array.from(
                              { length: totalPages },
                              (_, i) => i + 1,
                            ).map((page) => (
                              <MenuItem
                                key={page}
                                value={page}
                                sx={{ fontSize: "0.75rem" }}
                              >
                                {page}
                              </MenuItem>
                            ))
                          ) : (
                            <MenuItem value="" sx={{ fontSize: "0.75rem" }}>
                              -
                            </MenuItem>
                          )}
                        </Select>
                      </Box>
                      <Typography sx={{ color: "white", fontSize: "0.75rem" }}>
                        Page(s): {currentPage} of {totalPages}
                      </Typography>
                      <Typography sx={{ color: "white", fontSize: "0.75rem" }}>
                        Record(s):{" "}
                        {totalRecords > 0
                          ? `${(currentPage - 1) * pageSize + 1} - ${Math.min(currentPage * pageSize, totalRecords)}`
                          : "0"}{" "}
                        of {totalRecords}
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.25 }}
                      >
                        <Typography sx={{ color: "white", fontSize: "0.75rem" }}>
                          Go to Page Number:
                        </Typography>
                        <TextField
                          size="small"
                          type="number"
                          value={goToPageInput}
                          onChange={(e) => setGoToPageInput(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") handleGoToPage();
                          }}
                          sx={{
                            width: 50,
                            "& .MuiOutlinedInput-root": {
                              backgroundColor: "white",
                              fontSize: "0.75rem",
                            },
                          }}
                          inputProps={{ min: 1, max: totalPages }}
                        />
                        <Button
                          size="small"
                          variant="contained"
                          onClick={handleGoToPage}
                          sx={{
                            backgroundColor: "white",
                            color: "#4caf50",
                            fontSize: "0.75rem",
                            minHeight: 32,
                            py: 0,
                            px: 0.75,
                            "&:hover": { backgroundColor: "#f5f5f5" },
                          }}
                        >
                          Go
                        </Button>
                      </Box>
                    </Box>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <Dialog
        open={showUpdateForm && !!selectedRow}
        onClose={handleCloseUpdateForm}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: "#4CAF50",
            color: "white",
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "white",
            fontWeight: 600,
            fontSize: "1rem",
            pb: 1,
          }}
        >
          Update Volunteer Request Status
        </DialogTitle>
        <DialogContent sx={{ pt: 0 }}>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                value={form.firstName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, firstName: e.target.value }))
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "white",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={form.lastName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, lastName: e.target.value }))
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "white",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "white",
                  },
                }}
              >
                <InputLabel>Chapter</InputLabel>
                <Select
                  value={form.chapterID}
                  label="Chapter"
                  onChange={(e) =>
                    setForm((f) => ({ ...f, chapterID: e.target.value }))
                  }
                >
                  {chapterLocations.map((ch) => {
                    const id = ch.chapterID ?? ch.ChapterID ?? "";
                    const name = ch.chapterName ?? ch.ChapterName ?? "";
                    const loc = ch.location ?? ch.Location ?? "";
                    return (
                      <MenuItem key={id} value={id}>
                        {name} - {loc}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "white",
                  },
                }}
              >
                <InputLabel>Type</InputLabel>
                <Select
                  value={form.type}
                  label="Type"
                  onChange={(e) =>
                    setForm((f) => ({ ...f, type: e.target.value }))
                  }
                >
                  {TYPE_OPTIONS.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "white",
                  },
                }}
              >
                <InputLabel>Class</InputLabel>
                <Select
                  value={form.class}
                  label="Class"
                  onChange={(e) =>
                    setForm((f) => ({ ...f, class: e.target.value }))
                  }
                >
                  {CLASS_OPTIONS.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "white",
                  },
                }}
              >
                <InputLabel>Section</InputLabel>
                <Select
                  value={form.section}
                  label="Section"
                  onChange={(e) =>
                    setForm((f) => ({ ...f, section: e.target.value }))
                  }
                >
                  <MenuItem value="A">A</MenuItem>
                  <MenuItem value="B">B</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{
            px: 3,
            pb: 2,
            pt: 0,
            justifyContent: "center",
            gap: 2,
          }}
        >
          <Button
            variant="outlined"
            onClick={handleCloseUpdateForm}
            disabled={submitting}
            sx={{
              borderColor: "white",
              color: "white",
              px: 4,
              py: 1,
              "&:hover": {
                borderColor: "white",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            Close
          </Button>
          <Button
            variant="contained"
            onClick={handleUpdateSubmit}
            disabled={submitting}
            sx={{
              backgroundColor: "#2E7D32",
              color: "white",
              px: 4,
              py: 1,
              "&:hover": { backgroundColor: "#1B5E20" },
            }}
          >
            {submitting ? "Submitting…" : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Delete volunteer request</DialogTitle>
        <DialogContent>Do you want to delete this volunteer request?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDeleteConfirm} disabled={submitting}>{submitting ? "Deleting…" : "Delete"}</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={(event, reason) => {
          if (reason === "clickaway") return;
          setSnackbar((s) => ({ ...s, open: false }));
        }}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default VolunteersRequest;
