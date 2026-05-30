import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import {
  Support as SupportIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import {
  adminPortalCardHeaderStripSx,
  adminDashboardWidgetCardSx,
  adminDashboardWidgetCardContentFlushSx,
  adminDashboardWidgetTitleSx,
  adminDashboardWidgetListItemButtonSx,
  adminDashboardWidgetListItemTextProps,
  adminDashboardWidgetTableRowSx,
} from "../../../styles/applicationSurfaces";

const SystemSupport = () => {
  const navigate = useNavigate();

  // Define system support links
  const supportLinks = [
    {
      label: "Student Waiting List",
      href: "/pstudyware/admin/Studentwaiting-list",
      isReact: true,
    },
    {
      label: "Volunteers Request",
      href: "/pstudyware/admin/volunteers-request",
      isReact: true,
    },
    {
      label: "Time Sheet",
      href: "/pstudyware/admin/time-sheet-tracking",
      isReact: true,
    },
    {
      label: "Special Events Registration List",
      href: "/pstudyware/admin/special-events-registration",
      isReact: true,
    },
    {
      label: "Upload Online Exam Answer Key",
      href: "/pstudyware/admin/upload-answer-key",
      isReact: true,
    },
    {
      label: "Update Lookup",
      href: "/pstudyware/admin/update-lookup-semester",
      isReact: true,
    },
    {
      label: "Meeting Schedule",
      href: "/pstudyware/admin/meeting-details",
      isReact: true,
    },
    {
      label: "Update Donor Details",
      href: "../Pstudyware/DonorDetails.aspx",
      isReact: false,
    },
    {
      label: "Post Message",
      href: "/pstudyware/admin/post-message",
      isReact: true,
    },
    {
      label: "Report Card",
      href: "/pstudyware/admin/report-card",
      isReact: true,
    },
  ];

  const handleLinkClick = (link) => {
    if (link.isReact) {
      navigate(link.href);
    } else {
      window.location.href = link.href;
    }
  };

  return (
    <Card
      elevation={3}
      className="admin-dashboard-widget-card"
      sx={{
        ...adminDashboardWidgetCardSx,
        width: "100%",
        maxWidth: "100%",
      }}
    >
      <CardHeader
        avatar={<SupportIcon fontSize="small" />}
        title={
          <Typography variant="subtitle1" component="div" sx={adminDashboardWidgetTitleSx}>
            System Support
          </Typography>
        }
        sx={adminPortalCardHeaderStripSx}
      />
      <CardContent sx={adminDashboardWidgetCardContentFlushSx}>
        <List
          dense
          disablePadding
          className="admin-dashboard-widget-list"
          sx={{
            py: 0,
            flex: 1,
            minHeight: 0,
            overflow: "auto",
          }}
        >
          {supportLinks.map((link, index) => (
            <ListItem
              key={index}
              disablePadding
              sx={{
                minHeight: 0,
                py: 0,
                ...adminDashboardWidgetTableRowSx,
              }}
            >
              <ListItemButton
                onClick={() => handleLinkClick(link)}
                sx={{
                  ...adminDashboardWidgetListItemButtonSx,
                  width: "100%",
                  backgroundColor: "transparent",
                  "&:hover": {
                    backgroundColor: (theme) => theme.palette.action.selected,
                  },
                }}
              >
                <ListItemText
                  primary={link.label}
                  primaryTypographyProps={adminDashboardWidgetListItemTextProps}
                />
                <ChevronRightIcon sx={{ fontSize: "0.875rem" }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default SystemSupport;
