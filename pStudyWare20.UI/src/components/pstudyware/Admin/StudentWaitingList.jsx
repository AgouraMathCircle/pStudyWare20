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
  Download as DownloadIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { useAuth } from "../../../contexts/AuthContext";
import {
  ADMIN_SESSION_LIST_CELL_PADDING,
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
  adminSessionListTableHeadRowSx,
  adminSessionListTitleSx,
  adminSessionListToolbarButtonSx,
} from "../styles/applicationSurfaces";
import AdminHeader from "./AdminHeader";
import AdminSessionListPagination from "./AdminSessionListPagination";
import SortableHeader from "../Common/SortableHeader";
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
    setCurrentPage(1);
    setGoToPageInput("1");
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
      await studentWaitingListService.exportToExcel({
        Username: username,
        Mode: "E",
      });
      setSnackbar({
        open: true,
        message: "Export downloaded.",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err?.message || "Export failed.",
        severity: "error",
      });
    }
  };

  const formatDate = (d) => {
    if (!d) return "";
    const date = typeof d === "string" ? new Date(d) : d;
    return isNaN(date.getTime()) ? d : date.toLocaleDateString();
  };

  const headCellSx = (width) => ({
    fontWeight: 400,
    width,
    fontSize: "0.75rem",
    padding: ADMIN_SESSION_LIST_CELL_PADDING,
  });

  return (
    <Box sx={studentWaitingListPageSx}>
      <AdminHeader user={user} />
      <Box sx={{ height: "48px" }} />
      <Container maxWidth="xl" sx={{ mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={adminSessionListPanelCardSx}>
              <CardContent sx={adminSessionListPanelContentSx}>
              <Box sx={adminSessionListHeaderBarSx}>
                <Typography variant="subtitle1" sx={adminSessionListTitleSx}>
                  Student Waiting List
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    startIcon={<DownloadIcon />}
                    onClick={handleExportExcel}
                    sx={adminSessionListToolbarButtonSx}
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
                    sx={adminSessionListToolbarButtonSx}
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
                    sx={adminSessionListToolbarButtonSx}
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
                  <Box sx={adminSessionListSearchBarSx}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Typography sx={adminSessionListSearchLabelSx}>
                        Search By:
                      </Typography>
                      <Select
                        value={searchBy}
                        onChange={(e) => setSearchBy(e.target.value)}
                        size="small"
                        sx={adminSessionListSearchSelectSx}
                      >
                        <MenuItem value="ALL" sx={adminSessionListMenuItemSx}>
                          -ALL-
                        </MenuItem>
                        <MenuItem value="STUDENT_ID" sx={adminSessionListMenuItemSx}>
                          Student #
                        </MenuItem>
                        <MenuItem value="STUDENT_NAME" sx={adminSessionListMenuItemSx}>
                          Student Name
                        </MenuItem>
                        <MenuItem value="CLASS" sx={adminSessionListMenuItemSx}>
                          Class
                        </MenuItem>
                        <MenuItem value="GRADE" sx={adminSessionListMenuItemSx}>
                          Grade
                        </MenuItem>
                        <MenuItem value="SCHOOL" sx={adminSessionListMenuItemSx}>
                          School
                        </MenuItem>
                        <MenuItem value="PARENT" sx={adminSessionListMenuItemSx}>
                          Parent
                        </MenuItem>
                        <MenuItem value="EMAIL" sx={adminSessionListMenuItemSx}>
                          Email
                        </MenuItem>
                        <MenuItem value="STATUS" sx={adminSessionListMenuItemSx}>
                          Status
                        </MenuItem>
                      </Select>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Typography sx={adminSessionListSearchLabelSx}>
                        Criteria:
                      </Typography>
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
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
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

                  <TableContainer component={Paper} sx={{ width: "100%" }}>
                    <Table sx={adminSessionListGridTableSx} size="small">
                      <TableHead>
                        <TableRow sx={adminSessionListTableHeadRowSx}>
                          <TableCell sx={headCellSx("4%")}>Edit</TableCell>
                          <TableCell sx={headCellSx("4%")}>Delete</TableCell>
                          <SortableHeader label="Status" field="applicationStatus" sortField={orderBy} sortOrder={order} onSort={handleRequestSort} headCellSx={headCellSx("6%")} />
                          <SortableHeader label="Student #" field="studentID" sortField={orderBy} sortOrder={order} onSort={handleRequestSort} headCellSx={headCellSx("10%")} />
                          <SortableHeader label="Student Name" field="studentName" sortField={orderBy} sortOrder={order} onSort={handleRequestSort} headCellSx={headCellSx("14%")} />
                          <SortableHeader label="Location" field="eventLocation" sortField={orderBy} sortOrder={order} onSort={handleRequestSort} headCellSx={headCellSx("9%")} />
                          <SortableHeader label="Class" field="class" sortField={orderBy} sortOrder={order} onSort={handleRequestSort} headCellSx={headCellSx("11%")} />
                          <SortableHeader label="Grade" field="grade" sortField={orderBy} sortOrder={order} onSort={handleRequestSort} headCellSx={headCellSx("5%")} />
                          <SortableHeader label="School" field="school" sortField={orderBy} sortOrder={order} onSort={handleRequestSort} headCellSx={headCellSx("8%")} />
                          <SortableHeader label="Parent" field="parentName" sortField={orderBy} sortOrder={order} onSort={handleRequestSort} headCellSx={headCellSx("8%")} />
                          <SortableHeader label="Contact #" field="phoneNumber" sortField={orderBy} sortOrder={order} onSort={handleRequestSort} headCellSx={headCellSx("8%")} />
                          <SortableHeader label="Email" field="emailAddress" sortField={orderBy} sortOrder={order} onSort={handleRequestSort} headCellSx={headCellSx("5%")} />
                          <SortableHeader label="Session" field="eventSession" sortField={orderBy} sortOrder={order} onSort={handleRequestSort} headCellSx={headCellSx("6%")} />
                          <SortableHeader label="Reg. Date" field="registeredDate" sortField={orderBy} sortOrder={order} onSort={handleRequestSort} headCellSx={headCellSx("7%")} />
                          <SortableHeader label="City" field="city" sortField={orderBy} sortOrder={order} onSort={handleRequestSort} headCellSx={headCellSx("6%")} />
                          <SortableHeader label="State" field="state" sortField={orderBy} sortOrder={order} onSort={handleRequestSort} headCellSx={headCellSx("5%")} />
                          <SortableHeader label="Country" field="country" sortField={orderBy} sortOrder={order} onSort={handleRequestSort} headCellSx={headCellSx("5%")} />
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {paginatedList.length > 0 ? (
                          paginatedList.map((row) => (
                            <TableRow
                              key={row.studentID}
                              sx={adminSessionListTableBodyRowSx}
                            >
                              <TableCell sx={adminSessionListTableBodyCellSx({ action: true })}>
                                <Box
                                  onClick={() => handleEdit(row)}
                                  sx={adminSessionListTableActionLinkSx}
                                >
                                  Edit
                                </Box>
                              </TableCell>
                              <TableCell sx={adminSessionListTableBodyCellSx({ action: true })}>
                                {row.studentID === 0 ? (
                                  "—"
                                ) : (
                                  <Box
                                    onClick={() => handleDeleteClick(row)}
                                    sx={adminSessionListTableActionLinkSx}
                                  >
                                    Delete
                                  </Box>
                                )}
                              </TableCell>
                              <TableCell sx={adminSessionListTableBodyCellSx()}>
                                {row.applicationStatus ?? "-"}
                              </TableCell>
                              <TableCell sx={adminSessionListTableBodyCellSx()}>
                                {row.studentID ?? "-"}
                              </TableCell>
                              <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
                                <Tooltip title={row.studentName ?? "-"}>
                                  <span>{row.studentName ?? "-"}</span>
                                </Tooltip>
                              </TableCell>
                              <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
                                <Tooltip title={row.eventLocation ?? "-"}>
                                  <span>{row.eventLocation ?? "-"}</span>
                                </Tooltip>
                              </TableCell>
                              <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
                                <Tooltip title={row.class ?? "-"}>
                                  <span>{row.class ?? "-"}</span>
                                </Tooltip>
                              </TableCell>
                              <TableCell sx={adminSessionListTableBodyCellSx()}>
                                {row.grade ?? "-"}
                              </TableCell>
                              <TableCell sx={adminSessionListTableBodyCellSx()}>
                                {row.school ?? "-"}
                              </TableCell>
                              <TableCell sx={adminSessionListTableBodyCellSx()}>
                                {row.parentName ?? "-"}
                              </TableCell>
                              <TableCell sx={adminSessionListTableBodyCellSx()}>
                                {row.phoneNumber ?? "-"}
                              </TableCell>
                              <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
                                <Tooltip title={row.emailAddress ?? "-"}>
                                  <span>{row.emailAddress ?? "-"}</span>
                                </Tooltip>
                              </TableCell>
                              <TableCell sx={adminSessionListTableBodyCellSx()}>
                                {row.eventSession ?? "-"}
                              </TableCell>
                              <TableCell sx={adminSessionListTableBodyCellSx()}>
                                {formatDate(row.registeredDate) || "-"}
                              </TableCell>
                              <TableCell sx={adminSessionListTableBodyCellSx()}>
                                {row.city ?? "-"}
                              </TableCell>
                              <TableCell sx={adminSessionListTableBodyCellSx()}>
                                {row.state ?? "-"}
                              </TableCell>
                              <TableCell sx={adminSessionListTableBodyCellSx({ isLast: true })}>
                                {row.country ?? "-"}
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={17} align="center" sx={adminSessionListEmptyCellSx}>
                              <Typography variant="body2" color="textSecondary" sx={adminSessionListEmptyTextSx}>
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
