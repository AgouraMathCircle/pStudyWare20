import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Download as DownloadIcon,
} from "@mui/icons-material";
import { useAuth } from "../../../contexts/AuthContext";
import SystemAdminHeader, { SystemAdminRoleHeaderSpacer } from "./SystemAdminHeader";
import SystemAdminSessionListPagination from "./SystemAdminSessionListPagination";
import SortableHeader from "../Common/SortableHeader";
import AppConfirmDialog from "../Common/AppConfirmDialog";
import specialEventsRegistrationService from "../../../services/specialEventsRegistrationService";
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
  adminSessionListTableDeleteLinkSx,
  adminSessionListTableHeadCellSx,
  adminSessionListTableHeadRowSx,
  adminSessionListTitleSx,
} from "../styles/applicationSurfaces";
import "../../../styles/SystemAdminSpecialEventsRegistration.css";

const SEARCH_FIELDS = [
  { value: "registerID", label: "Register #" },
  { value: "studentName", label: "Name" },
  { value: "grade", label: "Grade" },
  { value: "school", label: "School" },
  { value: "phone", label: "Phone" },
  { value: "email", label: "Email" },
  { value: "city", label: "City" },
  { value: "eventName", label: "Event Name" },
  { value: "insertDate", label: "Register Date" },
];

const columnWidths = {
  delete: "4%",
  registerID: "5%",
  studentName: "11%",
  grade: "5%",
  school: "10%",
  phone: "9%",
  email: "13%",
  city: "8%",
  eventName: "13%",
  insertDate: "12%",
};

const pageSx = {
  flex: 1,
  minHeight: 0,
  width: "100%",
  display: "flex",
  flexDirection: "column",
};

const toolbarButtonSx = {
  ...adminSessionListFindButtonSx,
  backgroundColor: "#4caf50",
  color: "white",
  flexShrink: 0,
  px: 1.5,
  "&:hover": { backgroundColor: "#43a047" },
};

function getFieldValue(row, field) {
  switch (field) {
    case "registerID":
      return toSortableNumber(row.registerID);
    case "studentName":
      return row.studentName ?? "";
    case "grade":
      return row.grade ?? "";
    case "school":
      return row.school ?? "";
    case "phone":
      return row.phone ?? "";
    case "email":
      return row.email ?? "";
    case "city":
      return row.city ?? "";
    case "eventName":
      return row.eventName ?? "";
    case "insertDate":
      return toSortableDate(row.insertDate);
    default:
      return "";
  }
}

function normalizeRow(row, index) {
  return {
    registerID:
      row.registerID ??
      row.RegisterID ??
      row.requestId ??
      row.RequestId ??
      index + 1,
    studentName: row.studentName ?? row.StudentName ?? "",
    grade: row.grade ?? row.Grade ?? "",
    school: row.school ?? row.School ?? "",
    phone: row.phone ?? row.Phone ?? "",
    email: row.email ?? row.Email ?? "",
    city: row.city ?? row.City ?? "",
    eventName: row.eventName ?? row.EventName ?? "",
    insertDate: row.insertDate ?? row.InsertDate ?? null,
  };
}

function parseListResponse(res) {
  const raw =
    res?.specialEventsRegistrationList ?? res?.SpecialEventsRegistrationList;
  if (Array.isArray(raw)) return raw;
  if (raw && (raw.Table || raw.Rows || raw.rows)) {
    return raw.Table || raw.Rows || raw.rows || [];
  }
  if (raw && typeof raw === "object" && raw.length >= 0) return raw;
  return [];
}

