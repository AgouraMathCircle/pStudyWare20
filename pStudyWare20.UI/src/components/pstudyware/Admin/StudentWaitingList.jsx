import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
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
  Card,
  CardContent,
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
import {
  APPLICATION_ADMIN_TITLE_COLOR,
  PORTAL_CARD_BOX_SHADOW,
  portalCardAntiLiftSx,
} from "../../../styles/applicationSurfaces";
import AdminHeader from "./AdminHeader";
import studentWaitingListService from "../../../services/studentWaitingListService";

const studentWaitingListPageSx = {
  flex: 1,
  minHeight: 0,
  width: "100%",
  display: "flex",
  flexDirection: "column",
};

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

const LOCATION_OPTIONS = [
  { value: "O", label: "OnSite" },
  { value: "I", label: "Internet" },
];

const STATUS_OPTIONS = [
  { value: "A", label: "Approved" },
  { value: "D", label: "Declined" },
];

// Parse StudentClassInfo legacy format: Fname E$~# Lname E$~# Class E$~# Email E$~# Sem E$~# Grade E$~# Location E$~# ChapterID E$~# Password
function parseStudentClassInfo(str) {
  if (!str || typeof str !== "string") return {};
  const arr = str.split("E$~#");
  return {
    firstName: (arr[0] || "").trim(),
    lastName: (arr[1] || "").trim(),
    class: (arr[2] || "").trim(),
    email: (arr[3] || "").trim(),
    session: (arr[4] || "").trim(),
    grade: (arr[5] || "").trim(),
    location: (arr[6] || "").trim(),
    chapterID: (arr[7] || "").trim(),
    password: (arr[8] || "").trim(),
  };
}

/** Legacy UpdateClass + drLocation: O/I from parsed value or EventLocation display text. */
function waitingListLocationCode(parsedLocation, eventLocation) {
  const p = (parsedLocation || "").trim().toUpperCase();
  if (p === "I" || p === "O") return p;
  const s = (eventLocation || "").toString().toLowerCase();
  if (s.includes("internet") || s === "i" || s === "online") return "I";
  return "O";
}

/** Legacy StudentWaitingList.aspx.cs UpdateClass() section default. */
function waitingListDefaultSection(classCode, chapterID) {
  const cls = (classCode || "").trim();
  const ch = String(chapterID ?? "").trim();
  return cls === "SI" || cls === "SA" || ch !== "1" ? "A" : "B";
}

