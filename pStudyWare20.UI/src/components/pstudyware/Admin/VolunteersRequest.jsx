import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
  Grid,
  Paper,
} from "@mui/material";
import {
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import PortalDialog from "../Common/PortalDialog";
import AppConfirmDialog from "../Common/AppConfirmDialog";
import {
  portalModalFieldSx,
  portalModalSendButtonSx,
} from "../Common/portalModalStyles";
import { useAuth } from "../../../contexts/AuthContext";
import AdminHeader from "./AdminHeader";
import volunteersRequestService from "../../../services/volunteersRequestService";
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
  adminSessionListTableContainerSx,
  adminSessionListTableHeadCellSx,
  adminSessionListTableHeadRowSx,
  adminSessionListTitleSx,
  adminSessionListToolbarButtonSx,
  portalRoleSubheaderSpacerPx,
} from "../styles/applicationSurfaces";
import AdminSessionListPagination from "./AdminSessionListPagination";
import SortableHeader from "../Common/SortableHeader";
import studentWaitingListService from "../../../services/studentWaitingListService";

const volunteersRequestPageSx = {
  flex: 1,
  minHeight: 0,
  width: "100%",
  display: "flex",
  flexDirection: "column",
};

const volunteersRequestColumnWidths = {
  edit: "4%",
  delete: "4%",
  id: "5%",
  volunteerName: "10%",
  grade: "5%",
  location: "8%",
  school: "8%",
  phone: "7%",
  email: "10%",
  city: "6%",
  enrolledFor: "8%",
  interestedFor: "8%",
  status: "6%",
  requestedDate: "7%",
  comments: "8%",
};

const TYPE_OPTIONS = [
  { value: "P", label: "Primary Instructor" },
  { value: "S", label: "Secondary Instructor" },
  { value: "C", label: "Coordinator" },
  { value: "V", label: "Volunteers" },
];

const CLASS_OPTIONS = [
  { value: "JB", label: "Junior Beginner" },
  { value: "JI", label: "Junior Intermediate" },
  { value: "JA", label: "Junior Advanced" },
  { value: "SB", label: "Senior Beginner" },
  { value: "SI", label: "Senior Intermediate" },
  { value: "SA", label: "Senior Advanced" },
  { value: "DS", label: "Data Science" },
  { value: "AI", label: "Artificial Intelligence" },
  { value: "ST", label: "PSAT" },
  { value: "AT", label: "ACT" },
  { value: "GD", label: "Game Development" },
  { value: "AD", label: "App Development" },
  { value: "DM", label: "Data Management" },
];

// VolunteerInfo format: FirstName~#LastName~#Email~#ChapterID
function parseVolunteerInfo(str) {
  if (!str || typeof str !== "string") return {};
  const arr = str.split("~#");
  return {
    firstName: (arr[0] || "").trim(),
    lastName: (arr[1] || "").trim(),
    email: (arr[2] || "").trim(),
    chapterID: (arr[3] || "").trim(),
  };
}

