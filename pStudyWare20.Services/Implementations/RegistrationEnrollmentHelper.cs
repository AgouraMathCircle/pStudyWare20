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
                details.SessionName = ResolveSessionDisplayName(
                    details.SessionId,
                    registrationLookupRepository);
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
                details.SessionName = ResolveSessionDisplayName(
                    details.SessionId,
                    registrationLookupRepository);
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

        private static string ResolveSessionDisplayName(
            string? sessionId,
            IRegistrationLookupRepository registrationLookupRepository)
        {
            if (string.IsNullOrWhiteSpace(sessionId))
            {
                return string.Empty;
            }

            var semesters = registrationLookupRepository
                .GetRegistrationSemesterOptionsAsync()
                .GetAwaiter()
                .GetResult();

            var match = semesters.FirstOrDefault(option =>
                option.Value.Equals(sessionId.Trim(), StringComparison.OrdinalIgnoreCase));

            return match?.Label ?? sessionId.Trim();
        }

        private static void ApplyLocationName(
            int locationId,
            Action<string> setLocationName,
            Func<string> getLocationName,
            IRegistrationLookupRepository registrationLookupRepository)
        {
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
                // Always use Name - Location - City for registration emails.
                setLocationName(location.EmailLabel);
                return;
            }

            if (string.IsNullOrWhiteSpace(getLocationName()))
            {
                setLocationName(locationId.ToString());
            }
        }
    }
}
