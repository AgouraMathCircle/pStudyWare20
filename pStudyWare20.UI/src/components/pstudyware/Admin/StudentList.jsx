import React, { useState, useMemo } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Typography,
  Button,
  TextField,
  Box,
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
  IconButton,
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
import { APPLICATION_ADMIN_TITLE_COLOR } from "../../../styles/applicationSurfaces";

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

  const pageSize = 25;

  const handlePageChange = (page) => {
    const totalPages = Math.ceil(
      (filteredAndSortedStudents?.length || 0) / pageSize,
    );
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setGoToPageInput(page.toString());
    }
  };

  const handleGoToPage = () => {
    const page = parseInt(goToPageInput, 10);
    const totalPages = Math.ceil(
      (filteredAndSortedStudents?.length || 0) / pageSize,
    );
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    } else {
      setGoToPageInput(currentPage.toString());
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    setGoToPageInput("1");
  };

  const filteredAndSortedStudents = useMemo(() => {
    if (!students || students.length === 0) return [];

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

    const sorted = [...filtered].sort((a, b) => {
      let aValue = a[orderBy];
      let bValue = b[orderBy];
      if (aValue == null) aValue = "";
      if (bValue == null) bValue = "";
      if (typeof aValue === "number" && typeof bValue === "number") {
        return order === "asc" ? aValue - bValue : bValue - aValue;
      }
      aValue = aValue.toString().toLowerCase();
      bValue = bValue.toString().toLowerCase();
      if (order === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      }
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    });

    return sorted;
  }, [students, searchBy, searchCriteria, searchText, orderBy, order]);

  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedStudents.slice(start, start + pageSize);
  }, [filteredAndSortedStudents, currentPage, pageSize]);

  const totalPages = Math.ceil(
    (filteredAndSortedStudents?.length || 0) / pageSize,
  );
  const totalRecords = filteredAndSortedStudents?.length || 0;

  const cellPadding = "0 8px";

  return (
    <Box>
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
                  width: "5%",
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
                  width: "12%",
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
                  width: "8%",
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
                  width: "6%",
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
                  width: "11%",
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
                  width: "11%",
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
                Session
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
                Location
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
                Contact #
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 400,
                  width: "16%",
                  fontSize: "0.75rem",
                  padding: cellPadding,
                }}
              >
                Email
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedStudents.length > 0 ? (
              paginatedStudents.map((student, index) => {
                const sid = student.studentID;
                return (
                  <TableRow
                    key={sid ?? `row-${index}`}
                    sx={{
                      "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" },
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
                      {sid ? (
                        <Tooltip title="Update profile">
                          <IconButton
                            component={RouterLink}
                            to={`/UpdateProfile/${sid}`}
                            size="small"
                            color="primary"
                            sx={{ padding: "2px" }}
                          >
                            <EditIcon sx={{ fontSize: "1rem" }} />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell
                      sx={{
                        borderRight: "1px solid #4caf50",
                        fontSize: "0.75rem",
                        padding: cellPadding,
                      }}
                    >
                      {sid ?? "—"}
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
                      <Tooltip title={student.studentName ?? "—"}>
                        <span>{student.studentName || "—"}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell
                      sx={{
                        borderRight: "1px solid #4caf50",
                        fontSize: "0.75rem",
                        padding: cellPadding,
                      }}
                    >
                      {student.class || "—"}
                    </TableCell>
                    <TableCell
                      sx={{
                        borderRight: "1px solid #4caf50",
                        fontSize: "0.75rem",
                        padding: cellPadding,
                      }}
                    >
                      {student.grade || "—"}
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
                      <Tooltip title={student.school ?? "—"}>
                        <span>{student.school || "—"}</span>
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
                      <Tooltip title={student.parentName ?? "—"}>
                        <span>{student.parentName || "—"}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell
                      sx={{
                        borderRight: "1px solid #4caf50",
                        fontSize: "0.75rem",
                        padding: cellPadding,
                      }}
                    >
                      {student.eventSession || "—"}
                    </TableCell>
                    <TableCell
                      sx={{
                        borderRight: "1px solid #4caf50",
                        fontSize: "0.75rem",
                        padding: cellPadding,
                      }}
                    >
                      {student.eventLocation || "—"}
                    </TableCell>
                    <TableCell
                      sx={{
                        borderRight: "1px solid #4caf50",
                        fontSize: "0.75rem",
                        padding: cellPadding,
                      }}
                    >
                      {student.phoneNumber || "—"}
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
                      <Tooltip title={student.emailAddress ?? ""}>
                        <span>{student.emailAddress || "—"}</span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={11}
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
              Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (p) => (
                  <MenuItem key={p} value={p} sx={{ fontSize: "0.75rem" }}>
                    {p}
                  </MenuItem>
                ),
              )
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
              if (e.key === "Enter") handleGoToPage();
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
    </Box>
  );
};

export default StudentList;
