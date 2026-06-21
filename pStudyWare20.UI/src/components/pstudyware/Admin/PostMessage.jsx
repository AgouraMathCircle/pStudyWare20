import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { Refresh as RefreshIcon, Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Save as SaveIcon } from "@mui/icons-material";
import { useAuth } from "../../../contexts/AuthContext";
import AdminHeader from "./AdminHeader";
import AdminSessionListPagination from "./AdminSessionListPagination";
import SortableHeader from "../Common/SortableHeader";
import PortalDialog from "../Common/PortalDialog";
import AppConfirmDialog from "../Common/AppConfirmDialog";
import { portalModalFieldSx, portalModalSendButtonSx } from "../Common/portalModalStyles";
import postMessageService from "../../../services/postMessageService";
import {
  sortRows,
  toSortableDate,
  toSortableNumber,
} from "../../../utils/tableSort";
import {
  PORTAL_CARD_BOX_SHADOW,
  portalCardAntiLiftSx,
  adminSessionListEmptyCellSx,
  adminSessionListEmptyTextSx,
  adminSessionListGridTableSx,
  adminSessionListHeaderBarSx,
  adminSessionListTableBodyCellSx,
  adminSessionListTableBodyRowSx,
  adminSessionListTableHeadCellSx,
  adminSessionListTableHeadRowSx,
  adminSessionListTitleSx,
  adminSessionListToolbarButtonSx,
  portalRoleSubheaderSpacerPx,
} from "../styles/applicationSurfaces";

// Normalize API response to array of items (handles PostMessageListResponse or legacy shapes)
function normalizeAlertList(res) {
  if (Array.isArray(res)) return res;
  const list = res?.postMessages ?? res?.PostMessages ?? res?.table ?? res?.Table;
  if (Array.isArray(list)) return list;
  if (list && typeof list === "object" && !Array.isArray(list)) return [];
  return [];
}

const POST_MESSAGE_COLUMN_WIDTHS = {
  rowId: "5%",
  postDate: "12%",
  message: "48%",
  active: "8%",
  edit: "6%",
  delete: "6%",
};

function getMessageText(row) {
  if (!row || typeof row !== "object") return "";
  const direct =
    row.Description ??
    row.description ??
    row.Message ??
    row.message;
  if (direct != null && String(direct).trim() !== "") {
    return String(direct);
  }
  for (const [key, value] of Object.entries(row)) {
    if (/^(description|message)$/i.test(key) && value != null && String(value).trim() !== "") {
      return String(value);
    }
  }
  return "";
}

function isActiveValue(value) {
  return (
    value === true ||
    value === 1 ||
    value === "1" ||
    String(value).toLowerCase() === "true"
  );
}

// Get display fields from a row (legacy uses AlertDate, Description; API uses same + Message)
function rowDisplay(row) {
  return {
    messageID: row.MessageID ?? row.messageID ?? row.MessageId,
    rowID: row.RowID ?? row.rowID ?? row.RowId,
    postDate:
      row.AlertDate ??
      row.alertDate ??
      row.PostedDate ??
      row.postedDate ??
      "",
    message: getMessageText(row),
    active: isActiveValue(row.Active ?? row.active),
  };
}

function getPostMessageFieldValue(row, field) {
  const d = rowDisplay(row);
  switch (field) {
    case "rowNum":
      return toSortableNumber(d.rowID ?? d.messageID);
    case "postDate":
      return toSortableDate(d.postDate);
    case "postMessage":
      return d.message;
    case "active":
      return d.active ? 1 : 0;
    default:
      return "";
  }
}

// Format date for input (YYYY-MM-DD for input type="date") from stored value
function toInputDate(val) {
  if (!val) return "";
  const d = new Date(val);
  if (isNaN(d.getTime())) return val;
  return d.toISOString().slice(0, 10);
}

