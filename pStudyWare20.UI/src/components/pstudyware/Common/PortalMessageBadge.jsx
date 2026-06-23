import React from "react";
import { Box, Link } from "@mui/material";
import commentIconImg from "../../../assets/images/comment.png";

/**
 * Unread count + message bubble for portal role headers.
 */
const PortalMessageBadge = ({
  unreadCount,
  onClick,
  color = "#1b5e20",
  fontSize = "0.75rem",
  iconSize = 16,
}) => (
  <Link
    component="button"
    type="button"
    underline="always"
    onClick={onClick}
    aria-label={`${unreadCount} unread messages`}
    sx={{
      display: "inline-flex",
      alignItems: "center",
      gap: 0.35,
      color,
      fontSize,
      fontWeight: 600,
      p: 0,
      m: 0,
      minWidth: 0,
      border: 0,
      background: "none",
      cursor: "pointer",
      lineHeight: 1.2,
    }}
  >
    {unreadCount}
    <Box
      component="img"
      src={commentIconImg}
      alt=""
      sx={{ width: iconSize, height: iconSize, objectFit: "contain", display: "block" }}
    />
  </Link>
);

export default PortalMessageBadge;
