import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import Dashboard from "./src/components/Dashboard";
import ProtectedRoute from "./src/components/ProtectedRoute";
import ApiTest from "./src/components/ApiTest";
import StudentDashboard from "./src/components/student/StudentDashboard";

// Import other page components (you can create these later)
// import Contact from './src/components/Contact';
// import Courses from './src/components/Courses';
// import Services from './src/components/Services';

const AppRoutes = () => {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about/overview" element={<Overview />} />
          <Route path="/about/math-circle" element={<MathCircle />} />
          <Route
            path="/about/engineering-circle"
            element={<EngineeringCircle />}
          />
          <Route path="/about/test-preparation" element={<TestPreparation />} />
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
          <Route path="/api-test" element={<ApiTest />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Student Routes */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/class-material"
            element={
              <ProtectedRoute>
                <div style={{ padding: "50px 20px", textAlign: "center" }}>
                  <h1>Class Material</h1>
                  <p>Class material page coming soon...</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/update-score"
            element={
              <ProtectedRoute>
                <div style={{ padding: "50px 20px", textAlign: "center" }}>
                  <h1>Update Score</h1>
                  <p>Update score page coming soon...</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/upload-documents"
            element={
              <ProtectedRoute>
                <div style={{ padding: "50px 20px", textAlign: "center" }}>
                  <h1>Upload Documents</h1>
                  <p>Upload documents page coming soon...</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/report-card"
            element={
              <ProtectedRoute>
                <div style={{ padding: "50px 20px", textAlign: "center" }}>
                  <h1>Report Card</h1>
                  <p>Report card page coming soon...</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/message-center"
            element={
              <ProtectedRoute>
                <div style={{ padding: "50px 20px", textAlign: "center" }}>
                  <h1>Message Center</h1>
                  <p>Message center page coming soon...</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/change-password"
            element={
              <ProtectedRoute>
                <div style={{ padding: "50px 20px", textAlign: "center" }}>
                  <h1>Change Password</h1>
                  <p>Change password page coming soon...</p>
                </div>
              </ProtectedRoute>
            }
          />

          {/* Add more routes as you create the components */}
          {/* <Route path="/contact" element={<Contact />} /> */}
          {/* <Route path="/courses" element={<Courses />} /> */}
          {/* <Route path="/services" element={<Services />} /> */}

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
    </Router>
  );
};

export default AppRoutes;
