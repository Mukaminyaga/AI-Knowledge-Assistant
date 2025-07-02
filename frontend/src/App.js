import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import Settings from "./pages/Settings";
import "./styles/common.css";
import "./App.css";
import KnowledgeChat from "./pages/KnowledgeChat";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// Super Admin imports
import Overview from "./pages/SuperAdmin/Overview";
import Tenants from "./pages/SuperAdmin/Tenants";
import Payments from "./pages/SuperAdmin/Payments";
import Analytics from "./pages/SuperAdmin/Analytics";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<LoggedInHome />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/upload-documents" element={<UploadDocuments />} />
          <Route path="/knowledge-base" element={<KnowledgeBase />} />
          <Route path="/KnowledgeChat" element={<KnowledgeChat />} />
          <Route path="/chatuser" element={<ChatUser />} />
          <Route path="/features" element={<Features />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/users" element={<Users />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/reset" element={<ResetPassword />} />

          {/* Super Admin Routes */}
          <Route path="/super-admin/overview" element={<Overview />} />
          <Route path="/super-admin/tenants" element={<Tenants />} />
          <Route path="/super-admin/payments" element={<Payments />} />
          <Route path="/super-admin/analytics" element={<Analytics />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
