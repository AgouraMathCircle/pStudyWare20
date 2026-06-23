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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import { Save as SaveIcon, Refresh as RefreshIcon } from "@mui/icons-material";
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
};

const UpdateLookupSemester = () => {
  const { user } = useAuth();
  const chapterID =
    user?.chapterID?.toString() ||
    user?.ChapterID?.toString() ||
    "";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [canUpdate, setCanUpdate] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await semesterLookupService.getSemesterLookup(chapterID);
      if (!res.isSuccess) {
        setError(res.errorMessage || "Failed to load semester lookup.");
        return;
      }
      setCanUpdate(res.canUpdate === true);
      const L = res.lookup || {};
      setForm({
        semester: L.semester ?? "",
        lastSemester: L.lastSemester ?? "",
        startingDate: L.startingDate ?? "",
        regStartDate: L.regStartDate ?? "",
        regCloseDate: L.regCloseDate ?? "",
        displayDocumentsFrom: L.displayDocumentsFrom ?? "",
        registrationStatus: L.registrationStatus === "C" ? "C" : "O",
        jbTotalSpace: L.jbTotalSpace ?? "",
        jiTotalSpace: L.jiTotalSpace ?? "",
        jaTotalSpace: L.jaTotalSpace ?? "",
        sbTotalSpace: L.sbTotalSpace ?? "",
        siTotalSpace: L.siTotalSpace ?? "",
        saTotalSpace: L.saTotalSpace ?? "",
        currentExamDate: L.currentExamDate ?? "",
        currentExamDueTime: L.currentExamDueTime ?? "",
      });
    } catch (e) {
      setError(
        e.response?.data?.message ||
          e.response?.data?.error ||
          e.message ||
          "Failed to load semester lookup.",
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
    setSuccess(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canUpdate) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
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
        chapterID,
      };
      const res = await semesterLookupService.updateSemesterLookup(payload);
      if (!res.isSuccess) {
        setError(res.errorMessage || "Update failed.");
        return;
      }
      setSuccess(res.message || "Semester lookup updated successfully.");
      await load();
    } catch (e) {
      const status = e.response?.status;
      const data = e.response?.data;
      if (status === 403) {
        setError(data?.errorMessage || "You do not have permission to update.");
      } else {
        setError(
          data?.message ||
            data?.error ||
            data?.errorMessage ||
            e.message ||
            "Update failed.",
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

                  {error && (
                    <Alert
                      severity="error"
                      sx={{ mb: 2 }}
                      onClose={() => setError(null)}
                    >
                      {error}
                    </Alert>
                  )}
                  {success && (
                    <Alert
                      severity="success"
                      sx={{ mb: 2 }}
                      onClose={() => setSuccess(null)}
                    >
                      {success}
                    </Alert>
                  )}

                  {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
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
                                onChange={handleChange("registrationStatus")}
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
                              Display Documents From
                            </TableCell>
                            <TableCell sx={lookupInputCellSx}>
                              <TextField
                                fullWidth
                                size="small"
                                variant="outlined"
                                hiddenLabel
                                value={form.displayDocumentsFrom}
                                onChange={handleChange("displayDocumentsFrom")}
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
                                sx={{ ...lookupFieldSx, width: 108, maxWidth: "100%" }}
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
                                sx={{ ...lookupFieldSx, width: 108, maxWidth: "100%" }}
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
                                sx={{ ...lookupFieldSx, width: 108, maxWidth: "100%" }}
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
                                sx={{ ...lookupFieldSx, width: 108, maxWidth: "100%" }}
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
                                sx={{ ...lookupFieldSx, width: 108, maxWidth: "100%" }}
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
                                sx={{ ...lookupFieldSx, width: 108, maxWidth: "100%" }}
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
    </Box>
  );
};

export default UpdateLookupSemester;
