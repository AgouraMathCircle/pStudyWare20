using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;
using System.Data;

namespace pStudyWare20.Services.Implementations
{
    /// <summary>
    /// Service implementation for special events registration business logic
    /// </summary>
    public class SpecialEventsRegistrationService : ISpecialEventsRegistrationService
    {
        private readonly ISpecialEventsRegistrationRepository _specialEventsRegistrationRepository;

        public SpecialEventsRegistrationService(ISpecialEventsRegistrationRepository specialEventsRegistrationRepository)
        {
            _specialEventsRegistrationRepository = specialEventsRegistrationRepository;
        }

        /// <summary>
        /// Get special events registration list
        /// </summary>
        public async Task<SpecialEventsRegistrationListResponse> GetSpecialEventsRegistrationListAsync(SpecialEventsRegistrationListRequest request)
        {
            try
            {
                var specialEventsRegistrationList = await _specialEventsRegistrationRepository.GetSpecialEventsRegistrationListAsync(request.Username);

                return new SpecialEventsRegistrationListResponse
                {
                    IsSuccess = true,
                    SpecialEventsRegistrationList = specialEventsRegistrationList is DataTable dt
                        ? ConvertDataTableToRowList(dt)
                        : specialEventsRegistrationList
                };
            }
            catch (Exception ex)
            {
                return new SpecialEventsRegistrationListResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        /// <summary>
        /// Delete special events registration application
        /// </summary>
        public async Task<DeleteSpecialEventsRegistrationResponse> DeleteSpecialEventsRegistrationAsync(DeleteSpecialEventsRegistrationRequest request)
        {
            try
            {
                await _specialEventsRegistrationRepository.DeleteSpecialEventsRegistrationAsync(request.RequestId);

                return new DeleteSpecialEventsRegistrationResponse
                {
                    IsSuccess = true,
                    Message = "Application has been deleted successfully"
                };
            }
            catch (Exception ex)
            {
                return new DeleteSpecialEventsRegistrationResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        /// <summary>
        /// Export special events registration data to Excel
        /// </summary>
        public async Task<ExportSpecialEventsRegistrationExcelResponse> ExportSpecialEventsRegistrationToExcelAsync(ExportSpecialEventsRegistrationExcelRequest request)
        {
            try
            {
                var specialEventsRegistrationList = await _specialEventsRegistrationRepository.GetSpecialEventsRegistrationListForExportAsync(request.Username);

                if (specialEventsRegistrationList is DataTable dataTable && dataTable.Rows.Count > 0)
                {
                    return new ExportSpecialEventsRegistrationExcelResponse
                    {
                        IsSuccess = true,
                        FileName = "SpecialEventsRegistration.xlsx",
                        FileContent = DataTableExcelExporter.ToXlsxBytes(dataTable, "SpecialEvents"),
                        ContentType = DataTableExcelExporter.XlsxContentType
                    };
                }

                return new ExportSpecialEventsRegistrationExcelResponse
                {
                    IsSuccess = false,
                    ErrorMessage = "No data available for export"
                };
            }
            catch (Exception ex)
            {
                return new ExportSpecialEventsRegistrationExcelResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        /// <summary>
        /// Get special events registration dashboard data
        /// </summary>
        public async Task<SpecialEventsRegistrationDashboardResponse> GetDashboardDataAsync(SpecialEventsRegistrationDashboardRequest request)
        {
            try
            {
                var specialEventsRegistrationList = await _specialEventsRegistrationRepository.GetSpecialEventsRegistrationListAsync(request.Username);

                return new SpecialEventsRegistrationDashboardResponse
                {
                    IsSuccess = true,
                    SpecialEventsRegistrationList = specialEventsRegistrationList is DataTable dt
                        ? ConvertDataTableToRowList(dt)
                        : specialEventsRegistrationList
                };
            }
            catch (Exception ex)
            {
                return new SpecialEventsRegistrationDashboardResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        /// <summary>
        /// Handle special events registration action (Delete)
        /// </summary>
        public async Task<SpecialEventsRegistrationActionResponse> HandleSpecialEventsRegistrationActionAsync(SpecialEventsRegistrationActionRequest request)
        {
            try
            {
                var response = new SpecialEventsRegistrationActionResponse { IsSuccess = true };

                switch (request.Action.ToUpper())
                {
                    case "D": // Delete
                        var deleteResult = await DeleteSpecialEventsRegistrationAsync(new DeleteSpecialEventsRegistrationRequest { RequestId = request.RequestId });
                        if (deleteResult.IsSuccess)
                        {
                            response.Message = deleteResult.Message;
                        }
                        else
                        {
                            response.IsSuccess = false;
                            response.ErrorMessage = deleteResult.ErrorMessage;
                        }
                        break;

                    default:
                        response.IsSuccess = false;
                        response.ErrorMessage = "Invalid action specified";
                        break;
                }

                return response;
            }
            catch (Exception ex)
            {
                return new SpecialEventsRegistrationActionResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        /// <summary>
        /// System.Text.Json cannot serialize DataTable. Convert to row dictionaries with camelCase keys.
        /// </summary>
        private static List<Dictionary<string, object?>> ConvertDataTableToRowList(DataTable? table)
        {
            var list = new List<Dictionary<string, object?>>();
            if (table == null || table.Rows.Count == 0)
                return list;

            foreach (DataRow row in table.Rows)
            {
                var dict = new Dictionary<string, object?>();
                foreach (DataColumn col in table.Columns)
                {
                    var key = ToCamelCaseColumnName(col.ColumnName);
                    dict[key] = row[col] == DBNull.Value ? null : row[col];
                }
                list.Add(dict);
            }

            return list;
        }

        private static string ToCamelCaseColumnName(string name)
        {
            if (string.IsNullOrEmpty(name))
                return name;
            if (name.Length == 1)
                return name.ToLowerInvariant();
            return char.ToLowerInvariant(name[0]) + name.Substring(1);
        }

    }
}
