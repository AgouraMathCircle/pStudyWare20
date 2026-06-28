using System.Data;
using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;

namespace pStudyWare20.Services.Implementations
{
    public class SemesterLookupService : ISemesterLookupService
    {
        private readonly ISemesterLookupRepository _repository;

        public SemesterLookupService(ISemesterLookupRepository repository)
        {
            _repository = repository;
        }

        public async Task<GetSemesterLookupResponse> GetSemesterLookupAsync(string? chapterIdFromClient)
        {
            try
            {
                var table = await _repository.SelectSemesterLookupAsync();
                if (table.Rows.Count == 0)
                {
                    return new GetSemesterLookupResponse
                    {
                        IsSuccess = true,
                        Lookup = new SemesterLookupDto(),
                        CanUpdate = CanUpdateSemesterLookup(chapterIdFromClient)
                    };
                }

                var row = table.Rows[0];
                var dto = MapRow(row);
                return new GetSemesterLookupResponse
                {
                    IsSuccess = true,
                    Lookup = dto,
                    CanUpdate = CanUpdateSemesterLookup(chapterIdFromClient)
                };
            }
            catch (Exception ex)
            {
                return new GetSemesterLookupResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        public async Task<UpdateSemesterLookupResponse> UpdateSemesterLookupAsync(UpdateSemesterLookupRequest request)
        {
            try
            {
                if (!CanUpdateSemesterLookup(request.ChapterID))
                {
                    return new UpdateSemesterLookupResponse
                    {
                        IsSuccess = false,
                        ErrorMessage = "You do not have permission to update semester lookup (chapter 1 only)."
                    };
                }

                await _repository.UpdateSemesterLookupAsync(request);
                return new UpdateSemesterLookupResponse
                {
                    IsSuccess = true,
                    Message = "You have updated Semester Lookup successfully."
                };
            }
            catch (Exception ex)
            {
                return new UpdateSemesterLookupResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        /// <summary>Legacy: Submit visible only when Session ChapterID == "1".</summary>
        private static bool CanUpdateSemesterLookup(string? chapterId) =>
            string.Equals(chapterId?.Trim(), "1", StringComparison.Ordinal);

        private static SemesterLookupDto MapRow(DataRow row)
        {
            return new SemesterLookupDto
            {
                Id = ParseInt(Cell(row, "ID", "Id")),
                Semester = Cell(row, "semester", "Semester"),
                LastSemester = Cell(row, "LastSemester", "lastSemester"),
                StartingDate = Cell(row, "StartingDate", "startingDate"),
                RegStartDate = Cell(row, "RegStartDate", "regStartDate"),
                RegCloseDate = Cell(row, "RegCloseDate", "regCloseDate"),
                DisplayDocumentsFrom = Cell(row, "DisplayDocumentsFrom", "displayDocumentsFrom"),
                RegistrationStatus = Cell(row, "RegistrationStatus", "registrationStatus"),
                JbTotalSpace = Cell(row, "JBTotalSpace", "jbTotalSpace"),
                JiTotalSpace = Cell(row, "JITotalSpace", "jiTotalSpace"),
                JaTotalSpace = Cell(row, "JATotalSpace", "jaTotalSpace"),
                SbTotalSpace = Cell(row, "SBTotalSpace", "sbTotalSpace"),
                SiTotalSpace = Cell(row, "SITotalSpace", "siTotalSpace"),
                SaTotalSpace = Cell(row, "SATotalSpace", "saTotalSpace"),
                CurrentExamDate = Cell(row, "CurrentExamDate", "currentExamDate"),
                CurrentExamDueTime = Cell(row, "CurrentExamDueTime", "currentExamDueTime"),
                VolunteerAvailability = NormalizeYn(Cell(row, "VolunteerAvailability", "volunteerAvailability"))
            };
        }

        private static string NormalizeYn(string value) =>
            string.Equals(value?.Trim(), "Y", StringComparison.OrdinalIgnoreCase) ? "Y" : "N";

        private static string Cell(DataRow row, params string[] names)
        {
            foreach (var n in names)
            {
                if (row.Table.Columns.Contains(n) && row[n] != DBNull.Value)
                    return row[n]?.ToString()?.Trim() ?? "";
            }
            return "";
        }

        private static int ParseInt(string s) => int.TryParse(s, out var v) ? v : 0;
    }
}
