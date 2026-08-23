import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
import PortalModalSelect from "../Common/PortalModalSelect";
import AppConfirmDialog from "../Common/AppConfirmDialog";
import {
  portalModalFieldSx,
  portalModalSendButtonSx,
} from "../Common/portalModalStyles";
import { useAuth } from "../../../contexts/AuthContext";
import SystemAdminHeader, { SystemAdminRoleHeaderSpacer } from "./SystemAdminHeader";
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
  adminSessionListTableDeleteLinkSx,
  adminSessionListTableBodyCellSx,
  adminSessionListTableBodyRowSx,
  adminSessionListTableHeadCellSx,
  adminSessionListTableHeadRowSx,
  adminSessionListTitleSx,
  portalHeaderActionButtonSx,
} from "../styles/applicationSurfaces";
import SystemAdminSessionListPagination from "./SystemAdminSessionListPagination";
import SortableHeader from "../Common/SortableHeader";
import { getSystemAdminPortalBase } from "../../../utils/systemAdminPortalPaths";
import "../../../styles/SystemAdminVolunteersRequest.css";

const volunteersRequestPageSx = {
  flex: 1,
  minHeight: 0,
  width: "100%",
  display: "flex",
  flexDirection: "column",
};

/** Legacy UpdateClass: name/email display only — not posted to AMC_spUpdateVolunteerStatus. */
const volunteersRequestReadOnlyFieldSx = {
  ...portalModalFieldSx,
  "& .MuiOutlinedInput-root": {
    width: "100%",
    maxWidth: "100%",
    minHeight: 40,
    height: "auto",
    display: "flex",
    alignItems: "center",
  },
  "& .MuiInputBase-input": {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    lineHeight: 1.4375,
    paddingTop: "8.5px",
    paddingBottom: "8.5px",
  },
  "& .MuiInputBase-root.Mui-disabled": {
    backgroundColor: "rgba(0, 0, 0, 0.04)",
  },
  "& .MuiInputLabel-root.Mui-disabled": {
    color: "text.secondary",
  },
};

/** Truncated selected value — keeps Select width stable when options are long. */
const volunteersRequestModalSelectDisplaySx = {
  display: "block",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  width: "100%",
  maxWidth: "100%",
  boxSizing: "border-box",
};

/** Fixed legend width per label — prevents notch/label resize and "Section" clipping to "SE". */
const volunteersRequestModalSelectLegendWidths = {
  chapter: "4.85rem",
  type: "2.55rem",
  class: "2.85rem",
  section: "5.35rem",
};

const volunteersRequestModalSelectFieldSx = (legendKey) => ({
  ...portalModalFieldSx,
  width: "100%",
  minWidth: 0,
  maxWidth: "100%",
  "& .MuiOutlinedInput-root": {
    width: "100%",
    maxWidth: "100%",
    minHeight: 40,
    height: "auto",
    display: "flex",
    alignItems: "center",
  },
  "& .MuiSelect-select": {
    ...volunteersRequestModalSelectDisplaySx,
    lineHeight: 1.4375,
    paddingTop: "8.5px",
    paddingBottom: "8.5px",
    paddingRight: "32px",
    display: "flex",
    alignItems: "center",
  },
  "& .MuiOutlinedInput-notchedOutline legend": {
    width: volunteersRequestModalSelectLegendWidths[legendKey],
    maxWidth: volunteersRequestModalSelectLegendWidths[legendKey],
  },
  "& .MuiOutlinedInput-notchedOutline legend span": {
    paddingLeft: "4px",
    paddingRight: "4px",
  },
});

/** Chapter options are long — lock width so the control never grows; allow full text height inside. */
const volunteersRequestChapterFieldSx = {
  ...volunteersRequestModalSelectFieldSx("chapter"),
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
  flexShrink: 0,
  "& .MuiOutlinedInput-root": {
    width: "100%",
    maxWidth: "100%",
    minWidth: "100%",
    minHeight: 40,
    height: "auto",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
  },
  "& .MuiSelect-select": {
    ...volunteersRequestModalSelectDisplaySx,
    width: "100% !important",
    maxWidth: "100% !important",
    minWidth: "0 !important",
    lineHeight: 1.4375,
    paddingTop: "8.5px !important",
    paddingBottom: "8.5px !important",
    paddingLeft: "14px !important",
    paddingRight: "32px !important",
    display: "flex !important",
    alignItems: "center !important",
  },
  "& .MuiSelect-icon": {
    flexShrink: 0,
  },
};

