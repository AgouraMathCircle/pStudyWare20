import React from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  portalModalActionsSx,
  portalModalClearButtonSx,
  portalModalConfirmButtonSx,
  portalModalContentSx,
  portalModalMessageSx,
  portalModalPaperSx,
  portalModalTitleSx,
} from "./portalModalStyles";

const AppConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmColor = "primary",
  icon,
  loading = false,
  maxWidth = "xs",
  fullWidth = true,
}) => {
  const isAlertOnly = !onConfirm;
  const displayIcon =
    icon ?? (isAlertOnly ? <InfoOutlinedIcon sx={{ fontSize: 20 }} /> : null);

  const handleClose = () => {
    if (loading) {
      return;
    }
    onClose?.();
  };

  const handleConfirm = () => {
    if (loading) {
      return;
    }
    onConfirm?.();
  };

  return (
    <Dialog
      open={open}
      onClose={(_, reason) => {
        if (loading && reason === "backdropClick") {
          return;
        }
        handleClose();
      }}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      scroll="paper"
      aria-labelledby="app-confirm-dialog-title"
      PaperProps={{ sx: portalModalPaperSx }}
    >
      <DialogTitle id="app-confirm-dialog-title" sx={portalModalTitleSx}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {displayIcon}
          <Typography
            component="span"
            sx={{ fontWeight: 600, fontSize: "1rem" }}
          >
            {title}
          </Typography>
        </Box>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          disabled={loading}
          size="small"
          sx={{
            color: "white",
            "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.15)" },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={portalModalContentSx}>
        {typeof message === "string" ? (
          <Typography sx={portalModalMessageSx}>{message}</Typography>
        ) : (
          message
        )}
      </DialogContent>
      <DialogActions sx={portalModalActionsSx}>
        {!isAlertOnly && (
          <Button
            variant="outlined"
            onClick={handleClose}
            disabled={loading}
            sx={portalModalClearButtonSx}
          >
            {cancelLabel}
          </Button>
        )}
        <Box sx={{ flex: 1 }} />
        <Button
          variant="contained"
          onClick={isAlertOnly ? handleClose : handleConfirm}
          disabled={loading}
          startIcon={
            loading ? <CircularProgress size={16} color="inherit" /> : null
          }
          sx={portalModalConfirmButtonSx(confirmColor)}
        >
          {loading ? "Please wait…" : isAlertOnly ? "OK" : confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AppConfirmDialog;
