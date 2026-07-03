export const UNREAD_MESSAGE_COUNT_EVENT = "portal-unread-message-count-changed";

/** Notify header badge / hooks to reload unread count from the API. */
export function notifyUnreadMessageCountChanged() {
  window.dispatchEvent(new CustomEvent(UNREAD_MESSAGE_COUNT_EVENT));
}
