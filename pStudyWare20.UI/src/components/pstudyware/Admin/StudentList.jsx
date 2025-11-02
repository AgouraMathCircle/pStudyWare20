import React, { useState, useMemo } from "react";
import {
  Typography,
  Button,
  TextField,
  Box,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  FirstPage as FirstPageIcon,
  KeyboardArrowLeft as PrevPageIcon,
  KeyboardArrowRight as NextPageIcon,
  LastPage as LastPageIcon,
} from "@mui/icons-material";

const StudentList = ({
  students,
  onExportToExcel,
  canExportData,
  onRefresh,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchBy, setSearchBy] = useState("ALL");
  const [searchCriteria, setSearchCriteria] = useState("");
  const [searchText, setSearchText] = useState("");
  const [orderBy, setOrderBy] = useState("studentID");
  const [order, setOrder] = useState("asc");
  const [goToPageInput, setGoToPageInput] = useState("1");

  const pageSize = 10;

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

  // Handle sort
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Handle edit student
  const handleEditStudent = (studentId) => {
    // Navigate to update profile page
    window.location.href = `/pStudyWare/UpdateProfile.aspx?StudentID=${studentId}`;
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

      // Handle null/undefined values
      if (aValue == null) aValue = "";
      if (bValue == null) bValue = "";

      // Convert to string for comparison
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
  }, [filteredAndSortedStudents, currentPage, pageSize]);

  const totalPages = Math.ceil(
    (filteredAndSortedStudents?.length || 0) / pageSize
  );
  const totalRecords = filteredAndSortedStudents?.length || 0;

  // Define table columns
  const columns = [
    { id: "actions", label: "", sortable: false, width: 60 },
    { id: "studentID", label: "Student #", sortable: true, width: 100 },
    { id: "studentName", label: "Student Name", sortable: true, width: 180 },
    { id: "class", label: "Class", sortable: true, width: 150 },
    { id: "grade", label: "Grade", sortable: true, width: 80 },
    { id: "school", label: "School", sortable: true, width: 150 },
    { id: "parentName", label: "Parent", sortable: true, width: 150 },
    { id: "phoneNumber", label: "Contact #", sortable: true, width: 130 },
    { id: "emailAddress", label: "Email", sortable: true, width: 200 },
    { id: "eventSession", label: "Session", sortable: true, width: 120 },
    { id: "eventLocation", label: "Location", sortable: true, width: 120 },
  ];

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 600, color: "#1976d2", fontSize: "1rem" }}
        >
          Current Session Student List
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          {canExportData && (
            <Button
              variant="contained"
              color="success"
              size="small"
              startIcon={<DownloadIcon />}
              onClick={onExportToExcel}
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
            onClick={onRefresh}
            sx={{ fontSize: "0.75rem", px: 1.5, py: 0.25 }}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Search Bar */}
      <Box
        sx={{
          backgroundColor: "#4caf50",
          p: 0.5,
          borderRadius: 1,
          mb: 1.5,
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
            px: 1.5,
            py: 0.25,
            "&:hover": { backgroundColor: "#f5f5f5" },
          }}
        >
          Find
        </Button>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} sx={{ mb: 2, width: "100%" }}>
        <Table sx={{ width: "100%", tableLayout: "fixed" }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#e8f5e8" }}>
              <TableCell
                sx={{
                  fontWeight: 600,
                  borderRight: "1px solid #4caf50",
                  width: "8%",
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
                  width: "8%",
                  fontSize: "0.75rem",
                  padding: "3px 5px",
                }}
              >
                Student #
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  borderRight: "1px solid #4caf50",
                  width: "12%",
                  fontSize: "0.75rem",
                  padding: "3px 5px",
                }}
              >
                Student Name
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  borderRight: "1px solid #4caf50",
                  width: "10%",
                  fontSize: "0.75rem",
                  padding: "3px 5px",
                }}
              >
                Class
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  borderRight: "1px solid #4caf50",
                  width: "6%",
                  fontSize: "0.75rem",
                  padding: "3px 5px",
                }}
              >
                Grade
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  borderRight: "1px solid #4caf50",
                  width: "12%",
                  fontSize: "0.75rem",
                  padding: "3px 5px",
                }}
              >
                School
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  borderRight: "1px solid #4caf50",
                  width: "10%",
                  fontSize: "0.75rem",
                  padding: "3px 5px",
                }}
              >
                Parent
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  borderRight: "1px solid #4caf50",
                  width: "10%",
                  fontSize: "0.75rem",
                  padding: "3px 5px",
                }}
              >
                Contact #
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  borderRight: "1px solid #4caf50",
                  width: "12%",
                  fontSize: "0.75rem",
                  padding: "3px 5px",
                }}
              >
                Email
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  borderRight: "1px solid #4caf50",
                  width: "8%",
                  fontSize: "0.75rem",
                  padding: "3px 5px",
                }}
              >
                Session
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  width: "8%",
                  fontSize: "0.75rem",
                  padding: "3px 5px",
                }}
              >
                Location
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
                      width: "8%",
                      fontSize: "0.75rem",
                      padding: "3px 5px",
                    }}
                  >
                    <Tooltip title="Edit Student">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEditStudent(student.studentID)}
                        sx={{ fontSize: "0.75rem" }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell
                    sx={{
                      borderRight: "1px solid #4caf50",
                      width: "8%",
                      fontSize: "0.75rem",
                      padding: "3px 5px",
                    }}
                  >
                    {student.studentID || "-"}
                  </TableCell>
                  <TableCell
                    sx={{
                      borderRight: "1px solid #4caf50",
                      width: "12%",
                      fontSize: "0.75rem",
                      padding: "3px 5px",
                    }}
                  >
                    {student.studentName || "-"}
                  </TableCell>
                  <TableCell
                    sx={{
                      borderRight: "1px solid #4caf50",
                      width: "10%",
                      fontSize: "0.75rem",
                      padding: "3px 5px",
                    }}
                  >
                    {student.class || "-"}
                  </TableCell>
                  <TableCell
                    sx={{
                      borderRight: "1px solid #4caf50",
                      width: "6%",
                      fontSize: "0.75rem",
                      padding: "3px 5px",
                    }}
                  >
                    {student.grade || "-"}
                  </TableCell>
                  <TableCell
                    sx={{
                      borderRight: "1px solid #4caf50",
                      width: "12%",
                      fontSize: "0.75rem",
                      padding: "3px 5px",
                    }}
                  >
                    {student.school || "-"}
                  </TableCell>
                  <TableCell
                    sx={{
                      borderRight: "1px solid #4caf50",
                      width: "10%",
                      fontSize: "0.75rem",
                      padding: "3px 5px",
                    }}
                  >
                    {student.parentName || "-"}
                  </TableCell>
                  <TableCell
                    sx={{
                      borderRight: "1px solid #4caf50",
                      width: "10%",
                      fontSize: "0.75rem",
                      padding: "3px 5px",
                    }}
                  >
                    {student.phoneNumber || "-"}
                  </TableCell>
                  <TableCell
                    sx={{
                      borderRight: "1px solid #4caf50",
                      width: "12%",
                      fontSize: "0.75rem",
                      padding: "3px 5px",
                      maxWidth: 200,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Tooltip title={student.emailAddress || "-"}>
                      <span>{student.emailAddress || "-"}</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell
                    sx={{
                      borderRight: "1px solid #4caf50",
                      width: "8%",
                      fontSize: "0.75rem",
                      padding: "3px 5px",
                    }}
                  >
                    {student.eventSession || "-"}
                  </TableCell>
                  <TableCell
                    sx={{
                      width: "8%",
                      fontSize: "0.75rem",
                      padding: "3px 5px",
                    }}
                  >
                    {student.eventLocation || "-"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={11}
                  align="center"
                  sx={{ fontSize: "0.75rem", padding: "3px 5px", py: 3 }}
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

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
          <Typography sx={{ color: "white", fontSize: "0.75rem" }}>
            GoTo
          </Typography>
          <Select
            size="small"
            value={totalPages > 0 ? currentPage : ""}
            onChange={(e) => handlePageChange(e.target.value)}
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
          Page(s): {currentPage} of {totalPages}
        </Typography>

        <Typography sx={{ color: "white", fontSize: "0.75rem" }}>
          Record(s):{" "}
          {totalRecords > 0
            ? `${(currentPage - 1) * pageSize + 1} - ${Math.min(
                currentPage * pageSize,
                totalRecords
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
              px: 1,
              py: 0.25,
              "&:hover": { backgroundColor: "#f5f5f5" },
            }}
          >
            Go
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default StudentList;
