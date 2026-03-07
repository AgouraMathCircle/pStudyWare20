import api from "./api";

const BASE = "/PostMessage";

const postMessageService = {
  getAlertList: async (request) => {
    const response = await api.post(`${BASE}/GetAlertList`, request);
    return response.data;
  },
  insertOrUpdatePostMessage: async (request) => {
    const response = await api.post(
      `${BASE}/InsertOrUpdatePostMessage`,
      request
    );
    return response.data;
  },
  deletePostMessage: async (request) => {
    const response = await api.post(`${BASE}/DeletePostMessage`, request);
    return response.data;
  },
};

export default postMessageService;
