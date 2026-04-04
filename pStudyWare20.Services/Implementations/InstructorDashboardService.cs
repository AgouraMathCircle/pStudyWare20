using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;
using System.Data;

namespace pStudyWare20.Services.Implementations
{
    /// <summary>
    /// Service implementation for instructor dashboard business logic
    /// </summary>
    public class InstructorDashboardService : IInstructorDashboardService
    {
        private readonly IInstructorDashboardRepository _instructorDashboardRepository;

        public InstructorDashboardService(IInstructorDashboardRepository instructorDashboardRepository)
        {
            _instructorDashboardRepository = instructorDashboardRepository;
        }

        /// <summary>
        /// Get student list for instructor dashboard
        /// </summary>
        public async Task<InstructorStudentListResponse> GetStudentListAsync(InstructorStudentListRequest request)
        {
            try
            {
                var studentList = await _instructorDashboardRepository.GetStudentListForInstructorAsync(request.Username);
                var rows = NormalizeStudentList(studentList);

                return new InstructorStudentListResponse
                {
                    IsSuccess = true,
                    StudentList = rows
                };
            }
            catch (Exception ex)
            {
                return new InstructorStudentListResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        /// <summary>
        /// Get instructor dashboard data (combines multiple data sources)
        /// </summary>
        public async Task<InstructorDashboardDataResponse> GetDashboardDataAsync(InstructorDashboardDataRequest request)
        {
            try
            {
                // Get student list for the instructor
                var studentList = await _instructorDashboardRepository.GetStudentListForInstructorAsync(request.Username);
                var rows = NormalizeStudentList(studentList);

                return new InstructorDashboardDataResponse
                {
                    IsSuccess = true,
                    StudentList = rows,
                    DashboardData = new
                    {
                        StudentCount = rows.Count,
                        LastUpdated = DateTime.UtcNow,
                        InstructorUsername = request.Username
                    }
                };
            }
            catch (Exception ex)
            {
                return new InstructorDashboardDataResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        /// <summary>
        /// Convert <see cref="DataTable"/> from AMC_spSelectStudentList to JSON-friendly row dictionaries.
        /// </summary>
        private static List<Dictionary<string, object?>> NormalizeStudentList(object studentList)
        {
            if (studentList is DataTable dt)
                return DataTableToRows(dt);
            if (studentList is List<Dictionary<string, object?>> already)
                return already;
            return new List<Dictionary<string, object?>>();
        }

        private static List<Dictionary<string, object?>> DataTableToRows(DataTable dt)
        {
            var list = new List<Dictionary<string, object?>>(dt.Rows.Count);
            foreach (DataRow row in dt.Rows)
            {
                var dict = new Dictionary<string, object?>(StringComparer.OrdinalIgnoreCase);
                foreach (DataColumn col in dt.Columns)
                {
                    var val = row[col];
                    dict[col.ColumnName] = val == DBNull.Value ? null : val;
                }
                list.Add(dict);
            }
            return list;
        }
    }
}