const StudentWaitingList = () => {
  const { user, isAuthenticated } = useAuth();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [waitingForOnSite, setWaitingForOnSite] = useState("N");
  const [chapterLocations, setChapterLocations] = useState([]);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    chapterID: "",
    location: "O",
    session: "F2024",
    class: "",
    section: "A",
    applicationStatus: "A",
    reason: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [orderBy, setOrderBy] = useState("studentID");
  const [order, setOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [goToPageInput, setGoToPageInput] = useState("1");
  const [searchBy, setSearchBy] = useState("ALL");
  const [searchCriteria, setSearchCriteria] = useState("contains");
  const [searchText, setSearchText] = useState("");
  const pageSize = 10;
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const username = user?.email || user?.username || "";

  const loadList = async () => {
    if (!username) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await studentWaitingListService.getStudentWaitingList({
        WaitingForOnSite: waitingForOnSite,
        Username: username,
      });
      const data = res?.studentWaitingList ?? res?.StudentWaitingList;
      if (res?.isSuccess && Array.isArray(data)) {
        setList(
          data
            .map((row) =>
              row && typeof row === "object"
                ? {
                    studentID: row.studentID ?? row.StudentID,
                    studentName: row.studentName ?? row.StudentName,
                    eventLocation: row.eventLocation ?? row.EventLocation,
                    class: row.class ?? row.Class,
                    grade: row.grade ?? row.Grade,
                    school: row.school ?? row.School,
                    parentName: row.parentName ?? row.ParentName,
                    phoneNumber: row.phoneNumber ?? row.PhoneNumber,
                    emailAddress: row.emailAddress ?? row.EmailAddress,
                    eventSession: row.eventSession ?? row.EventSession,
                    registeredDate: row.registeredDate ?? row.RegisteredDate,
                    password: row.password ?? row.Password,
                    city: row.city ?? row.City,
                    state: row.state ?? row.State,
                    country: row.country ?? row.Country,
                    applicationStatus:
                      row.applicationStatus ?? row.ApplicationStatus,
                    studentClassInfo:
                      row.studentClassInfo ?? row.StudentClassInfo,
                  }
                : null,
            )
            .filter(Boolean),
        );
      } else {
        setList([]);
      }
    } catch (err) {
      console.error("Error loading student waiting list:", err);
      const msg =
        err?.response?.data?.message ??
        err?.response?.data?.errorMessage ??
        err?.response?.data?.title ??
        err?.message ??
        "Error loading Student waiting list.";
      setSnackbar({
        open: true,
        message: msg,
        severity: "error",
      });
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  const loadChapterLocations = async () => {
    try {
      const res = await studentWaitingListService.getChapterLocation({
        Mode: "N",
      });
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
  }, [isAuthenticated, user, waitingForOnSite]);

  useEffect(() => {
    loadChapterLocations();
  }, []);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    setGoToPageInput("1");
  };

  const handlePageChange = (page) => {
    const totalPages = Math.ceil(
      (filteredAndSortedList?.length || 0) / pageSize,
    );
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setGoToPageInput(String(page));
    }
  };

  const handleGoToPage = () => {
    const page = parseInt(goToPageInput, 10);
    const totalPages = Math.ceil(
      (filteredAndSortedList?.length || 0) / pageSize,
    );
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
          case "STUDENT_ID":
            fieldValue = (row.studentID ?? "").toString();
            break;
          case "STUDENT_NAME":
            fieldValue = row.studentName ?? "";
            break;
          case "CLASS":
            fieldValue = row.class ?? "";
            break;
          case "GRADE":
            fieldValue = row.grade ?? "";
            break;
          case "SCHOOL":
            fieldValue = row.school ?? "";
            break;
          case "PARENT":
            fieldValue = row.parentName ?? "";
            break;
          case "EMAIL":
            fieldValue = row.emailAddress ?? "";
            break;
          case "STATUS":
            fieldValue = row.applicationStatus ?? "";
            break;
          default:
            return true;
        }
        fieldValue = String(fieldValue).toLowerCase();
        const search = searchText.trim().toLowerCase();
        if (searchCriteria === "equals") return fieldValue === search;
        if (searchCriteria === "starts_with")
          return fieldValue.startsWith(search);
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
      return order === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
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
    const parsed = parseStudentClassInfo(row.studentClassInfo);
    const classCode = (parsed.class || row.class || "").trim();
    const chapterID = (parsed.chapterID || "").trim();
    setForm({
      firstName:
        parsed.firstName || (row.studentName || "").split(" ")[0] || "",
      lastName:
        parsed.lastName ||
        (row.studentName || "").split(" ").slice(1).join(" ") ||
        "",
      chapterID,
      location: waitingListLocationCode(parsed.location, row.eventLocation),
      session: parsed.session || row.eventSession || "F2024",
      class: classCode,
      section: waitingListDefaultSection(classCode, chapterID),
      applicationStatus: row.applicationStatus === "Declined" ? "D" : "A",
      reason: "",
    });
    setReviewOpen(true);
  };

  const handleDeleteClick = (row) => {
    setSelectedRow(row);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedRow?.studentID) return;
    setSubmitting(true);
    try {
      const res = await studentWaitingListService.deleteStudent({
        StudentId: String(selectedRow.studentID),
      });
      if (res?.isSuccess) {
        setSnackbar({
          open: true,
          message: res.message || "Student removed successfully.",
          severity: "success",
        });
        setDeleteConfirmOpen(false);
        setSelectedRow(null);
        loadList();
      } else {
        setSnackbar({
          open: true,
          message: res?.errorMessage || "Delete failed.",
          severity: "error",
        });
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

  const handleReviewSubmit = async () => {
    if (!selectedRow) return;
    setSubmitting(true);
    try {
      const res =
        await studentWaitingListService.updateStudentWaitingListStatus({
          StudentID: String(selectedRow.studentID),
          Class: form.class,
          Section: form.section,
          ChapterID: form.chapterID,
          Location: form.location,
          Session: form.session,
          ApplicationStatus: form.applicationStatus,
          FirstName: form.firstName,
          LastName: form.lastName,
          Email:
            selectedRow.emailAddress ||
            parseStudentClassInfo(selectedRow.studentClassInfo).email,
          Password:
            parseStudentClassInfo(selectedRow.studentClassInfo).password ||
            selectedRow.password,
          Reason: form.reason,
        });
      if (res?.isSuccess) {
        setSnackbar({
          open: true,
          message: res.message || "Application updated successfully.",
          severity: "success",
        });
        setReviewOpen(false);
        setSelectedRow(null);
        loadList();
      } else {
        setSnackbar({
          open: true,
          message: res?.errorMessage || "Update failed.",
          severity: "error",
        });
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
      const res = await studentWaitingListService.exportToExcel({
        Username: username,
        Mode: "E",
      });
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
      const contentType =
        res?.contentType ??
        res?.ContentType ??
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      const blob = new Blob(
        [Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))],
        { type: contentType },
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = res?.fileName ?? res?.FileName ?? "StudentWaitingList.xlsx";
      a.click();
      URL.revokeObjectURL(url);
      setSnackbar({
        open: true,
        message: "Export downloaded.",
        severity: "success",
      });
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
    <Box sx={studentWaitingListPageSx}>
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
                  sx={{ fontWeight: 600, color: APPLICATION_ADMIN_TITLE_COLOR, fontSize: "1rem" }}
                >
                  Student Waiting List
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
                    variant={
                      waitingForOnSite === "Y" ? "contained" : "outlined"
                    }
                    color="primary"
                    size="small"
                    onClick={() =>
                      setWaitingForOnSite((v) => (v === "Y" ? "N" : "Y"))
                    }
                    sx={{ fontSize: "0.75rem", px: 1.5, py: 0.25 }}
                  >
                    Waiting for OnSite Class
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
                        <MenuItem
                          value="STUDENT_ID"
                          sx={{ fontSize: "0.75rem" }}
                        >
                          Student #
                        </MenuItem>
                        <MenuItem
                          value="STUDENT_NAME"
                          sx={{ fontSize: "0.75rem" }}
                        >
                          Student Name
                        </MenuItem>
                        <MenuItem value="CLASS" sx={{ fontSize: "0.75rem" }}>
                          Class
                        </MenuItem>
                        <MenuItem value="GRADE" sx={{ fontSize: "0.75rem" }}>
                          Grade
                        </MenuItem>
                        <MenuItem value="SCHOOL" sx={{ fontSize: "0.75rem" }}>
                          School
                        </MenuItem>
                        <MenuItem value="PARENT" sx={{ fontSize: "0.75rem" }}>
                          Parent
                        </MenuItem>
                        <MenuItem value="EMAIL" sx={{ fontSize: "0.75rem" }}>
                          Email
                        </MenuItem>
                        <MenuItem value="STATUS" sx={{ fontSize: "0.75rem" }}>
                          Status
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
                        <MenuItem
                          value="starts_with"
                          sx={{ fontSize: "0.75rem" }}
                        >
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
                              width: "4%",
                              fontSize: "0.75rem",
                              padding: cellPadding,
                            }}
                          >
                            Edit
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: 400,
                              borderRight: "1px solid #4caf50",
                              width: "4%",
                              fontSize: "0.75rem",
                              padding: cellPadding,
                            }}
                          >
                            Delete
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
                              width: "6%",
                              fontSize: "0.75rem",
                              padding: cellPadding,
                            }}
                          >
                            Student #
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: 400,
                              borderRight: "1px solid #4caf50",
                              width: "14%",
                              fontSize: "0.75rem",
                              padding: cellPadding,
                            }}
                          >
                            Student Name
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: 400,
                              borderRight: "1px solid #4caf50",
                              width: "9%",
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
                              width: "11%",
                              fontSize: "0.75rem",
                              padding: cellPadding,
                            }}
                          >
                            Class
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
                            School
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
                            Parent
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
                            Contact #
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
                            Session
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
                            Reg. Date
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
                              width: "5%",
                              fontSize: "0.75rem",
                              padding: cellPadding,
                            }}
                          >
                            State
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: 400,
                              width: "5%",
                              fontSize: "0.75rem",
                              padding: cellPadding,
                            }}
                          >
                            Country
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {paginatedList.length > 0 ? (
                          paginatedList.map((row) => (
                            <TableRow
                              key={row.studentID}
                              sx={{
                                "&:nth-of-type(odd)": {
                                  backgroundColor: "#f9f9f9",
                                },
                              }}
                            >
                              <TableCell
                                sx={{
                                  borderRight: "1px solid #4caf50",
                                  fontSize: "0.75rem",
                                  padding: cellPadding,
                                  verticalAlign: "middle",
                                }}
                              >
                                <Tooltip title="Review">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleEdit(row)}
                                    sx={{ padding: "2px" }}
                                  >
                                    <EditIcon sx={{ fontSize: "1rem" }} />
                                  </IconButton>
                                </Tooltip>
                              </TableCell>
                              <TableCell
                                sx={{
                                  borderRight: "1px solid #4caf50",
                                  fontSize: "0.75rem",
                                  padding: cellPadding,
                                  verticalAlign: "middle",
                                }}
                              >
                                <Tooltip title="Delete">
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => handleDeleteClick(row)}
                                    disabled={row.studentID === 0}
                                    sx={{ padding: "2px" }}
                                  >
                                    <DeleteIcon sx={{ fontSize: "1rem" }} />
                                  </IconButton>
                                </Tooltip>
                              </TableCell>
                              <TableCell
                                sx={{
                                  borderRight: "1px solid #4caf50",
                                  fontSize: "0.75rem",
                                  padding: cellPadding,
                                }}
                              >
                                {row.applicationStatus ?? "-"}
                              </TableCell>
                              <TableCell
                                sx={{
                                  borderRight: "1px solid #4caf50",
                                  fontSize: "0.75rem",
                                  padding: cellPadding,
                                }}
                              >
                                {row.studentID ?? "-"}
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
                                <Tooltip title={row.studentName ?? "-"}>
                                  <span>{row.studentName ?? "-"}</span>
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
                                <Tooltip title={row.eventLocation ?? "-"}>
                                  <span>{row.eventLocation ?? "-"}</span>
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
                                <Tooltip title={row.class ?? "-"}>
                                  <span>{row.class ?? "-"}</span>
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
                                {row.parentName ?? "-"}
                              </TableCell>
                              <TableCell
                                sx={{
                                  borderRight: "1px solid #4caf50",
                                  fontSize: "0.75rem",
                                  padding: cellPadding,
                                }}
                              >
                                {row.phoneNumber ?? "-"}
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
                                <Tooltip title={row.emailAddress ?? "-"}>
                                  <span>{row.emailAddress ?? "-"}</span>
                                </Tooltip>
                              </TableCell>
                              <TableCell
                                sx={{
                                  borderRight: "1px solid #4caf50",
                                  fontSize: "0.75rem",
                                  padding: cellPadding,
                                }}
                              >
                                {row.eventSession ?? "-"}
                              </TableCell>
                              <TableCell
                                sx={{
                                  borderRight: "1px solid #4caf50",
                                  fontSize: "0.75rem",
                                  padding: cellPadding,
                                }}
                              >
                                {formatDate(row.registeredDate) || "-"}
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
                                }}
                              >
                                {row.state ?? "-"}
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontSize: "0.75rem",
                                  padding: cellPadding,
                                }}
                              >
                                {row.country ?? "-"}
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={17}
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

      {/* Review Application dialog */}
      <Dialog
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Review Application</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                value={form.firstName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, firstName: e.target.value }))
                }
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
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
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
              <FormControl fullWidth>
                <InputLabel>Location</InputLabel>
                <Select
                  value={form.location}
                  label="Location"
                  onChange={(e) =>
                    setForm((f) => ({ ...f, location: e.target.value }))
                  }
                >
                  {LOCATION_OPTIONS.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Session"
                value={form.session}
                onChange={(e) =>
                  setForm((f) => ({ ...f, session: e.target.value }))
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
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
              <FormControl fullWidth>
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
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Application Status</InputLabel>
                <Select
                  value={form.applicationStatus}
                  label="Application Status"
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      applicationStatus: e.target.value,
                    }))
                  }
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Reason"
                multiline
                rows={3}
                value={form.reason}
                onChange={(e) =>
                  setForm((f) => ({ ...f, reason: e.target.value }))
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleReviewSubmit}
            disabled={submitting}
          >
            {submitting ? "Submitting…" : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirm */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Delete student</DialogTitle>
        <DialogContent>
          Do you want to delete this student from the waiting list?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleDeleteConfirm}
            disabled={submitting}
          >
            {submitting ? "Deleting…" : "Delete"}
          </Button>
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

export default StudentWaitingList;
