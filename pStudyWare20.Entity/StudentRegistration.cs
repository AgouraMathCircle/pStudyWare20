using System;
using System.ComponentModel.DataAnnotations;

namespace pStudyWare20.Entity
{
    public class StudentRegistration
    {
        public int Id { get; set; }

        // Parent Information
        [Required]
        [StringLength(100)]
        public string ParentFirstName { get; set; }

        [Required]
        [StringLength(100)]
        public string ParentLastName { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(255)]
        public string ParentEmail { get; set; }

        [Required]
        [Phone]
        [StringLength(20)]
        public string ParentPhone { get; set; }

        [Required]
        [StringLength(100)]
        public string City { get; set; }

        [Required]
        [StringLength(100)]
        public string State { get; set; }

        [Required]
        [StringLength(100)]
        public string Country { get; set; }

        // Student Information
        [Required]
        [StringLength(100)]
        public string StudentFirstName { get; set; }

        [Required]
        [StringLength(100)]
        public string StudentLastName { get; set; }

        [EmailAddress]
        [StringLength(255)]
        public string? StudentEmail { get; set; }

        [Required]
        [StringLength(255)]
        public string School { get; set; }

        [Required]
        public int Grade { get; set; }

        [Required]
        [StringLength(50)]
        public string Session { get; set; }

        [Required]
        public int Location { get; set; }

        // User Name Selection
        [Required]
        [StringLength(1)]
        public string UserNameType { get; set; } // P for Parent, S for Student

        // Signatures
        [Required]
        [StringLength(255)]
        public string WaiverSignature { get; set; }

        [Required]
        [StringLength(255)]
        public string RuleSignature { get; set; }

        public bool PicturePermission { get; set; }

        // Metadata
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public bool IsActive { get; set; } = true;
    }

    public class StudentRegistrationRequest
    {
        // Parent Information
        [Required]
        [StringLength(100)]
        public string ParentFirstName { get; set; }

        [Required]
        [StringLength(100)]
        public string ParentLastName { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(255)]
        public string ParentEmail { get; set; }

        [Required]
        [Phone]
        [StringLength(20)]
        public string ParentPhone { get; set; }

        [Required]
        [StringLength(100)]
        public string City { get; set; }

        [Required]
        [StringLength(100)]
        public string State { get; set; }

        [Required]
        [StringLength(100)]
        public string Country { get; set; }

        // Student Information
        [Required]
        [StringLength(100)]
        public string StudentFirstName { get; set; }

        [Required]
        [StringLength(100)]
        public string StudentLastName { get; set; }

        [EmailAddress]
        [StringLength(255)]
        public string StudentEmail { get; set; }

        [Required]
        [StringLength(255)]
        public string School { get; set; }

        [Required]
        public int Grade { get; set; }

        [Required]
        [StringLength(50)]
        public string Session { get; set; }

        [Required]
        public int Location { get; set; }

        // User Name Selection
        [Required]
        [StringLength(1)]
        public string UserNameType { get; set; } // P for Parent, S for Student

        // Signatures
        [Required]
        [StringLength(255)]
        public string WaiverSignature { get; set; }

        [Required]
        [StringLength(255)]
        public string RuleSignature { get; set; }

        public bool PicturePermission { get; set; }
    }

    public class StudentRegistrationResponse
    {
        public int Id { get; set; }
        public string StudentFirstName { get; set; }
        public string StudentLastName { get; set; }
        public string ParentEmail { get; set; }
        public string Session { get; set; }
        public string Location { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
    }
} 