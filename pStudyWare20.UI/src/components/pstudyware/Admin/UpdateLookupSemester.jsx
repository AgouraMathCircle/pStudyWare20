import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Grid,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tooltip,
} from "@mui/material";
import {
  Save as SaveIcon,
  Refresh as RefreshIcon,
  InfoOutlined as InfoOutlinedIcon,
} from "@mui/icons-material";
import AdminHeader, { AdminRoleHeaderSpacer } from "./AdminHeader";
import { useAuth } from "../../../contexts/AuthContext";
import semesterLookupService from "../../../services/semesterLookupService";
import {
  APPLICATION_ADMIN_TITLE_COLOR,
  PORTAL_CARD_BOX_SHADOW,
  portalCardAntiLiftSx,
} from "../styles/applicationSurfaces";

const pageShellSx = {
  flex: 1,
  minHeight: 0,
  width: "100%",
  display: "flex",
  flexDirection: "column",
};

/** Legacy-style panel: green band, white labels, light input column */
const lookupTableContainerSx = {
  bgcolor: "#2e7d32",
  borderRadius: 1,
  overflow: "hidden",
  "& .MuiTableCell-root": {
    borderColor: "rgba(255,255,255,0.35)",
  },
};

const lookupLabelCellSx = {
  width: { xs: "40%", sm: "34%" },
  maxWidth: 320,
  color: "common.white",
  fontWeight: 700,
  fontSize: "0.875rem",
  verticalAlign: "middle",
  py: 1,
  pr: 2,
};

const lookupInputCellSx = {
  bgcolor: "#b3e5fc",
  verticalAlign: "middle",
  py: 0.75,
};

const lookupFieldSx = {
  "& .MuiOutlinedInput-root": {
    bgcolor: "common.white",
    fontSize: "0.875rem",
  },
};

