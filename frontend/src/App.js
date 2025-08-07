import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import LoggedInHome from "./pages/LoggedInHome";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import ChatUser from "./pages/ChatUser";
import Contact from "./pages/Contact";
import Features from "./pages/Features";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UploadDocuments from "./pages/UploadDocuments";
import KnowledgeBase from "./pages/KnowledgeBase";
import Users from "./pages/Users";
import Activity from "./pages/Activity";
import Settings from "./pages/Settings";
import "./styles/common.css";
import "./styles/DarkTheme.css";
import "./App.css";
import KnowledgeChat from "./pages/KnowledgeChat";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import TermsOfService from "./pages/Terms";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import { ThemeProvider } from "./context/ThemeContext";

// Super Admin imports
import Overview from "./pages/SuperAdmin/Overview";
import Tenants from "./pages/SuperAdmin/Tenants";
import TenantDetails from "./pages/SuperAdmin/TenantDetails";
import Payments from "./pages/SuperAdmin/Payments";
import Analytics from "./pages/SuperAdmin/Analytics";

// Auth utilities
import PrivateRoute from "./components/privateRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <ThemeProvider>
      <div className="App">
        <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/home-old" element={<Home />} />
        <Route path="/features" element={<Features />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/reset" element={<ResetPassword />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />

        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <LoggedInHome />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
        <Route
          path="/chatuser"
          element={
            <PrivateRoute>
              <ChatUser />
            </PrivateRoute>
          }
        />
        <Route
          path="/upload-documents"
          element={
            <PrivateRoute>
              <UploadDocuments />
            </PrivateRoute>
          }
        />
        <Route
          path="/knowledge-base"
          element={
            <PrivateRoute>
              <KnowledgeBase />
            </PrivateRoute>
          }
        />
        <Route
          path="/KnowledgeChat"
          element={
            <PrivateRoute>
              <KnowledgeChat />
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <Users />
            </PrivateRoute>
          }
        />
        <Route
          path="/activity"
          element={
            <PrivateRoute>
              <Activity />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />

        {/* Super Admin Protected Routes */}
        <Route
          path="/super-admin/overview"
          element={
            <PrivateRoute>
              <Overview />
            </PrivateRoute>
          }
        />
        <Route
          path="/super-admin/tenants"
          element={
            <PrivateRoute>
              <Tenants />
            </PrivateRoute>
          }
        />
        <Route
          path="/super-admin/tenant-details/:tenantId"
          element={
            <PrivateRoute>
              <TenantDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/super-admin/payments"
          element={
            <PrivateRoute>
              <Payments />
            </PrivateRoute>
          }
        />
        <Route
          path="/super-admin/analytics"
          element={
            <PrivateRoute>
              <Analytics />
            </PrivateRoute>
          }
        />
      </Routes>
      <ToastContainer />
      </div>
    </ThemeProvider>
  );
}

export default App;
