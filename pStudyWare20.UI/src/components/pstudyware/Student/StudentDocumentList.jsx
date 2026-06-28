import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Select,
  MenuItem,
  Paper,
  Button,
  Tooltip,
} from "@mui/material";
import PdfViewerModal from "../../common/PdfViewerModal";
import config from "../../../utils/config";
import {
  adminSessionListFindButtonSx,
  adminSessionListGridTableSx,
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
  adminSessionListTableContainerSx,
  adminSessionListTitleSx,
  adminSessionListEmptyCellSx,
  adminSessionListEmptyTextSx,
  studentPortalIntroTextSx,
  studentPortalLinkSx,
} from "../styles/applicationSurfaces";
import AdminSessionListPagination from "../Admin/AdminSessionListPagination";
import SortableHeader from "../Common/SortableHeader";
import {
  sortRows,
  toSortableDate,
  toSortableNumber,
} from "../../../utils/tableSort";

const documentColumnWidths = {
  actions: "16%",
  docNumber: "6%",
  className: "7%",
  topics: "12%",
  description: "14%",
  documentName: "16%",
  session: "13%",
  postedDate: "16%",
};

const actionDividerSx = {
  fontSize: "0.75rem",
  color: "text.disabled",
  userSelect: "none",
  lineHeight: 1,
};

const studentDocumentListSearchBarOverrideSx = {
  ...adminSessionListSearchBarSx,
  backgroundColor: "#f7fbf7",
  border: "1px solid #c8e6c9",
  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
};

const studentDocumentListSearchLabelOverrideSx = {
  ...adminSessionListSearchLabelSx,
  color: "#1b5e20",
};

const studentDocumentListSearchSelectOverrideSx = {
  ...adminSessionListSearchSelectSx,
  color: "#1b5e20",
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#a5d6a7",
  },
  "& .MuiSelect-icon": {
    color: "#1b5e20",
  },
};

const studentDocumentListFindButtonOverrideSx = {
  ...adminSessionListFindButtonSx,
  backgroundColor: "#4caf50",
  color: "white",
  "&:hover": { backgroundColor: "#43a047" },
};

const getClassMaterialFieldValue = (doc, field) => {
  switch (field) {
    case "docNumber":
      return toSortableNumber(doc.docID);
    case "className":
      return doc.class ?? "";
    case "topics":
      return doc.topics ?? "";
    case "description":
      return doc.description ?? "";
    case "documentName":
      return doc.docName ?? "";
    case "session":
      return doc.session ?? "";
    case "postedDate":
      return toSortableDate(doc.uploadedDate);
    default:
      return "";
  }
};

