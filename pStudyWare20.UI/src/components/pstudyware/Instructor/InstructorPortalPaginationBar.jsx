import React from "react";
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import {
  FirstPage as FirstPageIcon,
  KeyboardArrowLeft as PrevPageIcon,
  KeyboardArrowRight as NextPageIcon,
  LastPage as LastPageIcon,
} from "@mui/icons-material";
import {
  instructorGreenPaginationBarSx,
  instructorPaginationIconBtnSx,
  instructorPaginationTypographySx,
  instructorPaginationGoButtonSx,
  instructorPaginationPageSelectSx,
  instructorPaginationGoToTextFieldSx,
} from "./instructorPortalTableStyles";

/**
 * Green footer pagination — same pattern as AdminReportCard (instructor report-card).
 */
const InstructorPortalPaginationBar = ({
  currentPage,
  totalPages,
  totalRecords,
  pageSize,
  onPageChange,
  goToPageInput,
  setGoToPageInput,
  onGoToPage,
  extraInfo,
}) => {
  const displayTotalPages = Math.max(1, totalPages);

  return (
    <Box sx={instructorGreenPaginationBarSx}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.25, flexWrap: "wrap" }}>
        <IconButton
          size="small"
          sx={instructorPaginationIconBtnSx}
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1 || totalPages === 0}
        >
          <FirstPageIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          sx={instructorPaginationIconBtnSx}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || totalPages === 0}
        >
          <PrevPageIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          sx={instructorPaginationIconBtnSx}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          <NextPageIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          sx={instructorPaginationIconBtnSx}
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          <LastPageIcon fontSize="small" />
        </IconButton>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
        <Typography sx={instructorPaginationTypographySx}>GoTo</Typography>
        <Select
          size="small"
          value={totalPages > 0 ? currentPage : ""}
          onChange={(e) => onPageChange(Number(e.target.value))}
          disabled={totalPages === 0}
          sx={instructorPaginationPageSelectSx}
        >
          {totalPages > 0 ? (
            Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <MenuItem key={p} value={p} sx={{ fontSize: "0.75rem" }}>
                {p}
              </MenuItem>
            ))
          ) : (
            <MenuItem value="" sx={{ fontSize: "0.75rem" }}>
              -
            </MenuItem>
          )}
        </Select>
      </Box>
      <Typography sx={instructorPaginationTypographySx}>
        Page(s): {totalPages === 0 ? 0 : currentPage} of {displayTotalPages}
      </Typography>
      <Typography sx={instructorPaginationTypographySx}>
        Record(s):{" "}
        {totalRecords > 0
          ? `${(currentPage - 1) * pageSize + 1} - ${Math.min(
              currentPage * pageSize,
              totalRecords
            )}`
          : "0"}{" "}
        of {totalRecords}
      </Typography>
      {extraInfo ? (
        <Typography
          sx={{
            ...instructorPaginationTypographySx,
            display: { xs: "none", lg: "block" },
          }}
        >
          {extraInfo}
        </Typography>
      ) : null}
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.25, flexWrap: "wrap" }}>
        <Typography sx={instructorPaginationTypographySx}>
          Go to Page Number:
        </Typography>
        <TextField
          size="small"
          type="number"
          value={goToPageInput}
          onChange={(e) => setGoToPageInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") onGoToPage();
          }}
          sx={instructorPaginationGoToTextFieldSx}
          inputProps={{ min: 1, max: totalPages || 1 }}
        />
        <Button
          size="small"
          variant="contained"
          onClick={onGoToPage}
          sx={instructorPaginationGoButtonSx}
        >
          Go
        </Button>
      </Box>
    </Box>
  );
};

export default InstructorPortalPaginationBar;
