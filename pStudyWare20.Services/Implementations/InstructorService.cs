using Microsoft.Extensions.Configuration;
using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;
using System.Text.Json;

namespace pStudyWare20.Services.Implementations
{
    /// <summary>
    /// Implementation of instructor business logic operations (matches legacy controller)
    /// </summary>
    public class InstructorService : IInstructorService
    {
        private readonly IInstructorRepository _instructorRepository;
        private readonly IConfiguration _configuration;

        public InstructorService(IInstructorRepository instructorRepository, IConfiguration configuration)
        {
            _instructorRepository = instructorRepository;
            _configuration = configuration;
        }

        /// <summary>
        /// Get instructor list (matches legacy controller exactly)
        /// </summary>
        public InstructorListResponse GetInstructorList(InstructorListRequest request)
        {
            InstructorListResponse response = new InstructorListResponse();
            try
            {
                var result = _instructorRepository.GetInstructorListAsync(request).Result;
                
                if (!string.IsNullOrEmpty(result))
                {
                    var dataTable = JsonSerializer.Deserialize<System.Data.DataTable>(result);
                    if (dataTable != null && dataTable.Rows.Count > 0)
                    {
                        foreach (System.Data.DataRow row in dataTable.Rows)
                        {
                            var instructor = new Instructor
                            {
                                InstructorID = Convert.ToInt32(row["InstructorID"]),
                                FirstName = row["FirstName"]?.ToString() ?? string.Empty,
                                LastName = row["LastName"]?.ToString() ?? string.Empty,
                                EmailID = row["EmailID"]?.ToString() ?? string.Empty,
                                ContactPhone = row["ContactPhone"]?.ToString() ?? string.Empty,
                                ChapterName = row["ChapterName"]?.ToString() ?? string.Empty,
                                ChapterID = row["ChapterID"]?.ToString() ?? string.Empty,
                                InstructorType = row["InstructorType"]?.ToString() ?? string.Empty,
                                Class = row["Class"]?.ToString() ?? string.Empty,
                                Section = row["Section"]?.ToString() ?? string.Empty,
                                UserName = row["UserName"]?.ToString() ?? string.Empty,
                                MemberStatus = row["mStatus"]?.ToString() ?? string.Empty,
                                LastLogin = row["LastLogin"] != DBNull.Value ? Convert.ToDateTime(row["LastLogin"]) : null
                            };

                            // Create InstructorInfo string for legacy compatibility
                            instructor.InstructorInfo = $"{instructor.FirstName}~#{instructor.LastName}~#{instructor.EmailID}~#{instructor.ContactPhone}~#{instructor.InstructorType}~#{instructor.Class}~#{instructor.Section}~#{instructor.ChapterID}~#{instructor.MemberStatus}";

                            response.InstructorList.Add(instructor);
                        }
                    }
                }

                response.IsSuccess = true;
                response.ErrorMessage = "";
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.ErrorMessage = ex.Message;
            }

            return response;
        }

        /// <summary>
        /// Add or update instructor (matches legacy controller exactly)
        /// </summary>
        public InstructorOperationResponse AddOrUpdateInstructor(InstructorRequest request)
        {
            InstructorOperationResponse response = new InstructorOperationResponse();
            try
            {
                var result = _instructorRepository.AddOrUpdateInstructorAsync(request).Result;

                if (result)
                {
                    response.IsSuccess = true;
                    response.ErrorMessage = "";
                    response.Message = "User has been created/Updated successfully";
                }
                else
                {
                    response.IsSuccess = false;
                    response.ErrorMessage = "Failed to add or update instructor";
                    response.Message = "";
                }
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.ErrorMessage = ex.Message;
                response.Message = "";
            }

            return response;
        }

        /// <summary>
        /// Delete instructor (matches legacy controller exactly)
        /// </summary>
        public InstructorOperationResponse DeleteInstructor(InstructorDeleteRequest request)
        {
            InstructorOperationResponse response = new InstructorOperationResponse();
            try
            {
                var result = _instructorRepository.DeleteInstructorAsync(request).Result;

                if (result)
                {
                    response.IsSuccess = true;
                    response.ErrorMessage = "";
                    response.Message = "User has been deleted successfully";
                }
                else
                {
                    response.IsSuccess = false;
                    response.ErrorMessage = "Failed to delete instructor";
                    response.Message = "";
                }
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.ErrorMessage = ex.Message;
                response.Message = "";
            }

            return response;
        }

        /// <summary>
        /// Export instructor list to Excel (matches legacy controller exactly)
        /// </summary>
        public ExportExcelResponse ExportInstructorListToExcel(InstructorListRequest request)
        {
            ExportExcelResponse response = new ExportExcelResponse();
            try
            {
                var dataTable = _instructorRepository.ExportInstructorListToExcelAsync(request).Result;

                if (dataTable != null && dataTable.Rows.Count > 0)
                {
                    // Convert DataTable to Excel format (simplified version)
                    var excelContent = ConvertDataTableToExcel(dataTable);
                    
                    response.IsSuccess = true;
                    response.ErrorMessage = "";
                    response.FileContent = excelContent;
                    response.FileName = "InstructorList.xls";
                    response.ContentType = "application/octet-stream";
                }
                else
                {
                    response.IsSuccess = false;
                    response.ErrorMessage = "No data found to export";
                }
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.ErrorMessage = ex.Message;
            }

            return response;
        }

        /// <summary>
        /// Convert DataTable to Excel format (simplified implementation)
        /// </summary>
        private byte[] ConvertDataTableToExcel(System.Data.DataTable dataTable)
        {
            var sb = new System.Text.StringBuilder();
            
            // Add HTML table structure for Excel compatibility
            sb.AppendLine("<html><head><meta charset='utf-8'></head><body>");
            sb.AppendLine("<table border='1'>");
            
            // Add headers
            sb.AppendLine("<tr>");
            foreach (System.Data.DataColumn column in dataTable.Columns)
            {
                sb.AppendLine($"<th>{column.ColumnName}</th>");
            }
            sb.AppendLine("</tr>");
            
            // Add data rows
            foreach (System.Data.DataRow row in dataTable.Rows)
            {
                sb.AppendLine("<tr>");
                foreach (var item in row.ItemArray)
                {
                    sb.AppendLine($"<td>{item}</td>");
                }
                sb.AppendLine("</tr>");
            }
            
            sb.AppendLine("</table></body></html>");
            
            return System.Text.Encoding.UTF8.GetBytes(sb.ToString());
        }
    }
}
