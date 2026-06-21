import { useLocation } from "react-router-dom";
function Navbar() {
  const location = useLocation();
  let pageTitle = "Dashboard";

if (location.pathname === "/upload") {
  pageTitle = "Upload";
}

if (location.pathname === "/reports") {
  pageTitle = "Reports";
}

if (location.pathname === "/analytics") {
  pageTitle = "Analytics";
}
  return (
    <div
      style={{
        height: "70px",
        background: "rgba(255,255,255,0.8)",
        backdropFilter: "blur(8px)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 30px",
        borderBottom: "1px solid #ddd",
      }}
    >
      <h2>{pageTitle}</h2>

      <div
        style={{
          width: "42px",
          height: "42px",
          borderRadius: "50%",
          background: "#111827",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color:"white",
          fontWeight:"bold",
        }}
      >
        M
      </div>
    </div>
  );
}

export default Navbar;