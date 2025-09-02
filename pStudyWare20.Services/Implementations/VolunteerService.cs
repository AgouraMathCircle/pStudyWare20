using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;
using System.Data;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace pStudyWare20.Services.Implementations
{
    public class VolunteerService : IVolunteerService
    {
        private readonly IVolunteerRepository _volunteerRepository;
        private readonly IEmailUtility _emailUtility;
        private readonly IConfiguration _configuration;

        public VolunteerService(IVolunteerRepository volunteerRepository, IEmailUtility emailUtility, IConfiguration configuration)
        {
            _volunteerRepository = volunteerRepository;
            _emailUtility = emailUtility;
            _configuration = configuration;
        }

        public ResponseDetails VolunteerRegistration(RegistrationVolunteerModel volunteerDetails)
        {
            ResponseDetails responseDetails = new ResponseDetails();
            try
            {
                // Add volunteer request using stored procedure
                var requestId = _volunteerRepository.AddVolunteerRequestAsync(volunteerDetails).Result;

                if (requestId > 0)
                {
                    // Send email notification to admin
                    _emailUtility.SendEmailtoAdminForVolunteerRegistration(volunteerDetails);
                    
                    responseDetails.isSuccess = true;
                    responseDetails.ErrorMessage = "";
                    responseDetails.Message = "Registered";
                }
                else
                {
                    responseDetails.isSuccess = false;
                    responseDetails.ErrorMessage = "Failed to register volunteer";
                    responseDetails.Message = "";
                }
            }
            catch (Exception ex)
            {
                responseDetails.isSuccess = false;
                responseDetails.ErrorMessage = ex.Message;
                responseDetails.Message = "";
            }

            return responseDetails;
        }
    }
}
