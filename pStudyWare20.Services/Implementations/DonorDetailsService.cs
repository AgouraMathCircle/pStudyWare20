using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;
using System.Data;

namespace pStudyWare20.Services.Implementations
{
    /// <summary>
    /// Admin donor details — legacy DonorDetails.aspx.
    /// </summary>
    public class DonorDetailsService : IDonorDetailsService
    {
        private readonly IDonorDetailsRepository _donorDetailsRepository;

        public DonorDetailsService(IDonorDetailsRepository donorDetailsRepository)
        {
            _donorDetailsRepository = donorDetailsRepository
                ?? throw new ArgumentNullException(nameof(donorDetailsRepository));
        }

        public async Task<GetAdminDonorsResponse> GetAllDonorsAsync(string rowId = "0")
        {
            try
            {
                var table = await _donorDetailsRepository.GetDonorsAsync(rowId);
                return new GetAdminDonorsResponse
                {
                    IsSuccess = true,
                    Donors = MapDonors(table)
                };
            }
            catch (Exception ex)
            {
                return new GetAdminDonorsResponse
                {
                    IsSuccess = false,
                    ErrorMessage = $"Error loading donors: {ex.Message}"
                };
            }
        }

        public async Task<GetAdminDonorResponse> GetDonorByIdAsync(string rowId)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(rowId) || rowId == "0")
                {
                    return new GetAdminDonorResponse
                    {
                        IsSuccess = false,
                        ErrorMessage = "Invalid donor row id."
                    };
                }

                var table = await _donorDetailsRepository.GetDonorsAsync(rowId);
                var donors = MapDonors(table);
                var donor = donors.FirstOrDefault();

                if (donor == null)
                {
                    return new GetAdminDonorResponse
                    {
                        IsSuccess = false,
                        ErrorMessage = "Donor not found."
                    };
                }

                return new GetAdminDonorResponse
                {
                    IsSuccess = true,
                    Donor = donor
                };
            }
            catch (Exception ex)
            {
                return new GetAdminDonorResponse
                {
                    IsSuccess = false,
                    ErrorMessage = $"Error loading donor: {ex.Message}"
                };
            }
        }

        public async Task<UpsertAdminDonorResponse> UpsertDonorAsync(UpsertAdminDonorRequest request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.DonorName))
                {
                    return new UpsertAdminDonorResponse
                    {
                        IsSuccess = false,
                        ErrorMessage = "Donor name is required."
                    };
                }

                request.DonorName = request.DonorName.Trim();
                request.RowID = string.IsNullOrWhiteSpace(request.RowID) ? "0" : request.RowID.Trim();

                await _donorDetailsRepository.UpsertDonorAsync(request);
                return new UpsertAdminDonorResponse
                {
                    IsSuccess = true,
                    Message = "Data updated successfully."
                };
            }
            catch (Exception ex)
            {
                return new UpsertAdminDonorResponse
                {
                    IsSuccess = false,
                    ErrorMessage = $"Error saving donor: {ex.Message}"
                };
            }
        }

        private static List<AdminDonorRecord> MapDonors(DataTable table)
        {
            var donors = new List<AdminDonorRecord>();
            if (table == null || table.Rows.Count == 0)
                return donors;

            foreach (DataRow row in table.Rows)
            {
                donors.Add(new AdminDonorRecord
                {
                    DonorID = GetInt(row, "DonorID", "RowID"),
                    DonorName = GetString(row, "DonorName"),
                    DonorLevel = GetString(row, "DonorLevel"),
                    Year = GetInt(row, "Year"),
                    Semester = GetString(row, "Semester")
                });
            }

            return donors;
        }

        private static string GetString(DataRow row, string column)
        {
            return row.Table.Columns.Contains(column)
                ? row[column]?.ToString() ?? string.Empty
                : string.Empty;
        }

        private static int GetInt(DataRow row, params string[] columns)
        {
            foreach (var column in columns)
            {
                if (row.Table.Columns.Contains(column) && row[column] != DBNull.Value)
                    return Convert.ToInt32(row[column]);
            }

            return 0;
        }
    }
}
