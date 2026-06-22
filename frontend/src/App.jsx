import { Routes,Route } from "react-router-dom";

import DashboardPage from "./pages/DashboardPage";
import UploadPage from "./pages/UploadPage";
import ReportsPage from "./pages/ReportsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import DashboardCards from "./components/DashboardCards";
import UploadSection from "./components/UploadSection";
import Loading from "./components/Loading";



function App() {
  return (
    <div
      style={{
        display: "flex",
        background: "linear-gradient(135deg, #d8e6f7, #edf3fb, #dce7f5)",
        minHeight: "100vh",
        maxWidth: "1200px",
        margin: "0 auto",
        backgroundImage: "radial-gradient(circle at top right, rgba(255,255,255,0.3), transparent 35%)",
      }}
    >
      <Sidebar />

      <div style={{ flex: 1 }}>
        <Navbar />
       
        <div style={{ padding: "45px"}}>
          <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;