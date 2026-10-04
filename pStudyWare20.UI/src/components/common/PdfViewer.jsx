import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
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
// Legacy build (with polyfills) so older phone browsers can render; must match the
// "pdfjs-dist" -> legacy alias in vite.config.js.
import pdfWorkerUrl from "pdfjs-dist/legacy/build/pdf.worker.min.mjs?url";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import config, { getPublicDocumentUrl, getSessionDocumentUrl } from "../../utils/config";
import documentService from "../../services/documentService";
import AppSnackbar from "../pstudyware/Common/AppSnackbar";
import { useAppSnackbar } from "../pstudyware/Common/useAppSnackbar";

// Vite ?url import ensures the worker is bundled and served from the same origin in production.
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

const ZOOM_STEP = 0.2;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3.0;
// Pages render at the viewer width, capped so wide desktop dialogs keep a readable page size.
const MAX_BASE_PAGE_WIDTH = 816;
const PAGE_ASPECT_RATIO = 11 / 8.5;

// Touch devices can't use the native-viewer iframe fallback (iOS shows only page 1 with
// no scrolling, Android shows nothing), so they get open-in-new-tab/download instead.
const isTouchDevice = () =>
  typeof window !== "undefined" && !!window.matchMedia?.("(pointer: coarse)").matches;

const hideOnPhoneSx = { display: { xs: "none", sm: "inline-flex" } };

const isPdfBlob = async (blob) => {
  const headerBuffer = await blob.slice(0, 5).arrayBuffer();
  const header = String.fromCharCode(...new Uint8Array(headerBuffer));
  return header.startsWith("%PDF");
};

/**
 * Reusable Material-UI PDF viewer using react-pdf (pagination + zoom).
 */
