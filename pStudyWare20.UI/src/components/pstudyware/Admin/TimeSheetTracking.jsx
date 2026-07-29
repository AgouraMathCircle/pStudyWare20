import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Alert,
  Grid,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Select,
} from "@mui/material";
import { useAuth } from "../../../contexts/AuthContext";
import { getPortalUsername } from "../../../utils/portalUsername";
import AdminHeader, { AdminRoleHeaderSpacer } from "./AdminHeader";
import AdminSessionListPagination from "./AdminSessionListPagination";
import SortableHeader from "../Common/SortableHeader";
import timeSheetTrackingService from "../../../services/timeSheetTrackingService";
import {
  sortRows,
  toSortableDate,
  toSortableNumber,
} from "../../../utils/tableSort";
import { pad2 } from "../../../utils/timeSheetClockParse";
import {
  adminSessionListEmptyCellSx,
  adminSessionListEmptyTextSx,
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
  adminSessionListTitleSx,
} from "../styles/applicationSurfaces";
import "../../../styles/AdminTimeSheetTracking.css";

const timeSheetTrackingPageSx = {
  flex: 1,
  minHeight: 0,
  width: "100%",
  display: "flex",
  flexDirection: "column",
};

const timeSheetColumnWidths = {
  logID: "6%",
  name: "14%",
  taskName: "16%",
  volunteerDate: "11%",
  startTime: "12%",
  endTime: "12%",
  totalHours: "9%",
  createdDate: "20%",
};

