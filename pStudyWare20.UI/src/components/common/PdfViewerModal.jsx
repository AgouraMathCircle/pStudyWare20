import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PdfViewer from "./PdfViewer";
import {
  portalModalPaperSx,
  portalModalTitleSx,
} from "../pstudyware/Common/portalModalStyles";

/**
 * MUI modal wrapper for PdfViewer with portal styling.
 */
const PdfViewerModal = ({
  open,
  pdfUrl,
  pdfName,
  onClose,
  basePath,
  apiEndpoint = "/Document/ViewClassMaterial",
  downloadEndpoint = "/Document/DownloadClassMaterial",
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      scroll="paper"
      aria-labelledby="pdf-viewer-dialog-title"
      PaperProps={{
        sx: {
          ...portalModalPaperSx,
          height: { xs: "95vh", sm: "90vh" },
          maxHeight: { xs: "95vh", sm: "90vh" },
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <DialogTitle id="pdf-viewer-dialog-title" sx={portalModalTitleSx}>
        <Typography
          component="span"
          sx={{
            fontWeight: 600,
            fontSize: "0.95rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            flex: 1,
            minWidth: 0,
          }}
        >
          {pdfName || pdfUrl || "Document"}
        </Typography>
        <IconButton
          aria-label="Close PDF viewer"
          onClick={onClose}
          size="small"
          sx={{ color: "white", flexShrink: 0 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          p: 0,
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
        }}
      >
        {open && pdfUrl ? (
          <PdfViewer
            pdfUrl={pdfUrl}
            pdfName={pdfName}
            showHeader={false}
            onClose={onClose}
            width="100%"
            height="100%"
            basePath={basePath}
            apiEndpoint={apiEndpoint}
            downloadEndpoint={downloadEndpoint}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default PdfViewerModal;