const volunteersRequestModalPaperSx = {
  width: "100%",
  maxWidth: "520px !important",
};

const volunteersRequestModalContentSx = {
  overflow: "hidden",
  minWidth: 0,
  width: "100%",
  maxWidth: "100%",
  boxSizing: "border-box",
};

function getVolunteerChapterLabel(chapterID, chapterLocations) {
  const id = String(chapterID ?? "").trim();
  if (!id) return "";
  const match = chapterLocations.find(
    (ch) => String(ch.chapterID ?? ch.ChapterID ?? "") === id,
  );
  if (!match) return `Chapter ${id}`;

  const label = match.label ?? match.Label;
  if (label) return String(label).trim();

  const name = match.name ?? match.Name ?? match.chapterName ?? match.ChapterName ?? "";
  const loc = match.location ?? match.Location ?? "";
  const city = match.city ?? match.City ?? "";
  return [name, loc, city].map((p) => String(p || "").trim()).filter(Boolean).join(" - ");
}

function renderVolunteerSelectDisplayValue(label, { placeholder = false } = {}) {
  const text = label || "\u00a0";
  return (
    <Box
      component="span"
      sx={{
        ...volunteersRequestModalSelectDisplaySx,
        lineHeight: 1.4375,
        ...(placeholder ? { color: "text.secondary", fontStyle: "italic" } : {}),
      }}
      title={label || ""}
    >
      {text}
    </Box>
  );
}

function renderVolunteerChapterSelectValue(selected, chapterLocations) {
  const id = String(selected ?? "").trim();
  if (!id) {
    return renderVolunteerSelectDisplayValue("Select chapter", { placeholder: true });
  }
  return renderVolunteerSelectDisplayValue(
    getVolunteerChapterLabel(id, chapterLocations),
  );
}

const volunteersRequestColumnWidths = {
  action: "8%",
  status: "8%",
  id: "4%",
  volunteerName: "10%",
  grade: "5%",
  location: "8%",
  school: "8%",
  phone: "7%",
  email: "10%",
  city: "6%",
  enrolledFor: "7%",
  interestedFor: "7%",
  requestedDate: "6%",
  comments: "12%",
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
  { value: "ED", label: "Engineering Design" },  
];

function getVolunteerClassLabel(classCode) {
  const code = String(classCode ?? "").trim();
  return CLASS_OPTIONS.find((opt) => opt.value === code)?.label ?? code;
}

function getVolunteerTypeLabel(typeCode) {
  const code = String(typeCode ?? "").trim();
  return TYPE_OPTIONS.find((opt) => opt.value === code)?.label ?? code;
}

function getVolunteerSectionLabel(sectionCode) {
  const code = String(sectionCode ?? "").trim().toUpperCase();
  return code === "B" ? "B" : "A";
}

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

/** Legacy VolunteersRequest.aspx — Type dropdown default + Interest hint. */
function resolveVolunteerTypeFromInterest(interest) {
  const text = (interest || "").trim().toLowerCase();
  if (text.includes("coordinator")) return "C";
  if (text.includes("primary")) return "P";
  if (text.includes("secondary")) return "S";
  return "P";
}

/** Legacy ddlClass first item (Junior Beginner) when opening UpdateClass. */
function resolveVolunteerClassCode() {
  return CLASS_OPTIONS[0]?.value || "JB";
}

function buildVolunteerUpdateFormFromRow(row) {
  const parsed = parseVolunteerInfo(row?.volunteerInfo);
  const nameParts = (row?.volunteerName || "").trim().split(/\s+/);
  const classCode = resolveVolunteerClassCode();
  return {
    firstName: parsed.firstName || nameParts[0] || "",
    lastName: parsed.lastName || nameParts.slice(1).join(" ") || "",
    chapterID: String(parsed.chapterID ?? "").trim(),
    type: resolveVolunteerTypeFromInterest(row?.interest),
    class: classCode,
    section: "A",
  };
}

