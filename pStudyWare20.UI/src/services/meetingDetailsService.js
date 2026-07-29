import api from "./api";

const MEETING_DETAILS_API_BASE_URL = "/MeetingDetails";

const meetingDetailsService = {
  /**
   * Dashboard meeting schedules for the signed-in user (AMC_spMeetingSchedule_Select).
   * @param {string} username - Portal username (MemberMaster.Username)
   * @returns {Promise<object>} Meeting schedule list response
   */
  getAllMeetingSchedules: async (username) => {
    try {
      const params = username ? { username } : {};
      const response = await api.get(
        `${MEETING_DETAILS_API_BASE_URL}/GetAllMeetingSchedules`,
        { params }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching meeting schedules:", error);
      throw error;
    }
  },

  /**
   * SystemAdmin Meeting Details grid (all rows — AMC_tblMeetingSchedule_Select).
   * @returns {Promise<object>} Meeting schedule list response
   */
  getMeetingScheduleGrid: async () => {
    try {
      const response = await api.get(
        `${MEETING_DETAILS_API_BASE_URL}/GetMeetingScheduleGrid`,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching meeting schedule grid:", error);
      throw error;
    }
  },

  /**
   * Gets meeting schedule by ID
   * @param {number} rowId - Row ID
   * @returns {Promise<object>} Meeting schedule response
   */
  getMeetingScheduleById: async (rowId) => {
    try {
      const response = await api.get(
        `${MEETING_DETAILS_API_BASE_URL}/GetMeetingSchedule/${rowId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching meeting schedule:", error);
      throw error;
    }
  },

  /**
   * Creates or updates a meeting schedule
   * @param {object} request - Upsert meeting schedule request
   * @param {string} request.rowId - Row ID (0 for new)
   * @param {string} request.chapterId - Chapter ID
   * @param {string} request.class - Class
   * @param {string} request.section - Section
   * @param {string} request.meetingProviderUrl - Meeting Provider URL
   * @param {string} request.meetingUrl - Meeting URL
   * @param {string} request.meetingId - Meeting ID
   * @param {string} request.passcode - Passcode
   * @param {string} request.adminLogin - Admin Login
   * @param {string} request.adminPassCode - Admin Pass Code
   * @param {string} request.includeSection - Include Section (0 or 1)
   * @param {string} request.active - Active (0 or 1)
   * @param {string} request.meetingTime - Meeting Time (HH:mm)
   * @param {string} request.meetingDate - Meeting Date (MM/DD/YYYY)
   * @returns {Promise<object>} Upsert meeting schedule response
   */
  upsertMeetingSchedule: async (request) => {
    try {
      const response = await api.post(
        `${MEETING_DETAILS_API_BASE_URL}/UpsertMeetingSchedule`,
        request
      );
      return response.data;
    } catch (error) {
      console.error("Error upserting meeting schedule:", error);
      throw error;
    }
  },

  /**
   * Gets chapter locations
   * @param {string} activeOnly - Active only flag (default: "Y")
   * @returns {Promise<object>} Chapter location response
   */
  getChapterLocations: async (activeOnly = "Y") => {
    try {
      const response = await api.get(
        `${MEETING_DETAILS_API_BASE_URL}/GetChapterLocations`,
        {
          params: { activeOnly },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching chapter locations:", error);
      throw error;
    }
  },

  /**
   * Prepares new meeting form data
   * @returns {Promise<object>} Prepare new meeting response
   */
  prepareNewMeeting: async () => {
    try {
      const response = await api.post(
        `${MEETING_DETAILS_API_BASE_URL}/PrepareNewMeeting`,
        {}
      );
      return response.data;
    } catch (error) {
      console.error("Error preparing new meeting:", error);
      throw error;
    }
  },

  /**
   * Checks meeting details privileges for current user
   * @returns {Promise<object>} Meeting details privileges response
   */
  checkMeetingDetailsPrivileges: async () => {
    try {
      const response = await api.get(
        `${MEETING_DETAILS_API_BASE_URL}/CheckMeetingDetailsPrivileges`
      );
      return response.data;
    } catch (error) {
      console.error("Error checking meeting details privileges:", error);
      throw error;
    }
  },
};

export default meetingDetailsService;
