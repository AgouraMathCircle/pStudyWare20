import React from "react";
import { TableCell, Box } from "@mui/material";
import { adminPortalTableFontSx } from "../styles/applicationSurfaces";

const SortIndicator = ({ active, direction }) => (
  <Box
    component="span"
    sx={{
      display: "inline-block",
      flexShrink: 0,
      fontSize: "0.5rem",
      lineHeight: 1,
      color: active ? "#1b5e20" : "#2e7d32",
      opacity: 1,
    }}
    aria-hidden
  >
    {active ? (direction === "asc" ? "▲" : "▼") : "⇅"}
  </Box>
);

const SortableHeader = ({
  label,
  field,
  sortField,
  sortOrder,
  onSort,
  headCellSx,
  align,
}) => {
  const active = sortField === field;

  return (
    <TableCell
      align={align}
      sx={{
        ...headCellSx,
        cursor: "pointer",
        userSelect: "none",
        whiteSpace: headCellSx?.whiteSpace ?? "nowrap",
      }}
      onClick={() => onSort(field)}
      aria-sort={
        active ? (sortOrder === "asc" ? "ascending" : "descending") : "none"
      }
    >
      <Box
        component="span"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.25,
          width: "100%",
          minWidth: 0,
          ...adminPortalTableFontSx,
          color: active ? "#1b5e20" : "#2e7d32",
          fontWeight: active ? 600 : 400,
        }}
      >
        <Box
          component="span"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            flex: "1 1 auto",
            minWidth: 0,
          }}
        >
          {label}
        </Box>
        <SortIndicator active={active} direction={sortOrder} />
      </Box>
    </TableCell>
  );
};

export default SortableHeader;
