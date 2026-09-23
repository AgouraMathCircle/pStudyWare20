import api from "./api";
import config from "../utils/config";

const BASE = "/EmailManager";
const ALLOWED_EMAIL_DOMAIN = "agouramathcircle.org";
const DOMAIN_ACCESS_MESSAGE =
  "You need agouramathcircle email to access it.";

function getCurrentUser() {
  try {
    const userData = localStorage.getItem(config.auth.userDataKey);
    return userData ? JSON.parse(userData) : {};
  } catch {
    return {};
  }
}

function getCurrentEmail() {
  const user = getCurrentUser();
  return (
    user.email ||
    user.emailID ||
    user.emailId ||
    user.username ||
    user.userName ||
    user.name ||
    ""
  );
}

function hasAllowedEmailDomain(email) {
  return `${email || ""}`.trim().toLowerCase().endsWith(`@${ALLOWED_EMAIL_DOMAIN}`);
}

function getErrorResult(error, fallback = "Network error") {
  const data = error?.response?.data;
  return {
    success: false,
    message:
      data?.message ||
      data?.errorMessage ||
      data?.error ||
      error?.message ||
      fallback,
  };
}

function mapMessage(item = {}) {
  return {
    Id: item.gmailId || item.GmailId || item.messageID || item.MessageID || item.id || item.Id,
    TrackingID: item.trackingID ?? item.TrackingID,
    From: item.senderName || item.SenderName || item.sendFrom || item.SendFrom,
    To: item.sendTo || item.SendTo,
    Subject: item.subject || item.Subject || "",
    Body: item.message || item.Message || "",
    Date: item.sendDate || item.SendDate || "",
    Status: item.status || item.Status || "",
    IsStarred: item.isStarred || item.IsStarred || false,
  };
}

export function getAuthorizedEmails() {
  const user = getCurrentUser();
  const role = (user.role || "").toLowerCase();
  const systemAdmin = user.systemAdmin === 'Y' || user.systemAdmin === true;
  const email = getCurrentEmail();

  if (role === 'superadmin' || systemAdmin) {
    return Promise.resolve({
      success: true,
      data: [
        "support@agouramathcircle.org",
        "info@agouramathcircle.org",
        "exam@agouramathcircle.org",
        "Registration@agouramathcircle.org"
      ]
    });
  }

  const allowedRoles = ['coordinator', 'volunteer', 'instructor', 'admin'];
  if (allowedRoles.includes(role)) {
    if (!hasAllowedEmailDomain(email)) {
      return Promise.resolve({
        success: false,
        message: DOMAIN_ACCESS_MESSAGE,
      });
    }
    return Promise.resolve({ success: true, data: email ? [email] : [] });
  }

  return Promise.resolve({
    success: false,
    message: "You are not authorized to access this feature."
  });
}

export function getEmailList(labelId, targetEmail, pageToken, searchQuery = '') {
  const currentEmail = getCurrentEmail();
  if (!hasAllowedEmailDomain(targetEmail || currentEmail)) {
    return Promise.resolve({
      success: false,
      message: DOMAIN_ACCESS_MESSAGE,
    });
  }

  // If fetching for their own email, send their actual email to fetch Gmail messages
  const apiUsername = (targetEmail && targetEmail !== currentEmail) ? targetEmail : currentEmail;

  // Allow all labels to hit GetGmailMessages

  return api
    .post(`${BASE}/GetGmailMessages`, { username: apiUsername, label: labelId, searchQuery: searchQuery })
    .then((response) => {
      const data = response.data || {};

      if (data.isSuccess === false || data.IsSuccess === false) {
        return {
          success: false,
          message: data.errorMessage || data.ErrorMessage || "Failed to load messages",
        };
      }

      let messages = data.messages || data.Messages || [];

      return {
        success: true,
        data: {
          Items: messages.map(mapMessage),
          NextPageToken: null,
        },
      };
    })
    .catch((error) => getErrorResult(error, "Failed to load messages"));
}

