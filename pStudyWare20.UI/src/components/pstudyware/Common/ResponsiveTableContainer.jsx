import React from "react";
import { Paper, TableContainer } from "@mui/material";

/**
 * Standard wrapper for portal data grids. Guarantees horizontal scroll on
 * narrow viewports instead of squashed columns or viewport overflow.
 * New portal tables should use this instead of a bare MUI TableContainer.
 * See MOBILE_RESPONSIVE_GUIDE.md.
 */
const ResponsiveTableContainer = ({
  children,
  minWidth,
  component = Paper,
  sx,
  ...rest
}) => (
  <TableContainer
    component={component}
    sx={{
      width: "100%",
      overflowX: "auto",
      WebkitOverflowScrolling: "touch",
      ...(minWidth ? { "& table": { minWidth } } : null),
      ...sx,
    }}
    {...rest}
  >
    {children}
  </TableContainer>
);

export default ResponsiveTableContainer;
