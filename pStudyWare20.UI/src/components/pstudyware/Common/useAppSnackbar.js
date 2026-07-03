import { useState, useCallback } from "react";

export function useAppSnackbar(initialSeverity = "success") {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: initialSeverity,
  });

  const showSnackbar = useCallback((message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const closeSnackbar = useCallback((_, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((s) => ({ ...s, open: false }));
  }, []);

  return { snackbar, showSnackbar, closeSnackbar, setSnackbar };
}