// Format date to MM/DD/YYYY for API
function toApiDate(val) {
  if (!val) return "";
  const d = new Date(val);
  if (isNaN(d.getTime())) return val;
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

const PostMessage = () => {
  const { user } = useAuth();
  const [alertList, setAlertList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    postDate: "",
    message: "",
    active: "1",
  });
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, messageID: null });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [goToPageInput, setGoToPageInput] = useState("1");
  const [sortField, setSortField] = useState("postDate");
  const [sortOrder, setSortOrder] = useState("desc");

  const pageSize = 25;
  const username = user?.email || user?.username || "";

  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortField(field);
    setCurrentPage(1);
    setGoToPageInput("1");
  };

  const sortedAlertList = useMemo(
    () => sortRows(alertList, sortField, sortOrder, getPostMessageFieldValue),
    [alertList, sortField, sortOrder],
  );

  const totalRecords = sortedAlertList.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 0;

  const paginatedAlertList = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedAlertList.slice(start, start + pageSize);
  }, [sortedAlertList, currentPage, pageSize]);

  const handlePageChange = (page) => {
    const maxPage = Math.ceil(sortedAlertList.length / pageSize) || 1;
    if (page >= 1 && page <= maxPage) {
      setCurrentPage(page);
      setGoToPageInput(page.toString());
    }
  };

  const handleGoToPage = () => {
    const page = parseInt(goToPageInput, 10);
    const maxPage = Math.ceil(sortedAlertList.length / pageSize) || 1;
    if (!isNaN(page) && page >= 1 && page <= maxPage) {
      setCurrentPage(page);
    } else {
      setGoToPageInput(currentPage.toString());
    }
  };

  const loadAlertList = async () => {
    setLoading(true);
    try {
      const res = await postMessageService.getAlertList({ RowID: "" });
      const data = typeof res === "string" ? (() => { try { return JSON.parse(res); } catch { return res; } })() : res;
      const list = normalizeAlertList(data);
      setAlertList(list);
      setCurrentPage(1);
      setGoToPageInput("1");
      if (!data?.isSuccess && data?.isSuccess === false && data?.errorMessage) {
        setSnackbar({ open: true, message: data.errorMessage, severity: "warning" });
      }
    } catch (err) {
      console.error("Error loading alert list:", err);
      const msg = err?.response?.data?.error ?? err?.response?.data?.message ?? err?.message ?? "Error loading messages.";
      setSnackbar({ open: true, message: msg, severity: "error" });
      setAlertList([]);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditingId(null);
    setForm({
      postDate: toInputDate(new Date()),
      message: "",
      active: "1",
    });
    setFormOpen(true);
  };

  const openEdit = (row) => {
    const d = rowDisplay(row);
    setEditingId(d.messageID != null ? String(d.messageID) : null);
    setForm({
      postDate: toInputDate(d.postDate),
      message: d.message,
      active: d.active ? "1" : "0",
    });
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!form.message.trim()) {
      setSnackbar({ open: true, message: "Message is required.", severity: "error" });
      return;
    }
    const apiDate = toApiDate(form.postDate || new Date());
    if (!apiDate) {
      setSnackbar({ open: true, message: "Please enter Post Date (MM/DD/YYYY).", severity: "error" });
      return;
    }
    setSaving(true);
    try {
      const res = await postMessageService.insertOrUpdatePostMessage({
        MessageID: editingId || "0",
        PostedBy: username,
        PostedDate: apiDate,
        Active: form.active,
        Message: form.message.trim(),
      });
      const ok = res?.isSuccess ?? res?.IsSuccess ?? true;
      const msg = res?.message ?? res?.Message ?? res?.errorMessage ?? res?.ErrorMessage ?? "Data updated successfully.";
      if (ok) {
        setSnackbar({ open: true, message: msg || "Data updated successfully.", severity: "success" });
        closeForm();
        loadAlertList();
      } else {
        setSnackbar({ open: true, message: msg || "Failed to save.", severity: "error" });
      }
    } catch (err) {
      const msg = err?.response?.data?.error ?? err?.response?.data?.message ?? err?.message ?? "Failed to save.";
      setSnackbar({ open: true, message: msg, severity: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (messageID) => {
    setDeleteConfirm({ open: true, messageID });
  };

  const handleDeleteConfirm = async () => {
    const id = deleteConfirm.messageID;
    setDeleteConfirm({ open: false, messageID: null });
    if (id == null) return;
    setSaving(true);
    try {
      const res = await postMessageService.deletePostMessage({ MessageID: String(id) });
      const ok = res?.isSuccess ?? res?.IsSuccess ?? true;
      const msg = res?.message ?? res?.Message ?? res?.errorMessage ?? res?.ErrorMessage ?? "Data deleted successfully.";
      if (ok) {
        setSnackbar({ open: true, message: msg || "Data deleted successfully.", severity: "success" });
        loadAlertList();
      } else {
        setSnackbar({ open: true, message: msg || "Failed to delete.", severity: "error" });
      }
    } catch (err) {
      const msg = err?.response?.data?.error ?? err?.response?.data?.message ?? err?.message ?? "Failed to delete.";
      setSnackbar({ open: true, message: msg, severity: "error" });
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadAlertList();
  }, []);

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <AdminHeader />
      <Box sx={{ height: `${portalRoleSubheaderSpacerPx}px` }} />
      <Container maxWidth="xl" sx={{ mb: 4 }}>
        <Grid container spacing={2}>
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
            <Box>
              {/* Header: title + buttons */}
              <Box sx={adminSessionListHeaderBarSx}>
                <Typography variant="subtitle1" sx={adminSessionListTitleSx}>
                  Post Message List
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={openAdd}
                    disabled={loading}
                    sx={adminSessionListToolbarButtonSx}
                  >
                    Add Post Message
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<RefreshIcon />}
                    onClick={loadAlertList}
                    disabled={loading}
                    sx={adminSessionListToolbarButtonSx}
                  >
                    Refresh
                  </Button>
                </Box>
              </Box>

              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <>
              <TableContainer component={Paper} sx={{ width: "100%" }}>
                <Table sx={adminSessionListGridTableSx} size="small">
                  <TableHead>
                    <TableRow sx={adminSessionListTableHeadRowSx}>
                      <SortableHeader
                        label="Row #"
                        field="rowNum"
                        sortField={sortField}
                        sortOrder={sortOrder}
                        onSort={handleSort}
                        align="center"
                        headCellSx={adminSessionListTableHeadCellSx(POST_MESSAGE_COLUMN_WIDTHS.rowId)}
                      />
                      <SortableHeader
                        label="Post Date"
                        field="postDate"
                        sortField={sortField}
                        sortOrder={sortOrder}
                        onSort={handleSort}
                        align="left"
                        headCellSx={adminSessionListTableHeadCellSx(POST_MESSAGE_COLUMN_WIDTHS.postDate)}
                      />
                      <SortableHeader
                        label="Post Message"
                        field="postMessage"
                        sortField={sortField}
                        sortOrder={sortOrder}
                        onSort={handleSort}
                        align="left"
                        headCellSx={adminSessionListTableHeadCellSx(POST_MESSAGE_COLUMN_WIDTHS.message)}
                      />
                      <SortableHeader
                        label="Active"
                        field="active"
                        sortField={sortField}
                        sortOrder={sortOrder}
                        onSort={handleSort}
                        align="left"
                        headCellSx={adminSessionListTableHeadCellSx(POST_MESSAGE_COLUMN_WIDTHS.active)}
                      />
                      <TableCell
                        align="center"
                        sx={adminSessionListTableHeadCellSx(POST_MESSAGE_COLUMN_WIDTHS.edit)}
                      >
                        Edit
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={adminSessionListTableHeadCellSx(POST_MESSAGE_COLUMN_WIDTHS.delete, true)}
                      >
                        Delete
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedAlertList.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={adminSessionListEmptyCellSx}>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            sx={adminSessionListEmptyTextSx}
                          >
                            {alertList.length === 0
                              ? 'No post messages. Click "Add Post Message" to create one.'
                              : "No records on this page."}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedAlertList.map((row, index) => {
                        const d = rowDisplay(row);
                        const displayRowNumber =
                          d.rowID ?? (currentPage - 1) * pageSize + index + 1;
                        return (
                          <TableRow
                            key={d.messageID ?? d.rowID ?? index}
                            hover
                            sx={adminSessionListTableBodyRowSx}
                          >
                            <TableCell align="center" sx={adminSessionListTableBodyCellSx()}>
                              {displayRowNumber}
                            </TableCell>
                            <TableCell align="left" sx={adminSessionListTableBodyCellSx()}>
                              {d.postDate || "—"}
                            </TableCell>
                            <TableCell
                              align="left"
                              sx={adminSessionListTableBodyCellSx({ ellipsis: true })}
                            >
                              <Tooltip title={d.message || "—"}>
                                <span>{d.message || "—"}</span>
                              </Tooltip>
                            </TableCell>
                            <TableCell align="left" sx={adminSessionListTableBodyCellSx()}>
                              {d.active ? "Yes" : "No"}
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={adminSessionListTableBodyCellSx({ action: true })}
                            >
                              <Tooltip title="Edit">
                                <IconButton
                                  size="small"
                                  onClick={() => openEdit(row)}
                                  sx={{ padding: "2px" }}
                                >
                                  <EditIcon sx={{ fontSize: "1rem" }} />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={adminSessionListTableBodyCellSx({ action: true, isLast: true })}
                            >
                              <Tooltip title="Delete">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleDeleteClick(d.messageID)}
                                  sx={{ padding: "2px" }}
                                >
                                  <DeleteIcon sx={{ fontSize: "1rem" }} />
                                </IconButton>
                              </Tooltip>
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
                </>
              )}
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
          disableClose={saving}
          ariaLabelledby="post-message-form-dialog-title"
          title={editingId ? "Update Post Message" : "Add Post Message"}
          icon={
            editingId ? (
              <EditIcon sx={{ fontSize: 20 }} />
            ) : (
              <AddIcon sx={{ fontSize: 20 }} />
            )
          }
          actions={
            <Button
              variant="contained"
              startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
              onClick={handleSubmit}
              disabled={saving}
              sx={portalModalSendButtonSx}
            >
              {saving ? "Saving…" : "Submit"}
            </Button>
          }
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 0.5 }}>
            <TextField
              label="Post Date (MM/DD/YYYY)"
              type="date"
              value={form.postDate}
              onChange={(e) => setForm((f) => ({ ...f, postDate: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              fullWidth
              size="small"
              sx={portalModalFieldSx}
            />
            <TextField
              label="Message"
              multiline
              rows={6}
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              fullWidth
              required
              size="small"
              sx={portalModalFieldSx}
            />
            <FormControl fullWidth size="small" sx={portalModalFieldSx}>
              <InputLabel>Active</InputLabel>
              <Select
                value={form.active}
                label="Active"
                onChange={(e) => setForm((f) => ({ ...f, active: e.target.value }))}
              >
                <MenuItem value="0">No</MenuItem>
                <MenuItem value="1">Yes</MenuItem>
              </Select>
            </FormControl>
            <Typography variant="caption" color="text.secondary">* Required fields</Typography>
          </Box>
        </PortalDialog>

        <AppConfirmDialog
          open={deleteConfirm.open}
          onClose={() => setDeleteConfirm({ open: false, messageID: null })}
          onConfirm={handleDeleteConfirm}
          title="Delete Post Message"
          message="Do you want to delete this Post Message?"
          confirmLabel="Delete"
          confirmColor="error"
          icon={<DeleteIcon sx={{ fontSize: 20 }} />}
          loading={saving}
        />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
            {snackbar.message}
          </Alert>
        </Snackbar>
    </Box>
  );
};

export default PostMessage;
