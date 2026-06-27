using ClosedXML.Excel;
using System.Data;

namespace pStudyWare20.Services.Implementations;

/// <summary>
/// Parses answer-key upload files — legacy UploadAnswerkey.aspx.cs (Sheet1: Question, AnswerKey, Points, Category).
/// </summary>
internal static class UploadAnswerKeyImportParser
{
    private static readonly string[] RequiredColumns = ["Question", "AnswerKey", "Points", "Category"];

    public static DataTable Parse(byte[] fileContent, string fileName)
    {
        if (fileContent == null || fileContent.Length == 0)
            throw new InvalidOperationException("Please select a file to import the data.");

        var extension = Path.GetExtension(fileName ?? "").Trim().ToLowerInvariant();
        return extension switch
        {
            ".xlsx" => ParseXlsx(fileContent),
            ".xls" => throw new InvalidOperationException(
                "Please upload .xlsx format. Legacy .xls is not supported — use the Excel template saved as .xlsx."),
            _ => throw new InvalidOperationException("Sorry, we can accept only Excel files (.xlsx)."),
        };
    }

    private static DataTable ParseXlsx(byte[] fileContent)
    {
        using var stream = new MemoryStream(fileContent);
        using var workbook = new XLWorkbook(stream);
        var worksheet = workbook.Worksheets.FirstOrDefault(w => w.Name.Equals("Sheet1", StringComparison.OrdinalIgnoreCase))
            ?? workbook.Worksheets.First();
        var table = new DataTable();

        var firstRow = worksheet.FirstRowUsed();
        var lastRow = worksheet.LastRowUsed();
        if (firstRow == null || lastRow == null)
            throw new InvalidOperationException("The uploaded file has no data.");

        var headerRow = firstRow.RowNumber();
        var lastCol = worksheet.LastColumnUsed()?.ColumnNumber() ?? 0;
        if (lastCol == 0)
            throw new InvalidOperationException("The uploaded file has no columns.");

        for (var col = 1; col <= lastCol; col++)
        {
            var header = worksheet.Cell(headerRow, col).GetString().Trim();
            if (string.IsNullOrEmpty(header))
                header = $"Column{col}";
            table.Columns.Add(header);
        }

        for (var rowNum = headerRow + 1; rowNum <= lastRow.RowNumber(); rowNum++)
        {
            if (IsEmptyRow(worksheet, rowNum, lastCol))
                continue;

            var dataRow = table.NewRow();
            for (var col = 1; col <= lastCol; col++)
                dataRow[col - 1] = worksheet.Cell(rowNum, col).GetString().Trim();
            table.Rows.Add(dataRow);
        }

        ValidateColumns(table);
        return table;
    }

    private static bool IsEmptyRow(IXLWorksheet worksheet, int rowNum, int lastCol)
    {
        for (var col = 1; col <= lastCol; col++)
        {
            if (!string.IsNullOrWhiteSpace(worksheet.Cell(rowNum, col).GetString()))
                return false;
        }
        return true;
    }

    private static void ValidateColumns(DataTable table)
    {
        if (table.Rows.Count == 0)
            throw new InvalidOperationException("The uploaded file has no answer-key rows.");

        foreach (var required in RequiredColumns)
        {
            if (!table.Columns.Cast<DataColumn>().Any(c =>
                    string.Equals(c.ColumnName, required, StringComparison.OrdinalIgnoreCase)))
            {
                throw new InvalidOperationException($"Missing required column: {required}");
            }
        }
    }

    public static string GetCellValue(DataRow row, string columnName)
    {
        if (row?.Table?.Columns == null)
            return "";

        foreach (DataColumn col in row.Table.Columns)
        {
            if (string.Equals(col.ColumnName, columnName, StringComparison.OrdinalIgnoreCase))
            {
                var val = row[col];
                return val == null || val == DBNull.Value ? "" : val.ToString()?.Trim() ?? "";
            }
        }

        return "";
    }
}
