import React, { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Button,
  MenuItem,
  Select,
  TextField,
  Link,
} from "@mui/material";
import SortableHeader from "./SortableHeader";
import AdminSessionListPagination from "../Admin/AdminSessionListPagination";
import {
  sortRows,
  toSortableDate,
  toSortableNumber,
} from "../../../utils/tableSort";
import {
  adminSessionListEmptyCellSx,
  adminSessionListEmptyTextSx,
  adminSessionListFindButtonSx,
  adminSessionListGridTableSx,
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
} from "../styles/applicationSurfaces";

const SEARCH_FIELDS = [
  { value: "rowId", label: "Row #" },
  { value: "class", label: "Class" },
  { value: "chapterName", label: "Chapter Name" },
  { value: "section", label: "Section" },
  { value: "meetingDate", label: "Meeting Date" },
  { value: "meetingTime", label: "Meeting Time" },
  { value: "meetingURL", label: "Meeting URL" },
  { value: "meetingID", label: "Meeting ID" },
  { value: "adminLogin", label: "Admin Login" },
  { value: "includeSection", label: "Include Section" },
  { value: "active", label: "Active" },
];

const meetingColumnWidths = {
  edit: "5%",
  rowId: "5%",
  class: "6%",
  chapterName: "12%",
  section: "5%",
  meetingDate: "9%",
  meetingTime: "9%",
  meetingURL: "14%",
  meetingID: "8%",
  adminLogin: "10%",
  includeSection: "7%",
  active: "6%",
};

const getProp = (obj, propName) => {
  if (obj[propName] !== undefined) return obj[propName];
  const camelCase = propName.charAt(0).toLowerCase() + propName.slice(1);
  if (obj[camelCase] !== undefined) return obj[camelCase];
  return "";
};

const pickChapterId = (obj) =>
  String(
    getProp(obj, "ChapterID") ||
      getProp(obj, "ChapterId") ||
      getProp(obj, "chapterID") ||
      "",
  ).trim();

const pickChapterName = (obj) =>
  String(getProp(obj, "ChapterName") || getProp(obj, "name") || "").trim();

function buildChapterNameLookup(chapters) {
  const map = new Map();
  for (const chapter of chapters ?? []) {
    const id = pickChapterId(chapter);
    const name = pickChapterName(chapter);
    if (id) map.set(id, name || id);
  }
  return map;
}

const formatBoolean = (value) => (value ? "Yes" : "No");

const formatMeetingSentence = (row) => {
  const label = row.chapterName || row.class || "Meeting";
  const sectionPart = row.section ? ` Section ${row.section}` : "";
  const datePart = row.meetingDate
    ? ` is on ${row.meetingDate}${row.meetingTime ? ` ${row.meetingTime} (PST)` : ""}.`
    : "";

  return { label, sectionPart, datePart };
};

function normalizeMeeting(meeting, index, chapterNameById = new Map()) {
  const rowId = getProp(meeting, "RowID") || getProp(meeting, "RowId") || index + 1;
  const includeSection = getProp(meeting, "IncludeSection");
  const active = getProp(meeting, "Active");
  const chapterId = pickChapterId(meeting);
  let chapterName = pickChapterName(meeting);
  if (!chapterName && chapterId) {
    chapterName = chapterNameById.get(chapterId) ?? "";
  }

  return {
    rowId,
    class: getProp(meeting, "Class") ?? "",
    chapterName,
    section: getProp(meeting, "Section") ?? "",
    meetingDate: getProp(meeting, "MeetingDate") ?? "",
    meetingTime: getProp(meeting, "MeetingTime") ?? "",
    meetingURL: getProp(meeting, "MeetingURL") || getProp(meeting, "MeetingUrl") || "",
    meetingID: getProp(meeting, "MeetingID") || getProp(meeting, "MeetingId") || "",
    adminLogin: getProp(meeting, "AdminLogin") ?? "",
    includeSection,
    includeSectionLabel: formatBoolean(includeSection),
    active,
    activeLabel: formatBoolean(active),
  };
}