async function copyTextToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  document.body.removeChild(textarea);
  return copied;
}

const DUPLICATE_STATUS_PATTERN = /^Duplicate[:\s]*(\d+)/i;

function parseDuplicateStatusId(status) {
  const text = String(status ?? "").trim();
  const match = text.match(DUPLICATE_STATUS_PATTERN);
  return match ? match[1] : null;
}

function buildInstructorSearchPath(instructorId) {
  const base = getSystemAdminPortalBase(
    typeof window !== "undefined" ? window.location.pathname : "",
  );
  return `${base}/instructor?searchBy=INSTRUCTOR_ID&searchCriteria=equals&searchText=${encodeURIComponent(instructorId)}&from=volunteers-request`;
}

const VolunteersRequestStatusCell = ({ value }) => {
  const navigate = useNavigate();
  const display =
    value == null || value === "" ? "—" : String(value).trim() || "—";
  const duplicateId = parseDuplicateStatusId(display);

  if (!duplicateId) {
    return (
      <Tooltip title={display}>
        <Box
          component="span"
          sx={{
            display: "block",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "100%",
          }}
        >
          {display}
        </Box>
      </Tooltip>
    );
  }

  const linkPath = buildInstructorSearchPath(duplicateId);

  return (
    <Tooltip title={`View instructor #${duplicateId}`}>
      <Box
        component="span"
        className="vr-status-duplicate"
        sx={{
          display: "inline-flex",
          alignItems: "center",
          flexWrap: "nowrap",
          whiteSpace: "nowrap",
        }}
      >
        <Box component="span">Duplicate:</Box>
        <Box
          component="span"
          onClick={(event) => {
            event.stopPropagation();
            navigate(linkPath);
          }}
          sx={adminSessionListTableActionLinkSx}
        >
          {duplicateId}
        </Box>
      </Box>
    </Tooltip>
  );
};

const VolunteersRequestCopyCell = ({ value, onCopied }) => {
  const display =
    value == null || value === "" ? "—" : String(value).trim() || "—";
  const canCopy = display !== "—";

  const handleClick = async (event) => {
    event.stopPropagation();
    if (!canCopy) return;
    try {
      const copied = await copyTextToClipboard(display);
      if (copied) {
        onCopied?.(display);
      }
    } catch {
      // ignore copy failures
    }
  };

  return (
    <Tooltip title={canCopy ? `${display} (click to copy)` : display}>
      <Box
        component="span"
        onClick={handleClick}
        sx={{
          display: "block",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          maxWidth: "100%",
          cursor: canCopy ? "pointer" : "default",
        }}
      >
        {display}
      </Box>
    </Tooltip>
  );
};

