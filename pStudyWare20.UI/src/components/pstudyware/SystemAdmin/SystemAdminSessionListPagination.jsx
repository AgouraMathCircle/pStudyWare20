import React from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import {
  FirstPage as FirstPageIcon,
  KeyboardArrowLeft as PrevPageIcon,
  KeyboardArrowRight as NextPageIcon,
  LastPage as LastPageIcon,
} from "@mui/icons-material";
import {
  adminSessionListMenuItemSx,
  adminSessionListPaginationBarSx,
  adminSessionListPaginationGoButtonSx,
  adminSessionListPaginationGoFieldSx,
  adminSessionListPaginationGroupSx,
  adminSessionListPaginationIconButtonSx,
  adminSessionListPaginationSelectSx,
  adminSessionListPaginationTextSx,
} from "../styles/applicationSurfaces";

const SystemAdminSessionListPagination = ({
  currentPage,
  totalPages,
  totalRecords,
  pageSize,
  goToPageInput,
  onGoToPageInputChange,
  onPageChange,
  onGoToPage,
}) => {
  const handleGoToKeyDown = (event) => {
    if (event.key === "Enter") {
      onGoToPage();
    }
  };

  return (
    <Box className="admin-session-list-pagination" sx={adminSessionListPaginationBarSx}>
      <Box sx={adminSessionListPaginationGroupSx}>
        <IconButton
          size="small"
          sx={adminSessionListPaginationIconButtonSx}
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
        >
          <FirstPageIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          sx={adminSessionListPaginationIconButtonSx}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <PrevPageIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          sx={adminSessionListPaginationIconButtonSx}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          <NextPageIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          sx={adminSessionListPaginationIconButtonSx}
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          <LastPageIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={adminSessionListPaginationGroupSx}>
        <Typography sx={adminSessionListPaginationTextSx}>GoTo</Typography>
        <Select
          size="small"
          value={totalPages > 0 ? currentPage : ""}
          onChange={(e) => onPageChange(Number(e.target.value))}
          disabled={totalPages === 0}
          sx={adminSessionListPaginationSelectSx}
        >
          {totalPages > 0 ? (
            Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <MenuItem key={page} value={page} sx={adminSessionListMenuItemSx}>
                {page}
              </MenuItem>
            ))
          ) : (
            <MenuItem value="" sx={adminSessionListMenuItemSx}>
              -
            </MenuItem>
          )}
        </Select>
      </Box>

      <Typography sx={adminSessionListPaginationTextSx}>
        Page(s): {totalPages > 0 ? currentPage : 0} of {totalPages}
      </Typography>

      <Typography sx={adminSessionListPaginationTextSx}>
        Record(s):{" "}
        {totalRecords > 0
          ? `${(currentPage - 1) * pageSize + 1} - ${Math.min(
              currentPage * pageSize,
              totalRecords,
            )}`
          : "0"}{" "}
        of {totalRecords}
      </Typography>

      <Box sx={adminSessionListPaginationGroupSx}>
        <Typography sx={adminSessionListPaginationTextSx}>Go to Page Number:</Typography>
        <TextField
          size="small"
          type="number"
          value={goToPageInput}
          onChange={(e) => onGoToPageInputChange(e.target.value)}
          onKeyDown={handleGoToKeyDown}
          sx={adminSessionListPaginationGoFieldSx}
          inputProps={{ min: 1, max: totalPages || 1 }}
        />
        <Button
          size="small"
          variant="contained"
          onClick={onGoToPage}
          sx={adminSessionListPaginationGoButtonSx}
        >
          Go
        </Button>
      </Box>
    </Box>
  );
};

export default SystemAdminSessionListPagination;
