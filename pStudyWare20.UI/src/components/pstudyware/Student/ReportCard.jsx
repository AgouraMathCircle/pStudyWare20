import React, { useState, useEffect, useMemo } from "react";
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
  TextField,
  Select,
  MenuItem,
  Button,
  Container,
} from "@mui/material";
import { useAuth } from "../../../contexts/AuthContext";
import studentDashboardService from "../../../services/studentDashboardService";
import StudentHeader, { StudentRoleHeaderSpacer } from "./StudentHeader";
import {
  adminSessionListFindButtonSx,
  adminSessionListGridTableSx,
  adminSessionListHeaderBarSx,
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
} from "../styles/applicationSurfaces";
import "../../../styles/StudentDashboard.css";
import AdminSessionListPagination from "../Admin/AdminSessionListPagination";
import SortableHeader from "../Common/SortableHeader";
import {
  sortRows,
  toSortableDate,
  toSortableNumber,
} from "../../../utils/tableSort";

const reportCardHeaderBarSx = {
  ...adminSessionListHeaderBarSx,
  mb: 0.5,
};

const reportCardSearchBarSx = {
  ...adminSessionListSearchBarSx,
  mb: 0,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
};

const reportCardTableContainerSx = {
  ...adminSessionListTableContainerSx,
  mt: 0,
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0,
};

const reportCardColumnWidths = {
  studentName: "12%",
  class: "10%",
  session: "10%",
  examType: "10%",
  examDate: "10%",
  totalScore: "8%",
  topScore: "8%",
  avgScore: "8%",
  yourScore: "8%",
  comments: "16%",
};

const normalizeReportEntries = (data) => {
  if (!data) return [];
  const rows = Array.isArray(data) ? data : [data];
  return rows.map((entry) => ({
    studentName: entry.studentName ?? entry.StudentName ?? "",
    group: entry.group ?? entry.Group ?? entry.class ?? entry.Class ?? "",
    semester: entry.semester ?? entry.Semester ?? entry.session ?? entry.Session ?? "",
    examType: entry.examType ?? entry.ExamType ?? "",
    examDate: entry.examDate ?? entry.ExamDate ?? null,
    totalCredit: entry.totalCredit ?? entry.TotalCredit ?? 0,
    highestScore: entry.highestScore ?? entry.HighestScore ?? 0,
    classAverage: entry.classAverage ?? entry.ClassAverage ?? 0,
    receivedCredit: entry.receivedCredit ?? entry.ReceivedCredit ?? 0,
    comments: entry.comments ?? entry.Comments ?? "",
  }));
};

const getScoreColor = (score, totalScore) => {
  const total = Number(totalScore) || 1;
  const value = Number(score) || 0;
  const percentage = (value / total) * 100;
  if (percentage >= 90) return "#4caf50";
  if (percentage >= 80) return "#ff9800";
  if (percentage >= 70) return "#ff5722";
  return "#f44336";
};

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString() : "—";

const getReportCardFieldValue = (report, field) => {
  switch (field) {
    case "studentName":
      return report.studentName ?? "";
    case "class":
      return report.group ?? "";
    case "session":
      return report.semester ?? "";
    case "examType":
      return report.examType ?? "";
    case "examDate":
      return toSortableDate(report.examDate);
    case "totalScore":
      return toSortableNumber(report.totalCredit);
    case "topScore":
      return toSortableNumber(report.highestScore);
    case "avgScore":
      return toSortableNumber(report.classAverage);
    case "yourScore":
      return toSortableNumber(report.receivedCredit);
    case "comments":
      return report.comments ?? "";
    default:
      return "";
  }
};

