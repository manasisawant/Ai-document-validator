function Sidebar() {
  return (
    <div style={{
      width: "220px",
      height: "100vh",
      background: "#111827",
      color: "white",
      padding: "20px"
    }}>
      <h2>Dashboard</h2>

      <ul style={{ listStyle: "none", padding: 0 }}>
        <li>Upload</li>
        <li>Reports</li>
        <li>Analytics</li>
      </ul>
    </div>
  );
}

export default Sidebar;