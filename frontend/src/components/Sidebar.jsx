import { Link } from "react-router-dom";
import {
  FiHome,
  FiUpload,
  FiFileText,
  FiBarChart2,
} from "react-icons/fi";

function Sidebar() {
  return (
    <div
      style={{
        width: "220px",
        height: "100vh",
        background: "linear-gradient(to bottom, #111827, #1e3a8a)",
        color: "white",
        padding: "30px 20px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h2 style={{ marginBottom: "40px" }}>
        AI Validator
      </h2>

      <ul
        style={{
          listStyle: "none",
          padding: 0,
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <MenuItem
          to="/dashboard"
          icon={<FiHome />}
          text="Dashboard"
        />

        <MenuItem
          to="/upload"
          icon={<FiUpload />}
          text="Upload"
        />

        <MenuItem
          to="/reports"
          icon={<FiFileText />}
          text="Reports"
        />

        <MenuItem
          to="/analytics"
          icon={<FiBarChart2 />}
          text="Analytics"
        />
      </ul>
    </div>
  );
}

function MenuItem({ to, icon, text }) {
  return (
    <li
      style={menuStyle}
      onMouseOver={(e) =>
        (e.currentTarget.style.background = "#374151")
      }
      onMouseOut={(e) =>
        (e.currentTarget.style.background = "#1f2937")
      }
    >
      <Link
        to={to}
        style={{
          textDecoration: "none",
          color: "white",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          width: "100%",
          height: "100%",
        }}
      >
        {icon}
        <span>{text}</span>
      </Link>
    </li>
  );
}

const menuStyle = {
  padding: "16px",
  borderRadius: "10px",
  cursor: "pointer",
  background: "#1f2937",
  transition: "0.3s",
  display: "flex",
  alignItems: "center",
  boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
};

export default Sidebar;