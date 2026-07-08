import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  TextField,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import AdminSessionListPagination from "../Admin/AdminSessionListPagination";
import SortableHeader from "../Common/SortableHeader";
import {
  sortRows,
  toSortableDate,
  toSortableNumber,
} from "../../../utils/tableSort";
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
  adminSessionListTableBodyCellSx,
  adminSessionListTableBodyRowSx,
  adminSessionListTableHeadCellSx,
  adminSessionListTableHeadRowSx,
  adminSessionListGridTableSx,
  adminSessionListTitleSx,
  studentPortalIntroTextSx,
  studentPortalLinkSx,
} from "../styles/applicationSurfaces";

/** Column layout aligned with AdminDocumentList (no Posted column for students). */
const documentListColumnWidths = {
  actions: "14%",
  docId: "5%",
  class: "9%",
  topics: "10%",
  description: "10%",
  name: "11%",
  session: "12%",
  postedDate: "14%",
};

const actionDividerSx = {
  color: "text.secondary",
  fontSize: "0.75rem",
  userSelect: "none",
};

const YOUTUBE_URL =
  "https://www.youtube.com/channel/UCWK2w-BVGps-Y9c08B5pRgA/videos";

const getClassLabel = (classCode) => {
  const classMap = {
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
    ST: "PSAT/SAT",
    AT: "ACT",
  };
  return classMap[classCode] || classCode || "—";
};

const getStudentDocumentFieldValue = (doc, field) => {
  switch (field) {
    case "docID":
      return toSortableNumber(doc.docID);
    case "class":
      return doc.class ?? "";
    case "topics":
      return doc.topics ?? "";
    case "description":
      return doc.description ?? "";
    case "docName":
      return doc.docName ?? "";
    case "session":
      return doc.session ?? "";
    case "uploadedDate":
      return toSortableDate(doc.uploadedDate);
    default:
      return "";
  }
};

