/**
 * Legacy volunteer availability session helpers (pStudyware_DashboardMessage.ascx.cs).
 */

const SESSION_ONLY_PATTERN = /^Session\s+\d+$/i;

export const extractSessionNumber = (sessionText) => {
  const text = `${sessionText || ""}`.trim();
  if (!text) return null;

  const parts = text.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    const legacyNumber = parseInt(parts[1], 10);
    if (!Number.isNaN(legacyNumber)) {
      return legacyNumber;
    }
  }

  const trailingNumber = parseInt(parts[parts.length - 1], 10);
  return Number.isNaN(trailingNumber) ? null : trailingNumber;
};

/** DB session for AMC_VolunteerAvailability — same number as AMC_spSelectCurrentSession. */
export const getTargetSessionForDb = (currentSession) => {
  const text = `${currentSession || ""}`.trim();
  if (!text) return "";

  const sessionNumber = extractSessionNumber(text);
  if (sessionNumber == null) return text;

  const parts = text.split(/\s+/).filter(Boolean);

  if (parts.length >= 2 && !Number.isNaN(parseInt(parts[1], 10))) {
    return `${parts[0]} ${sessionNumber}`.trim();
  }

  return `Session ${sessionNumber}`;
};

export const normalizeSubmittedSession = (submittedSession, currentSession) => {
  const expected = getTargetSessionForDb(currentSession);
  if (expected) {
    return expected;
  }

  const submitted = `${submittedSession || ""}`.trim();
  if (!submitted) {
    return "";
  }

  if (SESSION_ONLY_PATTERN.test(submitted)) {
    return submitted;
  }

  const submittedNumber = extractSessionNumber(submitted);
  if (submittedNumber != null) {
    return `Session ${submittedNumber}`;
  }

  return submitted;
};

/** Table row labels: "Are you Volunteering Fall" | "Session 1" */
export const getVolunteeringSessionTableLabels = (sessionText) => {
  const session = `${sessionText || ""}`.trim();
  if (!session) {
    return {
      volunteeringLabel: "Are you Volunteering",
      sessionValue: "-",
    };
  }

  const match = session.match(/^(.*?)(\d+)\s*$/);
  if (!match) {
    return {
      volunteeringLabel: "Are you Volunteering",
      sessionValue: session,
    };
  }

  const prefix = match[1].trim();
  const sessionNumber = match[2];
  const prefixParts = prefix.split(/\s+/).filter(Boolean);

  if (
    prefixParts.length >= 2 &&
    prefixParts[prefixParts.length - 1].toLowerCase() === "session"
  ) {
    const term = prefixParts.slice(0, -1).join(" ");
    return {
      volunteeringLabel: term
        ? `Are you Volunteering ${term}`
        : "Are you Volunteering",
      sessionValue: `Session ${sessionNumber}`,
    };
  }

  return {
    volunteeringLabel: "Are you Volunteering",
    sessionValue: session,
  };
};

export const buildVolunteeringPrompt = (targetSession) => {
  const session = `${targetSession || ""}`.trim();
  return session ? `Are you Volunteering ${session}?` : "Are you Volunteering?";
};
