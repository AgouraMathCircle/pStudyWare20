import React from "react";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  portalModalActionsSx,
  portalModalContentSx,
  portalModalPaperSx,
  portalModalTitleSx,
  portalModalCloseIconButtonSx,
} from "./portalModalStyles";

const PortalDialog = ({
  open,
  onClose,
  title,
  icon,
  children,
  actions,
  maxWidth = "sm",
  fullWidth = true,
  scroll = "paper",
  disableClose = false,
  ariaLabelledby,
  contentSx,
  paperSx,
  hideActions = false,
}) => {
  const titleId = ariaLabelledby || "portal-dialog-title";

  const handleClose = (event, reason) => {
    if (disableClose && reason === "backdropClick") {
      return;
    }
    onClose?.(event, reason);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      scroll={scroll}
      aria-labelledby={titleId}
      PaperProps={{ sx: { ...portalModalPaperSx, ...paperSx } }}
    >
      <DialogTitle id={titleId} sx={portalModalTitleSx}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
          {icon}
          <Typography
            component="span"
            sx={{ fontWeight: 600, fontSize: "1rem" }}
          >
            {title}
          </Typography>
        </Box>
        <IconButton
          aria-label="close"
          onClick={() => onClose?.()}
          disabled={disableClose}
          size="small"
          sx={portalModalCloseIconButtonSx}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ ...portalModalContentSx, ...contentSx }}>
        {children}
      </DialogContent>
      {!hideActions && actions != null && (
        <DialogActions sx={portalModalActionsSx}>{actions}</DialogActions>
      )}
    </Dialog>
  );
};

export default PortalDialog;
