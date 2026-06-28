import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
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
  Tooltip,
} from "@mui/material";
import studentDashboardService from "../../../services/studentDashboardService";
import { useUpdateProfileModal } from "../../../contexts/UpdateProfileModalContext";
import {
  adminSessionListFindButtonSx,
  adminSessionListGridTableSx,
  adminSessionListHeaderBarSx,
  adminSessionListMenuItemSx,
  adminSessionListSearchBarSx,
  adminSessionListSearchFieldSx,
  adminSessionListSearchLabelSx,
  adminSessionListSearchSelectSx,
  adminSessionListTableActionLinkSx,
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

const profileColumnWidths = {
  actions: "6%",
  studentId: "6%",
  studentName: "10%",
  program: "8%",
  class: "7%",
  grade: "5%",
  school: "10%",
  parent: "9%",
  phone: "9%",
  email: "15%",
  session: "8%",
  location: "7%",
};

const normalizeProfiles = (data) => {
  if (!data) return [];
  return Array.isArray(data) ? data : [data];
};

const getProfileFieldValue = (student, field) => {
  switch (field) {
    case "studentId":
      return toSortableNumber(student.studentID);
    case "studentName":
      return student.studentName ?? "";
    case "program":
      return student.program ?? "";
    case "class":
      return student.class ?? "";
    case "grade":
      return toSortableNumber(student.grade);
    case "school":
      return student.school ?? "";
    case "parent":
      return student.parentName ?? "";
    case "phone":
      return student.phone ?? "";
    case "email":
      return student.email || student.parentEmail || student.studentEmail || "";
    case "session":
      return student.eventSession ?? "";
    case "location":
      return student.eventLocation ?? "";
    default:
      return "";
  }
};

const StudentProfile = ({ username, chapterId }) => {
  const { openUpdateProfile } = useUpdateProfileModal();
  const [profileData, setProfileData] = useState([]);
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
  const [sortField, setSortField] = useState("studentName");
  const [sortOrder, setSortOrder] = useState("asc");

  const pageSize = 25;

  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortField(field);
    setCurrentPage(1);
    setGoToPageInput("1");
  };

  const handleSearch = () => {
    let filtered = [...normalizeProfiles(profileData)];

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
            fieldValue = student.phone || "";
            break;
          case "EMAIL":
            fieldValue =
              student.email || student.parentEmail || student.studentEmail || "";
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

    setFilteredData(filtered);
    setCurrentPage(1);
    setGoToPageInput("1");
  };

  const loadStudentProfiles = useCallback(
    async ({ silent = false } = {}) => {
      if (!username || !chapterId) {
        if (!silent) setLoading(false);
        return;
      }

      try {
        if (!silent) setLoading(true);
        setError(null);
        const response = await studentDashboardService.getStudentProfiles(
          username,
          chapterId
        );
        if (response.isSuccess && response.studentProfiles != null) {
          const profileArray = normalizeProfiles(response.studentProfiles);
          setProfileData(profileArray);
          setFilteredData(profileArray);
          setTotalRecords(profileArray.length);
        } else {
          setError(response?.message || "Failed to load student profiles");
          setProfileData([]);
          setFilteredData([]);
          setTotalRecords(0);
        }
      } catch (err) {
        console.error("Error fetching student profile:", err);
        const serverMessage = err.response?.data?.message || err.message;
        setError(
          serverMessage || "Failed to load student profile. Please try again."
        );
        setProfileData([]);
        setFilteredData([]);
        setTotalRecords(0);
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [username, chapterId]
  );

  const handleEditProfile = (studentId) => {
    openUpdateProfile(studentId, () => loadStudentProfiles({ silent: true }));
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
    loadStudentProfiles();
  }, [loadStudentProfiles]);

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

  const sortedProfiles = useMemo(
    () => sortRows(filteredData, sortField, sortOrder, getProfileFieldValue),
    [filteredData, sortField, sortOrder]
  );

  const paginatedProfiles = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedProfiles.slice(start, start + pageSize);
  }, [sortedProfiles, currentPage, pageSize]);

  const renderTableBody = () => {
    if (loading) {
      return (
        <TableRow>
          <TableCell colSpan={12} align="center" sx={adminSessionListEmptyCellSx}>
            <Typography variant="body2" color="textSecondary" sx={adminSessionListEmptyTextSx}>
              Loading student profile...
            </Typography>
          </TableCell>
        </TableRow>
      );
    }

    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={12} align="center" sx={adminSessionListEmptyCellSx}>
            <Typography variant="body2" color="error" sx={adminSessionListEmptyTextSx}>
              {error}
            </Typography>
          </TableCell>
        </TableRow>
      );
    }

    if (paginatedProfiles.length > 0) {
      return paginatedProfiles.map((student, index) => (
        <TableRow key={student.studentID || index} sx={adminSessionListTableBodyRowSx}>
          <TableCell sx={adminSessionListTableBodyCellSx({ action: true })}>
            {student.studentID ? (
              <Box
                onClick={() => handleEditProfile(student.studentID)}
                sx={adminSessionListTableActionLinkSx}
              >
                Edit
              </Box>
            ) : (
              "—"
            )}
          </TableCell>
          <TableCell sx={adminSessionListTableBodyCellSx()}>
            {student.studentID ?? "—"}
          </TableCell>
          <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
            <Tooltip title={student.studentName || ""} disableHoverListener={!student.studentName}>
              <Box component="span" sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {student.studentName || "—"}
              </Box>
            </Tooltip>
          </TableCell>
          <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
            <Tooltip title={student.program || ""} disableHoverListener={!student.program}>
              <Box component="span" sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {student.program || "—"}
              </Box>
            </Tooltip>
          </TableCell>
          <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
            <Tooltip title={student.class || ""} disableHoverListener={!student.class}>
              <Box component="span" sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {student.class || "—"}
              </Box>
            </Tooltip>
          </TableCell>
          <TableCell sx={adminSessionListTableBodyCellSx()}>
            {student.grade || "—"}
          </TableCell>
          <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
            <Tooltip title={student.school || ""} disableHoverListener={!student.school}>
              <Box component="span" sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {student.school || "—"}
              </Box>
            </Tooltip>
          </TableCell>
          <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
            <Tooltip title={student.parentName || ""} disableHoverListener={!student.parentName}>
              <Box component="span" sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {student.parentName || "—"}
              </Box>
            </Tooltip>
          </TableCell>
          <TableCell sx={adminSessionListTableBodyCellSx()}>
            {student.phone || "—"}
          </TableCell>
          <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
            <Tooltip title={student.email || student.parentEmail || student.studentEmail || ""} disableHoverListener={!(student.email || student.parentEmail || student.studentEmail)}>
              <Box component="span" sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {student.email || student.parentEmail || student.studentEmail || "—"}
              </Box>
            </Tooltip>
          </TableCell>
          <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
            <Tooltip title={student.eventSession || ""} disableHoverListener={!student.eventSession}>
              <Box component="span" sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {student.eventSession || "—"}
              </Box>
            </Tooltip>
          </TableCell>
          <TableCell sx={adminSessionListTableBodyCellSx({ isLast: true, ellipsis: true })}>
            <Tooltip title={student.eventLocation || ""} disableHoverListener={!student.eventLocation}>
              <Box component="span" sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {student.eventLocation || "—"}
              </Box>
            </Tooltip>
          </TableCell>
        </TableRow>
      ));
    }

    return (
      <TableRow>
        <TableCell colSpan={12} align="center" sx={adminSessionListEmptyCellSx}>
          <Typography variant="body2" color="textSecondary" sx={adminSessionListEmptyTextSx}>
            No records to display
          </Typography>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={adminSessionListHeaderBarSx}>
        <Typography variant="subtitle1" component="div" sx={adminSessionListTitleSx}>
          Student Profile
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
            <MenuItem value="ALL" sx={adminSessionListMenuItemSx}>
              -ALL-
            </MenuItem>
            <MenuItem value="STUDENT_ID" sx={adminSessionListMenuItemSx}>
              Student ID
            </MenuItem>
            <MenuItem value="STUDENT_NAME" sx={adminSessionListMenuItemSx}>
              Student Name
            </MenuItem>
            <MenuItem value="PROGRAM" sx={adminSessionListMenuItemSx}>
              Program
            </MenuItem>
            <MenuItem value="CLASS" sx={adminSessionListMenuItemSx}>
              Class
            </MenuItem>
            <MenuItem value="GRADE" sx={adminSessionListMenuItemSx}>
              Grade
            </MenuItem>
            <MenuItem value="SCHOOL" sx={adminSessionListMenuItemSx}>
              School
            </MenuItem>
            <MenuItem value="PARENT" sx={adminSessionListMenuItemSx}>
              Parent
            </MenuItem>
            <MenuItem value="PHONE" sx={adminSessionListMenuItemSx}>
              Phone
            </MenuItem>
            <MenuItem value="EMAIL" sx={adminSessionListMenuItemSx}>
              Email
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

      <TableContainer component={Paper} sx={adminSessionListTableContainerSx}>
        <Table size="small" sx={adminSessionListGridTableSx}>
          <TableHead>
            <TableRow sx={adminSessionListTableHeadRowSx}>
              <TableCell sx={adminSessionListTableHeadCellSx(profileColumnWidths.actions)}>
                Actions
              </TableCell>
              <SortableHeader
                label="Student #"
                field="studentId"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(profileColumnWidths.studentId)}
              />
              <SortableHeader
                label="Student Name"
                field="studentName"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(profileColumnWidths.studentName)}
              />
              <SortableHeader
                label="Program"
                field="program"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(profileColumnWidths.program)}
              />
              <SortableHeader
                label="Class"
                field="class"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(profileColumnWidths.class)}
              />
              <SortableHeader
                label="Grade"
                field="grade"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(profileColumnWidths.grade)}
              />
              <SortableHeader
                label="School"
                field="school"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(profileColumnWidths.school)}
              />
              <SortableHeader
                label="Parent"
                field="parent"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(profileColumnWidths.parent)}
              />
              <SortableHeader
                label="Contact #"
                field="phone"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(profileColumnWidths.phone)}
              />
              <SortableHeader
                label="Email"
                field="email"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(profileColumnWidths.email)}
              />
              <SortableHeader
                label="Session"
                field="session"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(profileColumnWidths.session)}
              />
              <SortableHeader
                label="Location"
                field="location"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(profileColumnWidths.location, true)}
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
};

export default StudentProfile;
