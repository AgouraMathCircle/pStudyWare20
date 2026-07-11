import React, { useState, useEffect, useMemo } from "react";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  CircularProgress,
  FormControl,
  InputLabel,
  Grid,
  Container,
  Card,
  CardContent,
} from "@mui/material";
import {
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { useAuth } from "../../../contexts/AuthContext";
import registeredStudentListService from "../../../services/registeredStudentListService";
import AdminHeader, { AdminRoleHeaderSpacer } from "./AdminHeader";
import AdminSessionListPagination from "./AdminSessionListPagination";
import AppConfirmDialog from "../Common/AppConfirmDialog";
import PortalDialog from "../Common/PortalDialog";
import PortalModalSelect from "../Common/PortalModalSelect";
import { portalModalFieldSx, portalModalSendButtonSx } from "../Common/portalModalStyles";
import SortableHeader from "../Common/SortableHeader";
import AppSnackbar from "../Common/AppSnackbar";
import { useAppSnackbar } from "../Common/useAppSnackbar";
import {
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
  adminSessionListTableDeleteLinkSx,
  adminSessionListTableBodyCellSx,
  adminSessionListTableBodyRowSx,
  adminSessionListTableHeadCellSx,
  adminSessionListTableHeadRowSx,
  adminSessionListTitleSx,
} from "../styles/applicationSurfaces";

// Legacy RegistertedStudentList StudentClassInfo:
// Fname~#Lname~#Class~#Email~#Location~#Section~#ChapterID~#Session
function parseRegisteredStudentClassInfo(str) {
  if (!str || typeof str !== "string") return {};
  const arr = str.split("~#");
  return {
    firstName: (arr[0] || "").trim(),
    lastName: (arr[1] || "").trim(),
    class: (arr[2] || "").trim(),
    email: (arr[3] || "").trim(),
    location: (arr[4] || "").trim(),
    section: (arr[5] || "").trim(),
    chapterId: (arr[6] || "").trim(),
    session: (arr[7] || "").trim(),
  };
}

function registeredListLocationCode(parsedLocation, eventLocation) {
  const code = (parsedLocation || "").trim().toUpperCase();
  if (code === "I" || code === "O") return code;
  const display = (eventLocation || "").toString().toLowerCase();
  if (display.includes("internet") || display === "i" || display === "online") {
    return "I";
  }
  return "O";
}

function resolveRegisteredChapterId(student, parsed, chapters) {
  const parsedId = String(parsed.chapterId ?? "").trim();
  if (parsedId) return parsedId;
  const chapterName = String(student.chapter ?? "").trim();
  if (!chapterName || !chapters?.length) return "";
  const match = chapters.find(
    (chapter) =>
      String(chapter.chapterName ?? chapter.ChapterName ?? "").trim() ===
      chapterName
  );
  return match ? String(match.chapterID ?? match.ChapterID ?? "") : "";
}

function mapSessionOptions(options) {
  if (!Array.isArray(options) || options.length === 0) {
    return BASE_SESSION_OPTIONS;
  }
  return options
    .map((option) => ({
      value: String(option.value ?? option.Value ?? "").trim(),
      label: String(option.label ?? option.Label ?? option.value ?? option.Value ?? "").trim(),
    }))
    .filter((option) => option.value);
}

function getRegisteredChapterLabel(chapterId, chapters) {
  const id = String(chapterId ?? "").trim();
  if (!id) return "";
  const match = (chapters || []).find(
    (chapter) => String(chapter.chapterID ?? chapter.ChapterID ?? "") === id
  );
  if (!match) return `Chapter ${id}`;
  return String(
    match.chapterName ?? match.ChapterName ?? match.label ?? match.Label ?? id
  ).trim();
}

const CLASS_OPTIONS = [
  { value: "JB", label: "Junior Beginner" },
  { value: "JI", label: "Junior Intermediate" },
  { value: "JA", label: "Junior Advanced" },
  { value: "SB", label: "Senior Beginner" },
  { value: "SI", label: "Senior Intermediate" },
  { value: "SA", label: "Senior Advanced" },
  { value: "DS", label: "Data Science" },
  { value: "AI", label: "Artificial Intelligence" },
  { value: "GD", label: "Game Development" },
  { value: "AD", label: "App Development" },
  { value: "DM", label: "Data Management" },
  { value: "ST", label: "SAT/PSAT" },
  { value: "AT", label: "ACT" },
  { value: "ED", label: "Engineering Design" },
];

const SECTION_OPTIONS = [
  { value: "A", label: "A" },
  { value: "B", label: "B" },
];

const LOCATION_OPTIONS = [
  { value: "O", label: "OnSite" },
  { value: "I", label: "Internet" },
];

const REGISTERED_STUDENT_LIST_REFERRERS = {
  "message-center": {
    label: "Back to Message Center",
    path: "/pstudyware/admin/message-center",
  },
  "student-waiting-list": {
    label: "Back to Student Waiting List",
    path: "/pstudyware/admin/Studentwaiting-list",
  },
};

const registeredStudentListBackLinkSx = {
  ...adminSessionListFindButtonSx,
  backgroundColor: "transparent",
  color: "#1b5e20",
  border: "1px solid #43a047",
  flexShrink: 0,
  px: 1.5,
  textTransform: "none",
  "&:hover": {
    backgroundColor: "rgba(67, 160, 71, 0.08)",
    borderColor: "#2e7d32",
  },
};

const BASE_SESSION_OPTIONS = [
  { value: "F2024", label: "Fall 2024" },
  { value: "S2024", label: "Spring 2024" },
];

const registeredListDeleteLinkSx = {
  ...adminSessionListTableDeleteLinkSx,
};

const registeredStudentIdCellSx = {
  ...adminSessionListTableBodyCellSx({ ellipsis: true }),
  width: "6%",
  maxWidth: 72,
  whiteSpace: "nowrap",
};

const registeredStudentIdHeadCellSx = adminSessionListTableHeadCellSx("6%");

async function copyTextToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  document.body.removeChild(textarea);
  return copied;
}