const ReportCard = ({
  username: propUsername,
  embedded = false,
  reportCardEntries: prefetchedEntries,
  reportCardLoading: prefetchedLoading = false,
  reportCardError: prefetchedError = null,
}) => {
  const { user } = useAuth();
  const username = propUsername || user?.email || user?.username;

  const [reportCardData, setReportCardData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchBy, setSearchBy] = useState("ALL");
  const [searchCriteria, setSearchCriteria] = useState("");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
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
          case "SESSION":
            fieldValue = report.semester || "";
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
            return fieldValue.includes(search);
        }
      });
    }

    setFilteredData(filtered);
    setCurrentPage(1);
    setGoToPageInput("1");
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setGoToPageInput(page.toString());
    }
  };

  const handleGoToPage = () => {
    const page = parseInt(goToPageInput, 10);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    } else {
      setGoToPageInput(currentPage.toString());
    }
  };

  useEffect(() => {
    if (embedded) {
      setLoading(prefetchedLoading);
      if (prefetchedLoading) {
        return;
      }

      if (prefetchedError) {
        setError(prefetchedError);
        setReportCardData([]);
        setFilteredData([]);
        setTotalRecords(0);
        return;
      }

      const entries = normalizeReportEntries(prefetchedEntries ?? []);
      setError(null);
      setReportCardData(entries);
      setFilteredData(entries);
      setTotalRecords(entries.length);
      return;
    }

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

        const isSuccess = response.isSuccess ?? response.IsSuccess;
        const rawEntries =
          response.reportCardEntries ?? response.ReportCardEntries ?? null;

        if (isSuccess && rawEntries != null) {
          const entries = normalizeReportEntries(rawEntries);
          setReportCardData(entries);
          setFilteredData(entries);
          setTotalRecords(entries.length);
        } else {
          setError(response?.message || "Failed to load report card");
          setReportCardData([]);
          setFilteredData([]);
          setTotalRecords(0);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Error fetching report card:", err);
          const serverMessage = err.response?.data?.message || err.message;
          setError(
            serverMessage || "Failed to load report card. Please try again."
          );
          setReportCardData([]);
          setFilteredData([]);
          setTotalRecords(0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadReportCard();
    return () => {
      cancelled = true;
    };
  }, [
    embedded,
    prefetchedEntries,
    prefetchedLoading,
    prefetchedError,
    username,
  ]);

  useEffect(() => {
    const total = filteredData.length;
    const pages = Math.ceil(total / pageSize);
    setTotalPages(pages > 0 ? pages : 1);
    setTotalRecords(total);

    if (currentPage > pages && pages > 0) {
      setCurrentPage(1);
      setGoToPageInput("1");
    }
  }, [filteredData, pageSize, currentPage]);

  const sortedReports = useMemo(
    () => sortRows(filteredData, sortField, sortOrder, getReportCardFieldValue),
    [filteredData, sortField, sortOrder]
  );

  const paginatedReports = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedReports.slice(start, start + pageSize);
  }, [sortedReports, currentPage, pageSize]);

  const title = embedded ? "Last Session - Report Card" : "Report Card";

  const renderTableBody = () => {
    if (loading) {
      return (
        <TableRow>
          <TableCell colSpan={10} align="center" sx={adminSessionListEmptyCellSx}>
            <Typography variant="body2" color="textSecondary" sx={adminSessionListEmptyTextSx}>
              Loading report card...
            </Typography>
          </TableCell>
        </TableRow>
      );
    }

    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={10} align="center" sx={adminSessionListEmptyCellSx}>
            <Typography variant="body2" color="error" sx={adminSessionListEmptyTextSx}>
              {error}
            </Typography>
          </TableCell>
        </TableRow>
      );
    }

    if (paginatedReports.length > 0) {
      return paginatedReports.map((report, index) => (
        <TableRow key={index} sx={adminSessionListTableBodyRowSx}>
          <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
            {report.studentName || "—"}
          </TableCell>
          <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
            {report.group || "—"}
          </TableCell>
          <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
            {report.semester || "—"}
          </TableCell>
          <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
            {report.examType || "—"}
          </TableCell>
          <TableCell sx={adminSessionListTableBodyCellSx()}>
            {formatDate(report.examDate)}
          </TableCell>
          <TableCell sx={adminSessionListTableBodyCellSx()} align="right">
            {report.totalCredit ?? "—"}
          </TableCell>
          <TableCell sx={adminSessionListTableBodyCellSx()} align="right">
            {report.highestScore ?? "—"}
          </TableCell>
          <TableCell sx={adminSessionListTableBodyCellSx()} align="right">
            {report.classAverage ?? "—"}
          </TableCell>
          <TableCell sx={adminSessionListTableBodyCellSx()} align="right">
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
              {report.receivedCredit ?? "—"}
            </Typography>
          </TableCell>
          <TableCell sx={adminSessionListTableBodyCellSx({ isLast: true, ellipsis: true })}>
            {report.comments || "—"}
          </TableCell>
        </TableRow>
      ));
    }

    return (
      <TableRow>
        <TableCell colSpan={10} align="center" sx={adminSessionListEmptyCellSx}>
          <Typography variant="body2" color="textSecondary" sx={adminSessionListEmptyTextSx}>
            No records to display
          </Typography>
        </TableCell>
      </TableRow>
    );
  };

  const content = (
    <Box sx={{ width: "100%" }}>
      <Box sx={reportCardHeaderBarSx}>
        <Typography variant="subtitle1" component="div" sx={adminSessionListTitleSx}>
          {title}
        </Typography>
      </Box>

      <Box sx={reportCardSearchBarSx}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Typography sx={adminSessionListSearchLabelSx}>Search By:</Typography>
          <Select
            value={searchBy}
            onChange={(e) => setSearchBy(e.target.value)}
            size="small"
            sx={adminSessionListSearchSelectSx}
            disabled={loading}
          >
            <MenuItem value="ALL" sx={adminSessionListMenuItemSx}>
              -ALL-
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

      <TableContainer component={Paper} sx={reportCardTableContainerSx}>
        <Table size="small" sx={adminSessionListGridTableSx}>
          <TableHead>
            <TableRow sx={adminSessionListTableHeadRowSx}>
              <SortableHeader
                label="Student Name"
                field="studentName"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(reportCardColumnWidths.studentName)}
              />
              <SortableHeader
                label="Class"
                field="class"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(reportCardColumnWidths.class)}
              />
              <SortableHeader
                label="Session"
                field="session"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(reportCardColumnWidths.session)}
              />
              <SortableHeader
                label="Exam Type"
                field="examType"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(reportCardColumnWidths.examType)}
              />
              <SortableHeader
                label="Exam Date"
                field="examDate"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(reportCardColumnWidths.examDate)}
              />
              <SortableHeader
                label="Total Score"
                field="totalScore"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                align="right"
                headCellSx={adminSessionListTableHeadCellSx(reportCardColumnWidths.totalScore, false)}
              />
              <SortableHeader
                label="Top Score"
                field="topScore"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                align="right"
                headCellSx={adminSessionListTableHeadCellSx(reportCardColumnWidths.topScore, false)}
              />
              <SortableHeader
                label="AVG Score"
                field="avgScore"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                align="right"
                headCellSx={adminSessionListTableHeadCellSx(reportCardColumnWidths.avgScore, false)}
              />
              <SortableHeader
                label="Your Score"
                field="yourScore"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                align="right"
                headCellSx={adminSessionListTableHeadCellSx(reportCardColumnWidths.yourScore, false)}
              />
              <SortableHeader
                label="Comments"
                field="comments"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(reportCardColumnWidths.comments, true)}
              />
            </TableRow>
          </TableHead>
          <TableBody>{renderTableBody()}</TableBody>
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

  if (embedded) {
    return content;
  }

  return (
    <Box className="student-dashboard report-card-page">
      <StudentHeader user={user} />
      <StudentRoleHeaderSpacer />
      <Container maxWidth="xl" sx={{ mb: 4, mt: 0 }}>
        <Card sx={adminSessionListPanelCardSx}>
          <CardContent
            sx={{
              ...adminSessionListPanelContentSx,
              pt: 0,
              "&:last-child": { pb: 1.5 },
            }}
          >
            {content}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default ReportCard;
