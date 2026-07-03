import React from "react";
import { Snackbar, Alert } from "@mui/material";

const AppSnackbar = ({
  snackbar,
  onClose,
  autoHideDuration = 3000,
  anchorOrigin = { vertical: "top", horizontal: "center" },
  sx,
}) => (
  <Snackbar
    open={snackbar.open}
    autoHideDuration={autoHideDuration}
    onClose={onClose}
    anchorOrigin={anchorOrigin}
    sx={sx}
  >
    <Alert
      severity={snackbar.severity}
      onClose={onClose}
      sx={{ width: "100%" }}
      variant="filled"
    >
      {snackbar.message}
    </Alert>
  </Snackbar>
);

export default AppSnackbar;