const VolunteersRequest = () => {
  const { user, isAuthenticated } = useAuth();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chapterLocations, setChapterLocations] = useState([]);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    chapterID: "",
    type: "V",
    class: "",
    section: "A",
  });
  const [submitting, setSubmitting] = useState(false);
  const [orderBy, setOrderBy] = useState("volunteerID");
  const [order, setOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [goToPageInput, setGoToPageInput] = useState("1");
  const [searchBy, setSearchBy] = useState("ALL");
  const [searchCriteria, setSearchCriteria] = useState("contains");
  const [searchText, setSearchText] = useState("");
  const pageSize = 10;
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  const username = user?.email || user?.username || "";

  const loadList = async () => {
    if (!username) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await volunteersRequestService.getVolunteersRequest({ Username: username });
      const data = res?.volunteersRequest ?? res?.VolunteersRequest;
      if (res?.isSuccess && Array.isArray(data)) {
        setList(
          data.map((row) =>
            row && typeof row === "object"
              ? {
                  volunteerID: row.volunteerID ?? row.VolunteerID,
                  volunteerName: row.volunteerName ?? row.VolunteerName,
                  grade: row.grade ?? row.Grade,
                  location: row.location ?? row.Location,
                  school: row.school ?? row.School,
                  phone: row.phone ?? row.Phone,
                  email: row.email ?? row.Email,
                  city: row.city ?? row.City,
                  enrolledSession: row.enrolledSession ?? row.EnrolledSession,
                  interest: row.interest ?? row.Interest,
                  status: row.status ?? row.Status,
                  insertDate: row.insertDate ?? row.InsertDate,
                  comments: row.comments ?? row.Comments,
                  volunteerInfo: row.volunteerInfo ?? row.VolunteerInfo,
                }
              : null
          ).filter(Boolean)
        );
      } else {
        setList([]);
      }
    } catch (err) {
      console.error("Error loading volunteers request:", err);
      setSnackbar({
        open: true,
        message: err?.response?.data?.errorMessage ?? err?.message ?? "Error loading list.",
        severity: "error",
      });
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  const loadChapterLocations = async () => {
    try {
      const res = await studentWaitingListService.getChapterLocation({ Mode: "N" });
      const chapters = res?.chapterLocations ?? res?.ChapterLocations;
      if (res?.isSuccess && Array.isArray(chapters)) {
        setChapterLocations(chapters);
      }
    } catch (err) {
      console.error("Error loading chapter locations:", err);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setLoading(false);
      return;
    }
    loadList();
  }, [isAuthenticated, user]);

  useEffect(() => {
    loadChapterLocations();
  }, []);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    setCurrentPage(1);
    setGoToPageInput("1");
  };

  const handleSearch = () => {
    setCurrentPage(1);
    setGoToPageInput("1");
  };

  const handlePageChange = (page) => {
    const totalPages = Math.ceil((filteredAndSortedList?.length || 0) / pageSize);
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setGoToPageInput(String(page));
    }
  };

  const handleGoToPage = () => {
    const page = parseInt(goToPageInput, 10);
    const totalPages = Math.ceil((filteredAndSortedList?.length || 0) / pageSize);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    } else {
      setGoToPageInput(String(currentPage));
    }
  };

  const filteredAndSortedList = useMemo(() => {
    if (!list.length) return [];
    let filtered = list;
    if (searchBy !== "ALL" && searchText.trim()) {
      filtered = list.filter((row) => {
        let fieldValue = "";
        switch (searchBy) {
          case "VOLUNTEER_ID":
            fieldValue = (row.volunteerID ?? "").toString();
            break;
          case "NAME":
            fieldValue = row.volunteerName ?? "";
            break;
          case "EMAIL":
            fieldValue = row.email ?? "";
            break;
          case "STATUS":
            fieldValue = row.status ?? "";
            break;
          case "SCHOOL":
            fieldValue = row.school ?? "";
            break;
          default:
            return true;
        }
        fieldValue = String(fieldValue).toLowerCase();
        const search = searchText.trim().toLowerCase();
        if (searchCriteria === "equals") return fieldValue === search;
        if (searchCriteria === "starts_with") return fieldValue.startsWith(search);
        return fieldValue.includes(search);
      });
    }
    const key = orderBy;
    return [...filtered].sort((a, b) => {
      let aVal = a[key];
      let bVal = b[key];
      if (typeof aVal === "number" && typeof bVal === "number")
        return order === "asc" ? aVal - bVal : bVal - aVal;
      aVal = (aVal ?? "").toString();
      bVal = (bVal ?? "").toString();
      return order === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
  }, [list, orderBy, order, searchBy, searchCriteria, searchText]);

  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedList.slice(start, start + pageSize);
  }, [filteredAndSortedList, currentPage]);

  const totalPages = Math.ceil((filteredAndSortedList?.length || 0) / pageSize);
  const totalRecords = filteredAndSortedList?.length || 0;

  const handleEdit = (row) => {
    setSelectedRow(row);
    const parsed = parseVolunteerInfo(row.volunteerInfo);
    const nameParts = (row.volunteerName || "").split(" ");
    setForm({
      firstName: parsed.firstName || nameParts[0] || "",
      lastName: parsed.lastName || nameParts.slice(1).join(" ") || "",
      chapterID: parsed.chapterID || "",
      type: "V",
      class: "",
      section: "A",
    });
    setShowUpdateForm(true);
  };

  const handleCloseUpdateForm = () => {
    setShowUpdateForm(false);
    setSelectedRow(null);
    setForm({
      firstName: "",
      lastName: "",
      chapterID: "",
      type: "V",
      class: "",
      section: "A",
    });
  };

  const handleDeleteClick = (row) => {
    setSelectedRow(row);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedRow?.volunteerID) return;
    setSubmitting(true);
    try {
      const res = await volunteersRequestService.deleteVolunteerRequest({
        RequestID: String(selectedRow.volunteerID),
      });
      if (res?.isSuccess) {
        setSnackbar({ open: true, message: res.message || "Deleted successfully.", severity: "success" });
        setDeleteConfirmOpen(false);
        setSelectedRow(null);
        loadList();
      } else {
        setSnackbar({ open: true, message: res?.errorMessage || "Delete failed.", severity: "error" });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: err?.response?.data?.errorMessage || "Delete failed.",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateSubmit = async () => {
    if (!selectedRow) return;
    setSubmitting(true);
    try {
      const res = await volunteersRequestService.updateVolunteerStatus({
        VolundeerID: String(selectedRow.volunteerID),
        ChapterID: form.chapterID,
        Class: form.class,
        Section: form.section,
        Type: form.type,
      });
      if (res?.isSuccess) {
        setSnackbar({ open: true, message: res.message || "Volunteer approved successfully.", severity: "success" });
        handleCloseUpdateForm();
        loadList();
      } else {
        setSnackbar({ open: true, message: res?.errorMessage || "Update failed.", severity: "error" });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: err?.response?.data?.errorMessage || "Update failed.",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      await volunteersRequestService.exportToExcel({ Username: username });
      setSnackbar({ open: true, message: "Export downloaded.", severity: "success" });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err?.message || "Export failed.",
        severity: "error",
      });
    }
  };

  const formatDate = (d) => {
    if (!d) return "";
    const date = typeof d === "string" ? new Date(d) : d;
    return isNaN(date.getTime()) ? d : date.toLocaleDateString();
  };

  return (
    <Box sx={volunteersRequestPageSx}>
      <AdminHeader user={user} />
      <Box sx={{ height: `${portalRoleSubheaderSpacerPx}px` }} />
      <Container maxWidth="xl" sx={{ mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={adminSessionListPanelCardSx}>
              <CardContent sx={adminSessionListPanelContentSx}>
                <Box sx={adminSessionListHeaderBarSx}>
                  <Typography variant="subtitle1" sx={adminSessionListTitleSx}>
                    Volunteers Request
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      startIcon={<DownloadIcon />}
                      onClick={handleExportExcel}
                      sx={adminSessionListToolbarButtonSx}
                    >
                      Export Excel
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      startIcon={<RefreshIcon />}
                      onClick={loadList}
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
                          <MenuItem value="VOLUNTEER_ID" sx={adminSessionListMenuItemSx}>
                            #
                          </MenuItem>
                          <MenuItem value="NAME" sx={adminSessionListMenuItemSx}>
                            Name
                          </MenuItem>
                          <MenuItem value="EMAIL" sx={adminSessionListMenuItemSx}>
                            Email
                          </MenuItem>
                          <MenuItem value="STATUS" sx={adminSessionListMenuItemSx}>
                            Status
                          </MenuItem>
                          <MenuItem value="SCHOOL" sx={adminSessionListMenuItemSx}>
                            School
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

                    <TableContainer component={Paper} sx={adminSessionListTableContainerSx}>
                      <Table sx={adminSessionListGridTableSx} size="small">
                        <TableHead>
                          <TableRow sx={adminSessionListTableHeadRowSx}>
                            <TableCell
                              sx={adminSessionListTableHeadCellSx(volunteersRequestColumnWidths.edit)}
                            >
                              Edit
                            </TableCell>
                            <TableCell
                              sx={adminSessionListTableHeadCellSx(volunteersRequestColumnWidths.delete)}
                            >
                              Delete
                            </TableCell>
                            <SortableHeader label="#" field="volunteerID" sortField={orderBy} sortOrder={order} onSort={handleSort} headCellSx={adminSessionListTableHeadCellSx(volunteersRequestColumnWidths.id)} />
                            <SortableHeader label="Volunteer Name" field="volunteerName" sortField={orderBy} sortOrder={order} onSort={handleSort} headCellSx={adminSessionListTableHeadCellSx(volunteersRequestColumnWidths.volunteerName)} />
                            <SortableHeader label="Grade" field="grade" sortField={orderBy} sortOrder={order} onSort={handleSort} headCellSx={adminSessionListTableHeadCellSx(volunteersRequestColumnWidths.grade)} />
                            <SortableHeader label="Location" field="location" sortField={orderBy} sortOrder={order} onSort={handleSort} headCellSx={adminSessionListTableHeadCellSx(volunteersRequestColumnWidths.location)} />
                            <SortableHeader label="School" field="school" sortField={orderBy} sortOrder={order} onSort={handleSort} headCellSx={adminSessionListTableHeadCellSx(volunteersRequestColumnWidths.school)} />
                            <SortableHeader label="Phone" field="phone" sortField={orderBy} sortOrder={order} onSort={handleSort} headCellSx={adminSessionListTableHeadCellSx(volunteersRequestColumnWidths.phone)} />
                            <SortableHeader label="Email" field="email" sortField={orderBy} sortOrder={order} onSort={handleSort} headCellSx={adminSessionListTableHeadCellSx(volunteersRequestColumnWidths.email)} />
                            <SortableHeader label="City" field="city" sortField={orderBy} sortOrder={order} onSort={handleSort} headCellSx={adminSessionListTableHeadCellSx(volunteersRequestColumnWidths.city)} />
                            <SortableHeader label="Enrolled For" field="enrolledSession" sortField={orderBy} sortOrder={order} onSort={handleSort} headCellSx={adminSessionListTableHeadCellSx(volunteersRequestColumnWidths.enrolledFor)} />
                            <SortableHeader label="Interested For" field="interest" sortField={orderBy} sortOrder={order} onSort={handleSort} headCellSx={adminSessionListTableHeadCellSx(volunteersRequestColumnWidths.interestedFor)} />
                            <SortableHeader label="Status" field="status" sortField={orderBy} sortOrder={order} onSort={handleSort} headCellSx={adminSessionListTableHeadCellSx(volunteersRequestColumnWidths.status)} />
                            <SortableHeader label="Requested Date" field="insertDate" sortField={orderBy} sortOrder={order} onSort={handleSort} headCellSx={adminSessionListTableHeadCellSx(volunteersRequestColumnWidths.requestedDate)} />
                            <SortableHeader label="Comments" field="comments" sortField={orderBy} sortOrder={order} onSort={handleSort} headCellSx={adminSessionListTableHeadCellSx(volunteersRequestColumnWidths.comments, true)} />
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {paginatedList.length > 0 ? (
                            paginatedList.map((row) => (
                              <TableRow key={row.volunteerID} sx={adminSessionListTableBodyRowSx}>
                                <TableCell sx={adminSessionListTableBodyCellSx({ action: true })}>
                                  <Box onClick={() => handleEdit(row)} sx={adminSessionListTableActionLinkSx}>
                                    Edit
                                  </Box>
                                </TableCell>
                                <TableCell sx={adminSessionListTableBodyCellSx({ action: true })}>
                                  <Box
                                    onClick={() => handleDeleteClick(row)}
                                    sx={adminSessionListTableActionLinkSx}
                                  >
                                    Delete
                                  </Box>
                                </TableCell>
                                <TableCell sx={adminSessionListTableBodyCellSx()}>
                                  {row.volunteerID ?? "—"}
                                </TableCell>
                                <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
                                  <Tooltip title={row.volunteerName ?? "—"}>
                                    <span>{row.volunteerName ?? "—"}</span>
                                  </Tooltip>
                                </TableCell>
                                <TableCell sx={adminSessionListTableBodyCellSx()}>
                                  {row.grade ?? "—"}
                                </TableCell>
                                <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
                                  <Tooltip title={row.location ?? "—"}>
                                    <span>{row.location ?? "—"}</span>
                                  </Tooltip>
                                </TableCell>
                                <TableCell sx={adminSessionListTableBodyCellSx()}>
                                  {row.school ?? "—"}
                                </TableCell>
                                <TableCell sx={adminSessionListTableBodyCellSx()}>
                                  {row.phone ?? "—"}
                                </TableCell>
                                <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
                                  <Tooltip title={row.email ?? "—"}>
                                    <span>{row.email ?? "—"}</span>
                                  </Tooltip>
                                </TableCell>
                                <TableCell sx={adminSessionListTableBodyCellSx()}>
                                  {row.city ?? "—"}
                                </TableCell>
                                <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
                                  <Tooltip title={row.enrolledSession ?? "—"}>
                                    <span>{row.enrolledSession ?? "—"}</span>
                                  </Tooltip>
                                </TableCell>
                                <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
                                  <Tooltip title={row.interest ?? "—"}>
                                    <span>{row.interest ?? "—"}</span>
                                  </Tooltip>
                                </TableCell>
                                <TableCell sx={adminSessionListTableBodyCellSx()}>
                                  {row.status ?? "—"}
                                </TableCell>
                                <TableCell sx={adminSessionListTableBodyCellSx()}>
                                  {formatDate(row.insertDate) || "—"}
                                </TableCell>
                                <TableCell sx={adminSessionListTableBodyCellSx({ isLast: true })}>
                                  {row.comments ?? "—"}
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={15} align="center" sx={adminSessionListEmptyCellSx}>
                                <Typography variant="body2" color="textSecondary" sx={adminSessionListEmptyTextSx}>
                                  {searchText
                                    ? "No records found matching your search."
                                    : "No records found."}
                                </Typography>
                              </TableCell>
                            </TableRow>
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
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <PortalDialog
        open={showUpdateForm && !!selectedRow}
        onClose={handleCloseUpdateForm}
        maxWidth="md"
        disableClose={submitting}
        title="Update Volunteer Request Status"
        icon={<EditIcon sx={{ fontSize: 20 }} />}
        actions={
          <Button
            variant="contained"
            onClick={handleUpdateSubmit}
            disabled={submitting}
            sx={portalModalSendButtonSx}
          >
            {submitting ? "Submitting…" : "Submit"}
          </Button>
        }
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="First Name"
              value={form.firstName}
              onChange={(e) =>
                setForm((f) => ({ ...f, firstName: e.target.value }))
              }
              sx={portalModalFieldSx}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="Last Name"
              value={form.lastName}
              onChange={(e) =>
                setForm((f) => ({ ...f, lastName: e.target.value }))
              }
              sx={portalModalFieldSx}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth size="small" sx={portalModalFieldSx}>
              <InputLabel>Chapter</InputLabel>
              <Select
                value={form.chapterID}
                label="Chapter"
                onChange={(e) =>
                  setForm((f) => ({ ...f, chapterID: e.target.value }))
                }
              >
                {chapterLocations.map((ch) => {
                  const id = ch.chapterID ?? ch.ChapterID ?? "";
                  const name = ch.chapterName ?? ch.ChapterName ?? "";
                  const loc = ch.location ?? ch.Location ?? "";
                  return (
                    <MenuItem key={id} value={id}>
                      {name} - {loc}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth size="small" sx={portalModalFieldSx}>
              <InputLabel>Type</InputLabel>
              <Select
                value={form.type}
                label="Type"
                onChange={(e) =>
                  setForm((f) => ({ ...f, type: e.target.value }))
                }
              >
                {TYPE_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small" sx={portalModalFieldSx}>
              <InputLabel>Class</InputLabel>
              <Select
                value={form.class}
                label="Class"
                onChange={(e) =>
                  setForm((f) => ({ ...f, class: e.target.value }))
                }
              >
                {CLASS_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small" sx={portalModalFieldSx}>
              <InputLabel>Section</InputLabel>
              <Select
                value={form.section}
                label="Section"
                onChange={(e) =>
                  setForm((f) => ({ ...f, section: e.target.value }))
                }
              >
                <MenuItem value="A">A</MenuItem>
                <MenuItem value="B">B</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </PortalDialog>

      <AppConfirmDialog
        open={deleteConfirmOpen}
        onClose={() => {
          if (!submitting) {
            setDeleteConfirmOpen(false);
          }
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete volunteer request"
        message="Do you want to delete this volunteer request?"
        confirmLabel="Delete"
        confirmColor="error"
        icon={<DeleteIcon sx={{ fontSize: 20 }} />}
        loading={submitting}
      />

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

export default VolunteersRequest;