export function getEmailBody(id, targetEmail) {
  if (!hasAllowedEmailDomain(targetEmail || getCurrentEmail())) {
    return Promise.resolve({
      success: false,
      message: DOMAIN_ACCESS_MESSAGE,
    });
  }

  // Gmail IDs are typically 16-character hex strings, while legacy IDs are numeric ints (usually short)
  const isGmailId = typeof id === 'string' && id.length > 10;
  
  if (isGmailId) {
    return api
      .post(`${BASE}/GetGmailMessage`, { username: targetEmail || getCurrentEmail(), gmailId: id })
      .then((response) => {
        const data = response.data || {};
        if (data.isSuccess === false || data.IsSuccess === false) {
          return { success: false, message: data.errorMessage || data.ErrorMessage || "Failed to load Gmail message" };
        }
        const message = data.message || data.Message || {};
        return {
          success: true,
          data: {
            id: message.gmailId || message.GmailId || id,
            from: message.senderName || message.SenderName || message.sendFrom || message.SendFrom,
            to: message.sendTo || message.SendTo || targetEmail || getCurrentEmail(),
            subject: message.subject || message.Subject || "",
            body: message.message || message.Message || "",
            date: message.sendDate || message.SendDate || "",
          },
        };
      })
      .catch((error) => getErrorResult(error, "Failed to load Gmail message"));
  }

  return api
    .post(`${BASE}/GetMessage`, { emailID: id })
    .then((response) => {
      const data = response.data || {};

      if (data.isSuccess === false || data.IsSuccess === false) {
        return {
          success: false,
          message: data.errorMessage || data.ErrorMessage || "Failed to load message",
        };
      }

      const message = data.message || data.Message || {};
      return {
        success: true,
        data: {
          id: message.messageID ?? message.MessageID ?? id,
          from: message.senderName || message.SenderName || message.sendFrom || message.SendFrom,
          to: message.sendTo || message.SendTo,
          subject: message.subject || message.Subject || "",
          body: message.message || message.Message || "",
          date: message.sendDate || message.SendDate || "",
        },
      };
    })
    .catch((error) => getErrorResult(error, "Failed to load message"));
}

export function getEmailSuggestions() {
  return Promise.resolve({ success: true, data: [] });
}

export function sendOrDraftEmail({ to, cc, bcc, subject, body, isDraft, scheduledTime, targetEmail, replyToEmailID, mode }) {
  if (!hasAllowedEmailDomain(targetEmail || getCurrentEmail())) {
    return Promise.resolve({
      success: false,
      message: DOMAIN_ACCESS_MESSAGE,
    });
  }

  if (isDraft) {
    return Promise.resolve({
      success: false,
      message: "Draft is not supported by the current backend API.",
    });
  }

  const user = getCurrentUser();
  const sendFrom = targetEmail || getCurrentEmail();
  const apiSendFrom = (targetEmail && targetEmail !== getCurrentEmail()) ? targetEmail : getCurrentEmail();
  const fromName = user.fullName || user.name || user.userName || sendFrom;

  return api
    .post(`${BASE}/SendGmailMessage`, {
      username: apiSendFrom,
      to: to,
      cc: cc || "",
      bcc: bcc || "",
      subject: subject,
      body: body,
      fromName: fromName
    })
    .then((response) => {
      const data = response.data || {};

      if (data.isSuccess === false || data.IsSuccess === false) {
        return {
          success: false,
          message: data.errorMessage || data.ErrorMessage || "Failed to send message",
        };
      }

      return {
        success: true,
        message: data.message || data.Message || "Message sent successfully",
      };
    })
    .catch((error) => getErrorResult(error, "Failed to send message"));
}

export function toggleMessageStar(targetEmail, gmailId, isStarred) {
  if (!hasAllowedEmailDomain(targetEmail || getCurrentEmail())) {
    return Promise.resolve({
      success: false,
      message: DOMAIN_ACCESS_MESSAGE,
    });
  }

  const apiUsername = (targetEmail && targetEmail !== getCurrentEmail()) ? targetEmail : getCurrentEmail();

  return api
    .post(`${BASE}/ToggleMessageStar`, { username: apiUsername, gmailId, isStarred })
    .then((response) => {
      const data = response.data || {};
      if (data.isSuccess === false || data.IsSuccess === false || data.success === false) {
        return { success: false, message: data.message || data.errorMessage || "Failed to toggle star status" };
      }
      return { success: true, message: data.message || "Star status toggled" };
    })
    .catch((error) => getErrorResult(error, "Failed to toggle star status"));
}

export default {
  getAuthorizedEmails,
  getEmailList,
  getEmailBody,
  getEmailSuggestions,
  sendOrDraftEmail,
  toggleMessageStar
};
