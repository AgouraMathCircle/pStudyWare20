import React from "react";
import DashboardMessages from "../Student/DashboardMessages";

/**
 * Instructor/coordinator dashboard messages — delegates to shared DashboardMessages
 * with instructor portal styling and links.
 */
const InstructorDashboardMessages = (props) => (
  <DashboardMessages
    variant="instructor"
    timeSheetUrl="/pstudyware/instructor/time-sheet"
    {...props}
  />
);

export default InstructorDashboardMessages;
