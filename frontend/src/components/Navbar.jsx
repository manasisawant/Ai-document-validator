function Navbar() {
  return (
    <div
      style={{
        height: "70px",
        background: "rgba(255,255,255,0.8)",
        backdropFilter: "Blur(8px)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 30px",
        borderBottom: "1px solid #ddd",
      }}
    >
      <h2>Dashboard</h2>

      <div
        style={{
          width: "42px",
          height: "42px",
          borderRadius: "50%",
          background: "#111827",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color:"while",
          fontweight:"bold",
        }}
      >
        M
      </div>
    </div>
  );
}

export default Navbar;