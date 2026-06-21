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
import AdminHeader from "./AdminHeader";
import SortableHeader from "../Common/SortableHeader";
import adminDashboardService from "../../../services/adminDashboardService";
import {
  sortRows,
  toSortableDate,
  toSortableNumber,
} from "../../../utils/tableSort";
import {
  APPLICATION_ADMIN_TITLE_COLOR,
  PORTAL_CARD_BOX_SHADOW,
  portalCardAntiLiftSx,
  portalRoleSubheaderSpacerPx,
} from "../styles/applicationSurfaces";

const SEARCH_FIELDS = [
  { value: "userName", label: "User Name" },
  { value: "firstName", label: "First Name" },
  { value: "lastName", label: "Last Name" },
  { value: "userType", label: "User Type" },
  { value: "loginBy", label: "Login From" },
];

const cellPadding = "0 8px";

const userTrackingHeadCellSx = (isLast = false) => ({
  fontWeight: 400,
  borderRight: isLast ? undefined : "1px solid #4caf50",
  fontSize: "0.75rem",
  padding: cellPadding,
});

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
  const [page, setPage] = useState(0);
  const [sortField, setSortField] = useState("logindate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const pageSize = 20;

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

  const pageCount = Math.max(1, Math.ceil(sortedRows.length / pageSize));
  const pagedRows = sortedRows.slice(page * pageSize, page * pageSize + pageSize);

  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortField(field);
    setPage(0);
  };

  const handleSearch = () => {
    setAppliedSearch({ field: searchField, criteria: searchCriteria, text: searchText });
    setPage(0);
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
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <AdminHeader user={user} />
      <Box sx={{ height: `${portalRoleSubheaderSpacerPx}px` }} />
      <Container maxWidth="xl" sx={{ mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card
              sx={{
                backgroundColor: "white",
                borderRadius: 2,
                boxShadow: PORTAL_CARD_BOX_SHADOW,
                overflow: "hidden",
                ...portalCardAntiLiftSx,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 2,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      color: APPLICATION_ADMIN_TITLE_COLOR,
                      fontSize: "1rem",
                    }}
                  >
                    User Tracking
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    startIcon={<RefreshIcon />}
                    onClick={loadList}
                    disabled={loading}
                    sx={{ fontSize: "0.75rem", px: 1.5, py: 0.25 }}
                  >
                    Refresh
                  </Button>
                </Box>

                <Box
                  sx={{
                    mb: 2,
                    p: 1.5,
                    backgroundColor: "#4caf50",
                    borderRadius: 1,
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <Typography sx={{ color: "white", fontSize: "0.75rem", whiteSpace: "nowrap" }}>
                    Search By:
                  </Typography>
                  <Select
                    value={searchField}
                    onChange={(e) => setSearchField(e.target.value)}
                    size="small"
                    sx={{
                      color: "white",
                      fontSize: "0.75rem",
                      minWidth: 120,
                      "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
                      "& .MuiSelect-icon": { color: "white" },
                    }}
                  >
                    {SEARCH_FIELDS.map((f) => (
                      <MenuItem key={f.value} value={f.value} sx={{ fontSize: "0.75rem" }}>
                        {f.label}
                      </MenuItem>
                    ))}
                  </Select>
                  <Typography sx={{ color: "white", fontSize: "0.75rem", whiteSpace: "nowrap" }}>
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
                    <MenuItem value="contains" sx={{ fontSize: "0.75rem" }}>
                      Contains
                    </MenuItem>
                    <MenuItem value="equals" sx={{ fontSize: "0.75rem" }}>
                      Equals
                    </MenuItem>
                    <MenuItem value="starts_with" sx={{ fontSize: "0.75rem" }}>
                      Starts With
                    </MenuItem>
                  </Select>
                  <TextField
                    size="small"
                    placeholder="Search Text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
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
                  <Table size="small" sx={{ tableLayout: "fixed" }}>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#e8f5e8" }}>
                        <SortableHeader label="#" field="rowID" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} headCellSx={userTrackingHeadCellSx()} />
                        <SortableHeader label="First Name" field="firstName" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} headCellSx={userTrackingHeadCellSx()} />
                        <SortableHeader label="Last Name" field="lastName" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} headCellSx={userTrackingHeadCellSx()} />
                        <SortableHeader label="User Name" field="userName" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} headCellSx={userTrackingHeadCellSx()} />
                        <SortableHeader label="User Type" field="userType" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} headCellSx={userTrackingHeadCellSx()} />
                        <SortableHeader label="Login Date" field="logindate" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} headCellSx={userTrackingHeadCellSx()} />
                        <SortableHeader label="Login From" field="loginBy" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} headCellSx={userTrackingHeadCellSx(true)} />
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={7} align="center" sx={{ fontSize: "0.75rem" }}>
                            Loading...
                          </TableCell>
                        </TableRow>
                      ) : pagedRows.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} align="center" sx={{ fontSize: "0.75rem" }}>
                            No records found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        pagedRows.map((row) => (
                          <TableRow key={`${row.rowID}-${row.userName}-${row.logindate}`} hover>
                            <TableCell sx={{ fontSize: "0.75rem", padding: cellPadding }}>{row.rowID}</TableCell>
                            <TableCell sx={{ fontSize: "0.75rem", padding: cellPadding }}>{row.firstName}</TableCell>
                            <TableCell sx={{ fontSize: "0.75rem", padding: cellPadding }}>{row.lastName}</TableCell>
                            <TableCell sx={{ fontSize: "0.75rem", padding: cellPadding }}>{row.userName}</TableCell>
                            <TableCell sx={{ fontSize: "0.75rem", padding: cellPadding }}>{row.userType}</TableCell>
                            <TableCell sx={{ fontSize: "0.75rem", padding: cellPadding }} align="center">
                              {formatDate(row.logindate)}
                            </TableCell>
                            <TableCell sx={{ fontSize: "0.75rem", padding: cellPadding }}>{row.loginBy}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
                    {sortedRows.length} record(s)
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      size="small"
                      disabled={page <= 0}
                      onClick={() => setPage((p) => Math.max(0, p - 1))}
                    >
                      Previous
                    </Button>
                    <Typography variant="body2" sx={{ alignSelf: "center", fontSize: "0.75rem" }}>
                      Page {sortedRows.length === 0 ? 0 : page + 1} of {sortedRows.length === 0 ? 0 : pageCount}
                    </Typography>
                    <Button
                      size="small"
                      disabled={page + 1 >= pageCount}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      Next
                    </Button>
                  </Box>
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