const StudentDocumentList = ({
  documents,
  onView,
  onDownload,
  onOpenVideo,
  refreshing = false,
}) => {
  const safeDocuments = Array.isArray(documents) ? documents : [];
  const [orderBy, setOrderBy] = useState("uploadedDate");
  const [order, setOrder] = useState("desc");
  const [searchBy, setSearchBy] = useState("ALL");
  const [searchCriteria, setSearchCriteria] = useState("");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [goToPageInput, setGoToPageInput] = useState("1");
  const pageSize = 10;

  const filteredDocuments = useMemo(() => {
    if (!safeDocuments.length) return [];

    let filtered = safeDocuments;
    if (searchBy !== "ALL" && searchText.trim()) {
      filtered = safeDocuments.filter((doc) => {
        let fieldValue = "";
        switch (searchBy) {
          case "DOC_ID":
            fieldValue = doc.docID?.toString() || "";
            break;
          case "CLASS":
            fieldValue = doc.class || "";
            break;
          case "TOPICS":
            fieldValue = doc.topics || "";
            break;
          case "DESCRIPTION":
            fieldValue = doc.description || "";
            break;
          case "DOC_NAME":
            fieldValue = doc.docName || "";
            break;
          case "SESSION":
            fieldValue = doc.session || "";
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

    return filtered;
  }, [safeDocuments, searchBy, searchCriteria, searchText]);

  const sortedDocuments = useMemo(
    () =>
      sortRows(filteredDocuments, orderBy, order, getStudentDocumentFieldValue),
    [filteredDocuments, orderBy, order],
  );

  const totalRecords = sortedDocuments.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 0;

  const paginatedDocuments = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedDocuments.slice(start, start + pageSize);
  }, [sortedDocuments, currentPage, pageSize]);

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

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setGoToPageInput(page.toString());
    }
  };

  const handleGoToPage = () => {
    const page = parseInt(goToPageInput, 10);
    if (!Number.isNaN(page) && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    } else {
      setGoToPageInput(currentPage.toString());
    }
  };

  const formatDate = (date) => {
    if (!date) return "—";
    try {
      const parsed = new Date(date);
      if (Number.isNaN(parsed.getTime())) return "—";
      return parsed.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "—";
    }
  };

  const renderActionLink = (label, onClick) => (
    <Box onClick={onClick} sx={adminSessionListTableActionLinkSx}>
      {label}
    </Box>
  );

  const renderDocumentActions = (doc) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexWrap: "nowrap",
        gap: 0.5,
        whiteSpace: "nowrap",
      }}
    >
      {renderActionLink("View", () => onView(doc.docName))}
      <Typography component="span" sx={actionDividerSx}>
        /
      </Typography>
      {renderActionLink("Download", () => onDownload(doc.docName))}
      {doc.videoURL ? (
        <>
          <Typography component="span" sx={actionDividerSx}>
            /
          </Typography>
          {renderActionLink("Video", () => onOpenVideo(doc.videoURL))}
        </>
      ) : null}
    </Box>
  );

  return (
    <Box>
      <Box sx={adminSessionListHeaderBarSx}>
        <Typography variant="subtitle1" component="div" sx={adminSessionListTitleSx}>
          Class Material List
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          mb: 1,
          flexWrap: "nowrap",
        }}
      >
        <Typography
          component="div"
          sx={{
            ...studentPortalIntroTextSx,
            mb: 0,
            flex: 1,
            whiteSpace: "nowrap",
            fontSize: "calc(1rem - 1pt)",
            lineHeight: 1.25,
            overflow: "hidden",
          }}
        >
          {" Lecture Notes Video "}
          <Box
            component="a"
            href={YOUTUBE_URL}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              ...studentPortalLinkSx,
              fontSize: "inherit",
              display: "inline",
            }}
          >
            Agoura Math Circle YouTube Channel
          </Box>
          {
            " Note: Subscription is required for all students. Please subscribe, it will help us to upload more videos."
          }
        </Typography>
      </Box>

      <Box sx={adminSessionListSearchBarSx}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Typography sx={adminSessionListSearchLabelSx}>Search By:</Typography>
          <Select
            size="small"
            value={searchBy}
            onChange={(e) => setSearchBy(e.target.value)}
            sx={adminSessionListSearchSelectSx}
          >
            <MenuItem value="ALL" sx={adminSessionListMenuItemSx}>
              -ALL-
            </MenuItem>
            <MenuItem value="DOC_ID" sx={adminSessionListMenuItemSx}>
              Doc #
            </MenuItem>
            <MenuItem value="CLASS" sx={adminSessionListMenuItemSx}>
              Class
            </MenuItem>
            <MenuItem value="TOPICS" sx={adminSessionListMenuItemSx}>
              Topics
            </MenuItem>
            <MenuItem value="DESCRIPTION" sx={adminSessionListMenuItemSx}>
              Description
            </MenuItem>
            <MenuItem value="DOC_NAME" sx={adminSessionListMenuItemSx}>
              Document Name
            </MenuItem>
            <MenuItem value="SESSION" sx={adminSessionListMenuItemSx}>
              Session
            </MenuItem>
          </Select>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Typography sx={adminSessionListSearchLabelSx}>Criteria:</Typography>
          <Select
            size="small"
            value={searchCriteria}
            onChange={(e) => setSearchCriteria(e.target.value)}
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

      <Box sx={{ position: "relative", width: "100%" }}>
        {refreshing ? (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              zIndex: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "rgba(255, 255, 255, 0.65)",
            }}
          >
            <CircularProgress size={32} />
          </Box>
        ) : null}
        <TableContainer component={Paper} sx={{ width: "100%" }}>
          <Table sx={adminSessionListGridTableSx} size="small">
            <TableHead>
              <TableRow sx={adminSessionListTableHeadRowSx}>
                <TableCell
                  sx={adminSessionListTableHeadCellSx(documentListColumnWidths.actions)}
                >
                  Actions
                </TableCell>
                <SortableHeader
                  label="Doc #"
                  field="docID"
                  sortField={orderBy}
                  sortOrder={order}
                  onSort={handleSort}
                  headCellSx={adminSessionListTableHeadCellSx(documentListColumnWidths.docId)}
                />
                <SortableHeader
                  label="Class"
                  field="class"
                  sortField={orderBy}
                  sortOrder={order}
                  onSort={handleSort}
                  headCellSx={adminSessionListTableHeadCellSx(documentListColumnWidths.class)}
                />
                <SortableHeader
                  label="Topics"
                  field="topics"
                  sortField={orderBy}
                  sortOrder={order}
                  onSort={handleSort}
                  headCellSx={adminSessionListTableHeadCellSx(documentListColumnWidths.topics)}
                />
                <SortableHeader
                  label="Description"
                  field="description"
                  sortField={orderBy}
                  sortOrder={order}
                  onSort={handleSort}
                  headCellSx={adminSessionListTableHeadCellSx(
                    documentListColumnWidths.description,
                  )}
                />
                <SortableHeader
                  label="Name"
                  field="docName"
                  sortField={orderBy}
                  sortOrder={order}
                  onSort={handleSort}
                  headCellSx={adminSessionListTableHeadCellSx(documentListColumnWidths.name)}
                />
                <SortableHeader
                  label="Session"
                  field="session"
                  sortField={orderBy}
                  sortOrder={order}
                  onSort={handleSort}
                  headCellSx={adminSessionListTableHeadCellSx(documentListColumnWidths.session)}
                />
                <SortableHeader
                  label="Posted Date"
                  field="uploadedDate"
                  sortField={orderBy}
                  sortOrder={order}
                  onSort={handleSort}
                  headCellSx={adminSessionListTableHeadCellSx(
                    documentListColumnWidths.postedDate,
                    true,
                  )}
                />
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedDocuments.length > 0 ? (
                paginatedDocuments.map((doc, index) => (
                  <TableRow
                    key={doc.docID || index}
                    sx={adminSessionListTableBodyRowSx}
                  >
                    <TableCell sx={adminSessionListTableBodyCellSx({ action: true })}>
                      {renderDocumentActions(doc)}
                    </TableCell>
                    <TableCell sx={adminSessionListTableBodyCellSx()}>
                      {doc.docID || "—"}
                    </TableCell>
                    <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
                      <Tooltip title={getClassLabel(doc.class)}>
                        <span>{getClassLabel(doc.class)}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
                      <Tooltip title={doc.topics || "—"}>
                        <span>{doc.topics || "—"}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
                      <Tooltip title={doc.description || "—"}>
                        <span>{doc.description || "—"}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
                      <Tooltip title={doc.docName || "—"}>
                        <span>{doc.docName || "—"}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
                      <Tooltip title={doc.session || "—"}>
                        <span>{doc.session || "—"}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={adminSessionListTableBodyCellSx({ isLast: true })}>
                      {formatDate(doc.uploadedDate)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={adminSessionListEmptyCellSx}>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={adminSessionListEmptyTextSx}
                    >
                      {searchText
                        ? "No documents found matching your search criteria."
                        : "No class materials available."}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

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
    </Box>
  );
};

export default StudentDocumentList;
