import React, { useState, useMemo } from "react";
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
} from "@mui/material";
import { Download as DownloadIcon } from "@mui/icons-material";
import {
  adminSessionListFindButtonSx,
  adminSessionListGridTableSx,
  adminSessionListHeaderBarSx,
  adminSessionListMenuItemSx,
  adminSessionListSearchBarSx,
  adminSessionListSearchFieldSx,
  adminSessionListSearchLabelSx,
  adminSessionListSearchSelectSx,
  adminSessionListTitleSx,
} from "../styles/applicationSurfaces";
import AdminSessionListPagination from "./AdminSessionListPagination";
import SortableHeader from "../Common/SortableHeader";

const studentListColumnWidths = {
  studentId: "14%",
  studentName: "26%",
  class: "26%",
  session: "17%",
  location: "17%",
};

const StudentList = ({
  students,
  onExportToExcel,
  canExportData,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchBy, setSearchBy] = useState("ALL");
  const [searchCriteria, setSearchCriteria] = useState("");
  const [searchText, setSearchText] = useState("");
  const [orderBy, setOrderBy] = useState("studentID");
  const [order, setOrder] = useState("desc");
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

  const handleSort = (field) => {
    const isAsc = orderBy === field && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(field);
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
      <Box sx={adminSessionListHeaderBarSx}>
        <Typography variant="subtitle1" component="div" sx={adminSessionListTitleSx}>
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
            <MenuItem value="CLASS" sx={adminSessionListMenuItemSx}>
              Class
            </MenuItem>
            <MenuItem value="SESSION" sx={adminSessionListMenuItemSx}>
              Session
            </MenuItem>
            <MenuItem value="LOCATION" sx={adminSessionListMenuItemSx}>
              Location
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
            <TableRow sx={{ backgroundColor: "#e8f5e8" }}>
              <SortableHeader
                label="Student #"
                field="studentID"
                sortField={orderBy}
                sortOrder={order}
                onSort={handleSort}
                headCellSx={{
                  fontWeight: 400,
                  width: studentListColumnWidths.studentId,
                  fontSize: "0.75rem",
                  padding: cellPadding,
                }}
              />
              <SortableHeader
                label="Student Name"
                field="studentName"
                sortField={orderBy}
                sortOrder={order}
                onSort={handleSort}
                headCellSx={{
                  fontWeight: 400,
                  width: studentListColumnWidths.studentName,
                  fontSize: "0.75rem",
                  padding: cellPadding,
                }}
              />
              <SortableHeader
                label="Class"
                field="class"
                sortField={orderBy}
                sortOrder={order}
                onSort={handleSort}
                headCellSx={{
                  fontWeight: 400,
                  width: studentListColumnWidths.class,
                  fontSize: "0.75rem",
                  padding: cellPadding,
                }}
              />
              <SortableHeader
                label="Session"
                field="eventSession"
                sortField={orderBy}
                sortOrder={order}
                onSort={handleSort}
                headCellSx={{
                  fontWeight: 400,
                  width: studentListColumnWidths.session,
                  fontSize: "0.75rem",
                  padding: cellPadding,
                }}
              />
              <SortableHeader
                label="Location"
                field="eventLocation"
                sortField={orderBy}
                sortOrder={order}
                onSort={handleSort}
                headCellSx={{
                  fontWeight: 400,
                  width: studentListColumnWidths.location,
                  fontSize: "0.75rem",
                  padding: cellPadding,
                }}
              />
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
                        fontSize: "0.75rem",
                        padding: cellPadding,
                      }}
                    >
                      {sid ?? "—"}
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
                      <Tooltip title={student.studentName ?? "—"}>
                        <span>{student.studentName || "—"}</span>
                      </Tooltip>
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
                      <Tooltip title={student.class ?? "—"}>
                        <span>{student.class || "—"}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "0.75rem",
                        padding: cellPadding,
                      }}
                    >
                      {student.eventSession || "—"}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "0.75rem",
                        padding: cellPadding,
                      }}
                    >
                      {student.eventLocation || "—"}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
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
    </Box>
  );
};

export default StudentList;
