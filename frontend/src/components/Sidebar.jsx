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
      <h2 style={{ marginBottom: "40px", color: "white"}}>
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
        <li style={menuStyle}
        onMouseOver={(e) =>
        (e.target.style.background = "#374151")
        }
        onMouseOut={(e) =>
        (e.target.style.background = "#1f2937")
        }
        >
          <FiHome />
          Dashboard
        </li>
        <li style={menuStyle}
        onMouseOver={(e) =>
          (e.target.style.background = "#374151")
        }
        onMouseOut={(e) =>
        (e.target.style.background = "#1f2937")
        }
        >
          <FiUpload />
          Upload
        </li>
        <li style={menuStyle}
        onMouseOver={(e) =>
        (e.target.style.background = "#374151")
        }
        onMouseOut={(e) =>
        (e.target.style.background ="#1f2937")
        }
      >
        <FiFileText />
        Reports
        </li>
        <li 
        style={menuStyle}
        onMouseOver={(e) =>
        (e.target.style.background = "#374151")
        }
        onMouseOut={(e) =>
        (e.target.style.background = "#1f2937")
        }
        >
          <FiBarChart2 />
          Analytics
          </li>
      </ul>
    </div>
  );
}

const menuStyle = {
  padding: "16px",
  borderRadius: "8px",
  cursor: "pointer",
  background: "#2563eb",
  transition: "0.3s",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  boxShadow: "4px 0 20px rgba(0,0,0,0.2)",
};

export default Sidebar;