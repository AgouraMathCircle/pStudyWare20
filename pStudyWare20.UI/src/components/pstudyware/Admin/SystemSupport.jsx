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

const SystemSupport = () => {
  const navigate = useNavigate();

  // Define system support links
  const supportLinks = [
    {
      label: "Waiting List",
      href: "../Pstudyware/StudentWaitingList.aspx",
      isReact: false,
    },
    {
      label: "Volunteers Request",
      href: "../Pstudyware/VolunteersRequest.aspx",
      isReact: false,
    },
    {
      label: "Time Sheet",
      href: "../Pstudyware/TimeSheetTracking.aspx",
      isReact: false,
    },
    {
      label: "Special Events Registration List",
      href: "../Pstudyware/SpecialEventsRegistration.aspx",
      isReact: false,
    },
    {
      label: "Upload Online Exam Answer Key",
      href: "../Pstudyware/UploadAnswerKey.aspx",
      isReact: false,
    },
    {
      label: "Update Lookup",
      href: "../Pstudyware/UpdateLookupSemester.aspx",
      isReact: false,
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
      href: "../Pstudyware/Postmessage.aspx",
      isReact: false,
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
    <Card elevation={3} sx={{ height: "100%" }}>
      <CardHeader
        avatar={<SupportIcon color="secondary" />}
        title={
          <Typography variant="subtitle1" component="div" sx={{ fontSize: '1rem' }}>
            System Support
          </Typography>
        }
        sx={{
          backgroundColor: (theme) => theme.palette.secondary.light,
          color: (theme) => theme.palette.secondary.contrastText,
          padding: "3px 5px",
          "& .MuiCardHeader-avatar": {
            color: (theme) => theme.palette.secondary.contrastText,
          },
        }}
      />
      <CardContent sx={{ p: 0, maxHeight: 500, overflowY: "auto" }}>
        <List dense sx={{ py: 0 }}>
          {supportLinks.map((link, index) => (
            <React.Fragment key={index}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => handleLinkClick(link)}
                  sx={{
                    py: 0.5,
                    px: 1.5,
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