const VolunteersRequest = () => {
  const { user, isAuthenticated } = useAuth();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chapterLocations, setChapterLocations] = useState([]);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [form, setForm] = useState(() => buildVolunteerUpdateFormFromRow(null));
  const [submitting, setSubmitting] = useState(false);
  const [orderBy, setOrderBy] = useState("insertDate");
  const [order, setOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [goToPageInput, setGoToPageInput] = useState("1");
  const [searchBy, setSearchBy] = useState("ALL");
  const [searchCriteria, setSearchCriteria] = useState("contains");
  const [searchText, setSearchText] = useState("");
  const pageSize = 25;
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const username = user?.email || user?.username || "";

  const loadList = async () => {
    if (!username) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await volunteersRequestService.getVolunteersRequest({
        Username: username,
      });
      const data = res?.volunteersRequest ?? res?.VolunteersRequest;
      if (res?.isSuccess && Array.isArray(data)) {
        setList(
          data
            .map((row) =>
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
                : null,
            )
            .filter(Boolean),
        );
      } else {
        setList([]);
      }
    } catch (err) {
      console.error("Error loading volunteers request:", err);
      setSnackbar({
        open: true,
        message:
          err?.response?.data?.errorMessage ??
          err?.message ??
          "Error loading list.",
        severity: "error",
      });
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  const loadChapterLocations = async () => {
    try {
      const res = await volunteersRequestService.getChapterLocations();
      const chapters = res?.chapterLocations ?? res?.ChapterLocations;
      if (res?.isSuccess !== false && Array.isArray(chapters)) {
        setChapterLocations(chapters);
      } else {
        setChapterLocations([]);
        if (res?.errorMessage || res?.ErrorMessage) {
          console.error("Error loading chapter locations:", res?.errorMessage ?? res?.ErrorMessage);
        }
      }
    } catch (err) {
      console.error("Error loading chapter locations:", err);
      setChapterLocations([]);
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

  /** Legacy kGrid: first header click DESC, same column toggles ASC/DESC. */
  const handleSort = (property) => {
    if (orderBy === property) {
      setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setOrderBy(property);
      setOrder("desc");
    }
    setCurrentPage(1);
    setGoToPageInput("1");
  };

  const handleSearch = () => {
    setCurrentPage(1);
    setGoToPageInput("1");
  };

  const handlePageChange = (page) => {
    const totalPages = Math.ceil(
      (filteredAndSortedList?.length || 0) / pageSize,
    );
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setGoToPageInput(String(page));
    }
  };

  const handleGoToPage = () => {
    const page = parseInt(goToPageInput, 10);
    const totalPages = Math.ceil(
      (filteredAndSortedList?.length || 0) / pageSize,
    );
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
        if (searchCriteria === "starts_with")
          return fieldValue.startsWith(search);
        return fieldValue.includes(search);
      });
    }
    const key = orderBy;
    return [...filtered].sort((a, b) => {
      let aVal = a[key];
      let bVal = b[key];

      if (key === "volunteerID") {
        const aNum = Number(aVal);
        const bNum = Number(bVal);
        if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) {
          return order === "asc" ? aNum - bNum : bNum - aNum;
        }
      }

      if (key === "insertDate") {
        const aTime = aVal ? new Date(aVal).getTime() : 0;
        const bTime = bVal ? new Date(bVal).getTime() : 0;
        if (!Number.isNaN(aTime) && !Number.isNaN(bTime)) {
          return order === "asc" ? aTime - bTime : bTime - aTime;
        }
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return order === "asc" ? aVal - bVal : bVal - aVal;
      }
      aVal = (aVal ?? "").toString();
      bVal = (bVal ?? "").toString();
      return order === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
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
    setForm(buildVolunteerUpdateFormFromRow(row));
    setShowUpdateForm(true);
  };

  const handleCloseUpdateForm = () => {
    setShowUpdateForm(false);
    setSelectedRow(null);
    setForm(buildVolunteerUpdateFormFromRow(null));
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
        setSnackbar({
          open: true,
          message: res.message || "Deleted successfully.",
          severity: "success",
        });
        setDeleteConfirmOpen(false);
        setSelectedRow(null);
        loadList();
      } else {
        setSnackbar({
          open: true,
          message: res?.errorMessage || "Delete failed.",
          severity: "error",
        });
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

    if (!form.chapterID) {
      setSnackbar({
        open: true,
        message: "Please select a chapter.",
        severity: "error",
      });
      return;
    }
    if (!form.class) {
      setSnackbar({
        open: true,
        message: "Please select a class.",
        severity: "error",
      });
      return;
    }

    setSubmitting(true);
    try {
      // Match legacy VolunteersRequest.aspx.cs btnSubmit_Click + AMC_spUpdateVolunteerStatus params.
      const payload = {
        VolundeerID: String(selectedRow.volunteerID ?? ""),
        ChapterID: String(form.chapterID ?? "").trim(),
        Class: String(form.class ?? "").trim(),
        Section: String(form.section ?? "A").trim(),
        Type: String(form.type ?? "V").trim(),
      };
      const res = await volunteersRequestService.updateVolunteerStatus(payload);
      const ok = res?.isSuccess === true || res?.IsSuccess === true;
      if (ok) {
        // Google Workspace group sync (add to the selected chapter's VolunteerEmailGroup)
        // now happens server-side in VolunteersRequestService.UpdateVolunteerStatusAsync.
        setSnackbar({
          open: true,
          message:
            res?.message ||
            res?.Message ||
            "Volunteer has approved successfully.",
          severity: "success",
        });
        handleCloseUpdateForm();
        loadList();
      } else {
        setSnackbar({
          open: true,
          message:
            res?.errorMessage || res?.ErrorMessage || "Update failed.",
          severity: "error",
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message:
          err?.response?.data?.errorMessage ||
          err?.response?.data?.ErrorMessage ||
          err?.message ||
          "Update failed.",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      await volunteersRequestService.exportToExcel({ Username: username });
      setSnackbar({
        open: true,
        message: "Export downloaded.",
        severity: "success",
      });
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

  const handleCellCopy = () => {
    setSnackbar({
      open: true,
      message: "Copied to clipboard",
      severity: "success",
    });
  };

  const renderCopyCell = (value, { isLast = false } = {}) => (
    <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true, isLast })}>
      <VolunteersRequestCopyCell value={value} onCopied={handleCellCopy} />
    </TableCell>
  );

  const selectedVolunteerEmail =
    selectedRow?.email ||
    parseVolunteerInfo(selectedRow?.volunteerInfo).email ||
    "";

  const chapterSelectIds = useMemo(
    () =>
      chapterLocations.map((ch) => String(ch.chapterID ?? ch.ChapterID ?? "")),
    [chapterLocations],
  );

  return (
    <Box className="admin-volunteers-request" sx={volunteersRequestPageSx}>
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
                    Volunteers Request
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      startIcon={<DownloadIcon />}
                      onClick={handleExportExcel}
                      sx={portalHeaderActionButtonSx}
                    >
                      Export Excel
                    </Button>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      startIcon={<RefreshIcon />}
                      onClick={loadList}
                      disabled={loading}
                      sx={portalHeaderActionButtonSx}
                    >
                      Refresh
                    </Button>
                  </Box>
                </Box>

                <Box className="admin-volunteers-request-table-panel">
                  <Box sx={adminSessionListSearchBarSx}>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <Typography sx={adminSessionListSearchLabelSx}>
                        Search By:
                      </Typography>
                      <Select
                        value={searchBy}
                        onChange={(e) => setSearchBy(e.target.value)}
                        size="small"
                        sx={adminSessionListSearchSelectSx}
                      >
                        <MenuItem value="ALL" sx={adminSessionListMenuItemSx}>
                          -ALL-
                        </MenuItem>
                        <MenuItem
                          value="VOLUNTEER_ID"
                          sx={adminSessionListMenuItemSx}
                        >
                          #
                        </MenuItem>
                        <MenuItem value="NAME" sx={adminSessionListMenuItemSx}>
                          Name
                        </MenuItem>
                        <MenuItem value="EMAIL" sx={adminSessionListMenuItemSx}>
                          Email
                        </MenuItem>
                        <MenuItem
                          value="STATUS"
                          sx={adminSessionListMenuItemSx}
                        >
                          Status
                        </MenuItem>
                        <MenuItem
                          value="SCHOOL"
                          sx={adminSessionListMenuItemSx}
                        >
                          School
                        </MenuItem>
                      </Select>
                    </Box>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <Typography sx={adminSessionListSearchLabelSx}>
                        Criteria:
                      </Typography>
                      <Select
                        value={searchCriteria}
                        onChange={(e) => setSearchCriteria(e.target.value)}
                        size="small"
                        sx={adminSessionListSearchSelectSx}
                      >
                        <MenuItem
                          value="contains"
                          sx={adminSessionListMenuItemSx}
                        >
                          Contains
                        </MenuItem>
                        <MenuItem
                          value="equals"
                          sx={adminSessionListMenuItemSx}
                        >
                          Equals
                        </MenuItem>
                        <MenuItem
                          value="starts_with"
                          sx={adminSessionListMenuItemSx}
                        >
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
                    className="admin-volunteers-request-table-container"
                    sx={{ width: "100%" }}
                  >
                    <Table
                      className="admin-volunteers-request-table"
                      sx={adminSessionListGridTableSx}
                      size="small"
                    >
                      <TableHead>
                        <TableRow sx={adminSessionListTableHeadRowSx}>
                          <TableCell
                            sx={adminSessionListTableHeadCellSx(
                              volunteersRequestColumnWidths.action,
                            )}
                          >
                            Action
                          </TableCell>
                          <SortableHeader
                            label="Status"
                            field="status"
                            sortField={orderBy}
                            sortOrder={order}
                            onSort={handleSort}
                            headCellSx={adminSessionListTableHeadCellSx(
                              volunteersRequestColumnWidths.status,
                            )}
                          />
                          <SortableHeader
                            label="#"
                            field="volunteerID"
                            sortField={orderBy}
                            sortOrder={order}
                            onSort={handleSort}
                            headCellSx={adminSessionListTableHeadCellSx(
                              volunteersRequestColumnWidths.id,
                            )}
                          />
                          <SortableHeader
                            label="Volunteer Name"
                            field="volunteerName"
                            sortField={orderBy}
                            sortOrder={order}
                            onSort={handleSort}
                            headCellSx={adminSessionListTableHeadCellSx(
                              volunteersRequestColumnWidths.volunteerName,
                            )}
                          />
                          <SortableHeader
                            label="Grade"
                            field="grade"
                            sortField={orderBy}
                            sortOrder={order}
                            onSort={handleSort}
                            headCellSx={adminSessionListTableHeadCellSx(
                              volunteersRequestColumnWidths.grade,
                            )}
                          />
                          <SortableHeader
                            label="Location"
                            field="location"
                            sortField={orderBy}
                            sortOrder={order}
                            onSort={handleSort}
                            headCellSx={adminSessionListTableHeadCellSx(
                              volunteersRequestColumnWidths.location,
                            )}
                          />
                          <SortableHeader
                            label="School"
                            field="school"
                            sortField={orderBy}
                            sortOrder={order}
                            onSort={handleSort}
                            headCellSx={adminSessionListTableHeadCellSx(
                              volunteersRequestColumnWidths.school,
                            )}
                          />
                          <SortableHeader
                            label="Phone"
                            field="phone"
                            sortField={orderBy}
                            sortOrder={order}
                            onSort={handleSort}
                            headCellSx={adminSessionListTableHeadCellSx(
                              volunteersRequestColumnWidths.phone,
                            )}
                          />
                          <SortableHeader
                            label="Email"
                            field="email"
                            sortField={orderBy}
                            sortOrder={order}
                            onSort={handleSort}
                            headCellSx={adminSessionListTableHeadCellSx(
                              volunteersRequestColumnWidths.email,
                            )}
                          />
                          <SortableHeader
                            label="City"
                            field="city"
                            sortField={orderBy}
                            sortOrder={order}
                            onSort={handleSort}
                            headCellSx={adminSessionListTableHeadCellSx(
                              volunteersRequestColumnWidths.city,
                            )}
                          />
                          <SortableHeader
                            label="Enrolled For"
                            field="enrolledSession"
                            sortField={orderBy}
                            sortOrder={order}
                            onSort={handleSort}
                            headCellSx={adminSessionListTableHeadCellSx(
                              volunteersRequestColumnWidths.enrolledFor,
                            )}
                          />
                          <SortableHeader
                            label="Interested For"
                            field="interest"
                            sortField={orderBy}
                            sortOrder={order}
                            onSort={handleSort}
                            headCellSx={adminSessionListTableHeadCellSx(
                              volunteersRequestColumnWidths.interestedFor,
                            )}
                          />
                          <SortableHeader
                            label="Requested Date"
                            field="insertDate"
                            sortField={orderBy}
                            sortOrder={order}
                            onSort={handleSort}
                            headCellSx={adminSessionListTableHeadCellSx(
                              volunteersRequestColumnWidths.requestedDate,
                            )}
                          />
                          <SortableHeader
                            label="Comments"
                            field="comments"
                            sortField={orderBy}
                            sortOrder={order}
                            onSort={handleSort}
                            headCellSx={adminSessionListTableHeadCellSx(
                              volunteersRequestColumnWidths.comments,
                              true,
                            )}
                          />
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {loading ? (
                          <TableRow>
                            <TableCell
                              colSpan={14}
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
                        ) : paginatedList.length > 0 ? (
                          paginatedList.map((row) => (
                            <TableRow
                              key={row.volunteerID}
                              sx={adminSessionListTableBodyRowSx}
                            >
                              <TableCell
                                sx={adminSessionListTableBodyCellSx({
                                  action: true,
                                })}
                              >
                                <Box sx={{ display: "flex", gap: 0.5, flexWrap: "nowrap" }}>
                                  <Box
                                    onClick={() => handleEdit(row)}
                                    sx={adminSessionListTableActionLinkSx}
                                  >
                                    Edit
                                  </Box>
                                  <Box component="span" sx={{ color: "text.disabled", userSelect: "none" }}>|</Box>
                                  <Box
                                    onClick={() => handleDeleteClick(row)}
                                    sx={adminSessionListTableDeleteLinkSx}
                                  >
                                    Delete
                                  </Box>
                                </Box>
                              </TableCell>
                              <TableCell
                                className="vr-status-cell"
                                sx={adminSessionListTableBodyCellSx()}
                              >
                                <VolunteersRequestStatusCell value={row.status} />
                              </TableCell>
                              <TableCell sx={adminSessionListTableBodyCellSx()}>
                                {row.volunteerID ?? "—"}
                              </TableCell>
                              {renderCopyCell(row.volunteerName)}
                              {renderCopyCell(row.grade)}
                              {renderCopyCell(row.location)}
                              {renderCopyCell(row.school)}
                              <TableCell sx={adminSessionListTableBodyCellSx()}>
                                {row.phone ?? "—"}
                              </TableCell>
                              {renderCopyCell(row.email)}
                              {renderCopyCell(row.city)}
                              {renderCopyCell(row.enrolledSession)}
                              {renderCopyCell(row.interest)}
                              <TableCell sx={adminSessionListTableBodyCellSx()}>
                                {formatDate(row.insertDate) || "—"}
                              </TableCell>
                              {renderCopyCell(row.comments, { isLast: true })}
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={14}
                              align="center"
                              sx={adminSessionListEmptyCellSx}
                            >
                              <Typography
                                variant="body2"
                                color="textSecondary"
                                sx={adminSessionListEmptyTextSx}
                              >
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

      <PortalDialog
        open={showUpdateForm && !!selectedRow}
        onClose={handleCloseUpdateForm}
        maxWidth="sm"
        disableClose={submitting}
        title="Update Volunteer Request Status"
        icon={<EditIcon sx={{ fontSize: 20 }} />}
        paperSx={volunteersRequestModalPaperSx}
        contentSx={volunteersRequestModalContentSx}
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
        <Grid
          container
          spacing={2}
          className="admin-volunteers-request-update-form"
          sx={{ width: "100%", minWidth: 0, maxWidth: "100%", m: 0 }}
        >
          <Grid item xs={12} sx={{ minWidth: 0, maxWidth: "100%" }}>
            <TextField
              fullWidth
              size="small"
              label="First Name"
              value={form.firstName}
              disabled
              InputLabelProps={{ shrink: true }}
              sx={volunteersRequestReadOnlyFieldSx}
            />
          </Grid>
          <Grid item xs={12} sx={{ minWidth: 0, maxWidth: "100%" }}>
            <TextField
              fullWidth
              size="small"
              label="Last Name"
              value={form.lastName}
              disabled
              InputLabelProps={{ shrink: true }}
              sx={volunteersRequestReadOnlyFieldSx}
            />
          </Grid>
          <Grid item xs={12} sx={{ minWidth: 0, maxWidth: "100%" }}>
            <TextField
              fullWidth
              size="small"
              label="Email"
              value={selectedVolunteerEmail}
              disabled
              InputLabelProps={{ shrink: true }}
              sx={volunteersRequestReadOnlyFieldSx}
            />
          </Grid>
          <Grid item xs={12} sx={{ minWidth: 0, maxWidth: "100%" }}>
            <Tooltip
              title={getVolunteerChapterLabel(form.chapterID, chapterLocations) || "Select chapter"}
              placement="top-start"
              enterDelay={400}
            >
              <Box sx={{ width: "100%" }}>
              <FormControl
                fullWidth
                size="small"
                className="vr-field-chapter"
                sx={volunteersRequestChapterFieldSx}
              >
              <InputLabel id="vr-chapter-label" shrink>
                Chapter
              </InputLabel>
              <PortalModalSelect
                labelId="vr-chapter-label"
                id="vr-chapter-select"
                value={String(form.chapterID ?? "")}
                label="Chapter"
                displayEmpty
                disabled={submitting}
                renderValue={(selected) =>
                  renderVolunteerChapterSelectValue(selected, chapterLocations)
                }
                onChange={(e) =>
                  setForm((f) => ({ ...f, chapterID: e.target.value }))
                }
              >
                {!form.chapterID && (
                  <MenuItem value="">
                    <em>Select chapter</em>
                  </MenuItem>
                )}
                {form.chapterID &&
                  !chapterSelectIds.includes(String(form.chapterID)) && (
                    <MenuItem value={String(form.chapterID)}>
                      Chapter {form.chapterID}
                    </MenuItem>
                  )}
                {chapterLocations.map((ch) => {
                  const id = String(ch.chapterID ?? ch.ChapterID ?? "");
                  const label =
                    ch.label ??
                    ch.Label ??
                    [
                      ch.name ?? ch.Name ?? ch.chapterName ?? ch.ChapterName ?? "",
                      ch.location ?? ch.Location ?? "",
                      ch.city ?? ch.City ?? "",
                    ]
                      .map((p) => String(p || "").trim())
                      .filter(Boolean)
                      .join(" - ");
                  const display = label || `Chapter ${id}`;
                  return (
                    <MenuItem key={id} value={id} title={display}>
                      {display}
                    </MenuItem>
                  );
                })}
              </PortalModalSelect>
            </FormControl>
              </Box>
            </Tooltip>
          </Grid>
          <Grid item xs={12} sx={{ minWidth: 0, maxWidth: "100%" }}>
            <FormControl
              fullWidth
              size="small"
              className="vr-field-type"
              sx={volunteersRequestModalSelectFieldSx("type")}
            >
              <InputLabel id="vr-type-label" shrink>
                Type
              </InputLabel>
              <PortalModalSelect
                labelId="vr-type-label"
                id="vr-type-select"
                value={form.type || "P"}
                label="Type"
                disabled={submitting}
                renderValue={(selected) =>
                  renderVolunteerSelectDisplayValue(getVolunteerTypeLabel(selected))
                }
                onChange={(e) =>
                  setForm((f) => ({ ...f, type: e.target.value }))
                }
              >
                {form.type &&
                  !TYPE_OPTIONS.some((opt) => opt.value === form.type) && (
                    <MenuItem value={form.type}>{form.type}</MenuItem>
                  )}
                {TYPE_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </PortalModalSelect>
            </FormControl>
          </Grid>
          <Grid item xs={12} sx={{ minWidth: 0, maxWidth: "100%" }}>
            <FormControl
              fullWidth
              size="small"
              className="vr-field-class"
              sx={volunteersRequestModalSelectFieldSx("class")}
            >
              <InputLabel id="vr-class-label" shrink>
                Class
              </InputLabel>
              <PortalModalSelect
                labelId="vr-class-label"
                id="vr-class-select"
                value={form.class || "JB"}
                label="Class"
                disabled={submitting}
                renderValue={(selected) =>
                  renderVolunteerSelectDisplayValue(getVolunteerClassLabel(selected))
                }
                onChange={(e) =>
                  setForm((f) => ({ ...f, class: e.target.value }))
                }
              >
                {form.class &&
                  !CLASS_OPTIONS.some((opt) => opt.value === form.class) && (
                    <MenuItem value={form.class}>{form.class}</MenuItem>
                  )}
                {CLASS_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </PortalModalSelect>
            </FormControl>
          </Grid>
          <Grid item xs={12} sx={{ minWidth: 0, maxWidth: "100%" }}>
            <FormControl
              fullWidth
              size="small"
              className="vr-field-section"
              sx={volunteersRequestModalSelectFieldSx("section")}
            >
              <InputLabel id="vr-section-label" shrink>
                Section
              </InputLabel>
              <PortalModalSelect
                labelId="vr-section-label"
                id="vr-section-select"
                value={form.section || "A"}
                label="Section"
                disabled={submitting}
                renderValue={(selected) =>
                  renderVolunteerSelectDisplayValue(getVolunteerSectionLabel(selected))
                }
                onChange={(e) =>
                  setForm((f) => ({ ...f, section: e.target.value }))
                }
              >
                <MenuItem value="A">A</MenuItem>
                <MenuItem value="B">B</MenuItem>
              </PortalModalSelect>
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

export default VolunteersRequest;
