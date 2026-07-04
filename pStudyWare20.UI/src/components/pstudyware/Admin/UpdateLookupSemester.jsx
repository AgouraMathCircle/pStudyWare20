import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
  Card,
  CardContent,
  Stack,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  Save as SaveIcon,
  InfoOutlined as InfoOutlinedIcon,
} from "@mui/icons-material";
import AdminHeader, { AdminRoleHeaderSpacer } from "./AdminHeader";
import { useAppSnackbar } from "../Common/useAppSnackbar";
import AppSnackbar from "../Common/AppSnackbar";
import { useAuth } from "../../../contexts/AuthContext";
import semesterLookupService from "../../../services/semesterLookupService";
import {
  portalModalFieldSx,
  portalModalSendButtonSx,
} from "../Common/portalModalStyles";
import {
  adminSessionListPanelCardSx,
  adminSessionListPanelContentSx,
  adminSessionListTitleSx,
  adminSessionListMenuItemSx,
  APPLICATION_SURFACE_BG,
} from "../styles/applicationSurfaces";

const pageShellSx = {
  flex: 1,
  minHeight: 0,
  width: "100%",
  display: "flex",
  flexDirection: "column",
};

const lookupTableContainerSx = {
  bgcolor: "#2e7d32",
  borderRadius: 1,
  overflow: "hidden",
  border: "1px solid #4caf50",
  "& .MuiTableCell-root": {
    borderColor: "rgba(255,255,255,0.35)",
  },
};

const categoryHeaderCellSx = {
  bgcolor: "#1b5e20",
  color: "common.white",
  fontWeight: 700,
  fontSize: "1rem",
  textAlign: "center",
  py: 1,
  borderBottom: "2px solid rgba(255,255,255,0.5)",
};

const lookupLabelCellSx = {
  width: "22%",
  color: "common.white",
  fontWeight: 600,
  fontSize: "0.9375rem",
  verticalAlign: "middle",
  py: 0.75,
  pr: 1.5,
  pl: 1.5,
  whiteSpace: "nowrap",
};

const lookupInputCellSx = {
  bgcolor: APPLICATION_SURFACE_BG,
  verticalAlign: "middle",
  py: 0.5,
  px: 1,
};

const lookupFieldSx = {
  ...portalModalFieldSx,
  "& .MuiOutlinedInput-root": {
    ...portalModalFieldSx["& .MuiOutlinedInput-root"],
    fontSize: "1rem",
    bgcolor: "common.white",
  },
};

const examLabelCellSx = {
  ...lookupLabelCellSx,
  width: "28%",
};

const SUCCESS_MESSAGE = "You have updated Semester Lookup successfully.";

const DATE_FIELDS = new Set([
  "startingDate",
  "regStartDate",
  "regCloseDate",
  "currentExamDate",
]);

const emptyForm = {
  semester: "",
  lastSemester: "",
  startingDate: "",
  regStartDate: "",
  regCloseDate: "",
  displayDocumentsFrom: "",
  registrationStatus: "O",
  jbTotalSpace: "",
  jiTotalSpace: "",
  jaTotalSpace: "",
  sbTotalSpace: "",
  siTotalSpace: "",
  saTotalSpace: "",
  currentExamDate: "",
  currentExamDueTime: "",
  volunteerAvailability: "N",
  finalExamDisplay: "N",
  finalExamDisplayChapter: "",
  onlineExamDisplayChapter: "",
};

const normalizeYn = (value) =>
  String(value ?? "")
    .trim()
    .toUpperCase() === "Y"
    ? "Y"
    : "N";

/** MM/DD/YYYY or ISO → YYYY-MM-DD for `<input type="date">` */
const toInputDate = (val) => {
  if (!val) return "";
  const trimmed = String(val).trim();
  const legacy = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (legacy) {
    const [, month, day, year] = legacy;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }
  return "";
};

/** YYYY-MM-DD → MM/DD/YYYY for API (legacy) */
const toApiDate = (val) => {
  if (!val) return "";
  const trimmed = String(val).trim();
  const iso = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) {
    const [, year, month, day] = iso;
    return `${month}/${day}/${year}`;
  }
  const legacy = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (legacy) {
    const [, month, day, year] = legacy;
    return `${month.padStart(2, "0")}/${day.padStart(2, "0")}/${year}`;
  }
  return trimmed;
};

const normalizeFormDatesForInput = (formState) => {
  const next = { ...formState };
  DATE_FIELDS.forEach((field) => {
    next[field] = toInputDate(next[field]);
  });
  return next;
};

const normalizeFormDatesForApi = (formState) => {
  const next = { ...formState };
  DATE_FIELDS.forEach((field) => {
    next[field] = toApiDate(next[field]);
  });
  return next;
};

