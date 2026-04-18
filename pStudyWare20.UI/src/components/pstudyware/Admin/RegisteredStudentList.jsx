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
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
import registeredStudentListService from "../../../services/registeredStudentListService";
import AdminHeader from "./AdminHeader";
import {
  PORTAL_CARD_BOX_SHADOW,
  portalCardAntiLiftSx,
  APPLICATION_ADMIN_TITLE_COLOR,
} from "../../../styles/applicationSurfaces";

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
  const cellPadding = "0 8px";

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
  const handleDeleteStudent = async (studentId) => {
    if (!studentId || studentId === "0") {
      alert("You cannot delete this student.");
      return;
    }

    const confirmed = window.confirm("Do you want to delete this student?");
    if (!confirmed) return;

    try {
      setLoading(true);
      setError(null);

      const response = await registeredStudentListService.deleteStudent(
        studentId
      );

      if (response.isSuccess) {
        setSuccess(response.message || "Student deleted successfully");
        fetchData(); // Refresh data
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
                {/* Header — match InstructorList */}
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
                        sx={{ fontSize: "0.75rem", px: 1.5, py: 0.25 }}
                      >
                        Export Excel
                      </Button>
                    )}
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      startIcon={<RefreshIcon />}
                      onClick={fetchData}
                      disabled={loading}
                      sx={{ fontSize: "0.75rem", px: 1.5, py: 0.25 }}
                    >
                      Refresh
                    </Button>
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

                {/* Search Bar — match InstructorList */}
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
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Typography
                      sx={{ color: "white", fontSize: "0.75rem", whiteSpace: "nowrap" }}
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
                        "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
                        "& .MuiSelect-icon": { color: "white" },
                      }}
                    >
                      <MenuItem value="ALL" sx={{ fontSize: "0.75rem" }}>
                        -ALL-
                      </MenuItem>
                      <MenuItem value="STUDENT_ID" sx={{ fontSize: "0.75rem" }}>
                        Student ID
                      </MenuItem>
                      <MenuItem value="STUDENT_NAME" sx={{ fontSize: "0.75rem" }}>
                        Student Name
                      </MenuItem>
                      <MenuItem value="CHAPTER" sx={{ fontSize: "0.75rem" }}>
                        Chapter
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
                      <MenuItem value="PHONE" sx={{ fontSize: "0.75rem" }}>
                        Phone
                      </MenuItem>
                      <MenuItem value="EMAIL" sx={{ fontSize: "0.75rem" }}>
                        Email
                      </MenuItem>
                      <MenuItem value="SESSION" sx={{ fontSize: "0.75rem" }}>
                        Session
                      </MenuItem>
                      <MenuItem value="LOCATION" sx={{ fontSize: "0.75rem" }}>
                        Location
                      </MenuItem>
                      <MenuItem value="STATE" sx={{ fontSize: "0.75rem" }}>
                        State
                      </MenuItem>
                      <MenuItem value="CITY" sx={{ fontSize: "0.75rem" }}>
                        City
                      </MenuItem>
                    </Select>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Typography
                      sx={{ color: "white", fontSize: "0.75rem", whiteSpace: "nowrap" }}
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
                        "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
                        "& .MuiSelect-icon": { color: "white" },
                      }}
                    >
                      <MenuItem value="" sx={{ fontSize: "0.75rem" }}>
                        Select Criteria
                      </MenuItem>
                      <MenuItem value="equals" sx={{ fontSize: "0.75rem" }}>
                        Equals
                      </MenuItem>
                      <MenuItem value="contains" sx={{ fontSize: "0.75rem" }}>
                        Contains
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

                {/* Table — match InstructorList layout */}
                <TableContainer component={Paper} sx={{ width: "100%" }}>
                  <Table
                    sx={{
                      width: "100%",
                      tableLayout: "fixed",
                      "& .MuiTableCell-root": { paddingTop: 0, paddingBottom: 0 },
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
                            width: "5%",
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
                            width: "9%",
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
                            width: "7%",
                            fontSize: "0.75rem",
                            padding: cellPadding,
                          }}
                        >
                          Chapter
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
                          Class
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
                          Grade
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
                          Parent
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
                          Phone
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
                          Email
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
                          Session
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
                          Location
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
                          City
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedStudents.length > 0 ? (
                        paginatedStudents.map((student, index) => (
                          <TableRow
                            key={student.studentID || index}
                            sx={{ "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" } }}
                          >
                            <TableCell
                              sx={{
                                borderRight: "1px solid #4caf50",
                                fontSize: "0.75rem",
                                padding: cellPadding,
                                verticalAlign: "middle",
                              }}
                            >
                              {privileges.canUpdateStudents ? (
                                <Tooltip title="Edit Student">
                                  <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => handleUpdateClass(student)}
                                    sx={{ padding: "2px" }}
                                  >
                                    <EditIcon sx={{ fontSize: "1rem" }} />
                                  </IconButton>
                                </Tooltip>
                              ) : null}
                            </TableCell>
                            <TableCell
                              sx={{
                                borderRight: "1px solid #4caf50",
                                fontSize: "0.75rem",
                                padding: cellPadding,
                                verticalAlign: "middle",
                              }}
                            >
                              {privileges.canDeleteStudents ? (
                                <Tooltip title="Delete Student">
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => handleDeleteStudent(student.studentID)}
                                    sx={{ padding: "2px" }}
                                  >
                                    <DeleteIcon sx={{ fontSize: "1rem" }} />
                                  </IconButton>
                                </Tooltip>
                              ) : null}
                            </TableCell>
                            <TableCell
                              sx={{
                                borderRight: "1px solid #4caf50",
                                fontSize: "0.75rem",
                                padding: cellPadding,
                              }}
                            >
                              {student.studentID || "-"}
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
                              <Tooltip title={student.studentName ?? "-"}>
                                <span>{student.studentName || "-"}</span>
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
                              <Tooltip title={student.chapter ?? "-"}>
                                <span>{student.chapter || "-"}</span>
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
                              <Tooltip title={student.class ?? "-"}>
                                <span>{student.class || "-"}</span>
                              </Tooltip>
                            </TableCell>
                            <TableCell
                              sx={{
                                borderRight: "1px solid #4caf50",
                                fontSize: "0.75rem",
                                padding: cellPadding,
                              }}
                            >
                              {student.grade || "-"}
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
                              <Tooltip title={student.school ?? "-"}>
                                <span>{student.school || "-"}</span>
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
                              <Tooltip title={student.parentName ?? "-"}>
                                <span>{student.parentName || "-"}</span>
                              </Tooltip>
                            </TableCell>
                            <TableCell
                              sx={{
                                borderRight: "1px solid #4caf50",
                                fontSize: "0.75rem",
                                padding: cellPadding,
                              }}
                            >
                              {student.phoneNumber || "-"}
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
                              <Tooltip title={student.emailAddress ?? "-"}>
                                <span>{student.emailAddress || "-"}</span>
                              </Tooltip>
                            </TableCell>
                            <TableCell
                              sx={{
                                borderRight: "1px solid #4caf50",
                                fontSize: "0.75rem",
                                padding: cellPadding,
                              }}
                            >
                              {student.eventSession || "-"}
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
                              <Tooltip title={student.eventLocation ?? "-"}>
                                <span>{student.eventLocation || "-"}</span>
                              </Tooltip>
                            </TableCell>
                            <TableCell
                              sx={{
                                borderRight: "1px solid #4caf50",
                                fontSize: "0.75rem",
                                padding: cellPadding,
                              }}
                            >
                              {student.registeredDate
                                ? new Date(student.registeredDate).toLocaleDateString()
                                : "-"}
                            </TableCell>
                            <TableCell
                              sx={{
                                borderRight: "1px solid #4caf50",
                                fontSize: "0.75rem",
                                padding: cellPadding,
                              }}
                            >
                              {student.sState || "-"}
                            </TableCell>
                            <TableCell
                              sx={{
                                fontSize: "0.75rem",
                                padding: cellPadding,
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
                          <TableCell
                            colSpan={16}
                            align="center"
                            sx={{ fontSize: "0.75rem", padding: cellPadding, py: 3 }}
                          >
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              sx={{ fontSize: "0.75rem" }}
                            >
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

                {/* Pagination Bar — match InstructorList */}
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
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
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
                      disabled={currentPage === totalPages || totalPages === 0}
                    >
                      <NextPageIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      sx={{ color: "white", padding: "2px" }}
                      onClick={() => handlePageChange(totalPages)}
                      disabled={currentPage === totalPages || totalPages === 0}
                    >
                      <LastPageIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
                    <Typography sx={{ color: "white", fontSize: "0.75rem" }}>
                      GoTo
                    </Typography>
                    <Select
                      size="small"
                      value={totalPages > 0 ? currentPage : ""}
                      onChange={(e) => handlePageChange(Number(e.target.value))}
                      disabled={totalPages === 0}
                      sx={{
                        color: "white",
                        minWidth: 50,
                        fontSize: "0.75rem",
                        "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
                        "& .MuiSelect-icon": { color: "white" },
                      }}
                    >
                      {totalPages > 0 ? (
                        Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <MenuItem key={page} value={page} sx={{ fontSize: "0.75rem" }}>
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
                    Page(s): {totalPages > 0 ? currentPage : 0} of {totalPages}
                  </Typography>

                  <Typography sx={{ color: "white", fontSize: "0.75rem" }}>
                    Record(s):{" "}
                    {totalRecords > 0
                      ? `${(currentPage - 1) * pageSize + 1} - ${Math.min(
                          currentPage * pageSize,
                          totalRecords,
                        )}`
                      : "0"}{" "}
                    of {totalRecords}
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
                    <Typography sx={{ color: "white", fontSize: "0.75rem" }}>
                      Go to Page Number:
                    </Typography>
                    <TextField
                      size="small"
                      type="number"
                      value={goToPageInput}
                      onChange={(e) => setGoToPageInput(e.target.value)}
                      onKeyPress={(e) => {
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

                {/* Update Class Dialog */}
                <Dialog
                  open={showUpdateForm}
                  onClose={() => setShowUpdateForm(false)}
                  maxWidth="sm"
                  fullWidth
                >
                  <DialogTitle
                    sx={{ backgroundColor: "#1976d2", color: "white" }}
                  >
                    Update Class
                  </DialogTitle>
                  <DialogContent sx={{ mt: 2 }}>
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
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FormControl fullWidth size="small">
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
                        <FormControl fullWidth size="small">
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
                        <FormControl fullWidth size="small">
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
                        <FormControl fullWidth size="small">
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
                        <FormControl fullWidth size="small">
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
                  </DialogContent>
                  <DialogActions sx={{ p: 2 }}>
                    <Button
                      onClick={() => setShowUpdateForm(false)}
                      color="inherit"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleUpdateSubmit}
                      variant="contained"
                      color="primary"
                      disabled={loading}
                    >
                      {loading ? <CircularProgress size={20} /> : "Submit"}
                    </Button>
                  </DialogActions>
                </Dialog>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default RegisteredStudentList;
