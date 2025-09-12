import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./index.css";
import './App.css';
import LandingPage from "./pages/LandingPage";

import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import Dashboard from "./pages/Dashboard";
import GroupsPage from "./pages/GroupPage";
import GroupDetailsPage from "./pages/Groups/GroupDetailPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page Route */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
         <Route path="/groups" element={<GroupsPage />} /> 
        <Route path="/groups/:id" element={<GroupDetailsPage />} /> 
      </Routes>
    </Router>
  );
}

export default App;
