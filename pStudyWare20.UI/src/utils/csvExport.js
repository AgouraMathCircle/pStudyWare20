export const CSV_MIME_TYPE = "text/csv";

export function ensureCsvExtension(filename) {
  if (!filename) return "export.csv";
  if (/\.csv$/i.test(filename)) return filename;
  return `${filename.replace(/\.(xlsx|xls)$/i, "")}.csv`;
}

export function getCsvFilenameFromContentDisposition(
  headers,
  fallback = "export.csv"
) {
  const disposition = headers?.["content-disposition"];
  if (!disposition) return ensureCsvExtension(fallback);

  const utf8Match = disposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    return ensureCsvExtension(decodeURIComponent(utf8Match[1].trim()));
  }

  const match = disposition.match(/filename="?([^";]+)"?/i);
  return match?.[1]
    ? ensureCsvExtension(match[1].trim())
    : ensureCsvExtension(fallback);
}

export function downloadCsvBlob(blob, filename = "export.csv") {
  const file =
    blob instanceof Blob ? blob : new Blob([blob], { type: CSV_MIME_TYPE });

  const url = window.URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = ensureCsvExtension(filename);
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export async function downloadCsvFromResponse(
  response,
  defaultFilename = "export.csv"
) {
  const data = response?.data;
  if (!(data instanceof Blob)) {
    throw new Error("Invalid export response.");
  }

  const contentType = response?.headers?.["content-type"] || data.type || "";
  if (
    contentType.includes("application/json") ||
    data.type?.includes("json")
  ) {
    const text = await data.text();
    try {
      const json = JSON.parse(text);
      throw new Error(
        json.message ||
          json.errorMessage ||
          json.ErrorMessage ||
          json.error ||
          "Export failed."
      );
    } catch (parseErr) {
      if (parseErr instanceof Error && parseErr.message !== "Export failed.") {
        throw parseErr;
      }
      throw new Error(text || "Export failed.");
    }
  }

  const filename = getCsvFilenameFromContentDisposition(
    response.headers,
    defaultFilename
  );
  downloadCsvBlob(data, filename);
  return filename;
}

export async function postCsvExport(
  apiClient,
  url,
  request,
  defaultFilename = "export.csv",
  config = {},
) {
  try {
    const response = await apiClient.post(url, request, {
      responseType: "blob",
      ...config,
    });
    return await downloadCsvFromResponse(response, defaultFilename);
  } catch (error) {
    if (error.response?.data instanceof Blob) {
      const text = await error.response.data.text();
      try {
        const json = JSON.parse(text);
        throw new Error(
          json.message ||
            json.errorMessage ||
            json.ErrorMessage ||
            json.error ||
            "Export failed."
        );
      } catch {
        throw new Error(text || "Export failed.");
      }
    }
    throw error;
  }
}