const StudentDocumentList = ({
  documents,
  loading = false,
  onRefresh: _onRefresh,
  onView,
  onDownload,
  onOpenVideo,
  selectedPdf,
  onClosePdfViewer,
}) => {
  const [searchBy, setSearchBy] = useState("ALL");
  const [searchCriteria, setSearchCriteria] = useState("");
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState(documents);
  const [currentPage, setCurrentPage] = useState(1);
  const [goToPageInput, setGoToPageInput] = useState("1");
  const [sortField, setSortField] = useState("postedDate");
  const [sortOrder, setSortOrder] = useState("desc");

  const pageSize = 25;

  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortField(field);
    setCurrentPage(1);
    setGoToPageInput("1");
  };

  useEffect(() => {
    setFilteredData(documents);
    setCurrentPage(1);
    setGoToPageInput("1");
  }, [documents]);

  const totalRecords = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));

  const sortedDocuments = useMemo(
    () => sortRows(filteredData, sortField, sortOrder, getClassMaterialFieldValue),
    [filteredData, sortField, sortOrder]
  );

  const paginatedDocuments = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedDocuments.slice(start, start + pageSize);
  }, [sortedDocuments, currentPage, pageSize]);

  const handleSearch = () => {
    let filtered = [...documents];

    if (searchBy !== "ALL" && searchText.trim()) {
      filtered = filtered.filter((doc) => {
        let fieldValue = "";

        switch (searchBy) {
          case "CLASS":
            fieldValue = doc.class || "";
            break;
          case "TOPICS":
            fieldValue = doc.topics || "";
            break;
          case "DESCRIPTION":
            fieldValue = doc.description || "";
            break;
          case "SESSION":
            fieldValue = doc.session || "";
            break;
          case "DOC_NAME":
            fieldValue = doc.docName || "";
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

    setFilteredData(filtered);
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
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    } else {
      setGoToPageInput(currentPage.toString());
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

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
      <Box onClick={() => onView(doc.docName)} sx={adminSessionListTableActionLinkSx}>
        View
      </Box>
      <Typography component="span" sx={actionDividerSx}>
        /
      </Typography>
      <Box onClick={() => onDownload(doc.docName)} sx={adminSessionListTableActionLinkSx}>
        Download
      </Box>
      {doc.videoURL ? (
        <>
          <Typography component="span" sx={actionDividerSx}>
            /
          </Typography>
          <Box onClick={() => onOpenVideo(doc.videoURL)} sx={adminSessionListTableActionLinkSx}>
            Video
          </Box>
        </>
      ) : null}
    </Box>
  );

  const renderTableBody = () => {
    if (loading) {
      return (
        <TableRow>
          <TableCell colSpan={8} align="center" sx={adminSessionListEmptyCellSx}>
            <Typography variant="body2" color="textSecondary" sx={adminSessionListEmptyTextSx}>
              Loading class materials...
            </Typography>
          </TableCell>
        </TableRow>
      );
    }

    if (paginatedDocuments.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={8} align="center" sx={adminSessionListEmptyCellSx}>
            <Typography variant="body2" color="textSecondary" sx={adminSessionListEmptyTextSx}>
              {searchText
                ? "No documents found matching your search."
                : "No class materials available."}
            </Typography>
          </TableCell>
        </TableRow>
      );
    }

    return paginatedDocuments.map((doc, index) => (
      <TableRow key={doc.docID || index} sx={adminSessionListTableBodyRowSx}>
        <TableCell sx={adminSessionListTableBodyCellSx({ action: true })}>
          {renderDocumentActions(doc)}
        </TableCell>
        <TableCell sx={adminSessionListTableBodyCellSx()}>{doc.docID ?? "—"}</TableCell>
        <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
          <Tooltip title={doc.class || ""} disableHoverListener={!doc.class}>
            <Box component="span" sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {doc.class || "—"}
            </Box>
          </Tooltip>
        </TableCell>
        <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
          <Tooltip title={doc.topics || ""} disableHoverListener={!doc.topics}>
            <Box component="span" sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {doc.topics || "—"}
            </Box>
          </Tooltip>
        </TableCell>
        <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
          <Tooltip title={doc.description || ""} disableHoverListener={!doc.description}>
            <Box component="span" sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {doc.description || "—"}
            </Box>
          </Tooltip>
        </TableCell>
        <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
          <Tooltip title={doc.docName || ""} disableHoverListener={!doc.docName}>
            <Box component="span" sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {doc.docName || "—"}
            </Box>
          </Tooltip>
        </TableCell>
        <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
          <Tooltip title={doc.session || ""} disableHoverListener={!doc.session}>
            <Box component="span" sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {doc.session || "—"}
            </Box>
          </Tooltip>
        </TableCell>
        <TableCell sx={adminSessionListTableBodyCellSx({ isLast: true })}>
          {formatDate(doc.uploadedDate)}
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={adminSessionListHeaderBarSx}>
        <Typography variant="subtitle1" component="div" sx={adminSessionListTitleSx}>
          Class Material List
        </Typography>
      </Box>

      <Box
        sx={{
          mb: 2,
          p: 2,
          borderRadius: 2,
          border: "1px solid #c8e6c9",
          backgroundColor: "#e8f5e9",
          color: "#1b5e20",
        }}
      >
        <Typography component="div" sx={{ color: "#1b5e20" }}>
          <span style={{ fontWeight: 600, marginRight: '8px' }}>
            Watch Lecture Notes Video:
          </span>
          <a
            href="https://www.youtube.com/channel/UCWK2w-BVGps-Y9c08B5pRgA/videos"
            target="_blank"
            rel="noopener noreferrer"
            style={studentPortalLinkSx}
          >
            Agoura Math Circle YouTube Channel
          </a>
          {" — Subscription is required for all students. Please subscribe, it will help us to upload more videos."}
        </Typography>
      </Box>

      <Box sx={studentDocumentListSearchBarOverrideSx}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Typography sx={studentDocumentListSearchLabelOverrideSx}>Search By:</Typography>
          <Select
            value={searchBy}
            onChange={(e) => setSearchBy(e.target.value)}
            size="small"
            sx={studentDocumentListSearchSelectOverrideSx}
            disabled={loading}
          >
            <MenuItem value="ALL" sx={adminSessionListMenuItemSx}>
              -ALL-
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
            <MenuItem value="SESSION" sx={adminSessionListMenuItemSx}>
              Session
            </MenuItem>
            <MenuItem value="DOC_NAME" sx={adminSessionListMenuItemSx}>
              Document Name
            </MenuItem>
          </Select>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Typography sx={studentDocumentListSearchLabelOverrideSx}>Criteria:</Typography>
          <Select
            value={searchCriteria}
            onChange={(e) => setSearchCriteria(e.target.value)}
            size="small"
            sx={studentDocumentListSearchSelectOverrideSx}
            disabled={loading}
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
          disabled={loading}
        />

        <Button
          variant="contained"
          size="small"
          onClick={handleSearch}
          sx={studentDocumentListFindButtonOverrideSx}
          disabled={loading}
        >
          Find
        </Button>
      </Box>

      <TableContainer component={Paper} sx={adminSessionListTableContainerSx}>
        <Table size="small" sx={adminSessionListGridTableSx}>
          <TableHead>
            <TableRow sx={adminSessionListTableHeadRowSx}>
              <TableCell sx={adminSessionListTableHeadCellSx(documentColumnWidths.actions)}>
                Actions
              </TableCell>
              <SortableHeader
                label="Doc #"
                field="docNumber"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(documentColumnWidths.docNumber)}
              />
              <SortableHeader
                label="Class"
                field="className"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(documentColumnWidths.className)}
              />
              <SortableHeader
                label="Topics"
                field="topics"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(documentColumnWidths.topics)}
              />
              <SortableHeader
                label="Description"
                field="description"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(documentColumnWidths.description)}
              />
              <SortableHeader
                label="Document Name"
                field="documentName"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(documentColumnWidths.documentName)}
              />
              <SortableHeader
                label="Session"
                field="session"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(documentColumnWidths.session)}
              />
              <SortableHeader
                label="Posted Date"
                field="postedDate"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(documentColumnWidths.postedDate, true)}
              />
            </TableRow>
          </TableHead>
          <TableBody>{renderTableBody()}</TableBody>
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

      <PdfViewerModal
        open={Boolean(selectedPdf)}
        pdfUrl={selectedPdf}
        pdfName={selectedPdf}
        onClose={onClosePdfViewer}
        basePath={config.paths.publicDocuments}
      />
    </Box>
  );
};

export default StudentDocumentList;
