import amcCurriculum from "../../../assets/files/AMC_Curriculam.pdf?url";

const MESSAGE_LINK_COLOR = "#1565c0";
const MESSAGE_BODY_COLOR = "#000000";

const YOUTUBE_LECTURES_LINK = {
  label: "Subscribe and Watch all the Lectures Video",
  href: "https://www.youtube.com/channel/UCWK2w-BVGps-Y9c08B5pRgA/featured",
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

const INSTRUCTOR_MESSAGE_CENTER_LINK = {
  label: "Open Message Center",
  href: "/pstudyware/instructor/message-center",
  external: false,
  color: MESSAGE_LINK_COLOR,
};

export const DASHBOARD_NOTICE_LINKS_BY_VARIANT = {
  student: [YOUTUBE_LECTURES_LINK, AMC_CURRICULUM_LINK],
  instructor: [
    {
      ...YOUTUBE_LECTURES_LINK,
      label: "Subscribe and Watch all the Lectures Notes Video",
    },
    INSTRUCTOR_MESSAGE_CENTER_LINK,
  ],
  coordinator: [
    {
      ...YOUTUBE_LECTURES_LINK,
      label: "Subscribe and Watch all the Lectures Notes Video",
    },
    INSTRUCTOR_MESSAGE_CENTER_LINK,
  ],
  volunteer: [
    {
      ...YOUTUBE_LECTURES_LINK,
      label: "Subscribe and Watch all the Lectures Notes Video",
    },
  ],
};

export const getDashboardNoticeLinks = (variant = "student") =>
  DASHBOARD_NOTICE_LINKS_BY_VARIANT[variant] ??
  DASHBOARD_NOTICE_LINKS_BY_VARIANT.student;
