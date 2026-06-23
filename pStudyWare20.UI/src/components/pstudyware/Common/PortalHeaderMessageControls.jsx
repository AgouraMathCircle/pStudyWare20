import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUnreadMessageCount } from "../../../hooks/useUnreadMessageCount";
import { getMessageCenterPath } from "../../../utils/routeUtils";
import PortalMessageBadge from "./PortalMessageBadge";
import PortalMessagePopup from "./PortalMessagePopup";

const PortalHeaderMessageControls = ({
  user,
  color = "#1b5e20",
}) => {
  const navigate = useNavigate();
  const [messageAnchorEl, setMessageAnchorEl] = useState(null);
  const { count: unreadCount } = useUnreadMessageCount(user, Boolean(user));

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

  if (!user) return null;

  return (
    <>
      <PortalMessageBadge
        unreadCount={unreadCount}
        onClick={openMessagePopup}
        color={color}
      />
      <PortalMessagePopup
        anchorEl={messageAnchorEl}
        open={messagePopupOpen}
        onClose={closeMessagePopup}
        user={user}
        unreadCount={unreadCount}
        onOpenMessageCenter={handleOpenMessageCenter}
      />
    </>
  );
};

export default PortalHeaderMessageControls;