const PdfViewer = ({
  pdfUrl,
  pdfName = "",
  showHeader = true,
  onClose,
  width = "100%",
  height = "70vh",
  basePath = config.paths.publicDocuments,
  apiEndpoint = null,
  downloadEndpoint = null,
}) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [error, setError] = useState(null);
  const [useFallback, setUseFallback] = useState(false);
  const { snackbar, showSnackbar, closeSnackbar } = useAppSnackbar();
  const [fullscreen, setFullscreen] = useState(false);
  const [pageInput, setPageInput] = useState("1");
  const [pdfBlob, setPdfBlob] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [loadingDocument, setLoadingDocument] = useState(true);
  const [viewerWidth, setViewerWidth] = useState(0);
  const containerRef = React.useRef(null);
  const blobUrlRef = React.useRef(null);
  const scrollRef = React.useRef(null);
  const pageRefs = React.useRef([]);
  const touchDevice = useMemo(isTouchDevice, []);
  const fullscreenSupported =
    typeof document !== "undefined" && !!document.fullscreenEnabled;

  const getFullPdfUrl = useCallback(() => {
    if (!pdfUrl) return null;

    if (
      pdfUrl.startsWith("http://") ||
      pdfUrl.startsWith("https://") ||
      pdfUrl.startsWith("/")
    ) {
      return pdfUrl;
    }

    return basePath === config.paths.publicDocuments
      ? getPublicDocumentUrl(pdfUrl)
      : `${basePath}${pdfUrl}`;
  }, [pdfUrl, basePath]);

  const fullPdfUrl = getFullPdfUrl();
  const fallbackViewerUrl = pdfFile || fullPdfUrl;

  const documentOptions = useMemo(() => ({
    cMapUrl: `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/cmaps/`,
    cMapPacked: true,
    standardFontDataUrl: `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
  }), []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || typeof ResizeObserver === "undefined") return undefined;
    const observer = new ResizeObserver(([entry]) => {
      setViewerWidth(Math.floor(entry.contentRect.width));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [useFallback]);

  useEffect(() => {
    const syncFullscreen = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", syncFullscreen);
    return () => document.removeEventListener("fullscreenchange", syncFullscreen);
  }, []);

  useEffect(() => {
    if (error && !useFallback) {
      showSnackbar(error, "error");
    }
  }, [error, useFallback, showSnackbar]);

  const revokeBlobUrl = useCallback(() => {
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadDocument = async () => {
      if (!pdfUrl) {
        setError("PDF URL is missing. Please provide a valid PDF URL.");
        setLoadingDocument(false);
        return;
      }

      revokeBlobUrl();
      setPdfBlob(null);
      setPdfFile(null);
      setLoadingDocument(true);
      setError(null);
      setUseFallback(false);
      setNumPages(null);
      setPageNumber(1);
      setPageInput("1");
      setScale(1.0);

      try {
        let blob;

        const fetchStaticBlob = async (url) => {
          if (!url) return null;
          const response = await fetch(url);
          if (!response.ok) {
            return null;
          }
          const candidate = await response.blob();
          if (!(await isPdfBlob(candidate))) {
            return null;
          }
          return candidate;
        };

        if (apiEndpoint) {
          try {
            blob = await documentService.fetchDocumentBlob(pdfUrl, apiEndpoint);
          } catch (apiError) {
            const staticCandidates = [
              getSessionDocumentUrl(pdfUrl),
              getPublicDocumentUrl(pdfUrl),
              fullPdfUrl,
            ];

            for (const candidateUrl of staticCandidates) {
              blob = await fetchStaticBlob(candidateUrl);
              if (blob) {
                break;
              }
            }

            if (!blob) {
              throw apiError;
            }
          }
        } else if (fullPdfUrl) {
          const response = await fetch(fullPdfUrl);
          if (!response.ok) {
            throw new Error(
              `Document not found (${response.status}). The file may not exist on the server.`
            );
          }
          blob = await response.blob();
        } else {
          throw new Error("PDF URL is missing.");
        }

        if (!(await isPdfBlob(blob))) {
          throw new Error(
            "The file is not a valid PDF. It may be missing from the server or the link is incorrect."
          );
        }

        const pdfBlob =
          blob.type && blob.type.includes("pdf")
            ? blob
            : new Blob([blob], { type: "application/pdf" });

        if (cancelled) {
          return;
        }

        const objectUrl = URL.createObjectURL(pdfBlob);
        blobUrlRef.current = objectUrl;
        setPdfBlob(pdfBlob);
        setPdfFile(objectUrl);
      } catch (loadError) {
        if (cancelled) {
          return;
        }
        console.error("PDF load failed:", loadError);
        setError(
          loadError?.message || "Failed to load PDF. Please try again or download the file."
        );
      } finally {
        if (!cancelled) {
          setLoadingDocument(false);
        }
      }
    };

    loadDocument();

    return () => {
      cancelled = true;
      revokeBlobUrl();
    };
  }, [pdfUrl, apiEndpoint, fullPdfUrl, revokeBlobUrl]);

  const onDocumentLoadSuccess = ({ numPages: totalPages }) => {
    setNumPages(totalPages);
    setError(null);
  };

  const onDocumentLoadError = (loadError) => {
    console.warn(
      "Embedded PDF viewer failed, using browser viewer:",
      loadError,
      fullPdfUrl,
    );
    setUseFallback(true);
    setError(null);
  };

  const scrollToPage = (page) => {
    const container = scrollRef.current;
    const pageEl = pageRefs.current[page - 1];
    setPageNumber(page);
    setPageInput(String(page));
    if (container && pageEl) {
      container.scrollTo({ top: pageEl.offsetTop - 8, behavior: "smooth" });
    }
  };

  // All pages render in one scroll column; keep the page counter in sync with scrolling.
  const handleViewerScroll = () => {
    const container = scrollRef.current;
    if (!container || !numPages) return;
    const probe = container.scrollTop + container.clientHeight / 3;
    let current = 1;
    pageRefs.current.slice(0, numPages).forEach((el, index) => {
      if (el && el.offsetTop <= probe) current = index + 1;
    });
    if (current !== pageNumber) {
      setPageNumber(current);
      setPageInput(String(current));
    }
  };

  const goToPrevPage = () => {
    if (pageNumber > 1) scrollToPage(pageNumber - 1);
  };

  const goToNextPage = () => {
    if (numPages && pageNumber < numPages) scrollToPage(pageNumber + 1);
  };

  const goToFirstPage = () => scrollToPage(1);

  const goToLastPage = () => {
    if (numPages) scrollToPage(numPages);
  };

  const goToPage = () => {
    const page = parseInt(pageInput, 10);
    if (!Number.isNaN(page) && page >= 1 && page <= (numPages || 1)) {
      scrollToPage(page);
    } else {
      setPageInput(String(pageNumber));
    }
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + ZOOM_STEP, MAX_ZOOM));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - ZOOM_STEP, MIN_ZOOM));
  };

  const resetZoom = () => {
    setScale(1.0);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  const handleDownload = async () => {
    try {
      if (downloadEndpoint) {
        await documentService.downloadDocumentFromApi(pdfUrl, downloadEndpoint);
        return;
      }

      const downloadUrl = pdfFile || fullPdfUrl;
      if (!downloadUrl) {
        return;
      }

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = pdfName || pdfUrl || "document.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (downloadError) {
      console.error("Download failed:", downloadError);
      setError(downloadError?.message || "Failed to download PDF.");
    }
  };

  const openInNewTab = () => {
    const printUrl = pdfFile || fullPdfUrl;
    if (printUrl) {
      window.open(printUrl, "_blank", "noopener,noreferrer");
    }
  };

  const openInBrowserViewer = () => {
    if (touchDevice) {
      openInNewTab();
      return;
    }
    setUseFallback(true);
    setError(null);
  };

  const handlePageInputChange = (event) => {
    setPageInput(event.target.value);
  };

  const handlePageInputKeyDown = (event) => {
    if (event.key === "Enter") {
      goToPage();
    }
  };

  if (!pdfUrl) {
    return null;
  }

  const toolbar = useFallback ? null : (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: { xs: 0.5, sm: 1 },
        padding: { xs: "4px 8px", sm: "8px 16px" },
        backgroundColor: "#fff",
        borderBottom: "1px solid #e0e0e0",
        // Phones: one row — compact icons, fullscreen/first/last/reset hidden.
        flexWrap: { xs: "nowrap", sm: "wrap" },
        justifyContent: { xs: "space-between", sm: "flex-start" },
        "& .MuiIconButton-root": { padding: { xs: "4px", sm: "5px" } },
        flexShrink: 0,
      }}
    >
      <Stack direction="row" spacing={{ xs: 0, sm: 0.5 }} alignItems="center">
        <Tooltip title="First Page">
          <Box component="span" sx={hideOnPhoneSx}>
            <IconButton
              size="small"
              onClick={goToFirstPage}
              disabled={!numPages || pageNumber === 1}
              sx={{ color: "#4caf50" }}
            >
              <FirstPageIcon fontSize="small" />
            </IconButton>
          </Box>
        </Tooltip>
        <Tooltip title="Previous Page">
          <span>
            <IconButton
              size="small"
              onClick={goToPrevPage}
              disabled={!numPages || pageNumber === 1}
              sx={{ color: "#4caf50" }}
            >
              <PrevPageIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <TextField
          size="small"
          value={pageInput}
          onChange={handlePageInputChange}
          onKeyDown={handlePageInputKeyDown}
          onBlur={goToPage}
          sx={{
            width: { xs: "58px", sm: "68px" },
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
          <span>
            <IconButton
              size="small"
              onClick={goToNextPage}
              disabled={!numPages || pageNumber === numPages}
              sx={{ color: "#4caf50" }}
            >
              <NextPageIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Last Page">
          <Box component="span" sx={hideOnPhoneSx}>
            <IconButton
              size="small"
              onClick={goToLastPage}
              disabled={!numPages || pageNumber === numPages}
              sx={{ color: "#4caf50" }}
            >
              <LastPageIcon fontSize="small" />
            </IconButton>
          </Box>
        </Tooltip>
      </Stack>

      <Box sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }} />

      <Stack direction="row" spacing={{ xs: 0, sm: 0.5 }} alignItems="center">
        <Tooltip title="Zoom Out">
          <span>
            <IconButton
              size="small"
              onClick={zoomOut}
              disabled={scale <= MIN_ZOOM}
              sx={{ color: "#4caf50" }}
            >
              <ZoomOutIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Typography sx={{ fontSize: "0.75rem", minWidth: { xs: "36px", sm: "50px" }, textAlign: "center" }}>
          {Math.round(scale * 100)}%
        </Typography>
        <Tooltip title="Zoom In">
          <span>
            <IconButton
              size="small"
              onClick={zoomIn}
              disabled={scale >= MAX_ZOOM}
              sx={{ color: "#4caf50" }}
            >
              <ZoomInIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Reset Zoom">
          <IconButton size="small" onClick={resetZoom} sx={{ color: "#4caf50", ...hideOnPhoneSx }}>
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>

      <Stack direction="row" spacing={{ xs: 0, sm: 0.5 }}>
        <Tooltip title="Download">
          <IconButton size="small" onClick={handleDownload} sx={{ color: "#4caf50" }}>
            <DownloadIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Print">
          <IconButton size="small" onClick={openInNewTab} sx={{ color: "#4caf50" }}>
            <PrintIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        {fullscreenSupported ? (
          <Tooltip title={fullscreen ? "Exit Fullscreen" : "Fullscreen"}>
            <IconButton size="small" onClick={toggleFullscreen} sx={{ color: "#4caf50", ...hideOnPhoneSx }}>
              {fullscreen ? (
                <FullscreenExitIcon fontSize="small" />
              ) : (
                <FullscreenIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
        ) : null}
      </Stack>
    </Box>
  );

  const baseWidth = Math.min(viewerWidth || MAX_BASE_PAGE_WIDTH, MAX_BASE_PAGE_WIDTH);

  const viewerBody = useFallback && touchDevice ? (
    <Box
      sx={{
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        padding: "24px 16px",
        backgroundColor: "#fafafa",
        textAlign: "center",
      }}
    >
      <Typography variant="body2" sx={{ maxWidth: "360px" }}>
        This document can&apos;t be previewed here on this device. Open it in a new tab or
        download it instead.
      </Typography>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
        <Button variant="contained" onClick={openInNewTab} sx={{ backgroundColor: "#4caf50" }}>
          Open PDF
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
  ) : useFallback ? (
    <Box sx={{ flex: 1, minHeight: 0, backgroundColor: "#525252" }}>
      <iframe
        src={`${fallbackViewerUrl}#toolbar=1&navpanes=1&scrollbar=1`}
        title={pdfName || "PDF Document"}
        width="100%"
        height="100%"
        style={{ border: "none", display: "block", minHeight: "400px" }}
      />
    </Box>
  ) : (
    <Box
      ref={scrollRef}
      onScroll={handleViewerScroll}
      sx={{
        flex: 1,
        minHeight: 0,
        position: "relative",
        overflow: "auto",
        WebkitOverflowScrolling: "touch",
        padding: { xs: "8px", sm: "16px" },
        backgroundColor: "#525252",
      }}
    >
      {loadingDocument ? (
        <Box sx={{ color: "white", p: 3, textAlign: "center" }}>
          <LinearProgress sx={{ mb: 2, maxWidth: "400px" }} />
          <Typography variant="body2">Loading PDF...</Typography>
        </Box>
      ) : error && !useFallback ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            width: "100%",
          }}
        >
          <Typography
            variant="body1"
            color="error"
            sx={{ mb: 2, maxWidth: "520px", textAlign: "center" }}
          >
            {error}
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button
              variant="contained"
              onClick={openInBrowserViewer}
              sx={{ backgroundColor: "#4caf50" }}
            >
              {touchDevice ? "Open PDF" : "Open in Browser Viewer"}
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
      ) : pdfBlob ? (
        <Document
          key={pdfUrl}
          file={pdfBlob}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          options={documentOptions}
          loading={
            <Box sx={{ color: "white", p: 3, textAlign: "center" }}>
              <LinearProgress sx={{ mb: 2, maxWidth: "400px" }} />
              <Typography variant="body2">Rendering PDF...</Typography>
            </Box>
          }
          error={
            <Box sx={{ color: "white", p: 3, textAlign: "center" }}>
              <LinearProgress sx={{ mb: 2, maxWidth: "400px" }} />
              <Typography variant="body2">Opening in browser viewer...</Typography>
            </Box>
          }
        >
          {/* fit-content + auto margins centers pages but, unlike flex centering, keeps a
              zoomed-in page's left edge reachable by horizontal scroll. */}
          <Box sx={{ width: "fit-content", mx: "auto" }}>
            {Array.from({ length: numPages || 0 }, (_, index) => (
              <Box
                key={index}
                ref={(el) => {
                  pageRefs.current[index] = el;
                }}
                sx={{
                  mb: { xs: 1, sm: 2 },
                  boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                  backgroundColor: "#fff",
                }}
              >
                <Page
                  pageNumber={index + 1}
                  width={baseWidth}
                  scale={scale}
                  renderTextLayer
                  renderAnnotationLayer
                  loading={
                    <Box
                      sx={{
                        width: baseWidth * scale,
                        height: baseWidth * scale * PAGE_ASPECT_RATIO,
                      }}
                    />
                  }
                />
              </Box>
            ))}
          </Box>
        </Document>
      ) : null}
    </Box>
  );

  return (
    <>
    <Paper
      ref={containerRef}
      elevation={showHeader ? 3 : 0}
      sx={{
        mt: showHeader ? 2 : 0,
        display: "flex",
        flexDirection: "column",
        height,
        maxHeight: fullscreen ? "100vh" : height,
        width,
        overflow: "hidden",
        backgroundColor: "#fafafa",
        borderRadius: showHeader ? 1 : 0,
      }}
    >
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
            flexShrink: 0,
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
          {onClose ? (
            <Tooltip title="Close PDF Viewer">
              <IconButton size="small" onClick={onClose} sx={{ color: "white" }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          ) : null}
        </Box>
      )}

      {toolbar}
      {viewerBody}
    </Paper>
    <AppSnackbar snackbar={snackbar} onClose={closeSnackbar} />
    </>
  );
};

export default PdfViewer;
