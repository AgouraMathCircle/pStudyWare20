import { useCallback, useEffect, useState } from "react";
import emailManagerService from "../services/emailManagerService";
import { getPortalUsername } from "../utils/portalUsername";
import { UNREAD_MESSAGE_COUNT_EVENT } from "../utils/messageCenterEvents";

export function useUnreadMessageCount(user, enabled = true) {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    const username = getPortalUsername(user);
    if (!enabled || (!username && !user)) {
      setCount(0);
      return;
    }

    try {
      setLoading(true);
      const response = await emailManagerService.getMessageTotal(username || null);
      const success =
        response?.isSuccess === true || response?.IsSuccess === true;
      const total = Number(response?.total ?? response?.Total ?? 0);

      setCount(success && Number.isFinite(total) ? total : 0);
    } catch {
      setCount(0);
    } finally {
      setLoading(false);
    }
  }, [enabled, user]);

  useEffect(() => {
    refresh();
    const intervalId = window.setInterval(refresh, 120000);
    const onCountChanged = () => {
      refresh();
    };
    const onFocus = () => {
      refresh();
    };

    window.addEventListener(UNREAD_MESSAGE_COUNT_EVENT, onCountChanged);
    window.addEventListener("focus", onFocus);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener(UNREAD_MESSAGE_COUNT_EVENT, onCountChanged);
      window.removeEventListener("focus", onFocus);
    };
  }, [refresh]);

  return { count, loading, refresh };
}
