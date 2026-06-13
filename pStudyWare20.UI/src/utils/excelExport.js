export const XLSX_MIME_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

export function ensureXlsxExtension(filename) {
  if (!filename) return "export.xlsx";
  if (/\.xlsx$/i.test(filename)) return filename;
  return `${filename.replace(/\.(xls|csv)$/i, "")}.xlsx`;
}

export function getFilenameFromContentDisposition(
  headers,
  fallback = "export.xlsx"
) {
  const disposition = headers?.["content-disposition"];
  if (!disposition) return ensureXlsxExtension(fallback);

  const utf8Match = disposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    return ensureXlsxExtension(decodeURIComponent(utf8Match[1].trim()));
  }

  const match = disposition.match(/filename="?([^";]+)"?/i);
  return match?.[1]
    ? ensureXlsxExtension(match[1].trim())
    : ensureXlsxExtension(fallback);
}

export function downloadExcelBlob(blob, filename = "export.xlsx") {
  const file =
    blob instanceof Blob
      ? blob
      : new Blob([blob], { type: XLSX_MIME_TYPE });

  const url = window.URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = ensureXlsxExtension(filename);
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export async function parseBlobError(blob) {
  try {
    const text = await blob.text();
    const json = JSON.parse(text);
    return (
      json.message ||
      json.errorMessage ||
      json.ErrorMessage ||
      json.error ||
      text ||
      "Export failed."
    );
  } catch {
    return "Export failed.";
  }
}

function isJsonBlob(blob, contentType = "") {
  return (
    contentType.includes("application/json") ||
    (blob instanceof Blob && blob.type?.includes("json"))
  );
}

export async function downloadExcelFromResponse(
  response,
  defaultFilename = "export.xlsx"
) {
  const data = response?.data;
  if (!(data instanceof Blob)) {
    throw new Error("Invalid export response.");
  }

  const contentType = response?.headers?.["content-type"] || data.type || "";
  if (isJsonBlob(data, contentType)) {
    throw new Error(await parseBlobError(data));
  }

  const filename = getFilenameFromContentDisposition(
    response.headers,
    defaultFilename
  );
  downloadExcelBlob(data, filename);
  return filename;
}

export async function postExcelExport(
  apiClient,
  url,
  request,
  defaultFilename = "export.xlsx"
) {
  try {
    const response = await apiClient.post(url, request, {
      responseType: "blob",
    });
    return await downloadExcelFromResponse(response, defaultFilename);
  } catch (error) {
    if (error.response?.data instanceof Blob) {
      throw new Error(await parseBlobError(error.response.data));
    }
    throw error;
  }
}
