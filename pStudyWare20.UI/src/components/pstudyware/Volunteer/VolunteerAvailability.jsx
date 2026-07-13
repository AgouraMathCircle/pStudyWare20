import React, { useMemo, useState, useEffect, useRef } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import AppSnackbar from "../Common/AppSnackbar";
import { useAppSnackbar } from "../Common/useAppSnackbar";
import {
  ArrowBack as BackIcon,
  EventAvailable as AvailabilityIcon,
  Edit as EditIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { useAuth } from "../../../contexts/AuthContext";
import volunteerAvailabilityService from "../../../services/volunteerAvailabilityService";

const REASON_OPTIONS = [
  "Class coordinator",
  "Tutoring Lecture Notes",
  "Tutoring Class Work",
  "Grading",
  "Documentation Work",
  "Facility Inspection",
  "Yard Duty",
  "Operation",
  "Adminstration",
  "Development",
  "Miscellaneous Work",
];

const formatSemesterForDb = (sem) => {
  if (!sem) return "";
  const trimmed = sem.trim();
  if (/^[FSfs]\d{4}$/.test(trimmed)) {
    return trimmed.toUpperCase();
  }
  const match = trimmed.match(/^(Fall|Spring|Summer|Winter)?\s*(\d{4})/i);
  if (match) {
    const term = match[1] ? match[1].charAt(0).toUpperCase() : "S";
    const year = match[2];
    return `${term}${year}`;
  }
  return trimmed.substring(0, 5);
};

const shouldShowVolunteerAvailability = (user) => {
  const flag = user?.volunteerAvailability ?? user?.VolunteerAvailability ?? "N";
  return String(flag).trim().toUpperCase() === "Y";
};

const VolunteerAvailability = ({ embedded = false }) => {
  const { user } = useAuth();
  const showAvailability = useMemo(
    () => shouldShowVolunteerAvailability(user),
    [user]
  );
  const username = useMemo(
    () => user?.email || user?.username || "",
    [user?.email, user?.username]
  );
  const sessionNumber = useMemo(() => {
    const sessionText = user?.currentSession;
    if (!sessionText) return null;
    const match = `${sessionText}`.match(/(\d+)(?!.*\d)/);
    return match ? parseInt(match[1], 10) + 1 : null;
  }, [user?.currentSession]);
  const [isAvailable, setIsAvailable] = useState("true");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasLoadedAvailability, setHasLoadedAvailability] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasExistingData, setHasExistingData] = useState(false);
  const loadAvailabilityRequestedRef = useRef(false);
  const { snackbar, showSnackbar, closeSnackbar } = useAppSnackbar("info");

  // Load existing availability if available
  useEffect(() => {
    if (!showAvailability || !user || hasLoadedAvailability || loadAvailabilityRequestedRef.current) return;

    loadAvailabilityRequestedRef.current = true;

    const loadExistingAvailability = async () => {
      setLoading(true);
      try {
        const currentSession = user?.currentSession;
        const semester = user?.currentSemester;
        const userId = user?.userId ?? user?.userID;

        if (!currentSession || !semester || !userId) {
          setLoading(false);
          return;
        }

        const parseSessionNumberFromString = (value) => {
          const text = `${value || ""}`;
          const match = text.match(/(\d+)(?!.*\d)/);
          return match ? parseInt(match[1], 10) + 1 : null;
        };

        const sessionNum = parseSessionNumberFromString(currentSession);

        const getRequest = {
          userID: String(userId ?? ""),
          session: `Session ${sessionNum}`,
          semester: formatSemesterForDb(semester),
        };

        const response = await volunteerAvailabilityService.getAvailability(
          getRequest
        );

        const data = response?.data ?? response;
        if (data && data.hasValue) {
          // Convert Y/N to Yes/No
          const isAvailableValue = data.response === "Y" ? "true" : "false";
          setIsAvailable(isAvailableValue);
          setReason(data.comments || "");
          showSnackbar("Existing availability loaded. You can update it below.", "info");
          setHasExistingData(true);
        }

        setHasLoadedAvailability(true);
      } catch {
        console.log(
          "No existing availability found. Starting with a fresh form."
        );
        setHasLoadedAvailability(true);
      } finally {
        setLoading(false);
      }
    };

    loadExistingAvailability();
  }, [user, hasLoadedAvailability, showAvailability, showSnackbar]);

  if (!showAvailability) {
    return null;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!username) {
      showSnackbar("You must be signed in.", "error");
      return;
    }

    if (!reason) {
      showSnackbar("Please select a reason.", "error");
      return;
    }

    const currentSession = user?.currentSession;
    if (!currentSession) {
      showSnackbar(
        "Current session is required from login response. Please sign out and sign in again.",
        "error",
      );
      return;
    }

    const parseSessionNumberFromString = (value) => {
      const text = `${value || ""}`;
      const match = text.match(/(\d+)(?!.*\d)/);
      return match ? parseInt(match[1], 10) + 1 : null;
    };

    const sessionNumber = parseSessionNumberFromString(currentSession);
    const semester = user?.currentSemester;

    if (!semester) {
      showSnackbar(
        "Current semester is required from login response. Please sign out and sign in again.",
        "error",
      );
      return;
    }

    setSaving(true);
    try {
      const request = {
        userID: String(user?.userId ?? user?.userID ?? ""),
        session: `Session ${sessionNumber}`,
        semester: formatSemesterForDb(semester),
        response: isAvailable === "true" ? "Y" : "N",
        comment: reason,
      };

      const response =
        await volunteerAvailabilityService.updateAvailability(request);

      if (response?.isSuccess === false) {
        showSnackbar(response?.errorMessage || response?.message || "Save failed.", "error");
        return;
      }

      showSnackbar(
        response?.message || "Volunteer availability updated successfully.",
        "success",
      );
      setHasExistingData(true);
      setIsEditMode(false);
    } catch (err) {
      showSnackbar(err?.response?.data?.message ?? err?.message ?? "Save failed.", "error");
    } finally {
      setSaving(false);
    }
  };

  const form = (
    <Box
      component={embedded ? "section" : Paper}
      sx={{
        p: embedded ? { xs: 0.5, sm: 1 } : { xs: 2, sm: 3 },
        height: "100%",
        borderTop: embedded ? undefined : "4px solid #43a047",
        backgroundColor: embedded ? "transparent" : undefined,
        boxShadow: embedded ? "none" : undefined,
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {!embedded && (
        <Button
          component={RouterLink}
          to="/pstudyware/volunteer/dashboard"
          startIcon={<BackIcon />}
          sx={{ mb: 2 }}
        >
          Back to dashboard
        </Button>
      )}

      {!embedded && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <AvailabilityIcon color="success" />
          <Typography variant={embedded ? "subtitle1" : "h5"} component="h1">
            Volunteer Availability
          </Typography>
        </Box>
      )}

      {embedded && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            mb: 1.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                bgcolor: "#e8f5e9",
                color: "#2e7d32",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <AvailabilityIcon fontSize="small" />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 800, color: "#1b5e20", lineHeight: 1.2 }}>
                Volunteer Availability
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Confirm your availability for the upcoming session.
              </Typography>
            </Box>
          </Box>
          <Chip
            size="small"
            label={hasExistingData && !isEditMode ? "Submitted" : "Action needed"}
            sx={{
              bgcolor: hasExistingData && !isEditMode ? "#e8f5e9" : "#ffebee",
              color: hasExistingData && !isEditMode ? "#1b5e20" : "#c62828",
              fontWeight: 700,
            }}
          />
        </Box>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        {!loading && hasExistingData && !isEditMode ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: embedded ? "1fr" : { xs: "1fr", lg: "minmax(0, 1.7fr) minmax(300px, 0.8fr)" },
              gap: embedded ? 1 : { xs: 2, lg: 3 },
              alignItems: "stretch",
            }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
                gap: 1,
                alignContent: "start",
              }}
            >
              <Box
                sx={{
                  p: 0.75,
                  border: "1px solid #dfe9df",
                  borderRadius: 2,
                  bgcolor: "#fbfffb",
                }}
              >
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                  Session
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                  {sessionNumber ?? "-"}
                </Typography>
              </Box>
              <Box
                sx={{
                  p: 0.75,
                  border: "1px solid #dfe9df",
                  borderRadius: 2,
                  bgcolor: "#fbfffb",
                }}
              >
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                  Are you volunteering?
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                  {isAvailable === "true" ? "Yes" : "No"}
                </Typography>
              </Box>
              <Box sx={{ gridColumn: { xs: "auto", sm: "1 / -1" } }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                  Reason/Comments
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    mt: 0.5,
                    p: 0.75,
                    minHeight: 28,
                    bgcolor: "#f5faf5",
                    border: "1px solid #dfe9df",
                    borderRadius: 2,
                    color: "#2d2d2d",
                  }}
                >
                  {reason || "-"}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                p: 0.75,
                borderRadius: 2,
                bgcolor: "#f7fbf7",
                border: "1px solid #dfe9df",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 1,
              }}
            >
              <Typography
                variant="body2"
                sx={{ m: 0, py: 0.5, px: 1, color: "#1b5e20", fontWeight: 600 }}
              >
                Your volunteer availability has been submitted.
              </Typography>
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Need to change your response? Edit and resubmit before the session starts.
                </Typography>
                <Button
                  onClick={() => {
                    setIsEditMode(true);
                  }}
                  variant="contained"
                  startIcon={<EditIcon />}
                  fullWidth
                  size="small"
                  sx={{
                    bgcolor: "#43a047",
                    fontWeight: 700,
                    "&:hover": { bgcolor: "#2e7d32" },
                  }}
                >
                  Edit availability
                </Button>
              </Box>
            </Box>
          </Box>
        ) : (
          <>
            {loading && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Loading your availability information...
              </Typography>
            )}

            <FormControl component="fieldset" sx={{ mb: 2, width: "100%" }} disabled={loading}>
              <FormLabel sx={{ fontWeight: 800, color: "#1b5e20", mb: 1 }}>
                Are you volunteering Session {sessionNumber ?? "?"}?
              </FormLabel>
              <RadioGroup
                row
                value={isAvailable}
                onChange={(event) => setIsAvailable(event.target.value)}
              >
                <FormControlLabel value="true" control={<Radio />} label="Yes" />
                <FormControlLabel value="false" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>

            <TextField
              select
              label="Reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              fullWidth
              required
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  bgcolor: "#ffffff",
                },
              }}
              style={{
                display: isAvailable === "true" ? "block" : "none",
              }}
            >
              {REASON_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Reason (please specify why)"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              fullWidth
              required
              multiline
              rows={3}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  bgcolor: "#ffffff",
                },
              }}
              style={{
                display: isAvailable === "false" ? "block" : "none",
              }}
              placeholder="Type your reason for not volunteering..."
            />

            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Button
                type="submit"
                variant="contained"
                startIcon={<SendIcon />}
                disabled={saving || loading}
                fullWidth={embedded}
                sx={{
                  bgcolor: "#43a047",
                  fontWeight: 700,
                  "&:hover": { bgcolor: "#2e7d32" },
                }}
              >
                {saving ? "Submitting..." : "Submit"}
              </Button>

              {hasExistingData && isEditMode && (
                <Button
                  onClick={() => setIsEditMode(false)}
                  variant="outlined"
                  disabled={saving}
                >
                  Cancel
                </Button>
              )}
            </Box>
          </>
        )}
      </Box>

      <AppSnackbar snackbar={snackbar} onClose={closeSnackbar} />
    </Box>
  );

  if (embedded) return form;

  return (
    <Container maxWidth="sm" sx={{ py: 2, pb: 4 }}>
      {form}
    </Container>
  );
};

export default VolunteerAvailability;
