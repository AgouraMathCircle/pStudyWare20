import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Chip,
  Pagination,
  IconButton,
} from "@mui/material";
import {
  FirstPage as FirstPageIcon,
  KeyboardArrowLeft as PrevPageIcon,
  KeyboardArrowRight as NextPageIcon,
  LastPage as LastPageIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import studentDashboardService from "../../../services/studentDashboardService";
import { useNavigate } from "react-router-dom";

const StudentProfile = ({ username, chapterId }) => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [displayedData, setDisplayedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchBy, setSearchBy] = useState("ALL");
  const [searchCriteria, setSearchCriteria] = useState("");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [goToPageInput, setGoToPageInput] = useState("1");

  const pageSize = 10; // Match old ASPX system

  // Implement search functionality
  const handleSearch = () => {
    let filtered = [
      ...(Array.isArray(profileData) ? profileData : [profileData]),
    ];

    if (searchBy !== "ALL" && searchText.trim()) {
      filtered = filtered.filter((student) => {
        let fieldValue = "";

        switch (searchBy) {
          case "STUDENT_ID":
            fieldValue = student.studentID?.toString() || "";
            break;
          case "STUDENT_NAME":
            fieldValue = student.studentName || "";
            break;
          case "PROGRAM":
            fieldValue = student.program || "";
            break;
          case "GRADE":
            fieldValue = student.grade || "";
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
            return fieldValue.includes(search); // Default to contains
        }
      });
    }

    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page after search
    setGoToPageInput("1");
  };

  const handleEditProfile = (studentId) => {
    // Navigate to UpdateProfile page with studentId
    navigate(`/UpdateProfile/${studentId}`);
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setGoToPageInput(page.toString());
    }
  };

  // Handle go to specific page
  const handleGoToPage = () => {
    const page = parseInt(goToPageInput);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    } else {
      // Reset to current page if invalid input
      setGoToPageInput(currentPage.toString());
    }
  };

  // Load student profile data from API (cancelled guard avoids setState after unmount / duplicate runs)
  useEffect(() => {
    if (!username || !chapterId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const loadStudentProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await studentDashboardService.getStudentProfiles(
          username,
          chapterId
        );
        if (cancelled) return;
        if (response.isSuccess && response.studentProfiles != null) {
          const profileArray = Array.isArray(response.studentProfiles)
            ? response.studentProfiles
            : [response.studentProfiles];
          setProfileData(profileArray);
          setFilteredData(profileArray);
          setTotalRecords(profileArray.length);
        } else {
          setError(response?.message || "Failed to load student profiles");
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Error fetching student profile:", err);
          const serverMessage = err.response?.data?.message || err.message;
          setError(serverMessage || "Failed to load student profile. Please try again.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadStudentProfile();
    return () => {
      cancelled = true;
    };
  }, [username, chapterId]);

  // Update pagination when filtered data changes
  useEffect(() => {
    const total = filteredData.length;
    const pages = Math.ceil(total / pageSize);
    setTotalPages(pages > 0 ? pages : 1);
    setTotalRecords(total);

    // Reset to page 1 if current page exceeds total pages
    if (currentPage > pages && pages > 0) {
      setCurrentPage(1);
      setGoToPageInput("1");
    }
  }, [filteredData, pageSize, currentPage]);

  // Update displayed data when page or filtered data changes
  useEffect(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginated = filteredData.slice(startIndex, endIndex);
    setDisplayedData(paginated);
  }, [currentPage, filteredData, pageSize]);

  // Show loading state
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }

  // Show empty state
  if (
    !profileData ||
    (Array.isArray(profileData) && profileData.length === 0)
  ) {
    return (
      <Box sx={{ width: "100%", mb: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#1976d2" }}>
            Student Profile
          </Typography>
        </Box>
        <Alert severity="info">No profile information available.</Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 600, color: "#1976d2", fontSize: "1rem" }}
        >
          Student Profile
        </Typography>
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
            <MenuItem value="PROGRAM" sx={{ fontSize: "0.75rem" }}>
              Program
            </MenuItem>
            <MenuItem value="GRADE" sx={{ fontSize: "0.75rem" }}>
              Grade
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
                  width: "6%",
                  fontSize: "0.75rem",
                  padding: "2px 4px",
                }}
              >
                Actions
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  borderRight: "1px solid #4caf50",
                  width: "6%",
                  fontSize: "0.75rem",
                  padding: "2px 4px",
                }}
              >
                Student #
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  borderRight: "1px solid #4caf50",
                  width: "10%",
                  fontSize: "0.75rem",
                  padding: "2px 4px",
                }}
              >
                Student Name
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  borderRight: "1px solid #4caf50",
                  width: "8%",
                  fontSize: "0.75rem",
                  padding: "2px 4px",
                }}
              >
                Program
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  borderRight: "1px solid #4caf50",
                  width: "7%",
                  fontSize: "0.75rem",
                  padding: "2px 4px",
                }}
              >
                Class
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  borderRight: "1px solid #4caf50",
                  width: "5%",
                  fontSize: "0.75rem",
                  padding: "2px 4px",
                }}
              >
                Grade
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  borderRight: "1px solid #4caf50",
                  width: "10%",
                  fontSize: "0.75rem",
                  padding: "2px 4px",
                }}
              >
                School
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  borderRight: "1px solid #4caf50",
                  width: "9%",
                  fontSize: "0.75rem",
                  padding: "2px 4px",
                }}
              >
                Parent
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  borderRight: "1px solid #4caf50",
                  width: "9%",
                  fontSize: "0.75rem",
                  padding: "2px 4px",
                }}
              >
                Contact #
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  borderRight: "1px solid #4caf50",
                  width: "15%",
                  fontSize: "0.75rem",
                  padding: "2px 4px",
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
                  padding: "2px 4px",
                }}
              >
                Session
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  width: "7%",
                  fontSize: "0.75rem",
                  padding: "2px 4px",
                }}
              >
                Location
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedData.map((student, index) => (
              <TableRow
                key={student.studentID || index}
                sx={{ "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" } }}
              >
                <TableCell
                  sx={{
                    borderRight: "1px solid #4caf50",
                    width: "6%",
                    fontSize: "0.75rem",
                    padding: "4px 5px",
                  }}
                >
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleEditProfile(student.studentID)}
                    sx={{ fontSize: "0.75rem" }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </TableCell>
                <TableCell
                  sx={{
                    borderRight: "1px solid #4caf50",
                    width: "6%",
                    fontSize: "0.75rem",
                    padding: "4px 5px",
                  }}
                >
                  {student.studentID}
                </TableCell>
                <TableCell
                  sx={{
                    borderRight: "1px solid #4caf50",
                    width: "10%",
                    fontSize: "0.75rem",
                    padding: "4px 5px",
                  }}
                >
                  {student.studentName}
                </TableCell>
                <TableCell
                  sx={{
                    borderRight: "1px solid #4caf50",
                    width: "8%",
                    fontSize: "0.75rem",
                    padding: "4px 5px",
                  }}
                >
                  <Chip
                    label={student.program || "N/A"}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ fontSize: "0.7rem" }}
                  />
                </TableCell>
                <TableCell
                  sx={{
                    borderRight: "1px solid #4caf50",
                    width: "7%",
                    fontSize: "0.75rem",
                    padding: "4px 5px",
                  }}
                >
                  {student.class || "N/A"}
                </TableCell>
                <TableCell
                  sx={{
                    borderRight: "1px solid #4caf50",
                    width: "5%",
                    fontSize: "0.75rem",
                    padding: "4px 5px",
                  }}
                >
                  {student.grade}
                </TableCell>
                <TableCell
                  sx={{
                    borderRight: "1px solid #4caf50",
                    width: "10%",
                    fontSize: "0.75rem",
                    padding: "4px 5px",
                  }}
                >
                  {student.school}
                </TableCell>
                <TableCell
                  sx={{
                    borderRight: "1px solid #4caf50",
                    width: "9%",
                    fontSize: "0.75rem",
                    padding: "4px 5px",
                  }}
                >
                  {student.parentName}
                </TableCell>
                <TableCell
                  sx={{
                    borderRight: "1px solid #4caf50",
                    width: "9%",
                    fontSize: "0.75rem",
                    padding: "4px 5px",
                  }}
                >
                  {student.phone}
                </TableCell>
                <TableCell
                  sx={{
                    borderRight: "1px solid #4caf50",
                    width: "15%",
                    fontSize: "0.75rem",
                    padding: "4px 5px",
                    wordBreak: "break-word",
                  }}
                >
                  {student.email ||
                    student.parentEmail ||
                    student.studentEmail ||
                    "N/A"}
                </TableCell>
                <TableCell
                  sx={{
                    borderRight: "1px solid #4caf50",
                    width: "8%",
                    fontSize: "0.75rem",
                    padding: "4px 5px",
                  }}
                >
                  <Chip
                    label={student.eventSession || "N/A"}
                    size="small"
                    color="secondary"
                    variant="outlined"
                    sx={{ fontSize: "0.7rem" }}
                  />
                </TableCell>
                <TableCell
                  sx={{ width: "7%", fontSize: "0.75rem", padding: "4px 5px" }}
                >
                  {student.eventLocation || "N/A"}
                </TableCell>
              </TableRow>
            ))}
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
            value={currentPage}
            onChange={(e) => handlePageChange(e.target.value)}
            sx={{
              color: "white",
              minWidth: 50,
              fontSize: "0.75rem",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
              "& .MuiSelect-icon": { color: "white" },
            }}
          >
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <MenuItem key={page} value={page} sx={{ fontSize: "0.75rem" }}>
                {page}
              </MenuItem>
            ))}
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

export default StudentProfile;
