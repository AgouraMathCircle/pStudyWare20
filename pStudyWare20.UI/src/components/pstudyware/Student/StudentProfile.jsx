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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchBy, setSearchBy] = useState("ALL");
  const [searchCriteria, setSearchCriteria] = useState("");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const handleSearch = () => {
    // TODO: Implement search functionality
    console.log("Search:", { searchBy, searchCriteria, searchText });
  };

  const handleEditProfile = (studentId) => {
    // Navigate to UpdateProfile page with studentId
    navigate(`/student/updateprofile/${studentId}`);
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const handleGoToPage = () => {
    // TODO: Implement go to specific page
    console.log("Go to page:", currentPage);
  };

  // Load student profile data from API
  useEffect(() => {
    const loadStudentProfile = async () => {
      if (!username || !chapterId) {
        console.log(
          "StudentProfile: Missing username or chapterId, skipping API call"
        );
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log(
          "StudentProfile: Fetching profile data for",
          username,
          chapterId
        );

        const response = await studentDashboardService.getStudentProfile(
          username,
          chapterId
        );
        console.log("StudentProfile: API response", response);

        if (response.isSuccess && response.studentProfile) {
          // Convert single profile to array for table display
          const profileArray = Array.isArray(response.studentProfile)
            ? response.studentProfile
            : [response.studentProfile];
          setProfileData(profileArray);
          setTotalRecords(profileArray.length);
          setTotalPages(1);
        } else {
          setError(response.message || "Failed to load student profile");
        }
      } catch (err) {
        console.error("Error fetching student profile:", err);
        setError("Failed to load student profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadStudentProfile();
  }, [username, chapterId]);

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
  if (!profileData || profileData.length === 0) {
    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography
            variant="h6"
            sx={{ mb: 3, fontWeight: 600, color: "#1976d2" }}
          >
            Student Profile
          </Typography>
          <Alert severity="info">No profile information available.</Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: "#1976d2" }}>
          Student Profile
        </Typography>
      </Box>

      {/* Search Bar */}
      <Box
        sx={{
          backgroundColor: "#4caf50",
          p: 1.5,
          borderRadius: 1,
          mb: 2,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          flexWrap: "wrap",
        }}
      >
        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel
            sx={{
              color: "white",
              backgroundColor: "#4caf50",
              px: 0.5,
              fontSize: "0.813rem",
            }}
          >
            Search By
          </InputLabel>
          <Select
            value={searchBy}
            onChange={(e) => setSearchBy(e.target.value)}
            sx={{
              color: "white",
              fontSize: "0.813rem",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
              "& .MuiSelect-icon": { color: "white" },
            }}
          >
            <MenuItem value="ALL" sx={{ fontSize: "0.813rem" }}>
              -ALL-
            </MenuItem>
            <MenuItem value="STUDENT_ID" sx={{ fontSize: "0.813rem" }}>
              Student ID
            </MenuItem>
            <MenuItem value="STUDENT_NAME" sx={{ fontSize: "0.813rem" }}>
              Student Name
            </MenuItem>
            <MenuItem value="PROGRAM" sx={{ fontSize: "0.813rem" }}>
              Program
            </MenuItem>
            <MenuItem value="GRADE" sx={{ fontSize: "0.813rem" }}>
              Grade
            </MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel
            sx={{
              color: "white",
              backgroundColor: "#4caf50",
              px: 0.5,
              fontSize: "0.813rem",
            }}
          ></InputLabel>
          <Select
            value={searchCriteria}
            onChange={(e) => setSearchCriteria(e.target.value)}
            sx={{
              color: "white",
              fontSize: "0.813rem",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
              "& .MuiSelect-icon": { color: "white" },
            }}
          >
            <MenuItem value="" sx={{ fontSize: "0.813rem" }}>
              Select Criteria
            </MenuItem>
            <MenuItem value="equals" sx={{ fontSize: "0.813rem" }}>
              Equals
            </MenuItem>
            <MenuItem value="contains" sx={{ fontSize: "0.813rem" }}>
              Contains
            </MenuItem>
            <MenuItem value="starts_with" sx={{ fontSize: "0.813rem" }}>
              Starts With
            </MenuItem>
          </Select>
        </FormControl>

        <TextField
          size="small"
          label="Search Text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          sx={{
            minWidth: 150,
            "& .MuiOutlinedInput-root": {
              backgroundColor: "white",
              fontSize: "0.813rem",
            },
            "& .MuiInputLabel-root": {
              fontSize: "0.813rem",
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
            fontSize: "0.813rem",
            textTransform: "none",
            px: 2,
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
                  fontSize: "0.875rem",
                }}
              >
                Actions
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  borderRight: "1px solid #4caf50",
                  width: "8%",
                  fontSize: "0.875rem",
                }}
              >
                Student #
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  borderRight: "1px solid #4caf50",
                  width: "12%",
                  fontSize: "0.875rem",
                }}
              >
                Student Name
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  borderRight: "1px solid #4caf50",
                  width: "10%",
                  fontSize: "0.875rem",
                }}
              >
                Program
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  borderRight: "1px solid #4caf50",
                  width: "8%",
                  fontSize: "0.875rem",
                }}
              >
                Class
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  borderRight: "1px solid #4caf50",
                  width: "6%",
                  fontSize: "0.875rem",
                }}
              >
                Grade
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  borderRight: "1px solid #4caf50",
                  width: "12%",
                  fontSize: "0.875rem",
                }}
              >
                School
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  borderRight: "1px solid #4caf50",
                  width: "10%",
                  fontSize: "0.875rem",
                }}
              >
                Parent
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  borderRight: "1px solid #4caf50",
                  width: "10%",
                  fontSize: "0.875rem",
                }}
              >
                Contact #
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  borderRight: "1px solid #4caf50",
                  width: "12%",
                  fontSize: "0.875rem",
                }}
              >
                Email
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  borderRight: "1px solid #4caf50",
                  width: "8%",
                  fontSize: "0.875rem",
                }}
              >
                Session
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  width: "8%",
                  fontSize: "0.875rem",
                }}
              >
                Location
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {profileData.map((student, index) => (
              <TableRow
                key={student.studentID || index}
                sx={{ "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" } }}
              >
                <TableCell
                  sx={{ borderRight: "1px solid #4caf50", width: "8%" }}
                >
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleEditProfile(student.studentID)}
                    sx={{ fontSize: "1rem" }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </TableCell>
                <TableCell
                  sx={{ borderRight: "1px solid #4caf50", width: "8%" }}
                >
                  {student.studentID}
                </TableCell>
                <TableCell
                  sx={{ borderRight: "1px solid #4caf50", width: "12%" }}
                >
                  {student.studentName}
                </TableCell>
                <TableCell
                  sx={{ borderRight: "1px solid #4caf50", width: "10%" }}
                >
                  <Chip
                    label="Math Circle"
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell
                  sx={{ borderRight: "1px solid #4caf50", width: "8%" }}
                >
                  Jr Adv
                </TableCell>
                <TableCell
                  sx={{ borderRight: "1px solid #4caf50", width: "6%" }}
                >
                  {student.grade}
                </TableCell>
                <TableCell
                  sx={{ borderRight: "1px solid #4caf50", width: "12%" }}
                >
                  {student.school}
                </TableCell>
                <TableCell
                  sx={{ borderRight: "1px solid #4caf50", width: "10%" }}
                >
                  {student.parentName}
                </TableCell>
                <TableCell
                  sx={{ borderRight: "1px solid #4caf50", width: "10%" }}
                >
                  {student.phone}
                </TableCell>
                <TableCell
                  sx={{ borderRight: "1px solid #4caf50", width: "12%" }}
                >
                  {student.email}
                </TableCell>
                <TableCell
                  sx={{ borderRight: "1px solid #4caf50", width: "8%" }}
                >
                  <Chip
                    label="F2025"
                    size="small"
                    color="secondary"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell sx={{ width: "8%" }}>On Site</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Bar */}
      <Box
        sx={{
          backgroundColor: "#4caf50",
          p: 2,
          borderRadius: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton size="small" sx={{ color: "white" }}>
            <FirstPageIcon />
          </IconButton>
          <IconButton size="small" sx={{ color: "white" }}>
            <PrevPageIcon />
          </IconButton>
          <IconButton size="small" sx={{ color: "white" }}>
            <NextPageIcon />
          </IconButton>
          <IconButton size="small" sx={{ color: "white" }}>
            <LastPageIcon />
          </IconButton>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography sx={{ color: "white", fontSize: "0.875rem" }}>
            GoTo
          </Typography>
          <Select
            size="small"
            value={currentPage}
            onChange={(e) => setCurrentPage(e.target.value)}
            sx={{
              color: "white",
              minWidth: 60,
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
            }}
          >
            <MenuItem value={1}>1</MenuItem>
          </Select>
        </Box>

        <Typography sx={{ color: "white", fontSize: "0.875rem" }}>
          Page(s): {currentPage} of {totalPages}
        </Typography>

        <Typography sx={{ color: "white", fontSize: "0.875rem" }}>
          Record(s): 1 - {totalRecords} of {totalRecords}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography sx={{ color: "white", fontSize: "0.875rem" }}>
            Go to Page Number:
          </Typography>
          <TextField
            size="small"
            value={currentPage}
            onChange={(e) => setCurrentPage(parseInt(e.target.value) || 1)}
            sx={{
              width: 60,
              "& .MuiOutlinedInput-root": { backgroundColor: "white" },
            }}
          />
          <Button
            size="small"
            variant="contained"
            onClick={handleGoToPage}
            sx={{
              backgroundColor: "white",
              color: "#4caf50",
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
