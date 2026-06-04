import api from "./api";
import config from "../utils/config";

const BASE = "/EmailManager";
const ALLOWED_EMAIL_DOMAIN = "agouramathcircle.org";
const DOMAIN_ACCESS_MESSAGE =
  "You do not have an agouramathcircle email to access this feature.";

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
    Id: item.messageID ?? item.MessageID ?? item.id ?? item.Id,
    TrackingID: item.trackingID ?? item.TrackingID,
    From: item.senderName || item.SenderName || item.sendFrom || item.SendFrom,
    To: item.sendTo || item.SendTo,
    Subject: item.subject || item.Subject || "",
    Body: item.message || item.Message || "",
    Date: item.sendDate || item.SendDate || "",
    Status: item.status || item.Status || "",
  };
}

export function getAuthorizedEmails() {
  const email = getCurrentEmail();
  if (!hasAllowedEmailDomain(email)) {
    return Promise.resolve({
      success: false,
      message: DOMAIN_ACCESS_MESSAGE,
    });
  }

  return Promise.resolve({ success: true, data: email ? [email] : [] });
}

export function getEmailList(labelId, targetEmail, pageToken) {
  if (!hasAllowedEmailDomain(targetEmail || getCurrentEmail())) {
    return Promise.resolve({
      success: false,
      message: DOMAIN_ACCESS_MESSAGE,
    });
  }

  if (labelId === "SENT") {
    const url = `/SentEmail/GetSentMessages?username=${encodeURIComponent(targetEmail || "")}`;
    return api
      .get(url)
      .then((response) => {
        const data = response.data || {};
        if (data.isSuccess === false || data.IsSuccess === false) {
          return {
            success: false,
            message: data.errorMessage || data.ErrorMessage || "Failed to load sent messages",
          };
        }
        const messages = data.messages || data.Messages || [];
        return {
          success: true,
          data: {
            Items: messages.map(mapMessage),
            NextPageToken: null,
          },
        };
      })
      .catch((error) => getErrorResult(error, "Failed to load sent messages"));
  }

  if (labelId && labelId !== "INBOX") {
    return Promise.resolve({ success: true, data: { Items: [] } });
  }

  return api
    .post(`${BASE}/GetMessages`, { username: targetEmail || "" })
    .then((response) => {
      const data = response.data || {};

      if (data.isSuccess === false || data.IsSuccess === false) {
        return {
          success: false,
          message: data.errorMessage || data.ErrorMessage || "Failed to load messages",
        };
      }

      const messages = data.messages || data.Messages || [];
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
  const fromName = user.fullName || user.name || user.userName || sendFrom;

  return api
    .post(`${BASE}/SendMessage`, {
      sendTo: to,
      sendFrom,
      subject,
      message: body,
      sendBy: sendFrom,
      replyToEmailID: replyToEmailID || 0,
      mode: mode || "N",
      chapterID: user.chapterID || user.chapterId || "",
      memberType: user.memberType || "",
      fromName,
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

export default {
  getAuthorizedEmails,
  getEmailList,
  getEmailBody,
  getEmailSuggestions,
  sendOrDraftEmail
};