function resolveTimeSheetLogId(row) {
  const raw = row?.logID ?? row?.LogID;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function resolveTimeSheetRowNumber(row) {
  const raw = row?.mLogID ?? row?.MLogID;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function displayStartEnd(row) {
  const st =
    row.startTime ??
    row.StartTime ??
    (row.startHour != null || row.StartHour != null
      ? `${pad2(row.startHour ?? row.StartHour)}:${pad2(row.startMin ?? row.StartMin)} ${row.startType ?? row.StartType ?? ""}`.trim()
      : "");
  const et =
    row.endTime ??
    row.EndTime ??
    (row.endHour != null || row.EndHour != null
      ? `${pad2(row.endHour ?? row.EndHour)}:${pad2(row.endMin ?? row.EndMin)} ${row.endType ?? row.EndType ?? ""}`.trim()
      : "");
  return { start: st || "—", end: et || "—" };
}

/** Values used for Search By = ALL (any-field match). */
function rowSearchFieldValues(row) {
  const { start, end } = displayStartEnd(row);
  const vd = row.volunteerDate ?? row.VolunteerDate;
  const cd = row.createdDate ?? row.CreatedDate;
  return [
    String(resolveTimeSheetLogId(row) ?? resolveTimeSheetRowNumber(row) ?? ""),
    String(row.name ?? row.Name ?? ""),
    String(row.taskName ?? row.TaskName ?? ""),
    vd ? new Date(vd).toLocaleDateString() : "",
    start === "—" ? "" : start,
    end === "—" ? "" : end,
    String(row.totalHours ?? row.TotalHours ?? ""),
    cd ? new Date(cd).toLocaleString() : "",
    String(row.taskDescription ?? row.TaskDescription ?? ""),
  ];
}

function matchesCriteria(fieldValue, searchCriteria, searchLower) {
  const fv = String(fieldValue ?? "").toLowerCase();
  if (searchCriteria === "equals") return fv === searchLower;
  if (searchCriteria === "starts_with") return fv.startsWith(searchLower);
  return fv.includes(searchLower);
}

function getTimeSheetFieldValue(row, field) {
  switch (field) {
    case "logID":
      return toSortableNumber(resolveTimeSheetLogId(row) ?? resolveTimeSheetRowNumber(row));
    case "name":
      return row.name ?? row.Name ?? "";
    case "taskName":
      return row.taskName ?? row.TaskName ?? "";
    case "volunteerDate":
      return toSortableDate(row.volunteerDate ?? row.VolunteerDate);
    case "startTime": {
      const { start } = displayStartEnd(row);
      return start === "—" ? "" : start;
    }
    case "endTime": {
      const { end } = displayStartEnd(row);
      return end === "—" ? "" : end;
    }
    case "totalHours":
      return toSortableNumber(row.totalHours ?? row.TotalHours);
    case "createdDate":
      return toSortableDate(row.createdDate ?? row.CreatedDate);
    default:
      return "";
  }
}

const TimeSheetTracking = () => {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchBy, setSearchBy] = useState("ALL");
  const [searchCriteria, setSearchCriteria] = useState("contains");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [goToPageInput, setGoToPageInput] = useState("1");
  const [sortField, setSortField] = useState("volunteerDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const pageSize = 20;

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const username = getPortalUsername(user);

  const loadList = async () => {
    if (!username) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await timeSheetTrackingService.getTimeSheetTrackingList({
        Username: username,
      });
      const data =
        res?.timeSheetTrackingList ?? res?.TimeSheetTrackingList ?? [];
      if (res?.isSuccess !== false && Array.isArray(data)) {
        setList(data);
      } else if (res?.isSuccess === false && res?.errorMessage) {
        setSnackbar({
          open: true,
          message: res.errorMessage,
          severity: "error",
        });
        setList([]);
      } else {
        setList([]);
      }
    } catch (err) {
      console.error("Error loading time sheet tracking:", err);
      const msg =
        err?.response?.data?.error ??
        err?.response?.data?.message ??
        err?.message ??
        "Error loading time sheet.";
      setSnackbar({ open: true, message: msg, severity: "error" });
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (username) loadList();
    else setLoading(false);
  }, [username]);

  const filteredList = useMemo(() => {
    if (!list.length) return [];
    const q = searchText.trim();
    if (!q) return list;

    const searchLower = q.toLowerCase();

    if (searchBy === "ALL") {
      return list.filter((row) => {
        const vals = rowSearchFieldValues(row);
        if (searchCriteria === "contains") {
          return vals.some((v) =>
            String(v).toLowerCase().includes(searchLower),
          );
        }
        if (searchCriteria === "equals") {
          return vals.some(
            (v) => String(v).toLowerCase() === searchLower,
          );
        }
        return vals.some((v) =>
          String(v).toLowerCase().startsWith(searchLower),
        );
      });
    }

    return list.filter((row) => {
      let fieldValue = "";
      const { start, end } = displayStartEnd(row);
      const vd = row.volunteerDate ?? row.VolunteerDate;
      const cd = row.createdDate ?? row.CreatedDate;
      switch (searchBy) {
        case "LOG_ID":
          fieldValue = String(resolveTimeSheetLogId(row) ?? resolveTimeSheetRowNumber(row) ?? "");
          break;
        case "NAME":
          fieldValue = row.name ?? row.Name ?? "";
          break;
        case "TASK":
          fieldValue = row.taskName ?? row.TaskName ?? "";
          break;
        case "DATE":
          fieldValue = vd ? new Date(vd).toLocaleDateString() : "";
          break;
        case "START":
          fieldValue = start === "—" ? "" : start;
          break;
        case "END":
          fieldValue = end === "—" ? "" : end;
          break;
        case "HOURS":
          fieldValue = String(row.totalHours ?? row.TotalHours ?? "");
          break;
        case "CREATED":
          fieldValue = cd ? new Date(cd).toLocaleString() : "";
          break;
        case "DESCRIPTION":
          fieldValue = row.taskDescription ?? row.TaskDescription ?? "";
          break;
        default:
          return true;
      }
      return matchesCriteria(fieldValue, searchCriteria, searchLower);
    });
  }, [list, searchBy, searchCriteria, searchText]);

  const sortedList = useMemo(
    () => sortRows(filteredList, sortField, sortOrder, getTimeSheetFieldValue),
    [filteredList, sortField, sortOrder],
  );

  const totalRecords = sortedList.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 0;
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedList.slice(start, start + pageSize);
  }, [sortedList, currentPage, pageSize]);

  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortField(field);
    setCurrentPage(1);
    setGoToPageInput("1");
  };

  const handleSearch = () => {
    setCurrentPage(1);
    setGoToPageInput("1");
  };

  useEffect(() => {
    setCurrentPage(1);
    setGoToPageInput("1");
  }, [searchBy, searchCriteria, searchText, list.length]);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
      setGoToPageInput(String(totalPages));
    }
  }, [currentPage, totalPages]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setGoToPageInput(String(page));
    }
  };

  const handleGoToPage = () => {
    const page = parseInt(goToPageInput, 10);
    if (!Number.isNaN(page) && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    } else {
      setGoToPageInput(String(currentPage));
    }
  };

  return (
    <Box className="admin-time-sheet-tracking" sx={timeSheetTrackingPageSx}>
      <AdminHeader user={user} />
      <AdminRoleHeaderSpacer />
      <Container maxWidth="xl" sx={{ mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={adminSessionListPanelCardSx}>
              <CardContent sx={adminSessionListPanelContentSx}>
                <Box sx={adminSessionListHeaderBarSx}>
                  <Typography variant="subtitle1" component="div" sx={adminSessionListTitleSx}>
                    Time Sheet Approval
                  </Typography>
                </Box>

                <Box className="admin-time-sheet-tracking-table-panel">
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
                        <MenuItem value="LOG_ID" sx={adminSessionListMenuItemSx}>
                          #
                        </MenuItem>
                        <MenuItem value="NAME" sx={adminSessionListMenuItemSx}>
                          Name
                        </MenuItem>
                        <MenuItem value="TASK" sx={adminSessionListMenuItemSx}>
                          Task Name
                        </MenuItem>
                        <MenuItem value="DATE" sx={adminSessionListMenuItemSx}>
                          Date Volunteer
                        </MenuItem>
                        <MenuItem value="START" sx={adminSessionListMenuItemSx}>
                          Start Time
                        </MenuItem>
                        <MenuItem value="END" sx={adminSessionListMenuItemSx}>
                          End Time
                        </MenuItem>
                        <MenuItem value="HOURS" sx={adminSessionListMenuItemSx}>
                          Total Hours
                        </MenuItem>
                        <MenuItem value="CREATED" sx={adminSessionListMenuItemSx}>
                          Created Date
                        </MenuItem>
                        <MenuItem value="DESCRIPTION" sx={adminSessionListMenuItemSx}>
                          Task Details
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
                    className="admin-time-sheet-tracking-table-container"
                    sx={{ width: "100%" }}
                  >
                    <Table
                      className="admin-time-sheet-tracking-table"
                      sx={adminSessionListGridTableSx}
                      size="small"
                    >
                      <TableHead>
                        <TableRow sx={adminSessionListTableHeadRowSx}>
                          <SortableHeader
                            label="#"
                            field="logID"
                            sortField={sortField}
                            sortOrder={sortOrder}
                            onSort={handleSort}
                            headCellSx={adminSessionListTableHeadCellSx(timeSheetColumnWidths.logID)}
                          />
                          <SortableHeader
                            label="Name"
                            field="name"
                            sortField={sortField}
                            sortOrder={sortOrder}
                            onSort={handleSort}
                            headCellSx={adminSessionListTableHeadCellSx(timeSheetColumnWidths.name)}
                          />
                          <SortableHeader
                            label="Task Name"
                            field="taskName"
                            sortField={sortField}
                            sortOrder={sortOrder}
                            onSort={handleSort}
                            headCellSx={adminSessionListTableHeadCellSx(timeSheetColumnWidths.taskName)}
                          />
                          <SortableHeader
                            label="Date Volunteer"
                            field="volunteerDate"
                            sortField={sortField}
                            sortOrder={sortOrder}
                            onSort={handleSort}
                            headCellSx={adminSessionListTableHeadCellSx(timeSheetColumnWidths.volunteerDate)}
                          />
                          <SortableHeader
                            label="Start Time"
                            field="startTime"
                            sortField={sortField}
                            sortOrder={sortOrder}
                            onSort={handleSort}
                            headCellSx={adminSessionListTableHeadCellSx(timeSheetColumnWidths.startTime)}
                          />
                          <SortableHeader
                            label="End Time"
                            field="endTime"
                            sortField={sortField}
                            sortOrder={sortOrder}
                            onSort={handleSort}
                            headCellSx={adminSessionListTableHeadCellSx(timeSheetColumnWidths.endTime)}
                          />
                          <SortableHeader
                            label="Total Hours"
                            field="totalHours"
                            sortField={sortField}
                            sortOrder={sortOrder}
                            onSort={handleSort}
                            headCellSx={adminSessionListTableHeadCellSx(timeSheetColumnWidths.totalHours)}
                          />
                          <SortableHeader
                            label="Created Date"
                            field="createdDate"
                            sortField={sortField}
                            sortOrder={sortOrder}
                            onSort={handleSort}
                            headCellSx={adminSessionListTableHeadCellSx(timeSheetColumnWidths.createdDate, true)}
                          />
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {loading ? (
                          <TableRow>
                            <TableCell colSpan={8} align="center" sx={adminSessionListEmptyCellSx}>
                              <Typography variant="body2" color="textSecondary" sx={adminSessionListEmptyTextSx}>
                                Loading...
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ) : paginatedList.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={8} align="center" sx={adminSessionListEmptyCellSx}>
                              <Typography variant="body2" color="textSecondary" sx={adminSessionListEmptyTextSx}>
                                {searchText.trim()
                                  ? "No records found matching your search."
                                  : "No entries found."}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ) : (
                          paginatedList.map((row, idx) => {
                            const globalIdx = (currentPage - 1) * pageSize + idx + 1;
                            const vd = row.volunteerDate ?? row.VolunteerDate;
                            const cd = row.createdDate ?? row.CreatedDate;
                            const { start, end } = displayStartEnd(row);
                            const th = row.totalHours ?? row.TotalHours ?? "—";
                            return (
                              <TableRow
                                key={resolveTimeSheetLogId(row) ?? `row-${idx}`}
                                sx={adminSessionListTableBodyRowSx}
                              >
                                <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
                                  {globalIdx}
                                </TableCell>
                                <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
                                  {row.name ?? row.Name ?? "—"}
                                </TableCell>
                                <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
                                  {row.taskName ?? row.TaskName ?? ""}
                                </TableCell>
                                <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
                                  {vd ? new Date(vd).toLocaleDateString() : ""}
                                </TableCell>
                                <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
                                  {start}
                                </TableCell>
                                <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
                                  {end}
                                </TableCell>
                                <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
                                  {th}
                                </TableCell>
                                <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true, isLast: true })}>
                                  {cd ? new Date(cd).toLocaleString() : "—"}
                                </TableCell>
                              </TableRow>
                            );
                          })
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
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={(event, reason) => {
          if (reason === "clickaway") return;
          setSnackbar((s) => ({ ...s, open: false }));
        }}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TimeSheetTracking;
