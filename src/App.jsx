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
import SettlementPage from "./pages/SettlementPage";
import ExpensePage from "./pages/ExpensePage";
import SettingPage from "./pages/SettingPage";
import FriendsPage from "./pages/FriendsPage";
import Layout from "./components/Common/Layout";
import ReportsPage from "./pages/ReportsPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page Route */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
         <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="friends" element={<FriendsPage />} />
          <Route path="groups" element={<GroupsPage />} />
          <Route path="groups/:id" element={<GroupDetailsPage />} />
          <Route path="expenses" element={<ExpensePage />} />
          <Route path="settlements" element={<SettlementPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
