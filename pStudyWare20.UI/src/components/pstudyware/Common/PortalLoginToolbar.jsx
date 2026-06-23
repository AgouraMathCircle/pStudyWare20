import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Container } from "@mui/material";
import { useAuth } from "../../../contexts/AuthContext";
import { useUnreadMessageCount } from "../../../hooks/useUnreadMessageCount";
import { getMessageCenterPath } from "../../../utils/routeUtils";
import portalHeaderBgImg from "../../../assets/images/bg.jpg";
import PortalMessageBadge from "./PortalMessageBadge";
import PortalMessagePopup from "./PortalMessagePopup";
import "../../../styles/PortalLoginToolbar.css";

const isAdminUser = (user) => {
  if (!user) return false;
  const memberType = user.memberType?.toUpperCase();
  return (
    memberType === "A" ||
    user.role === "Admin" ||
    user.role === "SystemAdmin"
  );
};

const isPortalHeaderUser = (user) => {
  if (!user) return false;
  const memberType = user.memberType?.toUpperCase();
  return (
    isAdminUser(user) ||
    memberType === "S" ||
    memberType === "I" ||
    memberType === "C" ||
    memberType === "V" ||
    user.role === "Student" ||
    user.role === "Instructor" ||
    user.role === "Volunteer"
  );
};

const PortalLoginToolbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { count: unreadCount } = useUnreadMessageCount(user, Boolean(user));
  const [messageAnchorEl, setMessageAnchorEl] = useState(null);

  if (!user || isPortalHeaderUser(user)) return null;

  const messagePopupOpen = Boolean(messageAnchorEl);

  const openMessagePopup = (event) => {
    setMessageAnchorEl(event.currentTarget);
  };

  const closeMessagePopup = () => {
    setMessageAnchorEl(null);
  };

  const handleOpenMessageCenter = () => {
    navigate(`${getMessageCenterPath(user)}?Action=U`);
  };

  return (
    <Box
      className="portal-login-toolbar"
      sx={{
        width: "100%",
        backgroundImage: `url(${portalHeaderBgImg})`,
        backgroundRepeat: "repeat",
        backgroundPosition: "center top",
        backgroundColor: "#1b2838",
        borderBottom: "1px solid rgba(255,255,255,0.12)",
      }}
    >
      <Container maxWidth={false} sx={{ px: { xs: 1.5, md: 3, lg: 4 } }}>
        <Box
          className="portal-login-toolbar__actions"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            flexWrap: "wrap",
            gap: { xs: 0.5, sm: 0.75 },
            minHeight: { xs: 32, md: 36 },
            py: 0.5,
            color: "#ffffff",
            fontSize: "0.82rem",
          }}
        >
          <PortalMessageBadge
            unreadCount={unreadCount}
            onClick={openMessagePopup}
            color="#ffffff"
            fontSize="0.82rem"
            iconSize={18}
          />
        </Box>
      </Container>

      <PortalMessagePopup
        anchorEl={messageAnchorEl}
        open={messagePopupOpen}
        onClose={closeMessagePopup}
        user={user}
        unreadCount={unreadCount}
        onOpenMessageCenter={handleOpenMessageCenter}
      />
    </Box>
  );
};

export default PortalLoginToolbar;
