import React from "react";
import { Route, Navigate } from "react-router-dom";
import RoleProtectedRoute from "./RoleProtectedRoute";
import StudentDocuments from "./pstudyware/Student/StudentDocuments";
import {
  MeetingDetails,
  EmailManager,
  ChangePassword,
} from "./pstudyware/Common";
import * as SystemAdminPages from "./pstudyware/SystemAdmin";

/**
 * SystemAdmin portal routes under /pstudyware/systemadmin.
 * Uses only SystemAdmin components (no Admin folder imports).
 */
export function buildSystemAdminPortalRoutes() {
  const base = "systemadmin";
  const prefix = `/pstudyware/${base}`;
  const allowedRoles = ["SystemAdmin"];
  const allowedMemberTypes = [];

  const {
    SystemAdminDashboard,
    InstructorManagement,
    RegisteredStudentList,
    StudentWaitingList,
    VolunteersRequest,
    SystemAdminVolunteerAvailability,
    TimeSheetTracking,
    SystemAdminUserTracking,
    SpecialEventsRegistration,
    PostMessage,
    DonorDetails,
    UploadAnswerKey,
    UpdateLookupSemester,
    SystemAdminReportCard,
    Documents,
    DocumentsRepository,
    SystemAdminInstructors,
    SystemAdminVolunteers,
    SystemAdminReports,
    SystemAdminSettings,
  } = SystemAdminPages;

  const wrap = (element) => (
    <RoleProtectedRoute
      allowedRoles={allowedRoles}
      allowedMemberTypes={allowedMemberTypes}
    >
      {element}
    </RoleProtectedRoute>
  );

  return [
    <Route
      key={`${base}-dashboard`}
      path={`${prefix}/dashboard`}
      element={wrap(<SystemAdminDashboard />)}
    />,
    <Route
      key={`${base}-instructor`}
      path={`${prefix}/instructor`}
      element={wrap(<InstructorManagement />)}
    />,
    <Route
      key={`${base}-instructors-redirect`}
      path={`${prefix}/instructors`}
      element={<Navigate to={`${prefix}/instructor`} replace />}
    />,
    <Route
      key={`${base}-registeredstudentlist`}
      path={`${prefix}/registeredstudentlist`}
      element={wrap(<RegisteredStudentList />)}
    />,
    <Route
      key={`${base}-students-redirect`}
      path={`${prefix}/students`}
      element={<Navigate to={`${prefix}/registeredstudentlist`} replace />}
    />,
    <Route
      key={`${base}-waiting-list`}
      path={`${prefix}/Studentwaiting-list`}
      element={wrap(<StudentWaitingList />)}
    />,
    <Route
      key={`${base}-volunteers-request`}
      path={`${prefix}/volunteers-request`}
      element={wrap(<VolunteersRequest />)}
    />,
    <Route
      key={`${base}-volunteers-availability`}
      path={`${prefix}/volunteers-availability`}
      element={wrap(<SystemAdminVolunteerAvailability />)}
    />,
    <Route
      key={`${base}-time-sheet`}
      path={`${prefix}/time-sheet-tracking`}
      element={wrap(<TimeSheetTracking />)}
    />,
    <Route
      key={`${base}-user-tracking`}
      path={`${prefix}/user-tracking`}
      element={wrap(<SystemAdminUserTracking />)}
    />,
    <Route
      key={`${base}-special-events`}
      path={`${prefix}/special-events-registration`}
      element={wrap(<SpecialEventsRegistration />)}
    />,
    <Route
      key={`${base}-post-message`}
      path={`${prefix}/post-message`}
      element={wrap(<PostMessage />)}
    />,
    <Route
      key={`${base}-donor-details`}
      path={`${prefix}/donor-details`}
      element={wrap(<DonorDetails />)}
    />,
    <Route
      key={`${base}-upload-answer-key`}
      path={`${prefix}/upload-answer-key`}
      element={wrap(<UploadAnswerKey />)}
    />,
    <Route
      key={`${base}-update-lookup`}
      path={`${prefix}/update-lookup-semester`}
      element={wrap(<UpdateLookupSemester />)}
    />,
    <Route
      key={`${base}-report-card`}
      path={`${prefix}/report-card`}
      element={wrap(<SystemAdminReportCard />)}
    />,
    <Route
      key={`${base}-class-material`}
      path={`${prefix}/class-material`}
      element={wrap(<Documents />)}
    />,
    <Route
      key={`${base}-message-center`}
      path={`${prefix}/message-center`}
      element={wrap(<EmailManager />)}
    />,
    <Route
      key={`${base}-meeting-details`}
      path={`${prefix}/meeting-details`}
      element={wrap(<MeetingDetails />)}
    />,
    <Route
      key={`${base}-change-password`}
      path={`${prefix}/change-password`}
      element={wrap(<ChangePassword />)}
    />,
    <Route
      key={`${base}-update-password`}
      path={`${prefix}/update-password`}
      element={<Navigate to={`${prefix}/change-password`} replace />}
    />,
    <Route
      key={`${base}-docs-repository`}
      path={`${prefix}/docs-repository`}
      element={wrap(<DocumentsRepository />)}
    />,
    <Route
      key={`${base}-student-docs`}
      path={`${prefix}/student-docs`}
      element={wrap(<StudentDocuments />)}
    />,
    <Route
      key={`${base}-instructors-page`}
      path={`${prefix}/systemadmin-instructors`}
      element={wrap(<SystemAdminInstructors />)}
    />,
    <Route
      key={`${base}-volunteers-page`}
      path={`${prefix}/systemadmin-volunteers`}
      element={wrap(<SystemAdminVolunteers />)}
    />,
    <Route
      key={`${base}-reports-page`}
      path={`${prefix}/systemadmin-reports`}
      element={wrap(<SystemAdminReports />)}
    />,
    <Route
      key={`${base}-settings-page`}
      path={`${prefix}/systemadmin-settings`}
      element={wrap(<SystemAdminSettings />)}
    />,
  ];
}
