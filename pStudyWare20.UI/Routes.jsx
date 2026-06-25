import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./src/contexts/AuthContext";
import AppLayout from "./src/components/AppLayout";
import Home from "./src/components/Home";
import Overview from "./src/components/Overview";
import About from "./src/components/About";
import MathCircle from "./src/components/MathCircle";
import Leadership from "./src/components/Leadership";
import OurTeam from "./src/components/OurTeam";
import Alumini from "./src/components/Alumini";
import EngineeringCircle from "./src/components/EngineeringCircle";
import Projects from "./src/components/Projects";
import TestPreparation from "./src/components/TestPreparation";
import SatelliteProgram from "./src/components/SatelliteProgram";
import Contact from "./src/components/Contact";
import Gallery from "./src/components/Gallery";
import PhotoGallery from "./src/components/PhotoGallery";
import VideoGallery from "./src/components/VideoGallery";
import NewsGallery from "./src/components/NewsGallery";
import AmcClass from "./src/components/AmcClass";
import AwardCeremony2017 from "./src/components/AwardCeremony2017";
import AwardCeremony2018 from "./src/components/AwardCeremony2018";
import AwardCeremony2019 from "./src/components/AwardCeremony2019";
import AwardCeremony2023 from "./src/components/AwardCeremony2023";
import AwardCeremony2024 from "./src/components/AwardCeremony2024";
import AwardCeremony2025 from "./src/components/AwardCeremony2025";
import AwardCeremony2026 from "./src/components/AwardCeremony2026";
import EC from "./src/components/EC";
import FieldTrip2016 from "./src/components/FieldTrip2016";
import MathKangaroo from "./src/components/MathKangaroo";
import MathKangaroo2017 from "./src/components/MathKangaroo2017";
import Donate from "./src/components/Donate";
import StudentRegistration from "./src/components/StudentRegistration";
import VolunteerRegistration from "./src/components/VolunteerRegistration";
import FAQ from "./src/components/FAQ";
import Resources from "./src/components/Resources";
import Internship from "./src/components/Internship";
import Rules from "./src/components/Rules";
import Login from "./src/components/Login";
import ProtectedRoute from "./src/components/ProtectedRoute";
import RoleProtectedRoute from "./src/components/RoleProtectedRoute";
import StudentDashboard from "./src/components/pstudyware/Student/StudentDashboard";
import StudentChangePassword from "./src/components/pstudyware/Student/StudentChangePassword";
import ClassMaterial from "./src/components/pstudyware/Student/ClassMaterial";
import { UpdateProfileRouteOpener } from "./src/contexts/UpdateProfileModalContext";
import StudentDocuments from "./src/components/pstudyware/Student/StudentDocuments";
import OnlineExam from "./src/components/pstudyware/Student/OnlineExam";
import StudentScore from "./src/components/pstudyware/Student/StudentScore";
import FinalExam from "./src/components/pstudyware/Student/FinalExam";
import ReportCard from "./src/components/pstudyware/Student/ReportCard";
import AdminDashboard from "./src/components/pstudyware/Admin/AdminDashboard";
import AdminInstructors from "./src/components/pstudyware/Admin/AdminInstructors";
import AdminVolunteers from "./src/components/pstudyware/Admin/AdminVolunteers";
import AdminReports from "./src/components/pstudyware/Admin/AdminReports";
import AdminSettings from "./src/components/pstudyware/Admin/AdminSettings";
import AdminChangePassword from "./src/components/pstudyware/Admin/AdminChangePassword";
import InstructorManagement from "./src/components/pstudyware/Admin/InstructorManagement";
import {
  DocumentManagement,
  Documents,
} from "./src/components/pstudyware/Admin";
import RegisteredStudentList from "./src/components/pstudyware/Admin/RegisteredStudentList";
import StudentWaitingList from "./src/components/pstudyware/Admin/StudentWaitingList";
import VolunteersRequest from "./src/components/pstudyware/Admin/VolunteersRequest";
import TimeSheetTracking from "./src/components/pstudyware/Admin/TimeSheetTracking";
import SpecialEventsRegistration from "./src/components/pstudyware/Admin/SpecialEventsRegistration";
import PostMessage from "./src/components/pstudyware/Admin/PostMessage";
import UploadAnswerKey from "./src/components/pstudyware/Admin/UploadAnswerKey";
import UpdateLookupSemester from "./src/components/pstudyware/Admin/UpdateLookupSemester";
import AdminReportCard from "./src/components/pstudyware/Admin/AdminReportCard";
import AdminUserTracking from "./src/components/pstudyware/Admin/AdminUserTracking";
import AdminVolunteerAvailability from "./src/components/pstudyware/Admin/AdminVolunteerAvailability";
import {
  InstructorShell,
  InstructorDashboard,
} from "./src/components/pstudyware/Instructor";
import {
  VolunteerShell,
  VolunteerDashboard,
  VolunteerTimeSheet,
} from "./src/components/pstudyware/Volunteer";
import SentEmail from "./src/components/pstudyware/Common/SentEmail";
import {
  DocumentsRepository,
  EmailManager,
  MeetingDetails,
  UpdatePassword,
} from "./src/components/pstudyware/Common";


