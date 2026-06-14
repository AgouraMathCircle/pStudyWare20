import React, { useState, useEffect, useMemo } from "react";
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
  Alert,
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
} from "@mui/icons-material";
import { useAuth } from "../../../contexts/AuthContext";
import registeredStudentListService from "../../../services/registeredStudentListService";
import AdminHeader from "./AdminHeader";
import AdminSessionListPagination from "./AdminSessionListPagination";
import AppConfirmDialog from "../Common/AppConfirmDialog";
import PortalDialog from "../Common/PortalDialog";
import { portalModalFieldSx, portalModalSendButtonSx } from "../Common/portalModalStyles";
import SortableHeader from "../Common/SortableHeader";
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
  adminSessionListTableHeadCellSx,
  adminSessionListTableHeadRowSx,
  adminSessionListTitleSx,
  adminSessionListToolbarButtonSx,
} from "../styles/applicationSurfaces";

const RegisteredStudentList = () => {
  const { user } = useAuth();

  // State management
  const [students, setStudents] = useState([]);
  const [chapterLocations, setChapterLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
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

  // Class options (from original ASP.NET page)
  const classOptions = [
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
  ];

  const sectionOptions = [
    { value: "A", label: "A" },
    { value: "B", label: "B" },
  ];

  const locationOptions = [
    { value: "O", label: "OnSite" },
    { value: "I", label: "Internet" },
  ];

  const sessionOptions = [
    { value: "F2024", label: "Fall 2024" },
    { value: "S2024", label: "Spring 2024" },
  ];

  // Load data on component mount
  useEffect(() => {
    fetchData();
    checkPrivileges();
  }, []);

  // Fetch dashboard data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await registeredStudentListService.getDashboardData();

      if (response.isSuccess) {
        setStudents(response.studentList || []);
        setChapterLocations(response.chapterLocations || []);
      } else {
        setError(response.errorMessage || "Failed to load data");
      }
    } catch (err) {
      setError(err.message || "An error occurred while loading data");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
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

  // Handle update class button click
  const handleUpdateClass = (student) => {
    // Parse student class info
    const studentClassInfo = `${student.firstName || ""}~#${
      student.lastName || ""
    }~#${student.class || ""}~#${student.emailAddress || ""}~#${
      student.eventLocation || ""
    }~#${student.section || ""}~#${student.chapterID || ""}~#${
      student.eventSession || ""
    }`;
    const arrUpdateData = studentClassInfo.split("~#");

    setUpdateFormData({
      studentId: student.studentID || "",
      firstName: arrUpdateData[0] || "",
      lastName: arrUpdateData[1] || "",
      class: arrUpdateData[2] || "JB",
      email: arrUpdateData[3] || "",
      location: arrUpdateData[4] || "O",
      section: arrUpdateData[5] || "A",
      chapterId: arrUpdateData[6] || "",
      session: arrUpdateData[7] || "F2024",
    });
    setShowUpdateForm(true);
  };

  // Handle update form submit
  const handleUpdateSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

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
      };

      const response = await registeredStudentListService.updateStudentClass(
        request
      );

      if (response.isSuccess) {
        setSuccess(response.message || "Student class updated successfully");
        setShowUpdateForm(false);
        fetchData(); // Refresh data
      } else {
        setError(response.errorMessage || "Failed to update student class");
      }
    } catch (err) {
      setError(err.message || "An error occurred while updating student class");
      console.error("Error updating student class:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete student
  const handleDeleteStudent = (studentId) => {
    if (!studentId || studentId === "0") {
      setError("You cannot delete this student.");
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
      setError(null);

      const response = await registeredStudentListService.deleteStudent(
        studentToDelete
      );

      if (response.isSuccess) {
        setSuccess(response.message || "Student deleted successfully");
        handleDeleteConfirmClose();
        fetchData();
      } else {
        setError(response.errorMessage || "Failed to delete student");
      }
    } catch (err) {
      setError(err.message || "An error occurred while deleting student");
      console.error("Error deleting student:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle export to Excel
  const handleExportToExcel = async () => {
    try {
      setLoading(true);
      setError(null);

      const request = {
        username: "", // Will use JWT token
        mode: "E",
      };

      await registeredStudentListService.exportStudentListToExcel(request);
      setSuccess("Excel file downloaded successfully");
    } catch (err) {
      setError(err.message || "An error occurred while exporting to Excel");
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

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      let aValue = a[orderBy];
      let bValue = b[orderBy];

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
      <Box sx={{ height: "48px" }} />
      <Container maxWidth="xl" sx={{ mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={adminSessionListPanelCardSx}>
              <CardContent sx={adminSessionListPanelContentSx}>
                <Box sx={adminSessionListHeaderBarSx}>
                  <Typography variant="subtitle1" sx={adminSessionListTitleSx}>
                    Student List
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    {privileges.canExportData && (
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        startIcon={<DownloadIcon />}
                        onClick={handleExportToExcel}
                        disabled={loading}
                        sx={adminSessionListToolbarButtonSx}
                      >
                        Export Excel
                      </Button>
                    )}
                  </Box>
                </Box>

                {/* Alert Messages */}
                {error && (
                  <Alert
                    severity="error"
                    onClose={() => setError(null)}
                    sx={{ mb: 2 }}
                  >
                    {error}
                  </Alert>
                )}
                {success && (
                  <Alert
                    severity="success"
                    onClose={() => setSuccess(null)}
                    sx={{ mb: 2 }}
                  >
                    {success}
                  </Alert>
                )}

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
                        <TableCell
                          sx={adminSessionListTableHeadCellSx("4%")}
                        >
                          Delete
                        </TableCell>
                        <SortableHeader
                          label="Student #"
                          field="studentID"
                          sortField={orderBy}
                          sortOrder={order}
                          onSort={handleSort}
                          headCellSx={adminSessionListTableHeadCellSx("10%")}
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
                                  sx={adminSessionListTableActionLinkSx}
                                >
                                  Delete
                                </Box>
                              ) : (
                                "—"
                              )}
                            </TableCell>
                            <TableCell sx={adminSessionListTableBodyCellSx()}>
                              {student.studentID || "—"}
                            </TableCell>
                            <TableCell
                              sx={{
                                fontSize: "0.75rem",
                                padding: ADMIN_SESSION_LIST_CELL_PADDING,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              <Tooltip title={student.studentName ?? "-"}>
                                <span>{student.studentName || "-"}</span>
                              </Tooltip>
                            </TableCell>
                            <TableCell
                              sx={{
                                fontSize: "0.75rem",
                                padding: ADMIN_SESSION_LIST_CELL_PADDING,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              <Tooltip title={student.chapter ?? "-"}>
                                <span>{student.chapter || "-"}</span>
                              </Tooltip>
                            </TableCell>
                            <TableCell
                              sx={{
                                fontSize: "0.75rem",
                                padding: ADMIN_SESSION_LIST_CELL_PADDING,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              <Tooltip title={student.class ?? "-"}>
                                <span>{student.class || "-"}</span>
                              </Tooltip>
                            </TableCell>
                            <TableCell
                              sx={{
                                fontSize: "0.75rem",
                                padding: ADMIN_SESSION_LIST_CELL_PADDING,
                              }}
                            >
                              {student.grade || "-"}
                            </TableCell>
                            <TableCell
                              sx={{
                                fontSize: "0.75rem",
                                padding: ADMIN_SESSION_LIST_CELL_PADDING,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              <Tooltip title={student.school ?? "-"}>
                                <span>{student.school || "-"}</span>
                              </Tooltip>
                            </TableCell>
                            <TableCell
                              sx={{
                                fontSize: "0.75rem",
                                padding: ADMIN_SESSION_LIST_CELL_PADDING,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              <Tooltip title={student.parentName ?? "-"}>
                                <span>{student.parentName || "-"}</span>
                              </Tooltip>
                            </TableCell>
                            <TableCell
                              sx={{
                                fontSize: "0.75rem",
                                padding: ADMIN_SESSION_LIST_CELL_PADDING,
                              }}
                            >
                              {student.phoneNumber || "-"}
                            </TableCell>
                            <TableCell
                              sx={{
                                fontSize: "0.75rem",
                                padding: ADMIN_SESSION_LIST_CELL_PADDING,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              <Tooltip title={student.emailAddress ?? "-"}>
                                <span>{student.emailAddress || "-"}</span>
                              </Tooltip>
                            </TableCell>
                            <TableCell
                              sx={{
                                fontSize: "0.75rem",
                                padding: ADMIN_SESSION_LIST_CELL_PADDING,
                              }}
                            >
                              {student.eventSession || "-"}
                            </TableCell>
                            <TableCell
                              sx={{
                                fontSize: "0.75rem",
                                padding: ADMIN_SESSION_LIST_CELL_PADDING,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              <Tooltip title={student.eventLocation ?? "-"}>
                                <span>{student.eventLocation || "-"}</span>
                              </Tooltip>
                            </TableCell>
                            <TableCell
                              sx={{
                                fontSize: "0.75rem",
                                padding: ADMIN_SESSION_LIST_CELL_PADDING,
                              }}
                            >
                              {student.registeredDate
                                ? new Date(student.registeredDate).toLocaleDateString()
                                : "-"}
                            </TableCell>
                            <TableCell
                              sx={{
                                fontSize: "0.75rem",
                                padding: ADMIN_SESSION_LIST_CELL_PADDING,
                              }}
                            >
                              {student.sState || "-"}
                            </TableCell>
                            <TableCell
                              sx={{
                                fontSize: "0.75rem",
                                padding: ADMIN_SESSION_LIST_CELL_PADDING,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              <Tooltip title={student.city ?? "-"}>
                                <span>{student.city || "-"}</span>
                              </Tooltip>
                            </TableCell>
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
                  onClose={() => !loading && setShowUpdateForm(false)}
                  maxWidth="sm"
                  disableClose={loading}
                  ariaLabelledby="update-class-dialog-title"
                  title="Update Class"
                  icon={<EditIcon sx={{ fontSize: 20 }} />}
                  actions={
                    <Button
                      onClick={handleUpdateSubmit}
                      variant="contained"
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
                      sx={portalModalSendButtonSx}
                    >
                      {loading ? "Saving…" : "Submit"}
                    </Button>
                  }
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="First Name"
                        value={updateFormData.firstName}
                        onChange={(e) =>
                          setUpdateFormData({
                            ...updateFormData,
                            firstName: e.target.value,
                          })
                        }
                        size="small"
                        sx={portalModalFieldSx}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        value={updateFormData.lastName}
                        onChange={(e) =>
                          setUpdateFormData({
                            ...updateFormData,
                            lastName: e.target.value,
                          })
                        }
                        size="small"
                        sx={portalModalFieldSx}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth size="small" sx={portalModalFieldSx}>
                        <InputLabel>Chapter</InputLabel>
                        <Select
                          value={updateFormData.chapterId}
                          label="Chapter"
                          onChange={(e) =>
                            setUpdateFormData({
                              ...updateFormData,
                              chapterId: e.target.value,
                            })
                          }
                        >
                          {chapterLocations.map((chapter) => (
                            <MenuItem
                              key={chapter.chapterID}
                              value={chapter.chapterID}
                            >
                              {chapter.chapterName}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth size="small" sx={portalModalFieldSx}>
                        <InputLabel>Location</InputLabel>
                        <Select
                          value={updateFormData.location}
                          label="Location"
                          onChange={(e) =>
                            setUpdateFormData({
                              ...updateFormData,
                              location: e.target.value,
                            })
                          }
                        >
                          {locationOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth size="small" sx={portalModalFieldSx}>
                        <InputLabel>Session</InputLabel>
                        <Select
                          value={updateFormData.session}
                          label="Session"
                          onChange={(e) =>
                            setUpdateFormData({
                              ...updateFormData,
                              session: e.target.value,
                            })
                          }
                        >
                          {sessionOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <FormControl fullWidth size="small" sx={portalModalFieldSx}>
                        <InputLabel>Class</InputLabel>
                        <Select
                          value={updateFormData.class}
                          label="Class"
                          onChange={(e) =>
                            setUpdateFormData({
                              ...updateFormData,
                              class: e.target.value,
                            })
                          }
                        >
                          {classOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <FormControl fullWidth size="small" sx={portalModalFieldSx}>
                        <InputLabel>Section</InputLabel>
                        <Select
                          value={updateFormData.section}
                          label="Section"
                          onChange={(e) =>
                            setUpdateFormData({
                              ...updateFormData,
                              section: e.target.value,
                            })
                          }
                        >
                          {sectionOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
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
    </Box>
  );
};

export default RegisteredStudentList;
