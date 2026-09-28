import { Routes, Route } from "react-router-dom";

// Public pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// Application pages
import DashboardPage from "./pages/DashboardPage";
import UploadPage from "./pages/UploadPage";
import ReportsPage from "./pages/ReportsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ValidationHistoryPage from "./pages/ValidationHistoryPage";
import ValidationReportPage from "./pages/ValidationReportPage";
import ProfilePage from "./pages/ProfilePage";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import "./DashboardLayout.css";

function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-main">
        <Navbar />

        <main className="dashboard-content">
          <Routes>
            <Route
              path="/dashboard"
              element={<DashboardPage />}
            />

            <Route
              path="/upload"
              element={<UploadPage />}
            />

            <Route
              path="/reports"
              element={<ReportsPage />}
            />

            <Route
              path="/analytics"
              element={<AnalyticsPage />}
            />

            <Route
              path="/history"
              element={<ValidationHistoryPage />}
            />

            <Route
              path="/history/:id"
              element={<ValidationReportPage />}
            />

            <Route
              path="/profile"
              element={<ProfilePage />}
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      {/* Public pages */}
      <Route
        path="/"
        element={<HomePage />}
      />

      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route
        path="/register"
        element={<RegisterPage />}
      />

      {/* Application */}
      <Route
        path="/*"
        element={<DashboardLayout />}
      />
    </Routes>
  );
}

export default App;