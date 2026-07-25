import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  Support as SupportIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import {
  adminPortalCardHeaderStripSx,
  adminDashboardWidgetCardSx,
  adminDashboardWidgetCardContentSx,
  adminDashboardWidgetTitleSx,
  adminDashboardWidgetTrackingHeaderCellSx,
  adminDashboardWidgetTrackingCellSx,
  adminDashboardWidgetTrackingTableSx,
  adminDashboardWidgetTableRowSx,
} from "../styles/applicationSurfaces";
import { toSystemAdminPortalPath } from "../../../utils/systemAdminPortalPaths";

const SystemSupport = ({ onPublishDocument, canPublishDocuments }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const supportLinks = [
    {
      label: "Student Waiting List",
      href: toSystemAdminPortalPath(location.pathname, "/Studentwaiting-list"),
      isReact: true,
    },
    {
      label: "Volunteers Request",
      href: toSystemAdminPortalPath(location.pathname, "/volunteers-request"),
      isReact: true,
    },
    {
      label: "Volunteers Availability",
      href: toSystemAdminPortalPath(location.pathname, "/volunteers-availability"),
      isReact: true,
    },
    {
      label: "Time Sheet Approval Request",
      href: toSystemAdminPortalPath(location.pathname, "/time-sheet-tracking"),
      isReact: true,
    },
    {
      label: "Special Events Registration List",
      href: toSystemAdminPortalPath(
        location.pathname,
        "/special-events-registration",
      ),
      isReact: true,
    },
    {
      label: "Upload Online Exam Answer Key",
      href: toSystemAdminPortalPath(location.pathname, "/upload-answer-key"),
      isReact: true,
    },
    {
      label: "Update Lookup",
      href: toSystemAdminPortalPath(location.pathname, "/update-lookup-semester"),
      isReact: true,
    },
    {
      label: "Meeting Schedule",
      href: toSystemAdminPortalPath(location.pathname, "/meeting-details"),
      isReact: true,
    },
    {
      label: "Update Donor Details",
      href: toSystemAdminPortalPath(location.pathname, "/donor-details"),
      isReact: true,
    },
    {
      label: "Post Message",
      href: toSystemAdminPortalPath(location.pathname, "/post-message"),
      isReact: true,
    },
    ...(canPublishDocuments
      ? [
          {
            label: "Publish Class Materials",
            isAction: true,
          },
        ]
      : []),
    {
      label: "User Tracking",
      href: toSystemAdminPortalPath(location.pathname, "/user-tracking"),
      isReact: true,
    },
  ];

  const handleLinkClick = (link) => {
    if (link.isAction) {
      onPublishDocument?.(false);
      return;
    }
    if (link.isReact) {
      navigate(link.href);
    } else {
      window.location.href = link.href;
    }
  };

  return (
    <Card elevation={3} className="systemadmin-dashboard-widget-card" sx={adminDashboardWidgetCardSx}>
      <CardHeader
        avatar={<SupportIcon fontSize="small" />}
        title={
          <Typography variant="subtitle1" component="div" sx={adminDashboardWidgetTitleSx}>
            System Support
          </Typography>
        }
        sx={adminPortalCardHeaderStripSx}
      />
      <CardContent sx={adminDashboardWidgetCardContentSx}>
        <TableContainer sx={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
          <Table
            size="small"
            className="systemadmin-dashboard-widget-table systemadmin-dashboard-widget-count-table systemadmin-dashboard-widget-support-table"
            sx={adminDashboardWidgetTrackingTableSx}
          >
            <TableHead>
              <TableRow>
                <TableCell sx={adminDashboardWidgetTrackingHeaderCellSx}>Link</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {supportLinks.map((link, index) => (
                <TableRow
                  key={index}
                  hover
                  onClick={() => handleLinkClick(link)}
                  sx={{
                    ...adminDashboardWidgetTableRowSx,
                    cursor: "pointer",
                  }}
                >
                  <TableCell sx={adminDashboardWidgetTrackingCellSx}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 0.5,
                      }}
                    >
                      <span>{link.label}</span>
                      <ChevronRightIcon sx={{ fontSize: "0.875rem", flexShrink: 0 }} />
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default SystemSupport;
