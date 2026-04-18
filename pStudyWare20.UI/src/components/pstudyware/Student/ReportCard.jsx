import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  IconButton,
  Container,
} from "@mui/material";
import {
  Assessment as AssessmentIcon,
  FirstPage as FirstPageIcon,
  KeyboardArrowLeft as PrevPageIcon,
  KeyboardArrowRight as NextPageIcon,
  LastPage as LastPageIcon,
} from "@mui/icons-material";
import { useAuth } from "../../../contexts/AuthContext";
import studentDashboardService from "../../../services/studentDashboardService";
import {
  PORTAL_CARD_BOX_SHADOW,
  portalCardAntiLiftSx,
} from "../../../styles/applicationSurfaces";

const ReportCard = ({ username: propUsername }) => {
  // Get user from auth context
  const { user } = useAuth();

  // Use prop username if provided, otherwise use username from auth context
  const username = propUsername || user?.email || user?.username;
  const [reportCardData, setReportCardData] = useState([]);
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

  const pageSize = 50; // Match old ASPX system

  const getScoreColor = (score, totalScore) => {
    const percentage = (score / totalScore) * 100;
    if (percentage >= 90) return "#4caf50";
    if (percentage >= 80) return "#ff9800";
    if (percentage >= 70) return "#ff5722";
    return "#f44336";
  };

  // Implement search functionality
  const handleSearch = () => {
    let filtered = [...reportCardData];

    if (searchBy !== "ALL" && searchText.trim()) {
      filtered = reportCardData.filter((report) => {
        let fieldValue = "";

        switch (searchBy) {
          case "STUDENT_NAME":
            fieldValue = report.studentName || "";
            break;
          case "CLASS":
            fieldValue = report.group || "";
            break;
          case "EXAM_TYPE":
            fieldValue = report.examType || "";
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

  // Load report card data from API (cancelled guard avoids setState after unmount / duplicate runs)
  useEffect(() => {
    if (!username) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const loadReportCard = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await studentDashboardService.getReportCard(username);
        if (cancelled) return;
        if (response.isSuccess && response.reportCardEntries != null) {
          const entries = Array.isArray(response.reportCardEntries) ? response.reportCardEntries : [];
          setReportCardData(entries);
          setFilteredData(entries);
          setTotalRecords(entries.length);
        } else {
          setError(response?.message || "Failed to load report card");
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Error fetching report card:", err);
          const serverMessage = err.response?.data?.message || err.message;
          setError(serverMessage || "Failed to load report card. Please try again.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadReportCard();
    return () => {
      cancelled = true;
    };
  }, [username]);

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

  // Determine if this is a standalone page (not embedded in dashboard)
  const isStandalonePage = !propUsername;

  const content = (
    <Box sx={{ width: "100%", mb: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 2 }}>
        <Typography
          variant={isStandalonePage ? "h4" : "subtitle1"}
          sx={{
            fontWeight: 600,
            color: "#1976d2",
            fontSize: isStandalonePage ? "2rem" : "1rem",
          }}
        >
          {isStandalonePage ? "Report Card" : "Last Session - Report Card"}
        </Typography>
      </Box>

      {/* Show loading state */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Show error state */}
      {!loading && error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Search Bar and Table */}
      {!loading && (
        <>
          {/* Search Bar */}
          <Box
            sx={{
              backgroundColor: "#4caf50",
              p: 0.5,
              borderRadius: 1,
              mb: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
                  minWidth: 120,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "white",
                  },
                  "& .MuiSelect-icon": { color: "white" },
                }}
              >
                <MenuItem value="ALL" sx={{ fontSize: "0.75rem" }}>
                  -ALL-
                </MenuItem>
                <MenuItem value="STUDENT_NAME" sx={{ fontSize: "0.75rem" }}>
                  Student Name
                </MenuItem>
                <MenuItem value="CLASS" sx={{ fontSize: "0.75rem" }}>
                  Class
                </MenuItem>
                <MenuItem value="EXAM_TYPE" sx={{ fontSize: "0.75rem" }}>
                  Exam Type
                </MenuItem>
              </Select>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
                  minWidth: 120,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "white",
                  },
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
                px: 2,
                "&:hover": { backgroundColor: "#f5f5f5" },
              }}
            >
              Find
            </Button>
          </Box>

          {/* Table */}
          <TableContainer component={Paper} sx={{ mb: 2, width: "100%" }}>
            <Table sx={{ width: "100%", tableLayout: "auto" }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#e8f5e8" }}>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      borderRight: "1px solid #4caf50",
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
                      fontSize: "0.75rem",
                      padding: "3px 5px",
                    }}
                  >
                    Session
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      borderRight: "1px solid #4caf50",
                      fontSize: "0.75rem",
                      padding: "3px 5px",
                    }}
                  >
                    Exam Type
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      borderRight: "1px solid #4caf50",
                      fontSize: "0.75rem",
                      padding: "3px 5px",
                    }}
                  >
                    Exam Date
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      borderRight: "1px solid #4caf50",
                      fontSize: "0.75rem",
                      padding: "3px 5px",
                    }}
                  >
                    Total Score
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      borderRight: "1px solid #4caf50",
                      fontSize: "0.75rem",
                      padding: "3px 5px",
                    }}
                  >
                    Top Score
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      borderRight: "1px solid #4caf50",
                      fontSize: "0.75rem",
                      padding: "3px 5px",
                    }}
                  >
                    AVG Score
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      borderRight: "1px solid #4caf50",
                      fontSize: "0.75rem",
                      padding: "3px 5px",
                    }}
                  >
                    Your Score
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      padding: "3px 5px",
                    }}
                  >
                    Comments
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedData && displayedData.length > 0 ? (
                  displayedData.map((report, index) => (
                    <TableRow key={index} hover>
                      <TableCell
                        sx={{ fontSize: "0.75rem", padding: "6px 8px" }}
                      >
                        {report.studentName || "N/A"}
                      </TableCell>
                      <TableCell
                        sx={{ fontSize: "0.75rem", padding: "6px 8px" }}
                      >
                        {report.group || "N/A"}
                      </TableCell>
                      <TableCell
                        sx={{ fontSize: "0.75rem", padding: "6px 8px" }}
                      >
                        <Chip
                          label={report.semester || "N/A"}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ fontSize: "0.7rem" }}
                        />
                      </TableCell>
                      <TableCell
                        sx={{ fontSize: "0.75rem", padding: "6px 8px" }}
                      >
                        {report.examType || "N/A"}
                      </TableCell>
                      <TableCell
                        sx={{ fontSize: "0.75rem", padding: "6px 8px" }}
                      >
                        {report.examDate
                          ? new Date(report.examDate).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                      <TableCell
                        sx={{ fontSize: "0.75rem", padding: "6px 8px" }}
                      >
                        {report.totalCredit || 0}
                      </TableCell>
                      <TableCell
                        sx={{ fontSize: "0.75rem", padding: "6px 8px" }}
                      >
                        {report.highestScore || 0}
                      </TableCell>
                      <TableCell
                        sx={{ fontSize: "0.75rem", padding: "6px 8px" }}
                      >
                        {report.classAverage || 0}
                      </TableCell>
                      <TableCell
                        sx={{ fontSize: "0.75rem", padding: "6px 8px" }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            fontSize: "0.75rem",
                            color: getScoreColor(
                              report.receivedCredit || 0,
                              report.totalCredit || 1
                            ),
                          }}
                        >
                          {report.receivedCredit || 0}
                        </Typography>
                      </TableCell>
                      <TableCell
                        sx={{ fontSize: "0.75rem", padding: "6px 8px" }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ fontSize: "0.75rem" }}
                        >
                          {report.comments || ""}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      align="center"
                      sx={{ py: 3, fontSize: "0.75rem" }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: "0.75rem" }}
                      >
                        No records to display
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
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
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

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
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
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "white",
                  },
                  "& .MuiSelect-icon": { color: "white" },
                }}
              >
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <MenuItem
                      key={page}
                      value={page}
                      sx={{ fontSize: "0.75rem" }}
                    >
                      {page}
                    </MenuItem>
                  )
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

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
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
                  "&:hover": { backgroundColor: "#f5f5f5" },
                }}
              >
                Go
              </Button>
            </Box>
          </Box>

          {reportCardData && reportCardData.length > 0 && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                backgroundColor: "#e8f5e8",
                borderRadius: 1,
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: "#2e7d32", fontSize: "1rem" }}
              >
                <strong>Performance Summary:</strong> Keep up the great work!
                Continue practicing and reviewing class materials to improve
                your scores.
              </Typography>
            </Box>
          )}
        </>
      )}
    </Box>
  );

  // If standalone page, wrap in Container with proper padding
  if (isStandalonePage) {
    return (
      <Container maxWidth="xl" sx={{ pt: 12, pb: 4 }}>
        <Card
          sx={{
            backgroundColor: "white",
            borderRadius: 2,
            boxShadow: PORTAL_CARD_BOX_SHADOW,
            overflow: "hidden",
            ...portalCardAntiLiftSx,
          }}
        >
          <CardContent sx={{ p: 3 }}>{content}</CardContent>
        </Card>
      </Container>
    );
  }

  // If embedded in dashboard, return content directly
  return content;
};

export default ReportCard;
