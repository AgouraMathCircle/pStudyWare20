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
  Typography,
} from "@mui/material";
import { Refresh as RefreshIcon } from "@mui/icons-material";
import { useAuth } from "../../../contexts/AuthContext";
import AdminHeader, { AdminRoleHeaderSpacer } from "./AdminHeader";
import SortableHeader from "../Common/SortableHeader";
import AdminSessionListPagination from "./AdminSessionListPagination";
import adminDashboardService from "../../../services/adminDashboardService";
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
  adminSessionListTableHeadCellSx,
  adminSessionListTableHeadRowSx,
  adminSessionListTitleSx,
} from "../styles/applicationSurfaces";
import "../../../styles/AdminUserTracking.css";

const SEARCH_FIELDS = [
  { value: "userName", label: "User Name" },
  { value: "firstName", label: "First Name" },
  { value: "lastName", label: "Last Name" },
  { value: "userType", label: "User Type" },
  { value: "loginBy", label: "Login From" },
];

const userTrackingColumnWidths = {
  rowID: "6%",
  firstName: "12%",
  lastName: "12%",
  userName: "22%",
  userType: "12%",
  logindate: "14%",
  loginBy: "22%",
};

const adminUserTrackingPageSx = {
  flex: 1,
  minHeight: 0,
  width: "100%",
  display: "flex",
  flexDirection: "column",
};

const refreshToolbarButtonSx = {
  ...adminSessionListFindButtonSx,
  backgroundColor: "#4caf50",
  color: "white",
  flexShrink: 0,
  px: 1.5,
  "&:hover": { backgroundColor: "#43a047" },
};

function getUserTrackingFieldValue(row, field) {
  switch (field) {
    case "rowID":
      return toSortableNumber(row.rowID);
    case "firstName":
      return row.firstName ?? "";
    case "lastName":
      return row.lastName ?? "";
    case "userName":
      return row.userName ?? "";
    case "userType":
      return row.userType ?? "";
    case "logindate":
      return toSortableDate(row.logindate);
    case "loginBy":
      return row.loginBy ?? "";
    default:
      return "";
  }
}

