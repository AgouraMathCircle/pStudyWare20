import React, { useState, useEffect } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Grid,
} from "@mui/material";
import { Refresh as RefreshIcon, Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Save as SaveIcon } from "@mui/icons-material";
import { useAuth } from "../../../contexts/AuthContext";
import AdminHeader from "./AdminHeader";
import postMessageService from "../../../services/postMessageService";

// Normalize API response to array of items (handles PostMessageListResponse or legacy shapes)
function normalizeAlertList(res) {
  if (Array.isArray(res)) return res;
  const list = res?.postMessages ?? res?.PostMessages ?? res?.table ?? res?.Table;
  if (Array.isArray(list)) return list;
  if (list && typeof list === "object" && !Array.isArray(list)) return [];
  return [];
}

// Get display fields from a row (legacy uses AlertDate, Description; API uses same + Message)
function rowDisplay(row) {
  return {
    messageID: row.MessageID ?? row.messageID ?? row.MessageId,
    rowID: row.RowID ?? row.rowID ?? row.RowId,
    postDate: row.AlertDate ?? row.alertDate ?? row.PostedDate ?? row.postedDate ?? "",
    message: row.Description ?? row.description ?? row.Message ?? row.message ?? "",
    active: row.Active === true || row.active === true || row.Active === "1" || row.active === "1",
  };
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

  const username = user?.email || user?.username || "";

  const loadAlertList = async () => {
    setLoading(true);
    try {
      const res = await postMessageService.getAlertList({ RowID: "" });
      const data = typeof res === "string" ? (() => { try { return JSON.parse(res); } catch { return res; } })() : res;
      const list = normalizeAlertList(data);
      setAlertList(list);
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

  const cellPadding = "0 8px";

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AdminHeader />
      <Container maxWidth="xl" sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box>
              {/* Header: title + buttons */}
              <Box sx={{ height: "25px" }} />
              <Box
                sx={{
                  mb: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "#4caf50", fontSize: "1rem" }}
                >
                  Post Message List
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={openAdd}
                    disabled={loading}
                    sx={{ fontSize: "0.75rem", px: 1.5, py: 0.25 }}
                  >
                    Add Post Message
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<RefreshIcon />}
                    onClick={loadAlertList}
                    disabled={loading}
                    sx={{ fontSize: "0.75rem", px: 1.5, py: 0.25 }}
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
                <Table
                  sx={{
                    width: "100%",
                    tableLayout: "fixed",
                    "& .MuiTableCell-root": { paddingTop: 0, paddingBottom: 0 },
                  }}
                  size="small"
                >
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#e8f5e8" }}>
                      <TableCell
                        align="center"
                        sx={{
                          fontWeight: 400,
                          borderRight: "1px solid #4caf50",
                          width: "5%",
                          fontSize: "0.75rem",
                          padding: cellPadding,
                        }}
                      >
                        Row #
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{
                          fontWeight: 400,
                          borderRight: "1px solid #4caf50",
                          width: "12%",
                          fontSize: "0.75rem",
                          padding: cellPadding,
                        }}
                      >
                        Post Date
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{
                          fontWeight: 400,
                          borderRight: "1px solid #4caf50",
                          width: "36%",
                          fontSize: "0.75rem",
                          padding: cellPadding,
                        }}
                      >
                        Post Message
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{
                          fontWeight: 400,
                          borderRight: "1px solid #4caf50",
                          width: "8%",
                          fontSize: "0.75rem",
                          padding: cellPadding,
                        }}
                      >
                        Active
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          fontWeight: 400,
                          borderRight: "1px solid #4caf50",
                          width: "5%",
                          fontSize: "0.75rem",
                          padding: cellPadding,
                        }}
                      >
                        Edit
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          fontWeight: 400,
                          width: "5%",
                          fontSize: "0.75rem",
                          padding: cellPadding,
                        }}
                      >
                        Delete
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {alertList.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          align="center"
                          sx={{
                            fontSize: "0.75rem",
                            padding: cellPadding,
                            py: 3,
                          }}
                        >
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            sx={{ fontSize: "0.75rem" }}
                          >
                            No post messages. Click &quot;Add Post Message&quot; to create one.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      alertList.map((row, index) => {
                        const d = rowDisplay(row);
                        return (
                          <TableRow
                            key={d.messageID ?? d.rowID ?? index}
                            hover
                            sx={{
                              "&:nth-of-type(odd)": {
                                backgroundColor: "#f9f9f9",
                              },
                            }}
                          >
                            <TableCell
                              align="center"
                              sx={{
                                borderRight: "1px solid #4caf50",
                                fontSize: "0.75rem",
                                padding: cellPadding,
                              }}
                            >
                              {d.rowID ?? index + 1}
                            </TableCell>
                            <TableCell
                              align="left"
                              sx={{
                                borderRight: "1px solid #4caf50",
                                fontSize: "0.75rem",
                                padding: cellPadding,
                              }}
                            >
                              {d.postDate}
                            </TableCell>
                            <TableCell
                              align="left"
                              sx={{
                                borderRight: "1px solid #4caf50",
                                fontSize: "0.75rem",
                                padding: cellPadding,
                                maxWidth: 400,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {d.message}
                            </TableCell>
                            <TableCell
                              align="left"
                              sx={{
                                borderRight: "1px solid #4caf50",
                                fontSize: "0.75rem",
                                padding: cellPadding,
                              }}
                            >
                              {d.active ? "Yes" : "No"}
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{
                                borderRight: "1px solid #4caf50",
                                fontSize: "0.75rem",
                                padding: cellPadding,
                                verticalAlign: "middle",
                              }}
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
                              sx={{
                                fontSize: "0.75rem",
                                padding: cellPadding,
                                verticalAlign: "middle",
                              }}
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
                </>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>

        <Dialog open={formOpen} onClose={closeForm} maxWidth="sm" fullWidth>
          <DialogTitle>{editingId ? "Update Post Message" : "Add Post Message"}</DialogTitle>
          <DialogContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
              <TextField
                label="Post Date (MM/DD/YYYY)"
                type="date"
                value={form.postDate}
                onChange={(e) => setForm((f) => ({ ...f, postDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                label="Message"
                multiline
                rows={6}
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                fullWidth
                required
              />
              <FormControl fullWidth>
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
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={closeForm}>Cancel</Button>
            <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSubmit} disabled={saving}>
              Submit
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={deleteConfirm.open} onClose={() => setDeleteConfirm({ open: false, messageID: null })}>
          <DialogTitle>Delete Post Message</DialogTitle>
          <DialogContent>
            <Typography>Do you want to delete this Post Message?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirm({ open: false, messageID: null })}>Cancel</Button>
            <Button variant="contained" color="error" onClick={handleDeleteConfirm}>Delete</Button>
          </DialogActions>
        </Dialog>

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
