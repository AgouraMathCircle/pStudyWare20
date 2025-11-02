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
  Paper,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from "@mui/material";
import {
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FirstPage as FirstPageIcon,
  KeyboardArrowLeft as PrevPageIcon,
  KeyboardArrowRight as NextPageIcon,
  LastPage as LastPageIcon,
  Add as AddIcon,
} from "@mui/icons-material";

const InstructorList = ({
  instructors,
  onExportToExcel,
  canExportData,
  onRefresh,
  onEdit,
  onDelete,
  onAdd,
  canAddInstructor,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchBy, setSearchBy] = useState("ALL");
  const [searchCriteria, setSearchCriteria] = useState("");
  const [searchText, setSearchText] = useState("");
  const [orderBy, setOrderBy] = useState("instructorID");
  const [order, setOrder] = useState("asc");
  const [goToPageInput, setGoToPageInput] = useState("1");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(null);

  const pageSize = 10;

  // Handle page change
  const handlePageChange = (page) => {
    const totalPages = Math.ceil(
      (filteredAndSortedInstructors?.length || 0) / pageSize
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
      (filteredAndSortedInstructors?.length || 0) / pageSize
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

  // Handle delete confirmation dialog
  const handleDeleteClick = (instructor) => {
    setSelectedInstructor(instructor);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedInstructor) {
      onDelete(selectedInstructor.instructorID);
    }
    setDeleteDialogOpen(false);
    setSelectedInstructor(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedInstructor(null);
  };

  // Get instructor type display text
  const getInstructorTypeText = (type) => {
    const types = {
      P: "Primary",
      S: "Secondary",
      C: "Coordinator",
      V: "Volunteer",
    };
    return types[type] || type;
  };

  // Get class display text
  const getClassText = (classCode) => {
    const classes = {
      JB: "Junior Beginner",
      JI: "Junior Intermediate",
      JA: "Junior Advanced",
      SB: "Senior Beginner",
      SI: "Senior Intermediate",
      SA: "Senior Advanced",
      DS: "Data Science",
      AI: "Artificial Intelligence",
      GD: "Game Development",
      AD: "App Development",
      DM: "Data Management",
      ST: "PSAT",
      AT: "ACT",
    };
    return classes[classCode] || classCode;
  };

  // Get status display
  const getStatusDisplay = (status) => {
    const isActive = status === "1" || status?.toLowerCase() === "active";
    return (
      <Chip
        label={isActive ? "Active" : "Inactive"}
        color={isActive ? "success" : "default"}
        size="small"
        sx={{ fontSize: "0.7rem", height: "20px" }}
      />
    );
  };

  // Filter and sort instructors
  const filteredAndSortedInstructors = useMemo(() => {
    if (!instructors || instructors.length === 0) return [];

    // Filter
    let filtered = instructors;
    if (searchBy !== "ALL" && searchText.trim()) {
      filtered = instructors.filter((instructor) => {
        let fieldValue = "";

        switch (searchBy) {
          case "INSTRUCTOR_ID":
            fieldValue = instructor.instructorID?.toString() || "";
            break;
          case "FIRST_NAME":
            fieldValue = instructor.firstName || "";
            break;
          case "LAST_NAME":
            fieldValue = instructor.lastName || "";
            break;
          case "EMAIL":
            fieldValue = instructor.emailID || "";
            break;
          case "CHAPTER":
            fieldValue = instructor.chapterName || "";
            break;
          case "CLASS":
            fieldValue = instructor.class || "";
            break;
          case "TYPE":
            fieldValue = instructor.instructorType || "";
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
  }, [instructors, searchBy, searchCriteria, searchText, orderBy, order]);

  // Get paginated instructors
  const paginatedInstructors = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredAndSortedInstructors.slice(start, end);
  }, [filteredAndSortedInstructors, currentPage, pageSize]);

  const totalPages = Math.ceil(
    (filteredAndSortedInstructors?.length || 0) / pageSize
  );
  const totalRecords = filteredAndSortedInstructors?.length || 0;

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
          Instructor List
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          {canAddInstructor && (
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<AddIcon />}
              onClick={onAdd}
              sx={{ fontSize: "0.75rem", px: 1.5, py: 0.25 }}
            >
              Add Instructor
            </Button>
          )}
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
            <MenuItem value="INSTRUCTOR_ID" sx={{ fontSize: "0.75rem" }}>
              Instructor ID
            </MenuItem>
            <MenuItem value="FIRST_NAME" sx={{ fontSize: "0.75rem" }}>
              First Name
            </MenuItem>
            <MenuItem value="LAST_NAME" sx={{ fontSize: "0.75rem" }}>
              Last Name
            </MenuItem>
            <MenuItem value="EMAIL" sx={{ fontSize: "0.75rem" }}>
              Email
            </MenuItem>
            <MenuItem value="CHAPTER" sx={{ fontSize: "0.75rem" }}>
              Chapter
            </MenuItem>
            <MenuItem value="CLASS" sx={{ fontSize: "0.75rem" }}>
              Class
            </MenuItem>
            <MenuItem value="TYPE" sx={{ fontSize: "0.75rem" }}>
              Type
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
                  width: "7%",
                  fontSize: "0.75rem",
                  padding: "3px 5px",
                }}
              >
                ID
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
                First Name
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
                Last Name
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
                Chapter
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
                Type
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
                  width: "10%",
                  fontSize: "0.75rem",
                  padding: "3px 5px",
                }}
              >
                Username
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
                Phone
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  width: "7%",
                  fontSize: "0.75rem",
                  padding: "3px 5px",
                }}
              >
                Status
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedInstructors.length > 0 ? (
              paginatedInstructors.map((instructor, index) => (
                <TableRow
                  key={instructor.instructorID || index}
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
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      <Tooltip title="Edit Instructor">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => onEdit(instructor)}
                          sx={{ fontSize: "0.75rem", padding: "2px" }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Instructor">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(instructor)}
                          sx={{ fontSize: "0.75rem", padding: "2px" }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={{
                      borderRight: "1px solid #4caf50",
                      width: "7%",
                      fontSize: "0.75rem",
                      padding: "3px 5px",
                    }}
                  >
                    {instructor.instructorID || "-"}
                  </TableCell>
                  <TableCell
                    sx={{
                      borderRight: "1px solid #4caf50",
                      width: "10%",
                      fontSize: "0.75rem",
                      padding: "3px 5px",
                    }}
                  >
                    {instructor.firstName || "-"}
                  </TableCell>
                  <TableCell
                    sx={{
                      borderRight: "1px solid #4caf50",
                      width: "10%",
                      fontSize: "0.75rem",
                      padding: "3px 5px",
                    }}
                  >
                    {instructor.lastName || "-"}
                  </TableCell>
                  <TableCell
                    sx={{
                      borderRight: "1px solid #4caf50",
                      width: "12%",
                      fontSize: "0.75rem",
                      padding: "3px 5px",
                    }}
                  >
                    {instructor.chapterName || "-"}
                  </TableCell>
                  <TableCell
                    sx={{
                      borderRight: "1px solid #4caf50",
                      width: "10%",
                      fontSize: "0.75rem",
                      padding: "3px 5px",
                    }}
                  >
                    {getInstructorTypeText(instructor.instructorType) || "-"}
                  </TableCell>
                  <TableCell
                    sx={{
                      borderRight: "1px solid #4caf50",
                      width: "10%",
                      fontSize: "0.75rem",
                      padding: "3px 5px",
                    }}
                  >
                    {getClassText(instructor.class) || "-"}
                  </TableCell>
                  <TableCell
                    sx={{
                      borderRight: "1px solid #4caf50",
                      width: "10%",
                      fontSize: "0.75rem",
                      padding: "3px 5px",
                    }}
                  >
                    {instructor.userName || "-"}
                  </TableCell>
                  <TableCell
                    sx={{
                      borderRight: "1px solid #4caf50",
                      width: "12%",
                      fontSize: "0.75rem",
                      padding: "3px 5px",
                      maxWidth: 150,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Tooltip title={instructor.emailID || "-"}>
                      <span>{instructor.emailID || "-"}</span>
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
                    {instructor.contactPhone || "-"}
                  </TableCell>
                  <TableCell
                    sx={{
                      width: "7%",
                      fontSize: "0.75rem",
                      padding: "3px 5px",
                    }}
                  >
                    {getStatusDisplay(instructor.memberStatus)}
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
                      ? "No instructors found matching your search criteria."
                      : "No instructor data available."}
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete instructor{" "}
            <strong>
              {selectedInstructor?.firstName} {selectedInstructor?.lastName}
            </strong>
            ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InstructorList;

