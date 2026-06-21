import { useCallback, useState } from "react";

export const compareValues = (left, right, order) => {
  if (left == null && right == null) return 0;
  if (left == null || left === "") return 1;
  if (right == null || right === "") return -1;

  if (typeof left === "number" && typeof right === "number") {
    return order === "asc" ? left - right : right - left;
  }

  const leftText = String(left).toLowerCase();
  const rightText = String(right).toLowerCase();
  if (leftText < rightText) return order === "asc" ? -1 : 1;
  if (leftText > rightText) return order === "asc" ? 1 : -1;
  return 0;
};

export const sortRows = (rows, sortField, sortOrder, getFieldValue) => {
  if (!sortField || !Array.isArray(rows)) {
    return rows ?? [];
  }

  return [...rows].sort((a, b) =>
    compareValues(
      getFieldValue(a, sortField),
      getFieldValue(b, sortField),
      sortOrder
    )
  );
};

export const toSortableDate = (value) => {
  if (value == null || value === "") return "";
  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? String(value).toLowerCase() : timestamp;
};

export const toSortableNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : String(value ?? "").toLowerCase();
};

/** Strip HTML from message body for inbox table display. */
export const getMessagePreview = (message) => {
  const raw = message?.message ?? message?.Message ?? "";
  if (!raw) return "";
  return raw
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
};

/** Field accessor for message center inbox / sent-mail table sorting. */
export const getMessageFieldValue = (message, field) => {
  switch (field) {
    case "from":
      return message?.sendFrom ?? message?.SendFrom ?? "";
    case "to":
      return message?.sendTo ?? message?.SendTo ?? "";
    case "subject":
      return message?.subject ?? message?.Subject ?? "";
    case "message":
      return getMessagePreview(message);
    case "messageDate":
      return toSortableDate(message?.sendDate ?? message?.SendDate ?? "");
    case "status":
      return message?.status ?? message?.Status ?? "";
    default:
      return "";
  }
};

/** Shared sort state + header click handler for portal tables. */
export const useTableSort = (initialField, initialOrder = "asc") => {
  const [sortField, setSortField] = useState(initialField);
  const [sortOrder, setSortOrder] = useState(initialOrder);

  const handleSort = useCallback(
    (field) => {
      const isAsc = sortField === field && sortOrder === "asc";
      setSortOrder(isAsc ? "desc" : "asc");
      setSortField(field);
    },
    [sortField, sortOrder]
  );

  const resetSortPage = useCallback(
    (resetPage) => {
      if (typeof resetPage === "function") {
        resetPage();
      }
    },
    []
  );

  const handleSortWithPageReset = useCallback(
    (field, resetPage) => {
      handleSort(field);
      if (typeof resetPage === "function") {
        resetPage();
      }
    },
    [handleSort]
  );

  return {
    sortField,
    sortOrder,
    setSortField,
    setSortOrder,
    handleSort,
    handleSortWithPageReset,
    resetSortPage,
  };
};
