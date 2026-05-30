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
  Box,
} from "@mui/material";
import {
  Support as SupportIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import {
  adminPortalCardHeaderStripSx,
  adminDashboardWidgetCardSx,
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
    <Card elevation={3} sx={adminDashboardWidgetCardSx}>
      <CardHeader
        avatar={<SupportIcon fontSize="small" />}
        title={
          <Typography
            variant="subtitle1"
            component="div"
            sx={{ fontSize: "0.9375rem" }}
          >
            System Support
          </Typography>
        }
        sx={adminPortalCardHeaderStripSx}
      />
      <CardContent
        sx={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          px: 0,
          pt: 0,
          pb: 0,
          overflow: "hidden",
        }}
      >
        <List
          dense
          disablePadding
          sx={{
            py: 0,
            flex: 1,
            minHeight: 0,
            overflow: "auto",
          }}
        >
          {supportLinks.map((link, index) => (
            <React.Fragment key={index}>
              <ListItem disablePadding sx={{ minHeight: 0 }}>
                <ListItemButton
                  onClick={() => handleLinkClick(link)}
                  sx={{
                    py: 0.25,
                    px: 1.5,
                    minHeight: 32,
                    "&:hover": {
                      backgroundColor: (theme) => theme.palette.action.hover,
                    },
                  }}
                >
                  <ListItemText
                    primary={link.label}
                    primaryTypographyProps={{
                      fontSize: "0.75rem",
                    }}
                  />
                  <ChevronRightIcon fontSize="small" />
                </ListItemButton>
              </ListItem>
              {index < supportLinks.length - 1 && (
                <Box
                  sx={{
                    borderBottom: 1,
                    borderColor: "divider",
                    mx: 1.5,
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default SystemSupport;
