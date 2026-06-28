import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Alert,
  Card,
  CardContent,
  Container,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar,
  Paper,
  Select,
  Tooltip,
  CircularProgress,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import AdminHeader, { AdminRoleHeaderSpacer } from "./AdminHeader";
import AdminSessionListPagination from "./AdminSessionListPagination";
import SortableHeader from "../Common/SortableHeader";
import PortalDialog from "../Common/PortalDialog";
import PortalModalSelect from "../Common/PortalModalSelect";
import {
  portalModalFieldSx,
  portalModalSendButtonSx,
} from "../Common/portalModalStyles";
import { useAuth } from "../../../contexts/AuthContext";
import donorDetailsService from "../../../services/donorDetailsService";
import {
  compareValues,
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
  adminSessionListTableActionLinkSx,
  adminSessionListTableBodyCellSx,
  adminSessionListTableBodyRowSx,
  adminSessionListTableHeadCellSx,
  adminSessionListTableHeadRowSx,
  adminSessionListTitleSx,
} from "../styles/applicationSurfaces";
import "../../../styles/AdminDonorDetails.css";

const DONOR_LEVELS = ["DIAMOND", "PLATINUM", "GOLD", "SILVER", "BRONZE"];
const SEMESTERS = ["Spring", "Fall"];

/** Sort order for Donor Level column: Platinum → Diamond → Gold → Silver → Bronze */
const DONOR_LEVEL_SORT_ORDER = {
  PLATINUM: 0,
  DIAMOND: 1,
  GOLD: 2,
  SILVER: 3,
  BRONZE: 4,
};

function getDonorLevelSortValue(level) {
  const key = String(level ?? "").trim().toUpperCase();
  return DONOR_LEVEL_SORT_ORDER[key] ?? 999;
}

const SEARCH_FIELDS = [
  { value: "donorID", label: "Row #" },
  { value: "donorName", label: "Donor Name" },
  { value: "donorLevel", label: "Donor Level" },
  { value: "year", label: "Year" },
  { value: "semester", label: "Semester" },
];

const columnWidths = {
  edit: "6%",
  donorID: "10%",
  donorName: "38%",
  donorLevel: "18%",
  year: "12%",
  semester: "16%",
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

const emptyForm = {
  rowID: "0",
  donorName: "",
  donorLevel: "DIAMOND",
  semester: "Spring",
  year: new Date().getFullYear(),
};

function buildYearOptions() {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let y = currentYear; y >= 2000; y -= 1) {
    years.push(y);
  }
  return years;
}

function normalizeDonor(row, index) {
  return {
    donorID:
      row.donorID ??
      row.DonorID ??
      row.rowID ??
      row.RowID ??
      index + 1,
    donorName: row.donorName ?? row.DonorName ?? "",
    donorLevel: row.donorLevel ?? row.DonorLevel ?? "",
    year: row.year ?? row.Year ?? 0,
    semester: row.semester ?? row.Semester ?? "",
  };
}

function getFieldValue(row, field) {
  switch (field) {
    case "donorID":
      return toSortableNumber(row.donorID);
    case "donorName":
      return row.donorName ?? "";
    case "donorLevel":
      return getDonorLevelSortValue(row.donorLevel);
    case "year":
      return toSortableNumber(row.year);
    case "semester":
      return row.semester ?? "";
    default:
      return "";
  }
}

/** Primary: Donor Level. Secondary: Row #. Optional tertiary: user-selected column. */
function sortDonorRows(rows, sortField, sortOrder) {
  if (!Array.isArray(rows)) return rows ?? [];

  return [...rows].sort((a, b) => {
    const levelOrder = sortField === "donorLevel" ? sortOrder : "asc";
    const levelCmp = compareValues(
      getDonorLevelSortValue(a.donorLevel),
      getDonorLevelSortValue(b.donorLevel),
      levelOrder,
    );
    if (levelCmp !== 0) return levelCmp;

    const idOrder = sortField === "donorID" ? sortOrder : "asc";
    const idCmp = compareValues(
      toSortableNumber(a.donorID),
      toSortableNumber(b.donorID),
      idOrder,
    );
    if (idCmp !== 0) return idCmp;

    if (sortField !== "donorLevel" && sortField !== "donorID") {
      return compareValues(
        getFieldValue(a, sortField),
        getFieldValue(b, sortField),
        sortOrder,
      );
    }

    return 0;
  });
}

