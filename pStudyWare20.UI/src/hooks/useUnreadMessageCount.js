import { useCallback, useEffect, useState } from "react";
import emailManagerService from "../services/emailManagerService";
import { getPortalUsername } from "../utils/portalUsername";

export function useUnreadMessageCount(user, enabled = true) {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    const username = getPortalUsername(user);
    if (!enabled || !username) {
      setCount(0);
      return;
    }

    try {
      setLoading(true);
      const response = await emailManagerService.getMessageTotal(username);
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
    const id = window.setInterval(refresh, 120000);
    return () => window.clearInterval(id);
  }, [refresh]);

  return { count, loading, refresh };
}
