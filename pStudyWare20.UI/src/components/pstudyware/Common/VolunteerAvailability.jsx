import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import { useAuth } from "../../../contexts/AuthContext";
import volunteerAvailabilityService from "../../../services/volunteerAvailabilityService";
import AppSnackbar from "./AppSnackbar";
import { useAppSnackbar } from "./useAppSnackbar";
import InstructorHeader, {
  InstructorRoleHeaderSpacer,
} from "../Instructor/InstructorHeader";
import VolunteerHeader, {
  VolunteerRoleHeaderSpacer,
} from "../Volunteer/VolunteerHeader";
import { adminSessionListTitleSx } from "../styles/applicationSurfaces";
import "./VolunteerAvailability.css";

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

export const shouldShowVolunteerAvailability = (user) => {
  const flag = user?.volunteerAvailability ?? user?.VolunteerAvailability ?? "N";
  return String(flag).trim().toUpperCase() === "Y";
};

const getSessionPrefixFromCurrent = (currentSession) => {
  const text = `${currentSession || ""}`.trim();
  if (!text) return "Session";

  const match = text.match(/^(.*?)(\d+)\s*$/);
  if (match && match[1].trim()) {
    return match[1].trim();
  }

  return "Session";
};

const getNextSessionLabel = (currentSession) => {
  const text = `${currentSession || ""}`.trim();
  if (!text) return "";

  const match = text.match(/^(.*?)(\d+)\s*$/);
  if (!match) return text;

  const prefix = match[1].trim() || "Session";
  const nextNumber = parseInt(match[2], 10) + 1;
  return `${prefix} ${nextNumber}`.trim();
};

/** Legacy uses CurrentSession prefix (e.g. "Session 4" -> "Session 1".."Session 10"). */
const buildSessionOptions = (currentSession, currentSemester) => {
  const sessionText = `${currentSession || ""}`.trim();

  if (sessionText) {
    const prefix = getSessionPrefixFromCurrent(sessionText);
    return Array.from({ length: 10 }, (_, index) => {
      const label = `${prefix} ${index + 1}`;
      return { value: label, label };
    });
  }

  const semesterText = `${currentSemester || ""}`.trim();
  let prefix = "Session";
  if (/fall/i.test(semesterText) || /^f/i.test(semesterText)) {
    prefix = "Fall Session";
  } else if (/spring/i.test(semesterText) || /^s/i.test(semesterText)) {
    prefix = "Spring Session";
  }

  return Array.from({ length: 10 }, (_, index) => {
    const label = `${prefix} ${index + 1}`;
    return { value: label, label };
  });
};

const resolveMemberId = (user) =>
  String(user?.userId ?? user?.UserId ?? user?.userID ?? "");

const resolvePortalRole = (user, pathname = "") => {
  const memberType = String(
    user?.memberType || user?.MemberType || "",
  ).toUpperCase();
  const role = String(user?.role || "").toLowerCase();

  if (
    pathname.includes("/pstudyware/instructor") ||
    memberType === "I" ||
    memberType === "C" ||
    role.includes("instructor") ||
    role.includes("coordinator")
  ) {
    return "instructor";
  }
  if (
    pathname.includes("/pstudyware/volunteer") ||
    memberType === "V" ||
    role.includes("volunteer")
  ) {
    return "volunteer";
  }
  return "volunteer";
};

