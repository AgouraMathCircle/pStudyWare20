using ClosedXML.Excel;
using System.Data;

namespace pStudyWare20.Services.Implementations;

/// <summary>
/// Builds real Open XML (.xlsx) workbooks from <see cref="DataTable"/> (TSV/HTML faux-Excel breaks modern Excel).
/// </summary>
internal static class DataTableExcelExporter
{
    public const string XlsxContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    public static byte[] ToXlsxBytes(DataTable dataTable, string worksheetName = "Sheet1")
    {
        ArgumentNullException.ThrowIfNull(dataTable);

        using var workbook = new XLWorkbook();
        var sheetName = SanitizeWorksheetName(worksheetName);
        var worksheet = workbook.Worksheets.Add(sheetName);

        if (dataTable.Columns.Count > 0)
            worksheet.Cell(1, 1).InsertTable(dataTable);

        using var stream = new MemoryStream();
        workbook.SaveAs(stream);
        return stream.ToArray();
    }

    private static string SanitizeWorksheetName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            return "Sheet1";

        var chars = name.ToCharArray();
        for (var i = 0; i < chars.Length; i++)
        {
            if (":\\/?*[]".Contains(chars[i]))
                chars[i] = '_';
        }

        var s = new string(chars);
        return s.Length <= 31 ? s : s[..31];
    }
}
