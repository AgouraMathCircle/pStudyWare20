import React, { useState, useMemo } from "react";
import {
  Typography,
  Button,
  TextField,
  Box,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Download as DownloadIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import AppConfirmDialog from "../Common/AppConfirmDialog";
import {
  adminSessionListEmptyCellSx,
  adminSessionListEmptyTextSx,
  adminSessionListFindButtonSx,
  adminSessionListHeaderBarSx,
  adminSessionListMenuItemSx,
  adminSessionListSearchBarSx,
  adminSessionListSearchFieldSx,
  adminSessionListSearchLabelSx,
  adminSessionListSearchSelectSx,
  adminSessionListTableActionLinkSx,
  adminSessionListTableDeleteLinkSx,
  adminSessionListTableBodyCellSx,
  adminSessionListTableBodyRowSx,
  adminSessionListTableContainerSx,
  adminSessionListTableHeadCellSx,
  adminSessionListTableHeadRowSx,
  adminSessionListTableSx,
  adminSessionListTitleSx,
} from "../styles/applicationSurfaces";
import AdminSessionListPagination from "./AdminSessionListPagination";
import SortableHeader from "../Common/SortableHeader";

const instructorListColumnWidths = {
  edit: "4%",
  delete: "4%",
  id: "6%",
  firstName: "10%",
  lastName: "10%",
  chapter: "11%",
  type: "8%",
  class: "10%",
  username: "10%",
  email: "10%",
  phone: "8%",
  status: "7%",
};

const instructorHeaderActionButtonSx = {
  ...adminSessionListFindButtonSx,
  backgroundColor: "#4caf50",
  color: "white",
  flexShrink: 0,
  px: 1.5,
  "&:hover": { backgroundColor: "#43a047" },
};

const instructorDeleteLinkSx = adminSessionListTableDeleteLinkSx;

/** Matches AMC_spSelectInstructorList default: ORDER BY Class ASC */
const DEFAULT_SORT_FIELD = "class";
const DEFAULT_SORT_ORDER = "asc";

const InstructorList = ({
  instructors,
  onExportToExcel,
  canExportData,
  onEdit,
  onDelete,
  onAdd,
  canAddInstructor,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchBy, setSearchBy] = useState("ALL");
  const [searchCriteria, setSearchCriteria] = useState("");
  const [searchText, setSearchText] = useState("");
  const [orderBy, setOrderBy] = useState(DEFAULT_SORT_FIELD);
  const [order, setOrder] = useState(DEFAULT_SORT_ORDER);
  const [goToPageInput, setGoToPageInput] = useState("1");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(null);

  const pageSize = 25;

  // Handle page change
  const handlePageChange = (page) => {
    const totalPages = Math.ceil(
      (filteredAndSortedInstructors?.length || 0) / pageSize,
    );
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setGoToPageInput(page.toString());
    }
  };

  // Handle go to specific page
  const handleGoToPage = () => {
    const page = parseInt(goToPageInput, 10);
    const totalPages = Math.ceil(
      (filteredAndSortedInstructors?.length || 0) / pageSize,
    );
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    } else {
      setGoToPageInput(currentPage.toString());
    }
  };

  // Handle search
  const handleSearch = () => {
    setCurrentPage(1);
    setGoToPageInput("1");
  };

  const handleSort = (field) => {
    const isAsc = orderBy === field && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(field);
    setCurrentPage(1);
    setGoToPageInput("1");
  };

  // Handle delete confirmation dialog
  const handleDeleteClick = (instructor) => {
    setSelectedInstructor(instructor);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedInstructor) {
      onDelete(selectedInstructor.instructorID);
    }
    setDeleteDialogOpen(false);
    setSelectedInstructor(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedInstructor(null);
  };

  // Get instructor type display text
  const getInstructorTypeText = (type) => {
    const types = {
      P: "Primary",
      S: "Secondary",
      C: "Coordinator",
      V: "Volunteer",
    };
    return types[type] || type;
  };

  // Get class display text
  const getClassText = (classCode) => {
    const classes = {
      JB: "Junior Beginner",
      JI: "Junior Intermediate",
      JA: "Junior Advanced",
      SB: "Senior Beginner",
      SI: "Senior Intermediate",
      SA: "Senior Advanced",
      DS: "Data Science",
      AI: "Artificial Intelligence",
      GD: "Game Development",
      AD: "App Development",
      DM: "Data Management",
      ST: "PSAT",
      AT: "ACT",
      ED: "Engineering Design",
    };
    return classes[classCode] || classCode;
  };

  // Get status display
  const getStatusDisplay = (status) => {
    const value = String(status ?? "").trim().toLowerCase();
    const isActive = value === "1" || value === "active";
    return isActive ? "Active" : "Inactive";
  };

  // Filter and sort instructors
  const filteredAndSortedInstructors = useMemo(() => {
    if (!instructors || instructors.length === 0) return [];

    // Filter
    let filtered = instructors;
    if (searchBy !== "ALL" && searchText.trim()) {
      filtered = instructors.filter((instructor) => {
        let fieldValue = "";

        switch (searchBy) {
          case "INSTRUCTOR_ID":
            fieldValue = instructor.instructorID?.toString() || "";
            break;
          case "FIRST_NAME":
            fieldValue = instructor.firstName || "";
            break;
          case "LAST_NAME":
            fieldValue = instructor.lastName || "";
            break;
          case "EMAIL":
            fieldValue = instructor.emailID || "";
            break;
          case "CHAPTER":
            fieldValue = instructor.chapterName || "";
            break;
          case "CLASS":
            fieldValue = instructor.class ?? instructor.Class ?? "";
            break;
          case "TYPE":
            fieldValue = instructor.instructorType || "";
            break;
          default:
            return true;
        }

        fieldValue = fieldValue.toString().toLowerCase();
        const search = searchText.toLowerCase();

        switch (searchCriteria) {
          case "equals":
            return fieldValue === search;
          case "contains":
            return fieldValue.includes(search);
          case "starts_with":
            return fieldValue.startsWith(search);
          default:
            return fieldValue.includes(search);
        }
      });
    }

    // Sort — preserve API order when using the backend default (Class ASC)
    if (orderBy === DEFAULT_SORT_FIELD && order === DEFAULT_SORT_ORDER) {
      return filtered;
    }

    const sorted = [...filtered].sort((a, b) => {
      let aValue = a[orderBy];
      let bValue = b[orderBy];

      // Handle null/undefined values
      if (aValue == null) aValue = "";
      if (bValue == null) bValue = "";

      // Convert to string for comparison
      aValue = aValue.toString().toLowerCase();
      bValue = bValue.toString().toLowerCase();

      if (order === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return sorted;
  }, [instructors, searchBy, searchCriteria, searchText, orderBy, order]);

  // Get paginated instructors
  const paginatedInstructors = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredAndSortedInstructors.slice(start, end);
  }, [filteredAndSortedInstructors, currentPage, pageSize]);

  const totalPages = Math.ceil(
    (filteredAndSortedInstructors?.length || 0) / pageSize,
  );
  const totalRecords = filteredAndSortedInstructors?.length || 0;

  return (
    <Box>
      <Box sx={adminSessionListHeaderBarSx}>
        <Typography variant="subtitle1" sx={adminSessionListTitleSx}>
          Instructor List
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          {canAddInstructor && (
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={onAdd}
              sx={instructorHeaderActionButtonSx}
            >
              Add Instructor
            </Button>
          )}
          {canExportData && (
            <Button
              variant="contained"
              color="success"
              size="small"
              startIcon={<DownloadIcon />}
              onClick={onExportToExcel}
              sx={instructorHeaderActionButtonSx}
            >
              Export Excel
            </Button>
          )}
        </Box>
      </Box>

      <Box sx={adminSessionListSearchBarSx}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Typography sx={adminSessionListSearchLabelSx}>Search By:</Typography>
          <Select
            value={searchBy}
            onChange={(e) => setSearchBy(e.target.value)}
            size="small"
            sx={adminSessionListSearchSelectSx}
          >
            <MenuItem value="ALL" sx={adminSessionListMenuItemSx}>
              -ALL-
            </MenuItem>
            <MenuItem value="INSTRUCTOR_ID" sx={adminSessionListMenuItemSx}>
              Instructor ID
            </MenuItem>
            <MenuItem value="FIRST_NAME" sx={adminSessionListMenuItemSx}>
              First Name
            </MenuItem>
            <MenuItem value="LAST_NAME" sx={adminSessionListMenuItemSx}>
              Last Name
            </MenuItem>
            <MenuItem value="EMAIL" sx={adminSessionListMenuItemSx}>
              Email
            </MenuItem>
            <MenuItem value="CHAPTER" sx={adminSessionListMenuItemSx}>
              Chapter
            </MenuItem>
            <MenuItem value="CLASS" sx={adminSessionListMenuItemSx}>
              Class
            </MenuItem>
            <MenuItem value="TYPE" sx={adminSessionListMenuItemSx}>
              Type
            </MenuItem>
          </Select>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Typography sx={adminSessionListSearchLabelSx}>Criteria:</Typography>
          <Select
            value={searchCriteria}
            onChange={(e) => setSearchCriteria(e.target.value)}
            size="small"
            sx={adminSessionListSearchSelectSx}
          >
            <MenuItem value="" sx={adminSessionListMenuItemSx}>
              Select Criteria
            </MenuItem>
            <MenuItem value="equals" sx={adminSessionListMenuItemSx}>
              Equals
            </MenuItem>
            <MenuItem value="contains" sx={adminSessionListMenuItemSx}>
              Contains
            </MenuItem>
            <MenuItem value="starts_with" sx={adminSessionListMenuItemSx}>
              Starts With
            </MenuItem>
          </Select>
        </Box>

        <TextField
          size="small"
          placeholder="Search Text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          sx={adminSessionListSearchFieldSx}
        />

        <Button
          variant="contained"
          size="small"
          onClick={handleSearch}
          sx={adminSessionListFindButtonSx}
        >
          Find
        </Button>
      </Box>

      <TableContainer component={Paper} sx={adminSessionListTableContainerSx}>
        <Table sx={adminSessionListTableSx} size="small">
          <TableHead>
            <TableRow sx={adminSessionListTableHeadRowSx}>
              <TableCell sx={adminSessionListTableHeadCellSx(instructorListColumnWidths.edit)}>
                Edit
              </TableCell>
              <TableCell sx={adminSessionListTableHeadCellSx(instructorListColumnWidths.delete)}>
                Delete
              </TableCell>
              <SortableHeader
                label="ID"
                field="instructorID"
                sortField={orderBy}
                sortOrder={order}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(instructorListColumnWidths.id)}
              />
              <SortableHeader
                label="First Name"
                field="firstName"
                sortField={orderBy}
                sortOrder={order}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(instructorListColumnWidths.firstName)}
              />
              <SortableHeader
                label="Last Name"
                field="lastName"
                sortField={orderBy}
                sortOrder={order}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(instructorListColumnWidths.lastName)}
              />
              <SortableHeader
                label="Chapter"
                field="chapterName"
                sortField={orderBy}
                sortOrder={order}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(instructorListColumnWidths.chapter)}
              />
              <SortableHeader
                label="Type"
                field="instructorType"
                sortField={orderBy}
                sortOrder={order}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(instructorListColumnWidths.type)}
              />
              <SortableHeader
                label="Class"
                field="class"
                sortField={orderBy}
                sortOrder={order}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(instructorListColumnWidths.class)}
              />
              <SortableHeader
                label="Username"
                field="userName"
                sortField={orderBy}
                sortOrder={order}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(instructorListColumnWidths.username)}
              />
              <SortableHeader
                label="Email"
                field="emailID"
                sortField={orderBy}
                sortOrder={order}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(instructorListColumnWidths.email)}
              />
              <SortableHeader
                label="Phone"
                field="contactPhone"
                sortField={orderBy}
                sortOrder={order}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(instructorListColumnWidths.phone)}
              />
              <SortableHeader
                label="Status"
                field="memberStatus"
                sortField={orderBy}
                sortOrder={order}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(instructorListColumnWidths.status, true)}
              />
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedInstructors.length > 0 ? (
              paginatedInstructors.map((instructor, index) => (
                <TableRow
                  key={instructor.instructorID || index}
                  sx={adminSessionListTableBodyRowSx}
                >
                  <TableCell sx={adminSessionListTableBodyCellSx({ action: true })}>
                    <Box onClick={() => onEdit(instructor)} sx={adminSessionListTableActionLinkSx}>
                      Edit
                    </Box>
                  </TableCell>
                  <TableCell sx={adminSessionListTableBodyCellSx({ action: true })}>
                    <Box
                      onClick={() => handleDeleteClick(instructor)}
                      sx={instructorDeleteLinkSx}
                    >
                      Delete
                    </Box>
                  </TableCell>
                  <TableCell sx={adminSessionListTableBodyCellSx()}>
                    {instructor.instructorID ?? "—"}
                  </TableCell>
                  <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
                    <Tooltip title={instructor.firstName ?? "—"}>
                      <span>{instructor.firstName || "—"}</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
                    <Tooltip title={instructor.lastName ?? "—"}>
                      <span>{instructor.lastName || "—"}</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
                    <Tooltip title={instructor.chapterName ?? "—"}>
                      <span>{instructor.chapterName || "—"}</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell sx={adminSessionListTableBodyCellSx()}>
                    {getInstructorTypeText(instructor.instructorType) || "—"}
                  </TableCell>
                  <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
                    <Tooltip
                      title={
                        getClassText(instructor.class ?? instructor.Class) || "—"
                      }
                    >
                      <span>
                        {getClassText(instructor.class ?? instructor.Class) || "—"}
                      </span>
                    </Tooltip>
                  </TableCell>
                  <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
                    <Tooltip title={instructor.userName ?? "—"}>
                      <span>{instructor.userName || "—"}</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
                    <Tooltip title={instructor.emailID ?? "—"}>
                      <span>{instructor.emailID || "—"}</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell sx={adminSessionListTableBodyCellSx()}>
                    {instructor.contactPhone || "—"}
                  </TableCell>
                  <TableCell sx={adminSessionListTableBodyCellSx({ isLast: true })}>
                    {getStatusDisplay(instructor.memberStatus)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={12} align="center" sx={adminSessionListEmptyCellSx}>
                  <Typography variant="body2" color="textSecondary" sx={adminSessionListEmptyTextSx}>
                    {searchText
                      ? "No instructors found matching your search criteria."
                      : "No instructor data available."}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <AdminSessionListPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalRecords={totalRecords}
        pageSize={pageSize}
        goToPageInput={goToPageInput}
        onGoToPageInputChange={setGoToPageInput}
        onPageChange={handlePageChange}
        onGoToPage={handleGoToPage}
      />

      <AppConfirmDialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Instructor"
        message={
          <>
            Are you sure you want to delete instructor{" "}
            <strong>
              {selectedInstructor?.firstName} {selectedInstructor?.lastName}
            </strong>
            ?
          </>
        }
        confirmLabel="Delete"
        confirmColor="error"
        icon={<DeleteIcon sx={{ fontSize: 20 }} />}
      />
    </Box>
  );
};

export default InstructorList;
