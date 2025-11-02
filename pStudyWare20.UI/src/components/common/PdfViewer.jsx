import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Alert,
  Paper,
  LinearProgress,
  Button,
  Stack,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  Close as CloseIcon,
  GetApp as DownloadIcon,
  NavigateBefore as PrevPageIcon,
  NavigateNext as NextPageIcon,
  FirstPage as FirstPageIcon,
  LastPage as LastPageIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Refresh as RefreshIcon,
  Print as PrintIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
} from "@mui/icons-material";
import { Document, Page, pdfjs } from "react-pdf";
import config from "../../utils/config";

// Note: react-pdf CSS is typically handled automatically by the library
// If needed, you can add custom styles for annotation and text layers

// Set up pdfjs worker
// Use protocol-relative URL or https for CDN
if (typeof window !== "undefined") {
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
}

/**
 * PdfViewer Component
 * A reusable Material-UI integrated PDF viewer component using react-pdf
 *
 * @param {string} pdfUrl - The URL or path to the PDF file
 * @param {string} pdfName - The name/title of the PDF (optional, displayed in header)
 * @param {boolean} showHeader - Whether to show the header with close button (default: true)
 * @param {function} onClose - Callback function when close button is clicked (optional)
 * @param {number|string} width - Width of the PDF viewer (default: "100%")
 * @param {string} height - Height of the PDF viewer (default: "70vh")
 * @param {string} basePath - Base path for PDF documents (default: "/pStudyWare/Documents/")
 */
