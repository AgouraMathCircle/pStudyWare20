import React, { useState, useMemo } from "react";
import {
  Typography,
  Button,
  TextField,
  Box,
  Card,
  CardContent,
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
  adminSessionListMenuItemSx,
  adminSessionListPanelCardSx,
  adminSessionListPanelContentSx,
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
  adminSessionListHeaderBarSx,
} from "../styles/applicationSurfaces";
import AdminSessionListPagination from "../Admin/AdminSessionListPagination";
import SortableHeader from "../Common/SortableHeader";
import {
  sortRows,
  toSortableDate,
  toSortableNumber,
} from "../../../utils/tableSort";

const scoreColumnWidths = {
  studentId: "8%",
  studentName: "14%",
  class: "12%",
  session: "12%",
  examType: "10%",
  examDate: "10%",
  totalScore: "8%",
  yourScore: "8%",
  comments: "10%",
  submittedDate: "8%",
};

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString() : "";

const getScoreFieldValue = (score, field) => {
  switch (field) {
    case "studentId":
      return toSortableNumber(score.studentID);
    case "studentName":
      return score.studentName ?? "";
    case "class":
      return score.group ?? "";
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
    case "submittedDate":
      return toSortableDate(score.submittedDate);
    default:
      return "";
  }
};

const OnlineExamScoresGrid = ({ scores = [], embedded = false, loading = false }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchBy, setSearchBy] = useState("ALL");
  const [searchCriteria, setSearchCriteria] = useState("");
  const [searchText, setSearchText] = useState("");
  const [goToPageInput, setGoToPageInput] = useState("1");
  const [sortField, setSortField] = useState("examDate");
  const [sortOrder, setSortOrder] = useState("desc");

  const pageSize = 10;

  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortField(field);
    setCurrentPage(1);
    setGoToPageInput("1");
  };

  const handlePageChange = (page) => {
    const totalPages = Math.ceil(
      (filteredScores?.length || 0) / pageSize
    );
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setGoToPageInput(page.toString());
    }
  };

  const handleGoToPage = () => {
    const page = parseInt(goToPageInput, 10);
    const totalPages = Math.ceil(
      (filteredScores?.length || 0) / pageSize
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

  const filteredScores = useMemo(() => {
    if (!scores || scores.length === 0) return [];

    if (searchBy === "ALL" || !searchText.trim()) {
      return scores;
    }

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
  }, [scores, searchBy, searchCriteria, searchText]);

  const sortedScores = useMemo(
    () => sortRows(filteredScores, sortField, sortOrder, getScoreFieldValue),
    [filteredScores, sortField, sortOrder]
  );

  const paginatedScores = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedScores.slice(start, start + pageSize);
  }, [sortedScores, currentPage, pageSize]);

  const totalPages = Math.ceil((filteredScores?.length || 0) / pageSize);
  const totalRecords = filteredScores?.length || 0;

  const scoresBody = (
    <>
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
                Student #
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
              <MenuItem value="EXAM_TYPE" sx={adminSessionListMenuItemSx}>
                Exam Type
              </MenuItem>
              <MenuItem value="COMMENTS" sx={adminSessionListMenuItemSx}>
                Comments
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

        <TableContainer component={Paper} sx={adminSessionListTableContainerSx}>
          <Table size="small" sx={adminSessionListGridTableSx}>
            <TableHead>
              <TableRow sx={adminSessionListTableHeadRowSx}>
                <SortableHeader label="Student #" field="studentId" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} headCellSx={adminSessionListTableHeadCellSx(scoreColumnWidths.studentId)} />
                <SortableHeader label="Student Name" field="studentName" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} headCellSx={adminSessionListTableHeadCellSx(scoreColumnWidths.studentName)} />
                <SortableHeader label="Class" field="class" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} headCellSx={adminSessionListTableHeadCellSx(scoreColumnWidths.class)} />
                <SortableHeader label="Session" field="session" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} headCellSx={adminSessionListTableHeadCellSx(scoreColumnWidths.session)} />
                <SortableHeader label="Exam Type" field="examType" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} headCellSx={adminSessionListTableHeadCellSx(scoreColumnWidths.examType)} />
                <SortableHeader label="Exam Date" field="examDate" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} headCellSx={adminSessionListTableHeadCellSx(scoreColumnWidths.examDate)} />
                <SortableHeader label="Total Score" field="totalScore" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} align="right" headCellSx={adminSessionListTableHeadCellSx(scoreColumnWidths.totalScore, false)} />
                <SortableHeader label="Your Score" field="yourScore" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} align="right" headCellSx={adminSessionListTableHeadCellSx(scoreColumnWidths.yourScore, false)} />
                <SortableHeader label="Comments" field="comments" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} headCellSx={adminSessionListTableHeadCellSx(scoreColumnWidths.comments)} />
                <SortableHeader label="Submitted Date" field="submittedDate" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} headCellSx={adminSessionListTableHeadCellSx(scoreColumnWidths.submittedDate, true)} />
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
                  <TableRow key={index} sx={adminSessionListTableBodyRowSx}>
                    <TableCell sx={adminSessionListTableBodyCellSx()}>
                      {score.studentID ?? "—"}
                    </TableCell>
                    <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
                      {score.studentName || "—"}
                    </TableCell>
                    <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
                      {score.group || "—"}
                    </TableCell>
                    <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
                      {score.semester || "—"}
                    </TableCell>
                    <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
                      {score.examType || "—"}
                    </TableCell>
                    <TableCell sx={adminSessionListTableBodyCellSx()}>
                      {formatDate(score.examDate)}
                    </TableCell>
                    <TableCell sx={adminSessionListTableBodyCellSx()} align="right">
                      {score.totalCredit ?? "—"}
                    </TableCell>
                    <TableCell sx={adminSessionListTableBodyCellSx()} align="right">
                      {score.receivedCredit ?? "—"}
                    </TableCell>
                    <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
                      {score.comments || "—"}
                    </TableCell>
                    <TableCell sx={adminSessionListTableBodyCellSx({ isLast: true })}>
                      {formatDate(score.submittedDate)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={adminSessionListEmptyCellSx}>
                    <Typography variant="body2" color="textSecondary" sx={adminSessionListEmptyTextSx}>
                      {searchText
                        ? "No scores found matching your search criteria."
                        : "No score data available."}
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
    </>
  );

  const title = (
    <Box sx={adminSessionListHeaderBarSx}>
      <Typography variant="subtitle1" component="div" sx={adminSessionListTitleSx}>
        Your Scores
      </Typography>
    </Box>
  );

  if (embedded) {
    return (
      <Box sx={{ width: "100%" }}>
        {title}
        {scoresBody}
      </Box>
    );
  }

  return (
    <Card sx={adminSessionListPanelCardSx}>
      <CardContent
        sx={{
          ...adminSessionListPanelContentSx,
          pb: 1.5,
          "&:last-child": { pb: 1.5 },
        }}
      >
        {title}
        {scoresBody}
      </CardContent>
    </Card>
  );
};

export default OnlineExamScoresGrid;
