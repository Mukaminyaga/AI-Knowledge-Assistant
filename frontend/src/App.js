import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LoggedInHome from "./pages/LoggedInHome";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";

import Contact from "./pages/Contact";
import Features from "./pages/Features";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UploadDocuments from "./pages/UploadDocuments";
import KnowledgeBase from "./pages/KnowledgeBase";
import Users from "./pages/Users";
import "./styles/common.css";
import "./App.css";


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
          <Route path="/features" element={<Features />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
