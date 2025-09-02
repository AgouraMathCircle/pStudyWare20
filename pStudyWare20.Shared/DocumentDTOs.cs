using System.ComponentModel.DataAnnotations;

namespace pStudyWare20.Shared
{
    /// <summary>
    /// Model for publishing document (matches PublishDocument from reference)
    /// </summary>
    public class PublishDocument
    {
        [Display(Name = "Document ID")]
        public int docID { get; set; }
    }

    /// <summary>
    /// Model for class material (matches ClassMaterial from reference)
    /// </summary>
    public class ClassMaterial
    {
        [Display(Name = "Topic")]
        public string Topic { get; set; } = string.Empty;

        [Display(Name = "Status")]
        public string Status { get; set; } = string.Empty;

        [Display(Name = "Description")]
        public string Description { get; set; } = string.Empty;

        [Display(Name = "Document ID")]
        public string DocumentId { get; set; } = string.Empty;

        [Display(Name = "Class")]
        public string Class { get; set; } = string.Empty;

        [Display(Name = "Session")]
        public string Session { get; set; } = string.Empty;

        [Display(Name = "Name")]
        public string Name { get; set; } = string.Empty;

        [Display(Name = "Posted Date")]
        public DateTime PostedDate { get; set; }

        [Display(Name = "PDF Link")]
        public string pdfLink { get; set; } = string.Empty;
    }
}