const VolunteerAvailability = ({ embedded = false, skipRoleHeader = false }) => {
  const location = useLocation();
  const { user } = useAuth();
  const showAvailability = useMemo(
    () => shouldShowVolunteerAvailability(user),
    [user],
  );
  const username = useMemo(
    () => user?.email || user?.username || "",
    [user?.email, user?.username],
  );
  const memberId = useMemo(() => resolveMemberId(user), [user]);
  const sessionOptions = useMemo(
    () => buildSessionOptions(user?.currentSession, user?.currentSemester),
    [user?.currentSession, user?.currentSemester],
  );

  const defaultSession = useMemo(
    () =>
      getNextSessionLabel(user?.currentSession) ||
      sessionOptions[0]?.value ||
      "",
    [user?.currentSession, sessionOptions],
  );

  const [selectedSession, setSelectedSession] = useState("");
  const [isAvailable, setIsAvailable] = useState("true");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasLoadedAvailability, setHasLoadedAvailability] = useState(false);
  const [formMode, setFormMode] = useState("loading");
  const loadAvailabilityRequestedRef = useRef(false);
  const loadRequestIdRef = useRef(0);
  const formModeRef = useRef(formMode);
  const { snackbar, showSnackbar, closeSnackbar } = useAppSnackbar("info");

  useEffect(() => {
    formModeRef.current = formMode;
  }, [formMode]);

  const portalRole = resolvePortalRole(user, location.pathname);
  const showOwnHeader = !skipRoleHeader && !embedded;
  const isReadOnlyView = formMode === "view";
  const isEditing = formMode === "edit";

  const statusClass = loading || formMode === "loading"
    ? "volunteer-availability-status--loading"
    : isReadOnlyView
      ? "volunteer-availability-status--submitted"
      : isEditing
        ? "volunteer-availability-status--editing"
        : "volunteer-availability-status--action";

  const statusLabel = loading || formMode === "loading"
    ? "Loading"
    : isReadOnlyView
      ? "Submitted"
      : isEditing
        ? "Editing"
        : "Action needed";

  useEffect(() => {
    if (!defaultSession) return;
    setSelectedSession((current) => current || defaultSession);
  }, [defaultSession]);

  const applyAvailabilityResult = useCallback((result, sessionLabel) => {
    if (result.hasValue) {
      setIsAvailable(result.response === "Y" ? "true" : "false");
      setReason(result.comments || "");
      setSelectedSession(sessionLabel);
      if (formModeRef.current !== "edit") {
        setFormMode("view");
      }
      return;
    }

    setIsAvailable("true");
    setReason("");
    setSelectedSession(sessionLabel);
    if (formModeRef.current !== "edit") {
      setFormMode("new");
    }
  }, []);

  const loadAvailabilityForSession = useCallback(
    async (sessionLabel, { silent = false } = {}) => {
      const semester = user?.currentSemester;
      if (!sessionLabel || !memberId || !semester) {
        if (!silent) setLoading(false);
        return;
      }

      const requestId = ++loadRequestIdRef.current;

      if (!silent) setLoading(true);
      try {
        const result = await volunteerAvailabilityService.getAvailability({
          userID: memberId,
          session: sessionLabel,
          semester: formatSemesterForDb(semester),
        });

        if (requestId !== loadRequestIdRef.current) {
          return;
        }

        if (result.isSuccess === false) {
          showSnackbar(
            result.errorMessage || "Could not load volunteer availability.",
            "error",
          );
          if (formModeRef.current === "loading") {
            setFormMode("new");
          }
          return;
        }

        applyAvailabilityResult(result, sessionLabel);
      } catch (err) {
        if (requestId !== loadRequestIdRef.current) {
          return;
        }

        showSnackbar(
          err?.response?.data?.message ??
            err?.message ??
            "Could not load volunteer availability.",
          "error",
        );
        if (formModeRef.current === "loading") {
          setFormMode("new");
        }
      } finally {
        if (!silent && requestId === loadRequestIdRef.current) {
          setLoading(false);
        }
      }
    },
    [applyAvailabilityResult, memberId, showSnackbar, user?.currentSemester],
  );

  const handleEditAvailability = (event) => {
    event.preventDefault();
    event.stopPropagation();
    loadRequestIdRef.current += 1;
    setLoading(false);
    setSaving(false);
    setFormMode("edit");
  };

  const handleCancelEdit = async (event) => {
    event?.preventDefault?.();
    loadRequestIdRef.current += 1;
    setFormMode("view");

    if (selectedSession) {
      setLoading(true);
      try {
        const semester = user?.currentSemester;
        if (!memberId || !semester) return;

        const result = await volunteerAvailabilityService.getAvailability({
          userID: memberId,
          session: selectedSession,
          semester: formatSemesterForDb(semester),
        });

        if (result.isSuccess !== false) {
          applyAvailabilityResult(result, selectedSession);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (
      !showAvailability ||
      !user ||
      hasLoadedAvailability ||
      loadAvailabilityRequestedRef.current
    ) {
      return;
    }

    loadAvailabilityRequestedRef.current = true;

    const loadExistingAvailability = async () => {
      const sessionForLoad =
        getNextSessionLabel(user?.currentSession) || defaultSession;

      if (!sessionForLoad || !memberId || !user?.currentSemester) {
        setLoading(false);
        setFormMode("new");
        setHasLoadedAvailability(true);
        return;
      }

      await loadAvailabilityForSession(sessionForLoad);
      setHasLoadedAvailability(true);
    };

    loadExistingAvailability();
  }, [
    user,
    memberId,
    hasLoadedAvailability,
    showAvailability,
    defaultSession,
    loadAvailabilityForSession,
  ]);

  const handleSessionChange = async (event) => {
    const nextSession = event.target.value;
    setSelectedSession(nextSession);

    if (!hasLoadedAvailability || isReadOnlyView || isEditing) return;
    await loadAvailabilityForSession(nextSession);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!username) {
      showSnackbar("You must be signed in.", "error");
      return;
    }

    if (!selectedSession) {
      showSnackbar("Please select a session.", "error");
      return;
    }

    if (!reason.trim()) {
      showSnackbar(
        isAvailable === "true"
          ? "Please select a task name."
          : "Please enter a reason.",
        "error",
      );
      return;
    }

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
      const result = await volunteerAvailabilityService.updateAvailability({
        userID: memberId,
        session: selectedSession,
        semester: formatSemesterForDb(semester),
        response: isAvailable === "true" ? "Y" : "N",
        comment: reason,
      });

      if (result.isSuccess === false) {
        showSnackbar(
          result.errorMessage || result.message || "Save failed.",
          "error",
        );
        return;
      }

      showSnackbar(
        result.message || "Volunteer availability updated successfully.",
        "success",
      );
      setFormMode("view");
    } catch (err) {
      showSnackbar(
        err?.response?.data?.message ?? err?.message ?? "Save failed.",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  const fieldsDisabled = loading || isReadOnlyView;

  const renderSessionField = (readOnly = false) => {
    if (readOnly) {
      return (
        <span className="volunteer-availability-value-text">
          {selectedSession || "-"}
        </span>
      );
    }

    return (
      <FormControl
        size="small"
        required
        className="volunteer-availability-field"
        disabled={fieldsDisabled}
      >
        <Select
          displayEmpty
          value={selectedSession}
          onChange={handleSessionChange}
          disabled={fieldsDisabled}
          inputProps={{ "aria-label": "Session" }}
        >
          <MenuItem value="" disabled>
            Select session
          </MenuItem>
          {sessionOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  const renderTaskNameField = () => {
    if (isAvailable !== "true") return null;

    return (
      <FormControl
        size="small"
        required
        className="volunteer-availability-field"
        disabled={fieldsDisabled}
      >
        <Select
          displayEmpty
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          disabled={fieldsDisabled}
          inputProps={{ "aria-label": "Task Name" }}
        >
          <MenuItem value="" disabled>
            Select task name
          </MenuItem>
          {REASON_OPTIONS.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  const renderReasonField = () => {
    if (isAvailable !== "false") return null;

    return (
      <TextField
        value={reason}
        onChange={(event) => setReason(event.target.value)}
        fullWidth
        required
        multiline
        minRows={2}
        size="small"
        disabled={fieldsDisabled}
        className="volunteer-availability-field-wide"
        placeholder="Please specify why you are not volunteering..."
      />
    );
  };

  const renderPanelHeader = () => (
    <div className="volunteer-availability-header">
      <div className="volunteer-availability-header-text">
        <Typography
          variant="subtitle1"
          component="h2"
          className="volunteer-availability-title"
          sx={adminSessionListTitleSx}
        >
          Volunteer Availability
        </Typography>
        <Typography component="p" className="volunteer-availability-subtitle">
          Confirm your availability for the upcoming session.
        </Typography>
      </div>
    </div>
  );

  const renderStatusBadge = () => (
    <span className={`volunteer-availability-status ${statusClass}`}>
      {statusLabel}
    </span>
  );

  const renderFormBody = () => (
    <form className="volunteer-availability-entry-form" onSubmit={handleSubmit}>
      <div className="volunteer-availability-table-wrap">
        <table className="volunteer-availability-table">
          <tbody>
            <tr>
              <th scope="row" className="volunteer-availability-label-cell">
                Session:
              </th>
              <td
                className={
                  isReadOnlyView
                    ? "volunteer-availability-value-cell"
                    : "volunteer-availability-input-cell"
                }
              >
                {renderSessionField(isReadOnlyView)}
              </td>
            </tr>

            {isReadOnlyView ? (
              <>
                <tr>
                  <th scope="row" className="volunteer-availability-label-cell">
                    Are you volunteering?
                  </th>
                  <td className="volunteer-availability-value-cell">
                    <span className="volunteer-availability-value-text">
                      {isAvailable === "true" ? "Yes" : "No"}
                    </span>
                  </td>
                </tr>
                <tr>
                  <th scope="row" className="volunteer-availability-label-cell">
                    {isAvailable === "true" ? "Task Name:" : "Reason:"}
                  </th>
                  <td className="volunteer-availability-value-cell">
                    <span className="volunteer-availability-value-text">
                      {reason || "-"}
                    </span>
                  </td>
                </tr>
              </>
            ) : (
              <>
                <tr>
                  <th scope="row" className="volunteer-availability-label-cell">
                    Are you volunteering Session{" "}
                    {selectedSession?.match(/(\d+)\s*$/)?.[1] ?? "?"}?
                  </th>
                  <td className="volunteer-availability-input-cell">
                    <RadioGroup
                      row
                      value={isAvailable}
                      onChange={(event) => {
                        setIsAvailable(event.target.value);
                        setReason("");
                      }}
                      className="volunteer-availability-radio-group"
                    >
                      <FormControlLabel
                        value="true"
                        control={<Radio size="small" />}
                        label="Yes"
                        disabled={fieldsDisabled}
                      />
                      <FormControlLabel
                        value="false"
                        control={<Radio size="small" />}
                        label="No"
                        disabled={fieldsDisabled}
                      />
                    </RadioGroup>
                  </td>
                </tr>
                {isAvailable === "true" && (
                  <tr>
                    <th scope="row" className="volunteer-availability-label-cell">
                      Task Name:
                    </th>
                    <td className="volunteer-availability-input-cell">
                      {renderTaskNameField()}
                    </td>
                  </tr>
                )}
                {isAvailable === "false" && (
                  <tr>
                    <th scope="row" className="volunteer-availability-label-cell">
                      Reason:
                    </th>
                    <td className="volunteer-availability-input-cell">
                      {renderReasonField()}
                    </td>
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>

      {isReadOnlyView && (
        <Typography component="p" className="volunteer-availability-status-note">
          Your volunteer availability has been submitted. You can edit and
          resubmit before the session starts if you need to change your response.
        </Typography>
      )}

      <div className="volunteer-availability-submit-row">
        <div
          className="volunteer-availability-submit-spacer"
          aria-hidden="true"
        />
        <div className="volunteer-availability-submit-cell">
          {isReadOnlyView ? (
            <Button
              type="button"
              onClick={handleEditAvailability}
              variant="contained"
              size="small"
              startIcon={<EditIcon />}
              className="volunteer-availability-submit-btn"
            >
              Edit availability
            </Button>
          ) : (
            <>
              <Button
                type="submit"
                variant="contained"
                size="small"
                disabled={saving || loading || !selectedSession}
                className="volunteer-availability-submit-btn"
              >
                {saving ? (
                  <CircularProgress size={22} color="inherit" />
                ) : isEditing ? (
                  "Resubmit"
                ) : (
                  "Submit"
                )}
              </Button>
              {isEditing && (
                <Button
                  type="button"
                  onClick={handleCancelEdit}
                  variant="outlined"
                  disabled={saving}
                  className="volunteer-availability-cancel-btn"
                >
                  Cancel
                </Button>
              )}
            </>
          )}
          {renderStatusBadge()}
        </div>
      </div>
    </form>
  );

  const renderPanel = () => (
    <div
      className={`volunteer-availability-panel${
        embedded ? " volunteer-availability-panel--embedded" : ""
      }`}
    >
      {renderPanelHeader()}
      {loading && !hasLoadedAvailability && (
        <Typography className="volunteer-availability-loading-text">
          Loading your availability information...
        </Typography>
      )}
      {renderFormBody()}
    </div>
  );

  const roleHeader = (() => {
    if (!showOwnHeader) return null;
    if (portalRole === "instructor") {
      return (
        <>
          <InstructorHeader user={user} />
          <InstructorRoleHeaderSpacer />
        </>
      );
    }
    if (portalRole === "volunteer") {
      return (
        <>
          <VolunteerHeader user={user} />
          <VolunteerRoleHeaderSpacer />
        </>
      );
    }
    return null;
  })();

  if (!showAvailability) {
    if (embedded) return null;

    return (
      <Box className="volunteer-availability-page">
        {roleHeader}
        <div className="volunteer-availability-container">
          <div className="volunteer-availability-card">
            <div className="volunteer-availability-card-content">
              <Typography className="volunteer-availability-unavailable">
                Volunteer availability is not currently open for your account.
              </Typography>
            </div>
          </div>
        </div>
      </Box>
    );
  }

  if (embedded) {
    return (
      <>
        {renderPanel()}
        <AppSnackbar snackbar={snackbar} onClose={closeSnackbar} />
      </>
    );
  }

  return (
    <Box className="volunteer-availability-page">
      {roleHeader}

      <div className="volunteer-availability-container">
        <div className="volunteer-availability-card">
          <div className="volunteer-availability-card-content">
            {renderPanel()}
          </div>
        </div>
      </div>

      <AppSnackbar snackbar={snackbar} onClose={closeSnackbar} />
    </Box>
  );
};

export default VolunteerAvailability;
