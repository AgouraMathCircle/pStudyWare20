import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./src/contexts/AuthContext";
import AppLayout from "./src/components/AppLayout";
import Home from "./src/components/Home";
import Overview from "./src/components/Overview";
import About from "./src/components/About";
import MathCircle from "./src/components/MathCircle";
import EngineeringCircle from "./src/components/EngineeringCircle";
import TestPreparation from "./src/components/TestPreparation";
import Contact from "./src/components/Contact";
import Gallery from "./src/components/Gallery";
import Donate from "./src/components/Donate";
import StudentRegistration from "./src/components/StudentRegistration";
import VolunteerRegistration from "./src/components/VolunteerRegistration";
import FAQ from "./src/components/FAQ";
import Resources from "./src/components/Resources";
import Login from "./src/components/Login";
import ProtectedRoute from "./src/components/ProtectedRoute";
import RoleProtectedRoute from "./src/components/RoleProtectedRoute";
import StudentDashboard from "./src/components/pstudyware/Student/StudentDashboard";
import ClassMaterial from "./src/components/pstudyware/Student/ClassMaterial";
import UpdateProfile from "./src/components/pstudyware/Student/UpdateProfile";
import StudentDocuments from "./src/components/pstudyware/Student/StudentDocuments";
import OnlineExam from "./src/components/pstudyware/Student/OnlineExam";
import ReportCard from "./src/components/pstudyware/Student/ReportCard";
import AdminDashboard from "./src/components/pstudyware/Admin/AdminDashboard";
import AdminStudents from "./src/components/pstudyware/Admin/AdminStudents";
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
import SentEmail from "./src/components/pstudyware/Common/SentEmail";
import {
  DocumentsRepository,
  EmailManager,
  MeetingDetails,
  UpdatePassword,
} from "./src/components/pstudyware/Common";

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
            <Route
              path="/about/test-preparation"
              element={<TestPreparation />}
            />
            <Route path="/contact" element={<Contact />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/donate" element={<Donate />} />
            <Route
              path="/studentregistration"
              element={<StudentRegistration />}
            />
            <Route
              path="/volunteerregistration"
              element={<VolunteerRegistration />}
            />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/resources" element={<Resources />} />
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
                  <OnlineExam />
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
                  <OnlineExam />
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
                <ProtectedRoute>
                  <EmailManager />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pstudyware/student/update-password"
              element={
                <RoleProtectedRoute
                  allowedRoles={["Student"]}
                  allowedMemberTypes={["S"]}
                >
                  <UpdatePassword />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/student/updateprofile/:studentId"
              element={
                <RoleProtectedRoute
                  allowedRoles={["Student"]}
                  allowedMemberTypes={["S"]}
                >
                  <UpdateProfile />
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
              path="/pstudyware/admin/instructors"
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
              path="/pstudyware/admin/students"
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
              element={
                <RoleProtectedRoute
                  allowedRoles={["Admin", "SystemAdmin"]}
                  allowedMemberTypes={["A"]}
                >
                  <AdminStudents />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/admin/instructors"
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
                  <UpdatePassword />
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

            {/* Instructor Routes */}
            <Route
              path="/pstudyware/instructor/message-center"
              element={
                <RoleProtectedRoute
                  allowedRoles={["Instructor"]}
                  allowedMemberTypes={["I"]}
                >
                  <EmailManager />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/pstudyware/instructor/update-password"
              element={
                <RoleProtectedRoute
                  allowedRoles={["Instructor"]}
                  allowedMemberTypes={["I"]}
                >
                  <UpdatePassword />
                </RoleProtectedRoute>
              }
            />

            {/* Volunteer Routes */}
            <Route
              path="/pstudyware/volunteer/message-center"
              element={
                <RoleProtectedRoute
                  allowedRoles={["Volunteer"]}
                  allowedMemberTypes={["V"]}
                >
                  <EmailManager />
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
                  <UpdatePassword />
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
