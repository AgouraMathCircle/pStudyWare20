using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Shared;

namespace pStudyWare20.Services.Implementations
{
    internal static class RegistrationEnrollmentHelper
    {
        public static void EnrichStudentRegistration(
            RegistrationStudentModel details,
            IRegistrationLookupRepository registrationLookupRepository)
        {
            ApplyLocationName(
                details.LocationId,
                value => details.LocationName = value,
                () => details.LocationName,
                registrationLookupRepository);

            if (string.IsNullOrWhiteSpace(details.SessionName))
            {
                details.SessionName = SemesterFormatHelper.FormatSemesterDisplayName(details.SessionId);
            }
        }

        public static void EnrichVolunteerRegistration(
            RegistrationVolunteerModel details,
            IRegistrationLookupRepository registrationLookupRepository)
        {
            ApplyLocationName(
                details.LocationId,
                value => details.LocationName = value,
                () => details.LocationName,
                registrationLookupRepository);

            if (string.IsNullOrWhiteSpace(details.SessionName))
            {
                details.SessionName = SemesterFormatHelper.FormatSemesterDisplayName(details.SessionId);
            }

            if (string.IsNullOrWhiteSpace(details.GradeName))
            {
                details.GradeName = ResolveVolunteerGradeDisplayName(details.Grade);
            }

            if (string.IsNullOrWhiteSpace(details.InterestedForName))
            {
                details.InterestedForName = ResolveVolunteerInterestedForDisplayName(details.InterestedFor);
            }
        }

        private static string ResolveVolunteerGradeDisplayName(string? grade)
        {
            if (string.IsNullOrWhiteSpace(grade))
            {
                return string.Empty;
            }

            return grade.Trim() switch
            {
                "High School Freshman" => "9",
                "10" => "10",
                "11" => "11",
                "12" => "12",
                "UG" => "UG",
                "Graduate" => "Graduate",
                "PhD" => "PhD",
                "Others" => "Others",
                _ => grade.Trim(),
            };
        }

        private static string ResolveVolunteerInterestedForDisplayName(string? interestedFor)
        {
            if (string.IsNullOrWhiteSpace(interestedFor))
            {
                return string.Empty;
            }

            return interestedFor.Trim() switch
            {
                "Document Review" => "Document Reviewer",
                _ => interestedFor.Trim(),
            };
        }

        private static void ApplyLocationName(
            int locationId,
            Action<string> setLocationName,
            Func<string> getLocationName,
            IRegistrationLookupRepository registrationLookupRepository)
        {
            if (!string.IsNullOrWhiteSpace(getLocationName()))
            {
                return;
            }

            if (locationId <= 0)
            {
                return;
            }

            var locations = registrationLookupRepository
                .GetRegistrationLocationOptionsAsync()
                .GetAwaiter()
                .GetResult();

            var location = locations.FirstOrDefault(option => option.ChapterId == locationId);
            if (location != null)
            {
                setLocationName(location.EmailLabel);
                return;
            }

            setLocationName(locationId.ToString());
        }
    }
}
