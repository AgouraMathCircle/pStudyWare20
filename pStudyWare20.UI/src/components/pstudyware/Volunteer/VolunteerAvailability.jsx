import React, { useMemo, useState, useEffect, useRef } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Container,
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
import {
  ArrowBack as BackIcon,
  EventAvailable as AvailabilityIcon,
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

const VolunteerAvailability = ({ embedded = false }) => {
  const { user } = useAuth();
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
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasLoadedAvailability, setHasLoadedAvailability] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasExistingData, setHasExistingData] = useState(false);
  const loadAvailabilityRequestedRef = useRef(false);

  // Load existing availability if available
  useEffect(() => {
    if (!user || hasLoadedAvailability || loadAvailabilityRequestedRef.current) return;

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
          setMessage("Existing availability loaded. You can update it below.");
          setHasExistingData(true);
        }

        setHasLoadedAvailability(true);
      } catch (err) {
        console.log(
          "No existing availability found. Starting with a fresh form."
        );
        setHasLoadedAvailability(true);
      } finally {
        setLoading(false);
      }
    };

    loadExistingAvailability();
  }, [user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    if (!username) {
      setError("You must be signed in.");
      return;
    }

    if (!reason) {
      setError("Please select a reason.");
      return;
    }

    const currentSession = user?.currentSession;
    if (!currentSession) {
      setError(
        "Current session is required from login response. Please sign out and sign in again."
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
      setError(
        "Current semester is required from login response. Please sign out and sign in again."
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
        setError(response?.errorMessage || response?.message || "Save failed.");
        return;
      }

      setMessage(
        response?.message || "Volunteer availability updated successfully."
      );
      setHasExistingData(true);
      setIsEditMode(false);
    } catch (err) {
      setError(err?.response?.data?.message ?? err?.message ?? "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const form = (
    <Box
      component={embedded ? "section" : Paper}
      sx={{
        p: { xs: 2, sm: 3 },
        height: "100%",
        borderTop: embedded ? undefined : "4px solid #43a047",
        backgroundColor: embedded ? "transparent" : undefined,
        boxShadow: embedded ? "none" : undefined,
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
          <Typography variant={embedded ? "h6" : "h5"} component="h1">
            Volunteer Availability
          </Typography>
        </Box>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        {!loading && hasExistingData && !isEditMode ? (
          <>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Session:</strong> {sessionNumber}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Are you volunteering?</strong> {isAvailable === "true" ? "Yes" : "No"}
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                <strong>Reason/Comments:</strong>
                <Typography
                  variant="body2"
                  sx={{ mt: 1, p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}
                >
                  {reason}
                </Typography>
              </Typography>
            </Box>

            <Alert severity="success" sx={{ mb: 2 }}>
              ✓ Your volunteer availability has been submitted.
            </Alert>

            <Button
              onClick={() => {
                setIsEditMode(true);
                setMessage(null);
              }}
              variant="contained"
              color="primary"
              fullWidth={embedded}
            >
              Edit
            </Button>
          </>
        ) : (
          <>
            {loading && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Loading your availability information...
              </Alert>
            )}

            <FormControl component="fieldset" sx={{ mb: 2 }} disabled={loading}>
              <FormLabel sx={{ fontWeight: 700, color: "#0d47a1", mb: 1 }}>
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
              sx={{ mb: 2 }}
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
              sx={{ mb: 2 }}
              style={{
                display: isAvailable === "false" ? "block" : "none",
              }}
              placeholder="Type your reason for not volunteering..."
            />

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {message && !hasExistingData && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {message}
              </Alert>
            )}

            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                type="submit"
                variant="contained"
                color="success"
                startIcon={<SendIcon />}
                disabled={saving || loading}
                fullWidth={embedded}
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
