import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Popover,
  Typography,
} from "@mui/material";
import { Inbox as InboxIcon } from "@mui/icons-material";
import emailManagerService from "../../../services/emailManagerService";
import { getMessageCenterPath } from "../../../utils/routeUtils";
import { getPortalUsername } from "../../../utils/portalUsername";
import { getMessagePreview } from "../../../utils/tableSort";

const formatMessageDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const getSenderLabel = (message) =>
  message?.senderName ||
  message?.SenderName ||
  message?.sendFrom ||
  message?.SendFrom ||
  "Unknown sender";

const PortalMessagePopup = ({
  anchorEl,
  open,
  onClose,
  user,
  unreadCount,
  onOpenMessageCenter,
}) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    const loadMessages = async () => {
      const username = getPortalUsername(user);
      if (!username) {
        setMessages([]);
        return;
      }

      try {
        setLoading(true);
        const response = await emailManagerService.getMessages(username);
        if (cancelled) return;

        const list = response?.messages ?? response?.Messages ?? [];
        setMessages(Array.isArray(list) ? list.slice(0, 8) : []);
      } catch {
        if (!cancelled) setMessages([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadMessages();
    return () => {
      cancelled = true;
    };
  }, [open, user]);

  const handleOpenMessageCenter = () => {
    onClose?.();
    if (onOpenMessageCenter) {
      onOpenMessageCenter();
      return;
    }
    navigate(`${getMessageCenterPath(user)}?Action=U`);
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      slotProps={{
        paper: {
          sx: {
            width: 340,
            maxWidth: "92vw",
            borderRadius: 1.5,
            boxShadow: "0 10px 28px rgba(0,0,0,0.22)",
          },
        },
      }}
    >
      <Box sx={{ px: 2, py: 1.5 }}>
        <Typography sx={{ fontWeight: 700, fontSize: "0.95rem", color: "#102d47" }}>
          Messages
        </Typography>
        <Typography sx={{ fontSize: "0.8rem", color: "#546e7a", mt: 0.25 }}>
          {unreadCount > 0
            ? `You have ${unreadCount} unread message${unreadCount === 1 ? "" : "s"}.`
            : "No unread messages."}
        </Typography>
      </Box>

      <Divider />

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
          <CircularProgress size={24} />
        </Box>
      ) : messages.length === 0 ? (
        <Box sx={{ px: 2, py: 2.5 }}>
          <Typography sx={{ fontSize: "0.85rem", color: "#607d8b" }}>
            Your inbox is empty.
          </Typography>
        </Box>
      ) : (
        <List dense disablePadding sx={{ maxHeight: 280, overflowY: "auto" }}>
          {messages.map((message, index) => {
            const key =
              message?.trackingID ||
              message?.TrackingID ||
              message?.messageID ||
              message?.MessageID ||
              `message-${index}`;

            return (
              <ListItemButton
                key={key}
                onClick={handleOpenMessageCenter}
                sx={{
                  alignItems: "flex-start",
                  py: 1.1,
                  borderBottom: "1px solid #eceff1",
                }}
              >
                <ListItemText
                  primary={message?.subject || message?.Subject || "(No subject)"}
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        sx={{ display: "block", color: "#455a64" }}
                      >
                        {getSenderLabel(message)}
                      </Typography>
                      <Typography
                        component="span"
                        variant="caption"
                        sx={{ display: "block", color: "#78909c", mt: 0.25 }}
                      >
                        {formatMessageDate(message?.sendDate || message?.SendDate)}
                      </Typography>
                      <Typography
                        component="span"
                        variant="caption"
                        sx={{
                          display: "block",
                          color: "#607d8b",
                          mt: 0.35,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {getMessagePreview(message)}
                      </Typography>
                    </>
                  }
                  primaryTypographyProps={{
                    fontWeight: 600,
                    fontSize: "0.84rem",
                    color: "#102d47",
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      )}

      <Divider />

      <Box sx={{ p: 1.25, display: "flex", justifyContent: "center" }}>
        <Button
          size="small"
          variant="contained"
          color="success"
          startIcon={<InboxIcon fontSize="small" />}
          onClick={handleOpenMessageCenter}
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          Open Message Center
        </Button>
      </Box>
    </Popover>
  );
};

export default PortalMessagePopup;
