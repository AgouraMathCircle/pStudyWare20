using ClosedXML.Excel;
using pStudyWare20.Services.Implementations;

namespace pStudyWare20.Services.Implementations;

/// <summary>
/// Legacy UploadAnswerkey.aspx template: Sheet1 columns Question, AnswerKey, Points, Category.
/// </summary>
internal static class UploadAnswerKeyTemplateExporter
{
    public const string FileName = "UpLoadAnswerKey.xlsx";

    public static byte[] CreateTemplateBytes()
    {
        using var workbook = new XLWorkbook();
        var worksheet = workbook.Worksheets.Add("Sheet1");

        worksheet.Cell(1, 1).Value = "Question";
        worksheet.Cell(1, 2).Value = "AnswerKey";
        worksheet.Cell(1, 3).Value = "Points";
        worksheet.Cell(1, 4).Value = "Category";

        var headerRow = worksheet.Row(1);
        headerRow.Style.Font.Bold = true;
        worksheet.Columns(1, 4).AdjustToContents();

        using var stream = new MemoryStream();
        workbook.SaveAs(stream);
        return stream.ToArray();
    }
}
