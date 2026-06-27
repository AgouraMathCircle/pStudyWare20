import React from "react";
import { Select } from "@mui/material";
import { portalModalSelectMenuProps } from "./portalModalStyles";

/**
 * MUI Select preset for portal modals — fixed-width display, scrollable/truncated menu.
 */
const PortalModalSelect = ({ MenuProps, ...props }) => (
  <Select
    MenuProps={{
      ...portalModalSelectMenuProps,
      ...MenuProps,
      PaperProps: {
        ...portalModalSelectMenuProps.PaperProps,
        ...MenuProps?.PaperProps,
        sx: {
          ...portalModalSelectMenuProps.PaperProps?.sx,
          ...MenuProps?.PaperProps?.sx,
        },
      },
    }}
    {...props}
  />
);

export default PortalModalSelect;
