function DashboardCards() {
  return (
    <div
      style={{
        display: "flex",
        gap: "30px",
        marginTop: "20px",
      }}
    >
      <Card title="📄 Total Validations" value="120" background="linear-gradient(135deg, #2563eb, #60a5fa)" />
      <Card title="✅ Accuracy %" value="96%" background="linear-gradient(135deg, #059669, #34d399)" />
      <Card title="⚠️ Mismatches" value="8" background="linear-gradient(135deg, #dc2626, #f87171)" />
    </div>
  );
}
  function Card({ title, value, background }) {
  return (
    <div
      style={{
  background: background,
  color: "white",
  padding: "28px",
  borderRadius: "22px",
  width: "220px",

  backgroundSize: "200% 200%",

  boxShadow:
    "0 10px 25px rgba(0,0,0,0.15)",

  border:
    "1px solid rgba(255,255,255,0.2)",

  backdropFilter: "blur(12px)",

  transition: "all 0.35s ease",

  cursor: "pointer",

  position: "relative",

  overflow: "hidden",
}}
      onMouseOver={(e) =>
        (e.currentTarget.style.transform = "translate(-8px)")
      }
      onMouseOut={(e) =>
        (e.currentTarget.style.transform = "translateY(0px)")
      }
    >
      <h4
       style={{
  color: "rgba(255,255,255,0.9)",
  fontSize: "15px",
  marginBottom: "18px",
  fontWeight: "500",
  letterSpacing: "0.5px",
}} 
      >
        {title}
      </h4>

      <h2
        style={{
  fontSize: "48px",
  color: "white",
  fontWeight: "700",
  margin: 0,
}}
      >
        {value}
      </h2>
    </div>
  );
}

export default DashboardCards;