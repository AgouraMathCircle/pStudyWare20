using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using pStudyWare20.Entity;
using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Services.Interfaces;

namespace pStudyWare20.Services.Implementations
{
    public class StudentRegistrationService : IStudentRegistrationService
    {
        private readonly IStudentRegistrationRepository _repository;
        private readonly IConfiguration _configuration;

        public StudentRegistrationService(IStudentRegistrationRepository repository, IConfiguration configuration)
        {
            _repository = repository;
            _configuration = configuration;
        }

        public async Task<StudentRegistrationResponse> RegisterStudentAsync(StudentRegistrationRequest request)
        {
            try
            {
                // Validate request
                if (request == null)
                {
                    return new StudentRegistrationResponse
                    {
                        IsSuccess = false,
                        Message = "Registration request cannot be null."
                    };
                }

                // Map request to entity
                var registration = new StudentRegistration
                {
                    ParentFirstName = request.ParentFirstName,
                    ParentLastName = request.ParentLastName,
                    ParentEmail = request.ParentEmail,
                    ParentPhone = request.ParentPhone,
                    City = request.City,
                    State = request.State,
                    Country = request.Country,
                    StudentFirstName = request.StudentFirstName,
                    StudentLastName = request.StudentLastName,
                    StudentEmail = request.StudentEmail,
                    School = request.School,
                    Grade = request.Grade,
                    Session = request.Session,
                    Location = request.Location,
                    UserNameType = request.UserNameType,
                    WaiverSignature = request.WaiverSignature,
                    RuleSignature = request.RuleSignature,
                    PicturePermission = request.PicturePermission
                };

                // Create registration
                var createdRegistration = await _repository.CreateAsync(registration);

                // Send notification emails (this would be implemented separately)
                await SendNotificationEmailsAsync(createdRegistration);

                return new StudentRegistrationResponse
                {
                    Id = createdRegistration.Id,
                    StudentFirstName = createdRegistration.StudentFirstName,
                    StudentLastName = createdRegistration.StudentLastName,
                    ParentEmail = createdRegistration.ParentEmail,
                    Session = createdRegistration.Session,
                    Location = createdRegistration.Location.ToString(),
                    CreatedAt = createdRegistration.CreatedAt,
                    IsSuccess = true,
                    Message = $"{createdRegistration.StudentFirstName} {createdRegistration.StudentLastName}'s application has successfully been submitted. We will review it and update your enrollment status by email."
                };
            }
            catch (Exception ex)
            {
                return new StudentRegistrationResponse
                {
                    IsSuccess = false,
                    Message = $"Registration failed: {ex.Message}"
                };
            }
        }

        public async Task<StudentRegistration> GetRegistrationByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<StudentRegistration>> GetAllRegistrationsAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<StudentRegistration> UpdateRegistrationAsync(int id, StudentRegistrationRequest request)
        {
            var existingRegistration = await _repository.GetByIdAsync(id);
            if (existingRegistration == null)
            {
                return null;
            }

            // Update properties
            existingRegistration.ParentFirstName = request.ParentFirstName;
            existingRegistration.ParentLastName = request.ParentLastName;
            existingRegistration.ParentEmail = request.ParentEmail;
            existingRegistration.ParentPhone = request.ParentPhone;
            existingRegistration.City = request.City;
            existingRegistration.State = request.State;
            existingRegistration.Country = request.Country;
            existingRegistration.StudentFirstName = request.StudentFirstName;
            existingRegistration.StudentLastName = request.StudentLastName;
            existingRegistration.StudentEmail = request.StudentEmail;
            existingRegistration.School = request.School;
            existingRegistration.Grade = request.Grade;
            existingRegistration.Session = request.Session;
            existingRegistration.Location = request.Location;
            existingRegistration.UserNameType = request.UserNameType;
            existingRegistration.WaiverSignature = request.WaiverSignature;
            existingRegistration.RuleSignature = request.RuleSignature;
            existingRegistration.PicturePermission = request.PicturePermission;

            return await _repository.UpdateAsync(existingRegistration);
        }

