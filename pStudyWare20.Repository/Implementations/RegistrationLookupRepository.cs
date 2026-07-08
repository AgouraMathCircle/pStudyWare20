using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Shared;
using System.Data;

namespace pStudyWare20.Repository.Implementations
{
    public class RegistrationLookupRepository : IRegistrationLookupRepository
    {
        private readonly string _connectionString;

        public RegistrationLookupRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? throw new ArgumentNullException(nameof(configuration));
        }

        public async Task<List<RegistrationSemesterOption>> GetRegistrationSemesterOptionsAsync()
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spRegistrationSemesterLookup", connection)
                {
                    CommandType = CommandType.StoredProcedure,
                };

                using var reader = await command.ExecuteReaderAsync();
                if (!await reader.ReadAsync())
                {
                    return new List<RegistrationSemesterOption>();
                }

                var options = new List<RegistrationSemesterOption>();
                var semester = ReadString(reader, "Semester");
                var semesterName = ReadString(reader, "SemesterName");
                var nextSemester = ReadString(reader, "NextSemester");
                var nextSemesterName = ReadString(reader, "NextSemesterName");

                AddOption(options, semester, semesterName);
                AddOption(options, nextSemester, nextSemesterName);

                return options;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error loading registration semester options: {ex.Message}", ex);
            }
        }

        public async Task<List<RegistrationLocationOption>> GetRegistrationLocationOptionsAsync()
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand(@"
                    SELECT
                        ChapterID,
                        LTRIM(RTRIM(Name)) AS Name,
                        LTRIM(RTRIM(Location)) AS Location,
                        LTRIM(RTRIM(City)) AS City
                    FROM dbo.AMC_ChapterMaster WITH (NOLOCK)
                    WHERE Active = 1
                    ORDER BY Name, Location, City", connection);

                using var reader = await command.ExecuteReaderAsync();
                var options = new List<RegistrationLocationOption>();
                while (await reader.ReadAsync())
                {
                    var chapterId = reader.IsDBNull(reader.GetOrdinal("ChapterID"))
                        ? 0
                        : reader.GetInt32(reader.GetOrdinal("ChapterID"));
                    if (chapterId <= 0)
                    {
                        continue;
                    }

                    var name = ReadString(reader, "Name");
                    var location = ReadString(reader, "Location");
                    var city = ReadString(reader, "City");
                    // Dropdown + email use the same text: Name - Location - City
                    var displayLabel = RegistrationFormatHelper.FormatLocationEmailText(name, location, city);

                    options.Add(new RegistrationLocationOption
                    {
                        ChapterId = chapterId,
                        Name = name,
                        Location = location,
                        City = city,
                        Label = displayLabel,
                        EmailLabel = displayLabel,
                    });
                }

                return options;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error loading registration location options: {ex.Message}", ex);
            }
        }

        private static string ReadString(SqlDataReader reader, string columnName)
        {
            var ordinal = reader.GetOrdinal(columnName);
            return reader.IsDBNull(ordinal) ? string.Empty : reader.GetString(ordinal).Trim();
        }

        private static void AddOption(
            List<RegistrationSemesterOption> options,
            string value,
            string label)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                return;
            }

            if (options.Any(option =>
                    option.Value.Equals(value, StringComparison.OrdinalIgnoreCase)))
            {
                return;
            }

            options.Add(new RegistrationSemesterOption
            {
                Value = value.Trim(),
                Label = string.IsNullOrWhiteSpace(label) ? value.Trim() : label.Trim(),
            });
        }
    }
}
