using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;

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
                
                return new InstructorStudentListResponse
                {
                    IsSuccess = true,
                    StudentList = studentList
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
                
                return new InstructorDashboardDataResponse
                {
                    IsSuccess = true,
                    StudentList = studentList,
                    DashboardData = new
                    {
                        StudentCount = GetStudentCount(studentList),
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
        /// Helper method to get student count from student list data
        /// </summary>
        private int GetStudentCount(object studentList)
        {
            try
            {
                if (studentList is System.Data.DataTable dataTable)
                {
                    return dataTable.Rows.Count;
                }
                return 0;
            }
            catch
            {
                return 0;
            }
        }
    }
}