const DonorDetails = () => {
  const { user } = useAuth();
  const yearOptions = useMemo(() => buildYearOptions(), []);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [donors, setDonors] = useState([]);
  const [privileges, setPrivileges] = useState({
    canEditDonors: false,
    canAddDonors: false,
    canSubmitDonors: false,
  });
  const [formOpen, setFormOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [searchField, setSearchField] = useState("donorName");
  const [searchCriteria, setSearchCriteria] = useState("contains");
  const [searchText, setSearchText] = useState("");
  const [appliedSearch, setAppliedSearch] = useState({
    field: "donorName",
    criteria: "contains",
    text: "",
  });
  const [sortField, setSortField] = useState("donorLevel");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [goToPageInput, setGoToPageInput] = useState("1");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const pageSize = 25;

  const loadDonors = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    try {
      const res = await donorDetailsService.getAllDonors(forceRefresh);
      if (!res.isSuccess) {
        setSnackbar({
          open: true,
          message: res.errorMessage || "Failed to load donors.",
          severity: "error",
        });
        setDonors([]);
        return;
      }
      setDonors(res.donors ?? res.Donors ?? []);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "Failed to load donors.",
        severity: "error",
      });
      setDonors([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const privRes = await donorDetailsService.checkPrivileges();
        if (privRes.isSuccess) {
          setPrivileges({
            canEditDonors: privRes.canEditDonors === true,
            canAddDonors: privRes.canAddDonors === true,
            canSubmitDonors: privRes.canSubmitDonors === true,
          });
        }
      } catch {
        // Privileges endpoint failure — view-only grid still loads for admins.
      }
      await loadDonors();
    };
    init();
  }, [loadDonors, user]);

  const normalizedRows = useMemo(
    () => donors.map((row, index) => normalizeDonor(row, index)),
    [donors],
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
    () => sortDonorRows(filteredRows, sortField, sortOrder),
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

  const handleRefresh = async () => {
    setSearchField("donorName");
    setSearchCriteria("contains");
    setSearchText("");
    setAppliedSearch({ field: "donorName", criteria: "contains", text: "" });
    setSortField("donorLevel");
    setSortOrder("asc");
    setCurrentPage(1);
    setGoToPageInput("1");
    await loadDonors(true);
  };

  const isAddMode = form.rowID === "0";

  const closeForm = () => {
    if (submitting) return;
    setFormOpen(false);
    setForm(emptyForm);
    setFormLoading(false);
  };

  const handleAdd = () => {
    setForm({
      ...emptyForm,
      year: yearOptions[0] ?? new Date().getFullYear(),
    });
    setFormLoading(false);
    setFormOpen(true);
  };

  const handleEdit = async (donorID) => {
    setFormOpen(true);
    setFormLoading(true);
    try {
      const res = await donorDetailsService.getDonor(String(donorID));
      if (!res.isSuccess || !res.donor) {
        setSnackbar({
          open: true,
          message: res.errorMessage || "Failed to load donor details.",
          severity: "error",
        });
        closeForm();
        return;
      }
      const d = normalizeDonor(res.donor, 0);
      setForm({
        rowID: String(d.donorID),
        donorName: d.donorName,
        donorLevel: d.donorLevel || "DIAMOND",
        semester: d.semester || "Spring",
        year: d.year || yearOptions[0],
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message:
          err?.response?.data?.errorMessage ??
          err?.response?.data?.message ??
          err.message ??
          "Failed to load donor details.",
        severity: "error",
      });
      closeForm();
    } finally {
      setFormLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.donorName.trim()) {
      setSnackbar({
        open: true,
        message: "Donor name is required.",
        severity: "warning",
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await donorDetailsService.upsertDonor({
        rowID: form.rowID,
        donorName: form.donorName.trim(),
        donorLevel: form.donorLevel,
        semester: form.semester,
        year: Number(form.year),
      });
      if (!res.isSuccess) {
        setSnackbar({
          open: true,
          message: res.errorMessage || "Failed to save donor.",
          severity: "error",
        });
        return;
      }
      setSnackbar({
        open: true,
        message: res.message || "Data updated successfully.",
        severity: "success",
      });
      closeForm();
      await loadDonors();
    } catch (err) {
      setSnackbar({
        open: true,
        message:
          err?.response?.data?.errorMessage ??
          err?.response?.data?.message ??
          err.message ??
          "Failed to save donor.",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formReadOnly = !privileges.canSubmitDonors;

  return (
    <Box className="admin-donor-details" sx={pageSx}>
      <AdminHeader user={user} />
      <AdminRoleHeaderSpacer />
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
                    Donors List
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    {privileges.canAddDonors && (
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={handleAdd}
                        disabled={loading}
                        sx={toolbarButtonSx}
                      >
                        Add Donors
                      </Button>
                    )}
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      startIcon={<RefreshIcon />}
                      onClick={handleRefresh}
                      disabled={loading}
                      sx={toolbarButtonSx}
                    >
                      Refresh
                    </Button>
                  </Box>
                </Box>

                <Box className="admin-donor-details-table-panel">
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
                    className="admin-donor-details-table-container"
                    sx={{ width: "100%" }}
                  >
                    <Table
                      className="admin-donor-details-table"
                      sx={adminSessionListGridTableSx}
                      size="small"
                    >
                      <TableHead>
                        <TableRow sx={adminSessionListTableHeadRowSx}>
                          <TableCell
                            sx={adminSessionListTableHeadCellSx(columnWidths.edit)}
                          >
                            Edit
                          </TableCell>
                          <SortableHeader
                            label="Row #"
                            field="donorID"
                            sortField={sortField}
                            sortOrder={sortOrder}
                            onSort={handleSort}
                            headCellSx={adminSessionListTableHeadCellSx(
                              columnWidths.donorID,
                            )}
                          />
                          <SortableHeader
                            label="Donor Name"
                            field="donorName"
                            sortField={sortField}
                            sortOrder={sortOrder}
                            onSort={handleSort}
                            headCellSx={adminSessionListTableHeadCellSx(
                              columnWidths.donorName,
                            )}
                          />
                          <SortableHeader
                            label="Donor Level"
                            field="donorLevel"
                            sortField={sortField}
                            sortOrder={sortOrder}
                            onSort={handleSort}
                            headCellSx={adminSessionListTableHeadCellSx(
                              columnWidths.donorLevel,
                            )}
                          />
                          <SortableHeader
                            label="Year"
                            field="year"
                            sortField={sortField}
                            sortOrder={sortOrder}
                            onSort={handleSort}
                            headCellSx={adminSessionListTableHeadCellSx(
                              columnWidths.year,
                            )}
                          />
                          <SortableHeader
                            label="Semester"
                            field="semester"
                            sortField={sortField}
                            sortOrder={sortOrder}
                            onSort={handleSort}
                            headCellSx={adminSessionListTableHeadCellSx(
                              columnWidths.semester,
                              true,
                            )}
                          />
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {loading ? (
                          <TableRow>
                            <TableCell
                              colSpan={6}
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
                              colSpan={6}
                              align="center"
                              sx={adminSessionListEmptyCellSx}
                            >
                              <Typography
                                variant="body2"
                                color="textSecondary"
                                sx={adminSessionListEmptyTextSx}
                              >
                                {appliedSearch.text
                                  ? "No donors found matching your search criteria."
                                  : "No donor data available."}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ) : (
                          pagedRows.map((row, index) => (
                            <TableRow
                              key={`${row.donorID}-${index}`}
                              sx={adminSessionListTableBodyRowSx}
                            >
                              <TableCell
                                className="admin-donor-details-edit-cell"
                                sx={adminSessionListTableBodyCellSx({
                                  action: true,
                                })}
                              >
                                {privileges.canEditDonors ? (
                                  <Box
                                    component="span"
                                    onClick={() => handleEdit(row.donorID)}
                                    sx={adminSessionListTableActionLinkSx}
                                    aria-label={`Edit donor ${row.donorName}`}
                                  >
                                    Edit
                                  </Box>
                                ) : (
                                  "—"
                                )}
                              </TableCell>
                              <TableCell
                                sx={adminSessionListTableBodyCellSx({
                                  ellipsis: true,
                                })}
                              >
                                {row.donorID ?? "—"}
                              </TableCell>
                              <TableCell
                                sx={adminSessionListTableBodyCellSx({
                                  ellipsis: true,
                                })}
                              >
                                <Tooltip title={row.donorName || "—"}>
                                  <span>{row.donorName || "—"}</span>
                                </Tooltip>
                              </TableCell>
                              <TableCell
                                sx={adminSessionListTableBodyCellSx({
                                  ellipsis: true,
                                })}
                              >
                                {row.donorLevel || "—"}
                              </TableCell>
                              <TableCell
                                sx={adminSessionListTableBodyCellSx({
                                  ellipsis: true,
                                })}
                              >
                                {row.year || "—"}
                              </TableCell>
                              <TableCell
                                sx={adminSessionListTableBodyCellSx({
                                  isLast: true,
                                  ellipsis: true,
                                })}
                              >
                                {row.semester || "—"}
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

      <PortalDialog
        open={formOpen}
        onClose={closeForm}
        maxWidth="sm"
        disableClose={submitting || formLoading}
        ariaLabelledby="donor-details-form-dialog-title"
        title={isAddMode ? "Add Donor Details" : "Update Donor Details"}
        icon={
          isAddMode ? (
            <AddIcon sx={{ fontSize: 20 }} />
          ) : (
            <EditIcon sx={{ fontSize: 20 }} />
          )
        }
        actions={
          privileges.canSubmitDonors ? (
            <Button
              variant="contained"
              startIcon={
                submitting ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <SaveIcon />
                )
              }
              onClick={handleSubmit}
              disabled={submitting || formLoading || formReadOnly}
              sx={portalModalSendButtonSx}
            >
              {submitting ? "Saving…" : "Submit"}
            </Button>
          ) : null
        }
      >
        {formLoading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress size={32} />
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 0.5 }}>
            <TextField
              label="Donor Name"
              required
              fullWidth
              size="small"
              value={form.donorName}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, donorName: e.target.value }))
              }
              InputProps={{ readOnly: formReadOnly }}
              sx={portalModalFieldSx}
            />

            <FormControl fullWidth size="small" sx={portalModalFieldSx}>
              <InputLabel>Semester</InputLabel>
              <PortalModalSelect
                value={form.semester}
                label="Semester"
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, semester: e.target.value }))
                }
                disabled={formReadOnly}
              >
                {SEMESTERS.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </PortalModalSelect>
            </FormControl>

            <FormControl fullWidth size="small" sx={portalModalFieldSx}>
              <InputLabel>Donor Level</InputLabel>
              <PortalModalSelect
                value={form.donorLevel}
                label="Donor Level"
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, donorLevel: e.target.value }))
                }
                disabled={formReadOnly}
              >
                {DONOR_LEVELS.map((level) => (
                  <MenuItem key={level} value={level}>
                    {level}
                  </MenuItem>
                ))}
              </PortalModalSelect>
            </FormControl>

            <FormControl fullWidth size="small" sx={portalModalFieldSx}>
              <InputLabel>Year</InputLabel>
              <PortalModalSelect
                value={String(form.year)}
                label="Year"
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    year: Number(e.target.value),
                  }))
                }
                disabled={formReadOnly}
              >
                {yearOptions.map((y) => (
                  <MenuItem key={y} value={String(y)}>
                    {y}
                  </MenuItem>
                ))}
              </PortalModalSelect>
            </FormControl>

            <Typography variant="caption" color="text.secondary">
              * Required fields
            </Typography>
            {formReadOnly && (
              <Typography variant="caption" color="text.secondary">
                Only system administrators can save changes.
              </Typography>
            )}
          </Box>
        )}
      </PortalDialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DonorDetails;