const PdfViewer = ({
  pdfUrl,
  pdfName = "",
  showHeader = true,
  onClose,
  width = "100%",
  height = "70vh",
  basePath = "/pStudyWare/Documents/",
}) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [pageInput, setPageInput] = useState("1");
  const [useFallback, setUseFallback] = useState(false);
  const containerRef = React.useRef(null);
  const loadingTimeoutRef = React.useRef(null);

  // Construct the full PDF URL
  const getFullPdfUrl = useCallback(() => {
    if (!pdfUrl) return null;

    // If already a full URL, use it as is
    if (pdfUrl.startsWith("http://") || pdfUrl.startsWith("https://")) {
      return pdfUrl;
    }

    // In development, use relative path (Vite proxy will forward to backend)
    // In production, construct full backend URL
    const isDevelopment = config.app.environment === "development";

    if (isDevelopment) {
      // Use relative path - Vite proxy will handle forwarding
      return `${basePath}${pdfUrl}`;
    } else {
      // Production: construct full URL from backend server
      const apiUrl = config.api.url;
      const backendBaseUrl = apiUrl.replace("/api", "");
      const relativePath = basePath.startsWith("/")
        ? basePath.slice(1)
        : basePath;
      return `${backendBaseUrl}/${relativePath}${pdfUrl}`;
    }
  }, [pdfUrl, basePath]);

  const fullPdfUrl = getFullPdfUrl();

  // Reset state when PDF URL changes
  useEffect(() => {
    if (!fullPdfUrl) {
      setError("PDF URL is missing. Please provide a valid PDF URL.");
      setLoading(false);
      return;
    }

    console.log("PdfViewer: Loading PDF from URL:", fullPdfUrl);
    console.log("PdfViewer: pdfjs version:", pdfjs.version);
    console.log(
      "PdfViewer: Worker source:",
      pdfjs.GlobalWorkerOptions.workerSrc
    );
    console.log("PdfViewer: Environment:", config.app.environment);
    console.log("PdfViewer: API URL:", config.api.url);

    // Pre-check if URL is accessible (optional - helps debug)
    if (fullPdfUrl && typeof window !== "undefined") {
      fetch(fullPdfUrl, { method: "HEAD" })
        .then((response) => {
          console.log(
            "PDF URL pre-check:",
            response.status,
            response.statusText
          );
          if (!response.ok && response.status !== 405) {
            // 405 is OK (Method Not Allowed for HEAD is common)
            console.warn(
              `PDF may not be accessible: ${response.status} ${response.statusText}`
            );
          }
        })
        .catch((err) => {
          console.warn("PDF URL pre-check failed:", err.message);
        });
    }

    setNumPages(null);
    setPageNumber(1);
    setPageInput("1");
    setScale(1.0);
    setLoading(true);
    setError(null);
    setUseFallback(false);

    // Clear any existing timeout
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }

    // Set timeout to detect if PDF is stuck loading
    loadingTimeoutRef.current = setTimeout(() => {
      console.warn("PDF loading timeout. Switching to fallback viewer.");
      setError("PDF is taking too long to load. Using alternative viewer...");
      setUseFallback(true);
      setLoading(false);
    }, 15000); // 15 second timeout (reduced for better UX)

    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [fullPdfUrl]);

  // Handle document load success
  const onDocumentLoadSuccess = ({ numPages }) => {
    console.log("PDF loaded successfully. Pages:", numPages);
    setNumPages(numPages);
    setLoading(false);
    setError(null);
    // Clear timeout on success
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }
  };

  // Handle document load error
  const onDocumentLoadError = (error) => {
    console.error("Error loading PDF:", error);
    console.error("PDF URL attempted:", fullPdfUrl);

    let errorMessage = "Failed to load PDF";

    if (error?.message) {
      errorMessage = error.message;
    } else if (error?.toString) {
      errorMessage = error.toString();
    }

    // Provide more helpful error messages
    if (
      errorMessage.includes("CORS") ||
      errorMessage.includes("cross-origin")
    ) {
      errorMessage =
        "CORS error: PDF cannot be loaded due to cross-origin restrictions. The server may need to allow cross-origin requests for PDF files.";
    } else if (
      errorMessage.includes("network") ||
      errorMessage.includes("fetch") ||
      errorMessage.includes("Failed to fetch")
    ) {
      errorMessage = `Network error: Unable to fetch the PDF from ${fullPdfUrl}. Please check:
- Your internet connection
- The backend server is running
- The PDF file exists at this path
- The proxy configuration is correct`;
    } else if (
      errorMessage.includes("404") ||
      errorMessage.includes("Not Found")
    ) {
      errorMessage = `PDF file not found at ${fullPdfUrl}. Please verify the file path and ensure the file exists on the server.`;
    } else if (
      errorMessage.includes("401") ||
      errorMessage.includes("Unauthorized")
    ) {
      errorMessage = "Authentication required: Please log in to view this PDF.";
    } else if (
      errorMessage.includes("403") ||
      errorMessage.includes("Forbidden")
    ) {
      errorMessage =
        "Access denied: You don't have permission to view this PDF.";
    }

    // Automatically switch to fallback viewer on network errors
    if (
      errorMessage.includes("network") ||
      errorMessage.includes("fetch") ||
      errorMessage.includes("Failed to fetch")
    ) {
      console.warn("Network error detected. Switching to fallback viewer.");
      setTimeout(() => {
        setUseFallback(true);
      }, 2000); // Give user time to see the error, then switch
    }

    setError(errorMessage);
    setLoading(false);
    // Clear timeout on error
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }
  };

  // Navigate to previous page
  const goToPrevPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
      setPageInput((pageNumber - 1).toString());
    }
  };

  // Navigate to next page
  const goToNextPage = () => {
    if (pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
      setPageInput((pageNumber + 1).toString());
    }
  };

  // Navigate to first page
  const goToFirstPage = () => {
    setPageNumber(1);
    setPageInput("1");
  };

  // Navigate to last page
  const goToLastPage = () => {
    if (numPages) {
      setPageNumber(numPages);
      setPageInput(numPages.toString());
    }
  };

  // Navigate to specific page
  const goToPage = () => {
    const page = parseInt(pageInput);
    if (!isNaN(page) && page >= 1 && page <= numPages) {
      setPageNumber(page);
    } else {
      setPageInput(pageNumber.toString());
    }
  };

  // Zoom in
  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 3.0));
  };

  // Zoom out
  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.5));
  };

  // Reset zoom
  const resetZoom = () => {
    setScale(1.0);
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!fullscreen) {
      containerRef.current?.requestFullscreen?.();
      setFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setFullscreen(false);
    }
  };

  // Download PDF
  const handleDownload = () => {
    if (fullPdfUrl) {
      const link = document.createElement("a");
      link.href = fullPdfUrl;
      link.download = pdfName || pdfUrl || "document.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Print PDF
  const handlePrint = () => {
    if (fullPdfUrl) {
      window.open(fullPdfUrl, "_blank");
    }
  };

  // Handle page input change
  const handlePageInputChange = (e) => {
    setPageInput(e.target.value);
  };

  // Handle page input key press
  const handlePageInputKeyPress = (e) => {
    if (e.key === "Enter") {
      goToPage();
    }
  };

  if (!pdfUrl) {
    return null;
  }

  return (
    <Paper
      ref={containerRef}
      elevation={3}
      sx={{
        mt: 2,
        display: "flex",
        flexDirection: "column",
        height: height,
        maxHeight: fullscreen ? "100vh" : height,
        width: width,
        overflow: "hidden",
        backgroundColor: "#fafafa",
      }}
    >
      {/* Header */}
      {showHeader && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 16px",
            backgroundColor: "#4caf50",
            color: "white",
            borderBottom: "1px solid rgba(0,0,0,0.1)",
          }}
        >
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "0.9rem",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              flex: 1,
              mr: 2,
            }}
          >
            {pdfName || pdfUrl}
          </Typography>
          {onClose && (
            <Tooltip title="Close PDF Viewer">
              <IconButton
                size="small"
                onClick={onClose}
                sx={{ color: "white" }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      )}

      {/* Toolbar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          padding: "8px 16px",
          backgroundColor: "#fff",
          borderBottom: "1px solid #e0e0e0",
          flexWrap: "wrap",
        }}
      >
        {/* Page Navigation */}
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Tooltip title="First Page">
            <IconButton
              size="small"
              onClick={goToFirstPage}
              disabled={!numPages || pageNumber === 1}
              sx={{ color: "#4caf50" }}
            >
              <FirstPageIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Previous Page">
            <IconButton
              size="small"
              onClick={goToPrevPage}
              disabled={!numPages || pageNumber === 1}
              sx={{ color: "#4caf50" }}
            >
              <PrevPageIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <TextField
            size="small"
            value={pageInput}
            onChange={handlePageInputChange}
            onKeyPress={handlePageInputKeyPress}
            onBlur={goToPage}
            sx={{
              width: "60px",
              "& .MuiOutlinedInput-root": {
                fontSize: "0.75rem",
                height: "32px",
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" sx={{ fontSize: "0.75rem" }}>
                  / {numPages || "?"}
                </InputAdornment>
              ),
            }}
          />
          <Tooltip title="Next Page">
            <IconButton
              size="small"
              onClick={goToNextPage}
              disabled={!numPages || pageNumber === numPages}
              sx={{ color: "#4caf50" }}
            >
              <NextPageIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Last Page">
            <IconButton
              size="small"
              onClick={goToLastPage}
              disabled={!numPages || pageNumber === numPages}
              sx={{ color: "#4caf50" }}
            >
              <LastPageIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>

        <Box sx={{ flexGrow: 1 }} />

        {/* Zoom Controls */}
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Tooltip title="Zoom Out">
            <IconButton
              size="small"
              onClick={zoomOut}
              disabled={scale <= 0.5}
              sx={{ color: "#4caf50" }}
            >
              <ZoomOutIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Typography sx={{ fontSize: "0.75rem", minWidth: "50px" }}>
            {Math.round(scale * 100)}%
          </Typography>
          <Tooltip title="Zoom In">
            <IconButton
              size="small"
              onClick={zoomIn}
              disabled={scale >= 3.0}
              sx={{ color: "#4caf50" }}
            >
              <ZoomInIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reset Zoom">
            <IconButton
              size="small"
              onClick={resetZoom}
              sx={{ color: "#4caf50" }}
            >
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>

        <Box sx={{ width: "8px" }} />

        {/* Actions */}
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Download">
            <IconButton
              size="small"
              onClick={handleDownload}
              sx={{ color: "#4caf50" }}
            >
              <DownloadIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Print">
            <IconButton
              size="small"
              onClick={handlePrint}
              sx={{ color: "#4caf50" }}
            >
              <PrintIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={fullscreen ? "Exit Fullscreen" : "Fullscreen"}>
            <IconButton
              size="small"
              onClick={toggleFullscreen}
              sx={{ color: "#4caf50" }}
            >
              {fullscreen ? (
                <FullscreenExitIcon fontSize="small" />
              ) : (
                <FullscreenIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      {/* PDF Viewer - Fallback to iframe if react-pdf fails */}
      {useFallback ? (
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            padding: "20px",
            backgroundColor: "#525252",
          }}
        >
          <Box sx={{ width: "100%", height: "100%" }}>
            <iframe
              src={`${fullPdfUrl}#toolbar=1&navpanes=1&scrollbar=1`}
              title={pdfName || "PDF Document"}
              width="100%"
              height="100%"
              style={{
                border: "none",
                minHeight: "600px",
                backgroundColor: "white",
              }}
            />
            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Button
                variant="outlined"
                onClick={() => {
                  setUseFallback(false);
                  setError(null);
                  setLoading(true);
                }}
                sx={{ color: "#4caf50", borderColor: "#4caf50" }}
              >
                Try React PDF Viewer Again
              </Button>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            padding: "20px",
            backgroundColor: "#525252",
          }}
        >
          {error ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "40px",
                width: "100%",
              }}
            >
              <Alert severity="error" sx={{ mb: 2, maxWidth: "500px" }}>
                {error}
              </Alert>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  onClick={() => {
                    setUseFallback(true);
                    setError(null);
                  }}
                  sx={{ backgroundColor: "#4caf50" }}
                >
                  Try Alternative Viewer
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleDownload}
                  startIcon={<DownloadIcon />}
                  sx={{ borderColor: "#4caf50", color: "#4caf50" }}
                >
                  Download PDF
                </Button>
              </Stack>
            </Box>
          ) : (
            <Document
              file={fullPdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={
                <Box sx={{ color: "white", p: 3, textAlign: "center" }}>
                  <LinearProgress sx={{ mb: 2, maxWidth: "400px" }} />
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    Loading PDF...
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#aaa", fontSize: "0.75rem" }}
                  >
                    {fullPdfUrl}
                  </Typography>
                </Box>
              }
              error={
                <Box sx={{ color: "white", p: 3, textAlign: "center" }}>
                  <Alert severity="error" sx={{ mb: 2, maxWidth: "500px" }}>
                    Failed to load PDF with react-pdf viewer.
                  </Alert>
                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="contained"
                      onClick={() => setUseFallback(true)}
                      sx={{ backgroundColor: "#4caf50" }}
                    >
                      Use Alternative Viewer
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleDownload}
                      startIcon={<DownloadIcon />}
                      sx={{ borderColor: "#4caf50", color: "#4caf50" }}
                    >
                      Download PDF
                    </Button>
                  </Stack>
                </Box>
              }
              options={{
                cMapUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/cmaps/`,
                cMapPacked: true,
                standardFontDataUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/standard_fonts/`,
                httpHeaders: (() => {
                  // Add authentication token if available
                  const token = localStorage.getItem(config.auth.tokenKey);
                  const headers = {};
                  if (token) {
                    headers["Authorization"] = `Bearer ${token}`;
                  }
                  return headers;
                })(),
              }}
            >
              <Page
                pageNumber={pageNumber}
                scale={scale}
                renderTextLayer={true}
                renderAnnotationLayer={true}
              />
            </Document>
          )}
        </Box>
      )}
    </Paper>
  );
};

export default PdfViewer;