const SpecialEventsRegistration = () => {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
  const [canExport, setCanExport] = useState(false);
  const [searchField, setSearchField] = useState("studentName");
  const [searchCriteria, setSearchCriteria] = useState("contains");
  const [searchText, setSearchText] = useState("");
  const [appliedSearch, setAppliedSearch] = useState({
    field: "studentName",
    criteria: "contains",
    text: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [goToPageInput, setGoToPageInput] = useState("1");
  const [sortField, setSortField] = useState("insertDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const pageSize = 25;
  const username = user?.email || user?.username || "";

  const loadList = useCallback(async () => {
    if (!username) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res =
        await specialEventsRegistrationService.getSpecialEventsRegistrationList({
          Username: username,
        });
      if (res?.isSuccess === false || res?.IsSuccess === false) {
        setSnackbar({
          open: true,
          message:
            res?.errorMessage ??
            res?.ErrorMessage ??
            "Error loading list.",
          severity: "error",
        });
        setRows([]);
        return;
      }
      setRows(parseListResponse(res));
    } catch (err) {
      console.error("Error loading special events registration:", err);
      const msg =
        err?.response?.data?.error ??
        err?.response?.data?.message ??
        err?.message ??
        "Error loading list.";
      setSnackbar({ open: true, message: msg, severity: "error" });
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    loadList();
  }, [loadList]);

  useEffect(() => {
    specialEventsRegistrationService
      .checkPrivileges()
      .then((res) => {
        setCanDelete(
          res?.canDeleteApplications ?? res?.CanDeleteApplications ?? false,
        );
        setCanExport(res?.canExportData ?? res?.CanExportData ?? false);
      })
      .catch(() => {
        setCanDelete(false);
        setCanExport(false);
      });
  }, []);

  const normalizedRows = useMemo(
    () => rows.map((row, index) => normalizeRow(row, index)),
    [rows],
  );

  const filteredRows = useMemo(() => {
    const text = appliedSearch.text.trim().toLowerCase();
    if (!text) return normalizedRows;

    return normalizedRows.filter((row) => {
      const raw = String(row[appliedSearch.field] ?? "").toLowerCase();
      if (appliedSearch.criteria === "equals") return raw === text;
      if (appliedSearch.criteria === "starts_with") return raw.startsWith(text);
      return raw.includes(text);
    });
  }, [normalizedRows, appliedSearch]);

  const sortedRows = useMemo(
    () => sortRows(filteredRows, sortField, sortOrder, getFieldValue),
    [filteredRows, sortField, sortOrder],
  );

  const totalRecords = sortedRows.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 0;
  const pagedRows = sortedRows.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

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
    setAppliedSearch({
      field: searchField,
      criteria: searchCriteria,
      text: searchText,
    });
    setCurrentPage(1);
    setGoToPageInput("1");
  };

  const handleExport = async () => {
    if (!username) return;
    setExporting(true);
    try {
      await specialEventsRegistrationService.exportToExcel({
        Username: username,
      });
      setSnackbar({
        open: true,
        message: "Export downloaded.",
        severity: "success",
      });
    } catch (err) {
      const msg =
        err?.response?.data?.error ??
        err?.message ??
        "Export failed.";
      setSnackbar({ open: true, message: msg, severity: "error" });
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res =
        await specialEventsRegistrationService.deleteSpecialEventsRegistration({
          RequestId: String(deleteTarget),
        });
      if (res?.isSuccess === false || res?.IsSuccess === false) {
        setSnackbar({
          open: true,
          message:
            res?.errorMessage ??
            res?.ErrorMessage ??
            "Delete failed.",
          severity: "error",
        });
        return;
      }
      setSnackbar({
        open: true,
        message:
          res?.message ??
          res?.Message ??
          "Application has been deleted successfully.",
        severity: "success",
      });
      setDeleteTarget(null);
      await loadList();
    } catch (err) {
      const msg =
        err?.response?.data?.message ??
        err?.message ??
        "Delete failed.";
      setSnackbar({ open: true, message: msg, severity: "error" });
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (d) => {
    if (!d) return "—";
    const date = typeof d === "string" ? new Date(d) : d;
    return Number.isNaN(date.getTime())
      ? String(d)
      : date.toLocaleString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
  };

  const colSpan = canDelete ? 10 : 9;

  return (
    <Box className="admin-special-events-registration" sx={pageSx}>
      <SystemAdminHeader user={user} />
      <SystemAdminRoleHeaderSpacer />
      <Container maxWidth="xl" sx={{ mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={adminSessionListPanelCardSx}>
              <CardContent sx={adminSessionListPanelContentSx}>
                <Box sx={adminSessionListHeaderBarSx}>
                  <Typography
                    variant="subtitle1"
                    component="div"
                    sx={adminSessionListTitleSx}
                  >
                    Special Event Registration Request
                  </Typography>
                  {canExport && (
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      startIcon={<DownloadIcon />}
                      onClick={handleExport}
                      disabled={loading || exporting}
                      sx={toolbarButtonSx}
                    >
                      Export Excel
                    </Button>
                  )}
                </Box>

                <Box className="admin-special-events-registration-table-panel">
                  <Box sx={adminSessionListSearchBarSx}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Typography sx={adminSessionListSearchLabelSx}>
                        Search By:
                      </Typography>
                      <Select
                        value={searchField}
                        onChange={(e) => setSearchField(e.target.value)}
                        size="small"
                        sx={adminSessionListSearchSelectSx}
                      >
                        {SEARCH_FIELDS.map((f) => (
                          <MenuItem
                            key={f.value}
                            value={f.value}
                            sx={adminSessionListMenuItemSx}
                          >
                            {f.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Typography sx={adminSessionListSearchLabelSx}>
                        Criteria:
                      </Typography>
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
                    className="admin-special-events-registration-table-container"
                    sx={{ width: "100%" }}
                  >
                    <Table
                      className="admin-special-events-registration-table"
                      sx={adminSessionListGridTableSx}
                      size="small"
                    >
                      <TableHead>
                        <TableRow sx={adminSessionListTableHeadRowSx}>
                          {canDelete && (
                            <TableCell
                              sx={adminSessionListTableHeadCellSx(
                                columnWidths.delete,
                              )}
                            >
                              Action
                            </TableCell>
                          )}
                          <SortableHeader
                            label="#"
                            field="registerID"
                            sortField={sortField}
                            sortOrder={sortOrder}
                            onSort={handleSort}
                            headCellSx={adminSessionListTableHeadCellSx(
                              columnWidths.registerID,
                            )}
                          />
                          <SortableHeader
                            label="Name"
                            field="studentName"
                            sortField={sortField}
                            sortOrder={sortOrder}
                            onSort={handleSort}
                            headCellSx={adminSessionListTableHeadCellSx(
                              columnWidths.studentName,
                            )}
                          />
                          <SortableHeader
                            label="Grade"
                            field="grade"
                            sortField={sortField}
                            sortOrder={sortOrder}
                            onSort={handleSort}
                            headCellSx={adminSessionListTableHeadCellSx(
                              columnWidths.grade,
                            )}
                          />
                          <SortableHeader
                            label="School"
                            field="school"
                            sortField={sortField}
                            sortOrder={sortOrder}
                            onSort={handleSort}
                            headCellSx={adminSessionListTableHeadCellSx(
                              columnWidths.school,
                            )}
                          />
                          <SortableHeader
                            label="Phone"
                            field="phone"
                            sortField={sortField}
                            sortOrder={sortOrder}
                            onSort={handleSort}
                            headCellSx={adminSessionListTableHeadCellSx(
                              columnWidths.phone,
                            )}
                          />
                          <SortableHeader
                            label="Email"
                            field="email"
                            sortField={sortField}
                            sortOrder={sortOrder}
                            onSort={handleSort}
                            headCellSx={adminSessionListTableHeadCellSx(
                              columnWidths.email,
                            )}
                          />
                          <SortableHeader
                            label="City"
                            field="city"
                            sortField={sortField}
                            sortOrder={sortOrder}
                            onSort={handleSort}
                            headCellSx={adminSessionListTableHeadCellSx(
                              columnWidths.city,
                            )}
                          />
                          <SortableHeader
                            label="Event Name"
                            field="eventName"
                            sortField={sortField}
                            sortOrder={sortOrder}
                            onSort={handleSort}
                            headCellSx={adminSessionListTableHeadCellSx(
                              columnWidths.eventName,
                            )}
                          />
                          <SortableHeader
                            label="Register Date"
                            field="insertDate"
                            sortField={sortField}
                            sortOrder={sortOrder}
                            onSort={handleSort}
                            headCellSx={adminSessionListTableHeadCellSx(
                              columnWidths.insertDate,
                              true,
                            )}
                          />
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {loading ? (
                          <TableRow>
                            <TableCell
                              colSpan={colSpan}
                              align="center"
                              sx={adminSessionListEmptyCellSx}
                            >
                              <Typography
                                variant="body2"
                                color="textSecondary"
                                sx={adminSessionListEmptyTextSx}
                              >
                                Loading...
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ) : pagedRows.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={colSpan}
                              align="center"
                              sx={adminSessionListEmptyCellSx}
                            >
                              <Typography
                                variant="body2"
                                color="textSecondary"
                                sx={adminSessionListEmptyTextSx}
                              >
                                {appliedSearch.text
                                  ? "No registrations found matching your search criteria."
                                  : "No registrations found."}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ) : (
                          pagedRows.map((row, index) => (
                            <TableRow
                              key={`${row.registerID}-${index}`}
                              sx={adminSessionListTableBodyRowSx}
                            >
                              {canDelete && (
                                <TableCell
                                  className="admin-special-events-registration-delete-cell"
                                  sx={adminSessionListTableBodyCellSx({
                                    action: true,
                                  })}
                                >
                                  <Box
                                    component="span"
                                    onClick={() =>
                                      setDeleteTarget(row.registerID)
                                    }
                                    sx={adminSessionListTableDeleteLinkSx}
                                    aria-label="Delete registration"
                                  >
                                    Delete
                                  </Box>
                                </TableCell>
                              )}
                              <TableCell
                                sx={adminSessionListTableBodyCellSx({
                                  ellipsis: true,
                                })}
                              >
                                {row.registerID ?? "—"}
                              </TableCell>
                              <TableCell
                                sx={adminSessionListTableBodyCellSx({
                                  ellipsis: true,
                                })}
                              >
                                <Tooltip title={row.studentName || "—"}>
                                  <span>{row.studentName || "—"}</span>
                                </Tooltip>
                              </TableCell>
                              <TableCell
                                sx={adminSessionListTableBodyCellSx({
                                  ellipsis: true,
                                })}
                              >
                                {row.grade || "—"}
                              </TableCell>
                              <TableCell
                                sx={adminSessionListTableBodyCellSx({
                                  ellipsis: true,
                                })}
                              >
                                <Tooltip title={row.school || "—"}>
                                  <span>{row.school || "—"}</span>
                                </Tooltip>
                              </TableCell>
                              <TableCell
                                sx={adminSessionListTableBodyCellSx({
                                  ellipsis: true,
                                })}
                              >
                                {row.phone || "—"}
                              </TableCell>
                              <TableCell
                                sx={adminSessionListTableBodyCellSx({
                                  ellipsis: true,
                                })}
                              >
                                <Tooltip title={row.email || "—"}>
                                  <span>{row.email || "—"}</span>
                                </Tooltip>
                              </TableCell>
                              <TableCell
                                sx={adminSessionListTableBodyCellSx({
                                  ellipsis: true,
                                })}
                              >
                                {row.city || "—"}
                              </TableCell>
                              <TableCell
                                sx={adminSessionListTableBodyCellSx({
                                  ellipsis: true,
                                })}
                              >
                                <Tooltip title={row.eventName || "—"}>
                                  <span>{row.eventName || "—"}</span>
                                </Tooltip>
                              </TableCell>
                              <TableCell
                                sx={adminSessionListTableBodyCellSx({
                                  isLast: true,
                                  ellipsis: true,
                                })}
                              >
                                {formatDate(row.insertDate)}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <SystemAdminSessionListPagination
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

      <AppConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Registration"
        message="Do you want to delete this application?"
        confirmLabel="Delete"
        confirmColor="error"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
        loading={deleting}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SpecialEventsRegistration;
