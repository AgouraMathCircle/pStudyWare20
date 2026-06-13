import React, { useState, useMemo, useEffect } from "react";
import {
  Typography,
  Button,
  TextField,
  Box,
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
import {
  adminSessionListFindButtonSx,
  adminSessionListGridTableSx,
  adminSessionListHeaderBarSx,
  adminSessionListMenuItemSx,
  adminSessionListSearchBarSx,
  adminSessionListSearchFieldSx,
  adminSessionListSearchLabelSx,
  adminSessionListSearchSelectSx,
  adminSessionListTableBodyCellSx,
  adminSessionListTableBodyRowSx,
  adminSessionListTableHeadCellSx,
  adminSessionListTableHeadRowSx,
  adminSessionListTableContainerSx,
  adminSessionListTitleSx,
  adminSessionListEmptyCellSx,
  adminSessionListEmptyTextSx,
} from "../styles/applicationSurfaces";
import AdminSessionListPagination from "../Admin/AdminSessionListPagination";
import SortableHeader from "../Common/SortableHeader";
import {
  sortRows,
  toSortableDate,
  toSortableNumber,
} from "../../../utils/tableSort";

const scoreColumnWidths = {
  studentId: "7%",
  studentName: "12%",
  class: "8%",
  grade: "7%",
  session: "10%",
  examType: "9%",
  examDate: "9%",
  totalScore: "8%",
  yourScore: "8%",
  comments: "22%",
};

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString() : "—";

const getScoreFieldValue = (score, field) => {
  switch (field) {
    case "studentId":
      return toSortableNumber(score.studentID);
    case "studentName":
      return score.studentName ?? "";
    case "class":
      return score.group ?? "";
    case "grade":
      return score.grade ?? "";
    case "session":
      return score.semester ?? "";
    case "examType":
      return score.examType ?? "";
    case "examDate":
      return toSortableDate(score.examDate);
    case "totalScore":
      return toSortableNumber(score.totalCredit);
    case "yourScore":
      return toSortableNumber(score.receivedCredit);
    case "comments":
      return score.comments ?? "";
    default:
      return "";
  }
};

const StudentScoreScoresGrid = ({ scores = [], loading = false }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchBy, setSearchBy] = useState("ALL");
  const [searchCriteria, setSearchCriteria] = useState("");
  const [searchText, setSearchText] = useState("");
  const [appliedSearchText, setAppliedSearchText] = useState("");
  const [goToPageInput, setGoToPageInput] = useState("1");
  const [sortField, setSortField] = useState("examDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const pageSize = 25;

  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortField(field);
    setCurrentPage(1);
    setGoToPageInput("1");
  };

  useEffect(() => {
    setCurrentPage(1);
    setGoToPageInput("1");
  }, [scores]);

  const handleSearch = () => {
    setAppliedSearchText(searchText);
    setCurrentPage(1);
    setGoToPageInput("1");
  };

  const handlePageChange = (page) => {
    const totalPages = Math.max(1, Math.ceil((filteredScores.length || 0) / pageSize));
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setGoToPageInput(page.toString());
    }
  };

  const handleGoToPage = () => {
    const page = parseInt(goToPageInput, 10);
    const totalPages = Math.max(1, Math.ceil((filteredScores.length || 0) / pageSize));
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    } else {
      setGoToPageInput(currentPage.toString());
    }
  };

  const filteredScores = useMemo(() => {
    if (!scores?.length) return [];
    if (searchBy === "ALL" || !appliedSearchText.trim()) return scores;

    return scores.filter((score) => {
      let fieldValue = "";
      switch (searchBy) {
        case "STUDENT_ID":
          fieldValue = score.studentID?.toString() || "";
          break;
        case "STUDENT_NAME":
          fieldValue = score.studentName || "";
          break;
        case "CLASS":
          fieldValue = score.group || "";
          break;
        case "GRADE":
          fieldValue = score.grade || "";
          break;
        case "SESSION":
          fieldValue = score.semester || "";
          break;
        case "EXAM_TYPE":
          fieldValue = score.examType || "";
          break;
        case "COMMENTS":
          fieldValue = score.comments || "";
          break;
        default:
          return true;
      }

      fieldValue = fieldValue.toString().toLowerCase();
      const search = appliedSearchText.toLowerCase();
      switch (searchCriteria) {
        case "equals":
          return fieldValue === search;
        case "starts_with":
          return fieldValue.startsWith(search);
        default:
          return fieldValue.includes(search);
      }
    });
  }, [scores, searchBy, searchCriteria, appliedSearchText]);

  const sortedScores = useMemo(
    () => sortRows(filteredScores, sortField, sortOrder, getScoreFieldValue),
    [filteredScores, sortField, sortOrder]
  );

  const paginatedScores = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedScores.slice(start, start + pageSize);
  }, [sortedScores, currentPage, pageSize]);

  const totalPages = Math.max(1, Math.ceil((filteredScores.length || 0) / pageSize));
  const totalRecords = filteredScores.length || 0;

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={adminSessionListHeaderBarSx}>
        <Typography variant="subtitle1" component="div" sx={adminSessionListTitleSx}>
          Your Scores
        </Typography>
      </Box>

      <Box sx={adminSessionListSearchBarSx}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Typography sx={adminSessionListSearchLabelSx}>Search By:</Typography>
          <Select
            value={searchBy}
            onChange={(e) => setSearchBy(e.target.value)}
            size="small"
            sx={adminSessionListSearchSelectSx}
            disabled={loading}
          >
            <MenuItem value="ALL" sx={adminSessionListMenuItemSx}>-ALL-</MenuItem>
            <MenuItem value="STUDENT_ID" sx={adminSessionListMenuItemSx}>Student #</MenuItem>
            <MenuItem value="STUDENT_NAME" sx={adminSessionListMenuItemSx}>Student Name</MenuItem>
            <MenuItem value="CLASS" sx={adminSessionListMenuItemSx}>Class</MenuItem>
            <MenuItem value="GRADE" sx={adminSessionListMenuItemSx}>Grade</MenuItem>
            <MenuItem value="SESSION" sx={adminSessionListMenuItemSx}>Session</MenuItem>
            <MenuItem value="EXAM_TYPE" sx={adminSessionListMenuItemSx}>Exam Type</MenuItem>
            <MenuItem value="COMMENTS" sx={adminSessionListMenuItemSx}>Comments</MenuItem>
          </Select>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Typography sx={adminSessionListSearchLabelSx}>Criteria:</Typography>
          <Select
            value={searchCriteria}
            onChange={(e) => setSearchCriteria(e.target.value)}
            size="small"
            sx={adminSessionListSearchSelectSx}
            disabled={loading}
          >
            <MenuItem value="" sx={adminSessionListMenuItemSx}>Select Criteria</MenuItem>
            <MenuItem value="equals" sx={adminSessionListMenuItemSx}>Equals</MenuItem>
            <MenuItem value="contains" sx={adminSessionListMenuItemSx}>Contains</MenuItem>
            <MenuItem value="starts_with" sx={adminSessionListMenuItemSx}>Starts With</MenuItem>
          </Select>
        </Box>
        <TextField
          size="small"
          placeholder="Search Text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          sx={adminSessionListSearchFieldSx}
          disabled={loading}
        />
        <Button
          variant="contained"
          size="small"
          onClick={handleSearch}
          sx={adminSessionListFindButtonSx}
          disabled={loading}
        >
          Find
        </Button>
      </Box>

      <TableContainer component={Paper} sx={adminSessionListTableContainerSx}>
        <Table size="small" sx={adminSessionListGridTableSx}>
          <TableHead>
            <TableRow sx={adminSessionListTableHeadRowSx}>
              <SortableHeader label="Student #" field="studentId" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} headCellSx={adminSessionListTableHeadCellSx(scoreColumnWidths.studentId)} />
              <SortableHeader label="Student Name" field="studentName" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} headCellSx={adminSessionListTableHeadCellSx(scoreColumnWidths.studentName)} />
              <SortableHeader label="Class" field="class" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} headCellSx={adminSessionListTableHeadCellSx(scoreColumnWidths.class)} />
              <SortableHeader label="Grade" field="grade" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} headCellSx={adminSessionListTableHeadCellSx(scoreColumnWidths.grade)} />
              <SortableHeader label="Session" field="session" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} headCellSx={adminSessionListTableHeadCellSx(scoreColumnWidths.session)} />
              <SortableHeader label="Exam Type" field="examType" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} headCellSx={adminSessionListTableHeadCellSx(scoreColumnWidths.examType)} />
              <SortableHeader label="Exam Date" field="examDate" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} headCellSx={adminSessionListTableHeadCellSx(scoreColumnWidths.examDate)} />
              <SortableHeader label="Total Score" field="totalScore" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} align="right" headCellSx={adminSessionListTableHeadCellSx(scoreColumnWidths.totalScore)} />
              <SortableHeader label="Your Score" field="yourScore" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} align="right" headCellSx={adminSessionListTableHeadCellSx(scoreColumnWidths.yourScore)} />
              <SortableHeader label="Comments" field="comments" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} headCellSx={adminSessionListTableHeadCellSx(scoreColumnWidths.comments, true)} />
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={adminSessionListEmptyCellSx}>
                  <Typography variant="body2" color="textSecondary" sx={adminSessionListEmptyTextSx}>
                    Loading scores...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : paginatedScores.length > 0 ? (
              paginatedScores.map((score, index) => (
                <TableRow key={`${score.studentID}-${score.examType}-${index}`} sx={adminSessionListTableBodyRowSx}>
                  <TableCell sx={adminSessionListTableBodyCellSx()}>{score.studentID ?? "—"}</TableCell>
                  <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>{score.studentName || "—"}</TableCell>
                  <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>{score.group || "—"}</TableCell>
                  <TableCell sx={adminSessionListTableBodyCellSx()}>{score.grade || "—"}</TableCell>
                  <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>{score.semester || "—"}</TableCell>
                  <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>{score.examType || "—"}</TableCell>
                  <TableCell sx={adminSessionListTableBodyCellSx()}>{formatDate(score.examDate)}</TableCell>
                  <TableCell sx={adminSessionListTableBodyCellSx()} align="right">{score.totalCredit ?? "—"}</TableCell>
                  <TableCell sx={adminSessionListTableBodyCellSx()} align="right">{score.receivedCredit ?? "—"}</TableCell>
                  <TableCell sx={adminSessionListTableBodyCellSx({ isLast: true, ellipsis: true })}>{score.comments || "—"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={adminSessionListEmptyCellSx}>
                  <Typography variant="body2" color="textSecondary" sx={adminSessionListEmptyTextSx}>
                    {appliedSearchText
                      ? "No scores found matching your search."
                      : "No records to display"}
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

export default StudentScoreScoresGrid;
