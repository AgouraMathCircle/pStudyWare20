using pStudyWare20.Shared;

namespace pStudyWare20.Services.Interfaces
{
    /// <summary>
    /// Service interface for report card business logic
    /// </summary>
    public interface IReportCardService
    {
        /// <summary>
        /// Get report card list
        /// </summary>
        /// <param name="request">Report card list request</param>
        /// <returns>Report card list response</returns>
        Task<ReportCardListResponse> GetReportCardListAsync(ReportCardListRequest request);

        /// <summary>
        /// Get score details for editing
        /// </summary>
        /// <param name="request">Get score details request</param>
        /// <returns>Get score details response</returns>
        Task<GetScoreDetailsResponse> GetScoreDetailsAsync(GetScoreDetailsRequest request);

        /// <summary>
        /// Delete student score
        /// </summary>
        /// <param name="request">Delete score request</param>
        /// <returns>Delete score response</returns>
        Task<DeleteScoreResponse> DeleteStudentScoreAsync(DeleteScoreRequest request);

        /// <summary>
        /// Add student score
        /// </summary>
        /// <param name="request">Add student score request</param>
        /// <returns>Student score response</returns>
        Task<StudentScoreResponse> AddStudentScoreAsync(AddStudentScoreRequest request);

        /// <summary>
        /// Update student score
        /// </summary>
        /// <param name="request">Update student score request</param>
        /// <returns>Student score response</returns>
        Task<StudentScoreResponse> UpdateStudentScoreAsync(UpdateStudentScoreRequest request);

        /// <summary>
        /// View report (summary or semester)
        /// </summary>
        /// <param name="request">View report request</param>
        /// <returns>View report response</returns>
        Task<ViewReportResponse> ViewReportAsync(ViewReportRequest request);

        /// <summary>
        /// Send email notification
        /// </summary>
        /// <param name="request">Send email request</param>
        /// <returns>Send email response</returns>
        Task<SendEmailResponse> SendEmailAsync(SendEmailRequest request);

        /// <summary>
        /// Import scores from Excel
        /// </summary>
        /// <param name="request">Excel import request</param>
        /// <returns>Excel import response</returns>
        Task<ExcelImportResponse> ImportScoresFromExcelAsync(ExcelImportRequest request);

        /// <summary>
        /// Export data to Excel
        /// </summary>
        /// <param name="request">Excel export request</param>
        /// <returns>Excel export response</returns>
        Task<ExcelExportResponse> ExportToExcelAsync(ExcelExportRequest request);

        /// <summary>
        /// Get report card dashboard data
        /// </summary>
        /// <param name="request">Dashboard request</param>
        /// <returns>Dashboard response</returns>
        Task<ReportCardDashboardResponse> GetDashboardDataAsync(ReportCardDashboardRequest request);

        /// <summary>
        /// Handle score action (Edit, Delete)
        /// </summary>
        /// <param name="request">Score action request</param>
        /// <returns>Score action response</returns>
        Task<ScoreActionResponse> HandleScoreActionAsync(ScoreActionRequest request);

        /// <summary>
        /// Send student report card email
        /// </summary>
        /// <param name="request">Send student report email request</param>
        /// <returns>Send student report email response</returns>
        Task<SendStudentReportEmailResponse> SendStudentReportEmailAsync(SendStudentReportEmailRequest request);
    }
}
