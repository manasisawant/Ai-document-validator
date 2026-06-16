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
        background: "linear-gradient(to bottom right, #dbe4f0, #edf2f7)",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <Sidebar />

      <div style={{ flex: 1 }}>
        <Navbar />
       
        <div style={{ padding: "45px" }}>
          <DashboardCards />

          <UploadSection />

          <Loading />
        </div>
      </div>
    </div>
  );
}

export default App;