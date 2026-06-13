import React from "react";
import { TableCell, Box } from "@mui/material";

const SortIndicator = ({ active, direction }) => (
  <Box
    component="span"
    sx={{
      display: "inline-block",
      ml: 0.35,
      fontSize: "0.5rem",
      lineHeight: 1,
      color: active ? "#1b5e20" : "#2e7d32",
      opacity: 1,
      verticalAlign: "middle",
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
        whiteSpace: "nowrap",
      }}
      onClick={() => onSort(field)}
      aria-sort={
        active ? (sortOrder === "asc" ? "ascending" : "descending") : "none"
      }
    >
      <Box
        component="span"
        sx={{
          display: "inline-flex",
          alignItems: "center",
          fontSize: "0.75rem",
          lineHeight: 1.2,
          color: active ? "#1b5e20" : "#2e7d32",
          fontWeight: active ? 600 : 400,
        }}
      >
        {label}
        <SortIndicator active={active} direction={sortOrder} />
      </Box>
    </TableCell>
  );
};

export default SortableHeader;