const SUCCESS_MESSAGE = "You have updated Semester Lookup successfully.";

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
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((s) => ({ ...s, open: false }));
  };

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
      setForm({
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
      });
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
  }, [chapterID]);

  useEffect(() => {
    load();
  }, [load]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canUpdate) return;
    setSaving(true);
    setSnackbar((s) => ({ ...s, open: false }));
    try {
      const payload = {
        semester: form.semester,
        lastSemester: form.lastSemester,
        startingDate: form.startingDate,
        regStartDate: form.regStartDate,
        regCloseDate: form.regCloseDate,
        displayDocumentsFrom: form.displayDocumentsFrom,
        registrationStatus: form.registrationStatus,
        jbTotalSpace: form.jbTotalSpace,
        jiTotalSpace: form.jiTotalSpace,
        jaTotalSpace: form.jaTotalSpace,
        sbTotalSpace: form.sbTotalSpace,
        siTotalSpace: form.siTotalSpace,
        saTotalSpace: form.saTotalSpace,
        currentExamDate: form.currentExamDate,
        currentExamDueTime: form.currentExamDueTime,
        volunteerAvailability: normalizeYn(form.volunteerAvailability),
        finalExamDisplay:
          form.registrationStatus === "O"
            ? "N"
            : normalizeYn(form.finalExamDisplay),
        finalExamDisplayChapter: form.finalExamDisplayChapter,
        onlineExamDisplayChapter: form.onlineExamDisplayChapter,
        chapterID,
      };
      const res = await semesterLookupService.updateSemesterLookup(payload);
      if (!(res.isSuccess ?? res.IsSuccess)) {
        showSnackbar(res.errorMessage || res.ErrorMessage || "Update failed.", "error");
        return;
      }
      showSnackbar(SUCCESS_MESSAGE, "success");
      await load();
    } catch (e) {
      const status = e.response?.status;
      const data = e.response?.data;
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
            e.message ||
            "Update failed.") + errorDetails,
          "error",
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const fieldReadOnly = !canUpdate;

  return (
    <Box sx={pageShellSx}>
      <AdminHeader user={user} />
      <AdminRoleHeaderSpacer />
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
                  component="form"
                  onSubmit={handleSubmit}
                  sx={{ width: "100%" }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      mb: 2,
                      fontWeight: 600,
                      color: APPLICATION_ADMIN_TITLE_COLOR,
                      fontSize: "1rem",
                    }}
                  >
                    Update Semester Lookup
                  </Typography>

                  {!canUpdate && !loading && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                      View only. Submit is available for chapter 1
                      administrators (legacy behavior).
                    </Alert>
                  )}

                  {loading ? (
                    <Box
                      sx={{ display: "flex", justifyContent: "center", py: 4 }}
                    >
                      <CircularProgress />
                    </Box>
                  ) : (
                    <>
                      <TableContainer sx={lookupTableContainerSx}>
                        <Table size="small" sx={{ tableLayout: "fixed" }}>
                          <TableBody>
                            <TableRow>
                              <TableCell
                                component="th"
                                scope="row"
                                sx={lookupLabelCellSx}
                              >
                                Current Semester
                              </TableCell>
                              <TableCell sx={lookupInputCellSx}>
                                <TextField
                                  fullWidth
                                  size="small"
                                  variant="outlined"
                                  hiddenLabel
                                  value={form.semester}
                                  onChange={handleChange("semester")}
                                  disabled={saving}
                                  InputProps={{ readOnly: fieldReadOnly }}
                                  inputProps={{ maxLength: 5 }}
                                  sx={lookupFieldSx}
                                />
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell
                                component="th"
                                scope="row"
                                sx={lookupLabelCellSx}
                              >
                                Last Semester
                              </TableCell>
                              <TableCell sx={lookupInputCellSx}>
                                <TextField
                                  fullWidth
                                  size="small"
                                  variant="outlined"
                                  hiddenLabel
                                  value={form.lastSemester}
                                  onChange={handleChange("lastSemester")}
                                  disabled={saving}
                                  InputProps={{ readOnly: fieldReadOnly }}
                                  inputProps={{ maxLength: 5 }}
                                  sx={lookupFieldSx}
                                />
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell
                                component="th"
                                scope="row"
                                sx={lookupLabelCellSx}
                              >
                                Starting Date
                              </TableCell>
                              <TableCell sx={lookupInputCellSx}>
                                <TextField
                                  fullWidth
                                  size="small"
                                  variant="outlined"
                                  hiddenLabel
                                  value={form.startingDate}
                                  onChange={handleChange("startingDate")}
                                  disabled={saving}
                                  InputProps={{ readOnly: fieldReadOnly }}
                                  inputProps={{ maxLength: 20 }}
                                  placeholder="e.g. MM/dd/yyyy"
                                  sx={lookupFieldSx}
                                />
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell
                                component="th"
                                scope="row"
                                sx={lookupLabelCellSx}
                              >
                                Registration Start Date
                              </TableCell>
                              <TableCell sx={lookupInputCellSx}>
                                <TextField
                                  fullWidth
                                  size="small"
                                  variant="outlined"
                                  hiddenLabel
                                  value={form.regStartDate}
                                  onChange={handleChange("regStartDate")}
                                  disabled={saving}
                                  InputProps={{ readOnly: fieldReadOnly }}
                                  inputProps={{ maxLength: 20 }}
                                  sx={lookupFieldSx}
                                />
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell
                                component="th"
                                scope="row"
                                sx={lookupLabelCellSx}
                              >
                                Registration Close Date
                              </TableCell>
                              <TableCell sx={lookupInputCellSx}>
                                <TextField
                                  fullWidth
                                  size="small"
                                  variant="outlined"
                                  hiddenLabel
                                  value={form.regCloseDate}
                                  onChange={handleChange("regCloseDate")}
                                  disabled={saving}
                                  InputProps={{ readOnly: fieldReadOnly }}
                                  inputProps={{ maxLength: 20 }}
                                  sx={lookupFieldSx}
                                />
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell
                                component="th"
                                scope="row"
                                sx={lookupLabelCellSx}
                              >
                                Registration Status
                              </TableCell>
                              <TableCell sx={lookupInputCellSx}>
                                <TextField
                                  fullWidth
                                  select
                                  size="small"
                                  variant="outlined"
                                  hiddenLabel
                                  value={form.registrationStatus}
                                  onChange={handleRegistrationStatusChange}
                                  disabled={!canUpdate || saving}
                                  sx={lookupFieldSx}
                                >
                                  <MenuItem value="O">Open</MenuItem>
                                  <MenuItem value="C">Close</MenuItem>
                                </TextField>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell
                                component="th"
                                scope="row"
                                sx={lookupLabelCellSx}
                              >
                                Volunteer Availability
                              </TableCell>
                              <TableCell sx={lookupInputCellSx}>
                                <TextField
                                  fullWidth
                                  select
                                  size="small"
                                  variant="outlined"
                                  hiddenLabel
                                  value={form.volunteerAvailability}
                                  onChange={handleChange(
                                    "volunteerAvailability",
                                  )}
                                  disabled={!canUpdate || saving}
                                  sx={lookupFieldSx}
                                >
                                  <MenuItem value="Y">Open (Yes)</MenuItem>
                                  <MenuItem value="N">Close (No)</MenuItem>
                                </TextField>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell
                                component="th"
                                scope="row"
                                sx={lookupLabelCellSx}
                              >
                                Display Documents From
                              </TableCell>
                              <TableCell sx={lookupInputCellSx}>
                                <TextField
                                  fullWidth
                                  size="small"
                                  variant="outlined"
                                  hiddenLabel
                                  value={form.displayDocumentsFrom}
                                  onChange={handleChange(
                                    "displayDocumentsFrom",
                                  )}
                                  disabled={saving}
                                  InputProps={{ readOnly: fieldReadOnly }}
                                  sx={lookupFieldSx}
                                />
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell
                                component="th"
                                scope="row"
                                sx={lookupLabelCellSx}
                              >
                                Total Space Junior Beginner
                              </TableCell>
                              <TableCell sx={lookupInputCellSx}>
                                <TextField
                                  size="small"
                                  variant="outlined"
                                  hiddenLabel
                                  value={form.jbTotalSpace}
                                  onChange={handleChange("jbTotalSpace")}
                                  disabled={saving}
                                  InputProps={{ readOnly: fieldReadOnly }}
                                  inputProps={{ maxLength: 5 }}
                                  sx={{
                                    ...lookupFieldSx,
                                    width: 108,
                                    maxWidth: "100%",
                                  }}
                                />
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell
                                component="th"
                                scope="row"
                                sx={lookupLabelCellSx}
                              >
                                Total Space Junior Intermediate
                              </TableCell>
                              <TableCell sx={lookupInputCellSx}>
                                <TextField
                                  size="small"
                                  variant="outlined"
                                  hiddenLabel
                                  value={form.jiTotalSpace}
                                  onChange={handleChange("jiTotalSpace")}
                                  disabled={saving}
                                  InputProps={{ readOnly: fieldReadOnly }}
                                  inputProps={{ maxLength: 5 }}
                                  sx={{
                                    ...lookupFieldSx,
                                    width: 108,
                                    maxWidth: "100%",
                                  }}
                                />
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell
                                component="th"
                                scope="row"
                                sx={lookupLabelCellSx}
                              >
                                Total Space Junior Advanced
                              </TableCell>
                              <TableCell sx={lookupInputCellSx}>
                                <TextField
                                  size="small"
                                  variant="outlined"
                                  hiddenLabel
                                  value={form.jaTotalSpace}
                                  onChange={handleChange("jaTotalSpace")}
                                  disabled={saving}
                                  InputProps={{ readOnly: fieldReadOnly }}
                                  inputProps={{ maxLength: 5 }}
                                  sx={{
                                    ...lookupFieldSx,
                                    width: 108,
                                    maxWidth: "100%",
                                  }}
                                />
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell
                                component="th"
                                scope="row"
                                sx={lookupLabelCellSx}
                              >
                                Total Space Senior Beginner
                              </TableCell>
                              <TableCell sx={lookupInputCellSx}>
                                <TextField
                                  size="small"
                                  variant="outlined"
                                  hiddenLabel
                                  value={form.sbTotalSpace}
                                  onChange={handleChange("sbTotalSpace")}
                                  disabled={saving}
                                  InputProps={{ readOnly: fieldReadOnly }}
                                  inputProps={{ maxLength: 5 }}
                                  sx={{
                                    ...lookupFieldSx,
                                    width: 108,
                                    maxWidth: "100%",
                                  }}
                                />
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell
                                component="th"
                                scope="row"
                                sx={lookupLabelCellSx}
                              >
                                Total Space Senior Intermediate
                              </TableCell>
                              <TableCell sx={lookupInputCellSx}>
                                <TextField
                                  size="small"
                                  variant="outlined"
                                  hiddenLabel
                                  value={form.siTotalSpace}
                                  onChange={handleChange("siTotalSpace")}
                                  disabled={saving}
                                  InputProps={{ readOnly: fieldReadOnly }}
                                  inputProps={{ maxLength: 5 }}
                                  sx={{
                                    ...lookupFieldSx,
                                    width: 108,
                                    maxWidth: "100%",
                                  }}
                                />
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell
                                component="th"
                                scope="row"
                                sx={lookupLabelCellSx}
                              >
                                Total Space Senior Advanced
                              </TableCell>
                              <TableCell sx={lookupInputCellSx}>
                                <TextField
                                  size="small"
                                  variant="outlined"
                                  hiddenLabel
                                  value={form.saTotalSpace}
                                  onChange={handleChange("saTotalSpace")}
                                  disabled={saving}
                                  InputProps={{ readOnly: fieldReadOnly }}
                                  inputProps={{ maxLength: 5 }}
                                  sx={{
                                    ...lookupFieldSx,
                                    width: 108,
                                    maxWidth: "100%",
                                  }}
                                />
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell
                                component="th"
                                scope="row"
                                sx={lookupLabelCellSx}
                              >
                                Current Exam Date
                              </TableCell>
                              <TableCell sx={lookupInputCellSx}>
                                <TextField
                                  fullWidth
                                  size="small"
                                  variant="outlined"
                                  hiddenLabel
                                  value={form.currentExamDate}
                                  onChange={handleChange("currentExamDate")}
                                  disabled={saving}
                                  InputProps={{ readOnly: fieldReadOnly }}
                                  inputProps={{ maxLength: 10 }}
                                  sx={lookupFieldSx}
                                />
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell
                                component="th"
                                scope="row"
                                sx={lookupLabelCellSx}
                              >
                                Current Exam Due Time
                              </TableCell>
                              <TableCell sx={lookupInputCellSx}>
                                <TextField
                                  fullWidth
                                  size="small"
                                  variant="outlined"
                                  hiddenLabel
                                  value={form.currentExamDueTime}
                                  onChange={handleChange("currentExamDueTime")}
                                  disabled={saving}
                                  InputProps={{ readOnly: fieldReadOnly }}
                                  inputProps={{ maxLength: 25 }}
                                  sx={lookupFieldSx}
                                />
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell
                                component="th"
                                scope="row"
                                sx={lookupLabelCellSx}
                              >
                                Final Exam Display Y/N
                              </TableCell>
                              <TableCell sx={lookupInputCellSx}>
                                <TextField
                                  fullWidth
                                  select
                                  size="small"
                                  variant="outlined"
                                  hiddenLabel
                                  value={form.finalExamDisplay}
                                  onChange={handleChange("finalExamDisplay")}
                                  disabled={!canUpdate || saving || isRegistrationOpen}
                                  sx={lookupFieldSx}
                                >
                                  <MenuItem value="Y">Yes</MenuItem>
                                  <MenuItem value="N">No</MenuItem>
                                </TextField>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell
                                component="th"
                                scope="row"
                                sx={lookupLabelCellSx}
                              >
                                <Tooltip
                                  title="Enter chapter numbers separated by commas, e.g. 1,2,"
                                  arrow
                                  placement="top"
                                >
                                  <Box
                                    component="span"
                                    sx={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: 0.5,
                                      cursor: "help",
                                    }}
                                  >
                                    Final Exam Display Chapter
                                    <InfoOutlinedIcon
                                      sx={{ fontSize: 16, opacity: 0.9 }}
                                    />
                                  </Box>
                                </Tooltip>
                              </TableCell>
                              <TableCell sx={lookupInputCellSx}>
                                <Tooltip
                                  title="Enter chapter numbers separated by commas, e.g. 1,2,"
                                  arrow
                                  placement="top"
                                >
                                  <Box component="span" sx={{ display: "block" }}>
                                    <TextField
                                      fullWidth
                                      size="small"
                                      variant="outlined"
                                      hiddenLabel
                                      value={form.finalExamDisplayChapter}
                                      onChange={handleChange(
                                        "finalExamDisplayChapter",
                                      )}
                                      disabled={saving}
                                      InputProps={{ readOnly: fieldReadOnly }}
                                      inputProps={{ maxLength: 100 }}
                                      placeholder="e.g. 1,2,"
                                      sx={lookupFieldSx}
                                    />
                                  </Box>
                                </Tooltip>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell
                                component="th"
                                scope="row"
                                sx={lookupLabelCellSx}
                              >
                                <Tooltip
                                  title="Enter chapter numbers separated by commas, e.g. 1,2,"
                                  arrow
                                  placement="top"
                                >
                                  <Box
                                    component="span"
                                    sx={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: 0.5,
                                      cursor: "help",
                                    }}
                                  >
                                    Online Exam Display Chapter
                                    <InfoOutlinedIcon
                                      sx={{ fontSize: 16, opacity: 0.9 }}
                                    />
                                  </Box>
                                </Tooltip>
                              </TableCell>
                              <TableCell sx={lookupInputCellSx}>
                                <Tooltip
                                  title="Enter chapter numbers separated by commas, e.g. 1,2,"
                                  arrow
                                  placement="top"
                                >
                                  <Box component="span" sx={{ display: "block" }}>
                                    <TextField
                                      fullWidth
                                      size="small"
                                      variant="outlined"
                                      hiddenLabel
                                      value={form.onlineExamDisplayChapter}
                                      onChange={handleChange(
                                        "onlineExamDisplayChapter",
                                      )}
                                      disabled={saving}
                                      InputProps={{ readOnly: fieldReadOnly }}
                                      inputProps={{ maxLength: 100 }}
                                      placeholder="e.g. 1,2,"
                                      sx={lookupFieldSx}
                                    />
                                  </Box>
                                </Tooltip>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                      <Box
                        sx={{
                          mt: 2,
                          display: "flex",
                          justifyContent: "center",
                          flexWrap: "wrap",
                          gap: 1,
                        }}
                      >
                        <Button
                          type="button"
                          variant="outlined"
                          color="primary"
                          size="small"
                          startIcon={<RefreshIcon />}
                          onClick={load}
                          disabled={loading || saving}
                          sx={{ fontSize: "0.75rem", px: 1.5, py: 0.25 }}
                        >
                          Refresh
                        </Button>
                        <Button
                          type="submit"
                          variant="contained"
                          color="success"
                          size="small"
                          startIcon={<SaveIcon />}
                          disabled={!canUpdate || saving}
                          sx={{ fontSize: "0.75rem", px: 1.5, py: 0.25 }}
                        >
                          {saving ? "Saving…" : "Submit"}
                        </Button>
                      </Box>
                    </>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UpdateLookupSemester;
