using ClosedXML.Excel;
using System.Data;
using System.Text;

namespace pStudyWare20.Services.Implementations;

/// <summary>
/// Parses score upload files (.xlsx, .csv) — legacy ReportCard.aspx.cs btnSubmitExcel_Click.
/// </summary>
internal static class ReportCardScoreImportParser
{
    private static readonly string[] RequiredColumns =
    [
        "StudentID",
        "Quiz",
        "ClassWork",
        "HomeWork",
        "Quiz Comments",
        "Class Work Comments",
        "Home Work Comments",
    ];

    public static DataTable Parse(byte[] fileContent, string fileName)
    {
        if (fileContent == null || fileContent.Length == 0)
            throw new InvalidOperationException("Please select a file to import the data.");

        var extension = Path.GetExtension(fileName ?? "").Trim().ToLowerInvariant();
        return extension switch
        {
            ".xlsx" => ParseXlsx(fileContent),
            ".csv" => ParseCsv(Encoding.UTF8.GetString(fileContent)),
            ".xls" => throw new InvalidOperationException("Please upload .xlsx or .csv format. Legacy .xls is not supported."),
            _ => throw new InvalidOperationException("Please upload the correct file format (.xlsx or .csv)."),
        };
    }

    private static DataTable ParseXlsx(byte[] fileContent)
    {
        using var stream = new MemoryStream(fileContent);
        using var workbook = new XLWorkbook(stream);
        var worksheet = workbook.Worksheets.First();
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

    private static DataTable ParseCsv(string csvContent)
    {
        var table = new DataTable();
        using var reader = new StringReader(csvContent);
        var headerLine = reader.ReadLine();
        if (string.IsNullOrWhiteSpace(headerLine))
            throw new InvalidOperationException("The uploaded file has no data.");

        foreach (var header in ParseCsvLine(headerLine))
            table.Columns.Add(header.Trim());

        string? line;
        while ((line = reader.ReadLine()) != null)
        {
            if (string.IsNullOrWhiteSpace(line))
                continue;

            var values = ParseCsvLine(line);
            if (values.All(string.IsNullOrWhiteSpace))
                continue;

            var row = table.NewRow();
            for (var i = 0; i < table.Columns.Count; i++)
                row[i] = i < values.Count ? values[i].Trim() : "";
            table.Rows.Add(row);
        }

        ValidateColumns(table);
        return table;
    }

    /// <summary>Simple CSV line parse (supports quoted fields).</summary>
    private static List<string> ParseCsvLine(string line)
    {
        var result = new List<string>();
        var current = new StringBuilder();
        var inQuotes = false;

        for (var i = 0; i < line.Length; i++)
        {
            var c = line[i];
            if (c == '"')
            {
                inQuotes = !inQuotes;
                continue;
            }

            if (c == ',' && !inQuotes)
            {
                result.Add(current.ToString());
                current.Clear();
                continue;
            }

            current.Append(c);
        }

        result.Add(current.ToString());
        return result;
    }

    private static void ValidateColumns(DataTable table)
    {
        if (table.Rows.Count == 0)
            throw new InvalidOperationException("The uploaded file has no score rows.");

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