        public async Task<bool> DeleteRegistrationAsync(int id)
        {
            return await _repository.DeleteAsync(id);
        }

        public async Task<IEnumerable<StudentRegistration>> GetRegistrationsByParentEmailAsync(string email)
        {
            return await _repository.GetByParentEmailAsync(email);
        }

        public async Task<IEnumerable<StudentRegistration>> GetRegistrationsByStudentEmailAsync(string email)
        {
            return await _repository.GetByStudentEmailAsync(email);
        }

        public async Task<IEnumerable<StudentRegistration>> GetRegistrationsBySessionAsync(string session)
        {
            return await _repository.GetBySessionAsync(session);
        }

        public async Task<IEnumerable<StudentRegistration>> GetRegistrationsByLocationAsync(int location)
        {
            return await _repository.GetByLocationAsync(location);
        }

        private async Task SendNotificationEmailsAsync(StudentRegistration registration)
        {
            try
            {
                // Send email to admin/registration team
                await SendAdminNotificationAsync(registration);

                // Send confirmation email to parent
                await SendParentConfirmationAsync(registration);
            }
            catch (Exception ex)
            {
                // Log the error but don't fail the registration
                Console.WriteLine($"Error sending notification emails: {ex.Message}");
            }
        }

        private async Task SendAdminNotificationAsync(StudentRegistration registration)
        {
            // This would integrate with your email service
            var subject = $"Agoura Math Circle: New Registration request from {registration.ParentFirstName} {registration.ParentLastName}.";
            var body = $@"
                Just Received New Registration request from {registration.ParentFirstName} {registration.ParentLastName}<br/>
                Student Name: {registration.StudentFirstName} {registration.StudentLastName}<br/>
                Session: {registration.Session}<br/>
                Student Level: {registration.Grade}<br/>
                Course/Location: {registration.Location}<br/>
                Regards<br>
                Agoura Math Circle<br/>
                www.agouramathcircle.org";

            // Implementation would depend on your email service
            // await _emailService.SendEmailAsync(adminEmail, registration.ParentEmail, subject, body);
        }

        private async Task SendParentConfirmationAsync(StudentRegistration registration)
        {
            string subject;
            string body;

            if (registration.Location == 4) // Engineering Circle
            {
                subject = $"Agoura Engineering Circle: New Registration confirmation for {registration.ParentFirstName} {registration.ParentLastName}.";
                body = $@"
                    Thank you very much for registering in Agoura Engineering Circle. We have received your application for {registration.StudentFirstName} {registration.StudentLastName}.<br/>
                    Session: {registration.Session}<br/>
                    Student Grade: {registration.Grade}<br/><hr>
                    Course/Location: {registration.Location}<br/>
                    Note: We will review and decide on your application based on the availability of space, your assessment performance, and eligibility. We will send an email about the assessment test. If space is not available, we will add you into our waiting list for our next session.<br/><br/>
                    If you have any questions or concerns, please email us via support@agouramathcircle.org.<br/><br/>
                    Regards<br>Agoura Math Circle<br/>www.agouramathcircle.org";
            }
            else
            {
                subject = $"Agoura Math Circle: New Registration confirmation for {registration.ParentFirstName} {registration.ParentLastName}.";
                body = $@"
                    Thank you very much for registering in Agoura Math Circle. We have received your application for {registration.StudentFirstName} {registration.StudentLastName}.<br/>
                    Session: {registration.Session}<br/>
                    Student Grade: {registration.Grade}<br/><hr>
                    Course/Location: {registration.Location}<br/>
                    Note: We will review and decide on your application based on the availability of space. If space is not available, we will add you into our waiting list. We will email those on the waiting list when there is space.<br/><br/>
                    If you have any questions or concerns, please email us via support@agouramathcircle.org.<br/><br/>
                    Regards<br>Agoura Math Circle<br/>www.agouramathcircle.org";
            }

            // Implementation would depend on your email service
            // await _emailService.SendEmailAsync(registration.ParentEmail, adminEmail, subject, body);
        }
    }
} 