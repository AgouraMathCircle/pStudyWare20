using System.Data;
using System.Globalization;
using System.Text;

namespace pStudyWare20.Services.Implementations;

/// <summary>
/// Builds UTF-8 CSV files from <see cref="DataTable"/> (RFC 4180-style escaping).
/// </summary>
internal static class DataTableCsvExporter
{
    public const string CsvContentType = "text/csv";

    public static byte[] ToCsvBytes(DataTable dataTable)
    {
        ArgumentNullException.ThrowIfNull(dataTable);

        var sb = new StringBuilder();

        for (var col = 0; col < dataTable.Columns.Count; col++)
        {
            if (col > 0)
                sb.Append(',');
            sb.Append(EscapeCsvField(dataTable.Columns[col].ColumnName));
        }
        sb.AppendLine();

        foreach (DataRow row in dataTable.Rows)
        {
            for (var col = 0; col < dataTable.Columns.Count; col++)
            {
                if (col > 0)
                    sb.Append(',');
                var value = row[col];
                var text = value == DBNull.Value
                    ? ""
                    : Convert.ToString(value, CultureInfo.InvariantCulture) ?? "";
                sb.Append(EscapeCsvField(text));
            }
            sb.AppendLine();
        }

        var preamble = Encoding.UTF8.GetPreamble();
        var content = Encoding.UTF8.GetBytes(sb.ToString());
        var result = new byte[preamble.Length + content.Length];
        Buffer.BlockCopy(preamble, 0, result, 0, preamble.Length);
        Buffer.BlockCopy(content, 0, result, preamble.Length, content.Length);
        return result;
    }

    private static string EscapeCsvField(string field)
    {
        if (string.IsNullOrEmpty(field))
            return field;

        if (field.Contains('"') || field.Contains(',') || field.Contains('\n') || field.Contains('\r'))
            return "\"" + field.Replace("\"", "\"\"") + "\"";

        return field;
    }
}