const AdminUserTracking = () => {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchField, setSearchField] = useState("userName");
  const [searchCriteria, setSearchCriteria] = useState("contains");
  const [searchText, setSearchText] = useState("");
  const [appliedSearch, setAppliedSearch] = useState({ field: "userName", criteria: "contains", text: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [goToPageInput, setGoToPageInput] = useState("1");
  const [sortField, setSortField] = useState("logindate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const pageSize = 25;

  const loadList = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await adminDashboardService.getUserTrackingList({
        username: user.username || user.email,
      });
      const list = res?.trackingList ?? res?.TrackingList ?? [];
      if (res?.isSuccess === false || res?.IsSuccess === false) {
        setSnackbar({
          open: true,
          message: res?.errorMessage ?? res?.ErrorMessage ?? "Failed to load user tracking.",
          severity: "error",
        });
        setRows([]);
        return;
      }
      setRows(Array.isArray(list) ? list : []);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err?.response?.data?.message || "Failed to load user tracking.",
        severity: "error",
      });
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadList();
  }, [loadList]);

  const normalizedRows = useMemo(
    () =>
      rows.map((r, index) => ({
        rowID: r.rowID ?? r.RowID ?? index + 1,
        firstName: r.firstName ?? r.FirstName ?? "",
        lastName: r.lastName ?? r.LastName ?? "",
        userName: r.userName ?? r.UserName ?? "",
        userType: r.userType ?? r.UserType ?? "",
        logindate: r.logindate ?? r.Logindate ?? null,
        loginBy: r.loginBy ?? r.LoginBy ?? "",
      })),
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
    () => sortRows(filteredRows, sortField, sortOrder, getUserTrackingFieldValue),
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
    setAppliedSearch({ field: searchField, criteria: searchCriteria, text: searchText });
    setCurrentPage(1);
    setGoToPageInput("1");
  };

  const formatDate = (d) => {
    if (!d) return "";
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

  return (
    <Box className="admin-user-tracking" sx={adminUserTrackingPageSx}>
      <AdminHeader user={user} />
      <AdminRoleHeaderSpacer />
      <Container maxWidth="xl" sx={{ mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={adminSessionListPanelCardSx}>
              <CardContent sx={adminSessionListPanelContentSx}>
                <Box sx={adminSessionListHeaderBarSx}>
                  <Typography variant="subtitle1" component="div" sx={adminSessionListTitleSx}>
                    User Tracking
                  </Typography>
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    startIcon={<RefreshIcon />}
                    onClick={loadList}
                    disabled={loading}
                    sx={refreshToolbarButtonSx}
                  >
                    Refresh
                  </Button>
                </Box>

                <Box className="admin-user-tracking-table-panel">
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
                    className="admin-user-tracking-table-container"
                    sx={{ width: "100%" }}
                  >
                    <Table
                      className="admin-user-tracking-table"
                      sx={adminSessionListGridTableSx}
                      size="small"
                    >
                      <TableHead>
                        <TableRow sx={adminSessionListTableHeadRowSx}>
                          <SortableHeader
                            label="#"
                            field="rowID"
                            sortField={sortField}
                            sortOrder={sortOrder}
                            onSort={handleSort}
                            headCellSx={adminSessionListTableHeadCellSx(userTrackingColumnWidths.rowID)}
                          />
                          <SortableHeader
                            label="First Name"
                            field="firstName"
                            sortField={sortField}
                            sortOrder={sortOrder}
                            onSort={handleSort}
                            headCellSx={adminSessionListTableHeadCellSx(userTrackingColumnWidths.firstName)}
                          />
                          <SortableHeader
                            label="Last Name"
                            field="lastName"
                            sortField={sortField}
                            sortOrder={sortOrder}
                            onSort={handleSort}
                            headCellSx={adminSessionListTableHeadCellSx(userTrackingColumnWidths.lastName)}
                          />
                          <SortableHeader
                            label="User Name"
                            field="userName"
                            sortField={sortField}
                            sortOrder={sortOrder}
                            onSort={handleSort}
                            headCellSx={adminSessionListTableHeadCellSx(userTrackingColumnWidths.userName)}
                          />
                          <SortableHeader
                            label="User Type"
                            field="userType"
                            sortField={sortField}
                            sortOrder={sortOrder}
                            onSort={handleSort}
                            headCellSx={adminSessionListTableHeadCellSx(userTrackingColumnWidths.userType)}
                          />
                          <SortableHeader
                            label="Login Date"
                            field="logindate"
                            sortField={sortField}
                            sortOrder={sortOrder}
                            onSort={handleSort}
                            headCellSx={adminSessionListTableHeadCellSx(userTrackingColumnWidths.logindate)}
                          />
                          <SortableHeader
                            label="Login From"
                            field="loginBy"
                            sortField={sortField}
                            sortOrder={sortOrder}
                            onSort={handleSort}
                            headCellSx={adminSessionListTableHeadCellSx(userTrackingColumnWidths.loginBy, true)}
                          />
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {loading ? (
                          <TableRow>
                            <TableCell colSpan={7} align="center" sx={adminSessionListEmptyCellSx}>
                              <Typography variant="body2" color="textSecondary" sx={adminSessionListEmptyTextSx}>
                                Loading...
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ) : pagedRows.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} align="center" sx={adminSessionListEmptyCellSx}>
                              <Typography variant="body2" color="textSecondary" sx={adminSessionListEmptyTextSx}>
                                No records found.
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ) : (
                          pagedRows.map((row) => (
                            <TableRow
                              key={`${row.rowID}-${row.userName}-${row.logindate}`}
                              sx={adminSessionListTableBodyRowSx}
                            >
                              <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
                                {row.rowID}
                              </TableCell>
                              <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
                                {row.firstName}
                              </TableCell>
                              <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
                                {row.lastName}
                              </TableCell>
                              <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
                                {row.userName}
                              </TableCell>
                              <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
                                {row.userType}
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={adminSessionListTableBodyCellSx({ ellipsis: true })}
                              >
                                {formatDate(row.logindate)}
                              </TableCell>
                              <TableCell sx={adminSessionListTableBodyCellSx({ isLast: true, ellipsis: true })}>
                                {row.loginBy}
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
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminUserTracking;