const LabelCell = ({ children, tooltip, sx = lookupLabelCellSx }) => {
  const content = (
    <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
      {children}
      {tooltip ? (
        <InfoOutlinedIcon sx={{ fontSize: 16, opacity: 0.9 }} />
      ) : null}
    </Box>
  );

  return (
    <TableCell component="th" scope="row" sx={sx}>
      {tooltip ? (
        <Tooltip title={tooltip} arrow placement="top">
          <Box component="span" sx={{ cursor: "help" }}>
            {content}
          </Box>
        </Tooltip>
      ) : (
        content
      )}
    </TableCell>
  );
};

const EmptyPairCells = () => (
  <>
    <TableCell sx={{ ...lookupLabelCellSx, bgcolor: "#2e7d32" }} />
    <TableCell sx={{ ...lookupInputCellSx, bgcolor: APPLICATION_SURFACE_BG }} />
  </>
);

const UpdateLookupSemester = () => {
  const { user } = useAuth();
  const chapterID =
    user?.chapterID?.toString() ||
    user?.ChapterID?.toString() ||
    user?.chapterId?.toString() ||
    "";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [canUpdate, setCanUpdate] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const { snackbar, showSnackbar, closeSnackbar, setSnackbar } = useAppSnackbar();

  const VIEW_ONLY_MESSAGE =
    "View only. Submit is available for chapter 1 administrators (legacy behavior).";

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await semesterLookupService.getSemesterLookup(chapterID);
      if (!(res.isSuccess ?? res.IsSuccess)) {
        showSnackbar(
          res.errorMessage || res.ErrorMessage || "Failed to load semester lookup.",
          "error",
        );
        return;
      }
      setCanUpdate(res.canUpdate === true || res.CanUpdate === true);
      const L = res.lookup || res.Lookup || {};
      const registrationStatus = L.registrationStatus === "C" ? "C" : "O";
      setForm(
        normalizeFormDatesForInput({
          semester: L.semester ?? "",
          lastSemester: L.lastSemester ?? "",
          startingDate: L.startingDate ?? "",
          regStartDate: L.regStartDate ?? "",
          regCloseDate: L.regCloseDate ?? "",
          displayDocumentsFrom: L.displayDocumentsFrom ?? "",
          registrationStatus,
          jbTotalSpace: L.jbTotalSpace ?? "",
          jiTotalSpace: L.jiTotalSpace ?? "",
          jaTotalSpace: L.jaTotalSpace ?? "",
          sbTotalSpace: L.sbTotalSpace ?? "",
          siTotalSpace: L.siTotalSpace ?? "",
          saTotalSpace: L.saTotalSpace ?? "",
          currentExamDate: L.currentExamDate ?? L.CurrentExamDate ?? "",
          currentExamDueTime: L.currentExamDueTime ?? L.CurrentExamDueTime ?? "",
          volunteerAvailability: normalizeYn(
            L.volunteerAvailability ?? L.VolunteerAvailability,
          ),
          finalExamDisplay:
            registrationStatus === "O"
              ? "N"
              : normalizeYn(L.finalExamDisplay ?? L.FinalExamDisplay),
          finalExamDisplayChapter:
            L.finalExamDisplayChapter ?? L.FinalExamDisplayChapter ?? "",
          onlineExamDisplayChapter:
            L.onlineExamDisplayChapter ?? L.OnlineExamDisplayChapter ?? "",
        }),
      );
    } catch (e) {
      showSnackbar(
        e.response?.data?.message ||
          e.response?.data?.error ||
          e.message ||
          "Failed to load semester lookup.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  }, [chapterID, showSnackbar]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!loading && !canUpdate) {
      showSnackbar(VIEW_ONLY_MESSAGE, "info");
    }
  }, [loading, canUpdate, showSnackbar]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setSnackbar((s) => ({ ...s, open: false }));
  };

  const handleRegistrationStatusChange = (e) => {
    const registrationStatus = e.target.value;
    setForm((prev) => ({
      ...prev,
      registrationStatus,
      finalExamDisplay: registrationStatus === "O" ? "N" : prev.finalExamDisplay,
    }));
    setSnackbar((s) => ({ ...s, open: false }));
  };

  const isRegistrationOpen = form.registrationStatus === "O";
  const fieldReadOnly = !canUpdate;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canUpdate) return;
    setSaving(true);
    setSnackbar((s) => ({ ...s, open: false }));
    try {
      const apiForm = normalizeFormDatesForApi(form);
      const payload = {
        semester: apiForm.semester,
        lastSemester: apiForm.lastSemester,
        startingDate: apiForm.startingDate,
        regStartDate: apiForm.regStartDate,
        regCloseDate: apiForm.regCloseDate,
        displayDocumentsFrom: apiForm.displayDocumentsFrom,
        registrationStatus: apiForm.registrationStatus,
        jbTotalSpace: apiForm.jbTotalSpace,
        jiTotalSpace: apiForm.jiTotalSpace,
        jaTotalSpace: apiForm.jaTotalSpace,
        sbTotalSpace: apiForm.sbTotalSpace,
        siTotalSpace: apiForm.siTotalSpace,
        saTotalSpace: apiForm.saTotalSpace,
        currentExamDate: apiForm.currentExamDate,
        currentExamDueTime: apiForm.currentExamDueTime,
        volunteerAvailability: normalizeYn(apiForm.volunteerAvailability),
        finalExamDisplay:
          apiForm.registrationStatus === "O"
            ? "N"
            : normalizeYn(apiForm.finalExamDisplay),
        finalExamDisplayChapter: apiForm.finalExamDisplayChapter,
        onlineExamDisplayChapter: apiForm.onlineExamDisplayChapter,
        chapterID,
      };
      const res = await semesterLookupService.updateSemesterLookup(payload);
      if (!(res.isSuccess ?? res.IsSuccess)) {
        showSnackbar(res.errorMessage || res.ErrorMessage || "Update failed.", "error");
        return;
      }
      showSnackbar(SUCCESS_MESSAGE, "success");
      await load();
    } catch (err) {
      const status = err.response?.status;
      const data = err.response?.data;
      if (status === 403) {
        showSnackbar(
          data?.errorMessage || "You do not have permission to update.",
          "error",
        );
      } else {
        const errorDetails =
          data?.errors && Array.isArray(data.errors)
            ? `: ${data.errors.join(", ")}`
            : "";
        showSnackbar(
          (data?.message ||
            data?.error ||
            data?.errorMessage ||
            err.message ||
            "Update failed.") + errorDetails,
          "error",
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const renderTextInput = (field, extra = {}) => (
    <TextField
      fullWidth
      size="small"
      variant="outlined"
      hiddenLabel
      value={form[field]}
      onChange={handleChange(field)}
      disabled={saving}
      InputProps={{ readOnly: fieldReadOnly }}
      sx={lookupFieldSx}
      {...extra}
    />
  );

  const renderDateInput = (field) => (
    <TextField
      fullWidth
      size="small"
      variant="outlined"
      hiddenLabel
      type="date"
      value={form[field] || ""}
      onChange={handleChange(field)}
      disabled={saving || fieldReadOnly}
      InputLabelProps={{ shrink: true }}
      sx={lookupFieldSx}
    />
  );

  const renderSelectInput = (field, options, extra = {}) => (
    <TextField
      fullWidth
      select
      size="small"
      variant="outlined"
      hiddenLabel
      value={form[field]}
      onChange={handleChange(field)}
      disabled={!canUpdate || saving}
      sx={lookupFieldSx}
      {...extra}
    >
      {options.map((opt) => (
        <MenuItem key={opt.value} value={opt.value} sx={adminSessionListMenuItemSx}>
          {opt.label}
        </MenuItem>
      ))}
    </TextField>
  );

  const semesterRows = [
    { label: "Current Semester", render: () => renderTextInput("semester", { inputProps: { maxLength: 5 } }) },
    { label: "Last Semester", render: () => renderTextInput("lastSemester", { inputProps: { maxLength: 5 } }) },
    { label: "Starting Date", render: () => renderDateInput("startingDate") },
  ];

  const registrationRows = [
    { label: "Registration Start Date", render: () => renderDateInput("regStartDate") },
    { label: "Registration Close Date", render: () => renderDateInput("regCloseDate") },
    {
      label: "Registration Status",
      render: () =>
        renderSelectInput(
          "registrationStatus",
          [
            { value: "O", label: "Open" },
            { value: "C", label: "Close" },
          ],
          { onChange: handleRegistrationStatusChange },
        ),
    },
    {
      label: "Volunteer Availability",
      render: () =>
        renderSelectInput("volunteerAvailability", [
          { value: "Y", label: "Open (Yes)" },
          { value: "N", label: "Close (No)" },
        ]),
    },
    {
      label: "Display Documents From",
      render: () => renderTextInput("displayDocumentsFrom"),
    },
  ];

  const capacityRows = [
    { label: "Junior Beginner", render: () => renderTextInput("jbTotalSpace", { inputProps: { maxLength: 5 } }) },
    { label: "Junior Intermediate", render: () => renderTextInput("jiTotalSpace", { inputProps: { maxLength: 5 } }) },
    { label: "Junior Advanced", render: () => renderTextInput("jaTotalSpace", { inputProps: { maxLength: 5 } }) },
    { label: "Senior Beginner", render: () => renderTextInput("sbTotalSpace", { inputProps: { maxLength: 5 } }) },
    { label: "Senior Intermediate", render: () => renderTextInput("siTotalSpace", { inputProps: { maxLength: 5 } }) },
    { label: "Senior Advanced", render: () => renderTextInput("saTotalSpace", { inputProps: { maxLength: 5 } }) },
  ];

  const examRows = [
    { label: "Current Exam Date", render: () => renderDateInput("currentExamDate") },
    {
      label: "Current Exam Due Time",
      render: () => renderTextInput("currentExamDueTime", { inputProps: { maxLength: 25 } }),
    },
    {
      label: "Final Exam Display",
      render: () =>
        renderSelectInput(
          "finalExamDisplay",
          [
            { value: "Y", label: "Yes" },
            { value: "N", label: "No" },
          ],
          { disabled: !canUpdate || saving || isRegistrationOpen },
        ),
    },
    {
      label: "Final Exam Display Chapter",
      tooltip: "Enter chapter numbers separated by commas, e.g. 1,2,",
      render: () =>
        renderTextInput("finalExamDisplayChapter", {
          inputProps: { maxLength: 100 },
          placeholder: "e.g. 1,2,",
        }),
    },
    {
      label: "Online Exam Display Chapter",
      tooltip: "Enter chapter numbers separated by commas, e.g. 1,2,",
      render: () =>
        renderTextInput("onlineExamDisplayChapter", {
          inputProps: { maxLength: 100 },
          placeholder: "e.g. 1,2,",
        }),
    },
  ];

  const renderCategoryPair = (row) => {
    if (!row) return <EmptyPairCells />;
    return (
      <>
        <LabelCell tooltip={row.tooltip}>{row.label}</LabelCell>
        <TableCell sx={lookupInputCellSx}>{row.render()}</TableCell>
      </>
    );
  };

  const mainRowCount = Math.max(
    semesterRows.length,
    registrationRows.length,
    capacityRows.length,
  );

  return (
    <Box sx={pageShellSx}>
      <AdminHeader user={user} />
      <AdminRoleHeaderSpacer />
      <Container maxWidth="xl" sx={{ mb: 4, px: { xs: 2, sm: 3 } }}>
        <Card
          sx={{
            ...adminSessionListPanelCardSx,
            width: "100%",
            pl: { xs: 2, sm: 3 },
            pr: { xs: 2, sm: 3 },
          }}
        >
          <CardContent sx={{ ...adminSessionListPanelContentSx, px: 0, pt: 2, pb: 2 }}>
            <Box component="form" onSubmit={handleSubmit}>
              <Typography variant="subtitle1" sx={{ ...adminSessionListTitleSx, mb: 2 }}>
                Update Semester Lookup
              </Typography>

              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                  <CircularProgress size={32} />
                </Box>
              ) : (
                <>
                  <TableContainer sx={lookupTableContainerSx}>
                    <Table size="small" sx={{ tableLayout: "fixed", width: "100%" }}>
                      <TableHead>
                        <TableRow>
                          <TableCell colSpan={2} sx={categoryHeaderCellSx}>
                            Semester
                          </TableCell>
                          <TableCell colSpan={2} sx={categoryHeaderCellSx}>
                            Registration
                          </TableCell>
                          <TableCell colSpan={2} sx={categoryHeaderCellSx}>
                            Class Capacity
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Array.from({ length: mainRowCount }).map((_, index) => (
                          <TableRow key={index}>
                            {renderCategoryPair(semesterRows[index])}
                            {renderCategoryPair(registrationRows[index])}
                            {renderCategoryPair(capacityRows[index])}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <TableContainer sx={{ ...lookupTableContainerSx, mt: 2 }}>
                    <Table size="small" sx={{ tableLayout: "fixed", width: "100%" }}>
                      <TableHead>
                        <TableRow>
                          <TableCell colSpan={2} sx={categoryHeaderCellSx}>
                            Exam Settings
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {examRows.map((row) => (
                          <TableRow key={row.label}>
                            <LabelCell tooltip={row.tooltip} sx={examLabelCellSx}>
                              {row.label}
                            </LabelCell>
                            <TableCell sx={lookupInputCellSx}>{row.render()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Stack direction="row" spacing={1.5} justifyContent="center" sx={{ mt: 2, mb: 3, pb: 1 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="medium"
                      startIcon={<SaveIcon />}
                      disabled={!canUpdate || saving}
                      sx={portalModalSendButtonSx}
                    >
                      {saving ? "Saving…" : "Submit"}
                    </Button>
                  </Stack>
                </>
              )}
            </Box>
          </CardContent>
        </Card>
      </Container>

      <AppSnackbar snackbar={snackbar} onClose={closeSnackbar} autoHideDuration={6000} />
    </Box>
  );
};

export default UpdateLookupSemester;