// function PstudywareUpdateProfileRedirect() {
//   const { studentId } = useParams();
//   return <Navigate to={`/UpdateProfile/${studentId}`} replace />;
// }

const AppRoutes = () => {
  return (
    <Router>
      <AuthProvider>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about/overview" element={<Overview />} />
            <Route path="/about/math-circle" element={<MathCircle />} />
            <Route
              path="/about/engineering-circle"
              element={<EngineeringCircle />}
            />
            <Route path="/about/projects" element={<Projects />} />
            <Route
              path="/about/test-preparation"
              element={<TestPreparation />}
            />
            <Route
              path="/about/satellite-program"
              element={<SatelliteProgram />}
            />
            <Route path="/satellite-program" element={<SatelliteProgram />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/gallery/photo" element={<PhotoGallery />} />
            <Route
              path="/gallery/photo/AwardCeremony2026"
              element={<AwardCeremony2026 />}
            />
            <Route
              path="/gallery/photo/AwardCeremony2025"
              element={<AwardCeremony2025 />}
            />
            <Route
              path="/gallery/photo/AwardCeremony2024"
              element={<AwardCeremony2024 />}
            />
            <Route
              path="/gallery/photo/AwardCeremony2023"
              element={<AwardCeremony2023 />}
            />
            <Route
              path="/gallery/photo/AwardCeremony2019"
              element={<AwardCeremony2019 />}
            />
            <Route
              path="/gallery/photo/AwardCeremony2018"
              element={<AwardCeremony2018 />}
            />
            <Route
              path="/gallery/photo/AwardCeremony2017"
              element={<AwardCeremony2017 />}
            />
            <Route
              path="/gallery/photo/MathKangaroo2017"
              element={<MathKangaroo2017 />}
            />
            <Route
              path="/gallery/photo/MathKangaroo"
              element={<MathKangaroo />}
            />
            <Route path="/gallery/photo/AmcClass" element={<AmcClass />} />
            <Route
              path="/gallery/photo/FieldTrip2016"
              element={<FieldTrip2016 />}
            />
            <Route path="/gallery/photo/EC" element={<EC />} />
            <Route path="/gallery/video" element={<VideoGallery />} />
            <Route path="/gallery/news" element={<NewsGallery />} />
            <Route path="/donate" element={<Donate />} />
            <Route
              path="/studentregistration"
              element={<StudentRegistration />}
            />
            <Route
              path="/registration/student"
              element={<StudentRegistration />}
            />

            <Route
              path="/volunteerregistration"
              element={<VolunteerRegistration />}
            />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/internship" element={<Internship />} />
            <Route path="/rules" element={<Rules />} />
            <Route path="/login" element={<Login />} />

            {/* Student Routes */}
            <Route
              path="/pstudyware/student/dashboard"
              element={
                <RoleProtectedRoute
                  allowedRoles={["Student"]}
                  allowedMemberTypes={["S"]}
                >
                  <StudentDashboard />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/pstudyware/student/class-material"
              element={
                <RoleProtectedRoute
                  allowedRoles={["Student"]}
                  allowedMemberTypes={["S"]}
                >
                  <ClassMaterial />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/student/update-score"
              element={
                <RoleProtectedRoute
                  allowedRoles={["Student"]}
                  allowedMemberTypes={["S"]}
                >
                  <StudentScore />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/pstudyware/student/update-score"
              element={
                <RoleProtectedRoute
                  allowedRoles={["Student"]}
                  allowedMemberTypes={["S"]}
                >
                  <StudentScore />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/student/online-exam"
              element={
                <RoleProtectedRoute
                  allowedRoles={["Student"]}
                  allowedMemberTypes={["S"]}
                >
                  <OnlineExam />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/pstudyware/student/online-exam"
              element={
                <RoleProtectedRoute
                  allowedRoles={["Student"]}
                  allowedMemberTypes={["S"]}
                >
                  <OnlineExam />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/student/final-exam"
              element={
                <RoleProtectedRoute
                  allowedRoles={["Student"]}
                  allowedMemberTypes={["S"]}
                >
                  <FinalExam />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/pstudyware/student/final-exam"
              element={
                <RoleProtectedRoute
                  allowedRoles={["Student"]}
                  allowedMemberTypes={["S"]}
                >
                  <FinalExam />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/student/upload-documents"
              element={
                <RoleProtectedRoute
                  allowedRoles={["Student"]}
                  allowedMemberTypes={["S"]}
                >
                  <StudentDocuments />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/pstudyware/student/upload-documents"
              element={
                <RoleProtectedRoute
                  allowedRoles={["Student"]}
                  allowedMemberTypes={["S"]}
                >
                  <StudentDocuments />
                </RoleProtectedRoute>
              }
            />
            <Route path="/Leadership" element={<Leadership />} />
            <Route path="/ourteam" element={<OurTeam />} />
            <Route path="/Alumini" element={<Alumini />} />
            <Route
              path="/studentregistration"
              element={<StudentRegistration />}
            />
            <Route
              path="/pstudyware/student/my-documents"
              element={
                <RoleProtectedRoute
                  allowedRoles={["Student"]}
                  allowedMemberTypes={["S"]}
                >
                  <StudentDocuments />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/student/report-card"
              element={
                <RoleProtectedRoute
                  allowedRoles={["Student"]}
                  allowedMemberTypes={["S"]}
                >
                  <ReportCard />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/pstudyware/student/report-card"
              element={
                <RoleProtectedRoute
                  allowedRoles={["Student"]}
                  allowedMemberTypes={["S"]}
                >
                  <ReportCard />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/pstudyware/student/message-center"
              element={
                <RoleProtectedRoute
                  allowedRoles={["Student"]}
                  allowedMemberTypes={["S"]}
                >
                  <EmailManager />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/pstudyware/student/update-password"
              element={
                <RoleProtectedRoute
                  allowedRoles={["Student"]}
                  allowedMemberTypes={["S"]}
                >
                  <StudentChangePassword />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/UpdateProfile/:studentId?"
              element={
                <RoleProtectedRoute
                  allowedRoles={[
                    "Student",
                    "Admin",
                    "SystemAdmin",
                    "Instructor",
                  ]}
                  allowedMemberTypes={["S", "A", "I"]}
                >
                  <UpdateProfileRouteOpener />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/pstudyware/student/update-profile"
              element={<Navigate to="/UpdateProfile" replace />}
            />
            {/* <Route
              path="/pstudyware/student/update-profile/:studentId"
              element={<PstudywareUpdateProfileRedirect />}
            /> */}
            <Route
              path="/student/updateprofile/:studentId"
              element={
                <RoleProtectedRoute
                  allowedRoles={["Student"]}
                  allowedMemberTypes={["S"]}
                >
                  <UpdateProfileRouteOpener />
                </RoleProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/pstudyware/admin/dashboard"
              element={
                <RoleProtectedRoute
                  allowedRoles={["Admin", "SystemAdmin"]}
                  allowedMemberTypes={["A"]}
                >
                  <AdminDashboard />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <RoleProtectedRoute
                  allowedRoles={["Admin", "SystemAdmin"]}
                  allowedMemberTypes={["A"]}
                >
                  <AdminDashboard />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/pstudyware/admin/instructor"
              element={
                <RoleProtectedRoute
                  allowedRoles={["Admin", "SystemAdmin"]}
                  allowedMemberTypes={["A"]}
                >
                  <InstructorManagement />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/pstudyware/admin/instructors"
              element={
                <Navigate to="/pstudyware/admin/instructor" replace />
              }
            />
            <Route
              path="/pstudyware/admin/registeredstudentlist"
              element={
                <RoleProtectedRoute
                  allowedRoles={["Admin", "SystemAdmin"]}
                  allowedMemberTypes={["A"]}
                >
                  <RegisteredStudentList />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/pstudyware/admin/students"
              element={
                <Navigate
                  to="/pstudyware/admin/registeredstudentlist"
                  replace
                />
              }
            />
            <Route
              path="/pstudyware/admin/Studentwaiting-list"
              element={
                <RoleProtectedRoute
                  allowedRoles={["Admin", "SystemAdmin"]}
                  allowedMemberTypes={["A"]}
                >
                  <StudentWaitingList />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/admin/Studentwaiting-list"
              element={
                <RoleProtectedRoute
                  allowedRoles={["Admin", "SystemAdmin"]}
                  allowedMemberTypes={["A"]}
                >
                  <StudentWaitingList />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/pstudyware/admin/volunteers-request"
              element={
                <RoleProtectedRoute
                  allowedRoles={["Admin", "SystemAdmin"]}
                  allowedMemberTypes={["A"]}
                >
                  <VolunteersRequest />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/admin/volunteers-request"
              element={
                <RoleProtectedRoute
                  allowedRoles={["Admin", "SystemAdmin"]}
                  allowedMemberTypes={["A"]}
                >
                  <VolunteersRequest />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/pstudyware/admin/volunteers-availability"
              element={
                <RoleProtectedRoute
                  allowedRoles={["Admin", "SystemAdmin"]}
                  allowedMemberTypes={["A"]}
                >
                  <AdminVolunteerAvailability />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/admin/volunteers-availability"
              element={
                <RoleProtectedRoute
                  allowedRoles={["Admin", "SystemAdmin"]}
                  allowedMemberTypes={["A"]}
                >
                  <AdminVolunteerAvailability />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/pstudyware/admin/time-sheet-tracking"
              element={
                <RoleProtectedRoute
                  allowedRoles={["Admin", "SystemAdmin"]}
                  allowedMemberTypes={["A"]}
                >
                  <TimeSheetTracking />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/pstudyware/admin/user-tracking"
              element={
                <RoleProtectedRoute
                  allowedRoles={["Admin", "SystemAdmin"]}
                  allowedMemberTypes={["A"]}
                >
                  <AdminUserTracking />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/admin/user-tracking"
              element={
                <RoleProtectedRoute
                  allowedRoles={["Admin", "SystemAdmin"]}
                  allowedMemberTypes={["A"]}
                >
                  <AdminUserTracking />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/admin/time-sheet-tracking"
              element={
                <RoleProtectedRoute
                  allowedRoles={["Admin", "SystemAdmin"]}
                  allowedMemberTypes={["A"]}
                >
                  <TimeSheetTracking />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/pstudyware/admin/special-events-registration"
              element={
                <RoleProtectedRoute
                  allowedRoles={["Admin", "SystemAdmin"]}
                  allowedMemberTypes={["A"]}
                >
                  <SpecialEventsRegistration />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/admin/special-events-registration"
              element={
                <RoleProtectedRoute
                  allowedRoles={["Admin", "SystemAdmin"]}
                  allowedMemberTypes={["A"]}
                >
                  <SpecialEventsRegistration />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/pstudyware/admin/post-message"
              element={
                <RoleProtectedRoute
                  allowedRoles={["Admin", "SystemAdmin"]}
                  allowedMemberTypes={["A"]}
                >
                  <PostMessage />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/admin/post-message"
              element={
                <RoleProtectedRoute
                  allowedRoles={["Admin", "SystemAdmin"]}
                  allowedMemberTypes={["A"]}
                >
                  <PostMessage />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/pstudyware/admin/upload-answer-key"
              element={
                <RoleProtectedRoute
                  allowedRoles={["Admin", "SystemAdmin"]}
                  allowedMemberTypes={["A"]}
                >
                  <UploadAnswerKey />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/admin/upload-answer-key"
              element={
                <RoleProtectedRoute
                  allowedRoles={["Admin", "SystemAdmin"]}
                  allowedMemberTypes={["A"]}
                >
                  <UploadAnswerKey />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/pstudyware/admin/update-lookup-semester"
              element={
                <RoleProtectedRoute
                  allowedRoles={["Admin", "SystemAdmin"]}
                  allowedMemberTypes={["A"]}
                >
                  <UpdateLookupSemester />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/admin/update-lookup-semester"
              element={
                <RoleProtectedRoute
                  allowedRoles={["Admin", "SystemAdmin"]}
                  allowedMemberTypes={["A"]}
                >
                  <UpdateLookupSemester />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/pstudyware/admin/report-card"
              element={
                <RoleProtectedRoute
                  allowedRoles={["Admin", "SystemAdmin", "Instructor"]}
                  allowedMemberTypes={["A", "I"]}
                >
                  <AdminReportCard />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/admin/report-card"
              element={
                <RoleProtectedRoute
                  allowedRoles={["Admin", "SystemAdmin", "Instructor"]}
                  allowedMemberTypes={["A", "I"]}
                >
                  <AdminReportCard />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/admin/registeredstudentlist"
              element={
                <RoleProtectedRoute
                  allowedRoles={["Admin", "SystemAdmin"]}
                  allowedMemberTypes={["A"]}
                >
                  <RegisteredStudentList />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/admin/students"
              element={<Navigate to="/admin/registeredstudentlist" replace />}
            />
            <Route
              path="/admin/instructor"
              element={
                <RoleProtectedRoute
                  allowedRoles={["Admin", "SystemAdmin"]}
                  allowedMemberTypes={["A"]}
                >
                  <AdminInstructors />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/admin/instructors"
              element={<Navigate to="/admin/instructor" replace />}
            />
            <Route
              path="/admin/volunteers"
              element={
                <RoleProtectedRoute
                  allowedRoles={["Admin", "SystemAdmin"]}
                  allowedMemberTypes={["A"]}
                >
                  <AdminVolunteers />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <RoleProtectedRoute
                  allowedRoles={["Admin", "SystemAdmin"]}
                  allowedMemberTypes={["A"]}
                >
                  <AdminReports />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <RoleProtectedRoute
                  allowedRoles={["Admin", "SystemAdmin"]}
                  allowedMemberTypes={["A"]}
                >
                  <AdminSettings />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/admin/change-password"
              element={
                <RoleProtectedRoute
                  allowedRoles={["Admin", "SystemAdmin"]}
                  allowedMemberTypes={["A"]}
                >
                  <AdminChangePassword />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/admin/message-center"
              element={
                <RoleProtectedRoute
                  allowedRoles={["Admin", "SystemAdmin"]}
                  allowedMemberTypes={["A"]}
                >
                  <EmailManager />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/pstudyware/admin/class-material"
              element={
                <RoleProtectedRoute
                  allowedRoles={["Admin", "SystemAdmin"]}
                  allowedMemberTypes={["A"]}
                >
                  <Documents />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/pstudyware/admin/message-center"
              element={
                <RoleProtectedRoute
                  allowedRoles={["Admin", "SystemAdmin"]}
                  allowedMemberTypes={["A"]}
                >
                  <EmailManager />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/pstudyware/admin/meeting-details"
              element={
                <RoleProtectedRoute
                  allowedRoles={["Admin", "SystemAdmin"]}
                  allowedMemberTypes={["A"]}
                >
                  <MeetingDetails />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/pstudyware/admin/update-password"
              element={
                <RoleProtectedRoute
                  allowedRoles={["Admin", "SystemAdmin"]}
                  allowedMemberTypes={["A"]}
                >
                  <AdminChangePassword />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/pstudyware/admin/docs-repository"
              element={
                <RoleProtectedRoute
                  allowedRoles={["Admin", "SystemAdmin"]}
                  allowedMemberTypes={["A"]}
                >
                  <DocumentsRepository />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/pstudyware/admin/student-docs"
              element={
                <RoleProtectedRoute
                  allowedRoles={["Admin", "SystemAdmin"]}
                  allowedMemberTypes={["A"]}
                >
                  <StudentDocuments />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/admin/student-docs"
              element={
                <Navigate to="/pstudyware/admin/student-docs" replace />
              }
            />

            {/* Instructor routes — one layout so InstructorHeader appears on every page */}
            <Route
              path="/pstudyware/instructor"
              element={
                <RoleProtectedRoute
                  allowedRoles={["Instructor"]}
                  allowedMemberTypes={["I", "C"]}
                >
                  <InstructorShell />
                </RoleProtectedRoute>
              }
            >
              <Route
                index
                element={
                  <Navigate to="/pstudyware/instructor/dashboard" replace />
                }
              />
              <Route path="dashboard" element={<InstructorDashboard />} />
              <Route path="class-material" element={<Documents />} />
              <Route path="student-documents" element={<StudentDocuments />} />
              <Route path="report-card" element={<AdminReportCard />} />
              <Route path="message-center" element={<EmailManager />} />
              <Route path="update-password" element={<UpdatePassword />} />
            </Route>

            {/* Volunteer Routes */}
            <Route
              path="/pstudyware/volunteer/dashboard"
              element={
                <RoleProtectedRoute
                  allowedRoles={["Volunteer"]}
                  allowedMemberTypes={["V"]}
                >
                  <VolunteerShell>
                    <VolunteerDashboard />
                  </VolunteerShell>
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/pstudyware/volunteer/time-sheet"
              element={
                <RoleProtectedRoute
                  allowedRoles={["Volunteer"]}
                  allowedMemberTypes={["V"]}
                >
                  <VolunteerShell>
                    <VolunteerTimeSheet />
                  </VolunteerShell>
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/pstudyware/volunteer/message-center"
              element={
                <RoleProtectedRoute
                  allowedRoles={["Volunteer"]}
                  allowedMemberTypes={["V"]}
                >
                  <VolunteerShell>
                    <EmailManager />
                  </VolunteerShell>
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/pstudyware/volunteer/update-password"
              element={
                <RoleProtectedRoute
                  allowedRoles={["Volunteer"]}
                  allowedMemberTypes={["V"]}
                >
                  <VolunteerShell>
                    <UpdatePassword />
                  </VolunteerShell>
                </RoleProtectedRoute>
              }
            />

            {/* Common Routes (accessible by all authenticated users) */}
            <Route
              path="/pstudyware/emailmanager"
              element={
                <ProtectedRoute>
                  <EmailManager />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pstudyware/sentemail"
              element={
                <ProtectedRoute>
                  <SentEmail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/message-center/sent"
              element={
                <ProtectedRoute>
                  <SentEmail />
                </ProtectedRoute>
              }
            />

            {/* 404 route for unmatched paths */}
            <Route
              path="*"
              element={
                <div
                  style={{
                    textAlign: "center",
                    padding: "50px 20px",
                    minHeight: "60vh",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <h1>404 - Page Not Found</h1>
                  <p>The page you are looking for does not exist.</p>
                  <a
                    href="/"
                    style={{
                      color: "#007bff",
                      textDecoration: "none",
                      marginTop: "20px",
                      padding: "10px 20px",
                      border: "1px solid #007bff",
                      borderRadius: "5px",
                    }}
                  >
                    Go Back Home
                  </a>
                </div>
              }
            />
          </Routes>
        </AppLayout>
      </AuthProvider>
    </Router>
  );
};

export default AppRoutes;
