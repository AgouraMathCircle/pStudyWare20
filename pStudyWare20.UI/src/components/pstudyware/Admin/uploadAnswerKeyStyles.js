/**
 * Upload Online Exam Answer Key — styles aligned with Admin Instructor List
 * (/pstudyware/admin/instructor → InstructorList.jsx).
 */
import {
  adminSessionListEmptyCellSx,
  adminSessionListEmptyTextSx,
  adminSessionListFindButtonSx,
  adminSessionListHeaderBarSx,
  adminSessionListMenuItemSx,
  adminSessionListPanelCardSx,
  adminSessionListPanelContentSx,
  adminSessionListSearchBarSx,
  adminSessionListSearchFieldSx,
  adminSessionListSearchLabelSx,
  adminSessionListSearchSelectSx,
  adminSessionListTableActionLinkSx,
  adminSessionListTableDeleteLinkSx,
  adminSessionListTableBodyCellSx,
  adminSessionListTableBodyRowSx,
  adminSessionListTableContainerSx,
  adminSessionListTableHeadCellSx,
  adminSessionListTableHeadRowSx,
  adminSessionListTableSx,
  adminSessionListTitleSx,
} from "../styles/applicationSurfaces";

/** Legacy UploadAnswerkey.aspx grid page size. */
export const UPLOAD_ANSWER_KEY_PAGE_SIZE = 30;

/** Page shell — matches InstructorManagement.jsx */
export const uploadAnswerKeyPageSx = {
  flex: 1,
  minHeight: 0,
  width: "100%",
  display: "flex",
  flexDirection: "column",
};

export const uploadAnswerKeyColumnWidths = {
  actions: "8%",
  questionId: "6%",
  class: "7%",
  examType: "9%",
  question: "20%",
  answerKey: "12%",
  points: "6%",
  session: "12%",
  category: "10%",
  questionPaper: "10%",
};

export const uploadAnswerKeyPanelCardSx = adminSessionListPanelCardSx;

export const uploadAnswerKeyPanelContentSx = adminSessionListPanelContentSx;

export const uploadAnswerKeyHeaderBarSx = adminSessionListHeaderBarSx;

export const uploadAnswerKeyTitleSx = adminSessionListTitleSx;

export const uploadAnswerKeySearchBarSx = adminSessionListSearchBarSx;

export const uploadAnswerKeySearchLabelSx = adminSessionListSearchLabelSx;

export const uploadAnswerKeySearchSelectSx = adminSessionListSearchSelectSx;

export const uploadAnswerKeySearchFieldSx = adminSessionListSearchFieldSx;

export const uploadAnswerKeyFindButtonSx = adminSessionListFindButtonSx;

export const uploadAnswerKeyMenuItemSx = adminSessionListMenuItemSx;

/** Toolbar actions — matches instructorHeaderActionButtonSx */
export const uploadAnswerKeyHeaderActionButtonSx = {
  ...adminSessionListFindButtonSx,
  backgroundColor: "#4caf50",
  color: "white",
  flexShrink: 0,
  px: 1.5,
  "&:hover": { backgroundColor: "#43a047" },
};

export const uploadAnswerKeyDeleteLinkSx = adminSessionListTableDeleteLinkSx;

export const uploadAnswerKeyTableContainerSx = adminSessionListTableContainerSx;

export const uploadAnswerKeyTableSx = adminSessionListTableSx;

export const uploadAnswerKeyTableHeadRowSx = adminSessionListTableHeadRowSx;

export const uploadAnswerKeyHeadCellSx = adminSessionListTableHeadCellSx;

export const uploadAnswerKeyBodyRowSx = adminSessionListTableBodyRowSx;

export const uploadAnswerKeyBodyCellSx = adminSessionListTableBodyCellSx;

export const uploadAnswerKeyActionLinkSx = adminSessionListTableActionLinkSx;

export const uploadAnswerKeyEmptyCellSx = adminSessionListEmptyCellSx;

export const uploadAnswerKeyEmptyTextSx = adminSessionListEmptyTextSx;
