import api from "./api";

const BASE = "/VolunteerAvailability";

const normalizeGetResponse = (body = {}) => ({
  isSuccess: body.isSuccess ?? body.IsSuccess ?? true,
  hasValue: Boolean(body.hasValue ?? body.HasValue),
  response: String(body.response ?? body.Response ?? "").trim(),
  comments: String(body.comments ?? body.Comments ?? "").trim(),
  errorMessage: body.errorMessage ?? body.ErrorMessage ?? "",
  message: body.message ?? body.Message ?? "",
});

const normalizeUpdateResponse = (body = {}) => ({
  isSuccess: body.isSuccess ?? body.IsSuccess ?? true,
  message: body.message ?? body.Message ?? "",
  errorMessage: body.errorMessage ?? body.ErrorMessage ?? "",
  session: String(body.session ?? body.Session ?? "").trim(),
  summaryData: normalizeSummaryRows(body.summaryData ?? body.SummaryData),
});

const buildRequestPayload = (request = {}) => ({
  userID: String(request.userID ?? request.userId ?? request.UserID ?? ""),
  session: String(request.session ?? request.Session ?? "").trim(),
  semester: String(request.semester ?? request.Semester ?? "").trim(),
  response: request.response ?? request.Response,
  comment: request.comment ?? request.comments ?? request.Comment ?? "",
});

const normalizeSummaryRows = (data) => (Array.isArray(data) ? data : []);

const normalizeSummaryResponse = (body = {}) => ({
  isSuccess: body.isSuccess ?? body.IsSuccess ?? true,
  summaryData: normalizeSummaryRows(body.summaryData ?? body.SummaryData),
  errorMessage: body.errorMessage ?? body.ErrorMessage ?? "",
});

const normalizeFormContextResponse = (body = {}) => ({
  isSuccess: body.isSuccess ?? body.IsSuccess ?? true,
  currentSession: String(body.currentSession ?? body.CurrentSession ?? "").trim(),
  targetSession: String(body.targetSession ?? body.TargetSession ?? "").trim(),
  volunteeringPrompt: String(
    body.volunteeringPrompt ?? body.VolunteeringPrompt ?? "",
  ).trim(),
  semester: String(body.semester ?? body.Semester ?? "").trim(),
  errorMessage: body.errorMessage ?? body.ErrorMessage ?? "",
});

const volunteerAvailabilityService = {
  getFormContext: async () => {
    const response = await api.post(`${BASE}/GetFormContext`, {});
    return normalizeFormContextResponse(response.data);
  },

  getAvailability: async (request) => {
    const payload = buildRequestPayload(request);
    const response = await api.post(`${BASE}/GetAvailability`, {
      userID: payload.userID,
      session: payload.session,
      semester: payload.semester,
    });
    return normalizeGetResponse(response.data);
  },

  updateAvailability: async (request) => {
    const payload = buildRequestPayload(request);
    const response = await api.post(`${BASE}/UpdateAvailability`, {
      userID: payload.userID,
      session: payload.session,
      semester: payload.semester,
      response: payload.response,
      comment: payload.comment,
    });
    return normalizeUpdateResponse(response.data);
  },

  getAvailabilitySummary: async (request) => {
    const response = await api.post(`${BASE}/GetAvailabilitySummary`, request);
    return normalizeSummaryResponse(response.data);
  },
};

export default volunteerAvailabilityService;