function getMeetingFieldValue(row, field) {
  switch (field) {
    case "rowId":
      return toSortableNumber(row.rowId);
    case "class":
      return row.class ?? "";
    case "chapterName":
      return row.chapterName ?? "";
    case "section":
      return row.section ?? "";
    case "meetingDate":
      return toSortableDate(row.meetingDate);
    case "meetingTime":
      return row.meetingTime ?? "";
    case "meetingURL":
      return row.meetingURL ?? "";
    case "meetingID":
      return row.meetingID ?? "";
    case "adminLogin":
      return row.adminLogin ?? "";
    case "includeSection":
      return row.includeSectionLabel ?? "";
    case "active":
      return row.activeLabel ?? "";
    default:
      return "";
  }
}

const MeetingList = ({ meetings, chapters = [], onEdit, canEdit, loading = false }) => {
  const [searchField, setSearchField] = useState("chapterName");
  const [searchCriteria, setSearchCriteria] = useState("contains");
  const [searchText, setSearchText] = useState("");
  const [appliedSearch, setAppliedSearch] = useState({
    field: "chapterName",
    criteria: "contains",
    text: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [goToPageInput, setGoToPageInput] = useState("1");
  const [sortField, setSortField] = useState("meetingDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const pageSize = 25;

  const chapterNameById = useMemo(
    () => buildChapterNameLookup(chapters),
    [chapters],
  );

  const normalizedRows = useMemo(
    () =>
      (meetings ?? []).map((meeting, index) =>
        normalizeMeeting(meeting, index, chapterNameById),
      ),
    [meetings, chapterNameById],
  );

  const filteredRows = useMemo(() => {
    const text = appliedSearch.text.trim().toLowerCase();
    if (!text) return normalizedRows;

    return normalizedRows.filter((row) => {
      const raw = String(
        appliedSearch.field === "includeSection"
          ? row.includeSectionLabel
          : appliedSearch.field === "active"
            ? row.activeLabel
            : row[appliedSearch.field] ?? "",
      ).toLowerCase();

      if (appliedSearch.criteria === "equals") return raw === text;
      if (appliedSearch.criteria === "starts_with") return raw.startsWith(text);
      return raw.includes(text);
    });
  }, [normalizedRows, appliedSearch]);

  const sortedRows = useMemo(
    () => sortRows(filteredRows, sortField, sortOrder, getMeetingFieldValue),
    [filteredRows, sortField, sortOrder],
  );

  const totalRecords = sortedRows.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 0;
  const pagedRows = sortedRows.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const colSpan = canEdit ? 12 : 11;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setGoToPageInput(page.toString());
    }
  };

  const handleGoToPage = () => {
    const page = parseInt(goToPageInput, 10);
    if (!Number.isNaN(page) && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    } else {
      setGoToPageInput(currentPage.toString());
    }
  };

  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortField(field);
    setCurrentPage(1);
    setGoToPageInput("1");
  };

  const handleSearch = () => {
    setAppliedSearch({ field: searchField, criteria: searchCriteria, text: searchText });
    setCurrentPage(1);
    setGoToPageInput("1");
  };

  return (
    <Box className="admin-meeting-details-table-panel">
      <Box sx={adminSessionListSearchBarSx}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Typography sx={adminSessionListSearchLabelSx}>Search By:</Typography>
          <Select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            size="small"
            sx={adminSessionListSearchSelectSx}
          >
            {SEARCH_FIELDS.map((f) => (
              <MenuItem key={f.value} value={f.value} sx={adminSessionListMenuItemSx}>
                {f.label}
              </MenuItem>
            ))}
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
            <MenuItem value="contains" sx={adminSessionListMenuItemSx}>
              Contains
            </MenuItem>
            <MenuItem value="equals" sx={adminSessionListMenuItemSx}>
              Equals
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
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
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

      <TableContainer
        component={Paper}
        className="admin-meeting-details-table-container"
        sx={{ width: "100%" }}
      >
        <Table
          className="admin-meeting-details-table"
          sx={adminSessionListGridTableSx}
          size="small"
        >
          <TableHead>
            <TableRow sx={adminSessionListTableHeadRowSx}>
              {canEdit && (
                <TableCell
                  sx={adminSessionListTableHeadCellSx(meetingColumnWidths.edit)}
                >
                  Edit
                </TableCell>
              )}
              <SortableHeader
                label="Row #"
                field="rowId"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(meetingColumnWidths.rowId)}
              />
              <SortableHeader
                label="Class"
                field="class"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(meetingColumnWidths.class)}
              />
              <SortableHeader
                label="Chapter Name"
                field="chapterName"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(meetingColumnWidths.chapterName)}
              />
              <SortableHeader
                label="Section"
                field="section"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(meetingColumnWidths.section)}
              />
              <SortableHeader
                label="Meeting Date"
                field="meetingDate"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(meetingColumnWidths.meetingDate)}
              />
              <SortableHeader
                label="Meeting Time (PST)"
                field="meetingTime"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(meetingColumnWidths.meetingTime)}
              />
              <SortableHeader
                label="Meeting URL"
                field="meetingURL"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(meetingColumnWidths.meetingURL)}
              />
              <SortableHeader
                label="Meeting ID"
                field="meetingID"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(meetingColumnWidths.meetingID)}
              />
              <SortableHeader
                label="Admin Login"
                field="adminLogin"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(meetingColumnWidths.adminLogin)}
              />
              <SortableHeader
                label="Include Section"
                field="includeSection"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(meetingColumnWidths.includeSection)}
              />
              <SortableHeader
                label="Active"
                field="active"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(meetingColumnWidths.active, true)}
              />
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={colSpan} align="center" sx={adminSessionListEmptyCellSx}>
                  <Typography variant="body2" color="textSecondary" sx={adminSessionListEmptyTextSx}>
                    Loading...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : pagedRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={colSpan} align="center" sx={adminSessionListEmptyCellSx}>
                  <Typography variant="body2" color="textSecondary" sx={adminSessionListEmptyTextSx}>
                    No meeting schedules found.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              pagedRows.map((row) => (
                <TableRow key={row.rowId} sx={adminSessionListTableBodyRowSx}>
                  {canEdit && (
                    <TableCell sx={adminSessionListTableBodyCellSx({ action: true })}>
                      <Box
                        component="span"
                        onClick={() => onEdit(row.rowId)}
                        sx={adminSessionListTableActionLinkSx}
                      >
                        Edit
                      </Box>
                    </TableCell>
                  )}
                  <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
                    {row.rowId}
                  </TableCell>
                  <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
                    {row.class}
                  </TableCell>
                  <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
                    {row.chapterName}
                  </TableCell>
                  <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
                    {row.section}
                  </TableCell>
                  <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
                    {row.meetingDate}
                  </TableCell>
                  <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
                    {row.meetingTime}
                  </TableCell>
                  <TableCell
                    sx={{
                      ...adminSessionListTableBodyCellSx({ ellipsis: false }),
                      whiteSpace: "normal",
                      maxWidth: "none",
                    }}
                  >
                    {(() => {
                      const { label, sectionPart, datePart } =
                        formatMeetingSentence(row);
                      return (
                        <Typography
                          component="div"
                          className="meeting-list-sentence"
                        >
                          <Box component="span" className="meeting-list-class">
                            {label}
                            {sectionPart}
                          </Box>
                          {datePart && (
                            <Box component="span" className="meeting-list-date">
                              {datePart}
                            </Box>
                          )}
                          {row.meetingURL && (
                            <>
                              {" Join at "}
                              <Link
                                href={row.meetingURL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="meeting-list-url"
                                underline="hover"
                              >
                                {row.meetingURL}
                              </Link>
                            </>
                          )}
                        </Typography>
                      );
                    })()}
                  </TableCell>
                  <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
                    {row.meetingID}
                  </TableCell>
                  <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
                    {row.adminLogin}
                  </TableCell>
                  <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
                    {row.includeSectionLabel}
                  </TableCell>
                  <TableCell sx={adminSessionListTableBodyCellSx({ isLast: true, ellipsis: true })}>
                    {row.activeLabel}
                  </TableCell>
                </TableRow>
              ))
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

export default MeetingList;
