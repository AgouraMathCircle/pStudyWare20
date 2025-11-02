import React, { useState, useMemo } from "react";
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
  IconButton,
  Tooltip,
  Chip,
  Paper,
  Button,
} from "@mui/material";
import {
  Visibility as ViewIcon,
  Download as DownloadIcon,
  VideoLibrary as VideoIcon,
  Refresh as RefreshIcon,
  FirstPage as FirstPageIcon,
  KeyboardArrowLeft as PrevPageIcon,
  KeyboardArrowRight as NextPageIcon,
  LastPage as LastPageIcon,
} from "@mui/icons-material";
import PdfViewer from "../../common/PdfViewer";

const StudentDocumentList = ({
  documents,
  onRefresh,
  onView,
  onDownload,
  onOpenVideo,
  selectedPdf,
  onClosePdfViewer,
}) => {
  const [searchBy, setSearchBy] = useState("ALL");
  const [searchCriteria, setSearchCriteria] = useState("contains");
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState(documents);
  const [currentPage, setCurrentPage] = useState(1);
  const [goToPageInput, setGoToPageInput] = useState("1");
  const pageSize = 10;

  // Update filtered data when documents change
  React.useEffect(() => {
    setFilteredData(documents);
    setCurrentPage(1);
    setGoToPageInput("1");
  }, [documents]);

  // Calculate pagination
  const totalRecords = filteredData.length;
  const totalPages = Math.ceil(totalRecords / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const displayedData = filteredData.slice(startIndex, endIndex);

  // Handle search
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

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setGoToPageInput(page.toString());
    }
  };

  // Handle go to specific page
  const handleGoToPage = () => {
    const page = parseInt(goToPageInput);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    } else {
      setGoToPageInput(currentPage.toString());
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  // Get class label
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
    return classMap[classCode] || classCode;
  };

  return (
    <Box>
      {/* Title Section */}
      <Box sx={{ p: 2, backgroundColor: "#f5f5f5" }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, color: "#4caf50", mb: 1, fontSize: "1.1rem" }}
        >
          Class Materials
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "#666", fontSize: "0.875rem" }}
        >
          Watch Lecture Notes Video on{" "}
          <a
            href="https://www.youtube.com/channel/UCWK2w-BVGps-Y9c08B5pRgA/videos"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#d32f2f", fontWeight: 500 }}
          >
            Agoura Math Circle YouTube Channel
          </a>
          . Note: Subscription is required for all students. Please subscribe,
          it will help us upload more videos.
        </Typography>
      </Box>

      {/* Green Header with Search Controls */}
      <Box
        sx={{
          backgroundColor: "#4caf50",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Typography
            sx={{ color: "white", fontSize: "0.75rem", whiteSpace: "nowrap" }}
          >
            Search By:
          </Typography>
          <Select
            value={searchBy}
            onChange={(e) => setSearchBy(e.target.value)}
            size="small"
            sx={{
              color: "white",
              fontSize: "0.75rem",
              minWidth: 120,
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
              "& .MuiSelect-icon": { color: "white" },
            }}
          >
            <MenuItem value="ALL" sx={{ fontSize: "0.75rem" }}>
              Select Column
            </MenuItem>
            <MenuItem value="CLASS" sx={{ fontSize: "0.75rem" }}>
              Class
            </MenuItem>
            <MenuItem value="TOPICS" sx={{ fontSize: "0.75rem" }}>
              Topics
            </MenuItem>
            <MenuItem value="DESCRIPTION" sx={{ fontSize: "0.75rem" }}>
              Description
            </MenuItem>
            <MenuItem value="SESSION" sx={{ fontSize: "0.75rem" }}>
              Session
            </MenuItem>
            <MenuItem value="DOC_NAME" sx={{ fontSize: "0.75rem" }}>
              Document Name
            </MenuItem>
          </Select>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Typography
            sx={{ color: "white", fontSize: "0.75rem", whiteSpace: "nowrap" }}
          >
            Criteria:
          </Typography>
          <Select
            value={searchCriteria}
            onChange={(e) => setSearchCriteria(e.target.value)}
            size="small"
            sx={{
              color: "white",
              fontSize: "0.75rem",
              minWidth: 100,
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
              "& .MuiSelect-icon": { color: "white" },
            }}
          >
            <MenuItem value="equals" sx={{ fontSize: "0.75rem" }}>
              Equals
            </MenuItem>
            <MenuItem value="contains" sx={{ fontSize: "0.75rem" }}>
              Contains
            </MenuItem>
            <MenuItem value="starts_with" sx={{ fontSize: "0.75rem" }}>
              Starts With
            </MenuItem>
          </Select>
        </Box>

        <TextField
          size="small"
          placeholder="Search Text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          sx={{
            minWidth: 150,
            "& .MuiOutlinedInput-root": {
              backgroundColor: "white",
              fontSize: "0.75rem",
            },
          }}
        />

        <Button
          variant="contained"
          size="small"
          onClick={handleSearch}
          sx={{
            backgroundColor: "white",
            color: "#4caf50",
            fontSize: "0.75rem",
            textTransform: "none",
            px: 1.5,
            py: 0.25,
            "&:hover": { backgroundColor: "#f5f5f5" },
          }}
        >
          Find
        </Button>

        <Box sx={{ flexGrow: 1 }} />

        <Tooltip title="Refresh">
          <IconButton onClick={onRefresh} sx={{ color: "white", p: 0.5 }}>
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} sx={{ width: "100%" }}>
        <Table sx={{ width: "100%", tableLayout: "fixed" }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#e8f5e8" }}>
              <TableCell
                sx={{
                  fontWeight: 600,
                  borderRight: "1px solid #4caf50",
                  width: "10%",
                  fontSize: "0.75rem",
                  padding: "8px 12px",
                }}
              >
                Actions
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  borderRight: "1px solid #4caf50",
                  width: "8%",
                  fontSize: "0.75rem",
                  padding: "8px 12px",
                }}
              >
                Doc #
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  borderRight: "1px solid #4caf50",
                  width: "10%",
                  fontSize: "0.75rem",
                  padding: "8px 12px",
                }}
              >
                Class
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  borderRight: "1px solid #4caf50",
                  width: "15%",
                  fontSize: "0.75rem",
                  padding: "8px 12px",
                }}
              >
                Topics
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  borderRight: "1px solid #4caf50",
                  width: "12%",
                  fontSize: "0.75rem",
                  padding: "8px 12px",
                }}
              >
                Description
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  borderRight: "1px solid #4caf50",
                  width: "20%",
                  fontSize: "0.75rem",
                  padding: "8px 12px",
                }}
              >
                Document Name
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  borderRight: "1px solid #4caf50",
                  width: "15%",
                  fontSize: "0.75rem",
                  padding: "8px 12px",
                }}
              >
                Session
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  padding: "8px 12px",
                  width: "10%",
                }}
              >
                Posted Date
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  align="center"
                  sx={{ py: 4, fontSize: "0.875rem" }}
                >
                  <Typography variant="body1" color="textSecondary">
                    {searchText
                      ? "No documents found matching your search."
                      : "No class materials available."}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              displayedData.map((doc, index) => (
                <TableRow key={doc.docID || index} hover>
                  <TableCell
                    sx={{
                      borderRight: "1px solid #4caf50",
                      fontSize: "0.75rem",
                      padding: "8px 12px",
                    }}
                  >
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      <Tooltip title="View">
                        <IconButton
                          size="small"
                          onClick={() => onView(doc.docName)}
                          sx={{ color: "#4caf50" }}
                        >
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download">
                        <IconButton
                          size="small"
                          onClick={() => onDownload(doc.docName)}
                          sx={{ color: "#4caf50" }}
                        >
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {doc.videoURL && (
                        <Tooltip title="Watch Video">
                          <IconButton
                            size="small"
                            onClick={() => onOpenVideo(doc.videoURL)}
                            sx={{ color: "#f44336" }}
                          >
                            <VideoIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={{
                      borderRight: "1px solid #4caf50",
                      fontSize: "0.75rem",
                      padding: "8px 12px",
                    }}
                  >
                    {doc.docID}
                  </TableCell>
                  <TableCell
                    sx={{
                      borderRight: "1px solid #4caf50",
                      fontSize: "0.75rem",
                      padding: "8px 12px",
                    }}
                  >
                    <Tooltip title={getClassLabel(doc.class)}>
                      <Chip
                        label={doc.class}
                        size="small"
                        sx={{
                          backgroundColor: "#4caf50",
                          color: "white",
                          fontSize: "0.7rem",
                        }}
                      />
                    </Tooltip>
                  </TableCell>
                  <TableCell
                    sx={{
                      borderRight: "1px solid #4caf50",
                      fontSize: "0.75rem",
                      padding: "8px 12px",
                    }}
                  >
                    {doc.topics || "N/A"}
                  </TableCell>
                  <TableCell
                    sx={{
                      borderRight: "1px solid #4caf50",
                      fontSize: "0.75rem",
                      padding: "8px 12px",
                    }}
                  >
                    {doc.description || "N/A"}
                  </TableCell>
                  <TableCell
                    sx={{
                      borderRight: "1px solid #4caf50",
                      fontSize: "0.75rem",
                      padding: "8px 12px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Tooltip title={doc.docName}>
                      <span>{doc.docName || "N/A"}</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell
                    sx={{
                      borderRight: "1px solid #4caf50",
                      fontSize: "0.75rem",
                      padding: "8px 12px",
                    }}
                  >
                    {doc.session || "N/A"}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: "0.75rem",
                      padding: "8px 12px",
                    }}
                  >
                    {formatDate(doc.uploadedDate)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Controls */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 16px",
          backgroundColor: "#f5f5f5",
          borderTop: "1px solid #4caf50",
        }}
      >
        <Typography sx={{ fontSize: "0.75rem" }}>
          Records {startIndex + 1} to {Math.min(endIndex, totalRecords)} of{" "}
          {totalRecords}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            size="small"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            sx={{ color: "#4caf50" }}
          >
            <FirstPageIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            sx={{ color: "#4caf50" }}
          >
            <PrevPageIcon fontSize="small" />
          </IconButton>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Typography sx={{ fontSize: "0.75rem" }}>Page</Typography>
            <TextField
              size="small"
              value={goToPageInput}
              onChange={(e) => setGoToPageInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleGoToPage()}
              onBlur={handleGoToPage}
              sx={{
                width: "50px",
                "& .MuiOutlinedInput-root": {
                  fontSize: "0.75rem",
                  height: "28px",
                },
              }}
            />
            <Typography sx={{ fontSize: "0.75rem" }}>
              of {totalPages}
            </Typography>
          </Box>

          <IconButton
            size="small"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            sx={{ color: "#4caf50" }}
          >
            <NextPageIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            sx={{ color: "#4caf50" }}
          >
            <LastPageIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* PDF Viewer Section */}
      {selectedPdf && (
        <PdfViewer
          pdfUrl={selectedPdf}
          pdfName={selectedPdf}
          showHeader={true}
          onClose={onClosePdfViewer}
          width="100%"
          height="70vh"
          basePath="/pStudyWare/Documents/"
        />
      )}
    </Box>
  );
};

export default StudentDocumentList;