const RegisteredListCopyCell = ({ value, onCopied }) => {
  const display =
    value == null || value === "" ? "—" : String(value).trim() || "—";
  const canCopy = display !== "—";

  const handleClick = async (event) => {
    event.stopPropagation();
    if (!canCopy) return;
    try {
      const copied = await copyTextToClipboard(display);
      if (copied) {
        onCopied?.(display);
      }
    } catch {
      // ignore copy failures
    }
  };

  return (
    <Tooltip title={canCopy ? `${display} (click to copy)` : display}>
      <Box
        component="span"
        onClick={handleClick}
        sx={{
          display: "block",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          maxWidth: "100%",
          cursor: canCopy ? "pointer" : "default",
        }}
      >
        {display}
      </Box>
    </Tooltip>
  );
};

const RegisteredStudentList = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  // State management
  const [students, setStudents] = useState([]);
  const [chapterLocations, setChapterLocations] = useState([]);
  const [sessionOptions, setSessionOptions] = useState(BASE_SESSION_OPTIONS);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { snackbar, showSnackbar, closeSnackbar } = useAppSnackbar();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchBy, setSearchBy] = useState("ALL");
  const [searchCriteria, setSearchCriteria] = useState("");
  const [searchText, setSearchText] = useState("");
  const [orderBy, setOrderBy] = useState("studentID");
  const [order, setOrder] = useState("asc");
  const [goToPageInput, setGoToPageInput] = useState("1");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [privileges, setPrivileges] = useState({
    canUpdateStudents: false,
    canDeleteStudents: false,
    canExportData: false,
  });

  // Update form state
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updateFormData, setUpdateFormData] = useState({
    studentId: "",
    firstName: "",
    lastName: "",
    class: "JB",
    section: "A",
    chapterId: "",
    location: "O",
    session: "F2024",
    email: "",
  });

  const pageSize = 25; // Match original page size

  const sessionSelectOptions = useMemo(() => {
    const options = [...sessionOptions];
    const currentSession = updateFormData.session?.trim();
    if (
      currentSession &&
      !options.some((option) => option.value === currentSession)
    ) {
      options.unshift({ value: currentSession, label: currentSession });
    }
    return options.length ? options : BASE_SESSION_OPTIONS;
  }, [sessionOptions, updateFormData.session]);

  const listReferrer = useMemo(() => {
    const from = searchParams.get("from");
    return REGISTERED_STUDENT_LIST_REFERRERS[from] ?? null;
  }, [searchParams]);

  // Load data on component mount
  useEffect(() => {
    fetchData();
    checkPrivileges();
  }, []);

  useEffect(() => {
    const searchByParam = searchParams.get("searchBy");
    const searchCriteriaParam = searchParams.get("searchCriteria");
    const searchTextParam = searchParams.get("searchText");

    if (!searchByParam || !searchTextParam) {
      return;
    }

    setSearchBy(searchByParam);
    setSearchCriteria(searchCriteriaParam || "equals");
    setSearchText(searchTextParam);
    setCurrentPage(1);
    setGoToPageInput("1");
  }, [searchParams]);

  // Fetch dashboard data
  const fetchData = async ({ quiet = false } = {}) => {
    try {
      if (!quiet) {
        setLoading(true);
      }
      const response = await registeredStudentListService.getDashboardData();

      if (response.isSuccess) {
        setStudents(response.studentList || []);
        setChapterLocations(response.chapterLocations || []);
        setSessionOptions(mapSessionOptions(response.sessionOptions));
      } else {
        showSnackbar(response.errorMessage || "Failed to load data", "error");
      }
    } catch (err) {
      showSnackbar(err.message || "An error occurred while loading data", "error");
      console.error("Error fetching data:", err);
    } finally {
      if (!quiet) {
        setLoading(false);
      }
    }
  };

  // Check user privileges
  const checkPrivileges = async () => {
    try {
      const response =
        await registeredStudentListService.checkRegisteredStudentListPrivileges();
      if (response.isSuccess) {
        setPrivileges({
          canUpdateStudents: response.canUpdateStudents,
          canDeleteStudents: response.canDeleteStudents,
          canExportData: response.canExportData,
        });
      }
    } catch (err) {
      console.error("Error checking privileges:", err);
    }
  };

  // Handle update class button click (legacy RegistertedStudentList.aspx UpdateClass)
  const handleUpdateClass = (student) => {
    const parsed = parseRegisteredStudentClassInfo(
      student.studentClassInfo ?? student.StudentClassInfo ?? ""
    );
    const nameParts = (student.studentName || "").trim().split(/\s+/);
    const chapterId = resolveRegisteredChapterId(
      student,
      parsed,
      chapterLocations
    );

    setUpdateFormData({
      studentId: String(student.studentID ?? ""),
      firstName: parsed.firstName || nameParts[0] || "",
      lastName: parsed.lastName || nameParts.slice(1).join(" ") || "",
      class: parsed.class || "JB",
      email: parsed.email || student.emailAddress || "",
      location: registeredListLocationCode(parsed.location, student.eventLocation),
      section: parsed.section || "A",
      chapterId,
      session: parsed.session || student.eventSession || sessionOptions[0]?.value || "F2024",
    });
    setShowUpdateForm(true);
  };

  const handleUpdateSubmit = async () => {
    if (!updateFormData.studentId || updateFormData.studentId === "0") {
      showSnackbar("Invalid student selected for update.", "error");
      return;
    }
    if (!updateFormData.chapterId) {
      showSnackbar("Please select a chapter.", "error");
      return;
    }
    if (!updateFormData.class || !updateFormData.section || !updateFormData.location) {
      showSnackbar("Class, section, and location are required.", "error");
      return;
    }
    if (!updateFormData.session) {
      showSnackbar("Please select a session.", "error");
      return;
    }

    try {
      setSubmitting(true);

      const classLabel =
        CLASS_OPTIONS.find((option) => option.value === updateFormData.class)?.label ??
        updateFormData.class;
      const chapterName =
        chapterLocations.find(
          (chapter) =>
            String(chapter.chapterID ?? chapter.ChapterID) ===
            String(updateFormData.chapterId)
        )?.chapterName ??
        chapterLocations.find(
          (chapter) =>
            String(chapter.chapterID ?? chapter.ChapterID) ===
            String(updateFormData.chapterId)
        )?.ChapterName ??
        "";
      const locationLabel =
        LOCATION_OPTIONS.find((option) => option.value === updateFormData.location)
          ?.label ?? updateFormData.location;

      const request = {
        studentId: updateFormData.studentId,
        firstName: updateFormData.firstName,
        lastName: updateFormData.lastName,
        class: updateFormData.class,
        section: updateFormData.section,
        chapterId: updateFormData.chapterId,
        location: updateFormData.location,
        session: updateFormData.session,
        email: updateFormData.email,
        classLabel,
        chapterName,
        locationLabel,
      };

      const response = await registeredStudentListService.updateStudentClass(
        request
      );

      if (response.isSuccess) {
        const message =
          response.message || "You have updated the class/location successfully";
        showSnackbar(message, "success");
        setShowUpdateForm(false);
        await fetchData({ quiet: true });
      } else {
        showSnackbar(
          response.errorMessage || "Failed to update student class",
          "error"
        );
      }
    } catch (err) {
      const message =
        err?.code === "ECONNABORTED"
          ? "The request timed out. Please try again."
          : err?.response?.data?.errorMessage ??
            err?.response?.data?.message ??
            err?.message ??
            "An error occurred while updating student class";
      showSnackbar(message, "error");
      console.error("Error updating student class:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete student
  const handleDeleteStudent = (studentId) => {
    if (!studentId || studentId === "0") {
      showSnackbar("You cannot delete this student.", "error");
      return;
    }

    setStudentToDelete(studentId);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirmClose = () => {
    if (loading) {
      return;
    }
    setDeleteConfirmOpen(false);
    setStudentToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!studentToDelete) {
      return;
    }

    try {
      setLoading(true);

      const response = await registeredStudentListService.deleteStudent(
        studentToDelete
      );

      if (response.isSuccess) {
        showSnackbar(
          response.message || "You have deleted the student successfully",
          "success"
        );
        handleDeleteConfirmClose();
        fetchData();
      } else {
        showSnackbar(response.errorMessage || "Failed to delete student", "error");
      }
    } catch (err) {
      const apiMessage =
        err.response?.data?.errorMessage ||
        err.response?.data?.message ||
        err.response?.data?.error;
      showSnackbar(
        apiMessage || err.message || "An error occurred while deleting student",
        "error"
      );
      console.error("Error deleting student:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle export to Excel
  const handleExportToExcel = async () => {
    try {
      setLoading(true);

      const request = {
        username: "", // Will use JWT token
        mode: "E",
      };

      await registeredStudentListService.exportStudentListToExcel(request);
      showSnackbar("Excel file downloaded successfully", "success");
    } catch (err) {
      showSnackbar(err.message || "An error occurred while exporting to Excel", "error");
      console.error("Error exporting to Excel:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    const totalPages = Math.ceil(
      (filteredAndSortedStudents?.length || 0) / pageSize
    );
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setGoToPageInput(page.toString());
    }
  };

  // Handle go to specific page
  const handleGoToPage = () => {
    const page = parseInt(goToPageInput);
    const totalPages = Math.ceil(
      (filteredAndSortedStudents?.length || 0) / pageSize
    );
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    } else {
      setGoToPageInput(currentPage.toString());
    }
  };

  // Handle search
  const handleSearch = () => {
    setCurrentPage(1);
    setGoToPageInput("1");
  };

  const handleSort = (field) => {
    const isAsc = orderBy === field && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(field);
    setCurrentPage(1);
    setGoToPageInput("1");
  };

  const handleCellCopy = () => {
    showSnackbar("Copied to clipboard", "success");
  };

  const formatRegisteredDate = (value) => {
    if (!value) return "";
    const date = typeof value === "string" ? new Date(value) : value;
    return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString();
  };

  const renderCopyCell = (value, { isLast = false, cellSx } = {}) => (
    <TableCell
      sx={
        cellSx ?? adminSessionListTableBodyCellSx({ ellipsis: true, isLast })
      }
    >
      <RegisteredListCopyCell value={value} onCopied={handleCellCopy} />
    </TableCell>
  );

  // Filter and sort students
  const filteredAndSortedStudents = useMemo(() => {
    if (!students || students.length === 0) return [];

    // Filter
    let filtered = students;
    if (searchBy !== "ALL" && searchText.trim()) {
      filtered = students.filter((student) => {
        let fieldValue = "";

        switch (searchBy) {
          case "STUDENT_ID":
            fieldValue = student.studentID?.toString() || "";
            break;
          case "STUDENT_NAME":
            fieldValue = student.studentName || "";
            break;
          case "CHAPTER":
            fieldValue = student.chapter || "";
            break;
          case "CLASS":
            fieldValue = student.class || "";
            break;
          case "GRADE":
            fieldValue = student.grade || "";
            break;
          case "SCHOOL":
            fieldValue = student.school || "";
            break;
          case "PARENT":
            fieldValue = student.parentName || "";
            break;
          case "PHONE":
            fieldValue = student.phoneNumber || "";
            break;
          case "EMAIL":
            fieldValue = student.emailAddress || "";
            break;
          case "SESSION":
            fieldValue = student.eventSession || "";
            break;
          case "LOCATION":
            fieldValue = student.eventLocation || "";
            break;
          case "STATE":
            fieldValue = student.sState || "";
            break;
          case "CITY":
            fieldValue = student.city || "";
            break;
          default:
            return true;
        }

        fieldValue = fieldValue.toString().toLowerCase();
        const search = searchText.toLowerCase();

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

    // Sort (default: Student ID numeric ASC)
    const sorted = [...filtered].sort((a, b) => {
      let aValue = a[orderBy];
      let bValue = b[orderBy];

      if (orderBy === "studentID") {
        const aNum = Number(aValue);
        const bNum = Number(bValue);
        const aValid = !Number.isNaN(aNum);
        const bValid = !Number.isNaN(bNum);
        if (aValid && bValid) {
          return order === "asc" ? aNum - bNum : bNum - aNum;
        }
        if (!aValid && !bValid) return 0;
        return order === "asc" ? (aValid ? -1 : 1) : aValid ? -1 : 1;
      }

      if (orderBy === "registeredDate") {
        const aTime = aValue ? new Date(aValue).getTime() : 0;
        const bTime = bValue ? new Date(bValue).getTime() : 0;
        if (!Number.isNaN(aTime) && !Number.isNaN(bTime)) {
          return order === "asc" ? aTime - bTime : bTime - aTime;
        }
      }

      if (aValue == null) aValue = "";
      if (bValue == null) bValue = "";

      aValue = aValue.toString().toLowerCase();
      bValue = bValue.toString().toLowerCase();

      if (order === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return sorted;
  }, [students, searchBy, searchCriteria, searchText, orderBy, order]);

  // Get paginated students
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredAndSortedStudents.slice(start, end);
  }, [filteredAndSortedStudents, currentPage]);

  const totalPages = Math.ceil(
    (filteredAndSortedStudents?.length || 0) / pageSize
  );
  const totalRecords = filteredAndSortedStudents?.length || 0;

  // Render loading state
  if (loading && !students.length) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <AdminHeader user={user} />
      <AdminRoleHeaderSpacer />
      <Container maxWidth="xl" sx={{ mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={adminSessionListPanelCardSx}>
              <CardContent sx={adminSessionListPanelContentSx}>
                <Box sx={adminSessionListHeaderBarSx}>
                  <Typography variant="subtitle1" sx={adminSessionListTitleSx}>
                    Student List
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {listReferrer && (
                      <Button
                        component={RouterLink}
                        to={listReferrer.path}
                        variant="outlined"
                        size="small"
                        startIcon={<ArrowBackIcon />}
                        sx={registeredStudentListBackLinkSx}
                      >
                        {listReferrer.label}
                      </Button>
                    )}
                    {privileges.canExportData && (
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        startIcon={<DownloadIcon />}
                        onClick={handleExportToExcel}
                        disabled={loading}
                        sx={{
                          ...adminSessionListFindButtonSx,
                          backgroundColor: "#4caf50",
                          color: "white",
                          flexShrink: 0,
                          px: 1.5,
                          "&:hover": { backgroundColor: "#43a047" },
                        }}
                      >
                        Export Excel
                      </Button>
                    )}
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
                      <MenuItem value="STUDENT_ID" sx={adminSessionListMenuItemSx}>
                        Student ID
                      </MenuItem>
                      <MenuItem value="STUDENT_NAME" sx={adminSessionListMenuItemSx}>
                        Student Name
                      </MenuItem>
                      <MenuItem value="CHAPTER" sx={adminSessionListMenuItemSx}>
                        Chapter
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
                      <MenuItem value="PHONE" sx={adminSessionListMenuItemSx}>
                        Phone
                      </MenuItem>
                      <MenuItem value="EMAIL" sx={adminSessionListMenuItemSx}>
                        Email
                      </MenuItem>
                      <MenuItem value="SESSION" sx={adminSessionListMenuItemSx}>
                        Session
                      </MenuItem>
                      <MenuItem value="LOCATION" sx={adminSessionListMenuItemSx}>
                        Location
                      </MenuItem>
                      <MenuItem value="STATE" sx={adminSessionListMenuItemSx}>
                        State
                      </MenuItem>
                      <MenuItem value="CITY" sx={adminSessionListMenuItemSx}>
                        City
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
                      <MenuItem value="" sx={adminSessionListMenuItemSx}>
                        Select Criteria
                      </MenuItem>
                      <MenuItem value="equals" sx={adminSessionListMenuItemSx}>
                        Equals
                      </MenuItem>
                      <MenuItem value="contains" sx={adminSessionListMenuItemSx}>
                        Contains
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
                        <TableCell
                          sx={adminSessionListTableHeadCellSx("4%")}
                        >
                          Edit
                        </TableCell>
                        <TableCell sx={adminSessionListTableHeadCellSx("4%")}>
                          Delete
                        </TableCell>
                        <SortableHeader
                          label="Student #"
                          field="studentID"
                          sortField={orderBy}
                          sortOrder={order}
                          onSort={handleSort}
                          headCellSx={registeredStudentIdHeadCellSx}
                        />
                        <SortableHeader
                          label="Student Name"
                          field="studentName"
                          sortField={orderBy}
                          sortOrder={order}
                          onSort={handleSort}
                          headCellSx={adminSessionListTableHeadCellSx("9%")}
                        />
                        <SortableHeader
                          label="Chapter"
                          field="chapter"
                          sortField={orderBy}
                          sortOrder={order}
                          onSort={handleSort}
                          headCellSx={adminSessionListTableHeadCellSx("7%")}
                        />
                        <SortableHeader
                          label="Class"
                          field="class"
                          sortField={orderBy}
                          sortOrder={order}
                          onSort={handleSort}
                          headCellSx={adminSessionListTableHeadCellSx("6%")}
                        />
                        <SortableHeader
                          label="Grade"
                          field="grade"
                          sortField={orderBy}
                          sortOrder={order}
                          onSort={handleSort}
                          headCellSx={adminSessionListTableHeadCellSx("4%")}
                        />
                        <SortableHeader
                          label="School"
                          field="school"
                          sortField={orderBy}
                          sortOrder={order}
                          onSort={handleSort}
                          headCellSx={adminSessionListTableHeadCellSx("9%")}
                        />
                        <SortableHeader
                          label="Parent"
                          field="parentName"
                          sortField={orderBy}
                          sortOrder={order}
                          onSort={handleSort}
                          headCellSx={adminSessionListTableHeadCellSx("7%")}
                        />
                        <SortableHeader
                          label="Phone"
                          field="phoneNumber"
                          sortField={orderBy}
                          sortOrder={order}
                          onSort={handleSort}
                          headCellSx={adminSessionListTableHeadCellSx("6%")}
                        />
                        <SortableHeader
                          label="Email"
                          field="emailAddress"
                          sortField={orderBy}
                          sortOrder={order}
                          onSort={handleSort}
                          headCellSx={adminSessionListTableHeadCellSx("9%")}
                        />
                        <SortableHeader
                          label="Session"
                          field="eventSession"
                          sortField={orderBy}
                          sortOrder={order}
                          onSort={handleSort}
                          headCellSx={adminSessionListTableHeadCellSx("5%")}
                        />
                        <SortableHeader
                          label="Location"
                          field="eventLocation"
                          sortField={orderBy}
                          sortOrder={order}
                          onSort={handleSort}
                          headCellSx={adminSessionListTableHeadCellSx("5%")}
                        />
                        <SortableHeader
                          label="Reg. Date"
                          field="registeredDate"
                          sortField={orderBy}
                          sortOrder={order}
                          onSort={handleSort}
                          headCellSx={adminSessionListTableHeadCellSx("7%")}
                        />
                        <SortableHeader
                          label="State"
                          field="sState"
                          sortField={orderBy}
                          sortOrder={order}
                          onSort={handleSort}
                          headCellSx={adminSessionListTableHeadCellSx("5%")}
                        />
                        <SortableHeader
                          label="City"
                          field="city"
                          sortField={orderBy}
                          sortOrder={order}
                          onSort={handleSort}
                          headCellSx={adminSessionListTableHeadCellSx("5%", true)}
                        />
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedStudents.length > 0 ? (
                        paginatedStudents.map((student, index) => (
                          <TableRow
                            key={student.studentID || index}
                            sx={adminSessionListTableBodyRowSx}
                          >
                            <TableCell sx={adminSessionListTableBodyCellSx({ action: true })}>
                              {privileges.canUpdateStudents ? (
                                <Box
                                  onClick={() => handleUpdateClass(student)}
                                  sx={adminSessionListTableActionLinkSx}
                                >
                                  Edit
                                </Box>
                              ) : (
                                "—"
                              )}
                            </TableCell>
                            <TableCell sx={adminSessionListTableBodyCellSx({ action: true })}>
                              {privileges.canDeleteStudents ? (
                                <Box
                                  onClick={() => handleDeleteStudent(student.studentID)}
                                  sx={registeredListDeleteLinkSx}
                                >
                                  Delete
                                </Box>
                              ) : (
                                "—"
                              )}
                            </TableCell>
                            {renderCopyCell(student.studentID, {
                              cellSx: registeredStudentIdCellSx,
                            })}
                            {renderCopyCell(student.studentName)}
                            {renderCopyCell(student.chapter)}
                            {renderCopyCell(student.class)}
                            {renderCopyCell(student.grade)}
                            {renderCopyCell(student.school)}
                            {renderCopyCell(student.parentName)}
                            {renderCopyCell(student.phoneNumber)}
                            {renderCopyCell(student.emailAddress)}
                            {renderCopyCell(student.eventSession)}
                            {renderCopyCell(student.eventLocation)}
                            {renderCopyCell(formatRegisteredDate(student.registeredDate))}
                            {renderCopyCell(student.sState)}
                            {renderCopyCell(student.city, { isLast: true })}
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={16} align="center" sx={adminSessionListEmptyCellSx}>
                            <Typography variant="body2" color="textSecondary" sx={adminSessionListEmptyTextSx}>
                              {searchText
                                ? "No students found matching your search criteria."
                                : "No student data available."}
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

                <PortalDialog
                  open={showUpdateForm}
                  onClose={() => !submitting && setShowUpdateForm(false)}
                  maxWidth="sm"
                  disableClose={submitting}
                  ariaLabelledby="update-class-dialog-title"
                  title="Update Class"
                  icon={<EditIcon sx={{ fontSize: 20 }} />}
                  actions={
                    <Button
                      onClick={handleUpdateSubmit}
                      variant="contained"
                      disabled={submitting}
                      startIcon={
                        submitting ? (
                          <CircularProgress size={16} color="inherit" />
                        ) : null
                      }
                      sx={portalModalSendButtonSx}
                    >
                      {submitting ? "Saving…" : "Submit"}
                    </Button>
                  }
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="First Name"
                        value={updateFormData.firstName}
                        size="small"
                        InputProps={{ readOnly: true }}
                        sx={portalModalFieldSx}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        value={updateFormData.lastName}
                        size="small"
                        InputProps={{ readOnly: true }}
                        sx={portalModalFieldSx}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Tooltip
                        title={
                          getRegisteredChapterLabel(
                            updateFormData.chapterId,
                            chapterLocations
                          ) || "Select chapter"
                        }
                        placement="top-start"
                        enterDelay={400}
                      >
                        <Box sx={{ width: "100%" }}>
                          <FormControl
                            fullWidth
                            size="small"
                            sx={portalModalFieldSx}
                          >
                            <InputLabel>Chapter</InputLabel>
                            <PortalModalSelect
                              value={String(updateFormData.chapterId ?? "")}
                              label="Chapter"
                              renderValue={(selected) =>
                                getRegisteredChapterLabel(
                                  selected,
                                  chapterLocations
                                ) || selected
                              }
                              onChange={(e) =>
                                setUpdateFormData({
                                  ...updateFormData,
                                  chapterId: e.target.value,
                                })
                              }
                            >
                              {chapterLocations.map((chapter) => {
                                const chapterId = String(
                                  chapter.chapterID ?? chapter.ChapterID ?? ""
                                );
                                const chapterName =
                                  chapter.chapterName ??
                                  chapter.ChapterName ??
                                  chapterId;
                                return (
                                  <MenuItem
                                    key={chapterId}
                                    value={chapterId}
                                    title={chapterName}
                                  >
                                    {chapterName}
                                  </MenuItem>
                                );
                              })}
                            </PortalModalSelect>
                          </FormControl>
                        </Box>
                      </Tooltip>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth size="small" sx={portalModalFieldSx}>
                        <InputLabel>Location</InputLabel>
                        <PortalModalSelect
                          value={updateFormData.location}
                          label="Location"
                          onChange={(e) =>
                            setUpdateFormData({
                              ...updateFormData,
                              location: e.target.value,
                            })
                          }
                        >
                          {LOCATION_OPTIONS.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </PortalModalSelect>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth size="small" sx={portalModalFieldSx}>
                        <InputLabel>Session</InputLabel>
                        <PortalModalSelect
                          value={updateFormData.session}
                          label="Session"
                          onChange={(e) =>
                            setUpdateFormData({
                              ...updateFormData,
                              session: e.target.value,
                            })
                          }
                        >
                          {sessionSelectOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </PortalModalSelect>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <FormControl fullWidth size="small" sx={portalModalFieldSx}>
                        <InputLabel>Class</InputLabel>
                        <PortalModalSelect
                          value={updateFormData.class}
                          label="Class"
                          onChange={(e) =>
                            setUpdateFormData({
                              ...updateFormData,
                              class: e.target.value,
                            })
                          }
                        >
                          {CLASS_OPTIONS.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </PortalModalSelect>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <FormControl fullWidth size="small" sx={portalModalFieldSx}>
                        <InputLabel>Section</InputLabel>
                        <PortalModalSelect
                          value={updateFormData.section}
                          label="Section"
                          onChange={(e) =>
                            setUpdateFormData({
                              ...updateFormData,
                              section: e.target.value,
                            })
                          }
                        >
                          {SECTION_OPTIONS.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </PortalModalSelect>
                      </FormControl>
                    </Grid>
                  </Grid>
                </PortalDialog>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <AppConfirmDialog
        open={deleteConfirmOpen}
        onClose={handleDeleteConfirmClose}
        onConfirm={handleDeleteConfirm}
        title="Delete Student"
        message="Do you want to delete this student?"
        confirmLabel="Delete"
        confirmColor="error"
        icon={<DeleteIcon sx={{ fontSize: 20 }} />}
        loading={loading}
      />

      <AppSnackbar snackbar={snackbar} onClose={closeSnackbar} />
    </Box>
  );
};

export default RegisteredStudentList;
