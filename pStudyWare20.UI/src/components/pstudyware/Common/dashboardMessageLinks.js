import amcCurriculum from "../../../assets/files/AMC_Curriculam.pdf?url";

const MESSAGE_LINK_COLOR = "#1565c0";
const MESSAGE_BODY_COLOR = "#000000";

const YOUTUBE_LECTURES_LINK = {
  label: "Subscribe and Watch all the Lectures",
  href: "https://www.youtube.com/@AgouraMathCircle/videos",
  external: true,
  color: MESSAGE_LINK_COLOR,
};

const AMC_CURRICULUM_LINK = {
  label: "AMC Curriculum",
  prefix: "View: ",
  prefixColor: MESSAGE_BODY_COLOR,
  href: amcCurriculum,
  external: true,
  color: MESSAGE_LINK_COLOR,
};

export const DASHBOARD_NOTICE_LINKS_BY_VARIANT = {
  student: [YOUTUBE_LECTURES_LINK, AMC_CURRICULUM_LINK],
  instructor: [YOUTUBE_LECTURES_LINK],
  coordinator: [YOUTUBE_LECTURES_LINK],
  volunteer: [YOUTUBE_LECTURES_LINK],
};

export const getDashboardNoticeLinks = (variant = "student") =>
  DASHBOARD_NOTICE_LINKS_BY_VARIANT[variant] ??
  DASHBOARD_NOTICE_LINKS_BY_VARIANT.student;
